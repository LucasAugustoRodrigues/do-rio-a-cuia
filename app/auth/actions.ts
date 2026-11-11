"use server";

import { redirect } from "next/navigation";
import { criarClienteServidor } from "@/lib/supabase/server";
import { normalizarTelefone, emailDoTelefone } from "@/lib/dados/conta";
import { destinoSeguro } from "@/lib/supabase/rotas";

export type EstadoForm = {
  erro?: string;
  campo?: "nome" | "telefone" | "senha" | "papel";
};

function mensagemDoErro(codigo?: string): EstadoForm {
  switch (codigo) {
    case "invalid_credentials":
      return { erro: "Telefone ou senha incorretos." };
    case "user_already_exists":
    case "email_exists":
      return { erro: "Este telefone já tem conta. Entre com ele ou fale com a equipe.", campo: "telefone" };
    case "weak_password":
      return { erro: "Senha fraca. Use pelo menos 8 caracteres, com letras e números.", campo: "senha" };
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return { erro: "Muitas tentativas agora. Espere alguns minutos e tente de novo." };
    case "email_not_confirmed":
      return { erro: "Esta conta ainda não foi liberada. Fale com a equipe do Do Rio à Cuia." };
    case "signup_disabled":
      return { erro: "Cadastro fechado no momento. Fale com a equipe." };
    default:
      return { erro: "Não foi possível concluir agora. Tente de novo em instantes." };
  }
}

export async function entrar(estado: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const telefone = String(formData.get("telefone") ?? "");
  const senha = String(formData.get("senha") ?? "");
  const next = String(formData.get("next") ?? "");

  const tel = normalizarTelefone(telefone ?? "");
  if (!tel) return { erro: "Informe o telefone com DDD.", campo: "telefone" };
  if (!senha) return { erro: "Informe sua senha.", campo: "senha" };

  const supabase = await criarClienteServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email: emailDoTelefone(tel),
    password: senha,
  });

  if (error) return mensagemDoErro(error.code);

  redirect(destinoSeguro(next));
}

export async function criarConta(estado: EstadoForm, formData: FormData): Promise<EstadoForm> {
  const nomeRaw = String(formData.get("nome") ?? "");
  const telefone = String(formData.get("telefone") ?? "");
  const senha = String(formData.get("senha") ?? "");
  const papel = String(formData.get("papel") ?? "");
  const next = String(formData.get("next") ?? "");

  const nome = (nomeRaw ?? "").trim().replace(/\s+/g, " ");

  if (nome.length < 2 || nome.length > 60) return { erro: "Informe seu nome.", campo: "nome" };

  const tel = normalizarTelefone(telefone ?? "");
  if (!tel) return { erro: "Informe o telefone com DDD.", campo: "telefone" };

  if (senha.length < 8) return { erro: "A senha precisa de pelo menos 8 caracteres.", campo: "senha" };
  if (senha.length > 72) return { erro: "Use no máximo 72 caracteres.", campo: "senha" };

  if (!["feirante", "comprador", "batedor"].includes(papel)) {
    return { erro: "Escolha o tipo de conta.", campo: "papel" };
  }

  const supabase = await criarClienteServidor();
  const { data, error } = await supabase.auth.signUp({
    email: emailDoTelefone(tel),
    password: senha,
    options: { data: { nome, papel } },
  });

  if (error) return mensagemDoErro(error.code);
  if (!data.session) return { erro: "Conta criada, mas não deu para entrar agora. Entre com seu telefone e senha." };

  redirect(destinoSeguro(next, papel === "batedor" ? "/manual" : "/cotacao"));
}

export async function sair(): Promise<void> {
  const supabase = await criarClienteServidor();
  await supabase.auth.signOut();
  redirect("/");
}
