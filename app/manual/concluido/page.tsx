import Alerta from "@/components/ui/Alerta";
import TelaConcluido from "@/components/manual/TelaConcluido";
import { lerChecklist } from "@/lib/dados/checklist";

export default async function ConcluidoPage() {
  const itens = await lerChecklist();

  if (!itens) {
    return (
      <main className="mx-auto max-w-[430px] px-5 pt-11">
        <Alerta>Não foi possível carregar o manual agora. Tente de novo em instantes.</Alerta>
      </main>
    );
  }

  return <TelaConcluido itens={itens} />;
}
