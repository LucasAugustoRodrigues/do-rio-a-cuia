import type { ReactNode } from "react";

type Item = {
  chave: string;
  icone: ReactNode;
  rotulo: string;
  valor: string;
};

type Props = {
  itens: Item[];
};

export default function InfoList({ itens }: Props) {
  return (
    <dl data-info-list className="rounded-[32px] bg-branco px-[17px] py-[3px]">
      {itens.map((item) => (
        <div
          key={item.chave}
          data-item={item.chave}
          className="flex items-center gap-[15px] border-b border-bege-borda py-[14px] last:border-b-0"
        >
          <div className="grid size-[42px] shrink-0 place-items-center rounded-[12px] bg-creme text-roxo-900">
            {item.icone}
          </div>
          <div className="min-w-0">
            <dt className="text-[14px] leading-5 text-roxo-texto-2">{item.rotulo}</dt>
            <dd className="text-[16px] font-bold leading-6 text-roxo-900">{item.valor}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}
