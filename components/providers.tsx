"use client";

import { RainbowKitProvider, connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet, coinbaseWallet, walletConnectWallet } from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createCDPEmbeddedWalletConnector } from "@coinbase/cdp-wagmi";
import { CDPReactProvider } from "@coinbase/cdp-react";
import { CDP_CONFIG } from "@/lib/config";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

// Create CDP Embedded Wallet connector
const cdpConnector = createCDPEmbeddedWalletConnector({
  cdpConfig: CDP_CONFIG,
  providerConfig: {
    chains: [base],
    transports: {
      [base.id]: http(),
    },
  },
});

// Create external wallet connectors using RainbowKit
const externalWalletConnectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, coinbaseWallet, walletConnectWallet],
    },
  ],
  {
    appName: "Nano Banana Cam x402",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  }
);

// Create wagmi config with BOTH CDP connector and external wallet connectors
// This allows wagmi to detect both CDP email wallets and external wallets
const config = createConfig({
  connectors: [
    cdpConnector,  // CDP embedded wallet (email sign-in)
    ...externalWalletConnectors,  // External wallets from RainbowKit
  ],
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <CDPReactProvider config={CDP_CONFIG}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </CDPReactProvider>
  );
}
