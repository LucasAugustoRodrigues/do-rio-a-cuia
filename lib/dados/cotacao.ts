import { criarClienteServidor } from "@/lib/supabase/server";
import { diaISOMenos, hojeBelemISO } from "@/lib/formato";

export type DiaCotacao = { dia: string; media: number; minimo: number; maximo: number; qtd: number; atualizadoEm: string };
export type PontoHistorico = { dia: string; media: number | null };
export type Cotacao = { hoje: DiaCotacao | null; ontem: DiaCotacao | null; ultimo: DiaCotacao | null; variacao: number | null; historico: PontoHistorico[] };

type Linha = {
  dia: string;
  media: number | string;
  minimo: number | string;
  maximo: number | string;
  qtd_registros: number | string;
  atualizado_em: string;
};

const COLUNAS = "dia, media, minimo, maximo, qtd_registros, atualizado_em";

function paraDia(l: Linha): DiaCotacao {
  return {
    dia: l.dia,
    media: Number(l.media),
    minimo: Number(l.minimo),
    maximo: Number(l.maximo),
    qtd: Number(l.qtd_registros),
    atualizadoEm: l.atualizado_em,
  };
}

export async function lerCotacao(): Promise<Cotacao | null> {
  const supabase = await criarClienteServidor();
  const hoje = hojeBelemISO();
  const [periodo, ultimoRes] = await Promise.all([
    supabase.from("v_cotacao_dia").select(COLUNAS).gte("dia", diaISOMenos(hoje, 29)).lte("dia", hoje).order("dia"),
    supabase.from("v_cotacao_dia").select(COLUNAS).lte("dia", hoje).order("dia", { ascending: false }).limit(1),
  ]);
  if (periodo.error || ultimoRes.error) return null;
  const dias = new Map((periodo.data as unknown as Linha[]).map((l) => [l.dia, paraDia(l)]));
  const hojeDia = dias.get(hoje) ?? null;
  const ontemDia = dias.get(diaISOMenos(hoje, 1)) ?? null;
  const ultimaLinha = (ultimoRes.data as unknown as Linha[])[0];
  const variacao =
    hojeDia && ontemDia && ontemDia.media > 0 ? ((hojeDia.media - ontemDia.media) / ontemDia.media) * 100 : null;
  const historico = Array.from({ length: 30 }, (_, i) => {
    const dia = diaISOMenos(hoje, 29 - i);
    return { dia, media: dias.get(dia)?.media ?? null };
  });
  return { hoje: hojeDia, ontem: ontemDia, ultimo: ultimaLinha ? paraDia(ultimaLinha) : null, variacao, historico };
}
