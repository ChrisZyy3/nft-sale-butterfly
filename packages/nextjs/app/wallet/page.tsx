"use client";

import type { ReactNode } from "react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { cn } from "@/lib/utils";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const walletItems = [
  {
    title: "ETH Balance",
    value: "0.256 ETH",
    accent: "#20ff6d",
    highlight: true,
    icon: EthTokenIcon,
  },
  {
    title: "Assets",
    value: "butterfly",
    accent: "#ffb547",
    icon: AssetsIcon,
  },
  {
    title: "Friends",
    value: "9999999999.0",
    accent: "#ff5f66",
    icon: FriendsIcon,
  },
  {
    title: "NFT",
    value: "100",
    accent: "#4c7dff",
    icon: ButterflyIcon,
  },
  {
    title: "Orders",
    value: "0",
    accent: "#9b6bff",
    icon: OrderIcon,
  },
] satisfies WalletItem[];

type WalletItem = {
  title: string;
  value: string;
  accent: string;
  icon?: (props: { accent: string }) => ReactNode;
  highlight?: boolean;
};

export default function WalletPage() {
  return (
    <div className="pb-24 pt-2 md:pb-16">
      <ScreenHeader title="Wallet" />
      <section className="hb-container flex flex-col gap-4">
        <div className="rounded-3xl border border-[#1f2432] bg-[#10131c] px-6 py-7 text-center shadow-[0_50px_120px_-80px_rgba(32,255,109,0.45)]">
          <h1 className="text-xl font-semibold uppercase tracking-[0.32em] text-[#20ff6d]">ETH Balance</h1>
          <p className="mt-4 text-3xl font-semibold text-white">0.256 ETH</p>
        </div>
        <div className="flex flex-col gap-3">
          {walletItems.map(item => {
            if (item.highlight) {
              return <ConnectWalletCard key={item.title} item={item} />;
            }

            const Icon = item.icon;
            return (
              <button
                key={item.title}
                type="button"
                className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-[22px] border border-[#1f2432] bg-[#10131c] px-5 py-4 text-left transition hover:border-[#20ff6d] hover:bg-[#141924]"
              >
                <span className="relative z-10 flex items-center gap-4">
                  <span
                    className="relative grid size-12 place-items-center overflow-hidden rounded-2xl border border-[#1f2432] bg-[#141924]"
                    style={{ boxShadow: `0 18px 60px -32px ${hexToRgba(item.accent, 0.55)}` }}
                  >
                    {Icon ? <Icon accent={item.accent} /> : null}
                  </span>
                  <span className="text-base font-semibold uppercase tracking-[0.18em] text-white">{item.title}</span>
                </span>
                <span className="relative z-10 text-sm font-semibold uppercase tracking-[0.18em] text-white transition group-hover:text-[#20ff6d]">
                  {item.value}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

type ConnectWalletCardProps = {
  item: WalletItem;
};

function ConnectWalletCard({ item }: ConnectWalletCardProps) {
  const Icon = item.icon;

  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openConnectModal, authenticationStatus }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

        const handleClick = () => {
          if (!connected) {
            openConnectModal?.();
            return;
          }
          openAccountModal?.();
        };

        return (
          <button
            type="button"
            onClick={handleClick}
            className={cn(
              "group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-[22px] border border-transparent bg-[#10131c] px-5 py-4 text-left transition hover:border-[#20ff6d] hover:bg-[#141924]",
            )}
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[22px] border border-[#20ff6d]/80"
              style={{ boxShadow: "0 26px 90px -60px rgba(32,255,109,0.85)" }}
            />
            <span className="relative z-10 flex items-center gap-4">
              <span
                className="relative grid size-12 place-items-center overflow-hidden rounded-2xl border border-[#1f2432] bg-[#141924]"
                style={{ boxShadow: `0 18px 60px -32px ${hexToRgba(item.accent, 0.6)}` }}
              >
                {Icon ? <Icon accent={item.accent} /> : null}
              </span>
              <span className="text-base font-semibold uppercase tracking-[0.18em] text-white">{item.title}</span>
            </span>
            <span className="relative z-10 flex flex-col items-end text-right text-white transition group-hover:text-[#20ff6d]">
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">{item.value}</span>
              {connected ? (
                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#20ff6d]">
                  {account.displayName}
                </span>
              ) : null}
            </span>
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function AssetsIcon({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6">
      <rect x="6" y="6" width="12" height="12" rx="3" fill={hexToRgba(accent, 0.12)} />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FriendsIcon({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6">
      <path d="M7 17c0-2.21 1.79-4 4-4s4 1.79 4 4" strokeLinecap="round" />
      <path d="M5 17.5c0-2 1.5-3.5 3.5-3.5" strokeLinecap="round" />
      <path d="M19 17.5c0-2-1.5-3.5-3.5-3.5" strokeLinecap="round" />
      <circle cx="8.5" cy="9" r="2.5" fill={hexToRgba(accent, 0.18)} />
      <circle cx="15.5" cy="9" r="2.5" fill={hexToRgba(accent, 0.12)} />
    </svg>
  );
}

function ButterflyIcon({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6">
      <path
        d="M12 12c3.4-5.5 7.2-7.5 9-8-1 3.2-2.8 5.7-5 7 2 0.6 3.7 2.8 3 5-2.3-0.2-4.6-1.7-6-3.2-0.7 1.8-1.5 4.5-2 6.2-0.5-1.7-1.4-4.4-2-6.2-1.4 1.5-3.7 3-6 3.2-0.7-2.2 1-4.4 3-5-2.1-1.3-4-3.8-5-7 1.8 0.5 5.6 2.5 9 8Z"
        fill={hexToRgba(accent, 0.15)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 8a2 2 0 0 1 2 0" strokeLinecap="round" />
    </svg>
  );
}

function OrderIcon({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6">
      <rect x="4" y="5" width="16" height="14" rx="2" fill={hexToRgba(accent, 0.15)} />
      <path d="M8 9h8" strokeLinecap="round" />
      <path d="M8 13h8" strokeLinecap="round" />
      <path d="M8 17h5" strokeLinecap="round" />
    </svg>
  );
}

function EthTokenIcon({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" width="20" height="24" viewBox="0 0 20 24" fill="none">
      <path d="M10 2 16.5 12.25 10 9.6 3.5 12.25 10 2Z" fill={accent} fillOpacity={0.9} />
      <path d="M10 9.6 16.5 12.25 10 15 3.5 12.25 10 9.6Z" fill={hexToRgba(accent, 0.65)} />
      <path d="M10 16.4 16.5 13.35 10 22 3.5 13.35 10 16.4Z" fill={hexToRgba(accent, 0.4)} />
    </svg>
  );
}
