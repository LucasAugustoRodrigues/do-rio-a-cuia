"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Chip from "@/components/ui/Chip";
import PointCard from "@/components/mapa/PointCard";
import type { Ponto } from "@/lib/dados/pontos";

const Mapa = dynamic(() => import("@/components/mapa/Mapa"), {
  ssr: false,
  loading: () => <div className="size-full bg-bege-borda" />,
});

function normalizar(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

type Filtro = "todos" | "valido" | "vencido";

type Props = {
  pontos: Ponto[];
  filtroInicial: Filtro;
};

export default function TelaMapa({ pontos, filtroInicial }: Props) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>(filtroInicial);
  const [selecionadoId, setSelecionadoId] = useState<string | null>(null);

  const visiveis = useMemo(
    () =>
      pontos.filter(
        (p) =>
          (filtro === "todos" || p.situacao === filtro) &&
          normalizar(p.nome).includes(normalizar(busca)),
      ),
    [pontos, filtro, busca],
  );

  const selecionado = visiveis.find((p) => p.id === selecionadoId) ?? visiveis[0] ?? null;

  return (
    <>
      <div data-mapa className="fixed inset-0 z-0 bg-bege-borda">
        <Mapa pontos={visiveis} selecionadoId={selecionado?.id ?? null} onSelecionar={setSelecionadoId} />
      </div>

      <div className="fixed inset-x-0 top-0 z-20 mx-auto w-full max-w-[430px] px-4 pt-[31px]">
        <label className="flex h-[52px] items-center gap-3 rounded-full bg-branco px-5 shadow-[0_4px_16px_rgba(43,15,56,0.12)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-azul">
          <Search size={24} strokeWidth={2} aria-hidden className="shrink-0 text-roxo-texto-2" />
          <span className="sr-only">Buscar ponto de açaí</span>
          <input
            data-busca
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar ponto de açaí"
            className="h-full w-full min-w-0 bg-transparent text-[16px] text-roxo-900 placeholder:text-roxo-texto-2 focus:outline-none"
          />
        </label>

        <div role="group" aria-label="Filtrar pontos" className="mt-[15px] flex flex-wrap gap-2">
          <Chip
            variante="flutuante"
            selecionado={filtro === "todos"}
            onClick={() => setFiltro("todos")}
            icone={
              <span
                aria-hidden
                className={`size-2.5 rounded-full ${filtro === "todos" ? "bg-branco" : "bg-roxo-700"}`}
              />
            }
          >
            Todos
          </Chip>
          <Chip
            variante="flutuante"
            selecionado={filtro === "valido"}
            onClick={() => setFiltro("valido")}
            icone={<span aria-hidden className="size-2.5 rounded-full bg-verde" />}
          >
            Selo válido
          </Chip>
          <Chip
            variante="flutuante"
            selecionado={filtro === "vencido"}
            onClick={() => setFiltro("vencido")}
            icone={<span aria-hidden className="size-2.5 rounded-full bg-vermelho" />}
          >
            Vencido
          </Chip>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto w-[calc(100%-32px)] max-w-[398px]">
        {selecionado ? (
          <PointCard ponto={selecionado} />
        ) : (
          <p
            data-sem-resultado
            className="rounded-[24px] bg-branco px-5 py-4 text-[15px] leading-6 text-roxo-900 shadow-[0_8px_24px_rgba(43,15,56,0.10)]"
          >
            Nenhum ponto encontrado. Confira o nome ou troque o filtro.
          </p>
        )}
      </div>
    </>
  );
}
