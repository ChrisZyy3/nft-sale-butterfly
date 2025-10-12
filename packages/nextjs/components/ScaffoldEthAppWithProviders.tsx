"use client";

import { useEffect, useMemo, useState } from "react";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useTheme } from "next-themes";
import { Toaster } from "react-hot-toast";
import { WagmiProvider } from "wagmi";
import { BlockieAvatar } from "~~/components/scaffold-eth";
import { useInitializeNativeCurrencyPrice } from "~~/hooks/scaffold-eth";
import { wagmiConfig } from "~~/services/web3/wagmiConfig";

type AppContainerProps = {
  children: React.ReactNode;
};

const AppContainer = ({ children }: AppContainerProps) => {
  useInitializeNativeCurrencyPrice();

  return (
    <>
      <div className="flex min-h-dvh flex-col text-[#f5f7fb]">
        <main className="flex flex-1 flex-col">{children}</main>
      </div>
      <Toaster />
    </>
  );
};

const RAINBOW_KIT_THEME_OPTIONS = {
  accentColor: "#20ff6d",
  accentColorForeground: "#05060a",
  borderRadius: "large" as const,
  fontStack: "system" as const,
  overlayBlur: "small" as const,
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export const ScaffoldEthAppWithProviders = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [mounted, setMounted] = useState(false);
  const [modalSize, setModalSize] = useState<"compact" | "wide">("wide");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateModalSize = () => {
      const nextSize: "compact" | "wide" = window.innerWidth <= 640 ? "compact" : "wide";
      setModalSize(current => (current === nextSize ? current : nextSize));
    };

    updateModalSize();
    window.addEventListener("resize", updateModalSize);

    return () => {
      window.removeEventListener("resize", updateModalSize);
    };
  }, []);

  const rainbowKitTheme = useMemo(() => {
    if (!mounted) {
      return lightTheme(RAINBOW_KIT_THEME_OPTIONS);
    }

    return isDarkMode ? darkTheme(RAINBOW_KIT_THEME_OPTIONS) : lightTheme(RAINBOW_KIT_THEME_OPTIONS);
  }, [isDarkMode, mounted]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider avatar={BlockieAvatar} modalSize={modalSize} theme={rainbowKitTheme}>
          <ProgressBar height="3px" color="#20ff6d" />
          <AppContainer>{children}</AppContainer>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
