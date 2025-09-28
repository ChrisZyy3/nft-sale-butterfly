import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import heroPoster from "@/images/home.jpg";
import mallImage from "@/images/mal.jpg";
import nftImage from "@/images/nft.jpg";
import walletImage from "@/images/wallet.jpg";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Collections", href: "#collections" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "FAQ", href: "#faq" },
];

const heroStats = [
  { label: "Genesis holders", value: "18,420" },
  { label: "Volume traded", value: "$42M" },
  { label: "Partner worlds", value: "32" },
];

const highlightMetrics = [
  {
    title: "Procedural wings",
    description: "Each butterfly is generated from 1.2M trait permutations that evolve alongside the story arc.",
  },
  {
    title: "Living lore",
    description: "Seasonal chapters unlock new realms, community quests and hidden relics across the Hash multiverse.",
  },
  {
    title: "Commerce ready",
    description: "Bridge digital ownership with IRL drops, partner activations and token-gated retail experiences.",
  },
];

type FeatureCard = {
  slug: string;
  badge: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  image: StaticImageData;
};

const featureCards: FeatureCard[] = [
  {
    slug: "nft",
    badge: "NFT",
    title: "Hash butterfly digital art piece",
    description: "Collect generative wings minted on-chain and unlock privileges across the Hash Butterfly metaverse.",
    href: "/nft/presale",
    accent: "linear-gradient(135deg, rgba(32,255,109,0.35), rgba(14,24,36,0.95))",
    image: nftImage,
  },
  {
    slug: "mall",
    badge: "Mall",
    title: "Hash butterfly lifestyle collective",
    description:
      "Experience curated drops, IRL collaborations and signature products infused with the Hash Butterfly IP.",
    href: "/mall",
    accent: "linear-gradient(135deg, rgba(118,56,255,0.35), rgba(14,24,36,0.95))",
    image: mallImage,
  },
  {
    slug: "wallet",
    badge: "Wallet",
    title: "Hash butterfly vault",
    description:
      "Secure, stake and orchestrate your Hash Butterfly assets with multi-chain composability and social recovery.",
    href: "/wallet",
    accent: "linear-gradient(135deg, rgba(20,255,195,0.32), rgba(14,24,36,0.95))",
    image: walletImage,
  },
];

type CollectionGalleryItem = {
  title: string;
  description: string;
  image: StaticImageData;
};

const collectionGallery: CollectionGalleryItem[] = [
  {
    title: "Genesis flight",
    description: "Ultra-rare hand-finished wings that set the tone for the Hash Butterfly ethos.",
    image: heroPoster,
  },
  {
    title: "Alliance capsule",
    description: "Collaborations with culture makers and gaming partners across the metaverse.",
    image: nftImage,
  },
  {
    title: "IRL resonance",
    description: "Experiential drops bridging digital mythos with tactile craftsmanship.",
    image: mallImage,
  },
];

const tokenStats = [
  { label: "Token name", value: "Butterfly" },
  { label: "Issue public chain", value: "Ethereum chain" },
  { label: "Issuance quantity", value: "900 trillion" },
  { label: "Governance portals", value: "5" },
  { label: "Reward vaults", value: "12" },
  { label: "Community quests", value: "420+" },
];

const experienceHighlights = [
  {
    title: "Spatial metaverse",
    description:
      "Traverse immersive biomes, unlock lore fragments and co-create the next Hash Butterfly episode in real time.",
  },
  {
    title: "Creator tools",
    description: "Animate your butterfly, stream story-driven performances and publish directly to partnered worlds.",
  },
  {
    title: "Collective treasury",
    description: "Stake Butterfly tokens to curate artists, activate pop-ups and fund the regenerative treasury.",
  },
];

const roadmap = [
  {
    phase: "Q2 2024",
    title: "Flightpath zero",
    description:
      "Genesis mint, collector airdrop and unveiling of the Hash Butterfly vault with cross-chain wallet integration.",
  },
  {
    phase: "Q3 2024",
    title: "Metamorphosis",
    description:
      "Launch of the metaverse mall, brand collaborations and AI-assisted creator toolkit for animated story arcs.",
  },
  {
    phase: "Q4 2024",
    title: "Pollination",
    description:
      "Seasonal quests connect IRL events with digital realms, unlocking governance nodes and reward vault expansions.",
  },
  {
    phase: "2025",
    title: "Global resonance",
    description:
      "Hash Butterfly expands into immersive concerts, cinematic experiences and regenerative impact initiatives.",
  },
];

