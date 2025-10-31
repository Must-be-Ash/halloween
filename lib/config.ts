// Helper to get the base URL for logo
const getLogoUrl = () => {
  // Use relative path - works in all environments (dev, preview, production)
  // The browser will resolve this to the correct domain automatically
  return "/logo.svg";
};

// CDP configuration for wagmi connector
export const CDP_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID ?? "",
  appLogoUrl: getLogoUrl(),
  appName: "x402 Halloween",
  ethereum: {
    createOnLogin: "eoa" as const,
  },
  solana: {
    createOnLogin: false,
  },
};

export const APP_CONFIG = {
  name: "x402 Halloween",
  logoUrl: getLogoUrl(),
};
