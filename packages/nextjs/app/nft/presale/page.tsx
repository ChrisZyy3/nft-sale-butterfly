"use client";

import { type ChangeEvent, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatUnits } from "viem";
import { useAccount, useChainId, useReadContract, useReadContracts, useSwitchChain, useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

const STAGE_SIZE = 1000;
const DISPLAY_PRICE = "0.011";
const MAX_PURCHASE_FALLBACK = 10;
const BSC_TESTNET_CHAIN_ID = 97;
const BUTTERFLY_CONTRACT_ADDRESS = "0xD3E517C3ffDa92D560378A70ee7F717d51e34d70" as const;

const BUTTERFLY_CONTRACT_ABI = [
  {
    inputs: [],
    name: "getCurrentRoundInfo",
    outputs: [
      { internalType: "uint256", name: "round", type: "uint256" },
      { internalType: "uint256", name: "sold", type: "uint256" },
      { internalType: "uint256", name: "remaining", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "roundNumber", type: "uint256" }],
    name: "getRoundInfo",
    outputs: [
      { internalType: "uint256", name: "sold", type: "uint256" },
      { internalType: "uint256", name: "remaining", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UNIT_PRICE",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "MAX_PURCHASE_PER_ADDRESS",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "roundNumber", type: "uint256" },
      { internalType: "address", name: "buyer", type: "address" },
    ],
    name: "roundUserPurchases",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "quantity", type: "uint256" }],
    name: "purchase",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserAvailablePurchase",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

type PresaleRound = {
  id: number;
  label: string;
  iconAccent: string;
  iconBackground: string;
  isActive: boolean;
};

const PRESALE_ROUNDS: PresaleRound[] = [
  {
    id: 1,
    label: "001",
    iconAccent: "#20FF6D",
    iconBackground: "linear-gradient(135deg, #163824 0%, #0F1E14 100%)",
    isActive: false,
  },
  {
    id: 2,
    label: "002",
    iconAccent: "#4C6EF5",
    iconBackground: "linear-gradient(135deg, #17204B 0%, #0E1329 100%)",
    isActive: false,
  },
  {
    id: 3,
    label: "003",
    iconAccent: "#66D9EF",
    iconBackground: "linear-gradient(135deg, #12323E 0%, #0C1E25 100%)",
    isActive: false,
  },
  {
    id: 4,
    label: "004",
    iconAccent: "#FF8787",
    iconBackground: "linear-gradient(135deg, #3B1414 0%, #190707 100%)",
    isActive: false,
  },
  {
    id: 5,
    label: "005",
    iconAccent: "#F7B731",
    iconBackground: "linear-gradient(135deg, #3A2B0E 0%, #1A1306 100%)",
    isActive: false,
  },
];

type RoundWithProgress = PresaleRound & {
  mintedCount: number;
  mintedPercent: number;
  startingTokenId: number;
  available: number;
  availableForAccount: number;
};

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const numberFormatter = new Intl.NumberFormat("en-US");
const formatNumber = (value: number) => numberFormatter.format(value);

export default function PresalePage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitchingChain } = useSwitchChain();

  const {
    data: currentRoundInfo,
    status: currentRoundStatus,
    error: currentRoundError,
    refetch: refetchCurrentRoundInfo,
  } = useReadContract({
    address: BUTTERFLY_CONTRACT_ADDRESS,
    abi: BUTTERFLY_CONTRACT_ABI,
    functionName: "getCurrentRoundInfo",
    chainId: BSC_TESTNET_CHAIN_ID,
  });

  useEffect(() => {
    if (currentRoundStatus === "error") {
      console.error("getCurrentRoundInfo 调用失败", currentRoundError);
    }
  }, [currentRoundStatus, currentRoundError]);

  const { data: unitPrice } = useReadContract({
    address: BUTTERFLY_CONTRACT_ADDRESS,
    abi: BUTTERFLY_CONTRACT_ABI,
    functionName: "UNIT_PRICE",
    chainId: BSC_TESTNET_CHAIN_ID,
  });

  const { data: maxPurchasePerAddress } = useReadContract({
    address: BUTTERFLY_CONTRACT_ADDRESS,
    abi: BUTTERFLY_CONTRACT_ABI,
    functionName: "MAX_PURCHASE_PER_ADDRESS",
    chainId: BSC_TESTNET_CHAIN_ID,
  });

  const { data: roundInfoData } = useReadContracts({
    contracts: PRESALE_ROUNDS.map(round => ({
      address: BUTTERFLY_CONTRACT_ADDRESS,
      abi: BUTTERFLY_CONTRACT_ABI,
      functionName: "getRoundInfo",
      args: [BigInt(round.id)] as const,
      chainId: BSC_TESTNET_CHAIN_ID,
    })),
  });

  const { data: accountRoundPurchases } = useReadContracts({
    contracts: PRESALE_ROUNDS.map(round => ({
      address: BUTTERFLY_CONTRACT_ADDRESS,
      abi: BUTTERFLY_CONTRACT_ABI,
      functionName: "roundUserPurchases",
      args: [BigInt(round.id), (address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`] as const,
      chainId: BSC_TESTNET_CHAIN_ID,
    })),
    query: {
      enabled: Boolean(address),
    },
  });

  const { data: userAvailablePurchase, refetch: refetchUserAvailablePurchase } = useReadContract({
    address: BUTTERFLY_CONTRACT_ADDRESS,
    abi: BUTTERFLY_CONTRACT_ABI,
    functionName: "getUserAvailablePurchase",
    args: [(address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`],
    chainId: BSC_TESTNET_CHAIN_ID,
    query: {
      enabled: Boolean(address),
    },
  });

  const currentRound = useMemo(() => {
    if (!currentRoundInfo) return 0;
    const [round] = currentRoundInfo as readonly [bigint, bigint, bigint];
    return Number(round);
  }, [currentRoundInfo]);

  const maxPerAddress = useMemo(
    () => Number(maxPurchasePerAddress ?? BigInt(MAX_PURCHASE_FALLBACK)) || MAX_PURCHASE_FALLBACK,
    [maxPurchasePerAddress],
  );

  const roundsWithProgress = useMemo(() => {
    return PRESALE_ROUNDS.map((round, index) => {
      const roundInfoResult = roundInfoData?.[index]?.result as readonly [bigint, bigint] | undefined;

      let sold = Number(roundInfoResult?.[0] ?? 0n);
      let remaining = Number(roundInfoResult?.[1] ?? BigInt(STAGE_SIZE));

      if (round.id === currentRound && currentRoundInfo) {
        const [, currentSold, currentRemaining] = currentRoundInfo as readonly [bigint, bigint, bigint];
        sold = Number(currentSold);
        remaining = Number(currentRemaining);
      }

      const mintedCount = clampNumber(sold, 0, STAGE_SIZE);
      const mintedPercent = (mintedCount / STAGE_SIZE) * 100;
      const startingTokenId = (round.id - 1) * STAGE_SIZE + 1;
      const available = Math.max(0, Math.min(STAGE_SIZE, remaining));
      const accountPurchased = Number((accountRoundPurchases?.[index]?.result as bigint | undefined) ?? BigInt(0));
      const perAccountRemaining = Math.max(0, maxPerAddress - accountPurchased);
      let availableForAccount = Math.min(available, perAccountRemaining);

      if (round.id === currentRound) {
        const userAvailable = address
          ? Number(userAvailablePurchase ?? BigInt(perAccountRemaining))
          : perAccountRemaining;
        availableForAccount = Math.min(available, Math.max(0, userAvailable));
      }

      return {
        ...round,
        isActive: round.id === currentRound,
        mintedCount,
        mintedPercent,
        startingTokenId,
        available,
        availableForAccount,
      } satisfies RoundWithProgress;
    });
  }, [
    accountRoundPurchases,
    address,
    currentRound,
    currentRoundInfo,
    maxPerAddress,
    roundInfoData,
    userAvailablePurchase,
  ]);

  const formattedPrice = useMemo(() => {
    try {
      return unitPrice ? formatUnits(unitPrice, 18) : DISPLAY_PRICE;
    } catch (error) {
      console.warn("Failed to format UNIT_PRICE", error);
      return DISPLAY_PRICE;
    }
  }, [unitPrice]);

  const isOnSupportedNetwork = !isConnected || chainId === BSC_TESTNET_CHAIN_ID;

  const handleSwitchToBsc = useCallback(async () => {
    if (!switchChainAsync) {
      notification.error("Unable to switch networks automatically. Please change it from your wallet.");
      return;
    }

    try {
      await switchChainAsync({ chainId: BSC_TESTNET_CHAIN_ID });
      notification.success("Switched to BSC Testnet.");
    } catch (error) {
      console.error("Failed to switch to BSC Testnet", error);
      notification.error("Failed to switch network. Please try again from your wallet.");
    }
  }, [switchChainAsync]);

  const handlePurchaseSuccess = useCallback(async () => {
    await Promise.all([refetchCurrentRoundInfo(), refetchUserAvailablePurchase()]);
  }, [refetchCurrentRoundInfo, refetchUserAvailablePurchase]);

  return (
    <div className="min-h-screen bg-[#05060A] pb-24">
      <ScreenHeader title="Presale" />
      <div className="px-4 py-6">
        <div className="mx-auto max-w-md space-y-4">
          {isConnected && !isOnSupportedNetwork ? (
            <button
              type="button"
              onClick={handleSwitchToBsc}
              disabled={isSwitchingChain}
              className="w-full rounded-2xl border border-[#2B1B1B] bg-[#190C0C] p-4 text-sm text-[#FF8787] transition-colors hover:border-[#FF8787]/60 hover:bg-[#2A1515] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8787] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05060A] disabled:cursor-not-allowed disabled:opacity-70"
            >
              Please switch your wallet network to BSC Testnet (chain id 97) to participate in the presale.
            </button>
          ) : null}
          {roundsWithProgress.map(round => (
            <PresaleRoundCard
              key={round.id}
              round={round}
              unitPrice={unitPrice}
              formattedPrice={formattedPrice}
              isConnected={isConnected}
              isOnSupportedNetwork={isOnSupportedNetwork}
              onPurchaseSuccess={handlePurchaseSuccess}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
type PresaleRoundCardProps = {
  round: RoundWithProgress;
  unitPrice: bigint | undefined;
  formattedPrice: string;
  isConnected: boolean;
  isOnSupportedNetwork: boolean;
  onPurchaseSuccess?: () => Promise<void> | void;
};

function PresaleRoundCard({
  round,
  unitPrice,
  formattedPrice,
  isConnected,
  isOnSupportedNetwork,
  onPurchaseSuccess,
}: PresaleRoundCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState("1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContractAsync, isPending } = useWriteContract();
  const { openConnectModal } = useConnectModal();
  const activeChainId = useChainId();
  const isConnectedRef = useRef(isConnected);
  const chainIdRef = useRef<number | undefined>(activeChainId);
  const previousIsConnectedRef = useRef(isConnected);
  const activeConnectionPromiseRef = useRef<Promise<void> | null>(null);
  const pendingConnectionRef = useRef<{
    resolve: () => void;
    reject: (reason?: unknown) => void;
  } | null>(null);
  const connectionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingConnection = useCallback(() => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }
    pendingConnectionRef.current = null;
    activeConnectionPromiseRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      const pending = pendingConnectionRef.current;
      if (pending) {
        pending.reject(new Error("Wallet connection cancelled."));
      }
      clearPendingConnection();
    };
  }, [clearPendingConnection]);

  useEffect(() => {
    chainIdRef.current = activeChainId;
  }, [activeChainId]);

  useEffect(() => {
    const wasConnected = previousIsConnectedRef.current;
    if (!wasConnected && isConnected) {
      isConnectedRef.current = true;
      pendingConnectionRef.current?.resolve();
      if (onPurchaseSuccess) {
        void onPurchaseSuccess();
      }
    } else if (wasConnected && !isConnected) {
      isConnectedRef.current = false;
      pendingConnectionRef.current?.reject(new Error("Wallet disconnected."));
    } else {
      isConnectedRef.current = isConnected;
    }

    previousIsConnectedRef.current = isConnected;
  }, [isConnected, onPurchaseSuccess]);

  const waitForWalletConnection = useCallback(async () => {
    if (isConnectedRef.current) return;

    if (activeConnectionPromiseRef.current) {
      return activeConnectionPromiseRef.current;
    }

    if (!openConnectModal) {
      throw new Error("Wallet connect modal is not available.");
    }

    activeConnectionPromiseRef.current = new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        clearPendingConnection();
        reject(new Error("Wallet connection timed out. Please try again."));
      }, 60_000);

      connectionTimeoutRef.current = timeoutId;
      pendingConnectionRef.current = {
        resolve: () => {
          clearPendingConnection();
          resolve();
        },
        reject: reason => {
          clearPendingConnection();
          reject(reason);
        },
      };
    });

    try {
      openConnectModal();
    } catch (error) {
      clearPendingConnection();
      throw error;
    }

    return activeConnectionPromiseRef.current;
  }, [clearPendingConnection, openConnectModal]);

  useEffect(() => {
    if (!round.isActive) {
      setQuantity(1);
      setQuantityInput("1");
      return;
    }

    setQuantity(previous => {
      const normalized = previous <= 0 ? 1 : previous;
      const clamped = Math.min(normalized, round.availableForAccount);
      if (clamped !== previous) {
        setQuantityInput(String(clamped));
        return clamped;
      }
      setQuantityInput(String(clamped));
      return previous;
    });
  }, [round.availableForAccount, round.isActive]);

  const quantityDisabled = !round.isActive || round.availableForAccount <= 0 || !isOnSupportedNetwork;
  const canDecrease = !quantityDisabled && quantity > 1;
  const canIncrease = !quantityDisabled && quantity < round.availableForAccount;

  const handleQuantityInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuantityInput(value);

    if (quantityDisabled || value === "") {
      return;
    }

    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) {
      return;
    }

    const clamped = clampNumber(parsed, 1, round.availableForAccount);
    setQuantity(clamped);
    if (clamped !== parsed) {
      setQuantityInput(String(clamped));
    }
  };

  const adjustQuantity = (delta: number) => {
    if (quantityDisabled) return;
    setQuantity(previous => {
      const base = previous <= 0 ? 1 : previous;
      const next = clampNumber(base + delta, 1, round.availableForAccount);
      setQuantityInput(String(next));
      return next;
    });
  };

  const handleDecrease = () => adjustQuantity(-1);
  const handleIncrease = () => adjustQuantity(1);

  const roundIsActionable =
    round.isActive && round.availableForAccount > 0 && isOnSupportedNetwork && !isPending && !isSubmitting;

  const handleBuy = async () => {
    if (!round.isActive) return;

    if (isPending || isSubmitting) {
      return;
    }

    if (!isOnSupportedNetwork) {
      return;
    }

    if (round.availableForAccount <= 0 || quantity > round.availableForAccount) {
      notification.error("You have exceeded the maximum quantity available for this round.");
      return;
    }

    try {
      await waitForWalletConnection();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Wallet connection failed.";
      notification.error(message);
      return;
    }

    if (chainIdRef.current !== BSC_TESTNET_CHAIN_ID) {
      return;
    }

    const safeQuantity = clampNumber(quantity, 1, round.availableForAccount);
    if (safeQuantity <= 0) {
      notification.error("You have exceeded the maximum quantity available for this round.");
      return;
    }

    if (!unitPrice) {
      notification.error("Unit price is unavailable. Please try again later.");
      return;
    }

    setIsSubmitting(true);
    let toastId: string | null = null;
    try {
      toastId = notification.loading("Submitting purchase transaction...");
      const totalCost = unitPrice * BigInt(safeQuantity);
      await writeContractAsync({
        abi: BUTTERFLY_CONTRACT_ABI,
        address: BUTTERFLY_CONTRACT_ADDRESS,
        functionName: "purchase",
        args: [BigInt(safeQuantity)],
        value: totalCost,
        chainId: BSC_TESTNET_CHAIN_ID,
      });
      if (onPurchaseSuccess) {
        await onPurchaseSuccess();
      }
      if (toastId) {
        notification.remove(toastId);
      }
      notification.success("Purchase transaction submitted successfully.");
    } catch (error) {
      if (toastId) {
        notification.remove(toastId);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message && message.toLowerCase().includes("user rejected")) {
        notification.error("Transaction cancelled by user.");
      } else {
        notification.error(`Purchase failed: ${message}`);
      }
      console.error(`Failed to purchase tokens for round ${round.label}`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const mintedPercentDisplay = Math.round(clampNumber(round.mintedPercent, 0, 100));
  const buttonDisabled = !roundIsActionable;

  return (
    <article
      data-testid={`presale-round-${round.id}`}
      className="rounded-[28px] border border-[#1A2633] bg-[#0C1119] p-5 shadow-[0_24px_60px_rgba(3,8,15,0.65)]"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: round.iconBackground }}
          >
            <ButterflyIcon color={round.iconAccent} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-[#556273]">Round</p>
            <p className="text-3xl font-semibold text-white">{round.label}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleBuy}
          disabled={buttonDisabled}
          className="flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-[#1A2230] disabled:text-[#485466]"
          style={{
            backgroundColor: buttonDisabled ? undefined : "#20FF6D",
            color: buttonDisabled ? undefined : "#03140A",
            boxShadow: buttonDisabled ? undefined : "0 12px 32px rgba(32, 255, 109, 0.35)",
          }}
        >
          {buttonDisabled && (isPending || isSubmitting) ? (
            <>
              <span className="loading loading-spinner loading-xs text-current" aria-hidden="true" />
              <span className="uppercase">Processing</span>
            </>
          ) : (
            <>
              <CreditCardIcon />
              BUY
            </>
          )}
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <InfoTile label="Number" value="1000" />
        <InfoTile
          label="Price"
          value={
            <span className="flex items-center gap-2">
              {formattedPrice}
              <EthereumIcon />
            </span>
          }
        />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-[#1A2633] bg-[#0F151F] px-4 py-3">
        <span className="text-xs uppercase tracking-[0.32em] text-[#556273]">Quantity</span>
        <div className="flex items-center gap-2">
          <QuantityButton onClick={handleDecrease} disabled={!canDecrease}>
            -
          </QuantityButton>
          <input
            type="number"
            inputMode="numeric"
            value={quantityInput}
            onChange={handleQuantityInput}
            min={1}
            className="h-10 w-14 rounded-xl border border-transparent bg-[#0A1018] text-center text-base font-semibold text-white focus:border-[#20FF6D] focus:outline-none disabled:opacity-60"
            disabled={quantityDisabled}
          />
          <QuantityButton onClick={handleIncrease} disabled={!canIncrease}>
            +
          </QuantityButton>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <ProgressBar value={round.mintedPercent} />
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#566274]">
          <span>Minted</span>
          <span className="text-sm font-semibold text-white tracking-normal">
            {formatNumber(round.mintedCount)} / {formatNumber(STAGE_SIZE)} ({mintedPercentDisplay}%)
          </span>
        </div>
      </div>
    </article>
  );
}

function InfoTile({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#1A2633] bg-[#0F151F] p-4">
      <p className="text-xs uppercase tracking-[0.32em] text-[#556273]">{label}</p>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}

function QuantityButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#1A2633] bg-[#0A1018] text-lg font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#141C27]">
      <div className="h-full rounded-full bg-[#20FF6D]" style={{ width: `${clampNumber(value, 0, 100)}%` }} />
    </div>
  );
}

function CreditCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <rect x="4" y="9" width="16" height="2" fill="#0C1119" opacity="0.5" />
    </svg>
  );
}

function EthereumIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L5.5 12.5L12 16.5L18.5 12.5L12 2Z" fill="#627EEA" />
      <path d="M12 17.5L5.5 13.5L12 22L18.5 13.5L12 17.5Z" fill="#627EEA" opacity="0.6" />
      <path d="M12 15.5L5.5 11.5L12 2V15.5Z" fill="#627EEA" opacity="0.45" />
      <path d="M12 15.5L18.5 11.5L12 2V15.5Z" fill="#627EEA" opacity="0.8" />
    </svg>
  );
}

function ButterflyIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path
        d="M16 16c3.4-4.8 6.8-7.4 8.9-8.1-1 2.9-2.7 4.7-5.1 5.6 1.8 0.5 3.5 2.4 2.8 4.2-2-0.3-3.8-1.5-5.2-2.7-0.5 1.5-1.1 3.3-1.8 4.6-0.4-1.3-1.1-3.1-1.8-4.6-1.3 1.3-3.2 2.4-5.2 2.7-0.7-1.8 1-3.7 2.8-4.2-2.4-0.9-4.1-2.7-5.1-5.6 1.7 0.6 5.2 3 8.7 8.1Z"
        fill={color}
      />
    </svg>
  );
}
