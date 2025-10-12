"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { ScreenHeader } from "@/components/layout/ScreenHeader";
import { useWatchBalance } from "@/hooks/scaffold-eth/useWatchBalance";
import { cn } from "@/lib/utils";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { decodeEventLog } from "viem";
import { useAccount, usePublicClient, useReadContract, useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth";

const BSC_TESTNET_CHAIN_ID = 97;
const BUTTERFLY_CONTRACT_ADDRESS = "0xD3E517C3ffDa92D560378A70ee7F717d51e34d70" as const;

const BUTTERFLY_ABI = [
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getReferralInfo",
    outputs: [
      { internalType: "address", name: "referrer", type: "address" },
      { internalType: "uint256", name: "referralCount", type: "uint256" },
      { internalType: "uint256", name: "totalRewards", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserPurchases",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "generateInvitationCode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes32", name: "invitationCode", type: "bytes32" }],
    name: "bindReferrerByInvitationCode",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "referrer", type: "address" }],
    name: "bindReferrerByAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "bytes32", name: "invitationCode", type: "bytes32" },
    ],
    name: "InvitationCodeGenerated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: true, internalType: "address", name: "referrer", type: "address" },
    ],
    name: "ReferralSet",
    type: "event",
  },
] as const;

const baseWalletItems = [
  {
    title: "ETH Balance",
    value: "0 ETH",
    accent: "#20ff6d",
    highlight: true,
    icon: EthTokenIcon,
  },
  {
    title: "Assets",
    value: "0",
    accent: "#ffb547",
    icon: AssetsIcon,
  },
  {
    title: "Friends",
    value: "0",
    accent: "#ff5f66",
    icon: FriendsIcon,
  },
  {
    title: "NFT",
    value: "0",
    accent: "#4c7dff",
    icon: ButterflyIcon,
  },
  {
    title: "Orders",
    value: "0",
    accent: "#9b6bff",
    icon: OrderIcon,
  },
] satisfies WalletItem[];

type WalletItem = {
  title: string;
  value: string;
  accent: string;
  icon?: (props: { accent: string }) => ReactNode;
  highlight?: boolean;
};

