import BackButton from "@/components/ui/BackButton";
import FormRegistrar from "@/components/registrar/FormRegistrar";

export default function RegistrarPage() {
  return (
    <div>
      <header className="flex items-center justify-between gap-4">
        <BackButton href="/cotacao" />
        <h1 className="text-[28px] font-extrabold leading-9 text-roxo-900">Registrar preço</h1>
      </header>
      <FormRegistrar />
    </div>
  );
}
