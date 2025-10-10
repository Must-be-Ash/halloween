import { NextRequest, NextResponse } from "next/server";

const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export async function middleware(request: NextRequest) {
  // Initialize facilitator at REQUEST TIME (not module load time)
  // This ensures env vars are available and JWT tokens are fresh
  const { facilitator } = await import("@coinbase/x402");
  const { useFacilitator } = await import("x402/verify");
  const { verify: verifyPayment, settle: settlePayment } = useFacilitator(facilitator);

  const RECIPIENT_ADDRESS = process.env.RECIPIENT_WALLET_ADDRESS! as `0x${string}`;
  console.log("[x402] ========== MIDDLEWARE INVOKED ==========");
  console.log("[x402] Method:", request.method);
  console.log("[x402] URL:", request.url);
  console.log("[x402] Path:", request.nextUrl.pathname);

  const paymentHeader = request.headers.get("X-PAYMENT");
  console.log("[x402] X-PAYMENT header present:", !!paymentHeader);

  // If no payment header, return 402 with payment requirements
  if (!paymentHeader) {
    console.log("[x402] No payment header - returning 402");

    const paymentRequirements = {
      x402Version: 1,
      error: "X-PAYMENT header is required",
      accepts: [
        {
          scheme: "exact",
          network: "base",
          maxAmountRequired: (0.05 * 10 ** 6).toString(), // $0.05 USDC
          resource: request.url,
          description: "AI image transformation with Nano Banana - $0.05",
          mimeType: "application/json",
          payTo: RECIPIENT_ADDRESS,
          maxTimeoutSeconds: 60,
          asset: USDC_BASE,
          extra: {
            name: "USD Coin",
            version: "2",
          },
        },
      ],
    };

    return NextResponse.json(paymentRequirements, {
      status: 402,
      headers: {
        "Content-Type": "application/json",
      }
    });
  }

  // Decode payment header
  console.log("[x402] Decoding payment header...");
  let paymentPayload;
  try {
    const decoded = Buffer.from(paymentHeader, "base64").toString("utf-8");
    paymentPayload = JSON.parse(decoded);
    console.log("[x402] Payment payload decoded:", JSON.stringify(paymentPayload, null, 2));
  } catch (error) {
    console.error("[x402] Failed to decode payment:", error);
    return NextResponse.json(
      { error: "Invalid payment header format" },
      { status: 400 }
    );
  }

  // Verify payment with CDP facilitator
  console.log("[x402] Verifying payment with CDP facilitator...");
  const paymentRequirements = {
    scheme: "exact" as const,
    network: "base" as const,
    maxAmountRequired: (0.05 * 10 ** 6).toString(),
    resource: request.url,
    description: "AI image transformation with Nano Banana - $0.05",
    mimeType: "application/json",
    payTo: RECIPIENT_ADDRESS,
    maxTimeoutSeconds: 60,
    asset: USDC_BASE,
    extra: {
      name: "USD Coin",
      version: "2",
    },
  };

  try {
    console.log("[x402] Calling verifyPayment with payload:", JSON.stringify(paymentPayload, null, 2));
    console.log("[x402] Payment requirements:", JSON.stringify(paymentRequirements, null, 2));

    const verifyResult = await verifyPayment(paymentPayload, paymentRequirements);

    console.log("[x402] Verification result:", JSON.stringify(verifyResult, null, 2));

    if (!verifyResult.isValid) {
      console.error("[x402] Payment verification failed:", verifyResult.invalidReason);
      return NextResponse.json(
        { error: "Payment verification failed", reason: verifyResult.invalidReason },
        { status: 402 }
      );
    }

    console.log("[x402] Payment verified successfully for payer:", verifyResult.payer);
  } catch (error) {
    console.error("[x402] Verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }

  // Process the request
  console.log("[x402] Proceeding with request...");
  const response = await NextResponse.next();

  // Only settle if response was successful
  if (response.status >= 400) {
    console.log("[x402] Request failed (status:", response.status, ") - skipping settlement");
    console.log("[x402] ========== MIDDLEWARE COMPLETE ==========");
    return response;
  }

  console.log("[x402] Request successful (status:", response.status, ") - settling payment...");

  // Settle payment with CDP facilitator (MUST complete before returning response)
  try {
    console.log("[x402] Calling settlePayment...");

    const settleResult = await settlePayment(paymentPayload, paymentRequirements);

    console.log("[x402] Settlement result:", JSON.stringify(settleResult, null, 2));

    if (!settleResult.success) {
      console.error("[x402] ❌ Settlement failed:", settleResult.errorReason);
      return NextResponse.json(
        { error: "Payment settlement failed", reason: settleResult.errorReason },
        { status: 402 }
      );
    }

    console.log("[x402] ✅ Payment settled successfully!");
    console.log("[x402] Transaction:", settleResult.transaction);
    console.log("[x402] Network:", settleResult.network);
    console.log("[x402] Payer:", settleResult.payer);

    // Add payment response header
    const paymentResponse = {
      success: true,
      transaction: settleResult.transaction,
      network: settleResult.network,
      payer: settleResult.payer,
    };

    response.headers.set(
      "X-PAYMENT-RESPONSE",
      Buffer.from(JSON.stringify(paymentResponse)).toString("base64")
    );
  } catch (error) {
    console.error("[x402] Settlement error:", error);
    return NextResponse.json(
      { error: "Payment settlement failed", details: error instanceof Error ? error.message : String(error) },
      { status: 402 }
    );
  }

  console.log("[x402] ========== MIDDLEWARE COMPLETE ==========");
  return response;
}

export const config = {
  matcher: "/api/process-image",
};
