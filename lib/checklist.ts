import { useSyncExternalStore } from "react";
import { hojeBelemISO } from "@/lib/formato";

export { ETAPAS, etapaPorSlug, resumir } from "@/lib/checklist-shared";
export type { SlugEtapa, ItemChecklist, ResumoEtapa } from "@/lib/checklist-shared";

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
