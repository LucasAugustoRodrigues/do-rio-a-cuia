import Link from "next/link";
import CabecalhoTela from "@/components/CabecalhoTela";
import FormCriarConta from "@/components/auth/FormCriarConta";

export default async function CriarContaPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pt-[19px] pb-3">
      <CabecalhoTela titulo="Criar conta" voltarPara="/entrar" />
      <p className="mt-5 text-[15px] leading-6 text-roxo-texto-2">Leva menos de um minuto.</p>
      <FormCriarConta next={next} />
      <p className="mt-3 flex items-center justify-center gap-1 text-[14px] text-roxo-texto-2">
        <span>Já tem conta?</span>
        <Link
          href={next ? "/entrar?next=" + encodeURIComponent(next) : "/entrar"}
          className="inline-flex min-h-11 items-center px-1 font-bold text-roxo-900 underline underline-offset-2"
        >
          Entrar
        </Link>
      </p>
    </main>
  );
}
