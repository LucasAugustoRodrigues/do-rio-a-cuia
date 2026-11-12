"use client";

import { startTransition, useActionState, useState } from "react";
import { registrarPreco, type EstadoPreco } from "@/app/(abas)/registrar/actions";
import { lerValor, valorParaCampo } from "@/lib/formato";
import { Button } from "@/components/ui/Button";
import Alerta from "@/components/ui/Alerta";
import Chip from "@/components/ui/Chip";
import InfoBox from "@/components/ui/InfoBox";

const UNIDADES = [
  ["rasa", "Rasa"],
  ["lata", "Lata"],
] as const;

const QUALIDADES = [
  ["boa", "Boa"],
  ["media", "Média"],
  ["fraca", "Fraca"],
] as const;

export default function FormRegistrar() {
  const [estado, acao, pendente] = useActionState(registrarPreco, {} as EstadoPreco);
  const [unidade, setUnidade] = useState<"rasa" | "lata">("rasa");
  const [qualidade, setQualidade] = useState("");
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(() => acao(fd));
      }}
      className="mt-5"
    >
      <div
        data-card-valor
        className="rounded-[32px] border border-azul bg-branco px-5 pt-[26px] pb-6 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-azul"
      >
        <label htmlFor="campo-valor" className="block text-[16px] leading-6 text-roxo-texto-2">
          Valor pago
        </label>
        <div className="mt-2 flex items-baseline gap-2">
          <span aria-hidden className="text-[36px] font-extrabold leading-[56px] text-azul">R$</span>
          <input
            id="campo-valor"
            name="valor"
            inputMode="decimal"
            autoComplete="off"
            placeholder="0,00"
            defaultValue=""
            aria-invalid={estado.campo === "valor" || undefined}
            onBlur={(e) => {
              const v = lerValor(e.currentTarget.value);
              if (v !== null && v > 0) e.currentTarget.value = valorParaCampo(v);
            }}
            className="h-14 w-full min-w-0 bg-transparent text-[48px] font-extrabold leading-[56px] text-roxo-900 placeholder:text-roxo-texto-2/50 focus:outline-none"
          />
        </div>
      </div>
      {estado.erro && (
        <div className="mt-3" data-erro>
          <Alerta>{estado.erro}</Alerta>
        </div>
      )}
      <fieldset className="mt-4">
        <legend className="text-[18px] font-bold leading-6 text-roxo-700">Unidade</legend>
        <div data-segmented className="mt-2.5 grid grid-cols-2 rounded-[20px] bg-bege-borda p-1">
          {UNIDADES.map(([valor, rotulo]) => (
            <label key={valor} data-unidade={valor} className="group block cursor-pointer">
              <input
                type="radio"
                name="unidade"
                value={valor}
                checked={unidade === valor}
                onChange={() => setUnidade(valor)}
                className="sr-only"
              />
              <span className="flex h-[46px] items-center justify-center rounded-[16px] text-[18px] font-bold text-roxo-700 group-has-[:checked]:bg-roxo-700 group-has-[:checked]:text-branco group-has-[:focus-visible]:outline-2 group-has-[:focus-visible]:outline-offset-2 group-has-[:focus-visible]:outline-azul">
                {rotulo}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-3.5">
        <InfoBox>1 rasa = 2 latas. Se você informar a lata, convertemos para rasa automaticamente.</InfoBox>
      </div>
      <fieldset className="mt-7">
        <legend className="text-[15px] font-medium leading-6 text-roxo-900">
          Qualidade <span className="font-normal text-roxo-texto-2">- opcional</span>
        </legend>
        <input type="hidden" name="qualidade" value={qualidade} />
        <div className="mt-2 flex flex-wrap gap-2.5">
          {QUALIDADES.map(([valor, rotulo]) => (
            <Chip key={valor} selecionado={qualidade === valor} onClick={() => setQualidade(qualidade === valor ? "" : valor)}>
              {rotulo}
            </Chip>
          ))}
        </div>
      </fieldset>
      <div aria-hidden className="h-24" />
      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto w-[calc(100%-40px)] max-w-[390px]">
        <p className="mb-2.5 text-center text-[14px] leading-5 text-roxo-900">Seu nome não aparece na cotação</p>
        <Button type="submit" disabled={pendente}>
          {pendente ? "Enviando…" : "Enviar preço"}
        </Button>
      </div>
    </form>
  );
}
