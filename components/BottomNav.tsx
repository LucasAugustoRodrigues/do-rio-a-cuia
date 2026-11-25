'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesColumn, MapPin, ListChecks, User } from "lucide-react";
import type { ReactNode } from "react";
import type { Modo } from "@/lib/modo";

type NavItem = {
  label: string;
  href: string;
  icon: ReactNode;
  extraPrefixes?: string[];
};

const items: NavItem[] = [
  {
    label: "Cotação",
    href: "/cotacao",
    icon: <ChartNoAxesColumn size={24} strokeWidth={2} aria-hidden />,
    extraPrefixes: ["/registrar"],
  },
  {
    label: "Mapa",
    href: "/mapa",
    icon: <MapPin size={24} strokeWidth={2} aria-hidden />,
  },
  {
    label: "Manual",
    href: "/manual",
    icon: <ListChecks size={24} strokeWidth={2} aria-hidden />,
  },
  {
    label: "Perfil",
    href: "/perfil",
    icon: <User size={24} strokeWidth={2} aria-hidden />,
  },
];

export function BottomNav({ modo }: { modo: Modo | null }) {
  const pathname = usePathname();
  const consumidor = modo === "toma";
  const visiveis = consumidor ? items.filter((item) => item.href === "/mapa" || item.href === "/perfil") : items;

  return (
    <nav
      aria-label="Navegação principal"
      data-bottom-nav
      className={`fixed inset-x-0 bottom-4 z-40 mx-auto flex h-16 w-[calc(100%-32px)] max-w-[398px] items-center ${consumidor ? "justify-around" : "justify-between"} rounded-[32px] bg-branco px-5 shadow-[0_8px_24px_rgba(43,15,56,0.10)]`}
    >
      {visiveis.map(({ label, href, icon, extraPrefixes }) => {
        const isActive =
          pathname.startsWith(href) ||
          (extraPrefixes?.some((p) => pathname.startsWith(p)) ?? false);

        if (isActive) {
          return (
            <Link
              key={`${href}-ativo`}
              href={href}
              aria-current="page"
              className="flex h-12 animate-pilula items-center gap-2 rounded-full bg-roxo-700 px-4 text-[15px] font-semibold text-branco"
            >
              {icon}
              {label}
            </Link>
          );
        }

        return (
          <Link
            key={href}
            href={href}
            className="grid size-12 place-items-center rounded-full text-roxo-texto-2 transition-transform duration-150 ease-out active:scale-90"
          >
            {icon}
            <span className="sr-only">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
