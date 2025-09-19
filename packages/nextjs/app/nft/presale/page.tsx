"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import {
  INVITE_PARAM_KEY,
  PROMOTION_RULES,
  getStoredInviteCode,
  incrementReferralCount,
  normalizeInviteCode,
  storeInviteCode,
} from "@/lib/invite";
import type { Address } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const CARD_COLORS = ["#c8860d", "#4c6ef5", "#66d9ef", "#20ff6d", "#ff8787"] as const;

type PresaleItem = {
  tokenId: number;
  label: string;
  backgroundColor: string;
};

const PRESALE_ITEMS: PresaleItem[] = Array.from({ length: 100 }, (_, index) => ({
  tokenId: index + 1,
  label: String(index + 1).padStart(3, "0"),
  backgroundColor: CARD_COLORS[index % CARD_COLORS.length],
}));
const ITEMS_PER_PAGE = 10;
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
  const searchParams = useSearchParams();
  const inviteParam = searchParams.get(INVITE_PARAM_KEY);
  const { address, isConnected } = useAccount();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [isInviteReady, setIsInviteReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const normalizedParam = normalizeInviteCode(inviteParam);
    if (normalizedParam) {
      storeInviteCode(normalizedParam);
      setInviteCode(normalizedParam);
      setIsInviteReady(true);
      return;
    }

    const stored = getStoredInviteCode();
    setInviteCode(stored);
    setIsInviteReady(true);
  }, [inviteParam]);

  const { data: mintPrice } = useScaffoldReadContract({
    contractName: "ButterflyPresale",
    functionName: "mintPrice",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(PRESALE_ITEMS.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return PRESALE_ITEMS.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage]);

  const goToPrevious = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNext = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  if (!isInviteReady) {
    return (
      <div className="min-h-screen bg-[#05060A] pb-24">
        <ScreenHeader title="Presale" />
        <div className="px-4 py-6">
          <div className="mx-auto max-w-md rounded-3xl border border-[#1f2432] bg-[#10131c] px-6 py-8 text-center text-sm text-[#9ca3b0]">
            正在校验邀请链接...
          </div>
        </div>
      </div>
    );
  }

  if (!inviteCode) {
    return (
      <div className="min-h-screen bg-[#05060A] pb-24">
        <ScreenHeader title="Presale" />
        <div className="px-4 py-6">
          <div className="mx-auto max-w-md space-y-4 rounded-3xl border border-[#1f2432] bg-[#10131c] px-6 py-8 text-center text-white">
            <h2 className="text-lg font-semibold uppercase tracking-[0.28em] text-[#20ff6d]">需要邀请码</h2>
            <p className="text-sm text-[#9ca3b0]">请通过已购玩家提供的邀请链接访问DAPP后再参与Hash Butterfly预售。</p>
            <ol className="space-y-2 text-xs text-[#9ca3b0]">
              {PROMOTION_RULES.map((rule, index) => (
                <li key={rule} className="flex gap-2 text-left">
                  <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#20ff6d] text-[10px] font-semibold text-black">
                    {index + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    );
  }

  const inviterDisplay = formatAddress(inviteCode);
  const canPurchase = Boolean(inviteCode);

  return (
    <div className="min-h-screen bg-[#05060A] pb-24">
      <ScreenHeader title="Presale" />
      <div className="px-4 py-6">
        <div className="mx-auto mb-6 max-w-md rounded-2xl border border-[#1f2432] bg-[#10131c] px-4 py-3 text-xs text-[#9ca3b0]">
          当前邀请人：<span className="font-semibold text-white">{inviterDisplay}</span>
        </div>
        <div className="mx-auto max-w-md space-y-4">
          {paginatedItems.map(item => (
            <PresaleItemCard
              key={item.tokenId}
              item={item}
              isConnected={isConnected}
              mintPrice={mintPrice}
              canPurchase={canPurchase}
              inviteCode={inviteCode}
              buyerAddress={address}
            />
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-md items-center justify-between text-white">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={currentPage === 1}
            className="rounded-full border border-[#4a5562] px-4 py-2 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-[#9ca3b0]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            onClick={goToNext}
            disabled={currentPage === totalPages}
            className="rounded-full border border-[#4a5562] px-4 py-2 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

type PresaleItemCardProps = {
  item: PresaleItem;
  isConnected: boolean;
  mintPrice: bigint | undefined;
  canPurchase: boolean;
  inviteCode: string | null;
  buyerAddress?: Address;
};

function PresaleItemCard({
  item,
  isConnected,
  mintPrice,
  canPurchase,
  inviteCode,
  buyerAddress,
}: PresaleItemCardProps) {
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
  const priceLabel = "0.01";
  const isBuyDisabled = !isConnected || !mintPrice || isReserved || isMining || !canPurchase;

  const handleBuy = async () => {
    if (!mintPrice || !canPurchase) return;
    try {
      await writeContractAsync({
        functionName: "reserve",
        args: [tokenIdBigInt],
        value: mintPrice,
      });
      if (inviteCode) {
        const normalizedBuyer = buyerAddress?.toLowerCase();
        if (!normalizedBuyer || normalizedBuyer !== inviteCode) {
          incrementReferralCount(inviteCode);
        }
      }
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
          disabled={isBuyDisabled}
          className="flex items-center gap-2 rounded-full bg-[#20ff6d] px-8 py-3 text-sm font-bold text-black hover:bg-[#1ae058] disabled:opacity-50"
          onClick={handleBuy}
        >
          <CreditCardIcon />
          BUY
        </button>
        {!canPurchase ? <p className="mt-2 text-xs text-[#ff5f66]">需要有效的邀请码才能购买。</p> : null}
      </div>

      <div className="border-t border-[#4a5562] mb-4"></div>

      <div className="mb-5 flex gap-4">
        <span className="rounded-xl border border-[#20ff6d] bg-transparent px-4 py-2 text-sm font-medium text-[#20ff6d]">
          Number
        </span>
        <span className="text-lg font-semibold text-white">1000</span>
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

function formatAddress(value: string) {
  if (value.length <= 10) {
    return value;
  }
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
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
