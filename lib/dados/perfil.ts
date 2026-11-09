import { criarClienteServidor } from "@/lib/supabase/server";
import { telefoneDoEmail, formatarTelefone } from "@/lib/dados/conta";

export type Papel = "feirante" | "comprador" | "batedor" | "admin";

export type Perfil = {
  id: string;
  nome: string;
  papel: Papel;
  telefone: string | null;
};

export const ROTULO_PAPEL: Record<Papel, string> = {
  feirante: "Feirante",
  comprador: "Comprador",
  batedor: "Batedor",
  admin: "Administrador",
};

export async function lerPerfilAtual(): Promise<Perfil | null> {
  const supabase = await criarClienteServidor();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("nome, papel")
    .eq("id", user.id)
    .single();
  if (!data) return null;

  const telDigitos = user.email ? telefoneDoEmail(user.email) : null;
  const telefone = telDigitos ? formatarTelefone(telDigitos) : null;

  return { id: user.id, nome: data.nome, papel: data.papel as Papel, telefone };
}
