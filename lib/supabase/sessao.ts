import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { exigeLogin, ROTAS_SO_SEM_LOGIN } from "./rotas";

export async function atualizarSessao(request: NextRequest): Promise<NextResponse> {
  let resposta = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers: Record<string, string> = {}) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          resposta = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => resposta.cookies.set(name, value, options));
          Object.entries(headers).forEach(([k, v]) => resposta.headers.set(k, v));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const logado = !!data?.claims;

  const { pathname, search } = request.nextUrl;

  function redirect(destino: URL): NextResponse {
    const resp = NextResponse.redirect(destino);
    resposta.cookies.getAll().forEach((c) => resp.cookies.set(c));
    for (const header of ["cache-control", "expires", "pragma"] as const) {
      const val = resposta.headers.get(header);
      if (val) resp.headers.set(header, val);
    }
    return resp;
  }

  if (!logado && exigeLogin(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/entrar";
    url.search = "?next=" + encodeURIComponent(pathname + search);
    return redirect(url);
  }

  if (logado && ROTAS_SO_SEM_LOGIN.includes(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/cotacao";
    url.search = "";
    return redirect(url);
  }

  return resposta;
}
