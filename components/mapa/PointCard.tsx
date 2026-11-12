import { Check, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { dataDeISO } from "@/lib/formato";
import type { Ponto } from "@/lib/dados/pontos";

export default function PointCard({ ponto }: { ponto: Ponto }) {
  const valido = ponto.situacao === "valido";

  let textoEtiqueta: string;
  if (valido && ponto.dataValidade) {
    textoEtiqueta = `Selo válido até ${dataDeISO(ponto.dataValidade)}`;
  } else if (!valido && ponto.dataValidade) {
    textoEtiqueta = `Selo vencido em ${dataDeISO(ponto.dataValidade)}`;
  } else {
    textoEtiqueta = "Sem selo válido";
  }

  const etiquetaClasses = valido
    ? "bg-verde-claro text-verde"
    : "bg-rosa-alerta text-vermelho";

  return (
    <article data-point-card className="rounded-[32px] bg-branco px-[18px] pt-6 pb-[18px] shadow-[0_8px_24px_rgba(43,15,56,0.10)]">
      <h2 className="text-[20px] font-extrabold leading-7 text-roxo-900">{ponto.nome}</h2>
      <p data-endereco className="mt-1 text-[15px] leading-6 text-roxo-texto-2">
        {[ponto.endereco, ponto.bairro].filter(Boolean).join(", ")}
      </p>
      <p
        data-etiqueta-selo
        className={`mt-2.5 inline-flex min-h-[30px] items-center gap-2 rounded-full px-3.5 py-1 text-[14px] font-medium leading-5 ${etiquetaClasses}`}
      >
        {valido ? (
          <Check size={16} strokeWidth={2.25} aria-hidden />
        ) : (
          <X size={16} strokeWidth={2.25} aria-hidden />
        )}
        {textoEtiqueta}
      </p>
      <div className="mt-3.5">
        <Button href={`/p/${ponto.slug}`}>
          Ver página do ponto
          <ArrowRight size={22} strokeWidth={2.25} aria-hidden />
        </Button>
      </div>
    </article>
  );
}
