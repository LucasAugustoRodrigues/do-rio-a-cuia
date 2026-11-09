import Image from "next/image";
import Link from "next/link";
import { ChartNoAxesColumn, ShieldCheck } from "lucide-react";
import { OndasEntrada } from "@/components/OndasEntrada";
import { OptionCard } from "@/components/OptionCard";

export default function EntradaPage() {
  return (
    <main className="min-h-dvh bg-roxo-700">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col">
        <header className="flex items-center gap-[10px] px-5 pt-[39px]">
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={48}
            className="rounded-[12px]"
          />
          <span className="text-[22px] font-bold text-branco">Do Rio à Cuia</span>
        </header>

        <section className="px-6 pt-[58px]">
          <h1 className="text-[40px] font-extrabold leading-[48px] text-branco">
            O açaí certo,{" "}
            <span className="text-amarelo">do rio à sua cuia.</span>
          </h1>
          <p className="mt-[15px] text-[15px] leading-[18px] text-branco">
            Cotação do dia para quem vende.<br />
            Selo conferido para quem toma.
          </p>
        </section>

        <div className="min-h-12 flex-1" />

        <OndasEntrada />

        <section
          data-painel-entrada
          className="rounded-t-[32px] bg-creme px-5 pt-7 pb-4"
        >
          <h2 className="text-[20px] font-extrabold leading-7 text-roxo-900">
            Como você quer começar?
          </h2>
          <div className="mt-[14px] flex flex-col gap-3">
            <OptionCard
              href="/cotacao"
              titulo="Vou vender açaí"
              subtitulo="Veja a cotação da Feira hoje"
              icone={<ChartNoAxesColumn size={24} strokeWidth={2} aria-hidden />}
              tom="azul"
            />
            <OptionCard
              href="/mapa"
              titulo="Vou tomar açaí"
              subtitulo="Confira se o ponto tem selo válido"
              icone={<ShieldCheck size={24} strokeWidth={2} aria-hidden />}
              tom="verde"
            />
          </div>
          <p className="mt-2 flex items-center justify-center gap-1 text-[14px] text-roxo-texto-2">
            <span>Já tem conta?</span>
            <Link
              href="/entrar"
              className="flex min-h-11 items-center px-1 font-bold text-roxo-900 underline underline-offset-2"
            >
              Entrar
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
