"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  ArrowPathRoundedSquareIcon,
  ArrowUpOnSquareStackIcon,
  BanknotesIcon,
  CubeIcon,
  GiftTopIcon,
  ShieldCheckIcon,
  UsersIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const QUICK_ACTIONS = [
  {
    title: "我的余额",
    description: "主钱包资产汇总",
    highlight: "6.82 ETH",
    icon: BanknotesIcon,
  },
  {
    title: "数字资产",
    description: "NFT、代币与仓位总览",
    highlight: "24 项资产",
    icon: CubeIcon,
  },
  {
    title: "好友邀请",
    description: "分享链接获得奖励",
    highlight: "已邀请 18 人",
    icon: UsersIcon,
  },
  {
    title: "我的 NFT",
    description: "查看收藏与权益",
    highlight: "8 个系列",
    icon: GiftTopIcon,
  },
  {
    title: "订单中心",
    description: "商城与铸造订单",
    highlight: "3 个进行中",
    icon: ArrowPathRoundedSquareIcon,
  },
  {
    title: "安全中心",
    description: "风险监测与授权管理",
    highlight: "2 个提醒",
    icon: ShieldCheckIcon,
  },
];

const WalletPage: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <div className="space-y-10 text-white">
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#14264D] to-[#1E3570] p-8 shadow-[0_25px_70px_-20px_rgba(10,16,45,0.6)]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
              My Web3 Wallet
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">欢迎回来，Butterfly 探索者</h1>
            <p className="text-sm text-white/70 sm:text-base">
              在这里统一管理你的资产、NFT、邀请奖励与订单，一站式掌握所有生态权益。
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-sm">
                <p className="text-white/60">已连接地址</p>
                <div className="mt-3 text-base font-medium">
                  {connectedAddress ? <Address address={connectedAddress} format="short" /> : "尚未连接"}
                </div>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 text-sm">
                <p className="text-white/60">会员等级</p>
                <p className="mt-3 text-2xl font-semibold">Butterfly Lv.3</p>
                <p className="mt-1 text-xs uppercase tracking-[0.3em] text-white/60">成长值 1820 / 2400</p>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/nft"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/90 px-6 py-3 text-sm font-semibold text-[#172B54] transition hover:bg-white"
              >
                铸造更多 NFT
                <ArrowUpOnSquareStackIcon className="h-4 w-4" />
              </Link>
              <Link
                href="/nft"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white/90 transition hover:border-white hover:text-white"
              >
                查看权益攻略
              </Link>
            </div>
          </div>
          <div className="w-full max-w-sm space-y-4">
            <div className="rounded-[28px] border border-white/20 bg-white/10 p-6">
              <div className="flex items-center gap-3">
                <WalletIcon className="h-10 w-10 text-[#8AE7FF]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">Overview</p>
                  <h2 className="text-xl font-semibold">资产概览</h2>
                </div>
              </div>
              <div className="mt-6 space-y-4 text-sm text-white/80">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0D1F3A]/50 px-4 py-3">
                  <span>可用余额</span>
                  <span className="text-lg font-semibold">4.12 ETH</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0D1F3A]/50 px-4 py-3">
                  <span>锁仓质押</span>
                  <span className="text-lg font-semibold">2.70 ETH</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#0D1F3A]/50 px-4 py-3">
                  <span>可领取奖励</span>
                  <span className="text-lg font-semibold">1,560 BFLY</span>
                </div>
              </div>
            </div>
            <div className="rounded-[28px] border border-white/20 bg-[#0D1F3A]/60 p-6 text-sm text-white/80">
              <div className="flex items-center gap-3 text-white">
                <ShieldCheckIcon className="h-6 w-6" />
                <span className="text-sm font-semibold">安全提示</span>
              </div>
              <ul className="mt-4 space-y-2">
                {["检测到 1 个待确认的授权请求", "建议开启交易限额与登录提醒", "关注钓鱼链接，请勿泄露助记词"].map(
                  alert => (
                    <li key={alert} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      {alert}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Quick Actions</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">快速入口</h2>
          </div>
          <Link href="/nft" className="inline-flex items-center gap-2 text-sm text-[#8AE7FF] hover:text-white">
            查看全部功能
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map(action => (
            <div
              key={action.title}
              className="group rounded-[28px] border border-white/10 bg-white/5 p-6 transition hover:border-[#8AE7FF]/40 hover:bg-white/10"
            >
              <action.icon className="h-8 w-8 text-[#8AE7FF]" />
              <h3 className="mt-5 text-lg font-semibold">{action.title}</h3>
              <p className="mt-2 text-sm text-white/70">{action.description}</p>
              <p className="mt-6 text-sm font-medium text-[#8AE7FF]">{action.highlight}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="flex-1 space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Activity</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">最近资产动态</h2>
            <div className="space-y-4 text-sm text-white/80">
              {["成功领取 260 BFLY 奖励", "完成 Butterfly Dawn #238 的铸造", "好友 Alice 成功注册并完成首次交易"].map(
                item => (
                  <div key={item} className="rounded-2xl border border-white/10 bg-[#0D1F3A]/40 px-4 py-3">
                    {item}
                  </div>
                ),
              )}
            </div>
          </div>
          <div className="w-full max-w-md space-y-4">
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#1A2F63] to-[#2D48A4] p-6 text-sm text-white/80">
              <div className="flex items-center gap-3 text-white">
                <ArrowPathRoundedSquareIcon className="h-6 w-6" />
                <span className="text-sm font-semibold">资产同步中</span>
              </div>
              <p className="mt-3 text-sm text-white/70">链上数据每 30 秒刷新一次，如有延迟请稍后再试或手动同步。</p>
              <button className="mt-5 inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-2 text-sm font-medium text-white transition hover:border-white">
                立即同步
              </button>
            </div>
            <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 text-sm text-white/80">
              <div className="flex items-center gap-3 text-white">
                <ArrowUpOnSquareStackIcon className="h-6 w-6" />
                <span className="text-sm font-semibold">资产导出</span>
              </div>
              <p className="mt-3 text-sm text-white/70">
                一键导出你的资产报表，支持 Excel 与 CSV 格式，方便税务申报与资产审计。
              </p>
              <button className="mt-5 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#7F5AF0] to-[#2CB1BC] px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-[#2CB1BC]/20 transition hover:scale-[1.01]">
                导出报表
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WalletPage;
