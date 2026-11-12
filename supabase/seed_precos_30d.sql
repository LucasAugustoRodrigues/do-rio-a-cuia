-- Do Rio à Cuia | Histórico de 30 dias para a demonstração (D-026)
-- Rodar UMA vez no SQL Editor, depois do pr3_precos.sql. Grava de hoje - 30 a hoje - 1 (sem o dia de hoje).
-- No SQL Editor o usuário é postgres, então o gatilho precos_a_normaliza mantém as datas passadas (D-025).
do $$
begin
  if (select count(*) from auth.users
      where email in ('dorioacuia.app+5591900000001@gmail.com',
                      'dorioacuia.app+5591900000002@gmail.com')) <> 2 then
    raise exception 'Contas 0001 e 0002 não encontradas (D-022)';
  end if;
end $$;

select setseed(0.42);

insert into precos (usuario_id, unidade, valor, qualidade, registrado_em)
select
  case when n % 2 = 0 then c.u1 else c.u2 end,
  case when n % 3 = 0 then 'lata' else 'rasa' end,
  case when n % 3 = 0 then round(v.rasa / 2, 2) else v.rasa end,
  case n % 4 when 0 then 'boa' when 1 then 'media' when 2 then null else 'fraca' end,
  ((hoje_belem() - d) + time '04:00' + n * interval '45 minutes'
     + floor(random() * 20) * interval '1 minute') at time zone 'America/Belem'
from (select (select id from auth.users where email = 'dorioacuia.app+5591900000001@gmail.com') as u1,
             (select id from auth.users where email = 'dorioacuia.app+5591900000002@gmail.com') as u2) c
cross join generate_series(1, 30) as d
cross join lateral generate_series(1, 4 + d % 4) as n
cross join lateral (select round((125 + 10 * sin(d / 4.0) + random() * 16 - 8)::numeric, 0) as rasa) v;
