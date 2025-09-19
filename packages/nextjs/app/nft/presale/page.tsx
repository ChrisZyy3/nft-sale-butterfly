"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import type { Address } from "viem";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const TOKEN_IDS = [1, 2, 3, 4, 5] as const;
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
  description?: string;
  image?: string;
};

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

const formatAddress = (value: Address | undefined) => {
  if (!value || value === ZERO_ADDRESS) {
    return "";
  }
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
};

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

  const { data: maxSupply } = useScaffoldReadContract({
    contractName: "ButterflyPresale",
    functionName: "maxSupply",
  });

  const { data: totalSupply } = useScaffoldReadContract({
    contractName: "ButterflyPresale",
    functionName: "totalSupply",
  });

  const { data: totalReservations } = useScaffoldReadContract({
    contractName: "ButterflyPresale",
    functionName: "totalReservations",
  });

  const formattedMintPrice = mintPrice ? formatEther(mintPrice) : undefined;
  const reservedCount = Number(totalReservations ?? 0n);
  const mintedCount = Number(totalSupply ?? 0n);
  const maxCount = Number(maxSupply ?? 0n);

  return (
    <div className="min-h-screen bg-[#05060A] pb-24">
      <ScreenHeader title="Presale" />
      <div className="px-4 py-6">
        <div className="mx-auto max-w-md space-y-4">
          <section className="rounded-3xl bg-[#1f2733] p-5 text-sm text-[#cbd5f5]">
            <div className="flex justify-between">
              <span>Collection Supply</span>
              <span>{maxCount > 0 ? maxCount : "Loading…"}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Minted</span>
              <span>{mintedCount}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Reserved</span>
              <span>{reservedCount}</span>
            </div>
            <div className="mt-2 flex justify-between">
              <span>Mint Price</span>
              <span>{formattedMintPrice ? `${formattedMintPrice} ETH` : "Loading…"}</span>
            </div>
          </section>

          {TOKEN_IDS.map(tokenId => (
            <PresaleItemCard key={tokenId} tokenId={tokenId} isConnected={isConnected} mintPrice={mintPrice} />
          ))}
        </div>
      </div>
    </div>
  );
}

type PresaleItemCardProps = {
  tokenId: number;
  isConnected: boolean;
  mintPrice: bigint | undefined;
};

function PresaleItemCard({ tokenId, isConnected, mintPrice }: PresaleItemCardProps) {
  const [metadata, setMetadata] = useState<NftMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  const tokenIdBigInt = useMemo(() => BigInt(tokenId), [tokenId]);

  const { data: reservationData } = useScaffoldReadContract({
    contractName: "ButterflyPresale",
    functionName: "reservation",
    args: [tokenIdBigInt],
  });

  const { data: isFulfilled } = useScaffoldReadContract({
    contractName: "ButterflyPresale",
    functionName: "isFulfilled",
    args: [tokenIdBigInt],
  });

  const { writeContractAsync, isMining } = useScaffoldWriteContract({
    contractName: "ButterflyPresale",
  });

  useEffect(() => {
    const controller = new AbortController();

    const loadMetadata = async () => {
      try {
        setIsLoadingMetadata(true);
        for (const buildPath of METADATA_PATH_CANDIDATES) {
          const url = `${IPFS_GATEWAY}/${buildPath(tokenId)}`;
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
          console.error(`Failed to load metadata for token ${tokenId}`, error);
        }
        setMetadata(null);
      } finally {
        setIsLoadingMetadata(false);
      }
    };

    loadMetadata();

    return () => {
      controller.abort();
    };
  }, [tokenId]);

  const reservationInfo = reservationData as ReservationInfo | undefined;
  const reservedBy =
    reservationInfo?.buyer && reservationInfo.buyer !== ZERO_ADDRESS ? reservationInfo.buyer : undefined;
  const statusLabel = isFulfilled ? "Fulfilled" : reservedBy ? "Reserved" : "Available";
  const buyerLabel = formatAddress(reservedBy);
  const fallbackImageUrl = `${IPFS_GATEWAY}/${COLLECTION_CID}/images/${tokenId}.png`;
  const imageUrl = ipfsToHttp(metadata?.image) ?? fallbackImageUrl;

  const handleBuy = async () => {
    if (!mintPrice) return;
    try {
      await writeContractAsync({
        functionName: "reserve",
        args: [tokenIdBigInt],
        value: mintPrice,
      });
    } catch (error) {
      console.error(`Failed to reserve token ${tokenId}`, error);
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl bg-[#3a4553] p-5">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#20ff6d] text-black">
            <ButterflyIcon color="#000" />
          </div>
          <div className="text-white">
            <div className="text-sm uppercase tracking-widest text-[#cbd5f5]">Token</div>
            <div className="text-3xl font-bold">#{tokenId.toString().padStart(3, "0")}</div>
          </div>
        </div>
        <button
          type="button"
          disabled={!isConnected || !mintPrice || isFulfilled || !!reservedBy || isMining}
          className="flex items-center gap-2 rounded-full bg-[#20ff6d] px-8 py-3 text-sm font-bold text-black hover:bg-[#1ae058] disabled:opacity-50"
          onClick={handleBuy}
        >
          <CreditCardIcon />
          BUY
        </button>
      </div>

      <div className="border-t border-[#4a5562] mb-4"></div>

      <div className="grid grid-cols-[120px_1fr] gap-4">
        <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-[#232d3a]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={metadata?.name ?? `Token #${tokenId}`}
              fill
              sizes="120px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[#9ca3b0]">
              {isLoadingMetadata ? "Loading…" : "No preview"}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between text-sm text-[#e2e8f0]">
          <div>
            <div className="text-lg font-semibold text-white">{metadata?.name ?? `Token #${tokenId}`}</div>
            <div className="mt-1 text-xs text-[#9ca3b0]">
              {metadata?.description ?? "Metadata is not available yet."}
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-1">
            <div className="flex justify-between">
              <span className="text-[#9ca3b0]">Status</span>
              <span className="font-medium text-white">{statusLabel}</span>
            </div>
            {buyerLabel && (
              <div className="flex justify-between">
                <span className="text-[#9ca3b0]">Reserved By</span>
                <span className="font-mono text-xs text-[#20ff6d]">{buyerLabel}</span>
              </div>
            )}
          </div>
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
