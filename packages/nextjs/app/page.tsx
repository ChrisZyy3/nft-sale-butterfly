import type { ComponentProps, ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import mallPreview from "@/images/mal.jpg";
import nftPreview from "@/images/nft.jpg";
import walletPreview from "@/images/wallet.jpg";

const tokenStats = [
  { label: "Token name", value: "HASH" },
  { label: "Public chain", value: "Ethereum" },
  { label: "Issuance", value: "900 trillion" },
  { label: "Circulation", value: "100 trillion" },
];

const featureCards = [
  {
    id: "nft",
    tag: "NFT",
    title: "Hash butterfly NFT series",
    copy: "Hash Butterfly digital collectibles capture the metamorphosis journey with cinematic 3D craftsmanship and immersive storytelling across every chapter of the franchise.",
    accent: "#34f87a",
    border: "#1f5633",
    background: "bg-[#071a11]",
    shadow: "shadow-[0_32px_80px_-40px_rgba(48,255,120,0.55)]",
    image: nftPreview,
  },
  {
    id: "mall",
    tag: "Mall",
    title: "Hash butterfly immersive mall",
    copy: "The official mall delivers co-created drops, phygital collaborations and narrative-driven retail moments that extend the universe into everyday life.",
    accent: "#cbb6ff",
    border: "#36265f",
    background: "bg-[#150c24]",
    shadow: "shadow-[0_32px_80px_-40px_rgba(171,120,255,0.45)]",
    image: mallPreview,
  },
  {
    id: "wallet",
    tag: "Wallet",
    title: "Hash butterfly wallet",
    copy: "A secure multi-chain wallet tailored for the ecosystem, offering seamless NFT collection, staking utilities and real-time governance participation.",
    accent: "#56f1ff",
    border: "#124d56",
    background: "bg-[#07151a]",
    shadow: "shadow-[0_32px_80px_-40px_rgba(86,241,255,0.35)]",
    image: walletPreview,
  },
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

export default function HomeLanding() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#020406] text-white">
      <BackgroundGlow />
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-12 px-6 pb-32 pt-12">
        <Header />
        <HeroVideo />
        <FeatureCards />
        <EcosystemPanel />
        <TokenPanel />
      </div>
      <BottomNav />
    </main>
  );
}

function Header() {
  return (
    <header className="flex flex-col items-center text-center">
      <span className="text-[0.64rem] uppercase tracking-[0.75em] text-[#32ff78]">Hash butterfly</span>
      <h1 className="mt-5 text-[2rem] font-semibold uppercase leading-[1.08] tracking-[0.12em] text-white">
        Hash butterfly ecosystem
      </h1>
    </header>
  );
}

function HeroVideo() {
  return (
    <section className="relative overflow-hidden rounded-[44px] border border-[#1f3728] bg-gradient-to-b from-[#07150e] via-[#020604] to-[#020406] p-4 shadow-[0_0_160px_-70px_rgba(48,255,120,0.65)]">
      <div className="absolute inset-4 rounded-[36px] border border-[#27563a]/60" />
      <div className="relative overflow-hidden rounded-[32px] border border-[#2d6240]/80">
        <video autoPlay loop muted playsInline className="block w-full">
          <source src="/api/media/hero-video" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

function FeatureCards() {
  return (
    <section className="flex flex-col gap-6">
      {featureCards.map(card => (
        <article
          key={card.id}
          className={`relative overflow-hidden rounded-[38px] border ${card.background} ${card.shadow}`}
          style={{ borderColor: card.border }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/6 via-transparent to-transparent" />
          <div className="relative flex flex-col gap-5 p-7">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10">
                <Image src={card.image} alt="" fill className="object-cover" sizes="48px" priority />
              </div>
              <span className="text-[0.68rem] uppercase tracking-[0.6em]" style={{ color: card.accent }}>
                {card.tag}
              </span>
            </div>
            <h2 className="text-[1.42rem] font-semibold uppercase leading-tight tracking-[0.12em] text-white">
              {card.title}
            </h2>
            <p className="text-sm leading-relaxed text-white/75">{card.copy}</p>
          </div>
        </article>
      ))}
    </section>
  );
}

function EcosystemPanel() {
  return (
    <section className="relative overflow-hidden rounded-[42px] border border-[#142235] bg-[#040913] px-8 py-10 shadow-[0_30px_120px_-80px_rgba(22,120,255,0.45)]">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4cff99]/12 via-transparent to-transparent" />
      <div className="relative flex flex-col gap-6 text-left">
        <div className="flex flex-col gap-3">
          <span className="text-[0.64rem] uppercase tracking-[0.75em] text-[#4cff99]">Hash butterfly ecosystem</span>
          <h3 className="text-[1.25rem] font-semibold uppercase tracking-[0.18em] text-white">
            Empowering the butterfly metaverse
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-[#a7b6c8]">
          The Hash Butterfly ecosystem interweaves narrative-driven NFTs, immersive retail, live entertainment and
          collaborative worldbuilding. Every experience channels community governance, staking rewards and creator-first
          economics to co-create the metamorphosis of the brand.
        </p>
        <ul className="grid gap-3 text-sm text-[#c5d2e3]">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#4cff99]" />
            <span>Seasonal realms unlocked through NFT ownership</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#4cff99]" />
            <span>Cross-platform storytelling with AR, live events and digital fashion</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-[#4cff99]" />
            <span>Shared treasury powering mission-aligned collaborators</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

function TokenPanel() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-[#1a3725] bg-[#06130c] px-8 py-9">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4cff99]/18 via-transparent to-transparent" />
      <div className="relative flex flex-col gap-7">
        <div className="flex flex-col gap-3 text-left">
          <span className="text-[0.66rem] uppercase tracking-[0.7em] text-[#4cff99]">Token economy</span>
          <h3 className="text-[1.38rem] font-semibold uppercase tracking-[0.14em] text-white">HASH token metrics</h3>
        </div>
        <div className="grid gap-5">
          {tokenStats.map(stat => (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-5 py-4 text-left"
            >
              <span className="text-xs uppercase tracking-[0.38em] text-white/60">{stat.label}</span>
              <span className="text-lg font-semibold uppercase tracking-[0.24em] text-white">{stat.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs leading-relaxed text-[#7fb697]">
          HASH powers staking rewards, governance voting and access to token-gated chapters across the butterfly
          metaverse. Holders unlock early experiences, co-creation opportunities and exclusive airdrops linked to major
          narrative milestones.
        </p>
      </div>
    </section>
  );
}

function BottomNav() {
  return (
    <nav className="sticky bottom-6 z-10 w-full px-6 pb-6">
      <div className="mx-auto flex w-full max-w-[380px] items-center justify-between rounded-full border border-[#1f2737] bg-[#04070d]/80 px-7 py-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
        {navItems.map(item => {
          const Icon = item.Icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-[#97a1b2] transition hover:text-[#32ff78]"
            >
              <Icon />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function BackgroundGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[#2cff79]/15 blur-[180px]" />
      <div className="absolute left-4 top-1/2 h-[280px] w-[280px] -translate-y-1/2 rounded-full bg-[#7a4dff]/12 blur-[180px]" />
      <div className="absolute right-0 bottom-0 h-[320px] w-[320px] translate-x-1/4 rounded-full bg-[#082013]" />
    </div>
  );
}
