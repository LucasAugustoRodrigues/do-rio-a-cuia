"use client";

import { useActionState, startTransition, useState } from "react";
import { Store, User, ListChecks } from "lucide-react";
import { criarConta, EstadoForm } from "@/app/auth/actions";
import TextField from "@/components/ui/TextField";
import Alerta from "@/components/ui/Alerta";
import { Button } from "@/components/ui/Button";

type PapelOpcao = "feirante" | "comprador" | "batedor";

const opcoes: { valor: PapelOpcao; rotulo: string; Icone: React.ElementType; ajuda: string }[] = [
  {
    valor: "feirante",
    rotulo: "Feirante",
    Icone: Store,
    ajuda: "Feirante: registra os preços pagos na Feira do Açaí.",
  },
  {
    valor: "comprador",
    rotulo: "Comprador",
    Icone: User,
    ajuda: "Comprador: registra o que pagou e acompanha a cotação.",
  },
  {
    valor: "batedor",
    rotulo: "Batedor",
    Icone: ListChecks,
    ajuda: "Batedor: tem um ponto de açaí e usa o manual de boas práticas.",
  },
];

export default function FormCriarConta({ next }: { next: string }) {
  const [estado, acao, pendente] = useActionState(criarConta, {} as EstadoForm);
  const [papel, setPapel] = useState<PapelOpcao>("feirante");

  const ajuda = opcoes.find((o) => o.valor === papel)!.ajuda;

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => acao(fd));
      }}
      className="mt-3 flex flex-1 flex-col"
    >
      <input type="hidden" name="next" value={next} />
      <div className="flex flex-col gap-3">
        <TextField
          rotulo="Nome"
          name="nome"
          autoComplete="name"
          placeholder="Seu nome"
          erro={estado.campo === "nome"}
        />
        <TextField
          rotulo="Telefone"
          name="telefone"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(91) 99999-9999"
          erro={estado.campo === "telefone"}
        />
        <TextField
          rotulo="Senha"
          name="senha"
          type="password"
          autoComplete="new-password"
          placeholder="Mínimo de 8 caracteres"
          erro={estado.campo === "senha"}
        />
      </div>
      <fieldset className="mt-4">
        <legend className="text-[15px] font-medium leading-6 text-roxo-900">Tipo de conta</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-3">
          {opcoes.map(({ valor, rotulo, Icone }) => (
            <label key={valor} data-tipo-conta={valor} className="group block cursor-pointer">
              <input
                type="radio"
                name="papel"
                value={valor}
                checked={papel === valor}
                onChange={() => setPapel(valor)}
                className="sr-only"
              />
              <span
                data-cartao
                className="flex h-20 flex-col items-center justify-center gap-2 rounded-[18px] border-[1.5px] border-bege-borda bg-branco group-has-[:checked]:border-roxo-900 group-has-[:checked]:bg-roxo-700 group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-azul"
              >
                <Icone size={24} strokeWidth={1.75} aria-hidden className="text-roxo-700 group-has-[:checked]:text-branco" />
                <span className="text-[15px] font-medium leading-5 text-roxo-900 group-has-[:checked]:text-branco">
                  {rotulo}
                </span>
              </span>
            </label>
          ))}
        </div>
        <p data-ajuda-tipo aria-live="polite" className="mt-2.5 min-h-10 text-[14px] leading-5 text-roxo-texto-2">
          {ajuda}
        </p>
      </fieldset>
      {estado.erro && (
        <div className="mt-3">
          <Alerta>{estado.erro}</Alerta>
        </div>
      )}
      <div className="min-h-8 flex-1" />
      <Button type="submit" disabled={pendente}>
        {pendente ? "Criando conta…" : "Criar conta"}
      </Button>
    </form>
  );
}
