import { ReactNode } from "react";

export default function Alerta({ children }: { children: ReactNode }) {
  return (
    <p role="alert" data-erro className="rounded-[16px] bg-rosa-alerta px-4 py-3 text-[14px] font-medium leading-5 text-vermelho">
      {children}
    </p>
  );
}