const faqs = [
  {
    question: "What is the Hash Butterfly ecosystem?",
    answer:
      "Hash Butterfly is an evolving metaverse IP where generative art, narrative-driven experiences and commerce converge. Holders guide the story, unlock seasonal realms and participate in community-led initiatives.",
  },
  {
    question: "How do I mint a butterfly?",
    answer:
      "Connect a compatible wallet, visit the presale portal and follow the guided mint flow. Genesis holders receive early access windows and discounted mint pricing.",
  },
  {
    question: "What utilities does the Butterfly token provide?",
    answer:
      "Butterfly token holders access staking rewards, co-creation governance, exclusive partner drops and token-gated experiences across the digital and physical ecosystem.",
  },
  {
    question: "Where can I learn more about upcoming drops?",
    answer:
      "Join the Hash Butterfly community channels, subscribe to the flight log newsletter and explore the roadmap for upcoming collaborations and seasonal activations.",
  },
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
    <div className="relative overflow-hidden bg-[#05060a] text-white">
      <BackgroundAura />
      <div className="hb-container flex flex-col gap-16 pb-24 pt-8 md:gap-20 md:pb-32">
        <NavBar />
        <Hero />
        <SectionDivider id="overview" title="Hash butterfly overview" subtitle="The metaverse IP renaissance" />
        <HighlightMetrics />
        <FeatureGrid />
        <SectionDivider id="collections" title="Collections" subtitle="Worlds that define the mythos" />
        <CollectionShowcase />
        <SectionDivider id="ecosystem" title="Ecosystem" subtitle="Token utility & immersive experiences" />
        <TokenOverview />
        <ExperienceHighlights />
        <SectionDivider id="roadmap" title="Roadmap" subtitle="From genesis spark to global resonance" />
        <RoadmapTimeline />
        <SectionDivider id="faq" title="FAQ" subtitle="Answers for new pilots" />
        <FaqSection />
        <CallToAction />
        <Footer />
      </div>
    </div>
  );
}

