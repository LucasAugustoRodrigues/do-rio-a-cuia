import type { Cotacao } from "@/lib/dados/cotacao";
import { contarRegistros, diaMesDeISO, formatarPercentual, formatarReais, horaBelem } from "@/lib/formato";

const VAZIO = "R$ --,--";

export default function PriceHero({ cotacao }: { cotacao: Cotacao }) {
  const { hoje, ultimo, variacao } = cotacao;
  const dia = hoje ?? ultimo;
  const rotulo = hoje ? "Média da rasa" : ultimo ? "Ainda não há preços hoje" : "Ainda não há preços registrados";
  const rodape = hoje
    ? `Atualizado às ${horaBelem(hoje.atualizadoEm)} - ${contarRegistros(hoje.qtd)}`
    : ultimo
      ? `Média de ${diaMesDeISO(ultimo.dia)} - ${contarRegistros(ultimo.qtd)}`
      : "Registre o primeiro preço do dia.";
  return (
    <section data-price-hero aria-label="Cotação da rasa" className="rounded-[32px] bg-roxo-700 px-5 pt-[22px] pb-5 text-branco">
      <div className="flex min-h-7 items-center justify-between gap-3">
        <p data-rotulo className="text-[16px] font-medium leading-6">{rotulo}</p>
        {hoje && variacao !== null && (
          <span data-variacao className="inline-flex h-7 shrink-0 items-center rounded-full bg-amarelo px-3 text-[14px] font-semibold text-roxo-900">
            {formatarPercentual(variacao)} vs. ontem
          </span>
        )}
      </div>
      <p data-media className="mt-1 text-[48px] font-extrabold leading-[56px]">{dia ? formatarReais(dia.media) : VAZIO}</p>
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-[18px] bg-roxo-500 px-3.5 py-3">
          <p className="text-[15px] leading-5">Mínimo</p>
          <p data-minimo className="mt-0.5 text-[20px] font-semibold leading-7">{dia ? formatarReais(dia.minimo) : VAZIO}</p>
        </div>
        <div className="rounded-[18px] bg-roxo-500 px-3.5 py-3">
          <p className="text-[15px] leading-5">Máximo</p>
          <p data-maximo className="mt-0.5 text-[20px] font-semibold leading-7">{dia ? formatarReais(dia.maximo) : VAZIO}</p>
        </div>
      </div>
      <p data-rodape className="mt-3 text-[15px] leading-6">{rodape}</p>
    </section>
  );
}
