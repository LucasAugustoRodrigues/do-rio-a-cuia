import { X } from "lucide-react";
import type { Situacao } from "@/lib/dados/pontos";
import { dataDeISO } from "@/lib/formato";

type Props = {
  situacao: Situacao;
  dataValidade: string | null;
};

export default function SealHero({ situacao, dataValidade }: Props) {
  const valido = situacao === "valido";

  let textoValidade: string;
  if (valido) {
    textoValidade = dataValidade ? `Válido até ${dataDeISO(dataValidade)}` : "Válido";
  } else {
    textoValidade = dataValidade ? `Venceu em ${dataDeISO(dataValidade)}` : "Sem selo válido cadastrado";
  }

  return (
    <section
      data-seal-hero
      data-situacao={situacao}
      className={
        "flex animate-selo flex-col items-center rounded-[32px] px-6 pt-[31px] text-center text-branco" +
        (valido ? " bg-verde pb-[33px]" : " bg-vermelho pb-[26px]")
      }
    >
      <div className="grid size-[78px] place-items-center rounded-full border-2 border-branco">
        {valido ? (
          <svg data-check viewBox="0 0 24 24" width={40} height={40} fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6 9 17l-5-5" pathLength={1} className="animate-desenhar [stroke-dasharray:1]" />
          </svg>
        ) : (
          <X size={40} strokeWidth={2.5} aria-hidden />
        )}
      </div>
      <h1 className="mt-[22px] text-[40px] font-extrabold leading-[48px]">
        {valido ? "Selo válido" : "Selo vencido"}
      </h1>
      <p data-validade className="mt-1 text-[17px] leading-6">
        {textoValidade}
      </p>
      {valido && (
        <p data-conferido className="mt-[17px] text-[14px] leading-5">
          Conferido hoje
        </p>
      )}
    </section>
  );
}
