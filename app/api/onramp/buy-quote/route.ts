import { NextRequest, NextResponse } from "next/server";
import { generateCDPJWT, ONRAMP_API_BASE_URL } from "@/lib/cdp-auth";

/**
 * POST /api/onramp/buy-quote
 * Creates a buy quote for onramp purchase
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Build CDP API URL
    const path = "/onramp/v1/buy/quote";
    const url = `${ONRAMP_API_BASE_URL}${path}`;

    // Generate JWT for authentication
    const jwt = await generateCDPJWT({
      requestMethod: "POST",
      requestHost: new URL(ONRAMP_API_BASE_URL).host,
      requestPath: path,
    });

    // Create buy quote with CDP
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Onramp] Buy quote error:", errorText);
      return NextResponse.json(
        { error: "Failed to create buy quote", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Onramp] Buy quote error:", error);
    return NextResponse.json(
      {
        error: "Failed to create buy quote",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
