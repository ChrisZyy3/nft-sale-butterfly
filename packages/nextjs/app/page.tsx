import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const featureCards = [
  {
    slug: "nft",
    badge: "NFT",
    title: "Hash butterfly digital art piece",
    description: "Collect generative wings minted on-chain and unlock privileges across the Hash Butterfly metaverse.",
    href: "/nft/presale",
    accent: "linear-gradient(135deg, rgba(32,255,109,0.4), rgba(32,255,109,0.05))",
  },
  {
    slug: "mall",
    badge: "Mall",
    title: "Hash butterfly is a derivative brand of the metaverse",
    description:
      "Experience curated drops, IRL collaborations and lifestyle products inspired by the Hash Butterfly IP.",
    href: "/mall",
    accent: "linear-gradient(135deg, rgba(255,192,86,0.35), rgba(118,56,255,0.25))",
  },
];

const tokenStats = [
  { label: "Token name", value: "Butterfly" },
  { label: "Issue public chain", value: "Ethereum chain" },
  { label: "Issuance quantity", value: "900 trillion" },
];

const socials = [
  { label: "X", href: "#" },
  { label: "Telegram", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Discord", href: "#" },
  { label: "YouTube", href: "#" },
];

export default function HomeLanding() {
  return (
    <div className="relative overflow-hidden">
      <BackgroundAura />
      <div className="hb-container flex flex-col gap-10 pb-32 pt-8 md:gap-12">
        <TopBar />
        <Hero />
        <section className="flex flex-col gap-5">
          {featureCards.map(card => (
            <Link
              key={card.slug}
              href={card.href}
              className="group relative overflow-hidden rounded-[32px] border border-[#1f2432] bg-[#10131c] p-6 shadow-[0_50px_140px_-70px_rgba(32,255,109,0.4)] transition hover:border-[#20ff6d]/50"
            >
              <div aria-hidden className="absolute inset-0" style={{ background: card.accent }} />
              <div className="relative flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3 text-[0.65rem] uppercase tracking-[0.45em] text-[#20ff6d]">
                  <span className="rounded-full border border-[#1f2432] bg-[#141924] px-3 py-1 font-semibold">
                    {card.badge}
                  </span>
                  <span className="tracking-[0.6em] text-[#8ee4b5]">Hash Butterfly</span>
                </div>
                <h2 className="text-xl font-semibold uppercase tracking-[0.18em] text-white md:text-2xl">
                  {card.title}
                </h2>
                <p className="text-sm leading-relaxed text-[#9ca3b0]">{card.description}</p>
                <span className="mt-2 inline-flex w-max items-center gap-3 rounded-full border border-[#1f2432] bg-[#141924] px-5 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.45em] text-[#9ca3b0] transition group-hover:border-[#20ff6d]/60 group-hover:text-[#20ff6d]">
                  Explore
                  <ArrowIcon />
                </span>
              </div>
            </Link>
          ))}
        </section>
        <section className="rounded-[32px] border border-[#1f2432] bg-[#0f131d] p-6">
          <div className="mb-5 flex flex-col gap-2">
            <span className="text-[0.68rem] uppercase tracking-[0.6em] text-[#20ff6d]">Hash Butterfly ecosystem</span>
            <h3 className="text-2xl font-semibold uppercase tracking-[0.2em] text-white">
              Hash butterfly ecosystem token
            </h3>
            <p className="text-sm leading-relaxed text-[#9ca3b0]">
              The Hash Butterfly token powers immersive storytelling, cross-channel commerce and community governance.
              Holders participate in co-creation and unlock an evolving rewards loop across the metaverse network.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {tokenStats.map(stat => (
              <div key={stat.label} className="rounded-2xl border border-[#1f2432] bg-[#141924] px-4 py-4 text-left">
                <div className="text-[0.68rem] uppercase tracking-[0.45em] text-[#818898]">{stat.label}</div>
                <div className="mt-3 text-lg font-semibold uppercase tracking-[0.18em] text-[#20ff6d]">
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </section>
        <footer className="flex flex-col items-center gap-6 pb-10">
          <p className="text-xs uppercase tracking-[0.45em] text-[#5c6373]">Follow the ecosystem</p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm uppercase tracking-[0.4em] text-[#9ca3b0]">
            {socials.map(item => (
              <Link key={item.label} href={item.href} className="hover:text-[#20ff6d]">
                {item.label}
              </Link>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.45em] text-[#20ff6d]">
        <span>Hash Butterfly</span>
      </div>
      <Button asChild size="sm" variant="primary" className="tracking-[0.4em]">
        <Link href="/wallet" className="flex items-center gap-2">
          <WalletIcon />
          Wallet
        </Link>
      </Button>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-[#1f2432] bg-[#10131c] px-6 py-10 text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, rgba(32,255,109,0.35), transparent 65%), radial-gradient(circle at bottom, rgba(97,246,175,0.18), transparent 70%)",
        }}
      />
      <div className="relative mx-auto flex max-w-md flex-col items-center gap-5">
        <span className="inline-flex items-center gap-3 rounded-full border border-[#20ff6d]/50 bg-[#20ff6d]/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.6em] text-[#20ff6d]">
          Hash Butterfly
        </span>
        <ButterflyMark className="size-28 text-[#20ff6d]" />
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold uppercase tracking-[0.2em] text-white md:text-4xl">
            Hash butterfly metaverse IP ecosystem
          </h1>
          <p className="text-sm leading-relaxed text-[#9ca3b0]">
            Empowered by computing power and underground technological transformation, Hash Butterfly reshapes the IP
            ecosystem of the metaverse.
          </p>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M10 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#041710" strokeWidth="1.6">
      <path d="M4 7a2 2 0 0 1 2-2h12v4H6a2 2 0 0 1-2-2Zm0 4a2 2 0 0 1 2-2h14v8H6a2 2 0 0 1-2-2v-4Z" />
      <circle cx="17" cy="13" r="1.2" fill="#041710" />
    </svg>
  );
}

function ButterflyMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("drop-shadow-[0_0_32px_rgba(32,255,109,0.45)]", className)}
    >
      <path
        d="M32 36c6.5-9.5 14-14.5 19-16 2.5 5.5-1.5 12.5-6 15.5 5 2 9.5 7.5 8 11.5-4.5-.2-9.5-3.7-12.5-7.2-1.4 3.4-2.9 8.4-4.5 12.4-1.5-4-3-9-4-12.4-3 3.5-8 7-12.5 7.2-1.5-4 3-9.5 8-11.5-4.5-3-8.5-10-6-15.5 5 1.5 12.5 6.5 19 16Z"
        fill="currentColor"
        fillOpacity={0.12}
      />
      <path
        d="M32 34c6-8 12-12.5 16.5-13.5 2 4.5-1.2 10-5 12 4.3 1.8 8.2 6.6 7 9.5-3.8-.3-8.2-3.5-11-6.5-1.2 3.1-2.5 7-3.6 10.4-1.2-3.4-2.4-7.3-3.6-10.4-2.8 3-7.2 6.2-11 6.5-1.2-2.9 2.7-7.7 7-9.5-3.8-2-7-7.5-5-12 4.5 1 10.5 5.5 16.5 13.5Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={26} cy={23} r={2.8} fill="currentColor" />
      <circle cx={38} cy={23} r={2.8} fill="currentColor" />
      <path d="M30.5 18.5c1.1-1 2.9-1 4 0" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

function BackgroundAura() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-36 top-16 h-80 w-80 rounded-full bg-[#20ff6d]/15 blur-[140px]" />
      <div className="absolute right-[-120px] top-32 h-96 w-96 rounded-full bg-[#76ffba]/10 blur-[180px]" />
      <div className="absolute inset-x-12 bottom-0 h-72 rounded-t-[60px] bg-gradient-to-t from-[#05060a] via-transparent to-transparent" />
    </div>
  );
}
