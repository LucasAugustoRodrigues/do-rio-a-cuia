import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_MODO, lerModo } from "@/lib/modo";

const DESTINOS = ["/cotacao", "/mapa", "/mapa?filtro=valido", "/entrar"];

export function GET(request: NextRequest) {
  const modo = lerModo(request.nextUrl.searchParams.get("m") ?? undefined);
  const para = request.nextUrl.searchParams.get("para") ?? "";
  const padrao = modo === "toma" ? "/mapa" : "/cotacao";
  const destino = DESTINOS.includes(para) ? para : padrao;
  const resposta = NextResponse.redirect(new URL(destino, request.url), 303);

  if (modo) {
    resposta.cookies.set(COOKIE_MODO, modo, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
      httpOnly: true,
    });
  }

  return resposta;
}
