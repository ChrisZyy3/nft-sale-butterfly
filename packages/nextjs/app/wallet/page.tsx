"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useWatchBalance } from "@/hooks/scaffold-eth/useWatchBalance";
import {
  INVITE_PARAM_KEY,
  PROMOTION_RULES,
  REFERRAL_EVENT_NAME,
  createInviteCode,
  getReferralCount,
} from "@/lib/invite";
import { cn } from "@/lib/utils";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import type { Address } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const BASE_WALLET_ITEMS = [
  {
    title: "ETH Balance",
    value: "0 ETH",
    accent: "#20ff6d",
    highlight: true,
    icon: EthTokenIcon,
  },
  {
    title: "Assets",
    value: "0",
    accent: "#ffb547",
    icon: AssetsIcon,
  },
  {
    title: "Friends",
    value: "0",
    accent: "#ff5f66",
    icon: FriendsIcon,
  },
  {
    title: "NFT",
    value: "0",
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
  const { address, chain: connectedChain } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: balanceData } = useWatchBalance({
    address,
    chainId: connectedChain?.id,
    query: { enabled: Boolean(address) },
  });

  const { data: ownedNftCount } = useScaffoldReadContract({
    contractName: "ButterflyPresale",
    functionName: "balanceOf",
    args: [address] as readonly [Address | undefined],
    query: {
      enabled: Boolean(address),
    },
  });
  const mintedCount = ownedNftCount ? Number(ownedNftCount) : 0;
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    if (!address) {
      setReferralCount(0);
      return;
    }

    const updateReferralCount = () => {
      setReferralCount(getReferralCount(address));
    };

    updateReferralCount();

    if (typeof window === "undefined") {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== "hb-referral-stats") {
        return;
      }
      updateReferralCount();
    };

    const handleReferralEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ address?: string }>;
      const eventAddress = customEvent.detail?.address;
      if (!eventAddress || !address) {
        updateReferralCount();
        return;
      }
      if (eventAddress.toLowerCase() === address.toLowerCase()) {
        updateReferralCount();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(REFERRAL_EVENT_NAME, handleReferralEvent);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(REFERRAL_EVENT_NAME, handleReferralEvent);
    };
  }, [address]);

  const walletItems = useMemo(() => {
    return BASE_WALLET_ITEMS.map(item => {
      if (item.title === "NFT") {
        return { ...item, value: String(mintedCount) };
      }
      if (item.title === "Friends") {
        return { ...item, value: String(referralCount) };
      }
      return item;
    });
  }, [mintedCount, referralCount]);

  const formattedBalance = balanceData ? formatBalanceForDisplay(balanceData) : undefined;
  const isConnected = Boolean(address && connectedChain);
  const inviteCode = createInviteCode(address);
  const hasInviteAccess = isConnected && mintedCount > 0;
  return (
    <div className="pb-24 pt-2 md:pb-16">
      <ScreenHeader title="Wallet" />
      <section className="hb-container flex flex-col gap-4">
        <div className="rounded-3xl border border-[#1f2432] bg-[#10131c] px-6 py-7 text-center shadow-[0_50px_120px_-80px_rgba(32,255,109,0.45)]">
          <h1 className="text-xl font-semibold uppercase tracking-[0.32em] text-[#20ff6d]">Hash Butterfly</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#9ca3b0]">
            Welcome to the Hash Butterfly Metaverse Ecology.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {walletItems.map(item => {
            if (item.highlight) {
              return <ConnectWalletCard key={item.title} item={item} balance={formattedBalance} />;
            }

            const Icon = item.icon;
            const handleItemClick = () => {
              if (!isConnected) {
                openConnectModal?.();
              }
            };
            return (
              <button
                key={item.title}
                type="button"
                onClick={handleItemClick}
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
                <span
                  className={cn(
                    "relative z-10 text-white transition group-hover:text-[#20ff6d]",
                    isConnected ? "text-sm font-semibold uppercase tracking-[0.18em]" : "flex items-center",
                  )}
                >
                  {isConnected ? item.value : <ArrowRightIcon />}
                </span>
              </button>
            );
          })}
        </div>
        <InviteLinkSection
          isConnected={isConnected}
          inviteCode={inviteCode}
          mintedCount={mintedCount}
          referralCount={referralCount}
          hasInviteAccess={hasInviteAccess}
        />
      </section>
    </div>
  );
}

type ConnectWalletCardProps = {
  item: WalletItem;
  balance?: string;
};

