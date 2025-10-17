### 3. Create `lib/cdp-auth.ts`

Create a new file `lib/cdp-auth.ts` in your project root. This file exports helper functions to generate JWTs for authorizing Onramp API calls and provides the base URL for API requests.

```tsx lines expandable lib/cdp-auth.ts theme={null}
import { generateJwt } from "@coinbase/cdp-sdk/auth";

interface CDPAuthConfig {
  requestMethod: string;
  requestHost: string;
  requestPath: string;
  audience?: string[];
}

/**
 * Get CDP API credentials from environment variables
 *
 * @throws Error if credentials are not configured
 */
export function getCDPCredentials() {
  const apiKeyId = process.env.CDP_API_KEY_ID;
  const apiKeySecret = process.env.CDP_API_KEY_SECRET;

  if (!apiKeyId || !apiKeySecret) {
    throw new Error("CDP API credentials not configured");
  }

  return { apiKeyId, apiKeySecret };
}

/**
 * Generate JWT token for CDP API authentication
 *
 * @param config - Configuration for JWT generation
 * @returns JWT token string
 */
export async function generateCDPJWT(config: CDPAuthConfig): Promise<string> {
  const { apiKeyId, apiKeySecret } = getCDPCredentials();

  return generateJwt({
    apiKeyId,
    apiKeySecret,
    requestMethod: config.requestMethod,
    requestHost: config.requestHost,
    requestPath: config.requestPath,
  });
}

/**
 * Base URL for ONRAMP API
 * Can change to api.cdp.coinbase.com/platform once session token endpoints are supported in v2 API
 */
export const ONRAMP_API_BASE_URL = "https://api.developer.coinbase.com";
```

This utility file provides:

* `getCDPCredentials()`: Reads your API credentials from environment variables
* `generateCDPJWT()`: Creates authenticated JWT tokens for API calls
* `ONRAMP_API_BASE_URL`: The base URL for all Onramp API requests

These functions will be imported and used in your API routes in the next step.

### 4. Set up server-side endpoints

You will need to create two server-side endpoints to interact with the Onramp API.

