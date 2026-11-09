import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  variante?: "primario" | "destaque" | "contornado";
  href?: string;
  icone?: ReactNode;
  children: ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children">;

const base =
  "inline-flex h-14 w-full items-center justify-center gap-3 rounded-full px-6 text-[18px] font-bold disabled:opacity-50";

const variantes = {
  primario: "bg-roxo-700 text-branco",
  destaque: "bg-amarelo text-roxo-900",
  contornado: "border-[1.5px] border-roxo-700 bg-transparent text-roxo-700",
};

export function Button({
  variante = "primario",
  href,
  icone,
  children,
  ...props
}: ButtonProps) {
  const classes = `${base} ${variantes[variante]}`;

  if (href) {
    return (
      <Link href={href} className={classes} data-variante={variante}>
        {icone}
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} data-variante={variante} {...props}>
      {icone}
      {children}
    </button>
  );
}
