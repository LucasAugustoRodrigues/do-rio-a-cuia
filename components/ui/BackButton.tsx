import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function BackButton({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="Voltar" data-voltar className="grid size-11 shrink-0 place-items-center rounded-full border border-roxo-900 text-roxo-900">
      <ChevronLeft size={24} strokeWidth={1.75} aria-hidden />
    </Link>
  );
}
