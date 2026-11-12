import { redirect } from "next/navigation";
import { Check } from "lucide-react";
import { lerPrecoProprio } from "@/lib/dados/precos";
import { lerCotacao } from "@/lib/dados/cotacao";
import { formatarReais } from "@/lib/formato";
import { Button } from "@/components/ui/Button";
import InfoBox from "@/components/ui/InfoBox";

export default async function PrecoEnviadoPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const { id } = await searchParams;
  const preco = await lerPrecoProprio(typeof id === "string" ? id : undefined);
  if (!preco) redirect("/cotacao");

  const cotacao = await lerCotacao();
  const hoje = cotacao?.hoje ?? null;

  return (
    <div>
      <div className="flex flex-col items-center pt-[66px] text-center">
        <div className="grid size-[92px] place-items-center rounded-full bg-azul">
          <Check size={44} strokeWidth={3} aria-hidden className="text-branco" />
        </div>
        <h1 className="mt-7 text-[28px] font-extrabold leading-9 text-roxo-900">Preço enviado!</h1>
        <p className="mt-2 text-[16px] leading-6 text-roxo-texto-2">Obrigado por ajudar a cotação do dia.</p>
      </div>
      <dl data-resumo className="mt-7 rounded-[28px] bg-branco px-[18px] py-1.5">
        <div className="flex items-center justify-between gap-3 border-b border-bege-borda py-3 last:border-b-0">
          <dt className="text-[15px] leading-6 text-roxo-texto-2">Você registrou</dt>
          <dd className="text-right text-[16px] font-bold leading-6 text-roxo-texto-2">{`${formatarReais(preco.valorRasa)} por rasa`}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-bege-borda py-3 last:border-b-0">
          <dt className="text-[15px] leading-6 text-roxo-texto-2">Nova média do dia</dt>
          <dd className="text-right text-[16px] font-bold leading-6 text-roxo-texto-2">{hoje ? formatarReais(hoje.media) : "R$ --,--"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3 border-b border-bege-borda py-3 last:border-b-0">
          <dt className="text-[15px] leading-6 text-roxo-texto-2">Registros hoje</dt>
          <dd className="text-right text-[16px] font-bold leading-6 text-roxo-texto-2">{String(hoje?.qtd ?? 0)}</dd>
        </div>
      </dl>
      {preco.emRevisao && (
        <div className="mt-3.5">
          <InfoBox>Este valor ficou bem diferente dos outros da semana. A equipe vai conferir antes de ele entrar na média.</InfoBox>
        </div>
      )}
      <div aria-hidden className="h-28" />
      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto flex w-[calc(100%-40px)] max-w-[390px] flex-col gap-3.5">
        <Button variante="contornado" href="/registrar">Registrar outro preço</Button>
        <Button href="/cotacao">Voltar à cotação</Button>
      </div>
    </div>
  );
}
