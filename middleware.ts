import { NextRequest, NextResponse } from "next/server";
import { getAddress } from "viem";

export async function middleware(request: NextRequest) {
  // Only apply middleware to /api/process-image
  if (!request.nextUrl.pathname.startsWith("/api/process-image")) {
    return NextResponse.next();
  }

  const paymentHeader = request.headers.get("X-PAYMENT");
  const recipientAddress = process.env.RECIPIENT_WALLET_ADDRESS;
  const usdcContract = process.env.NEXT_PUBLIC_USDC_CONTRACT;

  if (!recipientAddress) {
    console.error("[x402] RECIPIENT_WALLET_ADDRESS not configured");
    return NextResponse.json(
      { error: "Payment system not configured" },
      { status: 500 }
    );
  }

  // If no payment header, return 402 with payment requirements
  if (!paymentHeader) {
    console.log("[x402] No payment header found, returning 402");

    return NextResponse.json(
      {
        x402Version: 1,
        error: "Payment required",
        accepts: [
          {
            scheme: "exact",
            network: "base",
            maxAmountRequired: "50000", // $0.05 USDC (6 decimals)
            resource: `${request.nextUrl.protocol}//${request.nextUrl.host}${request.nextUrl.pathname}`,
            description: "AI image transformation with Nano Banana - $0.05",
            mimeType: "application/json",
            payTo: getAddress(recipientAddress),
            maxTimeoutSeconds: 60,
            asset: getAddress(usdcContract || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
            extra: {
              name: "USD Coin",
              version: "2",
            },
          },
        ],
      },
      {
        status: 402,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Expose-Headers": "X-PAYMENT-RESPONSE",
        },
      }
    );
  }

  // Payment header exists - verify it
  try {
    console.log("[x402] Payment header found, verifying...");
    console.log("[x402] Using x402.rs facilitator (Base mainnet - no auth required)");

    const { useFacilitator } = await import("x402/verify");
    const { exact } = await import("x402/schemes");
    
    // Use x402.rs facilitator - supports Base mainnet, no API keys required!
    const { verify } = useFacilitator({ 
      url: "https://facilitator.x402.rs" as `${string}://${string}`
    });

    // Decode payment using official x402 decoder
    const decodedPayment = exact.evm.decodePayment(paymentHeader);
    decodedPayment.x402Version = 1;

    const paymentRequirements = {
      scheme: "exact" as const,
      network: "base" as const,
      maxAmountRequired: "50000",
      resource: `${request.nextUrl.protocol}//${request.nextUrl.host}${request.nextUrl.pathname}`,
      description: "AI image transformation with Nano Banana - $0.05",
      mimeType: "application/json",
      payTo: getAddress(recipientAddress),
      maxTimeoutSeconds: 60,
      asset: getAddress(usdcContract || "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"),
      extra: {
        name: "USD Coin",
        version: "2",
      },
    };

    // Verify payment
    console.log("[x402] Calling verify...");
    const verification = await verify(decodedPayment, paymentRequirements);

    if (!verification.isValid) {
      console.error("[x402] Payment verification failed:", verification.invalidReason);
      return NextResponse.json(
        {
          x402Version: 1,
          error: "Invalid payment",
          reason: verification.invalidReason,
          payer: verification.payer,
          accepts: [paymentRequirements],
        },
        {
          status: 402,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    console.log("[x402] Payment verified successfully, payer:", verification.payer);

    // Payment is valid - allow request to proceed
    // We'll settle the payment in the API route after successful processing
    const response = NextResponse.next();
    response.headers.set("X-PAYMENT-VERIFIED", "true");
    if (verification.payer) {
      response.headers.set("X-PAYER", verification.payer);
    }

    return response;

  } catch (error) {
    console.error("[x402] Error processing payment:", error);
    return NextResponse.json(
      {
        error: "Payment verification error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: "/api/process-image",
  runtime: "nodejs",
};
