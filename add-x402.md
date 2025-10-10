# X402 Integration Prompt

Use this prompt to add cryptocurrency micropayments (x402 protocol) to any web application:

---

## Task: Add X402 Micropayment Integration

Convert this application to accept cryptocurrency payments using the x402 protocol (HTTP 402 Payment Required standard). Users should be able to pay with USDC on Base network using their crypto wallet.

### My Payment Configuration:
```
[REPLACE THIS SECTION WITH YOUR CUSTOM DESCRIPTION]

Example:
"I have a runner game. Users should pay $0.02 per game when they:
- Click 'Play Again' button on the game over modal
- Click 'Get Started' button on the landing page

Send payments to wallet address: 0xAbF01df9428EaD5418473A7c91244826A3Af23b3"
```

### Technical Requirements:

#### 1. Environment Setup
Add these environment variables to `.env.local`:
```bash
# CDP Facilitator (handles payment verification/settlement)
CDP_API_KEY_ID=your-cdp-api-key-id
CDP_API_KEY_SECRET=your-cdp-api-key-secret

# Your receiving wallet address
RECIPIENT_WALLET_ADDRESS=0xYourWalletAddress

# Network configuration (Base mainnet)
NEXT_PUBLIC_NETWORK=base
NEXT_PUBLIC_USDC_CONTRACT=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# WalletConnect (for RainbowKit wallet connection)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id
```

**Where to get these:**
- CDP API keys: https://portal.cdp.coinbase.com/
- WalletConnect Project ID: https://cloud.walletconnect.com (create free project)

#### 2. Install Dependencies
```bash
npm install @coinbase/x402 x402 x402-fetch viem wagmi @rainbow-me/rainbowkit @tanstack/react-query
```

**Note**: If you encounter peer dependency conflicts, use `--legacy-peer-deps`:
```bash
npm install @coinbase/x402 x402 x402-fetch viem wagmi @rainbow-me/rainbowkit @tanstack/react-query --legacy-peer-deps
```

#### 3. Wallet Provider Setup (RainbowKit + wagmi)

**Create `components/providers.tsx`:**
```typescript
"use client";

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "Your App Name",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [base],
  ssr: true,
});

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

**Get WalletConnect Project ID:**
1. Visit https://cloud.walletconnect.com
2. Sign up/login
3. Create a new project
4. Copy the Project ID
5. Add to `.env.local`: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id`

#### 4. Update Root Layout

**Modify `app/layout.tsx` to wrap your app with the Providers:**
```typescript
import type { Metadata } from 'next'
import Providers from '@/components/providers'  // Import providers
import './globals.css'

export const metadata: Metadata = {
  title: 'Your App',
  description: 'Your app with x402 payments',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

#### 5. Add Wallet Connection UI

**Add RainbowKit's ConnectButton to your UI** (typically in header/navbar):
```typescript
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header>
      <h1>Your App</h1>
      <ConnectButton
        chainStatus="none"
        showBalance={false}
        accountStatus={{
          smallScreen: "avatar",
          largeScreen: "full"
        }}
      />
    </header>
  );
}
```

**ConnectButton Customization:**
- `chainStatus="none"` - Hides chain indicator
- `showBalance={false}` - Hides wallet balance
- `accountStatus` - Controls how account is displayed on different screens

#### 6. Client-Side Integration (Where Payment Trigger Happens)

**In your component where the paid action occurs, use wagmi hooks + x402-fetch:**
```typescript
import { wrapFetchWithPayment } from 'x402-fetch';
import { useAccount, useWalletClient } from 'wagmi';
import { publicActions } from 'viem';

