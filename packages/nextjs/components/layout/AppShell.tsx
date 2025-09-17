"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/nft/presale", label: "NFT", icon: NftIcon },
  { href: "/wallet", label: "Wallet", icon: WalletIcon },
] as const;

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname() || "/";

  return (
    <div className="relative flex min-h-dvh flex-col bg-[color:#05060a] text-white">
      <DesktopNav pathname={pathname} />
      <main className="flex-1 pb-24 md:pb-0">{children}</main>
      <MobileNav pathname={pathname} />
    </div>
  );
}

type NavProps = {
  pathname: string;
};

function MobileNav({ pathname }: NavProps) {
  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#1f2432] bg-[color:#0b101a]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-xl items-center justify-between px-6 text-xs uppercase tracking-[0.25em]">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <MobileNavItem key={item.href} {...item} active={isActive} />;
        })}
      </div>
    </nav>
  );
}

type MobileNavItemProps = (typeof NAV_ITEMS)[number] & {
  active: boolean;
};

function MobileNavItem({ href, label, icon: Icon, active }: MobileNavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex h-full flex-col items-center justify-center gap-1 text-[0.68rem] tracking-[0.3em] transition-colors",
        active ? "text-[#20ff6d]" : "text-[#788090]",
      )}
    >
      <Icon active={active} />
      <span>{label}</span>
    </Link>
  );
}

function DesktopNav({ pathname }: NavProps) {
  return (
    <div className="hidden md:block">
      <div className="sticky top-0 z-30 border-b border-[#1f2432] bg-[color:#05060a]/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-6 px-6">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.35em] text-[#20ff6d]">
            <span>Hash Butterfly</span>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="flex items-center gap-6 text-xs uppercase tracking-[0.25em] text-[#788090]">
              {NAV_ITEMS.map(item => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      isActive ? "text-[#20ff6d]" : "hover:text-[#20ff6d]",
                    )}
                  >
                    <item.icon active={isActive} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center">
            <RainbowKitCustomConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
}

type IconProps = {
  active?: boolean;
};

function HomeIcon({ active }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-6", active ? "stroke-[#20ff6d]" : "stroke-current")}
      fill="none"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
    >
      <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5h-5V21H5a1 1 0 0 1-1-1v-8.5Z" />
    </svg>
  );
}

function NftIcon({ active }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-6", active ? "stroke-[#20ff6d]" : "stroke-current")}
      fill="none"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
    >
      <rect height="12" width="12" x="6" y="6" rx="3" />
      <path d="M9.5 9.5 14.5 14.5" />
      <path d="M14.5 9.5 9.5 14.5" />
    </svg>
  );
}

function WalletIcon({ active }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-6", active ? "stroke-[#20ff6d]" : "stroke-current")}
      fill="none"
      strokeWidth={1.6}
      viewBox="0 0 24 24"
    >
      <path d="M4 7a2 2 0 0 1 2-2h12v4H6a2 2 0 0 1-2-2ZM4 11a2 2 0 0 1 2-2h14v8H6a2 2 0 0 1-2-2v-4Z" />
      <circle cx="17" cy="13" r="1.4" fill={active ? "#20ff6d" : "currentColor"} />
    </svg>
  );
}
