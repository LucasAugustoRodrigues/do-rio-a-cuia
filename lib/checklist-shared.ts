export const ETAPAS = [
  { slug: "recebimento", nome: "Recebimento" },
  { slug: "lavagem", nome: "Lavagem" },
  { slug: "branqueamento", nome: "Branqueamento" },
  { slug: "armazenamento", nome: "Armazenamento" },
  { slug: "venda", nome: "Venda" },
] as const;

export type SlugEtapa = (typeof ETAPAS)[number]["slug"];
export type ItemChecklist = { chave: string; etapa: SlugEtapa; ordem: number; descricao: string; motivo: string };
export type ResumoEtapa = { slug: SlugEtapa; nome: string; total: number; feitos: number; concluida: boolean };

export function etapaPorSlug(slug: string) {
  return ETAPAS.find((e) => e.slug === slug) ?? null;
}

export function resumir(itens: ItemChecklist[], marcados: string[]): ResumoEtapa[] {
  const feitos = new Set(marcados);
  return ETAPAS.map((e) => {
    const daEtapa = itens.filter((i) => i.etapa === e.slug);
    const n = daEtapa.filter((i) => feitos.has(i.chave)).length;
    return { slug: e.slug, nome: e.nome, total: daEtapa.length, feitos: n, concluida: daEtapa.length > 0 && n === daEtapa.length };
  });
}
