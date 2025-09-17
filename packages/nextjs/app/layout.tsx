import { AppShell } from "@/components/layout/AppShell";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Hash Butterfly",
  description: "Hash Butterfly ecosystem experience",
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[color:#05060a]">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ScaffoldEthAppWithProviders>
            <AppShell>{children}</AppShell>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
