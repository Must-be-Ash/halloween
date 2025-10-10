# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nano Banana Cam is a Next.js camera application that applies AI-powered photo filters using the fal.ai Nano Banana API. The app automatically syncs with v0.app deployments and is deployed on Vercel.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Start production server
npm start
```

## Architecture

### Core Image Processing Flow

1. **Client Capture** (`components/camera-app.tsx`): Main app orchestrator managing state for selected filter, captured image, and processed result
2. **Camera Component** (`components/camera-capture.tsx`): Handles live camera feed and photo capture
3. **API Route** (`app/api/process-image/route.ts`): Processes images via fal.ai Nano Banana API with filter-specific prompts
4. **Watermarking** (`lib/watermark.ts`): Client-side canvas-based watermark overlay

### Filter System

- 20+ predefined filters with detailed transformation prompts (space, cyberpunk, vintage, medieval, etc.)
- Each filter has a unique ID, name, description, and comprehensive prompt
- "Space" filter is special-cased: it bypasses AI processing and only applies watermark
- All other filters send images to `/api/process-image` which calls `fal-ai/nano-banana/edit`

### Rate Limiting

- **Implementation**: Redis-based rate limiter using Upstash (`lib/rate-limiter.ts`)
- **Limits**: 4 requests per 24 hours per IP address
- **Headers**: Returns `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` headers
- **Fallback**: If Redis fails, allows request through (fail-open behavior)

### API Integration

The app uses the fal.ai client to make AI image transformation requests:
- Endpoint: `fal-ai/nano-banana/edit`
- Requires: `FAL_KEY` environment variable
- Input: image URL (base64 data URL), filter prompt, num_images: 1
- Returns: Processed image URL

When experiencing errors or problems with fal.ai 402 requests, use Context7 MCP to study the fal.ai documentation.

### Environment Variables Required

```
FAL_KEY=<fal.ai API key>
KV_REST_API_URL=<Upstash Redis URL>
KV_REST_API_TOKEN=<Upstash Redis token>
```

## Key Technical Details

### Image Handling
- Captured images are base64 data URLs
- Processed images come back as hosted URLs from fal.ai
- Watermark is always applied client-side as final step
- Front camera images are handled differently (mirror flag) in watermark function

### State Management
- No external state library; uses React useState/useCallback
- Main state in `camera-app.tsx`: selectedFilterIndex, capturedImage, processedImage, isProcessing
- Camera component maintains its own facingMode state

### Component Structure
```
app/
├── api/process-image/route.ts  # API endpoint for AI processing
├── layout.tsx                   # Root layout with theme provider
├── page.tsx                     # Entry point rendering CameraApp
└── globals.css                  # Global styles

components/
├── camera-app.tsx              # Main orchestrator
├── camera-capture.tsx          # Camera interface
├── processed-image.tsx         # Result display
├── filter-selector.tsx         # Filter carousel
├── liquid-button.tsx           # Custom button component
└── liquid-glass.tsx            # Glass morphism effect

