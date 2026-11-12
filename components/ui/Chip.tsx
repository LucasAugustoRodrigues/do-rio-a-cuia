import type { ReactNode } from "react";

const BASE =
  "inline-flex h-11 items-center gap-2 rounded-full text-[16px] font-semibold aria-pressed:bg-roxo-700 aria-pressed:text-branco";

const VARIANTE: Record<string, string> = {
  borda: "border-[1.5px] border-bege-chip bg-branco px-6 text-roxo-900 aria-pressed:border-roxo-700",
  flutuante: "bg-branco px-4 text-roxo-900 shadow-[0_4px_16px_rgba(43,15,56,0.12)]",
};

export default function Chip({
  selecionado,
  onClick,
  children,
  icone,
  variante = "borda",
}: {
  selecionado: boolean;
  onClick: () => void;
  children: ReactNode;
  icone?: ReactNode;
  variante?: "borda" | "flutuante";
}) {
  return (
    <button
      type="button"
      data-chip
      aria-pressed={selecionado}
      onClick={onClick}
      className={`${BASE} ${VARIANTE[variante]}`}
    >
      {icone}
      {children}
    </button>
  );
}