function ConnectWalletCard({ item, balance }: ConnectWalletCardProps) {
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
            className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-[22px] border border-transparent bg-[#10131c] px-5 py-4 text-left transition hover:border-[#20ff6d] hover:bg-[#141924]"
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
            <span
              className={cn(
                "relative z-10 text-white transition group-hover:text-[#20ff6d]",
                connected ? "flex flex-col items-end text-right" : "flex items-center",
              )}
            >
              {connected ? (
                <>
                  <span className="text-sm font-semibold uppercase tracking-[0.18em]">{balance ?? item.value}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#20ff6d] group-hover:text-[#20ff6d]">
                    {account.displayName}
                  </span>
                </>
              ) : (
                <ArrowRightIcon />
              )}
            </span>
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

type InviteLinkSectionProps = {
  isConnected: boolean;
  inviteCode: string | null;
  mintedCount: number;
  referralCount: number;
  hasInviteAccess: boolean;
};

function InviteLinkSection({
  isConnected,
  inviteCode,
  mintedCount,
  referralCount,
  hasInviteAccess,
}: InviteLinkSectionProps) {
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  useEffect(() => {
    if (!hasInviteAccess) {
      setHasGenerated(false);
      setCopyState("idle");
    }
  }, [hasInviteAccess]);

  useEffect(() => {
    if (!inviteCode || !hasInviteAccess) {
      setInviteLink(null);
      return;
    }

    if (typeof window === "undefined") {
      return;
    }

    try {
      const url = new URL("/nft/presale", window.location.origin);
      url.searchParams.set(INVITE_PARAM_KEY, inviteCode);
      setInviteLink(url.toString());
    } catch (error) {
      console.error("Failed to create invite link", error);
      setInviteLink(null);
    }
  }, [inviteCode, hasInviteAccess]);

  useEffect(() => {
    if (copyState !== "copied") {
      return;
    }

    const timeout = window.setTimeout(() => {
      setCopyState("idle");
    }, 2500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [copyState]);

  const handleGenerate = async () => {
    if (!inviteLink) {
      return;
    }

    setHasGenerated(true);

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(inviteLink);
        setCopyState("copied");
        return;
      } catch (error) {
        console.error("Failed to copy invite link", error);
      }
    }

    setCopyState("error");
  };

  const handleCopy = async () => {
    if (!inviteLink) {
      return;
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(inviteLink);
        setCopyState("copied");
        return;
      } catch (error) {
        console.error("Failed to copy invite link", error);
      }
    }

    setCopyState("error");
  };

  const renderInviteContent = () => {
    if (!isConnected) {
      return <p className="text-sm text-[#9ca3b0]">连接钱包后即可查看您的推广状态。</p>;
    }

    if (!hasInviteAccess) {
      return <p className="text-sm text-[#9ca3b0]">完成至少一枚NFT的购买后，即可生成专属邀请码并邀请好友加入。</p>;
    }

    return (
      <div className="space-y-3">
        <button
          type="button"
          onClick={handleGenerate}
          className="w-full rounded-2xl bg-[#20ff6d] px-4 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#1ae058]"
        >
          {copyState === "copied" ? "邀请码已复制" : "生成邀请码"}
        </button>
        {hasGenerated && inviteLink ? (
          <div className="rounded-2xl border border-[#1f2432] bg-[#141924] px-4 py-3">
            <p className="text-xs text-[#9ca3b0]">分享以下链接邀请好友加入预售：</p>
            <p className="mt-2 break-all font-mono text-xs text-[#20ff6d]">{inviteLink}</p>
            <button
              type="button"
              onClick={handleCopy}
              className="mt-3 w-full rounded-xl border border-[#20ff6d] px-3 py-2 text-xs font-semibold text-[#20ff6d] transition hover:bg-[#20ff6d]/10"
            >
              {copyState === "copied" ? "复制成功" : "复制链接"}
            </button>
          </div>
        ) : null}
        {copyState === "error" ? (
          <p className="text-xs text-[#ff5f66]">浏览器无法自动复制，请手动选择上方链接进行复制。</p>
        ) : null}
      </div>
    );
  };

  const rewardUnlocked = referralCount >= 1;

  return (
    <section className="rounded-3xl border border-[#1f2432] bg-[#10131c] px-6 py-6 text-white">
      <h2 className="text-lg font-semibold uppercase tracking-[0.24em] text-[#20ff6d]">推广中心</h2>
      <p className="mt-2 text-sm text-[#9ca3b0]">按照以下规则邀请好友加入Hash Butterfly生态：</p>
      <ol className="mt-4 space-y-2 text-sm text-[#9ca3b0]">
        {PROMOTION_RULES.map((rule, index) => (
          <li key={rule} className="flex gap-2">
            <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#20ff6d] text-[10px] font-semibold text-black">
              {index + 1}
            </span>
            <span>{rule}</span>
          </li>
        ))}
      </ol>
      <div className="mt-6 space-y-3">
        <div className="rounded-2xl border border-[#1f2432] bg-[#141924] px-4 py-3 text-sm text-[#9ca3b0]">
          <p>
            已购NFT数量：<span className="font-semibold text-white">{mintedCount}</span>
          </p>
          <p className="mt-2">
            有效邀请人数：<span className="font-semibold text-white">{referralCount}</span>
          </p>
          <p className="mt-2 text-xs text-[#6c7280]">
            {rewardUnlocked ? "已解锁邀请奖励，继续邀请可获得更多惊喜。" : "完成首个有效邀请后即可解锁邀请奖励。"}
          </p>
        </div>
        {renderInviteContent()}
      </div>
    </section>
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

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M5 10h8.5" strokeLinecap="round" />
      <path d="m10.5 6.5 3.5 3.5-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatBalanceForDisplay(balance: { formatted: string; symbol: string }) {
  const numericValue = Number.parseFloat(balance.formatted);

  if (!Number.isFinite(numericValue)) {
    return `${balance.formatted} ${balance.symbol}`;
  }

  const fractionDigits = numericValue >= 1 ? 4 : 6;
  const formattedNumber = numericValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });

  if (numericValue !== 0 && formattedNumber === "0") {
    return `${numericValue.toPrecision(4)} ${balance.symbol}`;
  }

  return `${formattedNumber} ${balance.symbol}`;
}