lib/
├── rate-limiter.ts             # Redis rate limiting
├── watermark.ts                # Image watermarking
└── utils.ts                    # Utility functions
```

## Important Conventions

- All console logs use `[v0]` prefix for easier filtering
- TypeScript strict mode enabled
- Uses Next.js 14 App Router pattern
- Path aliases: `@/*` maps to project root
- Mobile-first design with responsive viewport handling
- Uses Radix UI components and Tailwind CSS v4

## v0.app Integration

This project is managed through v0.app:
- Project URL: https://v0.app/chat/projects/XVEIPzv118y
- Deployment: Auto-synced to Vercel
- Changes from v0.app are automatically pushed to this repository


## x402 Overview

This repository contains the **x402 payment protocol** - an open-source HTTP micropayment protocol for internet-native payments using cryptocurrency. The protocol enables services to charge small amounts (like $0.05) for API calls using the HTTP 402 Payment Required status code.

**Critical Knowledge Principle**: When experiencing errors or problems regarding making x402 request calls, use the context7 MCP to study the official x402 documentation before making changes or assumptions.

---

## Table of Contents

1. [Repository Structure](#repository-structure)
2. [Core Concepts & Architecture](#core-concepts--architecture)
3. [Protocol Deep Dive](#protocol-deep-dive)
4. [Payment Schemes](#payment-schemes)
5. [Client Implementation](#client-implementation)
6. [Server Implementation](#server-implementation)
7. [Facilitator System](#facilitator-system)
8. [TypeScript Implementation](#typescript-implementation)
9. [Python Implementation](#python-implementation)
10. [Go Implementation](#go-implementation)
11. [Network Support](#network-support)
12. [Common Commands](#common-commands)
13. [Environment Variables](#environment-variables)
14. [Working Examples & Patterns](#working-examples--patterns)
15. [Debugging & Troubleshooting](#debugging--troubleshooting)
16. [Security Considerations](#security-considerations)
17. [Contributing Guidelines](#contributing-guidelines)

---

## Repository Structure

The repository is organized as a multi-language monorepo:

```
402-essentials/
├── x402/                          # Main x402 protocol repository (Coinbase official)
│   ├── typescript/                # TypeScript monorepo (pnpm + Turborepo)
│   │   ├── packages/
│   │   │   ├── x402/             # Core protocol library
│   │   │   ├── x402-axios/       # Axios interceptor
│   │   │   ├── x402-fetch/       # Fetch wrapper
│   │   │   ├── x402-express/     # Express middleware
│   │   │   ├── x402-hono/        # Hono middleware
│   │   │   ├── x402-next/        # Next.js middleware
│   │   │   └── coinbase-x402/    # CDP SDK integration
│   │   └── site/                  # Documentation site
│   ├── python/x402/               # Python package (FastAPI, Flask, httpx, requests)
│   ├── go/                        # Go package (Gin middleware)
│   ├── java/                      # Java implementation
│   ├── examples/                  # Language-specific examples
│   │   ├── typescript/
│   │   │   ├── clients/          # axios, fetch, MCP examples
│   │   │   ├── servers/          # express, hono, next examples
│   │   │   └── full-stack/       # Complete application examples
│   │   ├── python/
│   │   └── go/
│   ├── e2e/                       # Cross-language end-to-end tests
│   └── specs/                     # Protocol specifications
│       └── schemes/
│           └── exact/             # Exact payment scheme specs
│               ├── scheme_exact.md
│               ├── scheme_exact_evm.md
│               └── scheme_exact_svm.md
├── 402-docs/                      # Official documentation
│   ├── core-concepts/
│   │   ├── how-it-works.md
│   │   ├── http-402.md
│   │   ├── client-server.md
│   │   ├── facilitator.md
│   │   └── wallet.md
│   ├── facilitator/
│   ├── quickstart-for-sellers.md
│   ├── quickstart-for-buyers.md
│   ├── faq.md
│   └── bazaar.md                  # Service discovery
└── Working Examples/
    ├── firecrawl-402demo/         # Web scraping with x402
    ├── news-app/                  # Location-aware news aggregator
    └── freepik-code/              # Image generation API
```

---

## Core Concepts & Architecture

### What is x402?

x402 is an **HTTP-native micropayment protocol** that enables:
- Pay-per-use API access without subscriptions
- Instant, trustless payments using cryptocurrency (primarily USDC)
- No manual payment flows or wallet popups for each transaction
- Gasless transactions for both clients and servers (facilitator pays gas)
- Protocol-level payment verification and settlement

### The HTTP 402 Status Code

The HTTP 402 "Payment Required" status code was reserved by the original HTTP specification but never standardized. x402 brings it to life:

- **402 is not an error** - it's the protocol working correctly
- A 402 response means: "I accept this request type, but I need payment first"
- The response body contains `accepts` field with payment requirements
- The client automatically handles payment and retries the request

### Key Principles

1. **HTTP-Native**: Works with existing HTTP infrastructure - no new protocols
2. **Trust-Minimizing**: Cryptographic signatures prove payment authorization
3. **Gasless**: Facilitator subsidizes blockchain transaction costs
4. **Automatic**: Client libraries handle entire payment flow transparently
5. **Composable**: Works with any HTTP API or service
6. **Chain-Agnostic**: Extensible to multiple blockchain networks

### Core Components

#### 1. Resource Server (Seller/API Provider)
- Hosts paid APIs/endpoints
- Returns 402 with payment requirements if no/invalid payment
- Verifies payment via facilitator or locally
- Settles payment after serving resource
- Returns resource with `X-PAYMENT-RESPONSE` header

#### 2. Client (Buyer/API Consumer)
- Makes HTTP requests to resource servers
- Detects 402 responses automatically
- Creates EIP-3009 payment authorization signature
- Retries request with `X-PAYMENT` header
- Receives resource and payment receipt

#### 3. Facilitator (Payment Processor)
- Third-party service for payment verification and settlement
- Verifies cryptographic signatures
- Checks on-chain balances and authorization validity
- Executes blockchain transactions (pays gas)
- Returns verification/settlement results
- Default: `https://x402.org/facilitator` (Coinbase-operated)
- Also: `https://api.cdp.coinbase.com/platform` (CDP Platform API)

#### 4. Wallet
- EVM wallet (viem Account or SignerWallet)
- Holds USDC for making payments
- Signs EIP-712 typed messages for authorization
- Never requires manual signature approval during payment flow

---

## Protocol Deep Dive

### Complete Payment Flow (Step-by-Step)

```
┌─────────┐                  ┌─────────────────┐                ┌────────────┐
│ Client  │                  │ Resource Server │                │Facilitator │
└────┬────┘                  └────────┬────────┘                └─────┬──────┘
     │                                │                                │
     │  1. GET /api/data              │                                │
     ├───────────────────────────────>│                                │
     │                                │                                │
     │  2. 402 Payment Required       │                                │
     │     {                          │                                │
     │       x402Version: 1,          │                                │
     │       accepts: [{              │                                │
     │         scheme: "exact",       │                                │
     │         network: "base",       │                                │
     │         maxAmountRequired: "10000", # $0.01 USDC (6 decimals)  │
     │         payTo: "0xABC...",     │                                │
     │         asset: "0xUSDC...",    │                                │
     │         resource: "https://...",                               │
     │         ...                    │                                │
     │       }]                       │                                │
     │     }                          │                                │
     │<───────────────────────────────┤                                │
     │                                │                                │
     │  3. Client auto-creates        │                                │
     │     EIP-3009 authorization:    │                                │
     │     - from: client address     │                                │
     │     - to: server address       │                                │
     │     - value: 10000             │                                │
     │     - validAfter/Before        │                                │
     │     - nonce (random 32 bytes)  │                                │
     │     - Signs EIP-712 message    │                                │
     │                                │                                │
     │  4. GET /api/data              │                                │
     │     X-PAYMENT: base64({        │                                │
     │       x402Version: 1,          │                                │
     │       scheme: "exact",         │                                │
     │       network: "base",         │                                │
     │       payload: {               │                                │
     │         signature: "0x...",    │                                │
     │         authorization: {...}   │                                │
     │       }                        │                                │
     │     })                         │                                │
     ├───────────────────────────────>│                                │
     │                                │                                │
     │                                │  5. POST /verify               │
     │                                │     {                          │
     │                                │       paymentPayload,          │
     │                                │       paymentRequirements      │
     │                                │     }                          │
     │                                ├───────────────────────────────>│
     │                                │                                │
     │                                │  6. Verification checks:       │
     │                                │     - Valid signature          │
     │                                │     - Sufficient balance       │
     │                                │     - Nonce not used           │
     │                                │     - Time window valid        │
     │                                │     - Amount matches           │
     │                                │                                │
     │                                │  7. { isValid: true,          │
     │                                │       payer: "0x123..." }      │
     │                                │<───────────────────────────────┤
     │                                │                                │
     │                                │  8. Serve resource to client   │
     │                                │     (process request)          │
     │                                │                                │
     │                                │  9. POST /settle               │
     │                                ├───────────────────────────────>│
     │                                │                                │
     │                                │  10. Execute on-chain tx:      │
     │                                │      USDC.receiveWithAuth()    │
     │                                │      (facilitator pays gas)    │
     │                                │                                │
     │                                │  11. { success: true,          │
     │                                │        transaction: "0xTX",    │
     │                                │        network: "base" }       │
     │                                │<───────────────────────────────┤
     │                                │                                │
     │  12. 200 OK                    │                                │
     │      X-PAYMENT-RESPONSE: {...} │                                │
     │      [Resource Data]           │                                │
     │<───────────────────────────────┤                                │
     │                                │                                │
```

### HTTP Headers

#### X-PAYMENT (Client → Server)

Base64-encoded JSON payload containing payment authorization:

```json
{
  "x402Version": 1,
  "scheme": "exact",
  "network": "base",
  "payload": {
    "signature": "0x2d6a7588d6acca505cbf0d9a4a227e0c52c6c34008c8e8986a1283259764173608a2ce6496642e377d6da8dbbf5836e9bd15092f9ecab05ded3d6293af148b571c",
    "authorization": {
      "from": "0x857b06519E91e3A54538791bDbb0E22373e36b66",
      "to": "0x209693Bc6afc0C5328bA36FaF03C514EF312287C",
      "value": "10000",
      "validAfter": "1740672089",
      "validBefore": "1740672154",
      "nonce": "0xf3746613c2d920b5fdabc0856f2aeb2d4f88ee6037b8cc5d04a71a4462f13480"
    }
  }
}
```

**Key Fields:**
- `signature`: EIP-712 signature of the authorization message
- `from`: Client's wallet address (payer)
- `to`: Server's wallet address (payee) - must match `payTo` in requirements
- `value`: Payment amount in atomic units (e.g., 10000 = $0.01 USDC with 6 decimals)
- `validAfter`: Unix timestamp - payment valid 10 minutes before current time (allows clock skew)
- `validBefore`: Unix timestamp - payment expires after `maxTimeoutSeconds`
- `nonce`: Random 32-byte hex for replay protection (never reuse!)

#### X-PAYMENT-RESPONSE (Server → Client)

Base64-encoded JSON containing settlement details:

```json
{
  "success": true,
  "transaction": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "network": "base",
  "payer": "0x857b06519E91e3A54538791bDbb0E22373e36b66"
}
```

Decode using:
```typescript
import { decodeXPaymentResponse } from 'x402/shared';
const receipt = decodeXPaymentResponse(response.headers['x-payment-response']);
```

### 402 Response Format

When no payment or invalid payment is provided:

```json
{
  "x402Version": 1,
  "error": "X-PAYMENT header is required",
  "accepts": [
    {
      "scheme": "exact",
      "network": "base",
      "maxAmountRequired": "10000",
      "resource": "https://api.example.com/premium/resource/123",
      "description": "Premium API access for data analysis",
      "mimeType": "application/json",
      "outputSchema": {
        "data": "string"
      },
      "payTo": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "maxTimeoutSeconds": 60,
      "asset": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
    }
  ],
  "payer": "0x857b06519E91e3A54538791bDbb0E22373e36b66"  // Optional: detected payer
}
```

**Payment Requirements Fields:**
- `scheme`: Payment scheme type (currently only "exact" supported)
- `network`: Blockchain network (base, base-sepolia, solana, solana-devnet)
- `maxAmountRequired`: Maximum payment in atomic units (string to handle large numbers)
- `resource`: Full URL of the paid resource
- `description`: Human-readable description of what's being purchased
- `mimeType`: Expected response content type
- `outputSchema`: Optional JSON schema describing response structure
- `payTo`: Server's wallet address to receive payment
- `maxTimeoutSeconds`: Maximum time for payment validity window
- `asset`: Token contract address (USDC on respective network)
- `extra`: Optional scheme-specific metadata (e.g., EIP-712 domain)

---

## Payment Schemes

### Exact Scheme

The "exact" scheme transfers a **specific, predetermined amount** from client to server using EIP-3009.

**Use Cases:**
- Viewing an article ($0.01)
- Purchasing digital credits ($1.00)
- LLM tool calls ($0.001 per call)
- API access with fixed pricing
- Pay-per-scrape web data

**How It Works:**

1. **Server knows cost upfront**: Server specifies `maxAmountRequired` in 402 response
2. **Client signs authorization**: EIP-712 signature for exact `value` transfer
3. **Facilitator verifies**: Checks signature, balance, nonce, time window, amount
4. **Settlement**: Facilitator calls `USDC.receiveWithAuthorization()` on-chain
5. **Atomic transfer**: USDC moves from client → server in single transaction

**EIP-3009: Transfer With Authorization**

EIP-3009 enables gasless token transfers via cryptographic authorization:

```solidity
function receiveWithAuthorization(
    address from,
    address to,
    uint256 value,
    uint256 validAfter,
    uint256 validBefore,
    bytes32 nonce,
    uint8 v,
    bytes32 r,
    bytes32 s
) external;
```

**Why EIP-3009 (not ERC-20 approve/transferFrom)?**

✅ **Advantages:**
- **Gasless for client and server**: Facilitator executes transaction
- **Single transaction**: Authorization + transfer in one call
- **Trust-minimizing**: Signature specifies exact recipient and amount
- **No allowance needed**: No separate approve() step
- **Replay protection**: Nonce prevents signature reuse

❌ **Limitations:**
- **Exact amounts only**: Cannot do usage-based pricing (use EIP-2612 "permit" for that)
- **USDC-specific**: Only tokens implementing EIP-3009 (primarily Circle's USDC)

**EIP-712 Typed Data Structure:**

```typescript
{
  domain: {
    name: "USD Coin",
    version: "2",
    chainId: 8453,  // Base mainnet
    verifyingContract: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"  // USDC on Base
  },
  types: {
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" }
    ]
  },
  message: {
    from: "0x857b06519E91e3A54538791bDbb0E22373e36b66",
    to: "0x209693Bc6afc0C5328bA36FaF03C514EF312287C",
    value: "10000",
    validAfter: "1740672089",
    validBefore: "1740672154",
    nonce: "0xf3746613c2d920b5fdabc0856f2aeb2d4f88ee6037b8cc5d04a71a4462f13480"
  }
}
```

### Future Schemes (Not Yet Implemented)

**"upto" Scheme (Usage-Based Payments):**
- Authorize payment up to a maximum amount
- Actual charge determined after service completion
- Use case: LLM token generation, metered API usage
- Implementation: EIP-2612 `permit()` + routing contract

---

## Client Implementation

### TypeScript/JavaScript Clients

#### Using x402-axios (Recommended for Axios Users)

```typescript
import axios from 'axios';
import { withPaymentInterceptor } from 'x402-axios';
import { privateKeyToAccount } from 'viem/accounts';

// Setup wallet
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

// Create axios client with automatic payment handling
const client = withPaymentInterceptor(
  axios.create({ baseURL: 'https://api.example.com' }),
  account
);

// Make requests normally - 402 handled automatically
const response = await client.get('/premium-data');
console.log(response.data);

// Access payment receipt
const paymentResponse = response.headers['x-payment-response'];
if (paymentResponse) {
  const receipt = decodeXPaymentResponse(paymentResponse);
  console.log('Payment settled:', receipt.transaction);
}
```

**How the Interceptor Works:**

1. Intercepts 402 responses via `axiosClient.interceptors.response.use()`
2. Parses `accepts` array from response body
3. Selects matching payment requirements (by network and scheme)
4. Creates payment header via `createPaymentHeader(wallet, x402Version, requirements)`
5. Sets `__is402Retry` flag to prevent infinite loops
6. Adds `X-PAYMENT` header to original request
7. Retries request with `axiosClient.request(originalConfig)`
8. Returns successful response with `X-PAYMENT-RESPONSE` header

#### Using x402-fetch (Native Fetch)

```typescript
import { wrapFetchWithPayment } from 'x402-fetch';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

// Wrap fetch with payment handling
const fetchWithPayment = wrapFetchWithPayment(
  fetch,
  account,
  BigInt(1 * 10 ** 6)  // Max payment: 1 USDC (6 decimals)
);

const response = await fetchWithPayment('https://api.example.com/data', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
});

const data = await response.json();
```

**Key Features:**
- `maxValue` parameter: Prevents unexpected large payments (default: 0.1 USDC)
- Throws error if payment exceeds maximum
- Automatically handles 402 and retries with payment
- Compatible with standard Fetch API

#### Using Coinbase CDP SDK

```typescript
import { Coinbase, Wallet } from "@coinbase/coinbase-sdk";
import { wrapFetchWithPayment } from 'coinbase-x402';

const coinbase = Coinbase.configureFromJson({ filePath: "cdp_api_key.json" });
const wallet: Wallet = await coinbase.getDefaultUser()!.getWallet();

const fetchWithPayment = wrapFetchWithPayment(fetch, wallet);
const response = await fetchWithPayment('https://api.example.com/data');
```

#### Manual Payment Creation (Advanced)

```typescript
import { createPaymentHeader } from 'x402/client';
import { privateKeyToAccount } from 'viem/accounts';

const account = privateKeyToAccount(privateKey);

// 1. Make initial request to get payment requirements
const initial = await fetch('https://api.example.com/data');
if (initial.status === 402) {
  const { x402Version, accepts } = await initial.json();

  // 2. Select payment requirements (first match)
  const requirements = accepts[0];

  // 3. Create payment header
  const paymentHeader = await createPaymentHeader(
    account,
    x402Version,
    requirements
  );

  // 4. Retry with payment
  const paid = await fetch('https://api.example.com/data', {
    headers: {
      'X-PAYMENT': paymentHeader,
      'Access-Control-Expose-Headers': 'X-PAYMENT-RESPONSE'
    }
  });

  const data = await paid.json();
  const receipt = decodeXPaymentResponse(paid.headers.get('x-payment-response'));
}
```

### Python Clients

#### Using httpx

```python
from x402 import WalletX402Client
from httpx import Client

# Create wallet client
wallet_client = WalletX402Client(private_key="0x...")

# Wrap httpx client
with Client() as client:
    x402_client = wallet_client.wrap_client(client)
    response = x402_client.get("https://api.example.com/data")
    print(response.json())
```

#### Using requests

```python
from x402 import WalletX402Client
import requests

wallet_client = WalletX402Client(private_key="0x...")

with requests.Session() as session:
    x402_session = wallet_client.wrap_client(session)
    response = x402_session.get("https://api.example.com/data")
    print(response.json())
```

### Go Clients

```go
import (
    "github.com/coinbase/x402/go/client"
)

wallet := client.NewWallet(privateKey)
httpClient := client.NewHTTPClient(wallet)

resp, err := httpClient.Get("https://api.example.com/data")
if err != nil {
    log.Fatal(err)
}
defer resp.Body.Close()
```

---

## Server Implementation

### TypeScript/JavaScript Servers

#### Express Middleware

```typescript
import express from 'express';
import { paymentMiddleware } from 'x402-express';

const app = express();

// Simple: All routes protected at $0.01 USDC on testnet
app.use(paymentMiddleware(
  '0xYourWalletAddress',  // payTo: where to receive payments
  {
    price: '$0.01',
    network: 'base-sepolia'
  }
));

// Advanced: Route-specific pricing
app.use(paymentMiddleware(
  '0xYourWalletAddress',
  {
    '/weather': {
      price: '$0.001',
      network: 'base',
      config: {
        description: 'Real-time weather data',
        mimeType: 'application/json',
        maxTimeoutSeconds: 30
      }
    },
    '/premium/*': {
      price: '$0.10',
      network: 'base'
    }
  },
  // Optional: Custom facilitator
  {
    url: 'https://api.cdp.coinbase.com/platform',
    createAuthHeaders: async () => ({
      verify: { Authorization: `Bearer ${token}` },
      settle: { Authorization: `Bearer ${token}` }
    })
  },
  // Optional: Custom paywall for web browsers
  {
    cdpClientKey: 'your-cdp-client-key',
    appName: 'My App',
    appLogo: '/logo.svg'
  }
));

app.get('/weather', (req, res) => {
  res.json({ temp: 72, condition: 'sunny' });
});

app.listen(3000);
```

**Middleware Logic:**

1. **Route Matching**: Checks if request path matches configured routes
2. **Payment Detection**: Looks for `X-PAYMENT` header
3. **Browser vs API**: Serves HTML paywall for browsers, JSON 402 for APIs
4. **Payment Decoding**: Decodes base64 payment header
5. **Verification**: Calls facilitator `/verify` endpoint
6. **Request Processing**: Calls `next()` to execute route handler
7. **Settlement**: After successful response (status < 400), calls facilitator `/settle`
8. **Response Enhancement**: Adds `X-PAYMENT-RESPONSE` header with transaction details

**Route Pattern Syntax:**

```typescript
{
  '/exact/path': { price: '$0.01', network: 'base' },
  '/wildcard/*': { price: '$0.02', network: 'base' },
  '/param/[id]': { price: '$0.03', network: 'base' },
  'GET /method-specific': { price: '$0.04', network: 'base' },
  'POST /create': { price: '$0.05', network: 'base' }
}
```

#### Hono Middleware

```typescript
import { Hono } from 'hono';
import { paymentMiddleware } from 'x402-hono';

const app = new Hono();

app.use('/*', paymentMiddleware(
  '0xYourWalletAddress',
  {
    '/*': {
      price: '$0.01',
      network: 'base-sepolia'
    }
  }
));

app.get('/data', (c) => {
  return c.json({ message: 'Paid data' });
});

export default app;
```

#### Next.js Middleware

```typescript
// middleware.ts
import { paymentMiddleware } from 'x402-next';

export default paymentMiddleware(
  process.env.WALLET_ADDRESS!,
  {
    '/api/premium/*': {
      price: '$0.01',
      network: 'base'
    }
  }
);

export const config = {
  matcher: '/api/premium/:path*'
};
```

```typescript
// app/api/premium/data/route.ts
export async function GET() {
  return Response.json({ data: 'premium content' });
}
```

### Python Servers

#### FastAPI

```python
from fastapi import FastAPI
from x402 import X402Middleware

app = FastAPI()

app.add_middleware(
    X402Middleware,
    wallet_address="0xYourWalletAddress",
    routes={
        "/premium": {
            "price": "$0.01",
            "network": "base-sepolia"
        }
    }
)

@app.get("/premium")
async def get_premium_data():
    return {"data": "premium content"}
```

#### Flask

```python
from flask import Flask
from x402 import X402Middleware

app = Flask(__name__)

middleware = X402Middleware(
    app,
    wallet_address="0xYourWalletAddress",
    routes={
        "/premium": {
            "price": "$0.01",
            "network": "base-sepolia"
        }
    }
)

@app.route("/premium")
def premium():
    return {"data": "premium content"}
```

### Go Servers

#### Gin Middleware

```go
import (
    "github.com/gin-gonic/gin"
    x402 "github.com/coinbase/x402/go"
)

func main() {
    r := gin.Default()

    r.Use(x402.PaymentMiddleware(x402.Config{
        WalletAddress: "0xYourWalletAddress",
        Routes: map[string]x402.RouteConfig{
            "/premium": {
                Price: "$0.01",
                Network: "base-sepolia",
            },
        },
    }))

    r.GET("/premium", func(c *gin.Context) {
        c.JSON(200, gin.H{"data": "premium content"})
    })

    r.Run(":8080")
}
```

---

## Facilitator System

### What is a Facilitator?

The facilitator is a **trusted third-party service** that:
1. **Verifies** payment signatures and authorization validity
2. **Settles** payments by executing on-chain transactions
3. **Pays gas fees** for both verification and settlement
4. **Cannot steal funds** - only execute transfers per client authorization

### Default Facilitator

**URL**: `https://x402.org/facilitator`

Operated by Coinbase for public use on testnet (base-sepolia) and mainnet (base).

### CDP Platform Facilitator

**URL**: `https://api.cdp.coinbase.com/platform`

Production-ready facilitator with authentication:

```typescript
import { generateCDPJWT } from '@coinbase/cdp-sdk/auth';

const facilitator = {
  url: 'https://api.cdp.coinbase.com/platform',
  createAuthHeaders: async () => {
    const token = await generateCDPJWT({
      apiKeyId: process.env.CDP_API_KEY_ID!,
      apiKeySecret: process.env.CDP_API_KEY_SECRET!
    });

    return {
      verify: { Authorization: `Bearer ${token}` },
      settle: { Authorization: `Bearer ${token}` }
    };
  }
};
```

### Facilitator API Endpoints

#### POST /verify

Validates payment without executing on-chain transaction.

**Request:**
```json
{
  "x402Version": 1,
  "paymentPayload": {
    "x402Version": 1,
    "scheme": "exact",
    "network": "base",
    "payload": {
      "signature": "0x...",
      "authorization": {
        "from": "0x...",
        "to": "0x...",
        "value": "10000",
        "validAfter": "1740672089",
        "validBefore": "1740672154",
        "nonce": "0x..."
      }
    }
  },
  "paymentRequirements": {
    "scheme": "exact",
    "network": "base",
    "maxAmountRequired": "10000",
    "payTo": "0x...",
    "asset": "0x...",
    ...
  }
}
```

**Response:**
```json
{
  "isValid": true,
  "payer": "0x857b06519E91e3A54538791bDbb0E22373e36b66"
}
```

**OR (if invalid):**
```json
{
  "isValid": false,
  "invalidReason": "insufficient_funds",
  "payer": "0x857b06519E91e3A54538791bDbb0E22373e36b66"
}
```

**Validation Checks:**
1. ✅ Signature is cryptographically valid (ECDSA recovery)
2. ✅ Client has sufficient USDC balance
3. ✅ Value meets `maxAmountRequired`
4. ✅ Current time is within `validAfter` and `validBefore`
5. ✅ Nonce has not been used before
6. ✅ Authorization is for correct ERC20 contract and chain
7. ✅ Transaction would succeed (simulated `receiveWithAuthorization`)

#### POST /settle

Executes payment on-chain.

**Request:** (Same as /verify)

**Response:**
```json
{
  "success": true,
  "transaction": "0x1234567890abcdef...",
  "network": "base",
  "payer": "0x857b06519E91e3A54538791bDbb0E22373e36b66"
}
```

**OR (if failed):**
```json
{
  "success": false,
  "errorReason": "insufficient_funds",
  "payer": "0x857b06519E91e3A54538791bDbb0E22373e36b66",
  "transaction": "",
  "network": "base"
}
```

**Settlement Process:**
1. Calls USDC contract's `receiveWithAuthorization()` function
2. Facilitator pays gas fees (~$0.001 on Base)
3. USDC transfers from client → server atomically
4. Returns transaction hash for verification

**Error Reasons:**
- `insufficient_funds`: Client doesn't have enough USDC
- `invalid_signature`: Signature doesn't match authorization data
- `invalid_exact_evm_payload_authorization_value`: Amount mismatch
- `invalid_exact_evm_payload_authorization_valid_after`: Time window issue
- `invalid_exact_evm_payload_authorization_valid_before`: Expired authorization
- `settle_exact_svm_transaction_confirmation_timed_out`: Solana settlement timeout

#### GET /discovery/resources

Lists public x402-enabled services (Bazaar).

**Request:**
```
GET /discovery/resources?type=http&limit=20&offset=0
```

**Response:**
```json
{
  "x402Version": 1,
  "items": [
    {
      "resource": "https://api.example.com/weather",
      "type": "http",
      "x402Version": 1,
      "accepts": [{
        "scheme": "exact",
        "network": "base",
        "maxAmountRequired": "1000",
        ...
      }],
      "lastUpdated": "2025-01-15T10:30:00Z",
      "metadata": {
        "name": "Weather API",
        "description": "Real-time weather data"
      }
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 156
  }
}
```

#### GET /supported

Lists supported scheme/network combinations.

**Response:**
```json
{
  "kinds": [
    { "x402Version": 1, "scheme": "exact", "network": "base" },
    { "x402Version": 1, "scheme": "exact", "network": "base-sepolia" },
    { "x402Version": 1, "scheme": "exact", "network": "solana" },
    { "x402Version": 1, "scheme": "exact", "network": "solana-devnet" }
  ]
}
```

### Using the Facilitator Client

```typescript
import { useFacilitator } from 'x402/verify';

// Default facilitator (x402.org)
const { verify, settle, list } = useFacilitator();

// Custom facilitator with auth
const { verify, settle } = useFacilitator({
  url: 'https://api.cdp.coinbase.com/platform',
  createAuthHeaders: async () => ({
    verify: { Authorization: `Bearer ${token}` },
    settle: { Authorization: `Bearer ${token}` }
  })
});

// Verify payment
const verification = await verify(paymentPayload, paymentRequirements);
if (!verification.isValid) {
  console.error('Invalid payment:', verification.invalidReason);
}

// Settle payment
const settlement = await settle(paymentPayload, paymentRequirements);
if (settlement.success) {
  console.log('Payment settled:', settlement.transaction);
}

// List services
const services = await list({ type: 'http', limit: 50 });
```

---

## TypeScript Implementation

### Core Package Structure

```
x402/typescript/packages/x402/src/
├── client/                    # Client-side payment creation
│   ├── createPaymentHeader.ts
│   ├── preparePaymentHeader.ts
│   ├── selectPaymentRequirements.ts
│   └── signPaymentHeader.ts
├── facilitator/               # Facilitator API client
│   └── facilitator.ts
├── paywall/                   # Browser paywall HTML generation
│   ├── baseTemplate.ts
│   └── build.ts
├── schemes/                   # Payment scheme implementations
│   └── exact/
│       └── evm/
│           ├── client.ts      # EIP-3009 signature creation
│           ├── facilitator.ts
│           └── sign.ts        # EIP-712 typed data signing
├── shared/                    # Shared utilities
│   ├── base64.ts
│   ├── evm/
│   │   ├── erc20.ts
│   │   └── usdc.ts            # USDC contract addresses/config
│   ├── json.ts
│   ├── middleware.ts          # Server middleware helpers
│   └── network.ts
├── types/                     # TypeScript type definitions
│   ├── shared/
│   │   ├── evm/
│   │   │   ├── config.ts
│   │   │   ├── eip3009.ts
│   │   │   └── wallet.ts
│   │   ├── middleware.ts
│   │   ├── money.ts
│   │   ├── network.ts
│   │   └── resource.ts
│   └── verify/
│       ├── facilitator.ts
│       └── x402Specs.ts       # Zod schemas for validation
└── verify/                    # Payment verification
    └── useFacilitator.ts
```

### Key Implementation Details

#### Payment Header Creation Flow

```typescript
// 1. Prepare unsigned payment
export function preparePaymentHeader(
  from: Address,
  x402Version: number,
  paymentRequirements: PaymentRequirements
): UnsignedPaymentPayload {
  const nonce = createNonce();  // Random 32 bytes

  const validAfter = BigInt(Math.floor(Date.now() / 1000) - 600);  // 10 min before
  const validBefore = BigInt(
    Math.floor(Date.now() / 1000 + paymentRequirements.maxTimeoutSeconds)
  );

  return {
    x402Version,
    scheme: paymentRequirements.scheme,
    network: paymentRequirements.network,
    payload: {
      signature: undefined,
      authorization: {
        from,
        to: paymentRequirements.payTo as Address,
        value: paymentRequirements.maxAmountRequired,
        validAfter: validAfter.toString(),
        validBefore: validBefore.toString(),
        nonce
      }
    }
  };
}

// 2. Sign payment
export async function signPaymentHeader(
  client: SignerWallet | LocalAccount,
  paymentRequirements: PaymentRequirements,
  unsignedPaymentHeader: UnsignedPaymentPayload
): Promise<PaymentPayload> {
  const { signature } = await signAuthorization(
    client,
    unsignedPaymentHeader.payload.authorization,
    paymentRequirements
  );

  return {
    ...unsignedPaymentHeader,
    payload: {
      ...unsignedPaymentHeader.payload,
      signature
    }
  };
}

// 3. Encode to base64
export function encodePayment(payment: PaymentPayload): string {
  const json = JSON.stringify(toJsonSafe(payment));
  return Buffer.from(json).toString('base64');
}
```

#### EIP-712 Signature Creation

```typescript
import { signTypedData, LocalAccount } from 'viem';

export async function signAuthorization(
  client: SignerWallet | LocalAccount,
  authorization: ExactEvmPayloadAuthorization,
  paymentRequirements: PaymentRequirements
) {
  const chainId = getNetworkId(paymentRequirements.network);
  const usdcConfig = getUsdcChainConfigForChain(chainId);

  const domain = {
    name: usdcConfig.usdcName,
    version: "2",
    chainId,
    verifyingContract: paymentRequirements.asset as Address
  };

  const types = {
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" }
    ]
  };

  const message = authorization;

  const signature = await signTypedData({
    account: isSignerWallet(client) ? client.account! : client,
    domain,
    types,
    primaryType: 'TransferWithAuthorization',
    message
  });

  return { signature };
}
```

#### Middleware Route Matching

```typescript
export function findMatchingRoute(
  routePatterns: RoutePattern[],
  path: string,
  method: string
): RoutePattern | undefined {
  // Normalize path: remove query params, decode URI, collapse slashes
  const pathWithoutQuery = path.split(/[?#]/)[0];
  const decodedPath = decodeURIComponent(pathWithoutQuery);
  const normalizedPath = decodedPath
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/(.+?)\/+$/, "$1");

  // Find matching routes
  const matchingRoutes = routePatterns.filter(({ pattern, verb }) => {
    const matchesPath = pattern.test(normalizedPath);
    const matchesVerb = verb === "*" || method.toUpperCase() === verb;
    return matchesPath && matchesVerb;
  });

  if (matchingRoutes.length === 0) return undefined;

  // Return most specific route (longest pattern)
  return matchingRoutes.reduce((a, b) =>
    b.pattern.source.length > a.pattern.source.length ? b : a
  );
}
```

### Type Safety with Zod

All protocol types are validated using Zod schemas:

```typescript
import { z } from "zod";

// Network validation
export const NetworkSchema = z.enum([
  "base",
  "base-sepolia",
  "solana",
  "solana-devnet"
]);

// Payment requirements validation
export const PaymentRequirementsSchema = z.object({
  scheme: z.enum(["exact"]),
  network: NetworkSchema,
  maxAmountRequired: z.string().refine(isInteger),
  resource: z.string().url(),
  description: z.string(),
  mimeType: z.string(),
  outputSchema: z.record(z.any()).optional(),
  payTo: z.string().regex(/^0x[a-fA-F0-9]{40}|[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$/),
  maxTimeoutSeconds: z.number().int(),
  asset: z.string().regex(/^0x[a-fA-F0-9]{40}|[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$/),
  extra: z.record(z.any()).optional()
});

// Payment payload validation
export const PaymentPayloadSchema = z.object({
  x402Version: z.number().refine(val => val === 1),
  scheme: z.enum(["exact"]),
  network: NetworkSchema,
  payload: ExactEvmPayloadSchema
});

// Usage
const parsed = PaymentRequirementsSchema.parse(data);  // Throws if invalid
const safe = PaymentRequirementsSchema.safeParse(data);  // Returns { success, data/error }
```

---

## Python Implementation

### Package Structure

```
x402/python/x402/
├── __init__.py
├── client/                    # Client wrappers
│   ├── httpx_client.py
│   └── requests_client.py
├── server/                    # Server middleware
│   ├── fastapi_middleware.py
│   └── flask_middleware.py
├── wallet.py                  # Wallet management
├── schemes/                   # Payment schemes
│   └── exact/
│       └── evm.py
└── types/                     # Type definitions
    ├── payment.py
    └── network.py
```

### Key Implementation Patterns

#### Client Wrapper Pattern

```python
from typing import Union
import httpx
import requests
from eth_account import Account
from x402.wallet import WalletX402Client

class WalletX402Client:
    def __init__(self, private_key: str):
        self.account = Account.from_key(private_key)

    def wrap_client(
        self,
        client: Union[httpx.Client, requests.Session]
    ):
        if isinstance(client, httpx.Client):
            return self._wrap_httpx(client)
        elif isinstance(client, requests.Session):
            return self._wrap_requests(client)
        else:
            raise ValueError("Unsupported client type")

    def _wrap_httpx(self, client: httpx.Client):
        # Add event hooks for 402 handling
        original_request = client.request

        def request_with_payment(*args, **kwargs):
            response = original_request(*args, **kwargs)

            if response.status_code == 402:
                # Handle payment and retry
                payment_header = self._create_payment(response)
                kwargs.setdefault('headers', {})
                kwargs['headers']['X-PAYMENT'] = payment_header
                response = original_request(*args, **kwargs)

            return response

        client.request = request_with_payment
        return client
```

#### Middleware Implementation

```python
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class X402Middleware(BaseHTTPMiddleware):
    def __init__(self, app, wallet_address: str, routes: dict):
        super().__init__(app)
        self.wallet_address = wallet_address
        self.routes = routes

    async def dispatch(self, request: Request, call_next):
        # Check if route requires payment
        route_config = self._match_route(request.url.path)
        if not route_config:
            return await call_next(request)

        # Check for payment header
        payment = request.headers.get('X-PAYMENT')
        if not payment:
            return self._return_402(route_config)

        # Verify payment
        if not await self._verify_payment(payment, route_config):
            return self._return_402(route_config, error="Invalid payment")

        # Process request
        response = await call_next(request)

        # Settle payment if successful
        if response.status_code < 400:
            settlement = await self._settle_payment(payment, route_config)
            response.headers['X-PAYMENT-RESPONSE'] = settlement

        return response
```

---

## Go Implementation

### Package Structure

```
x402/go/
├── client/
│   ├── http.go
│   └── wallet.go
├── server/
│   └── middleware.go
├── schemes/
│   └── exact/
│       └── evm.go
└── types/
    ├── payment.go
    └── network.go
```

### Middleware Implementation

```go
package server

import (
    "encoding/base64"
    "encoding/json"
    "github.com/gin-gonic/gin"
    "net/http"
)

type PaymentMiddleware struct {
    walletAddress string
    routes        map[string]RouteConfig
    facilitator   Facilitator
}

func (m *PaymentMiddleware) Handle() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Match route
        config, ok := m.matchRoute(c.Request.URL.Path)
        if !ok {
            c.Next()
            return
        }

        // Check payment
        paymentHeader := c.GetHeader("X-PAYMENT")
        if paymentHeader == "" {
            m.return402(c, config)
            return
        }

        // Decode and verify
        payment, err := m.decodePayment(paymentHeader)
        if err != nil {
            m.return402(c, config)
            return
        }

        if !m.verifyPayment(payment, config) {
            m.return402(c, config)
            return
        }

        // Process request
        c.Next()

        // Settle if successful
        if c.Writer.Status() < 400 {
            settlement := m.settlePayment(payment, config)
            c.Header("X-PAYMENT-RESPONSE", settlement)
        }
    }
}
```

---

## Network Support

### Supported Networks

| Network | Type | ChainID | USDC Address | Use Case |
|---------|------|---------|--------------|----------|
| `base` | EVM Mainnet | 8453 | `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` | Production with real USDC |
| `base-sepolia` | EVM Testnet | 84532 | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` | Development and testing |
| `solana` | Solana Mainnet | - | (Base58 address) | Production (experimental) |
| `solana-devnet` | Solana Testnet | - | (Base58 address) | Development (experimental) |

### Network Configuration

```typescript
// USDC contract addresses
export const USDC_ADDRESSES = {
  base: {
    chainId: 8453,
    usdcAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    usdcName: 'USD Coin',
    decimals: 6
  },
  'base-sepolia': {
    chainId: 84532,
    usdcAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
    usdcName: 'USD Coin',
    decimals: 6
  }
};

// Get network config
import { getNetworkId, getUsdcChainConfigForChain } from 'x402/shared';

const chainId = getNetworkId('base');  // 8453
const usdcConfig = getUsdcChainConfigForChain(chainId);
```

### Funding Wallets

**Testnet (base-sepolia):**
- Get USDC from [CDP Faucet](https://portal.cdp.coinbase.com/products/faucet)
- Requires Coinbase account
- Free testnet USDC for development

**Mainnet (base):**
- Buy USDC on Coinbase or other exchanges
- Bridge from Ethereum mainnet to Base
- Use Coinbase Onramp for fiat → USDC

---

## Common Commands

### TypeScript Development

```bash
# Install dependencies (from x402/typescript/)
pnpm install

# Build all packages
pnpm build

# Build specific package
pnpm --filter x402 build
pnpm --filter x402-axios build

# Run tests
pnpm test

# Run tests for specific package
pnpm --filter x402 test

# Lint
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck

# Build paywall (after core changes)
pnpm build:paywall
```

### Running Examples

```bash
# TypeScript server examples
cd x402/examples/typescript/servers/express
pnpm install
pnpm build
pnpm dev  # Starts on http://localhost:4021

# TypeScript client examples
cd x402/examples/typescript/clients/axios
pnpm install
pnpm build
pnpm dev  # Makes paid request to server

# Full-stack example
cd x402/examples/typescript/full-stack/weather
pnpm install
pnpm build
pnpm dev  # Starts both server and client
```

### Python Development

```bash
# Install package in editable mode
cd x402/python/x402
pip install -e .

# Install with dev dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Run specific test
pytest tests/test_client.py

# Format code
black .

# Lint
ruff check .

# Type check
mypy x402
```

### Go Development

```bash
# Get package
go get github.com/coinbase/x402/go

# Build
go build

# Test
go test ./...

# Test with verbose output
go test -v ./...

# Test specific package
go test ./client/...

# Format code
go fmt ./...

# Lint
golangci-lint run
```

### End-to-End Testing

```bash
cd x402/e2e

# Run all tests (production mode - requires mainnet USDC)
pnpm test

# Run in development mode (testnet)
pnpm test -d

# Verbose logging
pnpm test -d -v

# Test specific language
pnpm test -d -ts        # TypeScript only
pnpm test -d -py        # Python only
pnpm test -d -go        # Go only

# Test specific client/server combo
pnpm test -d --client=axios --server=express
pnpm test -d --client=fetch --server=hono
pnpm test -d --client=httpx --server=fastapi

# Test all combinations
pnpm test -d --all
```

---

## Environment Variables

### Server Environment Variables

```bash
# Required: Server wallet address (receives payments)
ADDRESS=0x742d35Cc6634C0532925a3b844Bc454e4438f44e

# Optional: CDP API credentials (for production facilitator)
CDP_API_KEY_ID=your-api-key-id
CDP_API_KEY_SECRET=your-api-key-secret

# Optional: Custom facilitator URL
FACILITATOR_URL=https://api.cdp.coinbase.com/platform

# Optional: Network (defaults to base-sepolia in dev)
NETWORK=base

# Optional: USDC contract address (auto-detected from network)
USDC_CONTRACT_ADDRESS=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913

# Optional: Paywall customization
CDP_CLIENT_KEY=your-cdp-client-key
APP_NAME=My API Service
APP_LOGO=/logo.svg
```

### Client Environment Variables

```bash
# Required: Client wallet private key (NEVER commit to git!)
PRIVATE_KEY=0x1234567890abcdef...

# Optional: Network (defaults to base-sepolia)
NETWORK=base

# Optional: Maximum payment amount (safety limit)
MAX_PAYMENT_USDC=1.00

# Service-specific API keys
FIRECRAWL_API_KEY=fc-...
```

### Development vs Production

**Development (.env.local):**
```bash
NETWORK=base-sepolia
PRIVATE_KEY=0x...testnet-key-ok-to-commit
ADDRESS=0x...testnet-address
FACILITATOR_URL=https://x402.org/facilitator
```

**Production (.env.production):**
```bash
NETWORK=base
PRIVATE_KEY=0x...NEVER-COMMIT-THIS
ADDRESS=0x...production-address
CDP_API_KEY_ID=...
CDP_API_KEY_SECRET=...
FACILITATOR_URL=https://api.cdp.coinbase.com/platform
```

---

## Working Examples & Patterns

### Pattern 1: Firecrawl Web Scraping (Synchronous)

**firecrawl-402demo** demonstrates:
- One-click payments with CDP embedded wallet
- Synchronous x402 responses (no webhooks)
- `x402-fetch` library usage
- Coinbase Onramp integration
- Browser paywall with CDP authentication

**Key Implementation:**

```typescript
// components/WebScraper.tsx
import { wrapFetchWithPayment } from 'x402-fetch';

const wrappedFetch = wrapFetchWithPayment(
  fetch,
  walletClient,  // CDP wallet converted to viem WalletClient
  BigInt(1 * 10 ** 6)  // Max payment: 1 USDC
);

const response = await wrappedFetch('/api/scrape', {
  method: 'POST',
  body: JSON.stringify({ url: targetUrl })
});

// app/api/scrape/route.ts
const firecrawlResponse = await fetch(
  'https://api.firecrawl.dev/v2/x402/scrape',
  {
    method: 'POST',
    headers: {
      'X-PAYMENT': paymentHeader,  // Forward from client
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url,
      formats: ['markdown', 'html'],
      onlyMainContent: true
    })
  }
);

// Returns immediately with scraped data (no polling)
const data = await firecrawlResponse.json();
```

**Lessons Learned:**
- ✅ 402 is expected and correct (not an error)
- ✅ Synchronous responses simplify architecture
- ✅ Client libraries handle payment automatically
- ✅ Onramp requires domain whitelisting
- ✅ CDP wallet provides best UX (no manual signatures)

### Pattern 2: News Aggregator (Cache + Location Awareness)

**news-app** demonstrates:
- Dormant cost model (zero cost when idle)
- MongoDB caching by location and date
- Dynamic location extraction from timezones
- Circuit breaker for failed payments
- Manual EIP-712 signing (fallback pattern)

**Key Implementation:**

```typescript
// src/lib/services/x402Service.ts
async function createX402Payment(paymentRequirements) {
  // Create EIP-712 typed data
  const domain = {
    name: "USD Coin",
    version: "2",
    chainId: 8453,
    verifyingContract: usdcAddress
  };

  const types = {
    TransferWithAuthorization: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" }
    ]
  };

  const message = {
    from: wallet.address,
    to: paymentRequirements.payTo,
    value: paymentRequirements.maxAmountRequired,
    validAfter: (Math.floor(Date.now() / 1000) - 600).toString(),
    validBefore: (Math.floor(Date.now() / 1000) + 60).toString(),
    nonce: randomBytes(32)
  };

  const signature = await wallet.signTypedData({ domain, types, message });

  return btoa(JSON.stringify({
    x402Version: 1,
    scheme: "exact",
    network: "base",
    payload: { signature, authorization: message }
  }));
}

// src/lib/utils/date-utils.ts
export function extractLocationFromTimezone(timezone: string) {
  // "Europe/Dublin" → { country: "IE", city: "Dublin" }
  const [continent, city] = timezone.split('/');
  const country = timezoneToCountryCode[timezone];
  return {
    country,
    city: city.replace(/_/g, ' '),
    query: `${city}, ${countryName} breaking news today`
  };
}
```

**Cache Strategy:**

```typescript
// MongoDB composite key
{
  date: "2025-09-26",
  timezone: "Europe/Dublin",
  location: "IE-Dublin",
  articles: [...],
  metadata: {
    searchQuery: "Dublin, Ireland breaking news today",
    fetchedAt: "2025-09-26T10:00:00Z"
  }
}
```

**Lessons Learned:**
- ✅ Cache by `(date, timezone, location)` for location-aware services
- ✅ Dynamic parsing prevents hardcoding locations
- ✅ Circuit breakers prevent cascading payment failures
- ✅ Manual signing works as fallback to libraries
- ✅ Admin wallet pays for all users (pay-to-read model)

### Pattern 3: Freepik Image Generation (Python)

**freepik-code** demonstrates:
- Python implementation with `httpx`
- CDP API for wallet management
- Payment verification before generation
- Handling async image generation

**Key Implementation:**

```python
from x402 import WalletX402Client
import httpx

# Create wallet client
wallet = WalletX402Client(private_key=os.getenv('PRIVATE_KEY'))

# Wrap httpx client
with httpx.Client() as client:
    x402_client = wallet.wrap_client(client)

    response = x402_client.post(
        'https://api.freepik.com/v1/ai/text-to-image',
        json={
            'prompt': prompt,
            'styling': { 'style': 'photo' }
        }
    )

    # Handle async generation
    if response.status_code == 202:
        task_id = response.json()['task_id']
        # Poll for completion
```

**Lessons Learned:**
- ✅ Python wrapper pattern mirrors TypeScript interceptor
- ✅ Async generation requires polling/webhooks
- ✅ CDP SDK handles wallet operations
- ✅ Payment happens before generation starts

### Pattern 4: MCP Server Integration

**x402/examples/typescript/clients/mcp** demonstrates:
- x402 with Model Context Protocol
- AI agents making paid API calls
- Claude Desktop integration
- Transparent payment for LLMs

**Key Implementation:**

```typescript
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { withPaymentInterceptor } from "x402-axios";
import axios from "axios";

const account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex);
const client = withPaymentInterceptor(
  axios.create({ baseURL: process.env.RESOURCE_SERVER_URL }),
  account
);

const server = new McpServer({
  name: "x402 MCP Client",
  version: "1.0.0"
});

server.tool(
  "get-data-from-resource-server",
  "Get paid data from the server",
  {},
  async () => {
    const res = await client.get(process.env.ENDPOINT_PATH);
    return {
      content: [{ type: "text", text: JSON.stringify(res.data) }]
    };
  }
);
```

**Claude Desktop Configuration:**

```json
{
  "mcpServers": {
    "x402-demo": {
      "command": "pnpm",
      "args": ["--silent", "-C", "/path/to/mcp", "dev"],
      "env": {
        "PRIVATE_KEY": "0x...",
        "RESOURCE_SERVER_URL": "http://localhost:4021",
        "ENDPOINT_PATH": "/weather"
      }
    }
  }
}
```

**Lessons Learned:**
- ✅ MCP server bridges AI agents to paid APIs
- ✅ Payment is invisible to Claude/user
- ✅ Enables pay-per-use AI tool access
- ✅ Wallet funded by developer (not end user)

---

## Debugging & Troubleshooting

### Common Issues

#### Issue 1: "402 Payment Required" Keeps Returning

**Symptoms:**
- Client receives 402 even with payment header
- Payment verification fails
- No transaction on-chain

**Debug Steps:**

1. **Check payment header encoding:**
```typescript
const decoded = Buffer.from(paymentHeader, 'base64').toString('utf-8');
console.log('Payment payload:', JSON.parse(decoded));
```

2. **Verify signature:**
```typescript
import { verifyTypedData } from 'viem';

const isValid = await verifyTypedData({
  address: paymentPayload.payload.authorization.from,
  domain,
  types,
  primaryType: 'TransferWithAuthorization',
  message: paymentPayload.payload.authorization,
  signature: paymentPayload.payload.signature
});
console.log('Signature valid:', isValid);
```

3. **Check wallet balance:**
```bash
# Use cast (Foundry) to check USDC balance
cast call 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913 \
  "balanceOf(address)(uint256)" \
  0xYourWalletAddress \
  --rpc-url https://mainnet.base.org

# Or use viem
const balance = await publicClient.readContract({
  address: usdcAddress,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: [walletAddress]
});
console.log('USDC balance:', balance / 10n ** 6n);
```

4. **Verify network match:**
```typescript
// Client network must match payment requirements
console.log('Wallet network:', walletClient.chain?.id);
console.log('Required network:', getNetworkId(paymentRequirements.network));
```

5. **Check nonce reuse:**
```typescript
// Nonce must be unique for each payment
console.log('Nonce:', paymentPayload.payload.authorization.nonce);
// Search blockchain for previous usage (rare, but possible)
```

#### Issue 2: Facilitator Verification Fails

**Symptoms:**
- `isValid: false` from facilitator
- `invalidReason` in response

**Common Reasons:**

| Error Reason | Cause | Fix |
|--------------|-------|-----|
| `insufficient_funds` | Not enough USDC in wallet | Fund wallet from faucet or exchange |
| `invalid_signature` | Signature doesn't match | Check EIP-712 domain/types, ensure correct chain |
| `invalid_exact_evm_payload_authorization_value` | Amount doesn't meet requirement | Check `value` matches `maxAmountRequired` |
| `invalid_exact_evm_payload_authorization_valid_after` | Time window issue | Ensure `validAfter` is in past (account for clock skew) |
| `invalid_exact_evm_payload_authorization_valid_before` | Authorization expired | Increase `maxTimeoutSeconds` or retry |

#### Issue 3: Payment Verification Succeeds, Settlement Fails

**Symptoms:**
- `/verify` returns `isValid: true`
- `/settle` returns `success: false`
- No transaction hash

**Debug Steps:**

1. **Check if funds were spent between verify and settle:**
```typescript
// Race condition: multiple requests draining wallet
const balance = await checkBalance();
console.log('Balance after verify, before settle:', balance);
```

2. **Examine facilitator response:**
```typescript
const settlement = await settle(payment, requirements);
console.log('Settlement error:', settlement.errorReason);
```

3. **Retry settlement:**
```typescript
// Idempotent: same signature can be settled multiple times
// until nonce is consumed
if (!settlement.success) {
  await new Promise(resolve => setTimeout(resolve, 5000));
  const retry = await settle(payment, requirements);
}
```

#### Issue 4: CORS Errors with X-PAYMENT-RESPONSE

**Symptoms:**
- `X-PAYMENT-RESPONSE` header not accessible in browser
- CORS error in console

**Fix:**

Server must explicitly expose header:

```typescript
// Express
app.use((req, res, next) => {
  res.setHeader('Access-Control-Expose-Headers', 'X-PAYMENT-RESPONSE');
  next();
});

// Next.js API route
export async function GET(request: Request) {
  return new Response(data, {
    headers: {
      'Access-Control-Expose-Headers': 'X-PAYMENT-RESPONSE',
      'X-PAYMENT-RESPONSE': base64EncodedReceipt
    }
  });
}

// Client (axios)
axios.defaults.headers.common['Access-Control-Expose-Headers'] = 'X-PAYMENT-RESPONSE';

// Client (fetch)
fetch(url, {
  headers: {
    'Access-Control-Expose-Headers': 'X-PAYMENT-RESPONSE'
  }
});
```

#### Issue 5: TypeScript Build Errors in x402 Package

**Symptoms:**
- `Cannot find module 'x402/types'`
- `Module not found: Can't resolve 'x402/shared'`

**Fix:**

```bash
# Rebuild packages in dependency order
cd x402/typescript
pnpm build

# If still failing, clean and rebuild
rm -rf node_modules .turbo
pnpm install
pnpm build

# Ensure package.json exports are correct
cat packages/x402/package.json | grep -A 10 exports
```

### Logging Best Practices

```typescript
// Server-side logging
app.use(paymentMiddleware(address, routes, facilitator));

app.use((req, res, next) => {
  console.log('═══ REQUEST ═══');
  console.log('Path:', req.path);
  console.log('Method:', req.method);
  console.log('X-PAYMENT:', req.headers['x-payment'] ? 'Present' : 'Missing');

  if (req.headers['x-payment']) {
    const decoded = Buffer.from(req.headers['x-payment'], 'base64').toString();
    console.log('Payment:', JSON.parse(decoded));
  }

  next();
});

// Client-side logging
axios.interceptors.request.use(config => {
  console.log('→ Request:', config.method?.toUpperCase(), config.url);
  if (config.headers['X-PAYMENT']) {
    console.log('  Payment attached');
  }
  return config;
});

axios.interceptors.response.use(
  response => {
    console.log('← Response:', response.status, response.config.url);
    if (response.headers['x-payment-response']) {
      const receipt = decodeXPaymentResponse(response.headers['x-payment-response']);
      console.log('  Payment settled:', receipt.transaction);
    }
    return response;
  },
  error => {
    if (error.response?.status === 402) {
      console.log('← 402 Payment Required');
      console.log('  Accepts:', error.response.data.accepts);
    }
    throw error;
  }
);
```

### Testing Checklist

Before deploying x402 integration:

- [ ] Test with base-sepolia testnet first
- [ ] Verify wallet has sufficient USDC balance
- [ ] Test 402 flow manually (no payment → receive 402 → add payment → success)
- [ ] Verify `X-PAYMENT-RESPONSE` header is accessible
- [ ] Test with insufficient balance (should return 402 with error)
- [ ] Test with expired payment (validBefore in past)
- [ ] Test with wrong network (should fail verification)
- [ ] Test with reused nonce (should fail on settlement)
- [ ] Load test: multiple concurrent requests
- [ ] Monitor facilitator response times
- [ ] Set up error tracking for payment failures
- [ ] Configure alerts for wallet balance thresholds

---

## Security Considerations

### Never Do This ❌

```typescript
// DON'T commit private keys to git
const privateKey = '0x1234567890abcdef...';  // ❌

// DON'T use mainnet keys in code
PRIVATE_KEY=0x...mainnet-key  // ❌

// DON'T reuse nonces
const nonce = '0x' + '00'.repeat(32);  // ❌

// DON'T skip signature verification
if (payment) {
  // serve resource without verification  // ❌
}

// DON'T trust client-provided amounts
const amount = req.body.amount;  // ❌
```

### Always Do This ✅

```typescript
// ✅ Use environment variables
const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

// ✅ Validate private key format
if (!privateKey?.match(/^0x[a-fA-F0-9]{64}$/)) {
  throw new Error('Invalid private key');
}

// ✅ Use cryptographically random nonces
import { randomBytes } from 'crypto';
const nonce = '0x' + randomBytes(32).toString('hex');

// ✅ Always verify payments via facilitator
const verification = await verify(payment, requirements);
if (!verification.isValid) {
  return res.status(402).json({ error: verification.invalidReason });
}

// ✅ Server defines amounts, not client
const requirements = {
  maxAmountRequired: (0.01 * 10 ** 6).toString(),  // Server-controlled
  ...
};
```

### Best Practices

1. **Wallet Security:**
   - Use separate wallets for testnet and mainnet
   - Rotate keys periodically
   - Use hardware wallets for high-value mainnet servers
   - Monitor wallet balances and set up alerts
   - Use CDP Wallet SDK for managed wallets

2. **Payment Verification:**
   - Always verify via facilitator (don't trust client)
   - Check signature, balance, nonce, time window
   - Validate payment amount matches requirements
   - Confirm network matches expected chain

3. **Error Handling:**
   - Don't expose internal errors to clients
   - Log payment failures for monitoring
   - Implement circuit breakers for failed payments
   - Rate limit 402 responses to prevent DoS

4. **Network Security:**
   - Use HTTPS for all x402 endpoints
   - Validate CORS settings
   - Implement rate limiting
   - Monitor for suspicious payment patterns

5. **Facilitator Trust:**
   - Use official Coinbase facilitator for production
   - Verify facilitator SSL certificates
   - Implement fallback facilitators
   - Monitor facilitator uptime

### Threat Model

**What x402 Protects Against:**
- ✅ Unauthorized API access without payment
- ✅ Payment replay attacks (nonce protection)
- ✅ Payment amount manipulation (signature covers value)
- ✅ Recipient manipulation (signature covers `to` address)
- ✅ Network/chain confusion (signature includes chainId)

**What x402 Does NOT Protect Against:**
- ❌ Compromised private keys (user responsibility)
- ❌ Malicious facilitators (trust required)
- ❌ Smart contract bugs in USDC (inherited risk)
- ❌ Blockchain network failures (external dependency)
- ❌ DoS attacks on resource servers (separate mitigation)

### Compliance Considerations

- **KYC/AML**: x402 payments are on-chain and traceable
- **Tax Reporting**: Servers must track payment receipts
- **Data Privacy**: Payment metadata may contain PII
- **Cross-Border**: USDC payments cross international boundaries
- **Terms of Service**: Disclose payment requirements clearly

---

## Contributing Guidelines

From CONTRIBUTING.md and community practices:

### Code Contributions

1. **Sign Commits:**
   ```bash
   git config user.signingkey <your-gpg-key>
   git config commit.gpgsign true
   git commit -S -m "Your message"
   ```

2. **Follow Language Conventions:**
   - TypeScript: Use pnpm, ESLint, Prettier
   - Python: Use black, ruff, mypy
   - Go: Use go fmt, golangci-lint

3. **Write Tests:**
   - Unit tests for all new functions
   - Integration tests for middleware/interceptors
   - E2E tests for cross-language changes

4. **Update Documentation:**
   - Update README if API changes
   - Add JSDoc/docstrings for public functions
   - Update examples if breaking changes

### Proposing New Payment Schemes

New schemes (like "upto" for usage-based pricing) require:

1. **Spec Document:** Submit PR to `specs/schemes/<name>/`
2. **Security Audit:** Coinbase legal/security review required
3. **Implementation:** After approval, implement in all languages
4. **E2E Tests:** Comprehensive cross-language testing

**Why This Process:**
- Payment schemes involve real money and legal implications
- Security vulnerabilities could lose funds
- Consistency across languages is critical
- Backward compatibility must be maintained

### Adding New Blockchain Networks

To add support for a new chain (e.g., Optimism, Arbitrum):

1. **Same Scheme Analysis:**
   - If chain uses same mechanics (e.g., EVM + EIP-3009), propose network addition
   - Requires audit even if scheme is identical (different chain = different risks)

2. **Different Mechanics:**
   - If chain has different signature/settlement mechanisms, propose new scheme
   - Follow scheme proposal process above

3. **Implementation Steps:**
   - Add network to `NetworkSchema` in types
   - Add USDC address to network config
   - Update facilitator to support network
   - Add E2E tests for new network
   - Update documentation

### Paywall Rebuild

If you modify core x402 TypeScript package:

```bash
cd x402/typescript
pnpm build:paywall
git add packages/x402/src/paywall/gen/template.ts
git commit -S -m "Rebuild paywall after core changes"
```

**Why:** Paywall HTML is embedded as generated TypeScript to avoid runtime file I/O.

### Pull Request Process

1. Fork repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes with signed commits
4. Run tests: `pnpm test` (TS), `pytest` (Python), `go test ./...` (Go)
5. Push to fork: `git push origin feature/my-feature`
6. Open PR against `main` branch
7. Address review feedback
8. Maintainers will merge after approval

---

## Additional Resources

### Official Documentation

- **Protocol Specs:** `x402/specs/`
- **Core Concepts:** `402-docs/core-concepts/`
- **Quickstarts:** `402-docs/quickstart-for-sellers.md`, `quickstart-for-buyers.md`
- **FAQ:** `402-docs/faq.md`
- **Bazaar:** `402-docs/bazaar.md` (service discovery)

### Code Examples

- **TypeScript:** `x402/examples/typescript/`
- **Python:** `x402/examples/python/`
- **Go:** `x402/examples/go/`
- **Full-Stack:** `x402/examples/typescript/full-stack/`
- **MCP:** `x402/examples/typescript/clients/mcp/`

### Working Applications

- **Firecrawl Demo:** `/Users/ashnouruzi/firecrawl-402demo`
- **News App:** `/Users/ashnouruzi/news-app`
- **Freepik Code:** `/Users/ashnouruzi/freepik-code`

### External Resources

- **Base Network:** https://base.org
- **USDC Documentation:** https://www.circle.com/en/usdc
- **EIP-3009 Spec:** https://eips.ethereum.org/EIPS/eip-3009
- **EIP-712 Spec:** https://eips.ethereum.org/EIPS/eip-712
- **CDP Portal:** https://portal.cdp.coinbase.com
- **CDP Faucet:** https://portal.cdp.coinbase.com/products/faucet
- **Viem Docs:** https://viem.sh
- **Foundry Docs:** https://book.getfoundry.sh

### Getting Help

1. **Check FAQ:** `402-docs/faq.md` for common questions
2. **Use context7 MCP:** For protocol-specific issues
3. **Read Examples:** Working code in `examples/` directories
4. **Review Issues:** https://github.com/coinbase/x402/issues
5. **Community:** (Check repo for Discord/community links)

---

## Summary

You are now equipped with expert-level knowledge of the x402 payment protocol:

- ✅ **Protocol Flow:** Understand 402 → Sign → Verify → Settle → Response
- ✅ **EIP-3009:** Know how gasless transfers work via cryptographic authorization
- ✅ **Client Libraries:** Can implement automatic payment handling in any language
- ✅ **Server Middleware:** Can protect APIs with micropayments
- ✅ **Facilitator System:** Understand verification, settlement, and trust model
- ✅ **Network Support:** Work with Base, Base Sepolia, Solana networks
- ✅ **Security:** Apply best practices for wallet management and payment verification
- ✅ **Debugging:** Troubleshoot common issues and implement proper logging
- ✅ **Real-World Patterns:** Apply patterns from working applications

**Remember:** When experiencing errors or problems with x402, always use the context7 MCP tool to consult official documentation before making assumptions or changes.

**The x402 protocol enables the internet-native payment layer that HTTP always needed. You are now ready to build the paid API economy of the future.**
