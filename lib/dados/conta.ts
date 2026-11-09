// Caixa do projeto (D-021). Não mudar depois que houver contas reais.
export const EMAIL_BASE = "dorioacuia.app";

export function normalizarTelefone(entrada: string): string | null {
  let digitos = entrada.replace(/\D/g, "");
  if ((digitos.length === 12 || digitos.length === 13) && digitos.startsWith("55")) {
    digitos = digitos.slice(2);
  }
  if ((digitos.length === 10 || digitos.length === 11) && !digitos.startsWith("0")) {
    return "55" + digitos;
  }
  return null;
}

export function emailDoTelefone(tel55: string): string {
  return `${EMAIL_BASE}+${tel55}@gmail.com`;
}

export function telefoneDoEmail(email: string): string | null {
  const match = email.match(/\+55(\d{10,11})@/);
  return match ? match[1] : null;
}

export function formatarTelefone(d: string): string {
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return d;
}
