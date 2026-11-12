import CabecalhoTela from "@/components/CabecalhoTela";
import { Button } from "@/components/ui/Button";

export default function RecuperarSenhaPage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pt-[19px] pb-6">
      <CabecalhoTela titulo="Recuperar senha" voltarPara="/entrar" />
      <p className="mt-1.5 text-[15px] leading-6 text-roxo-texto-2">Por enquanto, a troca de senha é feita pela equipe.</p>
      <div data-card-recuperar className="mt-5 rounded-[28px] bg-branco p-5 text-[16px] leading-6 text-roxo-900">
        Procure a equipe do Do Rio à Cuia e informe o telefone da sua conta. Nós criamos uma senha nova para você entrar.
      </div>
      <div className="mt-4">
        <Button href="/entrar">Voltar para Entrar</Button>
      </div>
    </main>
  );
}
