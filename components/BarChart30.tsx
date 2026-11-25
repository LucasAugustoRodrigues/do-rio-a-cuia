"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { PontoHistorico } from "@/lib/dados/cotacao";
import { contarRegistros, diaMesDeISO, diaSemanaDeISO, formatarReais, formatarReaisInteiro } from "@/lib/formato";

export default function BarChart30({ historico }: { historico: PontoHistorico[] }) {
  const valores = historico.flatMap((p) => (p.media === null ? [] : [p.media]));
  const ultimo = historico.length - 1;
  const ultimoComPreco = historico.findLastIndex((p) => p.media !== null);
  const [selecao, selecionar] = useState<number | null>(null);
  const ponteiro = useRef<number | null>(null);
  const indice = selecao ?? ultimoComPreco;
  const dia = historico[indice];
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const altura = (v: number) => (max === min ? 64 : Math.round(28 + ((v - min) / (max - min)) * 72));

  function escolher(n: number) {
    selecionar(Math.max(0, Math.min(ultimo, n)));
  }

  function escolherPorPosicao(e: PointerEvent<HTMLDivElement>) {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    if (width > 0) escolher(Math.floor(((e.clientX - left) / width) * historico.length));
  }

  function aoPressionar(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0 || ponteiro.current !== null) return;
    ponteiro.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    escolherPorPosicao(e);
  }

  function aoSoltar(e: PointerEvent<HTMLDivElement>) {
    if (ponteiro.current === e.pointerId) ponteiro.current = null;
  }

  function aoTeclar(e: KeyboardEvent<HTMLDivElement>) {
    const teclas: Record<string, number> = { ArrowLeft: indice - 1, ArrowRight: indice + 1, Home: 0, End: ultimo };
    if (!Object.hasOwn(teclas, e.key)) return;
    e.preventDefault();
    escolher(teclas[e.key]);
  }

  const alinhamento = indice < 5 ? "left-0" : indice > ultimo - 5 ? "right-0" : "left-1/2 -translate-x-1/2";
  const ponta = indice < 5 ? "left-1.5" : indice > ultimo - 5 ? "right-1.5" : "left-1/2 -translate-x-1/2";

  return (
    <section data-grafico-card className="rounded-[32px] bg-branco px-5 pt-[18px] pb-3.5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[20px] font-bold leading-7 text-roxo-900">Últimos 30 dias</h2>
        <span className="text-[14px] leading-5 text-roxo-texto-2">R$ por rasa</span>
      </div>
      {dia ? (
        <div
          role="slider"
          tabIndex={0}
          aria-label="Média da rasa nos últimos 30 dias. Use as setas para escolher o dia."
          aria-valuemin={0}
          aria-valuemax={ultimo}
          aria-valuenow={indice}
          aria-valuetext={`${diaMesDeISO(dia.dia)}: ${dia.media === null ? "sem preços" : formatarReais(dia.media)}`}
          onPointerDown={aoPressionar}
          onPointerMove={(e) => {
            if (ponteiro.current === e.pointerId) escolherPorPosicao(e);
          }}
          onPointerUp={aoSoltar}
          onPointerCancel={aoSoltar}
          onLostPointerCapture={aoSoltar}
          onKeyDown={aoTeclar}
          className="mt-10 flex h-[100px] cursor-pointer items-end touch-pan-y select-none"
        >
          {historico.map((p, i) => (
            <div key={p.dia} className="relative min-w-0 flex-1 px-[2px]">
              <div
                data-barra
                data-selecionada={i === indice ? "" : undefined}
                data-media={p.media ?? undefined}
                className={`rounded-full ${p.media === null ? "h-1 bg-bege-borda" : i === indice ? "bg-roxo-850" : "bg-roxo-texto-2/90"}`}
                style={p.media === null ? undefined : { height: altura(p.media) }}
              />
              {i === indice && p.media !== null && (
                <span data-balao className={`pointer-events-none absolute bottom-full mb-1.5 whitespace-nowrap rounded-md bg-roxo-850 px-1.5 py-0.5 text-[13px] font-bold leading-4 text-branco ${alinhamento}`}>
                  {formatarReaisInteiro(p.media)}
                  <span aria-hidden className={`absolute top-full border-x-4 border-t-4 border-x-transparent border-t-roxo-850 ${ponta}`} />
                </span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-[15px] leading-6 text-roxo-texto-2">Sem preços nos últimos 30 dias.</p>
      )}
      <div className="mt-2 flex justify-between text-[14px] leading-5 text-roxo-texto-2">
        <span>há 30 dias</span>
        <span>hoje</span>
      </div>
      {dia && (
        <div data-detalhe-dia aria-live="polite" className="mt-4 min-h-[120px] border-t border-bege-borda pt-3">
          <p className="text-[14px] font-semibold leading-5 text-azul">
            {indice === ultimo ? `Hoje, ${diaMesDeISO(dia.dia)}` : diaSemanaDeISO(dia.dia)}
          </p>
          {dia.media === null ? (
            <p className="text-[17px] font-bold text-roxo-900">Sem preços nesse dia</p>
          ) : (
            <>
              <p className="text-[28px] font-extrabold leading-8 text-roxo-900">{formatarReais(dia.media)}</p>
              <p className="text-[14px] leading-5 text-roxo-texto-2">Média da rasa · {contarRegistros(dia.qtd)}</p>
              {dia.minimo !== null && dia.maximo !== null && (
                <p className="text-[14px] leading-5 text-roxo-texto-2">
                  Mínimo {formatarReais(dia.minimo)} · Máximo {formatarReais(dia.maximo)}
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}