export default function WalletPage() {
  const { address, chain: connectedChain } = useAccount();
  const { openConnectModal } = useConnectModal();
  const publicClient = usePublicClient({ chainId: BSC_TESTNET_CHAIN_ID });
  const { writeContractAsync, isPending: isGeneratingOnChain } = useWriteContract();
  const [invitationCode, setInvitationCode] = useState<string | null>(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [incomingRefCode, setIncomingRefCode] = useState<string | null>(null);
  const [isBindDialogOpen, setIsBindDialogOpen] = useState(false);
  const [isBindingReferrer, setIsBindingReferrer] = useState(false);
  const [incomingRefAddress, setIncomingRefAddress] = useState<string | null>(null);
  const [isBindingByAddress, setIsBindingByAddress] = useState(false);

  const { data: balanceData } = useWatchBalance({
    address,
    chainId: connectedChain?.id,
    query: { enabled: Boolean(address) },
  });
  const {
    data: referralInfo,
    isLoading: isReferralLoading,
    refetch: refetchReferralInfo,
    error: referralError,
  } = useReadContract({
    address: BUTTERFLY_CONTRACT_ADDRESS,
    abi: BUTTERFLY_ABI,
    functionName: "getReferralInfo",
    args: [(address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`],
    chainId: BSC_TESTNET_CHAIN_ID,
    query: {
      enabled: Boolean(address),
    },
  });

  // Log when getReferralInfo is triggered and its results
  useEffect(() => {
    if (address && !isReferralLoading) {
      console.log("🔄 getReferralInfo 查询触发", {
        address: address,
        timestamp: new Date().toISOString(),
      });
    }
  }, [address, isReferralLoading]);

  useEffect(() => {
    if (referralInfo) {
      console.log("✅ getReferralInfo 查询成功", {
        address: address,
        result: referralInfo,
        referrer: (referralInfo as readonly [string, bigint, bigint])[0],
        referralCount: (referralInfo as readonly [string, bigint, bigint])[1],
        totalRewards: (referralInfo as readonly [string, bigint, bigint])[2],
        timestamp: new Date().toISOString(),
      });
    }
  }, [referralInfo, address]);

  useEffect(() => {
    if (referralError) {
      console.error("❌ getReferralInfo 查询失败", {
        address: address,
        error: referralError,
        timestamp: new Date().toISOString(),
      });
    }
  }, [referralError, address]);
  const {
    data: userPurchasesData,
    isLoading: isPurchasesLoading,
    refetch: refetchUserPurchases,
  } = useReadContract({
    address: BUTTERFLY_CONTRACT_ADDRESS,
    abi: BUTTERFLY_ABI,
    functionName: "getUserPurchases",
    args: [(address ?? "0x0000000000000000000000000000000000000000") as `0x${string}`],
    chainId: BSC_TESTNET_CHAIN_ID,
    query: {
      enabled: Boolean(address),
    },
  });

  const formattedBalance = balanceData ? formatBalanceForDisplay(balanceData) : undefined;
  const isConnected = Boolean(address && connectedChain);
  const referralCount = referralInfo ? Number((referralInfo as readonly [string, bigint, bigint])[1]) : undefined;
  const formattedReferralCount = useMemo(() => {
    if (!isConnected) {
      return "0";
    }
    if (isReferralLoading) {
      return "--";
    }
    return referralCount !== undefined ? referralCount.toLocaleString() : "0";
  }, [isConnected, isReferralLoading, referralCount]);

  const totalPurchases = useMemo(() => {
    if (!userPurchasesData) {
      return 0;
    }
    try {
      return Number(userPurchasesData);
    } catch {
      return 0;
    }
  }, [userPurchasesData]);

  const formattedTotalPurchases = useMemo(() => {
    if (!isConnected) {
      return "0";
    }

    if (isPurchasesLoading) {
      return "--";
    }

    return totalPurchases.toLocaleString();
  }, [isConnected, isPurchasesLoading, totalPurchases]);
  // Either use the variable by adding a comment explaining why it's needed
  // or remove/comment it out if not needed
  // const referrerAddress =
  //   referralInfo && Array.isArray(referralInfo)
  //     ? ((referralInfo as readonly [string, bigint, bigint])[0] as string)
  //     : ZERO_ADDRESS;

  const clearRefCodeFromUrl = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("refcode");
    window.history.replaceState(null, "", url.toString());
  };

  const clearRefAddressFromUrl = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.delete("refaddress");
    window.history.replaceState(null, "", url.toString());
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const params = url.searchParams;
    console.log("🌐 URL 检测", {
      url: url.toString(),
      params: params.toString(),
      timestamp: new Date().toISOString(),
    });
    // Print all URL parameters
    if (params.toString()) {
      console.log("🌐 URL 参数检测", {
        url: url.toString(),
        parameters: Object.fromEntries(params.entries()),
        timestamp: new Date().toISOString(),
      });
    }

    // Handle refcode parameter
    const code = params.get("refcode");
    if (code) {
      console.log("📋 检测到邀请码参数", {
        refcode: code,
        isValidFormat: /^0x[0-9a-fA-F]{64}$/.test(code) || /^[0-9a-fA-F]{64}$/.test(code),
        timestamp: new Date().toISOString(),
      });

      if (/^0x[0-9a-fA-F]{64}$/.test(code)) {
        setIncomingRefCode(code);
      } else if (/^[0-9a-fA-F]{64}$/.test(code)) {
        setIncomingRefCode(`0x${code}`);
      } else {
        console.warn("⚠️ 无效的邀请码格式", {
          refcode: code,
          expectedFormat: "0x + 64 hex characters or 64 hex characters",
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Handle refaddress parameter
    const refAddress = params.get("refaddress");
    if (refAddress) {
      console.log("🔗 检测到推荐人地址参数", {
        refaddress: refAddress,
        isValidFormat: /^0x[0-9a-fA-F]{40}$/.test(refAddress),
        timestamp: new Date().toISOString(),
      });

      // Validate Ethereum address format
      if (/^0x[0-9a-fA-F]{40}$/.test(refAddress)) {
        setIncomingRefAddress(refAddress);
      } else {
        console.warn("⚠️ 无效的推荐人地址格式", {
          refaddress: refAddress,
          expectedFormat: "0x + 40 hex characters",
          timestamp: new Date().toISOString(),
        });
        clearRefAddressFromUrl();
      }
    }

    // Log any other unexpected parameters
    const knownParams = ["refcode", "refaddress"];
    const unknownParams = Array.from(params.keys()).filter(key => !knownParams.includes(key));
    if (unknownParams.length > 0) {
      console.log("❓ 检测到未知参数", {
        unknownParameters: unknownParams.map(key => ({
          name: key,
          value: params.get(key),
        })),
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  // 移除自动弹出绑定对话框的逻辑 - 用户需要手动触发
  // useEffect(() => {
  //   if (!incomingRefCode) return;
  //   if (!isConnected) return;
  //   if (!referralInfo) return;

  //   if (referrerAddress && referrerAddress !== ZERO_ADDRESS) {
  //     setIncomingRefCode(null);
  //     setIsBindDialogOpen(false);
  //     clearRefCodeFromUrl();
  //     return;
  //   }

  //   setIsBindDialogOpen(true);
  // }, [incomingRefCode, isConnected, referralInfo, referrerAddress]);

  // 移除自动弹出绑定对话框的逻辑 - 用户需要手动触发
  // useEffect(() => {
  //   if (!incomingRefAddress) return;
  //   if (!isConnected) return;
  //   if (!referralInfo) return;

  //   // Check if user already has a referrer
  //   if (referrerAddress && referrerAddress !== ZERO_ADDRESS) {
  //     setIncomingRefAddress(null);
  //     clearRefAddressFromUrl();
  //     console.log("ℹ️ 用户已有推荐人，跳过地址绑定", {
  //       address: address,
  //       existingReferrer: referrerAddress,
  //       timestamp: new Date().toISOString()
  //     });
  //     return;
  //   }

  //   // Check if trying to refer self
  //   if (incomingRefAddress.toLowerCase() === address?.toLowerCase()) {
  //     setIncomingRefAddress(null);
  //     clearRefAddressFromUrl();
  //     console.log("ℹ️ 不能推荐自己", {
  //       address: address,
  //       attemptedReferrer: incomingRefAddress,
  //       timestamp: new Date().toISOString()
  //     });
  //     return;
  //   }

  //   // Show address binding dialog
  //   setIsBindDialogOpen(true);
  // }, [incomingRefAddress, isConnected, referralInfo, referrerAddress, address]);

  const walletItems = useMemo(
    () =>
      baseWalletItems.map(item => {
        if (item.title === "ETH Balance") {
          return {
            ...item,
            value: formattedBalance ?? item.value,
          };
        }

        if (item.title === "Friends") {
          return {
            ...item,
            value: formattedReferralCount,
          };
        }

        if (item.title === "NFT") {
          return {
            ...item,
            value: formattedTotalPurchases,
          };
        }

        return item;
      }),
    [formattedBalance, formattedReferralCount, formattedTotalPurchases],
  );

  const handleGenerateInvitation = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!address) {
      notification.error("Wallet address not detected.");
      return;
    }

    if (!isPurchasesLoading && totalPurchases <= 0) {
      notification.error("You must purchase an NFT before generating an invitation code.");
      return;
    }

    setIsGeneratingCode(true);
    let toastId: string | null = null;
    try {
      toastId = notification.loading("Generating invitation code...");
      const txHash = await writeContractAsync({
        address: BUTTERFLY_CONTRACT_ADDRESS,
        abi: BUTTERFLY_ABI,
        functionName: "generateInvitationCode",
        chainId: BSC_TESTNET_CHAIN_ID,
      });

      if (!publicClient) {
        throw new Error("Public client unavailable.");
      }

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      if (toastId) {
        notification.remove(toastId);
      }

      let generatedCode: string | null = null;
      for (const log of receipt.logs) {
        try {
          const event = decodeEventLog({
            abi: BUTTERFLY_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (event.eventName === "InvitationCodeGenerated") {
            const codeBytes = event.args?.invitationCode as `0x${string}`;
            generatedCode = codeBytes;
            break;
          }
        } catch {
          // Ignore logs that don't match the event
        }
      }

      if (generatedCode) {
        setInvitationCode(generatedCode);
        setIsDialogOpen(true);
      }
      notification.success("Invitation code generated successfully.");

      console.log("🔄 手动刷新 getReferralInfo 和 getUserPurchases 数据");
      await Promise.all([refetchReferralInfo(), refetchUserPurchases()]);
    } catch (error) {
      if (toastId) {
        notification.remove(toastId);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      notification.error(`Failed to generate invitation code: ${message}`);
      console.error("Failed to generate invitation code", error);
    } finally {
      setIsGeneratingCode(false);
    }
  };

  const handleShareInvitation = async () => {
    if (!invitationCode) return;
    if (typeof window === "undefined") {
      notification.error("Sharing is only available in the browser.");
      return;
    }

    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.set("refcode", invitationCode);
    const shareLink = shareUrl.toString();

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareLink);
        notification.success("Share link copied to clipboard.");
      } else {
        notification.error("Clipboard access is not available in this environment.");
      }
    } catch (error) {
      notification.error("Failed to copy invitation link. Please copy it manually.");
      console.error("Failed to copy invitation link", error);
    }
  };

  const handleShareInvitationLink = async () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!address) {
      notification.error("Wallet address not detected.");
      return;
    }

    if (typeof window === "undefined") {
      notification.error("Sharing is only available in the browser.");
      return;
    }

    // Generate invitation link with user address
    const currentDomain = window.location.origin;
    const shareLink = `${currentDomain}?refaddress=${address}`;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareLink);
        notification.success("Invitation link copied to clipboard.");
        console.log("📋 邀请链接已复制", {
          address: address,
          shareLink: shareLink,
          timestamp: new Date().toISOString(),
        });
      } else {
        notification.error("Clipboard access is not available in this environment.");
      }
    } catch (error) {
      notification.error("Failed to copy invitation link. Please copy it manually.");
      console.error("Failed to copy invitation link", error);
    }
  };

  const handleBindReferrerByAddress = async () => {
    if (!incomingRefAddress) return;

    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!address) {
      notification.error("Wallet address not detected.");
      return;
    }

    setIsBindingByAddress(true);
    setIsBindDialogOpen(false); // Close dialog when starting binding
    let toastId: string | null = null;
    try {
      toastId = notification.loading("Binding referrer by address...");
      console.log("🔗 开始绑定推荐人地址", {
        address: address,
        referrer: incomingRefAddress,
        timestamp: new Date().toISOString(),
      });

      const txHash = await writeContractAsync({
        address: BUTTERFLY_CONTRACT_ADDRESS,
        abi: BUTTERFLY_ABI,
        functionName: "bindReferrerByAddress",
        args: [incomingRefAddress as `0x${string}`],
        chainId: BSC_TESTNET_CHAIN_ID,
      });

      if (!publicClient) {
        throw new Error("Public client unavailable.");
      }

      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
      if (toastId) {
        notification.remove(toastId);
      }

      // Check for ReferralSet event
      let referrerSet = false;
      for (const log of receipt.logs) {
        try {
          const event = decodeEventLog({
            abi: BUTTERFLY_ABI,
            data: log.data,
            topics: log.topics,
          });
          if (event.eventName === "ReferralSet") {
            referrerSet = true;
            const referrer = event.args?.referrer as string;
            const user = event.args?.user as string;
            console.log("✅ ReferralSet 事件触发", {
              user: user,
              referrer: referrer,
              timestamp: new Date().toISOString(),
            });
            break;
          }
        } catch {
          // Ignore logs that don't match the event
        }
      }

      if (referrerSet) {
        notification.success("Referrer bound successfully!");
        setIncomingRefAddress(null);
        clearRefAddressFromUrl();
        console.log("✅ 推荐人绑定成功", {
          address: address,
          referrer: incomingRefAddress,
          timestamp: new Date().toISOString(),
        });

        // Refresh referral info
        console.log("🔄 刷新 getReferralInfo 数据");
        await refetchReferralInfo();
      } else {
        notification.error("Failed to bind referrer: ReferralSet event not found");
      }
    } catch (error) {
      if (toastId) {
        notification.remove(toastId);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.toLowerCase().includes("user rejected")) {
        notification.error("Transaction cancelled by user.");
        console.log("❌ 用户取消交易", {
          address: address,
          referrer: incomingRefAddress,
          timestamp: new Date().toISOString(),
        });
      } else {
        notification.error(`Failed to bind referrer: ${message}`);
        console.error("❌ 绑定推荐人失败", {
          address: address,
          referrer: incomingRefAddress,
          error: error,
          timestamp: new Date().toISOString(),
        });
      }
    } finally {
      setIsBindingByAddress(false);
    }
  };

  const handleConfirmBindReferrer = async () => {
    if (!incomingRefCode) return;

    if (!isConnected) {
      openConnectModal?.();
      return;
    }

    if (!address) {
      notification.error("Wallet address not detected.");
      return;
    }

    const normalizedCode = incomingRefCode.startsWith("0x") ? incomingRefCode : `0x${incomingRefCode}`;
    if (!/^0x[0-9a-fA-F]{64}$/.test(normalizedCode)) {
      notification.error("Invalid referral code format.");
      setIncomingRefCode(null);
      clearRefCodeFromUrl();
      return;
    }

    setIsBindingReferrer(true);
    setIsBindDialogOpen(false); // Close dialog when starting binding
    let toastId: string | null = null;
    try {
      toastId = notification.loading("Binding referral code...");
      const txHash = await writeContractAsync({
        address: BUTTERFLY_CONTRACT_ADDRESS,
        abi: BUTTERFLY_ABI,
        functionName: "bindReferrerByInvitationCode",
        args: [normalizedCode as `0x${string}`],
        chainId: BSC_TESTNET_CHAIN_ID,
      });

      if (!publicClient) {
        throw new Error("Public client unavailable.");
      }

      await publicClient.waitForTransactionReceipt({ hash: txHash });
      if (toastId) {
        notification.remove(toastId);
      }

      notification.success("Referral code bound successfully.");
      setIncomingRefCode(null);
      clearRefCodeFromUrl();
      console.log("🔄 绑定推荐人后刷新 getReferralInfo 数据");
      await refetchReferralInfo();
    } catch (error) {
      if (toastId) {
        notification.remove(toastId);
      }
      const message = error instanceof Error ? error.message : "Unknown error";
      if (message.toLowerCase().includes("user rejected")) {
        notification.error("Transaction cancelled by user.");
      } else {
        notification.error(`Failed to bind referral code: ${message}`);
      }
      console.error("Failed to bind referral code", error);
    } finally {
      setIsBindingReferrer(false);
    }
  };

  const handleDismissBindDialog = () => {
    setIsBindDialogOpen(false);
    if (incomingRefCode) {
      setIncomingRefCode(null);
      clearRefCodeFromUrl();
    }
    if (incomingRefAddress) {
      setIncomingRefAddress(null);
      clearRefAddressFromUrl();
    }
  };

  return (
    <div className="pb-24 pt-2 md:pb-16">
      <ScreenHeader title="Wallet" />
      <section className="hb-container flex flex-col gap-4">
        <div className="rounded-3xl border border-[#1f2432] bg-[#10131c] px-6 py-7 text-center shadow-[0_50px_120px_-80px_rgba(32,255,109,0.45)]">
          <h1 className="text-xl font-semibold uppercase tracking-[0.32em] text-[#20ff6d]">Hash Butterfly</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#9ca3b0]">
            Welcome to the Hash Butterfly Metaverse Ecology.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {walletItems.map(item => {
            if (item.highlight) {
              return <ConnectWalletCard key={item.title} item={item} balance={formattedBalance} />;
            }

            const Icon = item.icon;
            const handleItemClick = () => {
              if (!isConnected) {
                openConnectModal?.();
              }
            };
            return (
              <button
                key={item.title}
                type="button"
                onClick={handleItemClick}
                className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-[22px] border border-[#1f2432] bg-[#10131c] px-5 py-4 text-left transition hover:border-[#20ff6d] hover:bg-[#141924]"
              >
                <span className="relative z-10 flex items-center gap-4">
                  <span
                    className="relative grid size-12 place-items-center overflow-hidden rounded-2xl border border-[#1f2432] bg-[#141924]"
                    style={{ boxShadow: `0 18px 60px -32px ${hexToRgba(item.accent, 0.55)}` }}
                  >
                    {Icon ? <Icon accent={item.accent} /> : null}
                  </span>
                  <span className="text-base font-semibold uppercase tracking-[0.18em] text-white">{item.title}</span>
                </span>
                <span
                  className={cn(
                    "relative z-10 text-white transition group-hover:text-[#20ff6d]",
                    isConnected ? "text-sm font-semibold uppercase tracking-[0.18em]" : "flex items-center",
                  )}
                >
                  {isConnected ? item.value : <ArrowRightIcon />}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={handleGenerateInvitation}
            disabled={!isConnected || isPurchasesLoading || isGeneratingCode || isGeneratingOnChain}
            className="w-full rounded-[22px] border border-[#1f2432] bg-[#10131c] px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#20ff6d] hover:bg-[#141924] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGeneratingCode || isGeneratingOnChain ? "Processing..." : "Generate Invitation Code"}
          </button>
          <button
            type="button"
            onClick={handleShareInvitationLink}
            disabled={!isConnected}
            className="w-full rounded-[22px] border border-[#1f2432] bg-[#10131c] px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#20ff6d] hover:bg-[#141924] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Share Invitation Link
          </button>
        </div>
      </section>
      {isDialogOpen && invitationCode ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-[#1f2432] bg-[#10131c] p-6 text-center shadow-[0_40px_120px_-80px_rgba(32,255,109,0.4)]">
            <h2 className="text-lg font-semibold uppercase tracking-[0.32em] text-[#20ff6d]">Invitation Code</h2>
            <p className="mt-4 break-all text-sm text-[#cdd3de]">{invitationCode}</p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleShareInvitation}
                className="w-full rounded-2xl border border-[#1f2432] bg-[#141924] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#20ff6d] hover:bg-[#101621]"
              >
                Share
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDialogOpen(false);
                  setInvitationCode(null);
                }}
                className="w-full rounded-2xl border border-[#1f2432] bg-[#141924] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#20ff6d] hover:bg-[#101621]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* 推荐参数提示 - 不自动弹出，让用户手动触发 */}
      {(incomingRefCode || incomingRefAddress) && !isBindDialogOpen && (
        <div className="fixed bottom-24 right-6 z-40 max-w-sm rounded-2xl border border-[#1f2432] bg-[#10131c] p-4 shadow-[0_20px_60px_-40px_rgba(32,255,109,0.3)]">
          <div className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 flex-none rounded-full bg-[#20ff6d]" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <p className="text-sm font-medium text-[#20ff6d]">
                  {incomingRefCode ? "Invitation Code Detected" : "Referrer Address Detected"}
                </p>
                <button
                  type="button"
                  onClick={handleDismissBindDialog}
                  className="ml-2 flex-none rounded-lg border border-[#1f2432] bg-transparent p-1 text-[#788090] transition hover:border-[#ff5f66] hover:text-[#ff5f66]"
                  title="Close"
                >
                  <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-xs text-[#cdd3de] break-all">{incomingRefCode || incomingRefAddress}</p>
              <button
                type="button"
                onClick={() => setIsBindDialogOpen(true)}
                className="mt-3 w-full rounded-xl border border-[#1f2432] bg-[#141924] px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#20ff6d] hover:bg-[#101621]"
              >
                Bind Now
              </button>
            </div>
          </div>
        </div>
      )}

      {isBindDialogOpen && (incomingRefCode || incomingRefAddress) ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
          <div className="w-full max-w-sm rounded-3xl border border-[#1f2432] bg-[#10131c] p-6 text-center shadow-[0_40px_120px_-80px_rgba(32,255,109,0.4)]">
            <h2 className="text-lg font-semibold uppercase tracking-[0.32em] text-[#20ff6d]">Bind Referral</h2>
            <p className="mt-4 text-sm text-[#cdd3de]">
              {incomingRefCode
                ? "We detected an invitation code. Do you want to bind this referral?"
                : "We detected a referrer address. Do you want to bind this referral?"}
            </p>
            <p className="mt-4 break-all text-xs uppercase tracking-[0.3em] text-[#20ff6d]">
              {incomingRefCode || incomingRefAddress}
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={incomingRefCode ? handleConfirmBindReferrer : handleBindReferrerByAddress}
                disabled={isBindingReferrer || isBindingByAddress}
                className="w-full rounded-2xl border border-[#1f2432] bg-[#141924] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#20ff6d] hover:bg-[#101621] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isBindingReferrer || isBindingByAddress ? "Binding..." : "Bind Referral"}
              </button>
              <button
                type="button"
                onClick={handleDismissBindDialog}
                disabled={isBindingReferrer || isBindingByAddress}
                className="w-full rounded-2xl border border-[#1f2432] bg-[#101621] px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:border-[#ff5f66] hover:bg-[#171d29] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

type ConnectWalletCardProps = {
  item: WalletItem;
  balance?: string;
};

function ConnectWalletCard({ item, balance }: ConnectWalletCardProps) {
  const Icon = item.icon;

  return (
    <ConnectButton.Custom>
      {({ account, chain, mounted, openAccountModal, openConnectModal, authenticationStatus }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === "authenticated");

        const handleClick = () => {
          if (!connected) {
            openConnectModal?.();
            return;
          }
          openAccountModal?.();
        };

        return (
          <button
            type="button"
            onClick={handleClick}
            className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-[22px] border border-transparent bg-[#10131c] px-5 py-4 text-left transition hover:border-[#20ff6d] hover:bg-[#141924]"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[22px] border border-[#20ff6d]/80"
              style={{ boxShadow: "0 26px 90px -60px rgba(32,255,109,0.85)" }}
            />
            <span className="relative z-10 flex items-center gap-4">
              <span
                className="relative grid size-12 place-items-center overflow-hidden rounded-2xl border border-[#1f2432] bg-[#141924]"
                style={{ boxShadow: `0 18px 60px -32px ${hexToRgba(item.accent, 0.6)}` }}
              >
                {Icon ? <Icon accent={item.accent} /> : null}
              </span>
              <span className="text-base font-semibold uppercase tracking-[0.18em] text-white">{item.title}</span>
            </span>
            <span
              className={cn(
                "relative z-10 text-white transition group-hover:text-[#20ff6d]",
                connected ? "flex flex-col items-end text-right" : "flex items-center",
              )}
            >
              {connected ? (
                <>
                  <span className="text-sm font-semibold uppercase tracking-[0.18em]">{balance ?? item.value}</span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#20ff6d] group-hover:text-[#20ff6d]">
                    {account.displayName}
                  </span>
                </>
              ) : (
                <ArrowRightIcon />
              )}
            </span>
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function AssetsIcon({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6">
      <rect x="6" y="6" width="12" height="12" rx="3" fill={hexToRgba(accent, 0.12)} />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FriendsIcon({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6">
      <path d="M7 17c0-2.21 1.79-4 4-4s4 1.79 4 4" strokeLinecap="round" />
      <path d="M5 17.5c0-2 1.5-3.5 3.5-3.5" strokeLinecap="round" />
      <path d="M19 17.5c0-2-1.5-3.5-3.5-3.5" strokeLinecap="round" />
      <circle cx="8.5" cy="9" r="2.5" fill={hexToRgba(accent, 0.18)} />
      <circle cx="15.5" cy="9" r="2.5" fill={hexToRgba(accent, 0.12)} />
    </svg>
  );
}

function ButterflyIcon({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6">
      <path
        d="M12 12c3.4-5.5 7.2-7.5 9-8-1 3.2-2.8 5.7-5 7 2 0.6 3.7 2.8 3 5-2.3-0.2-4.6-1.7-6-3.2-0.7 1.8-1.5 4.5-2 6.2-0.5-1.7-1.4-4.4-2-6.2-1.4 1.5-3.7 3-6 3.2-0.7-2.2 1-4.4 3-5-2.1-1.3-4-3.8-5-7 1.8 0.5 5.6 2.5 9 8Z"
        fill={hexToRgba(accent, 0.15)}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 8a2 2 0 0 1 2 0" strokeLinecap="round" />
    </svg>
  );
}

function OrderIcon({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="1.6">
      <rect x="4" y="5" width="16" height="14" rx="2" fill={hexToRgba(accent, 0.15)} />
      <path d="M8 9h8" strokeLinecap="round" />
      <path d="M8 13h8" strokeLinecap="round" />
      <path d="M8 17h5" strokeLinecap="round" />
    </svg>
  );
}

function EthTokenIcon({ accent }: { accent: string }) {
  return (
    <svg aria-hidden="true" width="20" height="24" viewBox="0 0 20 24" fill="none">
      <path d="M10 2 16.5 12.25 10 9.6 3.5 12.25 10 2Z" fill={accent} fillOpacity={0.9} />
      <path d="M10 9.6 16.5 12.25 10 15 3.5 12.25 10 9.6Z" fill={hexToRgba(accent, 0.65)} />
      <path d="M10 16.4 16.5 13.35 10 22 3.5 13.35 10 16.4Z" fill={hexToRgba(accent, 0.4)} />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M5 10h8.5" strokeLinecap="round" />
      <path d="m10.5 6.5 3.5 3.5-3.5 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatBalanceForDisplay(balance: { formatted: string; symbol: string }) {
  const numericValue = Number.parseFloat(balance.formatted);

  if (!Number.isFinite(numericValue)) {
    return `${balance.formatted} ${balance.symbol}`;
  }

  const fractionDigits = numericValue >= 1 ? 4 : 6;
  const formattedNumber = numericValue.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });

  if (numericValue !== 0 && formattedNumber === "0") {
    return `${numericValue.toPrecision(4)} ${balance.symbol}`;
  }

  return `${formattedNumber} ${balance.symbol}`;
}
