import Alerta from "@/components/ui/Alerta";
import TelaManual from "@/components/manual/TelaManual";
import { lerChecklist } from "@/lib/dados/checklist";

export default async function ManualPage() {
  const itens = await lerChecklist();

  if (!itens) {
    return (
      <>
        <h1 className="text-[28px] font-extrabold leading-9 text-roxo-900">Manual do batedor</h1>
        <div className="mt-4">
          <Alerta>Não foi possível carregar o manual agora. Tente de novo em instantes.</Alerta>
        </div>
      </>
    );
  }

  return <TelaManual itens={itens} />;
}
