export type Modo = "vende" | "toma";

export const COOKIE_MODO = "modo";

export function lerModo(valor: string | undefined): Modo | null {
  return valor === "vende" || valor === "toma" ? valor : null;
}

// Use um link nativo para a escolha só ser gravada ao navegar.
export function linkModo(modo: Modo, para: string): string {
  return `/modo?m=${modo}&para=${encodeURIComponent(para)}`;
}
