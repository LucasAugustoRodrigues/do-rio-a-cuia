"use client";

import { useActionState, startTransition } from "react";
import Link from "next/link";
import { entrar, EstadoForm } from "@/app/auth/actions";
import TextField from "@/components/ui/TextField";
import Alerta from "@/components/ui/Alerta";
import { Button } from "@/components/ui/Button";

export default function FormEntrar({ next }: { next: string }) {
  const [estado, acao, pendente] = useActionState(entrar, {} as EstadoForm);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => acao(fd));
      }}
    >
      <input type="hidden" name="next" value={next} />
      <div data-card-entrar className="mt-5 rounded-[28px] bg-branco px-5 pt-4 pb-3">
        <div className="flex flex-col gap-4">
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
            autoComplete="current-password"
            placeholder="Sua senha"
            erro={estado.campo === "senha"}
          />
        </div>
        <div className="mt-1 flex justify-end">
          <Link href="/recuperar-senha" className="inline-flex min-h-11 items-center text-[15px] font-bold text-azul underline underline-offset-2">
            Esqueci a senha
          </Link>
        </div>
      </div>
      {estado.erro && (
        <div className="mt-3">
          <Alerta>{estado.erro}</Alerta>
        </div>
      )}
      <div className="mt-3">
        <Button type="submit" disabled={pendente}>
          {pendente ? "Entrando…" : "Entrar"}
        </Button>
      </div>
    </form>
  );
}
