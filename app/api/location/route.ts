import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge"; // Use edge runtime for access to geo headers

/**
 * GET /api/location
 * Detects user's country and subdivision from IP geolocation headers
 *
 * Uses Vercel or Cloudflare geo headers to determine location
 * Falls back to US/CA if detection fails
 */
export async function GET(request: NextRequest) {
  try {
    // Try Vercel geo headers first (most reliable on Vercel deployments)
    let country = request.headers.get("x-vercel-ip-country") ||
                  request.headers.get("CF-IPCountry") || // Cloudflare fallback
                  null;

    let subdivision = request.headers.get("x-vercel-ip-country-region") || null;

    // Normalize country code to uppercase
    if (country) {
      country = country.toUpperCase();
    }

    // Normalize subdivision code to uppercase
    if (subdivision) {
      subdivision = subdivision.toUpperCase();
    }

    // For US users, subdivision (state) is required by Coinbase Onramp
    // If we have US but no state, default to CA (California)
    if (country === "US" && !subdivision) {
      subdivision = "CA";
    }

    // If no country detected, default to US/CA
    if (!country) {
      country = "US";
      subdivision = "CA";
    }

    console.log(`[Location API] Detected location: ${country}${subdivision ? `/${subdivision}` : ""}`);

    return NextResponse.json({
      country,
      subdivision,
      detected: !!request.headers.get("x-vercel-ip-country") || !!request.headers.get("CF-IPCountry"),
    });
  } catch (error) {
    console.error("[Location API] Error detecting location:", error);

    // Fallback to US/CA on error
    return NextResponse.json({
      country: "US",
      subdivision: "CA",
      detected: false,
    });
  }
}
