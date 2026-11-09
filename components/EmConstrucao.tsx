import { Button } from "@/components/ui/Button";

type Props = {
  titulo: string;
  pr: string;
};

export function EmConstrucao({ titulo, pr }: Props) {
  return (
    <div>
      <h1 className="text-[28px] font-extrabold leading-9 text-roxo-900">
        {titulo}
      </h1>
      <p className="mt-2 text-[16px] text-roxo-texto-2">
        Esta tela chega no {pr}.
      </p>
      <div className="mt-8">
        <Button variante="contornado" href="/">
          Voltar ao início
        </Button>
      </div>
    </div>
  );
}
