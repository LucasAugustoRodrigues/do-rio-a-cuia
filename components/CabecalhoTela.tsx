import BackButton from "@/components/ui/BackButton";

export default function CabecalhoTela({ titulo, voltarPara }: { titulo: string; voltarPara: string }) {
  return (
    <header className="flex items-center gap-6">
      <BackButton href={voltarPara} />
      <h1 className="text-[28px] font-extrabold leading-9 text-roxo-900">{titulo}</h1>
    </header>
  );
}
