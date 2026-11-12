import { criarClienteServidor } from "@/lib/supabase/server";
import { ETAPAS, type ItemChecklist, type SlugEtapa } from "@/lib/checklist-shared";

type Linha = { etapa: string; ordem: number; descricao: string; motivo: string };

export async function lerChecklist(): Promise<ItemChecklist[] | null> {
  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.from("checklist_itens").select("etapa, ordem, descricao, motivo");
  if (error || !data) return null;
  const posicao = (s: string) => ETAPAS.findIndex((e) => e.slug === s);
  return (data as unknown as Linha[])
    .filter((l) => posicao(l.etapa) >= 0)
    .sort((a, b) => posicao(a.etapa) - posicao(b.etapa) || a.ordem - b.ordem)
    .map((l) => ({
      chave: `${l.etapa}-${l.ordem}`,
      etapa: l.etapa as SlugEtapa,
      ordem: l.ordem,
      descricao: l.descricao,
      motivo: l.motivo,
    }));
}
