"use server";

import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { lerValor } from "@/lib/formato";

export type EstadoPreco = { erro?: string; campo?: "valor" | "unidade" };

const QUALIDADES = ["boa", "media", "fraca"];

export async function registrarPreco(estado: EstadoPreco, formData: FormData): Promise<EstadoPreco> {
  const texto = String(formData.get("valor") ?? "").trim();
  const unidade = String(formData.get("unidade") ?? "");
  const q = String(formData.get("qualidade") ?? "");
  if (!texto) return { erro: "Informe o valor pago.", campo: "valor" };
  const valor = lerValor(texto);
  if (valor === null) return { erro: "Use só números e vírgula, como 128,50.", campo: "valor" };
  if (valor <= 0) return { erro: "Informe um valor maior que zero.", campo: "valor" };
  if (valor > 1000) return { erro: "O valor vai até R$ 1.000,00.", campo: "valor" };
  if (unidade !== "rasa" && unidade !== "lata") return { erro: "Escolha a unidade: rasa ou lata.", campo: "unidade" };
  const qualidade = QUALIDADES.includes(q) ? q : null;

  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar?next=%2Fregistrar");

  // registrado_em, local e em_revisao ficam com o banco (D-025).
  const { data, error } = await supabase
    .from("precos")
    .insert({ usuario_id: user.id, unidade, valor, qualidade })
    .select("id")
    .single();
  if (error || !data) return { erro: "Não foi possível enviar agora. Tente de novo em instantes." };
  redirect(`/registrar/enviado?id=${data.id}`);
}