<Steps titleSize="p">
  <Step title="Transform response data helper">
    The `FundModal` component expects functions that return data in camel-case, so for now the data from the Onramp API needs to be transformed.

    <Note>
      The v1 version of the Onramp API returns data with snake case keys. In v2, data will be returned with camel case keys.
    </Note>

    ```tsx lines expandable lib/to-camel-case.ts theme={null}
    type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
      ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
      : S;

    type CamelizeKeys<T> = T extends readonly unknown[]
      ? { [K in keyof T]: CamelizeKeys<T[K]> }
      : T extends object
        ? {
            [K in keyof T as SnakeToCamelCase<K & string>]: CamelizeKeys<T[K]>;
          }
        : T;

    /**
     * Converts snake_case keys to camelCase in an object or array of objects.
     *
     * @param {T} obj - The object, array, or string to convert. (required)
     * @returns {T} The converted object, array, or string.
     */
    export const convertSnakeToCamelCase = <T>(obj: T): CamelizeKeys<T> => {
      if (Array.isArray(obj)) {
        return obj.map(item => convertSnakeToCamelCase(item)) as CamelizeKeys<T>;
      }

      if (obj !== null && typeof obj === "object") {
        return Object.keys(obj).reduce((acc, key) => {
          const camelCaseKey = toCamelCase(key);
          (acc as Record<string, unknown>)[camelCaseKey] = convertSnakeToCamelCase(
            (obj as Record<string, unknown>)[key],
          );
          return acc;
        }, {} as CamelizeKeys<T>);
      }

      return obj as CamelizeKeys<T>;
    };

    const toCamelCase = (str: string) => {
      return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    };
    ```
  </Step>

  <Step title="Get buy options">
    The [Buy Options API](/api-reference/rest-api/onramp-offramp/get-buy-config) provides the available payment methods to the `FundModal` and `Fund` components.

    ```tsx lines expandable app/api/onramp/buy-options/route.ts theme={null}
    import {
      type FetchBuyOptions,
      type OnrampBuyOptionsSnakeCaseResponse,
    } from "@coinbase/cdp-react";
    import { NextRequest, NextResponse } from "next/server";

    import { generateCDPJWT, getCDPCredentials, ONRAMP_API_BASE_URL } from "@/lib/cdp-auth";
    import { convertSnakeToCamelCase } from "@/lib/to-camel-case";

    type OnrampBuyOptionsResponseRaw = OnrampBuyOptionsSnakeCaseResponse;
    type OnrampBuyOptionsResponse = Awaited<ReturnType<FetchBuyOptions>>;

    /**
     * Fetches available buy options (payment currencies and purchasable assets) for onramp
     *
     * @param request - NextRequest object
     * @returns NextResponse object
     */
    export async function GET(request: NextRequest) {
      try {
        // Validate CDP credentials are configured
        try {
          getCDPCredentials();
        } catch (_error) {
          return NextResponse.json({ error: "CDP API credentials not configured" }, { status: 500 });
        }

        /**
         * Extract query parameters
         * Note: While the API documentation shows all parameters as optional,
         * the backend currently requires the 'country' parameter
         */
        const searchParams = request.nextUrl.searchParams;
        const country = searchParams.get("country");
        const subdivision = searchParams.get("subdivision");
        const networks = searchParams.get("networks");

        // Build query string
        const queryParams = new URLSearchParams();
        if (country) queryParams.append("country", country);
        if (subdivision) queryParams.append("subdivision", subdivision);
        if (networks) queryParams.append("networks", networks);

        const queryString = queryParams.toString();
        const apiPath = "/onramp/v1/buy/options";
        const fullPath = apiPath + (queryString ? `?${queryString}` : "");

        // Generate JWT for CDP API authentication
        const jwt = await generateCDPJWT({
          requestMethod: "GET",
          requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
          requestPath: apiPath,
        });

        // Call CDP API to get buy options
        const response = await fetch(`${ONRAMP_API_BASE_URL}${fullPath}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error("CDP API error:", response.statusText);
          const errorText = await response.text();
          console.error("Error details:", errorText);

          try {
            const errorData = JSON.parse(errorText);
            return NextResponse.json(
              { error: errorData.message || "Failed to fetch buy options" },
              { status: response.status },
            );
          } catch {
            return NextResponse.json(
              { error: "Failed to fetch buy options" },
              { status: response.status },
            );
          }
        }

        const data: OnrampBuyOptionsResponseRaw = await response.json();
        const dataCamelCase: OnrampBuyOptionsResponse = convertSnakeToCamelCase(data);
        return NextResponse.json(dataCamelCase);
      } catch (error) {
        console.error("Error fetching buy options:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    }
    ```
  </Step>

  <Step title="Create buy quote">
    The [Buy Quote API](/api-reference/rest-api/onramp-offramp/create-buy-quote) provides the exchange rate as well as the purchase URL to the `Fund` and `FundModal` components.

    ```tsx lines expandable app/api/onramp/buy-quote/route.ts theme={null}
    import {
      type FetchBuyQuote,
      type OnrampBuyQuoteSnakeCaseResponse,
    } from "@coinbase/cdp-react";
    import { NextRequest, NextResponse } from "next/server";

    import { generateCDPJWT, getCDPCredentials, ONRAMP_API_BASE_URL } from "@/lib/cdp-auth";
    import { convertSnakeToCamelCase } from "@/lib/to-camel-case";

    type OnrampBuyQuoteRequest = Parameters<FetchBuyQuote>[0];
    type OnrampBuyQuoteResponseRaw = OnrampBuyQuoteSnakeCaseResponse;
    type OnrampBuyQuoteResponse = Awaited<ReturnType<FetchBuyQuote>>;

    /**
     * Creates a buy quote for onramp purchase
     *
     * @param request - Buy quote request parameters
     * @returns Buy quote with fees and onramp URL
     */
    export async function POST(request: NextRequest) {
      try {
        const body: OnrampBuyQuoteRequest = await request.json();

        // Validate CDP credentials are configured
        try {
          getCDPCredentials();
        } catch (_error) {
          return NextResponse.json({ error: "CDP API credentials not configured" }, { status: 500 });
        }

        // Validate required fields

        // Note we don't require the wallet info because this endpoint is used to get an exchange rate. Only the onramp URL requires the wallet info.

        if (
          !body.purchaseCurrency ||
          !body.paymentAmount ||
          !body.paymentCurrency ||
          !body.paymentMethod ||
          !body.country
        ) {
          return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
        }

        // Validate US subdivision requirement
        if (body.country === "US" && !body.subdivision) {
          return NextResponse.json({ error: "State/subdivision is required for US" }, { status: 400 });
        }

        // Generate JWT for CDP API authentication
        const jwt = await generateCDPJWT({
          requestMethod: "POST",
          requestHost: new URL(ONRAMP_API_BASE_URL).hostname,
          requestPath: "/onramp/v1/buy/quote",
        });

        // Prepare request body for buy quote API
        const requestBody = {
          purchaseCurrency: body.purchaseCurrency,
          purchaseNetwork: body.purchaseNetwork, // Use the wallet's network
          paymentAmount: body.paymentAmount,
          paymentCurrency: body.paymentCurrency,
          paymentMethod: body.paymentMethod,
          country: body.country,
          subdivision: body.subdivision,
          destinationAddress: body.destinationAddress, // Include to get one-click-buy URL
        };

        // Call CDP Onramp API to get buy quote and URL
        const response = await fetch(`${ONRAMP_API_BASE_URL}/onramp/v1/buy/quote`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          console.error("CDP API error:", response.statusText);
          const errorText = await response.text();
          console.error("Error details:", errorText);

          try {
            const errorData = JSON.parse(errorText);
            return NextResponse.json(
              { error: errorData.message || "Failed to create buy quote" },
              { status: response.status },
            );
          } catch {
            return NextResponse.json(
              { error: "Failed to create buy quote" },
              { status: response.status },
            );
          }
        }

        // convert response data to camelCase until migration to API v2 which will return camelCase data
        const data: OnrampBuyQuoteResponseRaw = await response.json();
        const dataCamelCase: OnrampBuyQuoteResponse = convertSnakeToCamelCase(data);
        return NextResponse.json(dataCamelCase);
      } catch (error) {
        console.error("Error creating buy quote:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
      }
    }
    ```
  </Step>
</Steps>

### 5. `FundModal` component

Finally, you are ready to add the `FundModal` component to your app.

<Steps titleSize="p">
  <Step title="Create fetchBuyOptions and fetchBuyQuote">
    The `FundModal` component requires `fetchBuyOptions` and `fetchBuyQuote` props, which are functions that handle calling the Onramp API via your new server-side endpoints.

    ```tsx lines expandable lib/onramp-api.ts theme={null}
    import {
      type FetchBuyOptions,
      type FetchBuyQuote,
    } from "@coinbase/cdp-react/components/Fund";

    /**
     * Fetches available buy options for onramp
     *
     * @param params - Query parameters for buy options
     * @returns Buy options including payment currencies and purchasable assets
     */
    export const getBuyOptions: FetchBuyOptions = async params => {
      const queryParams = new URLSearchParams();
      queryParams.append("country", params.country);
      if (params?.subdivision) queryParams.append("subdivision", params.subdivision);

      const queryString = queryParams.toString();
      const url = `/api/onramp/buy-options${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch buy options");
      }

      return await response.json();
    };

    /**
     * Creates a buy quote for onramp purchase
     *
     * @param request - Buy quote request parameters
     * @returns Buy quote with fees and onramp URL
     */
    export const createBuyQuote: FetchBuyQuote = async request => {
      const response = await fetch("/api/onramp/buy-quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create buy quote");
      }

      return await response.json();
    };
    ```
  </Step>

  <Step title="Render FundModal">
    ```tsx lines expandable components/FundWallet.tsx theme={null}
    "use client";

    import {
      FundModal,
      type FundModalProps,
    } from "@coinbase/cdp-react";
    import { useEvmAddress } from "@coinbase/cdp-hooks";
    import { useCallback } from "react";

    import { getBuyOptions, createBuyQuote } from "@/lib/onramp-api";

    /**
     * A component that wraps the FundModal component
     *
     * @param props - The props for the FundWallet component
     * @param props.onSuccess - The callback function to call when the onramp purchase is successful
     * @returns The FundWallet component
     */
    export default function FundWallet({ onSuccess }: { onSuccess: () => void }) {
      const { evmAddress } = useEvmAddress();

      // Get the user's location (i.e. from IP geolocation)
      const userCountry = "US";

      // If user is in the US, the state is also required
      const userSubdivision = userCountry === "US" ? "CA" : undefined;

      // Call your buy quote endpoint
      const fetchBuyQuote: FundModalProps["fetchBuyQuote"] = useCallback(async params => {
        return createBuyQuote(params);
      }, []);

      // Call your buy options endpoint
      const fetchBuyOptions: FundModalProps["fetchBuyOptions"] = useCallback(async params => {
        return getBuyOptions(params);
      }, []);

      return (
        <FundModal
          country={userCountry}
          subdivision={userSubdivision}
          cryptoCurrency="eth"
          fiatCurrency="usd"
          fetchBuyQuote={fetchBuyQuote}
          fetchBuyOptions={fetchBuyOptions}
          network="base"
          presetAmountInputs={[10, 25, 50]}
          onSuccess={onSuccess}
          destinationAddress={evmAddress}
        />
      );
    }
    ```
  </Step>
</Steps>

<Accordion title="Funding a Solana wallet with FundModal">
  You may fund your Solana embedded wallets using the same FundModal as in the EVM example above.
  Just pass in the appropriate values for the `cryptoCurrency`, `network`, and `destinationAddress` props.

  ```tsx lines expandable components/FundSolanaWallet.tsx theme={null}
  "use client";

  import {
    FundModal,
    type FundModalProps,
  } from "@coinbase/cdp-react";
  import { useSolanaAddress } from "@coinbase/cdp-hooks";
  import { useCallback } from "react";

  import { getBuyOptions, createBuyQuote } from "@/lib/onramp-api";

  /**
   * A component that wraps the FundModal component
   *
   * @param props - The props for the FundWallet component
   * @param props.onSuccess - The callback function to call when the onramp purchase is successful
   * @returns The FundWallet component
   */
  export default function FundWallet({ onSuccess }: { onSuccess: () => void }) {
    const { solanaAddress } = useSolanaAddress();

    // Get the user's location (i.e. from IP geolocation)
    const userCountry = "US";

    // If user is in the US, the state is also required
    const userSubdivision = userCountry === "US" ? "CA" : undefined;

    // Call your buy quote endpoint
    const fetchBuyQuote: FundModalProps["fetchBuyQuote"] = useCallback(async params => {
      return createBuyQuote(params);
    }, []);

    // Call your buy options endpoint
    const fetchBuyOptions: FundModalProps["fetchBuyOptions"] = useCallback(async params => {
      return getBuyOptions(params);
    }, []);

    return (
      <FundModal
        country={userCountry}
        subdivision={userSubdivision}
        cryptoCurrency="sol"
        fiatCurrency="usd"
        fetchBuyQuote={fetchBuyQuote}
        fetchBuyOptions={fetchBuyOptions}
        network="solana"
        presetAmountInputs={[10, 25, 50]}
        onSuccess={onSuccess}
        destinationAddress={solanaAddress}
      />
    );
  }
  ```
</Accordion>
