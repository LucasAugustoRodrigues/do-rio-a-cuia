"use client";

import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { useMarcados, resumir, type ItemChecklist } from "@/lib/checklist";

export default function TelaManual({ itens }: { itens: ItemChecklist[] }) {
  const { marcados } = useMarcados();
  const resumo = resumir(itens, marcados);
  const feitas = resumo.filter((r) => r.concluida).length;

  return (
    <>
      <header className="-mx-5 -mt-8 rounded-b-[32px] bg-roxo-900 px-5 pt-[27px] pb-4 text-branco">
        <h1 className="text-[28px] font-extrabold leading-9">Manual do batedor</h1>
        <p className="text-[15px] leading-6 text-branco/75">5 etapas para um açaí seguro</p>
        <div className="mt-2.5 flex items-center justify-between text-[15px] leading-6">
          <span className="font-semibold">Progresso de hoje</span>
          <span data-progresso-texto>{feitas} de 5 etapas</span>
        </div>
        <div role="progressbar" aria-label="Etapas concluídas hoje" aria-valuemin={0} aria-valuemax={5} aria-valuenow={feitas} className="mt-1 h-2 rounded-full bg-branco/15">
          <div data-progresso className="h-full rounded-full bg-amarelo" style={{ width: `${(feitas / 5) * 100}%` }} />
        </div>
      </header>

      <p data-aviso-manual className="mt-5 rounded-[24px] border border-azul bg-azul-claro px-5 py-3.5 text-center text-[14px] leading-5 text-roxo-900">Branquear os frutos em água a 80 °C elimina o parasita da doença de Chagas. Nunca bata fruto sem branqueamento.</p>

      <ul className="mt-4 flex flex-col gap-2">
        {resumo.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/manual/${r.slug}`}
              data-etapa={r.slug}
              data-concluida={String(r.concluida)}
              className="flex items-center gap-[18px] rounded-[22px] bg-branco py-[13px] pl-[14px] pr-5"
            >
              <span aria-hidden className={`grid size-10 shrink-0 place-items-center rounded-full text-branco ${r.concluida ? "bg-verde" : "bg-vinho"}`}>
                {r.concluida ? <Check size={20} strokeWidth={2.5} /> : <X size={20} strokeWidth={2.5} />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[18px] font-medium leading-6 text-roxo-900">{r.nome}</span>
                <span className="block text-[14px] leading-5 text-roxo-texto-2">{r.total} itens - {r.concluida ? "Concluída" : "Incompleta"}</span>
              </span>
              <ArrowRight size={24} strokeWidth={2} aria-hidden className="shrink-0 text-roxo-texto-2" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
