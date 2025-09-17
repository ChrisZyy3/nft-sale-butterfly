"use client";

import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SparklesIcon, WalletIcon } from "@heroicons/react/24/outline";

const NAV_ITEMS: Array<{
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  { href: "/", label: "Home", Icon: HomeIcon },
  { href: "/nft", label: "NFT", Icon: SparklesIcon },
  { href: "/wallet", label: "Wallet", Icon: WalletIcon },
];

export const BottomNav = () => {
  const pathname = usePathname() ?? "/";

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-full max-w-3xl -translate-x-1/2 px-4 sm:px-6">
      <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-medium text-white shadow-lg backdrop-blur">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive =
            pathname === href ||
            (href !== "/" && pathname.startsWith(`${href}`)) ||
            (href === "/" && pathname.startsWith("/oldhome"));

          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-1 transition-colors ${
                isActive ? "text-white" : "text-white/70 hover:text-white"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs sm:text-sm">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
