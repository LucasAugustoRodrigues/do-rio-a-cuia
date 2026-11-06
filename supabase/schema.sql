-- Do Rio à Cuia | PostgreSQL (Supabase)
-- Rodar inteiro no SQL Editor de um projeto novo. Depois rodar seed.sql.
-- Ajustes de 06/11/2026: D-008 (batedor só cria selo de ponto inativo),
-- D-009 (revisão de preço só com 5+ amostras em 7 dias) e qr_slug sem pgcrypto.

-- Data de hoje em Belém (usada em todas as regras de "hoje")
create or replace function hoje_belem() returns date
language sql stable as $$ select (now() at time zone 'America/Belem')::date $$;

-- ===================== Tabelas =====================

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  papel text not null default 'comprador'
    check (papel in ('feirante','comprador','batedor','admin')),
  criado_em timestamptz not null default now()
);

create table origens (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  municipio text,
  unique (nome, municipio)
);

create table pontos_venda (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  endereco text,
  bairro text,
  municipio text not null default 'Belém'
    check (municipio in ('Belém','Ananindeua','Outro')),
  latitude numeric(9,6) not null,
  longitude numeric(9,6) not null,
  responsavel_id uuid references profiles(id) on delete set null,
  qr_slug text not null unique default substr(md5(gen_random_uuid()::text), 1, 12),
  ativo boolean not null default false,
  criado_em timestamptz not null default now()
);

create table selos (
  id uuid primary key default gen_random_uuid(),
  ponto_id uuid not null references pontos_venda(id) on delete cascade,
  orgao_emissor text not null,          -- Prefeitura de Belém | Prefeitura de Ananindeua
  programa text not null
    check (programa in ('Açaí Bom','Açaí Bom que Só')),
  numero text,
  data_emissao date not null,
  data_validade date not null,
  criado_em timestamptz not null default now(),
  check (data_validade >= data_emissao)
);

create table lotes (
  id uuid primary key default gen_random_uuid(),
  ponto_id uuid not null references pontos_venda(id) on delete cascade,
  origem_id uuid references origens(id),
  data_recebimento date not null default hoje_belem(),
  observacao text,
  registrado_por uuid references profiles(id),
  criado_em timestamptz not null default now()
);

create table precos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references profiles(id) on delete cascade,
  unidade text not null check (unidade in ('rasa','lata')),
  valor numeric(10,2) not null check (valor > 0),
  valor_rasa numeric(10,2) generated always as
    (case when unidade = 'lata' then valor * 2 else valor end) stored,
  qualidade text check (qualidade in ('boa','media','fraca')),
  local text not null default 'Feira do Açaí',
  em_revisao boolean not null default false,   -- RN04
  registrado_em timestamptz not null default now()
);

create index idx_precos_data on precos (registrado_em);
create index idx_precos_usuario on precos (usuario_id, registrado_em desc);
create index idx_selos_ponto on selos (ponto_id, data_validade desc);
create index idx_lotes_ponto on lotes (ponto_id, data_recebimento desc);

create table checklist_itens (
  id serial primary key,
  etapa text not null
    check (etapa in ('recebimento','lavagem','branqueamento','armazenamento','venda')),
  ordem int not null,
  descricao text not null,
  motivo text not null,
  fonte text,
  unique (etapa, ordem)
);

-- ===================== Funções e gatilhos =====================

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and papel = 'admin')
$$;

-- Cria o perfil no cadastro. O app envia nome e papel em options.data do signUp.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_papel text := coalesce(new.raw_user_meta_data->>'papel', 'comprador');
begin
  if v_papel not in ('feirante','comprador','batedor') then
    v_papel := 'comprador';
  end if;
  insert into profiles (id, nome, papel)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', 'Sem nome'), v_papel);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- RN04 (D-009): marca para revisão preço fora de 50%..200% da mediana dos últimos 7 dias,
-- só quando há pelo menos 5 preços aceitos nesse período (com menos, a mediana não é referência).
create or replace function marca_preco_fora_do_padrao() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_qtd int;
  v_mediana numeric;
  -- coluna gerada ainda é nula no BEFORE trigger, então calcula aqui
  v_rasa numeric := case when new.unidade = 'lata' then new.valor * 2 else new.valor end;
begin
  select count(*), percentile_cont(0.5) within group (order by valor_rasa)
    into v_qtd, v_mediana
  from precos
  where registrado_em >= now() - interval '7 days' and not em_revisao;
  if v_qtd >= 5 and
     (v_rasa < v_mediana * 0.5 or v_rasa > v_mediana * 2) then
    new.em_revisao := true;
  end if;
  return new;
