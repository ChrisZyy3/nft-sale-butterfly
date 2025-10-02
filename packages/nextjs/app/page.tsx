import Link from "next/link";
import heroPoster from "@/images/home.jpg";
import { Home, Image as ImageIcon, Menu, ShoppingBag, Sparkles } from "lucide-react";

const tokenStats = [
  { label: "Token name", value: "Butterfly" },
  { label: "Issue public chain", value: "Ethereum chain" },
  { label: "Issuance quantity", value: "900 trillion" },
];

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "NFT", icon: ImageIcon, href: "/nft" },
  { label: "Mall", icon: ShoppingBag, href: "/mall" },
  { label: "Token", icon: Sparkles, href: "/token" },
  { label: "More", icon: Menu, href: "/more" },
];

export default function HomeLanding() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#020406] text-white">
      <BackgroundGlow />
      <div className="mx-auto flex w-full max-w-[440px] flex-col gap-10 px-6 pb-32 pt-12">
        <Header />
        <HeroVideo />
        <InfoCards />
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
    <section className="relative overflow-hidden rounded-[40px] border border-[#1d3727] bg-[#031008] p-[10px] shadow-[0_0_140px_-60px_rgba(50,255,120,0.55)]">
      <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-[#3aff8c]/10 via-transparent to-transparent" />
      <div className="relative overflow-hidden rounded-[28px] border border-[#2b5c3e]">
        <video autoPlay loop muted playsInline poster={heroPoster.src} className="block w-full">
          <source src="/api/media/hero-video" type="video/mp4" />
        </video>
      </div>
    </section>
  );
}

function InfoCards() {
  return (
    <section className="flex flex-col gap-6">
      <article className="relative overflow-hidden rounded-[36px] border border-[#205634] bg-[#062012] p-7 shadow-[0_60px_120px_-70px_rgba(74,255,150,0.55)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3aff8c]/15 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-4 text-left">
          <span className="text-[0.7rem] uppercase tracking-[0.6em] text-[#44ff94]">NFT</span>
          <h2 className="text-[1.45rem] font-semibold uppercase leading-tight tracking-[0.12em] text-white">
            Hash butterfly digital art piece
          </h2>
          <p className="text-sm leading-relaxed text-[#c2ffd8]">
            Hash Butterfly is a series of digital art pieces, each representing the metamorphosis of the butterfly.
            Every piece is unique with its own narrative, crafted with advanced 3D modeling, animation and interactive
            design.
          </p>
        </div>
      </article>
      <article className="relative overflow-hidden rounded-[36px] border border-[#3b2a6e] bg-[#1a0f2c] p-7 shadow-[0_60px_120px_-70px_rgba(149,94,255,0.45)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#a577ff]/20 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-4 text-left">
          <span className="text-[0.7rem] uppercase tracking-[0.6em] text-[#d4b6ff]">Mall</span>
          <h2 className="text-[1.45rem] font-semibold uppercase leading-tight tracking-[0.12em] text-white">
            Hash butterfly is superlative
          </h2>
          <p className="text-sm leading-relaxed text-[#eadfff]">
            Hash Butterfly Mall is a superlative digital destination blending immersive storytelling with curated
            commerce. Fans can explore the universe, collect limited drops and connect with collaborators worldwide.
          </p>
        </div>
      </article>
    </section>
  );
}

function EcosystemPanel() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-[#122233] bg-[#050b14] p-8">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3aff8c]/15 via-transparent to-transparent" />
      <div className="relative flex flex-col gap-4 text-left">
        <span className="text-[0.68rem] uppercase tracking-[0.8em] text-[#32ff78]">Hash butterfly ecosystem</span>
        <p className="text-sm leading-relaxed text-[#a6b7c9]">
          The Hash Butterfly ecosystem connects digital art, experiential commerce and community co-creation. Holders
          guide the narrative, unlock seasonal realms and share in the evolution of the brand across every medium.
        </p>
      </div>
    </section>
  );
}

function TokenPanel() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-[#1a3625] bg-[#08150d] p-7">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3aff8c]/18 via-transparent to-transparent" />
      <div className="relative flex flex-col gap-6">
        <h3 className="text-[1.45rem] font-semibold uppercase leading-tight tracking-[0.12em] text-white">Token</h3>
        <div className="grid gap-4">
          {tokenStats.map(stat => (
            <div key={stat.label} className="flex flex-col gap-2 text-left">
              <span className="text-[0.65rem] uppercase tracking-[0.6em] text-[#4cff9b]">{stat.label}</span>
              <span className="text-lg font-semibold uppercase tracking-[0.3em] text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomNav() {
  return (
    <nav className="sticky bottom-6 z-10 w-full px-6 pb-6">
      <div className="mx-auto flex w-full max-w-[380px] items-center justify-between rounded-full border border-[#1f2737] bg-[#04070d]/80 px-7 py-4 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
        {navItems.map(item => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-2 text-[0.6rem] uppercase tracking-[0.4em] text-[#97a1b2] transition hover:text-[#32ff78]"
          >
            <item.icon className="size-5" />
            {item.label}
          </Link>
        ))}
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
