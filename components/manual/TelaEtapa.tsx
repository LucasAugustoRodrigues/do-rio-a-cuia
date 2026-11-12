"use client";

import Link from "next/link";
import { Check, ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useMarcados, resumir, ETAPAS, type ItemChecklist, type SlugEtapa } from "@/lib/checklist";

export default function TelaEtapa({ itens, etapa }: { itens: ItemChecklist[]; etapa: SlugEtapa }) {
  const { marcados, alternar } = useMarcados();
  const resumo = resumir(itens, marcados);
  const indice = ETAPAS.findIndex((e) => e.slug === etapa);
  const atual = resumo[indice];
  const daEtapa = itens.filter((i) => i.etapa === etapa);
  const proxima = ETAPAS[indice + 1];

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-creme pb-6">
      <header className="rounded-b-[32px] bg-roxo-900 px-5 pt-7 pb-[17px]">
        <div className="flex items-center gap-3">
          <Link href="/manual" aria-label="Voltar ao manual" data-voltar className="grid size-11 shrink-0 place-items-center rounded-full bg-branco/5 text-branco">
            <ChevronLeft size={24} strokeWidth={1.75} aria-hidden />
          </Link>
          <h1 className="text-[18px] font-extrabold leading-tight text-branco">Checklist do batedor</h1>
        </div>
        <nav aria-label="Etapas" data-stepper className="-mx-5 mt-[11px] flex items-center gap-2 overflow-x-auto px-5 [scrollbar-width:none]">
          {resumo.map((r, i) =>
            i === indice ? (
              <span key={r.slug} aria-current="step" data-passo={r.slug} className="inline-flex h-10 shrink-0 items-center gap-2.5 rounded-full bg-amarelo pr-4 pl-1.5 text-[15px] font-medium text-roxo-900">
                <span className="grid size-7 place-items-center rounded-full bg-roxo-850 text-[15px] text-amarelo">{i + 1}</span>
                {r.nome}
              </span>
            ) : (
              <Link key={r.slug} href={`/manual/${r.slug}`} data-passo={r.slug} aria-label={`Etapa ${i + 1}: ${r.nome}${r.concluida ? ", concluída" : ""}`} className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-branco/60 text-[15px] text-branco">
                {r.concluida ? <Check size={20} strokeWidth={2.5} aria-hidden /> : i + 1}
              </Link>
            ),
          )}
        </nav>
      </header>

      <div className="flex flex-1 flex-col px-5">
        <div className="mt-[15px] flex items-baseline justify-between gap-3">
          <h2 data-titulo-etapa className="text-[22px] font-bold leading-8 text-verde">Etapa {indice + 1} - {atual.nome}</h2>
          <span data-contador className="shrink-0 text-[14px] font-bold text-roxo-texto-2">{atual.feitos} de {atual.total}</span>
        </div>
        <div role="progressbar" aria-label="Itens marcados nesta etapa" aria-valuemin={0} aria-valuemax={atual.total} aria-valuenow={atual.feitos} className="mt-3 h-1.5 rounded-full bg-branco">
          <div data-progresso-etapa className="h-full rounded-full bg-verde" style={{ width: `${atual.total ? (atual.feitos / atual.total) * 100 : 0}%` }} />
        </div>
        <ul className="mt-3.5 flex flex-col gap-2">
          {daEtapa.map((item) => {
            const marcado = marcados.includes(item.chave);
            return (
              <li key={item.chave}>
                <label data-item={item.chave} data-marcado={String(marcado)} className={`flex cursor-pointer gap-4 rounded-[20px] border px-[14px] pt-4 pb-3.5 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-azul ${marcado ? "border-verde bg-verde-claro" : "border-roxo-texto-2/40 bg-creme-card"}`}>
                  <input type="checkbox" checked={marcado} onChange={() => alternar(item.chave)} className="sr-only" />
                  <span aria-hidden className={`mt-0.5 grid size-[26px] shrink-0 place-items-center rounded-[4px] ${marcado ? "bg-verde text-branco" : "border border-roxo-900 bg-branco"}`}>
                    {marcado && <Check size={20} strokeWidth={3} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[16px] font-medium leading-5 text-roxo-900">{item.descricao}</span>
                    <span className="mt-1.5 block text-[14px] leading-5 text-roxo-texto-2">{item.motivo}</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto pt-8">
          {proxima ? (
            <Button href={`/manual/${proxima.slug}`}>Próxima etapa<ArrowRight size={22} strokeWidth={2.25} aria-hidden /></Button>
          ) : (
            <Button href="/manual/concluido">Finalizar Manual</Button>
          )}
        </div>
      </div>
    </main>
  );
}
