import type { PontoHistorico } from "@/lib/dados/cotacao";
import { formatarReaisInteiro } from "@/lib/formato";

export default function BarChart30({ historico }: { historico: PontoHistorico[] }) {
  const valores = historico.flatMap((p) => (p.media === null ? [] : [p.media]));
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const altura = (v: number) => (max === min ? 64 : Math.round(28 + ((v - min) / (max - min)) * 72));
  const ultimo = historico.length - 1;
  return (
    <section data-grafico-card className="rounded-[32px] bg-branco px-5 pt-[18px] pb-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[20px] font-bold leading-7 text-roxo-900">Últimos 30 dias</h2>
        <span className="text-[14px] leading-5 text-roxo-texto-2">R$ por rasa</span>
      </div>
      {valores.length === 0 ? (
        <p className="mt-6 text-[15px] leading-6 text-roxo-texto-2">Sem preços nos últimos 30 dias.</p>
      ) : (
        <div role="img" aria-label="Média da rasa em cada um dos últimos 30 dias" className="mt-6 flex h-[100px] items-end gap-[5px]">
          {historico.map((p, i) =>
            p.media === null ? (
              <div key={p.dia} data-barra className="flex-1" />
            ) : (
              <div
                key={p.dia}
                data-barra
                data-media={p.media}
                className={`relative flex-1 rounded-full ${i === ultimo ? "bg-roxo-850" : "bg-roxo-texto-2/90"}`}
                style={{ height: altura(p.media) }}
              >
                {i === ultimo && (
                  <span data-balao className="absolute -right-1 bottom-full mb-1.5 whitespace-nowrap rounded-md bg-roxo-850 px-1.5 py-0.5 text-[13px] font-bold leading-4 text-branco">
                    {formatarReaisInteiro(p.media)}
                    <span aria-hidden className="absolute right-1.5 top-full border-x-4 border-t-4 border-x-transparent border-t-roxo-850" />
                  </span>
                )}
              </div>
            ),
          )}
        </div>
      )}
      <div className="mt-2 flex justify-between text-[14px] leading-5 text-roxo-texto-2">
        <span>há 30 dias</span>
        <span>hoje</span>
      </div>
    </section>
  );
}
