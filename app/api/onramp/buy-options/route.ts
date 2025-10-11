import { NextRequest, NextResponse } from "next/server";
import { generateCDPJWT, ONRAMP_API_BASE_URL } from "@/lib/cdp-auth";

/**
 * GET /api/onramp/buy-options
 * Fetches available buy options for onramp (payment methods and assets)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const subdivision = searchParams.get("subdivision");

    if (!country) {
      return NextResponse.json(
        { error: "Country parameter is required" },
        { status: 400 }
      );
    }

    // Build CDP API URL
    const queryParams = new URLSearchParams({ country });
    if (subdivision) queryParams.append("subdivision", subdivision);
    const path = `/onramp/v1/buy/options?${queryParams.toString()}`;
    const url = `${ONRAMP_API_BASE_URL}${path}`;

    // Generate JWT for authentication
    const jwt = await generateCDPJWT({
      requestMethod: "GET",
      requestHost: new URL(ONRAMP_API_BASE_URL).host,
      requestPath: path,
    });

    // Fetch buy options from CDP
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Onramp] Buy options error:", errorText);
      return NextResponse.json(
        { error: "Failed to fetch buy options", details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Onramp] Buy options error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch buy options",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
