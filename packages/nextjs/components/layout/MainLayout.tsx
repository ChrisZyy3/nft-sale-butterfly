import type { ReactNode } from "react";
import { BottomNav } from "~~/components/navigation/BottomNav";

export const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#05070F] via-[#081636] to-[#111E3E] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 pb-32 pt-8 sm:px-6 lg:px-10">
        <main className="flex-1">{children}</main>
      </div>
      <BottomNav />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,_rgba(56,130,255,0.35),_transparent_70%)]" />
    </div>
  );
};
