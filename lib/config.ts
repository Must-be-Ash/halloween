// Helper to get the base URL for logo
const getLogoUrl = () => {
  // In production, use the VERCEL_URL or custom domain
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/logo.svg`;
  }
  // For custom domains or production
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/logo.svg`;
  }
  // Default to localhost for development
  return "http://localhost:3000/logo.svg";
};

// CDP configuration for wagmi connector
export const CDP_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID ?? "",
  appLogoUrl: getLogoUrl(),
  appName: "x402 thumbnail maker",
  ethereum: {
    createOnLogin: "eoa" as const,
  },
  solana: {
    createOnLogin: false,
  },
};

export const APP_CONFIG = {
  name: "x402 thumbnail maker",
  logoUrl: getLogoUrl(),
};
