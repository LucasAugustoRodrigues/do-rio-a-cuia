import { ArrowRight, ChevronLeft, Info, MapPin, ShieldCheck, Store, Waves } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import InfoList from "@/components/InfoList";
import SealHero from "@/components/SealHero";
import { lerPontoPorSlug } from "@/lib/dados/pontos";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata() {
  return { title: "Selo do ponto | Do Rio à Cuia" };
}

export default async function PaginaPonto({ params }: Props) {
  const { slug } = await params;
  const resultado = await lerPontoPorSlug(slug);

  const cabecalho = (
    <header className="flex items-center justify-between">
      <Link
        href="/mapa"
        aria-label="Voltar ao mapa"
        data-voltar
        className="grid size-11 place-items-center rounded-full bg-cinza-voltar text-branco"
      >
        <ChevronLeft size={24} strokeWidth={1.75} aria-hidden />
      </Link>
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="" width={48} height={48} priority className="rounded-[12px]" />
        <span className="text-[24px] font-extrabold leading-8 text-roxo-700">Do Rio à Cuia</span>
      </div>
    </header>
  );

  if (!resultado.ok) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-creme px-5 pt-7 pb-6">
        {cabecalho}
        <section
          data-seal-hero
          data-situacao="erro"
          className="mt-7 rounded-[32px] bg-branco px-6 py-8 text-center"
        >
          <h1 className="text-[28px] font-extrabold leading-9 text-roxo-900">
            Não foi possível conferir agora
          </h1>
          <p className="mt-2 text-[16px] leading-6 text-roxo-texto-2">
            Verifique a internet e tente de novo em instantes.
          </p>
        </section>
        <div className="mt-auto pt-8">
          <Button href={`/p/${slug}`}>Tentar de novo</Button>
        </div>
      </main>
    );
  }

  if (!resultado.ponto) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-creme px-5 pt-7 pb-6">
        {cabecalho}
        <section
          data-seal-hero
          data-situacao="nao-encontrado"
          className="mt-7 rounded-[32px] bg-branco px-6 py-8 text-center"
        >
          <h1 className="text-[28px] font-extrabold leading-9 text-roxo-900">
            Ponto não encontrado
          </h1>
          <p className="mt-2 text-[16px] leading-6 text-roxo-texto-2">
            Este QR code não corresponde a um ponto ativo. Confira no mapa os pontos com selo.
          </p>
        </section>
        <div className="mt-auto pt-8">
          <Button href="/mapa">Ver pontos no mapa</Button>
        </div>
      </main>
    );
  }

  const ponto = resultado.ponto;
  const valido = ponto.situacao === "valido";

  const itens = [
    {
      chave: "ponto",
      icone: <Store size={20} strokeWidth={1.75} aria-hidden />,
      rotulo: "Ponto de venda",
      valor: ponto.nome,
    },
    {
      chave: "programa",
      icone: <ShieldCheck size={20} strokeWidth={1.75} aria-hidden />,
      rotulo: "Programa",
      valor:
        ponto.programa && ponto.orgaoEmissor
          ? `${ponto.programa} - ${ponto.orgaoEmissor}`
          : ponto.programa
            ? ponto.programa
            : "Selo não cadastrado",
    },
    {
      chave: "origem",
      icone: <Waves size={20} strokeWidth={1.75} aria-hidden />,
      rotulo: "Origem do lote",
      valor: ponto.origemLote ?? "Origem não informada",
    },
  ];

  if (valido) {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-creme px-5 pt-7 pb-6">
        {cabecalho}
        <div className="mt-7">
          <SealHero situacao={ponto.situacao} dataValidade={ponto.dataValidade} />
        </div>
        <div className="mt-4">
          <InfoList itens={itens} />
        </div>
        <p
          data-nota-selo
          className="mt-6 px-4 text-center text-[14px] leading-[22px] text-roxo-texto-2"
        >
          O selo é da prefeitura. O Do Rio à Cuia só confere a validade pela data de hoje.
        </p>
        <div className="mt-auto pt-8">
          <Button href="/manual">
            Ver boas práticas do batedor
            <ArrowRight size={22} strokeWidth={2.25} aria-hidden />
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-creme px-5 pt-7 pb-6">
      {cabecalho}
      <div className="mt-7">
        <SealHero situacao={ponto.situacao} dataValidade={ponto.dataValidade} />
      </div>
      <div data-alerta-selo role="note" className="mt-[15px] flex gap-3 rounded-[20px] bg-rosa-alerta px-4 py-3">
        <Info size={20} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0 text-vinho" />
        <p className="text-[15px] leading-[22px] text-vinho">
          Este ponto não tem selo válido hoje. Prefira um ponto com selo no mapa.
        </p>
      </div>
      <div className="mt-3.5">
        <InfoList itens={itens} />
      </div>
      <div className="mt-auto pt-8">
        <Button href="/mapa?filtro=valido" icone={<MapPin size={22} strokeWidth={2} aria-hidden />}>
          Ver pontos com selo válido
          <ArrowRight size={22} strokeWidth={2.25} aria-hidden />
        </Button>
      </div>
    </main>
  );
}
