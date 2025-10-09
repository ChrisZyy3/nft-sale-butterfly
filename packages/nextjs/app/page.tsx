"use client";

import type { ComponentProps, ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import mallPreview from "@/images/mal.jpg";
import nftPreview from "@/images/nft.jpg";
import walletPreview from "@/images/wallet.jpg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { decodeEventLog } from "viem";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

const BSC_TESTNET_CHAIN_ID = 97;
const BUTTERFLY_CONTRACT_ADDRESS = "0xD3E517C3ffDa92D560378A70ee7F717d51e34d70" as const;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

const BUTTERFLY_ABI = [
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getReferralInfo",
    outputs: [
      { internalType: "address", name: "referrer", type: "address" },
      { internalType: "uint256", name: "referralCount", type: "uint256" },
      { internalType: "uint256", name: "totalRewards", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "invitationCode", type: "bytes32" }],
    name: "bindReferrerByInvitationCode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "referrer", type: "address" }],
    name: "bindReferrerByAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "referrer", type: "address" },
    ],
    name: "ReferralSet",
    type: "event",
  },
] as const;

const heroHighlights = [
  {
    title: "Genesis collection",
    description: "9,999 cinematic butterflies evolving through six narrative chapters.",
  },
  {
    title: "Global co-creation",
    description: "Builders, artists and fans collaborate to expand the metamorphosis storyworld.",
  },
];

const featureCards = [
  {
    id: "nft",
    label: "NFT",
    title: "Hash butterfly NFT series",
    description:
      "Collect the officially sculpted butterflies that chronicle each stage of the Hash metamorphosis with ultra-real lighting and fluid animation details.",
    accent: "#4cff99",
    gradient: "from-[#0b2316] via-[#081810] to-[#030907]",
    border: "#1f5132",
    image: nftPreview,
  },
  {
    id: "mall",
    label: "Mall",
    title: "Hash butterfly immersive mall",
    description:
      "Discover phygital drops, storytelling pop-ups and brand collaborations engineered for the community to experience together.",
    accent: "#c7b3ff",
    gradient: "from-[#1b0f2e] via-[#12091f] to-[#06030d]",
    border: "#432f6e",
    image: mallPreview,
  },
  {
    id: "wallet",
    label: "Wallet",
    title: "Hash butterfly wallet",
    description:
      "Secure assets, stake HASH and unlock gated activations across the ecosystem with a wallet crafted for collectors and creators.",
    accent: "#58f2ff",
    gradient: "from-[#07212a] via-[#05171f] to-[#02090c]",
    border: "#1c4b59",
    image: walletPreview,
  },
];

const ecosystemBullets = [
  "Immersive narrative missions that evolve with every chapter release.",
  "Phygital mall activations that bridge virtual identities and real-world style.",
  "Creator treasury funding community-led collaborations and live spectacles.",
];

const tokenStats = [
  { label: "Token name", value: "HASH" },
  { label: "Public chain", value: "BSC Testnet" },
  { label: "Issuance", value: "900 trillion" },
  { label: "Circulation", value: "100 trillion" },
];

type IconProps = ComponentProps<"svg">;

type NavItem = {
  label: string;
  href: string;
  Icon: (props: IconProps) => ReactElement;
};

const navItems: NavItem[] = [
  { label: "Home", Icon: HomeIcon, href: "/" },
  { label: "NFT", Icon: ArtIcon, href: "/nft" },
  { label: "Mall", Icon: MallIcon, href: "/mall" },
  { label: "Token", Icon: TokenIcon, href: "/token" },
  { label: "More", Icon: MenuIcon, href: "/more" },
];