end $$;

create trigger precos_fora_do_padrao
  before insert on precos
  for each row execute function marca_preco_fora_do_padrao();

-- ===================== Views públicas =====================
-- As views rodam com o dono (postgres), então leem as tabelas mesmo com RLS.
-- Elas expõem só dados agregados ou públicos.

create view v_cotacao_dia as
select (registrado_em at time zone 'America/Belem')::date as dia,
       round(avg(valor_rasa), 2) as media,
       min(valor_rasa) as minimo,
       max(valor_rasa) as maximo,
       count(*) as qtd_registros,
       max(registrado_em) as atualizado_em
from precos
where not em_revisao
group by 1;

create view v_pontos_status as
select p.id, p.nome, p.endereco, p.bairro, p.municipio,
       p.latitude, p.longitude, p.qr_slug,
       s.programa, s.orgao_emissor, s.numero, s.data_validade,
       case when s.data_validade >= hoje_belem() then 'valido' else 'vencido' end as situacao,
       o.nome as origem_lote,
       l.data_recebimento as data_lote
from pontos_venda p
left join lateral (
  select * from selos where ponto_id = p.id order by data_validade desc limit 1
) s on true
left join lateral (
  select * from lotes where ponto_id = p.id
  order by data_recebimento desc, criado_em desc limit 1
) l on true
left join origens o on o.id = l.origem_id
where p.ativo;

grant select on v_cotacao_dia, v_pontos_status to anon, authenticated;

-- ===================== RLS =====================

alter table profiles enable row level security;
alter table origens enable row level security;
alter table pontos_venda enable row level security;
alter table selos enable row level security;
alter table lotes enable row level security;
alter table precos enable row level security;
alter table checklist_itens enable row level security;

-- profiles: cada um lê o próprio; admin lê todos; usuário só altera o nome
create policy "perfil proprio" on profiles for select to authenticated
  using (id = auth.uid() or is_admin());
create policy "atualiza proprio perfil" on profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "admin gerencia perfis" on profiles for all to authenticated
  using (is_admin()) with check (is_admin());
revoke update on profiles from authenticated;
grant update (nome) on profiles to authenticated;

-- origens: leitura pública, escrita do admin e de batedores
create policy "le origens" on origens for select using (true);
create policy "cria origem" on origens for insert to authenticated
  with check (is_admin() or exists (select 1 from profiles where id = auth.uid() and papel = 'batedor'));

-- precos: ninguém lê a tabela crua, só o próprio usuário (para o perfil)
create policy "le proprios precos" on precos for select to authenticated
  using (usuario_id = auth.uid() or is_admin());
create policy "registra preco" on precos for insert to authenticated
  with check (usuario_id = auth.uid());
create policy "admin revisa precos" on precos for update to authenticated
  using (is_admin()) with check (is_admin());

-- pontos_venda: público vê ativos; batedor vê e cria os seus (inativos); admin tudo
create policy "le pontos ativos" on pontos_venda for select
  using (ativo or responsavel_id = auth.uid() or is_admin());
create policy "batedor cria ponto" on pontos_venda for insert to authenticated
  with check (responsavel_id = auth.uid() and ativo = false);
create policy "admin gerencia pontos" on pontos_venda for all to authenticated
  using (is_admin()) with check (is_admin());

-- selos: leitura pública; batedor cria selo só do próprio ponto ainda inativo (D-008);
-- com o ponto ativo, renovar o selo é com o admin
create policy "le selos" on selos for select using (true);
create policy "batedor cria selo" on selos for insert to authenticated
  with check (exists (select 1 from pontos_venda p
                      where p.id = ponto_id and p.responsavel_id = auth.uid()
                        and not p.ativo));
create policy "admin gerencia selos" on selos for all to authenticated
  using (is_admin()) with check (is_admin());

-- lotes: leitura pública; batedor registra no próprio ponto
create policy "le lotes" on lotes for select using (true);
create policy "batedor registra lote" on lotes for insert to authenticated
  with check (registrado_por = auth.uid() and exists (
    select 1 from pontos_venda p where p.id = ponto_id and p.responsavel_id = auth.uid()));
create policy "admin gerencia lotes" on lotes for all to authenticated
  using (is_admin()) with check (is_admin());

-- checklist: leitura pública, escrita do admin
create policy "le checklist" on checklist_itens for select using (true);
create policy "admin gerencia checklist" on checklist_itens for all to authenticated
  using (is_admin()) with check (is_admin());
