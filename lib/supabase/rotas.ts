export const ROTAS_PROTEGIDAS = ["/registrar", "/perfil", "/meus-pontos", "/admin"];
export const ROTAS_SO_SEM_LOGIN = ["/entrar", "/criar-conta"];

export function exigeLogin(pathname: string): boolean {
  return ROTAS_PROTEGIDAS.some(
    (rota) => pathname === rota || pathname.startsWith(rota + "/"),
  );
}

export function destinoSeguro(
  next: string | null | undefined,
  padrao = "/cotacao",
): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) {
    return padrao;
  }
  return next;
}
