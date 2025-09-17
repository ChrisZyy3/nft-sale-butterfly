"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  ArrowRightIcon,
  CubeTransparentIcon,
  RocketLaunchIcon,
  SparklesIcon,
  UsersIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const STATS = [
  { label: "总交易额", value: "52,438 ETH" },
  { label: "社区成员", value: "18,942" },
  { label: "NFT 系列", value: "12" },
];

const ECOSYSTEM = [
  {
    title: "Butterfly NFT",
    description: "限量铸造即将开启，解锁独家空投和治理权。",
    href: "/nft",
    icon: SparklesIcon,
    action: "前往铸造",
  },
  {
    title: "Butterfly Mall",
    description: "精选生态伙伴的限量商品，支持 NFT 抵扣。",
    href: "/#mall",
    icon: CubeTransparentIcon,
    action: "探索商城",
  },
  {
    title: "$BFLY Token",
    description: "生态通证一站式流通，享受质押与分红收益。",
    href: "/#token",
    icon: RocketLaunchIcon,
    action: "了解更多",
  },
];

const STEPS = [
  {
    title: "连接钱包",
    description: "支持多链网络，秒级完成连接。",
  },
  {
    title: "铸造专属 NFT",
    description: "参与预售与空投活动，抢先获取限量身份。",
  },
  {
    title: "加入生态治理",
    description: "通过投票、提案与贡献获得更多权益。",
  },
];

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="space-y-12 text-white">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur lg:p-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.3em] text-white/70">
              Butterfly Web3 Ecosystem
            </p>
            <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">构建下一代 ButterFly Web3 社区</h1>
            <p className="text-base text-white/80 sm:text-lg">
              链接艺术、社交与金融的多维生态，围绕 NFT、商城和钱包打造沉浸式 Web3 体验。
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/nft"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#7F5AF0] to-[#2CB1BC] px-6 py-3 text-sm font-medium text-white shadow-lg shadow-[#2CB1BC]/20 transition-transform hover:scale-[1.02]"
              >
                开始铸造
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/wallet"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white/90 transition hover:border-white hover:text-white"
              >
                查看我的钱包
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative mx-auto max-w-sm overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-15px_rgba(14,16,35,0.6)]">
              <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#2CB1BC]/30 blur-3xl" />
              <div className="relative space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Connected Wallet</p>
                  <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                    {connectedAddress ? (
                      <Address address={connectedAddress} format="short" />
                    ) : (
                      <span className="text-white/60">尚未连接钱包</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-white/60">累计权益</p>
                    <p className="mt-2 text-xl font-semibold">128,900</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-white/60">可领取奖励</p>
                    <p className="mt-2 text-xl font-semibold">1,280 BFLY</p>
                  </div>
                </div>
                <Link
                  href="/wallet"
                  className="inline-flex w-full items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-white/10 to-white/5 px-4 py-3 text-sm font-medium text-white/90 transition hover:from-white/20 hover:to-white/10"
                >
                  打开我的资产
                  <WalletIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 backdrop-blur sm:grid-cols-3">
        {STATS.map(stat => (
          <div key={stat.label} className="rounded-3xl border border-white/10 bg-[#0D1F3A]/40 p-6 text-center">
            <p className="text-sm uppercase tracking-wider text-white/60">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
          </div>
        ))}
      </section>

      <section id="mall" className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Ecosystem</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">三位一体的生态矩阵</h2>
          </div>
          <Link href="/nft" className="inline-flex items-center gap-2 text-sm text-[#8AE7FF] hover:text-white">
            查看全部功能
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {ECOSYSTEM.map(card => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-[#8AE7FF]/40 hover:bg-white/10"
            >
              <card.icon className="h-10 w-10 text-[#8AE7FF]" />
              <h3 className="mt-6 text-xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm text-white/70">{card.description}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-[#8AE7FF]">
                {card.action}
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="token" className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">How it works</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">三步开启你的 Web3 旅程</h2>
            <p className="text-sm text-white/70 sm:text-base">
              无论你是初次接触 Web3，还是资深玩家，我们都为你准备了清晰的引导和完善的资产管理体验。
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              {STEPS.map(step => (
                <div key={step.title} className="rounded-2xl border border-white/10 bg-[#0D1F3A]/40 p-4">
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="mt-2 text-sm text-white/70">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#172B54] to-[#1F3A7A] p-6">
              <div className="flex items-center gap-4">
                <UsersIcon className="h-10 w-10 text-[#8AE7FF]" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Community</p>
                  <h3 className="text-xl font-semibold">加入全球蝴蝶社区</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/70">
                参与城市节点、共创活动与线下聚会，与志同道合的伙伴共同构建开放式生态。
              </p>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1F3A7A] to-[#2E4E9B] p-6">
              <div className="flex items-center gap-4">
                <RocketLaunchIcon className="h-10 w-10 text-[#FFD166]" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Roadmap</p>
                  <h3 className="text-xl font-semibold">持续迭代的生态蓝图</h3>
                </div>
              </div>
              <p className="mt-4 text-sm text-white/70">
                从 NFT 铸造、元宇宙空间到实体经济联动，我们将按季度推出关键节点，敬请期待。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
