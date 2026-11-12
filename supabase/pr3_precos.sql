-- Do Rio à Cuia | PR#3: R11 (D-025)
-- Pela API, registrado_em, local e em_revisao são sempre do servidor.
-- No SQL Editor (usuário postgres) os campos ficam como vierem, para o seed e para a revisão da equipe.
-- O nome começa com precos_a_ para rodar antes do precos_fora_do_padrao (o Postgres segue a ordem alfabética).
create or replace function normaliza_preco() returns trigger
language plpgsql set search_path = public as $$
begin
  if current_user not in ('postgres', 'supabase_admin') then
    new.registrado_em := now();
    new.local := 'Feira do Açaí';
    new.em_revisao := false;
  end if;
  return new;
end $$;

drop trigger if exists precos_a_normaliza on precos;
create trigger precos_a_normaliza
  before insert on precos
  for each row execute function normaliza_preco();
