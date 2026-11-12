"use client";

import { Check, X, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useMarcados, resumir, type ItemChecklist } from "@/lib/checklist";

export default function TelaConcluido({ itens }: { itens: ItemChecklist[] }) {
  const resumo = resumir(itens, useMarcados().marcados);
  const total = itens.length;
  const feitos = resumo.reduce((s, r) => s + r.feitos, 0);
  const completo = total > 0 && feitos === total;

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-creme px-5 pt-11 pb-6">
      <section
        data-cartao-concluido
        data-completo={String(completo)}
        className={`flex flex-col items-center rounded-[32px] px-6 pt-8 pb-[30px] text-center text-branco ${completo ? "bg-verde" : "bg-roxo-700"}`}
      >
        <div className="grid size-[78px] place-items-center rounded-full border-2 border-branco">
          {completo ? <Check size={40} strokeWidth={2.5} aria-hidden /> : <ListChecks size={36} strokeWidth={2} aria-hidden />}
        </div>
        <h1 className="mt-[22px] text-[22px] font-extrabold leading-8">{completo ? "Checklist concluído" : "Checklist de hoje"}</h1>
        <p data-total className="mt-1 text-[16px] leading-6">{feitos} de {total} itens marcados hoje</p>
      </section>

      <ul data-resumo-etapas className="mt-2.5 rounded-[32px] bg-branco px-[18px] py-1">
        {resumo.map((r) => (
          <li key={r.slug} data-etapa={r.slug} className="flex items-center gap-4 border-b-2 border-bege-borda py-3.5 last:border-b-0">
            <span aria-hidden className={`grid size-7 shrink-0 place-items-center rounded-full text-branco ${r.concluida ? "bg-verde" : "bg-vinho"}`}>
              {r.concluida ? <Check size={16} strokeWidth={2.5} /> : <X size={16} strokeWidth={2.5} />}
            </span>
            <span className="flex-1 text-[16px] font-medium leading-6 text-roxo-900">{r.nome}</span>
            <span className="text-[16px] font-bold leading-6 text-roxo-texto-2">{r.feitos} de {r.total}</span>
          </li>
        ))}
      </ul>

      <p className="mt-[30px] px-4 text-center text-[14px] leading-5 text-roxo-texto-2">Este checklist é um guia de boas práticas. O selo continua sendo emitido pela prefeitura.</p>

      <div className="mt-auto pt-8">
        <Button href="/manual">Voltar ao Menu</Button>
      </div>
    </main>
  );
}
