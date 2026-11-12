import type { ReactNode } from "react";

export default function Chip({
  selecionado,
  onClick,
  children,
  icone,
}: {
  selecionado: boolean;
  onClick: () => void;
  children: ReactNode;
  icone?: ReactNode;
}) {
  return (
    <button
      type="button"
      data-chip
      aria-pressed={selecionado}
      onClick={onClick}
      className="inline-flex h-11 items-center gap-2 rounded-full border-[1.5px] border-bege-chip bg-branco px-6 text-[16px] font-semibold text-roxo-900 aria-pressed:border-roxo-700 aria-pressed:bg-roxo-700 aria-pressed:text-branco"
    >
      {icone}
      {children}
    </button>
  );
}
