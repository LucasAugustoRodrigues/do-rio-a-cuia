import { criarClienteServidor } from "@/lib/supabase/server";

export type Unidade = "rasa" | "lata";
export type Qualidade = "boa" | "media" | "fraca";
export type PrecoEnviado = { id: string; valorRasa: number; unidade: Unidade; emRevisao: boolean; registradoEm: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function lerPrecoProprio(id: string | undefined): Promise<PrecoEnviado | null> {
  if (!id || !UUID.test(id)) return null;
  const supabase = await criarClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("precos")
    .select("id, valor_rasa, unidade, em_revisao, registrado_em")
    .eq("id", id)
    .eq("usuario_id", user.id)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    valorRasa: Number(data.valor_rasa),
    unidade: data.unidade,
    emRevisao: data.em_revisao,
    registradoEm: data.registrado_em,
  };
}
