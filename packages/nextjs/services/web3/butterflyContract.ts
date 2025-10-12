import { wagmiConfig } from "./wagmiConfig";
import { readContract, writeContract } from "@wagmi/core";
import type { Address } from "viem";
import { bscTestnet } from "viem/chains";

export const BSC_TESTNET_CHAIN_ID = bscTestnet.id;

export const BUTTERFLY_CONTRACT_ADDRESS = "0xD3E517C3ffDa92D560378A70ee7F717d51e34d70" as const;

export const BTF_TOKEN_ADDRESS = "0x5F7F97521116a3A836B6B5480bEC219C2F478F55" as const;

const BUTTERFLY_REWARDS_ABI = [
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "address", name: "token", type: "address" },
    ],
    name: "getUserTokenBalance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "withdrawAllUserETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const getUserTokenBalance = async (userAddress: Address, tokenAddress: Address) => {
  return readContract(wagmiConfig, {
    address: BUTTERFLY_CONTRACT_ADDRESS,
    abi: BUTTERFLY_REWARDS_ABI,
    functionName: "getUserTokenBalance",
    args: [userAddress, tokenAddress],
    chainId: BSC_TESTNET_CHAIN_ID,
  }) as Promise<bigint>;
};

export const withdrawAllUserETH = async (userAddress: Address) => {
  return writeContract(wagmiConfig, {
    address: BUTTERFLY_CONTRACT_ADDRESS,
    abi: BUTTERFLY_REWARDS_ABI,
    functionName: "withdrawAllUserETH",
    args: [userAddress],
    chainId: BSC_TESTNET_CHAIN_ID,
  });
};
