import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  href: string;
  titulo: string;
  subtitulo: string;
  icone: ReactNode;
  tom: "azul" | "verde";
};

export function OptionCard({ href, titulo, subtitulo, icone, tom }: Props) {
  const iconeBg = tom === "azul" ? "bg-azul-claro text-azul" : "bg-verde-claro text-verde";

  return (
    <Link
      href={href}
      data-option-card
      className="flex min-h-[76px] items-center gap-4 rounded-[24px] bg-branco px-4 py-[14px] shadow-[0_6px_20px_rgba(43,15,56,0.06)]"
    >
      <div className={`grid size-12 shrink-0 place-items-center rounded-[12px] ${iconeBg}`}>
        {icone}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[17px] font-bold leading-6 text-roxo-900">{titulo}</p>
        <p className="mt-0.5 truncate text-[14px] leading-5 text-roxo-texto-2">{subtitulo}</p>
      </div>
      <ArrowRight size={22} strokeWidth={2} className="shrink-0 text-roxo-texto-2" aria-hidden />
    </Link>
  );
}
