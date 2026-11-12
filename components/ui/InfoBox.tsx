import { Info } from "lucide-react";
import type { ReactNode } from "react";

export default function InfoBox({ children }: { children: ReactNode }) {
  return (
    <div data-infobox className="flex gap-3 rounded-[20px] bg-azul-claro px-4 py-3">
      <Info size={20} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0 text-azul" />
      <p className="text-[15px] leading-[22px] text-roxo-900">{children}</p>
    </div>
  );
}
