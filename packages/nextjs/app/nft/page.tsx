import Link from "next/link";
import type { NextPage } from "next";
import { CalendarDaysIcon, ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";

const COLLECTIONS = [
  {
    id: "Genesis 001",
    title: "Butterfly Dawn",
    description: "首批核心成员凭证，享受治理投票与专属空投。",
    total: 888,
    minted: 562,
    price: "0.08 ETH",
    start: "2025/03/01 12:00",
    whitelist: "已开启白名单预约",
    highlight: true,
  },
  {
    id: "Genesis 002",
    title: "Butterfly Aurora",
    description: "赋予限时商城折扣与线下活动贵宾通道。",
    total: 1688,
    minted: 724,
    price: "0.12 ETH",
    start: "2025/04/12 20:00",
    whitelist: "白名单申请即将开放",
    highlight: false,
  },
  {
    id: "Limited X",
    title: "Butterfly Parallel",
    description: "跨链合作系列，绑定跨界艺术家与现实权益。",
    total: 520,
    minted: 98,
    price: "待公布",
    start: "2025/05/30 10:00",
    whitelist: "敬请期待",
    highlight: false,
  },
];

const MintPage: NextPage = () => {
  return (
    <div className="space-y-10 text-white">
      <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/70">
              NFT Minting Center
            </p>
            <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">Butterfly NFT 预售中心</h1>
            <p className="text-sm text-white/70 sm:text-base">
              加入蝴蝶宇宙的最佳时刻。选择你心仪的系列，完成铸造后即可解锁权益、参与治理与兑换实体周边。
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {["实时库存监控", "多链支付支持", "铸造失败自动退款"].map(feature => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-[#0D1F3A]/40 px-4 py-3 text-xs font-medium text-white/80"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-[#172B54] to-[#253D7C] p-6 shadow-[0_25px_70px_-20px_rgba(10,16,45,0.6)]">
              <div className="flex items-center gap-4">
                <SparklesIcon className="h-10 w-10 text-[#8AE7FF]" />
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Mint Status</p>
                  <h2 className="text-xl font-semibold">当前进度</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-4 text-sm text-white/80">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <span>已铸造总量</span>
                  <span>1,384 / 3,096</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <span>累计销毁</span>
                  <span>86</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3">
                  <span>社区铸造 Gas 返还</span>
                  <span>36.2 ETH</span>
                </div>
              </div>
              <Link
                href="/wallet"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white/90 px-5 py-3 text-sm font-semibold text-[#172B54] transition hover:bg-white"
              >
                查看我的铸造记录
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Collections</p>
            <h2 className="text-2xl font-semibold sm:text-3xl">选择系列并完成铸造</h2>
          </div>
          <Link href="/oldhome" className="inline-flex items-center gap-2 text-sm text-[#8AE7FF] hover:text-white">
            查看旧版控制面板
          </Link>
        </div>
        <div className="space-y-6">
          {COLLECTIONS.map(collection => {
            const progress = Math.min(100, Math.round((collection.minted / collection.total) * 100));

            return (
              <div
                key={collection.id}
                className={`rounded-[32px] border border-white/10 p-6 backdrop-blur transition ${
                  collection.highlight ? "bg-gradient-to-br from-white/15 via-white/5 to-white/10" : "bg-white/5"
                }`}
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                      <span>{collection.id}</span>
                      <span className="rounded-full border border-white/20 px-3 py-1">{collection.whitelist}</span>
                    </div>
                    <h3 className="text-2xl font-semibold">{collection.title}</h3>
                    <p className="text-sm text-white/70">{collection.description}</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {[
                        { label: "总量", value: collection.total },
                        { label: "已铸造", value: collection.minted },
                        { label: "价格", value: collection.price },
                      ].map(item => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-white/10 bg-[#0D1F3A]/40 px-4 py-3 text-sm"
                        >
                          <p className="text-white/60">{item.label}</p>
                          <p className="mt-2 text-lg font-semibold">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="w-full max-w-sm space-y-4">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
                      <div className="flex items-center gap-2 text-white">
                        <CalendarDaysIcon className="h-5 w-5" />
                        <span>开售时间</span>
                      </div>
                      <p className="mt-2 text-lg font-semibold">{collection.start}</p>
                      <div className="mt-4 flex items-center gap-2 text-white/70">
                        <ClockIcon className="h-5 w-5" />
                        <span>预计耗时 8 秒完成铸造</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
                        <span>进度</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#7F5AF0] to-[#2CB1BC]"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <Link
                      href="/wallet"
                      className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#7F5AF0] to-[#2CB1BC] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#2CB1BC]/20 transition hover:scale-[1.01]"
                    >
                      立即铸造
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MintPage;
