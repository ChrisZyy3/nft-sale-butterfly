import { useTheme } from "next-themes";
import { bscTestnet } from "viem/chains";
import { useAccount, useSwitchChain } from "wagmi";
import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { getNetworkColor } from "~~/hooks/scaffold-eth";

type NetworkOptionsProps = {
  hidden?: boolean;
};

export const NetworkOptions = ({ hidden = false }: NetworkOptionsProps) => {
  const { switchChain } = useSwitchChain();
  const { chain } = useAccount();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // Only show BSC Testnet option if not already on BSC Testnet
  const bscTestnetNetwork = bscTestnet;
  const isNotOnBSC = chain?.id !== bscTestnet.id;

  return (
    <>
      {isNotOnBSC && (
        <li className={hidden ? "hidden" : ""}>
          <button
            className="menu-item btn-sm rounded-xl! flex gap-3 py-3 whitespace-nowrap"
            type="button"
            onClick={() => {
              switchChain?.({ chainId: bscTestnet.id });
            }}
          >
            <ArrowsRightLeftIcon className="h-6 w-4 ml-2 sm:ml-0" />
            <span>
              Switch to{" "}
              <span
                style={{
                  color: getNetworkColor(bscTestnetNetwork, isDarkMode),
                }}
              >
                BSC Testnet
              </span>
            </span>
          </button>
        </li>
      )}
    </>
  );
};
