// CDP configuration for wagmi connector
export const CDP_CONFIG = {
  projectId: process.env.NEXT_PUBLIC_CDP_PROJECT_ID ?? "",
  ethereum: {
    createOnLogin: "eoa" as const,
  },
  solana: {
    createOnLogin: false,
  },
};

export const APP_CONFIG = {
  name: "Nano Banana Cam x402",
  logoUrl: "/banana-camera-logo.png",
};
