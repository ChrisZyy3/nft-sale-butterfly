"use client";

import Link from "next/link";
import type { NextPage } from "next";

const ASCII_BUTTERFLY = `
000000011111111110000000
000001111111111111100000
000111111111111111111000
001111111111111111111100
011111110011111001111110
111111000011110000111111
111110000111110000111111
111100001111111000011111
011100011111111100011110
001110111111111110111100
000111111100001111111000
000011111000000111110000
000001110000000011100000
`;

const HERO_STATS = [
  { label: "GLOBAL HOLDERS", value: "18.4K" },
  { label: "NFT VOLUME", value: "52,438 ETH" },
  { label: "COMMUNITY NODES", value: "128" },
];

const FEATURE_CARDS = [
  {
    id: "nft",
    tag: "NFT",
    title: "Hash butterfly digital art piece",
    description: "独家限量的 Hash butterfly 数字艺术作品，上链即刻拥有，后续可用于身份、权益与活动的全域通行证。",
    accent: "from-[#2BFBA2] via-[#23D08F] to-[#178B66]",
    cta: "前往铸造",
    href: "/nft",
  },
  {
    id: "mall",
    tag: "MALL",
    title: "Hash butterfly is superlative",
    description: "精选生态品牌与限量周边，使用 NFT 即可兑换专属福利，线上线下融合打造全新消费体验。",
    accent: "from-[#3F51F2] via-[#6036D6] to-[#30187C]",
    cta: "探索商城",
    href: "/#ecosystem",
  },
];

const ECOSYSTEM_POINTS = [
  {
    title: "开放协同的生态网络",
    copy: "钱包、NFT、商城紧密协同，构建从资产管理到权益兑换的一体化链上生态，降低新用户的入门门槛。",
  },
  {
    title: "持续增长的社区共识",
    copy: "全球节点与线下活动持续扩张，会员通过贡献内容、参与治理即可共享生态成长带来的收益。",
  },
  {
    title: "多场景的应用延展",
    copy: "结合实体消费、数字身份、游戏娱乐等多元场景，让 Hash butterfly 成为链接虚拟与现实的桥梁。",
  },
];

const TOKEN_STATS = [
  { label: "TOKEN NAME", value: "BUTTERFLY" },
  { label: "CHAIN", value: "ETHEREUM" },
  { label: "ISSUANCE QUANTITY", value: "3 000 TRILLION" },
  { label: "UTILITY", value: "GOVERNANCE · STAKING · REWARDS" },
];

const Home: NextPage = () => {
  return (
    <div className="space-y-12 pb-8 text-white">
      <section className="overflow-hidden rounded-[32px] border border-[#1A8B5D]/40 bg-gradient-to-br from-[#020807] via-[#072015] to-[#0C3B2D] p-8 shadow-[0_30px_90px_rgba(4,45,30,0.35)] lg:p-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#1A8B5D]/60 bg-black/40 px-4 py-2 text-xs font-semibold tracking-[0.35em] text-[#5CFFC0]">
              HASH BUTTERFLY
            </span>
            <div>
              <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
                Hash butterfly{" "}
                <span className="bg-gradient-to-r from-[#5CFFC0] via-[#7AFCD6] to-[#9BFFE6] bg-clip-text text-transparent">
                  ecosystem
                </span>
              </h1>
              <p className="mt-4 max-w-xl text-sm text-white/80 sm:text-base">
                Hash butterfly 以 NFT 为起点，结合钱包与商城服务，为全球用户打造安全、可信、富有情感连接的 Web3 入口。
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {HERO_STATS.map(stat => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-xs sm:text-sm"
                >
                  <p className="uppercase tracking-[0.3em] text-[#5CFFC0]">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/nft"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#5CFFC0] to-[#2DE09E] px-6 py-3 text-sm font-semibold text-black shadow-[0_20px_45px_rgba(43,251,162,0.35)] transition hover:scale-[1.02]"
              >
                开始铸造 NFT
              </Link>
              <Link
                href="/wallet"
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white/90 transition hover:border-white hover:text-white"
              >
                查看我的钱包
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[28px] border border-[#1A8B5D]/40 bg-black/40 p-6">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(92,255,192,0.35),transparent_60%)]" />
              <pre className="whitespace-pre font-mono text-[10px] leading-[12px] text-[#5CFFC0] sm:text-xs sm:leading-[14px]">
                {ASCII_BUTTERFLY}
              </pre>
              <div className="mt-6 space-y-2 text-right text-xs text-white/60">
                <p>HASH BUTTERFLY DIGITAL DNA</p>
                <p>ON-CHAIN HASH 0x4bf...f1a</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        {FEATURE_CARDS.map(card => (
          <article
            key={card.id}
            className={`rounded-[32px] border border-white/5 bg-gradient-to-br ${card.accent} p-8 text-black shadow-[0_30px_90px_rgba(20,40,25,0.25)] transition-transform hover:-translate-y-1 sm:p-10`}
          >
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
              <div className="flex-1 space-y-4">
                <span className="text-sm font-semibold tracking-[0.4em] text-black/70">{card.tag}</span>
                <h2 className="text-2xl font-semibold leading-tight sm:text-3xl">{card.title}</h2>
                <p className="max-w-2xl text-sm leading-relaxed text-black/80 sm:text-base">{card.description}</p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                <Link
                  href={card.href}
                  className="inline-flex items-center justify-center rounded-full border border-black/20 bg-white/70 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-white"
                >
                  {card.cta}
                </Link>
                <div className="rounded-2xl border border-black/10 bg-white/60 px-4 py-3 text-left text-[11px] font-medium tracking-[0.25em] text-black/60">
                  HASH BUTTERFLY
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section
        id="ecosystem"
        className="space-y-6 rounded-[32px] border border-white/10 bg-[#0A1224]/60 p-8 shadow-[0_25px_70px_rgba(5,10,30,0.45)] sm:p-10"
      >
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#5CFFC0]">
            Hash butterfly ecosystem
          </span>
          <h3 className="text-2xl font-semibold sm:text-3xl">持续扩展的蝴蝶宇宙</h3>
          <p className="max-w-3xl text-sm text-white/70 sm:text-base">
            以用户为中心的体验设计，让每一次交互都兼具美感与实用性。从资产的安全托管到权益的灵活使用，Hash butterfly
            正在打造一个真正面向大众的链上生活方式。
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {ECOSYSTEM_POINTS.map(point => (
            <div key={point.title} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <h4 className="text-lg font-semibold text-white">{point.title}</h4>
              <p className="mt-3 text-sm text-white/70">{point.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-[#1A8B5D]/50 bg-gradient-to-r from-black/40 via-[#042316]/80 to-black/40 p-8 text-center sm:p-10">
        <h4 className="text-xl font-semibold uppercase tracking-[0.4em] text-[#5CFFC0]">Token panel</h4>
        <p className="mt-3 text-sm text-white/70">所有关键数据完全透明，轻松掌握 Hash butterfly 通证的价值与用途。</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TOKEN_STATS.map(stat => (
            <div key={stat.label} className="rounded-3xl border border-white/10 bg-black/50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.5em] text-[#5CFFC0]">{stat.label}</p>
              <p className="mt-4 text-2xl font-semibold text-white sm:text-3xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
