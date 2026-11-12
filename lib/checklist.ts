import { useSyncExternalStore } from "react";
import { hojeBelemISO } from "@/lib/formato";

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

// Progresso do dia no aparelho (D-004). Chave por data de Belém; dias anteriores são apagados ao salvar.
const PREFIXO = "checklist-";
const VAZIO: string[] = [];
const ouvintes = new Set<() => void>();
let memoria: string | null = null; // sem localStorage (modo privado), o progresso fica só nesta visita
let cache: { bruto: string | null; lista: string[] } = { bruto: null, lista: VAZIO };

function chaveDoDia(): string {
  return PREFIXO + hojeBelemISO();
}

function lerBruto(): string | null {
  try {
    return localStorage.getItem(chaveDoDia());
  } catch {
    return memoria;
  }
}

function gravarBruto(valor: string): void {
  memoria = valor;
  try {
    const atual = chaveDoDia();
    localStorage.setItem(atual, valor);
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIXO) && k !== atual) localStorage.removeItem(k);
    }
  } catch {
    // segue com a memória
  }
}

function instantaneo(): string[] {
  const bruto = lerBruto();
  if (bruto !== cache.bruto) {
    let lista: string[] = VAZIO;
    try {
      const v = bruto ? JSON.parse(bruto) : [];
      lista = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : VAZIO;
    } catch {
      lista = VAZIO;
    }
    cache = { bruto, lista };
  }
  return cache.lista;
}

function assinar(aviso: () => void) {
  ouvintes.add(aviso);
  window.addEventListener("storage", aviso);
  return () => {
    ouvintes.delete(aviso);
    window.removeEventListener("storage", aviso);
  };
}

export function useMarcados() {
  const marcados = useSyncExternalStore(assinar, instantaneo, () => VAZIO);
  function alternar(chave: string) {
    const atual = instantaneo();
    const novo = atual.includes(chave) ? atual.filter((c) => c !== chave) : [...atual, chave];
    gravarBruto(JSON.stringify(novo));
    ouvintes.forEach((f) => f());
  }
  return { marcados, alternar };
}
