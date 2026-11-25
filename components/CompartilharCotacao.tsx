"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { diaMesDeISO, formatarReais } from "@/lib/formato";

type Props = { dia: string; hoje: boolean; media: number; minimo: number; maximo: number };

// Só agregados do dia (RN05). No celular abre a folha de compartilhar; no computador, o WhatsApp Web.
export default function CompartilharCotacao({ dia, hoje, media, minimo, maximo }: Props) {
  async function compartilhar() {
    const quando = hoje ? "hoje" : `em ${diaMesDeISO(dia)}`;
    const texto =
      `Rasa do açaí ${quando} na Feira do Açaí: média ${formatarReais(media)} ` +
      `(mínimo ${formatarReais(minimo)}, máximo ${formatarReais(maximo)}). ` +
      `Veja no Do Rio à Cuia: ${window.location.origin}/cotacao`;
    if (navigator.share) {
      try {
        await navigator.share({ text: texto });
      } catch {
        // a pessoa fechou a folha de compartilhar
      }
      return;
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
  }

  return (
    <Button variante="contornado" onClick={compartilhar} icone={<Share2 size={22} strokeWidth={2} aria-hidden />}>
      Compartilhar cotação
    </Button>
  );
}
