import { redirect } from "next/navigation";
import { lerPerfilAtual, ROTULO_PAPEL } from "@/lib/dados/perfil";
import { sair } from "@/app/auth/actions";
import { Button } from "@/components/ui/Button";

export default async function PerfilPage() {
  const perfil = await lerPerfilAtual();
  if (!perfil) redirect("/entrar?next=%2Fperfil");

  return (
    <div>
      <h1 className="text-[28px] font-extrabold leading-9 text-roxo-900">Olá, {perfil.nome}</h1>
      <p className="mt-3">
        <span data-perfil-papel className="inline-flex h-8 items-center rounded-full bg-amarelo px-3 text-[14px] font-semibold text-roxo-900">
          {ROTULO_PAPEL[perfil.papel]}
        </span>
      </p>
      {perfil.telefone && (
        <p data-perfil-telefone className="mt-3 text-[16px] text-roxo-texto-2">
          {perfil.telefone}
        </p>
      )}
      <p className="mt-1 text-[16px] text-roxo-texto-2">O perfil completo chega no PR#5.</p>
      <form action={sair} className="mt-8">
        <Button type="submit" variante="contornado">Sair da conta</Button>
      </form>
    </div>
  );
}