export default function HomeLanding() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient({ chainId: BSC_TESTNET_CHAIN_ID });
  const openConnectModalRef = useRef<(() => void) | null>(null);

  const [incomingRefCode, setIncomingRefCode] = useState<string | null>(null);
  const [incomingRefAddress, setIncomingRefAddress] = useState<string | null>(null);
  const [isBindDialogOpen, setIsBindDialogOpen] = useState(false);
  const [isBindingReferrer, setIsBindingReferrer] = useState(false);
  const [isBindingByAddress, setIsBindingByAddress] = useState(false);

  const { data: referralInfo, refetch: refetchReferralInfo } = useReadContract({
    address: BUTTERFLY_CONTRACT_ADDRESS,
    abi: BUTTERFLY_ABI,
    functionName: "getReferralInfo",
    args: [(address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`],
    chainId: BSC_TESTNET_CHAIN_ID,
    query: {
      enabled: Boolean(address),
    },
  });

  const referrerAddress =
    referralInfo && Array.isArray(referralInfo)
      ? ((referralInfo as readonly [string, bigint, bigint])[0] as string)
      : ZERO_ADDRESS;

  // URL parameter detection
  useEffect(() => {
    // Handle URL parameters
    if (typeof window === "undefined") return;

    const url = new URL(window.location.href);
    const params = url.searchParams;

    // Handle refaddress parameter
    const refAddress = params.get("refaddress");
    if (refAddress) {
      console.log("🔗 检测到推荐人地址参数", {
        refaddress: refAddress,
        isValidFormat: /^0x[0-9a-fA-F]{40}$/.test(refAddress),
        timestamp: new Date().toISOString(),
      });

      if (/^0x[0-9a-fA-F]{40}$/.test(refAddress)) {
        setIncomingRefAddress(refAddress);
        // Only show binding dialog when user has referrer address and not connected
        if (!isConnected) {
          console.log("🔗 推荐人地址检测完成，等待用户手动触发绑定");
        }
      } else {
        console.warn("⚠️ 无效的推荐人地址格式", {
          refaddress: refAddress,
          expectedFormat: "0x + 40 hex characters",
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Log any other unexpected parameters
    const knownParams = ["refcode", "refaddress"];
    const unknownParams = Array.from(params.keys()).filter(key => !knownParams.includes(key));
    if (unknownParams.length > 0) {
      console.log("❓ 检测到未知参数", {
        unknownParameters: unknownParams.map(key => ({
          name: key,
          value: params.get(key),
        })),
        timestamp: new Date().toISOString(),
      });
    }
  }, [isConnected]); // Add isConnected to the dependency array

  // Debug log to verify component mounted
  useEffect(() => {
    console.log("🔧 Home page component mounted, checking URL parameters...");
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      console.log("🔧 Current URL:", url.toString());
    }
  }, []);

  // Auto-popup logic removed - binding dialogs should only show when user explicitly triggers them

  const clearRefCodeFromUrl = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("refcode");
    window.history.replaceState(null, "", url.toString());
  };

  const clearRefAddressFromUrl = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("refaddress");
    window.history.replaceState(null, "", url.toString());
  };

  const handleBindReferrerByAddress = async () => {
    if (!incomingRefAddress) return;

    // Check if wallet is connected
    if (!isConnected) {
      const openModal = openConnectModalRef.current;
      if (openModal) {
        openModal();
      } else {
        notification.error("Wallet connection not available. Please try refreshing the page.");
      }
      return;
    }

    // Check if user already has a referrer
    if (referrerAddress && referrerAddress !== ZERO_ADDRESS) {
      notification.error("You already have a referrer bound.");
      setIncomingRefAddress(null);
      clearRefAddressFromUrl();
      setIsBindDialogOpen(false);
      return;
    }

    // Check if trying to bind self
    if (incomingRefAddress.toLowerCase() === address?.toLowerCase()) {
      notification.error("You cannot bind yourself as referrer.");
      setIncomingRefAddress(null);
      clearRefAddressFromUrl();
      setIsBindDialogOpen(false);
      return;
    }

    setIsBindingByAddress(true);
    setIsBindDialogOpen(false);
    let toastId: string | null = null;
    try {
      toastId = notification.loading("Binding referrer by address...");
      console.log("🔗 开始绑定推荐人地址", {
        address: address,
        referrer: incomingRefAddress,
        timestamp: new Date().toISOString(),
      });

      const txHash = await writeContractAsync({
        address: BUTTERFLY_CONTRACT_ADDRESS,
        abi: BUTTERFLY_ABI,
        functionName: "bindReferrerByAddress",
        args: [incomingRefAddress as `0x${string}`],
        chainId: BSC_TESTNET_CHAIN_ID,
      });

      if (!publicClient) {
        throw new Error("Public client unavailable.");
      }

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      if (toastId) {
        notification.remove(toastId);
      }

      let referrerSet = false;
      for (const log of receipt.logs) {
        try {
          const event = decodeEventLog({
            abi: BUTTERFLY_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (event.eventName === "ReferralSet") {
            referrerSet = true;
            const referrer = event.args?.referrer as string;
            const user = event.args?.user as string;
            console.log("✅ ReferralSet 事件触发", {
              user: user,
              referrer: referrer,
              timestamp: new Date().toISOString(),
            });
            break;
          }
        } catch {
          // Ignore logs that don't match the event
        }
      }

      if (referrerSet) {
        notification.success("Referrer bound successfully!");
        setIncomingRefAddress(null);
        clearRefAddressFromUrl();
        console.log("✅ 推荐人绑定成功", {
          address: address,
          referrer: incomingRefAddress,
          timestamp: new Date().toISOString(),
        });

        await refetchReferralInfo();
      } else {
        notification.error("Failed to bind referrer: ReferralSet event not found");
      }
    } catch (error) {
      if (toastId) {
        notification.remove(toastId);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.toLowerCase().includes("user rejected")) {
        notification.error("Transaction cancelled by user.");
      } else {
        notification.error(`Failed to bind referrer: ${message}`);
      }
      console.error("❌ 绑定推荐人失败", {
        address: address,
        referrer: incomingRefAddress,
        error: error,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsBindingByAddress(false);
    }
  };

  const handleConfirmBindReferrer = async () => {
    if (!incomingRefCode) return;

    // Check if wallet is connected
    if (!isConnected) {
      const openModal = openConnectModalRef.current;
      if (openModal) {
        openModal();
      } else {
        notification.error("Wallet connection not available. Please try refreshing the page.");
      }
      return;
    }

    // Check if user already has a referrer
    if (referrerAddress && referrerAddress !== ZERO_ADDRESS) {
      notification.error("You already have a referrer bound.");
      setIncomingRefCode(null);
      clearRefCodeFromUrl();
      setIsBindDialogOpen(false);
      return;
    }

    setIsBindingReferrer(true);
    setIsBindDialogOpen(false);
    let toastId: string | null = null;
    try {
      toastId = notification.loading("Binding referral code...");
      const normalizedCode = incomingRefCode.startsWith("0x") ? incomingRefCode : `0x${incomingRefCode}`;

      const txHash = await writeContractAsync({
        address: BUTTERFLY_CONTRACT_ADDRESS,
        abi: BUTTERFLY_ABI,
        functionName: "bindReferrerByInvitationCode",
        args: [normalizedCode as `0x${string}`],
        chainId: BSC_TESTNET_CHAIN_ID,
      });

      if (!publicClient) {
        throw new Error("Public client unavailable.");
      }

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      if (toastId) {
        notification.remove(toastId);
      }

      notification.success("Referral code bound successfully.");
      setIncomingRefCode(null);
      clearRefCodeFromUrl();

      await refetchReferralInfo();
    } catch (error) {
      if (toastId) {
        notification.remove(toastId);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.toLowerCase().includes("user rejected")) {
        notification.error("Transaction cancelled by user.");
      } else {
        notification.error(`Failed to bind referral code: ${message}`);
      }
    } finally {
      setIsBindingReferrer(false);
    }
  };

  const handleDismissBindDialog = () => {
    setIsBindDialogOpen(false);
    if (incomingRefCode) {
      setIncomingRefCode(null);
      clearRefCodeFromUrl();
    }
    if (incomingRefAddress) {
      setIncomingRefAddress(null);
      clearRefAddressFromUrl();
    }
  };

  return (
    <>
      {/* Hidden ConnectButton to get access to openConnectModal */}
      <div style={{ display: "none" }}>
        <ConnectButton.Custom>
          {({ openConnectModal }) => {
            // Cache RainbowKit's openConnectModal handler for reuse in this page
            openConnectModalRef.current = openConnectModal ?? null;
            return null;
          }}
        </ConnectButton.Custom>
      </div>

      <main className="relative min-h-screen w-full overflow-hidden bg-[#010205] text-white">
        <BackgroundGlow />
        <div className="relative mx-auto flex w-full max-w-[1180px] flex-col gap-28 px-6 pb-36 pt-20 lg:px-12">
          <HeroSection />
          <FeatureSection />
          <EcosystemSection />
          <TokenSection />
        </div>
        <BottomNav />
      </main>

      {/* 推荐参数提示 - 不自动弹出，让用户手动触发 */}
      {(incomingRefCode || incomingRefAddress) && !isBindDialogOpen && (
        <div className="fixed bottom-24 right-6 z-40 max-w-sm rounded-2xl border border-[#1f2432] bg-[#10131c] p-4 shadow-[0_20px_60px_-40px_rgba(32,255,109,0.3)]">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 flex-none rounded-full bg-[#20ff6d]" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-[#20ff6d]">
                  {incomingRefCode ? "Invitation Code Detected" : "Referrer Address Detected"}
                </p>
                <button
                  type="button"
                  onClick={handleDismissBindDialog}
                  className="ml-2 flex-none rounded-lg border border-[#1f2432] bg-transparent p-1 text-[#788090] transition hover:border-[#ff5f66] hover:text-[#ff5f66]"
                  title="Close"
                >
                  <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-xs text-[#cdd3de] break-all">{incomingRefCode || incomingRefAddress}</p>
              <button
                type="button"
                onClick={() => setIsBindDialogOpen(true)}
                className="mt-3 w-full rounded-xl border border-[#1f2432] bg-[#141924] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#20ff6d] hover:bg-[#101621]"
              >
                Bind Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Referral Binding Dialog */}
      {isBindDialogOpen && (incomingRefCode || incomingRefAddress) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-[#1f2432] bg-[#10131c] p-6 text-center shadow-[0_40px_120px_-80px_rgba(32,255,109,0.4)]">
            <h2 className="text-lg font-semibold uppercase tracking-[0.32em] text-[#20ff6d]">Bind Referral</h2>
            <p className="mt-4 text-sm text-[#cdd3de]">
              {incomingRefCode
                ? `We detected an invitation code. ${!isConnected ? "Click to connect your wallet and" : "Do you want to"} bind this referral?`
                : `We detected a referrer address. ${!isConnected ? "Click to connect your wallet and" : "Do you want to"} bind this referral?`}
            </p>
            <p className="mt-4 break-all text-xs uppercase tracking-[0.3em] text-[#20ff6d]">
              {incomingRefCode || incomingRefAddress}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={incomingRefCode ? handleConfirmBindReferrer : handleBindReferrerByAddress}
                disabled={isBindingReferrer || isBindingByAddress}
                className="w-full rounded-2xl border border-[#1f2432] bg-[#141924] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#20ff6d] hover:bg-[#101621] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBindingReferrer || isBindingByAddress
                  ? "Binding..."
                  : !isConnected
                    ? "Connect Wallet & Bind"
                    : "Bind Referral"}
              </button>
              <button
                type="button"
                onClick={handleDismissBindDialog}
                disabled={isBindingReferrer || isBindingByAddress}
                className="w-full rounded-2xl border border-[#1f2432] bg-[#101621] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#ff5f66] hover:bg-[#171d29] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function HeroSection() {
  return (
    <section className="grid gap-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-5 text-left">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1f3728] bg-[#05160d]/70 px-5 py-2 text-xs uppercase tracking-[0.46em] text-[#58ff9b]">
            Hash butterfly
          </span>
          <h1 className="text-[2.9rem] font-semibold uppercase leading-[1.08] tracking-[0.14em] text-white lg:text-[3.4rem]">
            Hash butterfly ecosystem
          </h1>
          <p className="max-w-[540px] text-base leading-relaxed text-[#b5c6d9]">
            Enter the cinematic metamorphosis experience where art, storytelling and community co-create the future of
            the Hash Butterfly universe across immersive digital and physical destinations.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {heroHighlights.map(highlight => (
            <div
              key={highlight.title}
              className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 shadow-[0_30px_80px_-70px_rgba(72,255,150,0.6)]"
            >
              <p className="text-sm uppercase tracking-[0.32em] text-[#63ffa7]">{highlight.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-[#d3e1f1]">{highlight.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 -translate-y-8 blur-[110px]">
          <div className="h-full w-full rounded-[56px] bg-gradient-to-b from-[#52ffb4]/20 via-[#1b4a34]/30 to-transparent" />
        </div>
        <div className="relative overflow-hidden rounded-[56px] border border-[#1e3b2c] bg-[#030705] p-5 shadow-[0_40px_120px_-60px_rgba(60,255,164,0.65)]">
          <div className="absolute inset-5 rounded-[44px] border border-[#2b6544]/60" />
          <div className="relative overflow-hidden rounded-[40px] border border-[#32704c]/80">
            <video autoPlay loop muted playsInline className="block w-full">
              <source src="/api/media/hero-video" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <FeatureCard {...featureCards[0]} className="lg:row-span-2" />
      <div className="grid gap-10">
        <FeatureCard {...featureCards[1]} />
        <FeatureCard {...featureCards[2]} />
      </div>
    </section>
  );
}

type FeatureCardProps = (typeof featureCards)[number] & { className?: string };

function FeatureCard({ label, title, description, accent, gradient, border, image, className }: FeatureCardProps) {
  return (
    <article
      className={`relative overflow-hidden rounded-[44px] border bg-gradient-to-br ${gradient} px-10 py-12 shadow-[0_40px_140px_-70px_rgba(53,255,159,0.4)] ${className ?? ""}`}
      style={{ borderColor: border }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_65%)]" />
      <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex flex-1 flex-col gap-6 text-left">
          <span className="text-[0.7rem] uppercase tracking-[0.6em]" style={{ color: accent }}>
            {label}
          </span>
          <h2 className="text-[2rem] font-semibold uppercase leading-[1.05] tracking-[0.18em] text-white">{title}</h2>
          <p className="max-w-[420px] text-sm leading-relaxed text-[#c8d6e6]">{description}</p>
        </div>
        <div className="relative h-[220px] w-full max-w-[280px] shrink-0 overflow-hidden rounded-[32px] border border-white/8 bg-black/20">
          <Image src={image} alt="" fill className="object-cover" sizes="(max-width: 1024px) 60vw, 280px" priority />
        </div>
      </div>
    </article>
  );
}

function EcosystemSection() {
  return (
    <section className="relative overflow-hidden rounded-[48px] border border-[#183045] bg-[#040a13]/95 px-12 py-16 shadow-[0_50px_140px_-80px_rgba(70,150,255,0.4)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(111,224,255,0.22),transparent_60%)]" />
      <div className="relative flex flex-col gap-12 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-[420px] space-y-6 text-left">
          <span className="text-xs uppercase tracking-[0.62em] text-[#63ffa7]">Hash butterfly ecosystem</span>
          <h3 className="text-[2.2rem] font-semibold uppercase tracking-[0.18em] text-white">
            The entertainment universe for digital metamorphosis
          </h3>
          <p className="text-sm leading-relaxed text-[#c2d4ea]">
            Hash Butterfly connects immersive storytelling, live events and phygital experiences to craft an
            interconnected world for fans and builders. Every interaction is designed to deepen the metamorphosis
            journey.
          </p>
        </div>
        <ul className="flex flex-1 flex-col gap-6 text-sm text-[#d4e3f5]">
          {ecosystemBullets.map(item => (
            <li key={item} className="flex items-start gap-4">
              <span className="mt-1 h-3 w-3 flex-none rounded-full bg-[#63ffa7]" />
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function TokenSection() {
  return (
    <section className="relative overflow-hidden rounded-[46px] border border-[#1d3a2a] bg-[#07140d]/95 px-12 py-16 shadow-[0_40px_130px_-80px_rgba(86,255,184,0.42)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(96,255,180,0.16),transparent_62%)]" />
      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
        <div className="space-y-6 text-left">
          <span className="text-xs uppercase tracking-[0.6em] text-[#63ffa7]">Token economy</span>
          <h3 className="text-[2rem] font-semibold uppercase tracking-[0.16em] text-white">HASH token metrics</h3>
          <p className="text-sm leading-relaxed text-[#c3e2ce]">
            HASH fuels staking, governance and reward mechanisms that activate every layer of the ecosystem. Holding
            HASH unlocks exclusive experiences, tiered utilities and early entry to limited releases.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {tokenStats.map(stat => (
            <div
              key={stat.label}
              className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 px-7 py-6 text-left backdrop-blur"
            >
              <span className="text-xs uppercase tracking-[0.45em] text-white/60">{stat.label}</span>
              <span className="text-xl font-semibold uppercase tracking-[0.24em] text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomNav() {
  return (
    <nav className="sticky bottom-8 z-20 w-full px-6 pb-6">
      <div className="mx-auto flex w-full max-w-[520px] items-center justify-between rounded-full border border-[#18263a] bg-[#050910]/80 px-10 py-5 shadow-[0_26px_80px_-60px_rgba(0,0,0,0.85)] backdrop-blur">
        {navItems.map(item => {
          const Icon = item.Icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2 text-[0.58rem] uppercase tracking-[0.42em] text-[#97a1b2] transition hover:text-[#63ffa7]"
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function iconClass(className?: string) {
  return className ? `size-5 ${className}` : "size-5";
}

function HomeIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={iconClass(className)}
      {...props}
    >
      <path d="M3 10.5 12 3l9 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 11.5V21h5v-5h2v5h5v-9.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArtIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={iconClass(className)}
      {...props}
    >
      <rect x={4} y={4} width={16} height={16} rx={3} ry={3} />
      <path d="M4 16.5 9.5 11l3.5 3.5L17 10l3 3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={9} cy={8} r={1.25} fill="currentColor" stroke="none" />
    </svg>
  );
}

function MallIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={iconClass(className)}
      {...props}
    >
      <path d="M4 9h16l-1.2 10.2A1.5 1.5 0 0 1 17.3 20H6.7a1.5 1.5 0 0 1-1.5-1.3L4 9Z" strokeLinejoin="round" />
      <path d="M8 11v7M16 11v7" strokeLinecap="round" />
      <path d="M7 9h10l-.8-3A2 2 0 0 0 14.3 4H9.7A2 2 0 0 0 7.8 6Z" strokeLinejoin="round" />
    </svg>
  );
}

function TokenIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={iconClass(className)}
      {...props}
    >
      <circle cx={12} cy={12} r={7} />
      <path d="M12 8v8m3-4H9" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={iconClass(className)}
      {...props}
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-[-240px] h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[#4cff99]/16 blur-[220px]" />
      <div className="absolute left-[10%] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#7b4dff]/14 blur-[220px]" />
      <div className="absolute bottom-[-220px] right-[-80px] h-[520px] w-[520px] rounded-full bg-[#061a10]" />
    </div>
  );
}
