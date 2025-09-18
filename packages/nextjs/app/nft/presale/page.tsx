"use client";

import { ScreenHeader } from "@/components/layout/ScreenHeader";
// import { Button } from "@/components/ui/button";
import { parseEther, stringToHex } from "viem";
import { useAccount } from "wagmi";
import { useTransactor } from "~~/hooks/scaffold-eth";

const presaleItems = [
  {
    id: "001",
    minted: 290,
    maxSupply: 1000,
    priceEth: 0.01,
    backgroundColor: "#c8860d",
    iconColor: "#000",
  },
  {
    id: "002",
    minted: 480,
    maxSupply: 1000,
    priceEth: 0.01,
    backgroundColor: "#4c6ef5",
    iconColor: "#000",
  },
  {
    id: "003",
    minted: 160,
    maxSupply: 1000,
    priceEth: 0.01,
    backgroundColor: "#66d9ef",
    iconColor: "#000",
  },
  {
    id: "004",
    minted: 320,
    maxSupply: 1000,
    priceEth: 0.01,
    backgroundColor: "#20ff6d",
    iconColor: "#000",
  },
  {
    id: "005",
    minted: 780,
    maxSupply: 1000,
    priceEth: 0.01,
    backgroundColor: "#ff8787",
    iconColor: "#000",
  },
] satisfies PresaleItem[];

type PresaleItem = {
  id: string;
  minted: number;
  maxSupply: number;
  priceEth: number;
  backgroundColor: string;
  iconColor: string;
};

export default function PresalePage() {
  const { isConnected } = useAccount();
  const transactor = useTransactor();

  const handleBuy = async (itemIndex: number) => {
    try {
      const message = `${Date.now()}#${itemIndex}`;
      const data = stringToHex(message);

      await transactor({
        to: "0xcB135527801f88E5bF26CA25b2d9948b19927178",
        value: parseEther("0.01"),
        data,
      });
    } catch (error) {
      console.error("Failed to send presale purchase transaction", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#05060A] pb-24">
      <ScreenHeader title="Presale" />
      <div className="px-4 py-6">
        <div className="mx-auto max-w-md space-y-4">
          {presaleItems.map((item, index) => {
            const mintedPercent = Math.min(100, Math.round((item.minted / item.maxSupply) * 100));
            return (
              <article key={item.id} className="overflow-hidden rounded-3xl bg-[#3a4553] p-5">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-full"
                      style={{ backgroundColor: item.backgroundColor }}
                    >
                      <ButterflyIcon color={item.iconColor} />
                    </div>
                    <span className="text-3xl font-bold text-white">{item.id}</span>
                  </div>
                  <button
                    type="button"
                    disabled={!isConnected}
                    className="flex items-center gap-2 rounded-full bg-[#20ff6d] px-8 py-3 text-sm font-bold text-black hover:bg-[#1ae058] disabled:opacity-50"
                    onClick={() => handleBuy(index)}
                  >
                    <CreditCardIcon />
                    BUY
                  </button>
                </div>

                {/* 分割线 */}
                <div className="border-t border-[#4a5562] mb-4"></div>

                <div className="mb-5 flex gap-4">
                  <span className="rounded-xl border border-[#20ff6d] bg-transparent px-4 py-2 text-sm font-medium text-[#20ff6d]">
                    Number
                  </span>
                  <span className="text-lg font-semibold text-white">{item.maxSupply.toLocaleString()}</span>
                  <span className="rounded-xl border border-[#20ff6d] bg-transparent px-4 py-2 text-sm font-medium text-[#20ff6d] ml-auto">
                    Price
                  </span>
                  <span className="flex items-center gap-2 text-lg font-semibold text-white">
                    {item.priceEth.toFixed(3)}
                    <EthereumIcon />
                  </span>
                </div>

                <div className="space-y-3">
                  <Progress value={mintedPercent} />
                  <div className="flex justify-between text-sm text-[#9ca3b0]">
                    <span>Minted</span>
                    <span>
                      {item.minted.toLocaleString()} / {item.maxSupply.toLocaleString()}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type ProgressProps = {
  value: number;
};

function Progress({ value }: ProgressProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#3d4854]">
      <div className="h-full rounded-full bg-[#20ff6d]" style={{ width: `${value}%` }} />
    </div>
  );
}

function ButterflyIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
      <path d="M12 12c2.5-3.5 5-5.5 6.5-6-0.7 2.2-2 3.5-3.7 4.3 1.3 0.4 2.5 1.8 2 3.2-1.5-0.2-2.8-1.1-3.8-2-0.4 1.1-0.9 2.5-1.3 3.5-0.3-1-0.8-2.4-1.3-3.5-0.9 1-2.3 1.8-3.8 2-0.5-1.4 0.7-2.8 2-3.2-1.7-0.8-3-2.1-3.7-4.3 1.2 0.4 3.8 2.1 6.5 6Z" />
    </svg>
  );
}

function CreditCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}

function EthereumIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L5.5 12.5L12 16.5L18.5 12.5L12 2Z" fill="#627EEA" />
      <path d="M12 17.5L5.5 13.5L12 22L18.5 13.5L12 17.5Z" fill="#627EEA" opacity="0.6" />
      <path d="M12 15.5L5.5 11.5L12 2V15.5Z" fill="#627EEA" opacity="0.45" />
      <path d="M12 15.5L18.5 11.5L12 2V15.5Z" fill="#627EEA" opacity="0.8" />
    </svg>
  );
}
