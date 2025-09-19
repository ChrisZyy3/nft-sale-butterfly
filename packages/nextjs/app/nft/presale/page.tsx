"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import type { Address } from "viem";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const PRESALE_ITEMS = [
  { tokenId: 1, label: "001", backgroundColor: "#c8860d" },
  { tokenId: 2, label: "002", backgroundColor: "#4c6ef5" },
  { tokenId: 3, label: "003", backgroundColor: "#66d9ef" },
  { tokenId: 4, label: "004", backgroundColor: "#20ff6d" },
  { tokenId: 5, label: "005", backgroundColor: "#ff8787" },
] as const;
const COLLECTION_CID = "bafybeiclu2xddpmbpgipirkjdrpxtnimpzm5a3cvfzlbpfa4irnyqfhf4u";
const IPFS_GATEWAY = "https://ipfs.io/ipfs";
const METADATA_PATH_CANDIDATES = [
  (tokenId: number) => `${COLLECTION_CID}/metadata/${tokenId}.json`,
  (tokenId: number) => `${COLLECTION_CID}/metadata/${tokenId}`,
  (tokenId: number) => `${COLLECTION_CID}/json/${tokenId}.json`,
  (tokenId: number) => `${COLLECTION_CID}/json/${tokenId}`,
];

type ReservationInfo = {
  buyer: Address;
  pricePaid: bigint;
  reservedAt: bigint;
  fulfilled: boolean;
};

type NftMetadata = {
  name?: string;
  image?: string;
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

const ipfsToHttp = (uri?: string) => {
  if (!uri) return undefined;
  return uri.startsWith("ipfs://") ? uri.replace("ipfs://", `${IPFS_GATEWAY}/`) : uri;
};

export default function PresalePage() {
  const { isConnected } = useAccount();

  const { data: mintPrice } = useScaffoldReadContract({
    contractName: "ButterflyPresale",
    functionName: "mintPrice",
  });

  return (
    <div className="min-h-screen bg-[#05060A] pb-24">
      <ScreenHeader title="Presale" />
      <div className="px-4 py-6">
        <div className="mx-auto max-w-md space-y-4">
          {PRESALE_ITEMS.map(item => (
            <PresaleItemCard key={item.tokenId} item={item} isConnected={isConnected} mintPrice={mintPrice} />
          ))}
        </div>
      </div>
    </div>
  );
}

type PresaleItemCardProps = {
  item: (typeof PRESALE_ITEMS)[number];
  isConnected: boolean;
  mintPrice: bigint | undefined;
};

function PresaleItemCard({ item, isConnected, mintPrice }: PresaleItemCardProps) {
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);

  const tokenIdBigInt = useMemo(() => BigInt(item.tokenId), [item.tokenId]);

  const { data: reservationData } = useScaffoldReadContract({
    contractName: "ButterflyPresale",
    functionName: "reservation",
    args: [tokenIdBigInt],
  });

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "ButterflyPresale",
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadMetadata = async () => {
      try {
        for (const buildPath of METADATA_PATH_CANDIDATES) {
          const url = `${IPFS_GATEWAY}/${buildPath(item.tokenId)}`;
          try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) {
              continue;
            }
            const json = (await response.json()) as NftMetadata;
            setMetadata(json);
            return;
          } catch (innerError) {
            if ((innerError as Error).name === "AbortError") {
              throw innerError;
            }
          }
        }
        setMetadata(null);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error(`Failed to load metadata for token ${item.tokenId}`, error);
        }
        setMetadata(null);
      }
    };

    loadMetadata();

    return () => {
      controller.abort();
    };
  }, [item.tokenId]);

  const reservationInfo = reservationData as ReservationInfo | undefined;
  const reservedBy =
    reservationInfo?.buyer && reservationInfo.buyer !== ZERO_ADDRESS ? reservationInfo.buyer : undefined;
  const fallbackImageUrl = `${IPFS_GATEWAY}/${COLLECTION_CID}/images/${item.tokenId}.png`;
  const imageUrl = ipfsToHttp(metadata?.image) ?? fallbackImageUrl;
  const isReserved = Boolean(reservedBy);
  const mintedCount = isReserved ? 1 : 0;
  const mintedPercent = mintedCount * 100;
  const priceLabel = mintPrice ? Number.parseFloat(formatEther(mintPrice)).toFixed(3) : "--";

  const handleBuy = async () => {
    if (!mintPrice) return;
    try {
      await writeContractAsync({
        functionName: "reserve",
        args: [tokenIdBigInt],
        value: mintPrice,
      });
    } catch (error) {
      console.error(`Failed to reserve token ${item.tokenId}`, error);
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl bg-[#3a4553] p-5">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full"
            style={{ backgroundColor: item.backgroundColor }}
          >
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={metadata?.name ?? `Token #${item.tokenId}`}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <ButterflyIcon color="#000" />
            )}
          </div>
          <span className="text-3xl font-bold text-white">{item.label}</span>
        </div>
        <button
          type="button"
          disabled={!isConnected || !mintPrice || isReserved || isMining}
          className="flex items-center gap-2 rounded-full bg-[#20ff6d] px-8 py-3 text-sm font-bold text-black hover:bg-[#1ae058] disabled:opacity-50"
          onClick={handleBuy}
        >
          <CreditCardIcon />
          BUY
        </button>
      </div>

      <div className="border-t border-[#4a5562] mb-4"></div>

      <div className="mb-5 flex gap-4">
        <span className="rounded-xl border border-[#20ff6d] bg-transparent px-4 py-2 text-sm font-medium text-[#20ff6d]">
          Number
        </span>
        <span className="text-lg font-semibold text-white">1</span>
        <span className="rounded-xl border border-[#20ff6d] bg-transparent px-4 py-2 text-sm font-medium text-[#20ff6d] ml-auto">
          Price
        </span>
        <span className="flex items-center gap-2 text-lg font-semibold text-white">
          {priceLabel}
          <EthereumIcon />
        </span>
      </div>

      <div className="space-y-3">
        <Progress value={mintedPercent} />
        <div className="flex justify-between text-sm text-[#9ca3b0]">
          <span>Minted</span>
          <span>{mintedCount} / 1</span>
        </div>
      </div>
    </article>
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

type ProgressProps = {
  value: number;
};

function Progress({ value }: ProgressProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#3d4854]">
      <div className="h-full rounded-full bg-[#20ff6d]" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
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
