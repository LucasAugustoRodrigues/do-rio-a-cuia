const TZ = "America/Belem";

const reais = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const reaisInteiro = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const data = new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric" });
const hora = new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const iso = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });

export function formatarReais(v: number): string {
  return reais.format(v);
}

export function formatarReaisInteiro(v: number): string {
  return reaisInteiro.format(v);
}

export function formatarPercentual(v: number): string {
  const arred = Math.round(Math.abs(v) * 10) / 10;
  const sinal = arred === 0 ? "" : v > 0 ? "+" : "-";
  return `${sinal}${arred.toFixed(1).replace(".", ",")}%`;
}

export function dataBelem(d: Date | string): string {
  return data.format(new Date(d));
}

export function horaBelem(d: Date | string): string {
  return hora.format(new Date(d));
}

export function hojeBelemISO(): string {
  return iso.format(new Date());
}

export function diaISOMenos(diaISO: string, n: number): string {
  const d = new Date(`${diaISO}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
}

export function diaMesDeISO(diaISO: string): string {
  const [, mes, dia] = diaISO.split("-");
  return `${dia}/${mes}`;
}

export function contarRegistros(n: number): string {
  return n === 1 ? "1 registro" : `${n} registros`;
}

// Aceita "128", "128,5", "128,50", "128.50" e "1.000,00". Devolve null se não for número com até 2 casas.
export function lerValor(texto: string): number | null {
  let t = texto.replace(/R\$/g, "").replace(/\s/g, "");
  if (t.includes(",") && t.includes(".")) t = t.replace(/\./g, "");
  t = t.replace(",", ".");
  if (!/^\d{1,7}(\.\d{1,2})?$/.test(t)) return null;
  return Number(t);
}

export function valorParaCampo(v: number): string {
  return v.toFixed(2).replace(".", ",");
}
