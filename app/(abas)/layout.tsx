import { BottomNav } from "@/components/BottomNav";
import type { ReactNode } from "react";

export default function AbasLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="mx-auto min-h-dvh w-full max-w-[430px] px-5 pt-8 pb-28">
        {children}
      </div>
      <BottomNav />
    </>
  );
}