export function YourComponent() {
  // Get wallet connection status and client
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();

  async function handlePaidAction() {
    // Check wallet connection first
    if (!isConnected || !walletClient) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      // Extend wallet client with public actions (required by x402)
      const extendedClient = walletClient.extend(publicActions);

      // Create payment-enabled fetch
      const fetchWithPayment = wrapFetchWithPayment(
        fetch,
        extendedClient,
        BigInt(0.1 * 10 ** 6) // Max payment: $0.10 USDC (safety limit)
      );

      // Make your API call - payment handled automatically
      const response = await fetchWithPayment('/api/your-paid-endpoint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ /* your data */ })
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      console.log('Success! Payment settled and resource delivered:', data);

      // Process your response (game start, image URL, etc.)
    } catch (error) {
      console.error('Payment or API error:', error);
    }
  }

  return (
    <div>
      <button onClick={handlePaidAction}>
        Pay $0.05 to Get Resource
      </button>
    </div>
  );
}
```

**Key Points:**
- `useAccount()` gives you wallet connection status
- `useWalletClient()` gives you the wallet client for signing
- `publicActions` extension is required for x402-fetch
- Payment happens automatically when API returns 402
- User gets wallet signature popup (one-time per payment)

#### 7. Server-Side Integration (Payment Verification & Settlement)

**Create `middleware.ts` in your Next.js root directory:**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { facilitator } from "@coinbase/x402";
import { useFacilitator } from "x402/verify";

const RECIPIENT_ADDRESS = process.env.RECIPIENT_WALLET_ADDRESS! as `0x${string}`;
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const PAYMENT_AMOUNT = 0.02; // Change this to your price

// Initialize CDP facilitator
const { verify: verifyPayment, settle: settlePayment } = useFacilitator(facilitator);

export async function middleware(request: NextRequest) {
  const paymentHeader = request.headers.get("X-PAYMENT");

  // No payment? Return 402 with payment requirements
  if (!paymentHeader) {
    return NextResponse.json({
      x402Version: 1,
      error: "X-PAYMENT header is required",
      accepts: [{
        scheme: "exact",
        network: "base",
        maxAmountRequired: (PAYMENT_AMOUNT * 10 ** 6).toString(),
        resource: request.url,
        description: "Your custom description here", // e.g., "Play one game round"
        mimeType: "application/json",
        payTo: RECIPIENT_ADDRESS,
        maxTimeoutSeconds: 60,
        asset: USDC_BASE,
        extra: { name: "USD Coin", version: "2" }
      }]
    }, { status: 402 });
  }

  // Decode payment
  let paymentPayload;
  try {
    paymentPayload = JSON.parse(Buffer.from(paymentHeader, "base64").toString("utf-8"));
  } catch {
    return NextResponse.json({ error: "Invalid payment" }, { status: 400 });
  }

  // Payment requirements
  const paymentRequirements = {
    scheme: "exact" as const,
    network: "base" as const,
    maxAmountRequired: (PAYMENT_AMOUNT * 10 ** 6).toString(),
    resource: request.url,
    description: "Your custom description",
    mimeType: "application/json",
    payTo: RECIPIENT_ADDRESS,
    maxTimeoutSeconds: 60,
    asset: USDC_BASE,
    extra: { name: "USD Coin", version: "2" }
  };

  // Verify payment with CDP facilitator
  try {
    const verifyResult = await verifyPayment(paymentPayload, paymentRequirements);
    if (!verifyResult.isValid) {
      return NextResponse.json(
        { error: "Payment verification failed", reason: verifyResult.invalidReason },
        { status: 402 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }

  // Process the request (execute your API logic)
  const response = await NextResponse.next();

  // Settle payment AFTER successful response
  if (response.status < 400) {
    try {
      const settleResult = await settlePayment(paymentPayload, paymentRequirements);
      if (!settleResult.success) {
        return NextResponse.json(
          { error: "Payment settlement failed" },
          { status: 402 }
        );
      }

      // Add transaction receipt to response
      response.headers.set(
        "X-PAYMENT-RESPONSE",
        Buffer.from(JSON.stringify({
          success: true,
          transaction: settleResult.transaction,
          network: settleResult.network,
          payer: settleResult.payer
        })).toString("base64")
      );
    } catch (error) {
      return NextResponse.json({ error: "Settlement failed" }, { status: 402 });
    }
  }

  return response;
}

// Configure which routes require payment
export const config = {
  matcher: "/api/your-paid-endpoint", // Change to your API route
};
```

#### 8. Key Integration Points:

**Payment Flow:**
1. User clicks paid button → triggers `handlePaidAction()`
2. `fetchWithPayment()` makes request → receives 402 response
3. Client automatically creates payment signature (wallet popup)
4. Client retries request with payment header
5. Middleware verifies payment with CDP facilitator
6. Middleware executes your API logic (game start, image gen, etc.)
7. Middleware settles payment on-chain (USDC transfer)
8. Response returned to client with transaction hash

**What Gets Paid:**
- ✅ Client signs transaction authorization (no gas fee for user)
- ✅ CDP facilitator executes on-chain transfer (pays gas)
- ✅ USDC transferred from user → your wallet
- ✅ Payment settled BEFORE resource is delivered

#### 9. Testing:

**Testnet (base-sepolia) for development:**
- Change `network: "base-sepolia"` in middleware
- Get test USDC from CDP faucet: https://portal.cdp.coinbase.com/products/faucet

**Mainnet (production):**
- Use `network: "base"`
- Real USDC required in user wallet

#### 10. Important Notes:

- **Middleware runs BEFORE API handler** - payment verified first, resource delivered second
- **Settlement is blocking** - if payment fails to settle, user gets 402 error (not the resource)
- **Wallet signature is automatic** - x402-fetch handles it transparently
- **No double charging** - nonces prevent replay attacks
- **Gasless for user** - facilitator pays blockchain gas fees

### Expected Behavior:
1. User clicks "Connect Wallet" → connects via RainbowKit
2. User clicks paid button → triggers payment flow
3. Wallet asks for signature approval (one-time, gasless)
4. Payment verifies and settles (~5-10 seconds)
5. User is charged exact amount (USDC transferred on-chain)
6. Your API logic executes
7. Response returned with transaction hash

---

## Quick Checklist

**Files to Create:**
- [ ] `components/providers.tsx` - Wallet provider setup
- [ ] `middleware.ts` - Payment verification & settlement
- [ ] `.env.local` - Environment variables (CDP keys, wallet address, WalletConnect ID)

**Files to Modify:**
- [ ] `app/layout.tsx` - Wrap with `<Providers>`
- [ ] `package.json` - Install dependencies (x402, wagmi, RainbowKit, viem, etc.)
- [ ] Your component - Add wagmi hooks (`useAccount`, `useWalletClient`) and `wrapFetchWithPayment`
- [ ] Your UI - Add `<ConnectButton />` from RainbowKit

**External Setup:**
- [ ] Get CDP API keys from https://portal.cdp.coinbase.com/
- [ ] Get WalletConnect Project ID from https://cloud.walletconnect.com
- [ ] Fund your receiving wallet (for testing: get testnet USDC from https://portal.cdp.coinbase.com/products/faucet)

**Test:**
- [ ] Connect wallet via RainbowKit
- [ ] Trigger paid action
- [ ] Verify signature popup appears
- [ ] Check USDC transferred on Base block explorer
- [ ] Verify resource delivered after payment

---

**Replace the "My Payment Configuration" section above with your specific use case, then follow this guide step-by-step.**
