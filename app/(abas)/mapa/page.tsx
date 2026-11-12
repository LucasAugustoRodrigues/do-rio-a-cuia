import Alerta from "@/components/ui/Alerta";
import TelaMapa from "@/components/mapa/TelaMapa";
import { lerPontos } from "@/lib/dados/pontos";

type Props = {
  searchParams: Promise<{ filtro?: string | string[] }>;
};

export default async function MapaPage({ searchParams }: Props) {
  const { filtro } = await searchParams;
  const filtroStr = Array.isArray(filtro) ? filtro[0] : filtro;
  const filtroInicial =
    filtroStr === "valido" || filtroStr === "vencido" ? filtroStr : "todos";

  const pontos = await lerPontos();

  return (
    <>
      <h1 className="sr-only">Pontos de açaí</h1>
      {pontos ? (
        <TelaMapa pontos={pontos} filtroInicial={filtroInicial} />
      ) : (
        <div className="p-4">
          <Alerta>Não foi possível carregar os pontos agora. Tente de novo em instantes.</Alerta>
        </div>
      )}
    </>
  );
}