function NavBar() {
  return (
    <header className="sticky top-4 z-30 rounded-full border border-[#1f2432] bg-[#0c0f16]/80 backdrop-blur-lg">
      <div className="flex items-center justify-between gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-[#20ff6d]/10 text-[#20ff6d]">
            <ButterflyMark className="size-5" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.6em] text-[#9ca3b0] md:text-sm">
            Hash Butterfly
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-[0.7rem] uppercase tracking-[0.45em] text-[#6f7483] md:flex">
          {navLinks.map(item => (
            <a key={item.label} href={item.href} className="transition hover:text-[#20ff6d]">
              {item.label}
            </a>
          ))}
        </nav>
        <Button asChild size="sm" variant="primary" className="tracking-[0.4em]">
          <Link href="/wallet" className="flex items-center gap-2">
            <WalletIcon />
            Wallet
          </Link>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[40px] border border-[#1f2432] bg-[#0c101a] p-6 shadow-[0_80px_140px_-80px_rgba(32,255,109,0.3)] md:p-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(circle at top left, rgba(32,255,109,0.28), transparent 60%), radial-gradient(circle at bottom right, rgba(118,56,255,0.25), transparent 60%)",
        }}
      />
      <div className="relative grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div className="flex flex-col gap-6">
          <span className="w-max rounded-full border border-[#20ff6d]/60 bg-[#20ff6d]/10 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.6em] text-[#20ff6d]">
            Enter the flightpath
          </span>
          <h1 className="text-3xl font-semibold uppercase tracking-[0.18em] text-white md:text-4xl">
            Hash butterfly metaverse IP ecosystem
          </h1>
          <p className="text-sm leading-relaxed text-[#9ca3b0] md:text-base">
            Empowered by computing power and underground technological transformation, Hash Butterfly reshapes the IP
            ecosystem of the metaverse. Collect, co-create and orchestrate culture-defining experiences.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button asChild className="tracking-[0.4em]">
              <Link href="/nft/presale">Mint now</Link>
            </Button>
            <Link
              href="#overview"
              className="inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.45em] text-[#9ca3b0] transition hover:text-[#20ff6d]"
            >
              Discover story
              <ArrowIcon />
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {heroStats.map(stat => (
              <div key={stat.label} className="rounded-3xl border border-[#1f2432] bg-[#10131c]/80 px-4 py-4 text-left">
                <div className="text-[0.62rem] uppercase tracking-[0.45em] text-[#6f7483]">{stat.label}</div>
                <div className="mt-3 text-xl font-semibold uppercase tracking-[0.2em] text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="hb-gradient-outline">
            <div className="relative overflow-hidden rounded-[32px] border border-[#20ff6d]/40 bg-black/40">
              <video
                autoPlay
                loop
                muted
                playsInline
                poster={heroPoster.src}
                className="aspect-[4/5] w-full object-cover"
              >
                <source src="/api/media/hero-video" type="video/mp4" />
              </video>
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-6 left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full bg-[#20ff6d]/20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function SectionDivider({ id, title, subtitle }: { id: string; title: string; subtitle: string }) {
  return (
    <section id={id} className="flex flex-col gap-3 text-center">
      <span className="text-[0.65rem] uppercase tracking-[0.6em] text-[#20ff6d]">{title}</span>
      <h2 className="text-2xl font-semibold uppercase tracking-[0.18em] text-white md:text-[1.75rem]">{subtitle}</h2>
    </section>
  );
}

function HighlightMetrics() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {highlightMetrics.map(item => (
        <div
          key={item.title}
          className="rounded-[28px] border border-[#1f2432] bg-[#0c1019] p-6 text-left shadow-[0_40px_120px_-80px_rgba(32,255,109,0.25)]"
        >
          <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white">{item.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-[#9ca3b0]">{item.description}</p>
        </div>
      ))}
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {featureCards.map(card => (
        <Link
          key={card.slug}
          href={card.href}
          className="group relative flex flex-col overflow-hidden rounded-[32px] border border-[#1f2432] bg-[#10131c]"
        >
          <div aria-hidden className="absolute inset-0 opacity-70" style={{ background: card.accent }} />
          <div className="relative flex h-full flex-col">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-transparent to-transparent" />
            </div>
            <div className="flex flex-1 flex-col gap-4 p-6">
              <div className="flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.45em] text-[#20ff6d]">
                <span className="rounded-full border border-[#1f2432] bg-[#141924] px-3 py-1 font-semibold">
                  {card.badge}
                </span>
                <span className="text-[#8ee4b5]">Hash Butterfly</span>
              </div>
              <h3 className="text-xl font-semibold uppercase tracking-[0.18em] text-white">{card.title}</h3>
              <p className="text-sm leading-relaxed text-[#9ca3b0]">{card.description}</p>
              <span className="mt-auto inline-flex w-max items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.45em] text-[#9ca3b0] transition group-hover:text-[#20ff6d]">
                Explore
                <ArrowIcon />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
}

function CollectionShowcase() {
  return (
    <section className="grid gap-5 md:grid-cols-3">
      {collectionGallery.map(item => (
        <div key={item.title} className="relative overflow-hidden rounded-[32px] border border-[#1f2432] bg-[#0c1019]">
          <div className="relative h-64 overflow-hidden">
            <Image src={item.image} alt={item.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05060a] via-transparent to-transparent" />
          </div>
          <div className="flex flex-col gap-3 p-6">
            <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white">{item.title}</h3>
            <p className="text-sm leading-relaxed text-[#9ca3b0]">{item.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function TokenOverview() {
  return (
    <section className="rounded-[32px] border border-[#1f2432] bg-[#0f131d] p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl space-y-3">
          <span className="text-[0.68rem] uppercase tracking-[0.6em] text-[#20ff6d]">Hash Butterfly ecosystem</span>
          <h3 className="text-2xl font-semibold uppercase tracking-[0.2em] text-white">
            Hash butterfly ecosystem token
          </h3>
          <p className="text-sm leading-relaxed text-[#9ca3b0]">
            The Hash Butterfly token powers immersive storytelling, cross-channel commerce and community governance.
            Holders participate in co-creation and unlock an evolving rewards loop across the metaverse network.
          </p>
        </div>
        <Link
          href="/nft/presale"
          className="inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.45em] text-[#9ca3b0] transition hover:text-[#20ff6d]"
        >
          View token utility
          <ArrowIcon />
        </Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {tokenStats.map(stat => (
          <div key={stat.label} className="rounded-2xl border border-[#1f2432] bg-[#141924] px-4 py-4 text-left">
            <div className="text-[0.68rem] uppercase tracking-[0.45em] text-[#818898]">{stat.label}</div>
            <div className="mt-3 text-lg font-semibold uppercase tracking-[0.18em] text-[#20ff6d]">{stat.value}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperienceHighlights() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {experienceHighlights.map(item => (
        <div
          key={item.title}
          className="flex h-full flex-col gap-3 rounded-[28px] border border-[#1f2432] bg-[#0c1019] p-6"
        >
          <h3 className="text-lg font-semibold uppercase tracking-[0.2em] text-white">{item.title}</h3>
          <p className="text-sm leading-relaxed text-[#9ca3b0]">{item.description}</p>
        </div>
      ))}
    </section>
  );
}

function RoadmapTimeline() {
  return (
    <section className="flex flex-col gap-6">
      {roadmap.map((item, index) => (
        <div
          key={item.phase}
          className="relative overflow-hidden rounded-[32px] border border-[#1f2432] bg-[#0d111a] p-6 md:p-8"
        >
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-0 opacity-70",
              index % 2 === 0
                ? "bg-gradient-to-br from-[#20ff6d]/15 via-transparent to-transparent"
                : "bg-gradient-to-br from-[#7638ff]/15 via-transparent to-transparent",
            )}
          />
          <div className="relative flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <span className="text-[0.65rem] uppercase tracking-[0.6em] text-[#20ff6d]">{item.phase}</span>
              <h3 className="mt-3 text-xl font-semibold uppercase tracking-[0.2em] text-white">{item.title}</h3>
            </div>
            <p className="max-w-2xl text-sm leading-relaxed text-[#9ca3b0]">{item.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}

function FaqSection() {
  return (
    <section className="space-y-4">
      {faqs.map(item => (
        <details key={item.question} className="group rounded-[24px] border border-[#1f2432] bg-[#0c1019] p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold uppercase tracking-[0.3em] text-[#9ca3b0] transition hover:text-[#20ff6d]">
            {item.question}
            <span className="text-[#20ff6d] transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-[#737a8b]">{item.answer}</p>
        </details>
      ))}
    </section>
  );
}

function CallToAction() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-[#1f2432] bg-[#10131c] p-8 text-center md:p-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top, rgba(32,255,109,0.25), transparent 65%), radial-gradient(circle at bottom, rgba(118,56,255,0.22), transparent 65%)",
        }}
      />
      <div className="relative flex flex-col items-center gap-5">
        <span className="text-[0.68rem] uppercase tracking-[0.6em] text-[#20ff6d]">Join the flight log</span>
        <h3 className="max-w-2xl text-2xl font-semibold uppercase tracking-[0.18em] text-white">
          Step into the Hash Butterfly universe and co-create the future of metaverse storytelling
        </h3>
        <p className="max-w-xl text-sm leading-relaxed text-[#9ca3b0]">
          Mint, stake and collaborate with a collective of artists, technologists and explorers shaping the next
          frontier of culture.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild className="tracking-[0.4em]">
            <Link href="/nft/presale">Join presale</Link>
          </Button>
          <Link
            href="/mall"
            className="inline-flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.45em] text-[#9ca3b0] transition hover:text-[#20ff6d]"
          >
            Explore the mall
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center gap-6 pb-8 pt-4 text-center">
      <ButterflyMark className="size-12 text-[#20ff6d]" />
      <p className="max-w-xl text-xs uppercase tracking-[0.45em] text-[#5c6373]">
        Follow the Hash Butterfly ecosystem across every realm
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm uppercase tracking-[0.4em] text-[#9ca3b0]">
        {socials.map(item => (
          <Link key={item.label} href={item.href} className="hover:text-[#20ff6d]">
            {item.label}
          </Link>
        ))}
      </div>
      <p className="text-[0.58rem] uppercase tracking-[0.45em] text-[#3f4553]">
        © {new Date().getFullYear()} Hash Butterfly Collective
      </p>
    </footer>
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
