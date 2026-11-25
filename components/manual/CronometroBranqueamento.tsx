"use client";

import { useEffect, useRef, useState } from "react";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/Button";

const DURACAO = 10_000; // 10 s de choque térmico (Embrapa Amapá)

type Estado = "parado" | "contando" | "pronto";

const STATUS: Record<Estado, string> = {
  parado: "Água a 80 °C. Mergulhe os frutos e toque em Iniciar.",
  contando: "Frutos na água. Aguarde o fim da contagem.",
  pronto: "Pronto! Tire os frutos e resfrie em água potável.",
};

export default function CronometroBranqueamento() {
  const [estado, setEstado] = useState<Estado>("parado");
  const [restante, setRestante] = useState(DURACAO);
  const fim = useRef(0);

  useEffect(() => {
    if (estado !== "contando") return;
    const id = window.setInterval(() => {
      const r = Math.max(0, fim.current - Date.now());
      setRestante(r);
      if (r === 0) {
        setEstado("pronto");
        navigator.vibrate?.([200, 100, 200]);
      }
    }, 100);
    return () => window.clearInterval(id);
  }, [estado]);

  function iniciar() {
    fim.current = Date.now() + DURACAO;
    setRestante(DURACAO);
    setEstado("contando");
  }

  function parar() {
    setEstado("parado");
    setRestante(DURACAO);
  }

  return (
    <section data-cronometro data-estado={estado} aria-label="Cronômetro do branqueamento" className="mt-3.5 rounded-[24px] bg-roxo-900 px-5 pt-4 pb-5 text-branco">
      <p className="flex items-center gap-2 text-[16px] font-semibold leading-6">
        <Timer size={20} strokeWidth={2} aria-hidden />
        Cronômetro do choque térmico
      </p>
      <p data-segundos aria-hidden className="mt-1 text-[48px] font-extrabold leading-[56px] tabular-nums">
        {Math.ceil(restante / 1000)} s
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-branco/20">
        <div
          className="h-full origin-left rounded-full bg-amarelo transition-transform duration-100 ease-linear"
          style={{ transform: `scaleX(${1 - restante / DURACAO})` }}
        />
      </div>
      <p data-status aria-live="polite" className="mt-3 text-[14px] leading-5">
        {STATUS[estado]}
      </p>
      <div className="mt-4">
        {estado === "contando" ? (
          <button
            type="button"
            onClick={parar}
            className="inline-flex h-14 w-full items-center justify-center rounded-full border-[1.5px] border-branco/70 text-[18px] font-bold text-branco transition-transform duration-150 ease-out active:scale-[0.97]"
          >
            Parar
          </button>
        ) : (
          <Button variante="destaque" onClick={iniciar}>
            {estado === "pronto" ? "Recomeçar" : "Iniciar"}
          </Button>
        )}
      </div>
    </section>
  );
}
