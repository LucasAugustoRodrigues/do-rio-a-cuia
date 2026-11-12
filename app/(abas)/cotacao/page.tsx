import { Plus } from "lucide-react";
import { lerCotacao } from "@/lib/dados/cotacao";
import { dataBelem } from "@/lib/formato";
import { Button } from "@/components/ui/Button";
import Alerta from "@/components/ui/Alerta";
import PriceHero from "@/components/PriceHero";
import BarChart30 from "@/components/BarChart30";

export default async function CotacaoPage() {
  const cotacao = await lerCotacao();
  return (
    <div className="mx-auto w-full max-w-[430px] px-5 pt-6">
      <p data-sobretitulo className="text-[15px] leading-6 text-roxo-texto-2">Feira do Açaí - hoje, {dataBelem(new Date())}</p>
      <h1 className="text-[28px] font-extrabold leading-9 text-roxo-900">Cotação do dia</h1>
      {cotacao ? (
        <>
          <div className="mt-1"><PriceHero cotacao={cotacao} /></div>
          <div className="mt-3.5"><BarChart30 historico={cotacao.historico} /></div>
        </>
      ) : (
        <div className="mt-4"><Alerta>Não foi possível carregar a cotação agora. Tente de novo em instantes.</Alerta></div>
      )}
      <div aria-hidden className="h-12" />
      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto w-[calc(100%-40px)] max-w-[390px]">
        <Button variante="destaque" href="/registrar" icone={<Plus size={24} strokeWidth={2} aria-hidden />}>Registrar preço pago</Button>
      </div>
    </div>
  );
}
