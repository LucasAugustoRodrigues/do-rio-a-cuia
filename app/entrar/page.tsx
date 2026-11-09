import Link from "next/link";
import CabecalhoTela from "@/components/CabecalhoTela";
import FormEntrar from "@/components/auth/FormEntrar";
import { Button } from "@/components/ui/Button";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pt-[19px] pb-6">
      <CabecalhoTela titulo="Entrar" voltarPara="/" />
      <p className="mt-1.5 text-[15px] leading-6 text-roxo-texto-2">
        Entre para registrar preços e acompanhar a cotação.
      </p>
      <FormEntrar next={next} />
      <div className="mt-2.5">
        <Button variante="contornado" href="/cotacao">
          Continuar sem conta
        </Button>
      </div>
      <p className="mt-4 text-center text-[13px] font-semibold leading-5 text-roxo-texto-2">
        Sem conta, você consulta a cotação e confere selos.
        <br />
        Para registrar preços, entre.
      </p>
      <p className="mt-1 flex items-center justify-center gap-2 text-[16px] text-roxo-texto-2">
        <span>Ainda não tem conta?</span>
        <Link
          href={next ? "/criar-conta?next=" + encodeURIComponent(next) : "/criar-conta"}
          className="inline-flex min-h-11 items-center px-1 font-bold text-roxo-900 underline underline-offset-2"
        >
          Criar conta
        </Link>
      </p>
    </main>
  );
}
