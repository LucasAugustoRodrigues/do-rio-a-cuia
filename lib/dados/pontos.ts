import { criarClienteServidor } from "@/lib/supabase/server";

type Linha = {
  id: string;
  nome: string;
  endereco: string | null;
  bairro: string | null;
  latitude: number | string;
  longitude: number | string;
  qr_slug: string;
  situacao: string;
  programa: string | null;
  orgao_emissor: string | null;
  data_validade: string | null;
  origem_lote: string | null;
};

const COLUNAS =
  "id, nome, endereco, bairro, latitude, longitude, qr_slug, situacao, programa, orgao_emissor, data_validade, origem_lote";

const SLUG = /^[a-z0-9-]{1,40}$/;

export type Situacao = "valido" | "vencido";

export type Ponto = {
  id: string;
  nome: string;
  endereco: string | null;
  bairro: string | null;
  latitude: number;
  longitude: number;
  slug: string;
  situacao: Situacao;
  programa: string | null;
  orgaoEmissor: string | null;
  dataValidade: string | null;
  origemLote: string | null;
};

export type ResultadoPonto = { ok: true; ponto: Ponto | null } | { ok: false };

function paraPonto(l: Linha): Ponto {
  return {
    id: l.id,
    nome: l.nome,
    endereco: l.endereco,
    bairro: l.bairro,
    latitude: Number(l.latitude),
    longitude: Number(l.longitude),
    slug: l.qr_slug,
    situacao: l.situacao === "valido" ? "valido" : "vencido",
    programa: l.programa,
    orgaoEmissor: l.orgao_emissor,
    dataValidade: l.data_validade,
    origemLote: l.origem_lote,
  };
}

export async function lerPontos(): Promise<Ponto[] | null> {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.from("v_pontos_status").select(COLUNAS).order("nome");
  if (error) return null;
  return (data as unknown as Linha[]).map(paraPonto);
}

export async function lerPontoPorSlug(slug: string): Promise<ResultadoPonto> {
  if (!SLUG.test(slug)) return { ok: true, ponto: null };
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.from("v_pontos_status").select(COLUNAS).eq("qr_slug", slug).maybeSingle();
  if (error) return { ok: false };
  return { ok: true, ponto: data ? paraPonto(data as unknown as Linha) : null };
}
