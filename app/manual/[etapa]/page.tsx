import { notFound } from "next/navigation";
import Alerta from "@/components/ui/Alerta";
import TelaEtapa from "@/components/manual/TelaEtapa";
import { etapaPorSlug } from "@/lib/checklist-shared";
import { lerChecklist } from "@/lib/dados/checklist";

export default async function EtapaPage({ params }: { params: Promise<{ etapa: string }> }) {
  const { etapa } = await params;
  const e = etapaPorSlug(etapa);
  if (!e) notFound();

  const itens = await lerChecklist();

  if (!itens) {
    return (
      <main className="mx-auto max-w-[430px] px-5 pt-11">
        <Alerta>Não foi possível carregar o manual agora. Tente de novo em instantes.</Alerta>
      </main>
    );
  }

  return <TelaEtapa itens={itens} etapa={e.slug} />;
}
