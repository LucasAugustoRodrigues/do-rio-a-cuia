import { cookies } from "next/headers";
import { COOKIE_MODO, lerModo } from "@/lib/modo";
import { BottomNav } from "@/components/BottomNav";
import type { ReactNode } from "react";

export default async function AbasLayout({ children }: { children: ReactNode }) {
  const modo = lerModo((await cookies()).get(COOKIE_MODO)?.value);

  return (
    <>
      <div className="mx-auto min-h-dvh w-full max-w-[430px] px-5 pt-8 pb-28">
        {children}
      </div>
      <BottomNav modo={modo} />
    </>
  );
}
