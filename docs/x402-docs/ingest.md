(Files content cropped to 300k characters, download full ingest to see more)
================================================
FILE: typescript/eslint.config.js
================================================
import js from '@eslint/js'
import ts from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      ...ts.configs.recommended.rules,
    },
  },
  js.configs.recommended,
]



================================================
FILE: typescript/package.json
================================================
{
  "name": "x402_monorepo",
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=10.7.0"
  },
  "packageManager": "pnpm@10.7.0",
  "private": "true",
  "version": "0.0.2",
  "description": "x402 Payment Protocol Monorepo",
  "main": "index.js",
  "scripts": {
    "build": "turbo run build",
    "lint": "turbo run lint",
    "format": "turbo run format",
    "lint:check": "turbo run lint:check",
    "format:check": "turbo run format:check",
    "test": "turbo run test"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "tsup": "^8.4.0",
    "turbo": "^2.5.0",
    "typescript": "^5.8.3"
  }
}


================================================
FILE: typescript/pnpm-workspace.yaml
================================================
packages:
  - packages/*
  - examples/facilitator
  - examples/**/*
  - site
ignoredBuiltDependencies:
  - esbuild



================================================
FILE: typescript/tsconfig.base.json
================================================
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": [
      "ES2020"
    ],
    "moduleResolution": "bundler",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}


================================================
FILE: typescript/turbo.json
================================================
{
  "$schema": "https://turborepo.org/schema.json",
  "tasks": {
    "build": {
      "dependsOn": [
        "^build"
      ],
      "outputs": [
        "dist/**"
      ]
    },
    "test": {
      "dependsOn": [
        "build"
      ],
      "inputs": [
        "src/**/*.ts",
        "test/**/*.ts"
      ]
    },
    "lint": {
      "dependsOn": [
        "^lint"
      ],
      "outputs": []
    },
    "lint:check": {
      "dependsOn": [
        "^lint:check"
      ],
      "outputs": []
    },
    "format": {
      "dependsOn": [
        "^format"
      ],
      "outputs": []
    },
    "format:check": {
      "dependsOn": [
        "^format:check"
      ],
      "outputs": []
    }
  }
}


================================================
FILE: typescript/.prettierignore
================================================
docs/
dist/
node_modules/
coverage/
.github/
src/client
**/**/*.json
*.md


================================================
FILE: typescript/.prettierrc
================================================
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100
}



================================================
FILE: typescript/packages/coinbase-x402/README.md
================================================
# @coinbase/x402

The official Coinbase facilitator package for the x402 Payment Protocol. This package provides direct access to Coinbase's hosted facilitator service, enabling seamless payment verification and settlement.

## Installation

```bash
npm install @coinbase/x402
```

## Environment Variables

This package requires CDP API keys from the [Coinbase Developer Platform](https://www.coinbase.com/developer-platform):

- `CDP_API_KEY_ID`: Your CDP API key ID
- `CDP_API_KEY_SECRET`: Your CDP API key secret

## Quick Start

```typescript
// Option 1: Import the default facilitator config (assumes CDP_API_KEY_ID and CDP_API_KEY_SECRET environment variables)
import { facilitator } from "@coinbase/x402";

// Option 2: Create a custom facilitator config, passing in your credentials
import { createFacilitatorConfig } from "@coinbase/x402";

const facilitator = createFacilitatorConfig(
  "your-cdp-api-key-id",
  "your-cdp-api-key-secret"
);

// Use the facilitator config in your x402 integration
```

## Integration Examples

### With Express Middleware

```typescript
import express from "express";
import { paymentMiddleware } from "x402-express";
import { facilitator } from "@coinbase/x402";

const app = express();

app.use(paymentMiddleware(
  "0xYourAddress",
  {
    "/protected": {
      price: "$0.10",
      network: "base-sepolia"
    }
  },
  facilitator // Use Coinbase's facilitator
));
```



================================================
FILE: typescript/packages/coinbase-x402/eslint.config.js
================================================
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: 2020,
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        Buffer: "readonly",
        Headers: "readonly",
        exports: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      prettier: prettier,
      jsdoc: jsdoc,
      import: importPlugin,
    },
    rules: {
      ...ts.configs.recommended.rules,
      "import/first": "error",
      "prettier/prettier": "error",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_$" }],
      "jsdoc/tag-lines": ["error", "any", { startLines: 1 }],
      "jsdoc/check-alignment": "error",
      "jsdoc/no-undefined-types": "off",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/implements-on-classes": "error",
      "jsdoc/require-description": "error",
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-hyphen-before-param-description": ["error", "always"],
    },
  },
];



================================================
FILE: typescript/packages/coinbase-x402/package.json
================================================
{
  "name": "@coinbase/x402",
  "version": "0.5.1",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "start": "tsx --env-file=.env index.ts",
    "build": "tsup",
    "watch": "tsc --watch",
    "format": "prettier -c .prettierrc --write \"**/*.{ts,js,cjs,json,md}\"",
    "format:check": "prettier -c .prettierrc --check \"**/*.{ts,js,cjs,json,md}\"",
    "lint": "eslint . --ext .ts --fix",
    "lint:check": "eslint . --ext .ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "postinstall": "node scripts/postinstall.js"
  },
  "keywords": [],
  "license": "Apache-2.0",
  "author": "Coinbase Inc.",
  "repository": "https://github.com/coinbase/x402",
  "description": "x402 Payment Protocol",
  "devDependencies": {
    "@eslint/js": "^9.24.0",
    "@types/node": "^22.13.4",
    "@typescript-eslint/eslint-plugin": "^8.29.1",
    "@typescript-eslint/parser": "^8.29.1",
    "eslint": "^9.24.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-jsdoc": "^50.6.9",
    "eslint-plugin-prettier": "^5.2.6",
    "prettier": "3.5.2",
    "tsup": "^8.4.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite": "^6.2.6",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.0.5"
  },
  "dependencies": {
    "@coinbase/cdp-sdk": "^1.29.0",
    "viem": "^2.21.26",
    "x402": "workspace:^",
    "zod": "^3.24.2"
  },
  "exports": {
    ".": {
      "import": {
        "types": "./dist/esm/index.d.mts",
        "default": "./dist/esm/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/index.d.ts",
        "default": "./dist/cjs/index.js"
      }
    }
  },
  "files": [
    "dist",
    "scripts"
  ]
}



================================================
FILE: typescript/packages/coinbase-x402/tsconfig.json
================================================
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "allowJs": false,
    "checkJs": false
  },
  "include": ["src"]
}



================================================
FILE: typescript/packages/coinbase-x402/tsup.config.ts
================================================
import { defineConfig } from "tsup";

const baseConfig = {
  entry: {
    index: "src/index.ts",
  },
  dts: {
    resolve: true,
  },
  sourcemap: true,
  target: "node16",
};

export default defineConfig([
  {
    ...baseConfig,
    format: "esm",
    outDir: "dist/esm",
    clean: true,
  },
  {
    ...baseConfig,
    format: "cjs",
    outDir: "dist/cjs",
    clean: false,
  },
]);



================================================
FILE: typescript/packages/coinbase-x402/vitest.config.ts
================================================
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
  },
  plugins: [tsconfigPaths({ projects: ["."] })],
}));



================================================
FILE: typescript/packages/coinbase-x402/.prettierignore
================================================
docs/
dist/
node_modules/
coverage/
.github/
src/client
**/**/*.json
*.md


================================================
FILE: typescript/packages/coinbase-x402/.prettierrc
================================================
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "printWidth": 100,
  "proseWrap": "never"
}



================================================
FILE: typescript/packages/coinbase-x402/scripts/postinstall.js
================================================
console.log(`\x1b[33m⚠️  NOTICE:\x1b[0m
By taking steps to use the search functionality within the x402 Bazaar, you agree to the CDP TOS and that the x402 Bazaar is provided AS-IS.
CDP TOS: (https://www.coinbase.com/legal/developer-platform/terms-of-service)
The endpoints have not been reviewed by Coinbase, so please ensure that you trust them prior to sending funds.`);



================================================
FILE: typescript/packages/coinbase-x402/src/index.test.ts
================================================
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Import after mocking
import { createCdpAuthHeaders, createFacilitatorConfig } from "./index";

vi.mock("@coinbase/cdp-sdk/auth", () => ({
  generateJwt: vi.fn().mockResolvedValue("mock-jwt-token"),
}));

vi.mock("./index", async () => {
  const mockHeaders = {
    verify: {
      Authorization: "Bearer mock-jwt-token",
      "Correlation-Context": "correlation-header",
    },
    settle: {
      Authorization: "Bearer mock-jwt-token",
      "Correlation-Context": "correlation-header",
    },
  };

  const createHeadersFn = (apiKeyId?: string, apiKeySecret?: string) => {
    return async () => {
      // Keep original error behavior when keys are missing
      if (
        !apiKeyId &&
        !apiKeySecret &&
        !process.env.CDP_API_KEY_ID &&
        !process.env.CDP_API_KEY_SECRET
      ) {
        throw new Error(
          "Missing environment variables: CDP_API_KEY_ID and CDP_API_KEY_SECRET must be set when using default facilitator",
        );
      }
      return mockHeaders;
    };
  };

  const actual = (await vi.importActual("./index")) as object;
  return {
    ...actual,
    createCdpAuthHeaders: vi.fn().mockImplementation(createHeadersFn),
    createAuthHeader: vi.fn().mockResolvedValue("Bearer mock-jwt-token"),
    createCorrelationHeader: vi.fn().mockReturnValue("correlation-header"),
  };
});

describe("coinbase-x402", () => {
  const mockApiKeyId = "test-api-key-id";
  const mockApiKeySecret = "test-api-key-secret";

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CDP_API_KEY_ID = mockApiKeyId;
    process.env.CDP_API_KEY_SECRET = mockApiKeySecret;
  });

  afterEach(() => {
    delete process.env.CDP_API_KEY_ID;
    delete process.env.CDP_API_KEY_SECRET;
  });

  describe("createCdpAuthHeaders", () => {
    it("should create auth headers using provided API keys", async () => {
      const createHeaders = createCdpAuthHeaders(mockApiKeyId, mockApiKeySecret);
      const headers = await createHeaders();

      expect(headers.verify.Authorization).toBe("Bearer mock-jwt-token");
      expect(headers.settle.Authorization).toBe("Bearer mock-jwt-token");
      expect(headers.verify["Correlation-Context"]).toBe("correlation-header");
      expect(headers.settle["Correlation-Context"]).toBe("correlation-header");
    });

    it("should create auth headers using environment variables when no API keys provided", async () => {
      const createHeaders = createCdpAuthHeaders();
      const headers = await createHeaders();

      expect(headers.verify.Authorization).toBe("Bearer mock-jwt-token");
      expect(headers.settle.Authorization).toBe("Bearer mock-jwt-token");
      expect(headers.verify["Correlation-Context"]).toBe("correlation-header");
      expect(headers.settle["Correlation-Context"]).toBe("correlation-header");
    });

    it("should throw error when API keys are missing", async () => {
      delete process.env.CDP_API_KEY_ID;
      delete process.env.CDP_API_KEY_SECRET;

      const createHeaders = createCdpAuthHeaders();
      await expect(createHeaders()).rejects.toThrow(
        "Missing environment variables: CDP_API_KEY_ID and CDP_API_KEY_SECRET must be set when using default facilitator",
      );
    });
  });

  describe("createFacilitatorConfig", () => {
    it("should create facilitator config with provided API keys", () => {
      const config = createFacilitatorConfig(mockApiKeyId, mockApiKeySecret);

      expect(config.url).toBe("https://api.cdp.coinbase.com/platform/v2/x402");
      expect(config.createAuthHeaders).toBeDefined();
    });

    it("should create facilitator config using environment variables when no API keys provided", () => {
      const config = createFacilitatorConfig();

      expect(config.url).toBe("https://api.cdp.coinbase.com/platform/v2/x402");
      expect(config.createAuthHeaders).toBeDefined();
    });

    it("should create default facilitator config", () => {
      const config = createFacilitatorConfig();

      expect(config.url).toBe("https://api.cdp.coinbase.com/platform/v2/x402");
      expect(config.createAuthHeaders).toBeDefined();
    });
  });
});



================================================
FILE: typescript/packages/coinbase-x402/src/index.ts
================================================
import { generateJwt } from "@coinbase/cdp-sdk/auth";
import { FacilitatorConfig } from "x402/types";
import { CreateHeaders } from "x402/verify";

const COINBASE_FACILITATOR_BASE_URL = "https://api.cdp.coinbase.com";
const COINBASE_FACILITATOR_V2_ROUTE = "/platform/v2/x402";

const X402_SDK_VERSION = "0.5.1";
const CDP_SDK_VERSION = "1.29.0";

/**
 * Creates an authorization header for a request to the Coinbase API.
 *
 * @param apiKeyId - The api key ID
 * @param apiKeySecret - The api key secret
 * @param requestMethod - The method for the request (e.g. 'POST')
 * @param requestHost - The host for the request (e.g. 'https://x402.org/facilitator')
 * @param requestPath - The path for the request (e.g. '/verify')
 * @returns The authorization header string
 */
export async function createAuthHeader(
  apiKeyId: string,
  apiKeySecret: string,
  requestMethod: string,
  requestHost: string,
  requestPath: string,
) {
  const jwt = await generateJwt({
    apiKeyId,
    apiKeySecret,
    requestMethod,
    requestHost,
    requestPath,
  });
  return `Bearer ${jwt}`;
}

/**
 * Creates a correlation header for a request to the Coinbase API.
 *
 * @returns The correlation header string
 */
export function createCorrelationHeader(): string {
  const data: Record<string, string> = {
    sdk_version: CDP_SDK_VERSION,
    sdk_language: "typescript",
    source: "x402",
    source_version: X402_SDK_VERSION,
  };
  return Object.keys(data)
    .map(key => `${key}=${encodeURIComponent(data[key])}`)
    .join(",");
}

/**
 * Creates a CDP auth header for the facilitator service
 *
 * @param apiKeyId - The CDP API key ID
 * @param apiKeySecret - The CDP API key secret
 * @returns A function that returns the auth headers
 */
export function createCdpAuthHeaders(apiKeyId?: string, apiKeySecret?: string): CreateHeaders {
  const requestHost = COINBASE_FACILITATOR_BASE_URL.replace("https://", "");

  return async () => {
    apiKeyId = apiKeyId ?? process.env.CDP_API_KEY_ID;
    apiKeySecret = apiKeySecret ?? process.env.CDP_API_KEY_SECRET;

    if (!apiKeyId || !apiKeySecret) {
      throw new Error(
        "Missing environment variables: CDP_API_KEY_ID and CDP_API_KEY_SECRET must be set when using default facilitator",
      );
    }

    return {
      verify: {
        Authorization: await createAuthHeader(
          apiKeyId,
          apiKeySecret,
          "POST",
          requestHost,
          `${COINBASE_FACILITATOR_V2_ROUTE}/verify`,
        ),
        "Correlation-Context": createCorrelationHeader(),
      },
      settle: {
        Authorization: await createAuthHeader(
          apiKeyId,
          apiKeySecret,
          "POST",
          requestHost,
          `${COINBASE_FACILITATOR_V2_ROUTE}/settle`,
        ),
        "Correlation-Context": createCorrelationHeader(),
      },
      list: {
        Authorization: await createAuthHeader(
          apiKeyId,
          apiKeySecret,
          "GET",
          requestHost,
          `${COINBASE_FACILITATOR_V2_ROUTE}/discovery/resources`,
        ),
        "Correlation-Context": createCorrelationHeader(),
      },
    };
  };
}

/**
 * Creates a facilitator config for the Coinbase X402 facilitator
 *
 * @param apiKeyId - The CDP API key ID
 * @param apiKeySecret - The CDP API key secret
 * @returns A facilitator config
 */
export function createFacilitatorConfig(
  apiKeyId?: string,
  apiKeySecret?: string,
): FacilitatorConfig {
  return {
    url: `${COINBASE_FACILITATOR_BASE_URL}${COINBASE_FACILITATOR_V2_ROUTE}`,
    createAuthHeaders: createCdpAuthHeaders(apiKeyId, apiKeySecret),
  };
}

export const facilitator = createFacilitatorConfig();



================================================
FILE: typescript/packages/x402/README.md
================================================
# x402

Core TypeScript implementation of the x402 Payment Protocol. This package provides the foundational types, schemas, and utilities that power all x402 integrations.

## Installation

```bash
npm install x402
```

## Overview

The x402 package provides the core building blocks for implementing the x402 Payment Protocol in TypeScript. It's designed to be used by:

- Middleware implementations (Express, Hono, Next.js)
- Client-side payment handlers (fetch wrapper)
- Facilitator services
- Custom integrations

## Integration Packages

This core package is used by the following integration packages:

- `x402-express`: Express.js middleware
- `x402-hono`: Hono middleware
- `x402-next`: Next.js middleware
- `x402-fetch`: Fetch API wrapper
- `x402-axios`: Axios interceptor

## Manual Server Integration

If you're not using one of our server middleware packages, you can implement the x402 protocol manually. Here's what you'll need to handle:

1. Return 402 error responses with the appropriate response body
2. Use the facilitator to validate payments
3. Use the facilitator to settle payments
4. Return the appropriate response header to the caller

For a complete example implementation, see our [advanced server example](https://github.com/coinbase/x402/tree/main/examples/typescript/servers/advanced) which demonstrates both synchronous and asynchronous payment processing patterns.

## Manual Client Integration

If you're not using our `x402-fetch` or `x402-axios` packages, you can manually integrate the x402 protocol in your client application. Here's how:

1. Make a request to a x402-protected endpoint. The server will respond with a 402 status code and a JSON object containing:
   - `x402Version`: The version of the x402 protocol being used
   - `accepts`: An array of payment requirements you can fulfill

2. Select the payment requirement you wish to fulfill from the `accepts` array

3. Create the payment header using the selected payment requirement

4. Retry your network call with:
   - The payment header assigned to the `X-PAYMENT` field
   - The `Access-Control-Expose-Headers` field set to `"X-PAYMENT-RESPONSE"` to receive the server's transaction response

For implementation examples, we recommend reviewing our official client packages:
- [x402-fetch implementation](https://github.com/coinbase/x402/blob/main/typescript/packages/x402-fetch/src/index.ts)
- [x402-axios implementation](https://github.com/coinbase/x402/blob/main/typescript/packages/x402-axios/src/index.ts)




================================================
FILE: typescript/packages/x402/eslint.config.js
================================================
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["dist/**", "node_modules/**", "src/paywall/dist/**", "src/paywall/gen/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: 2020,
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        Buffer: "readonly",
        exports: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      prettier: prettier,
      jsdoc: jsdoc,
      import: importPlugin,
    },
    rules: {
      ...ts.configs.recommended.rules,
      "import/first": "error",
      "prettier/prettier": "error",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_$" }],
      "jsdoc/tag-lines": ["error", "any", { startLines: 1 }],
      "jsdoc/check-alignment": "error",
      "jsdoc/no-undefined-types": "off",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/implements-on-classes": "error",
      "jsdoc/require-description": "error",
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-hyphen-before-param-description": ["error", "always"],
    },
  },
];



================================================
FILE: typescript/packages/x402/package.json
================================================
{
  "name": "x402",
  "version": "0.5.3",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "start": "tsx --env-file=.env index.ts",
    "build": "tsup",
    "build:paywall": "tsx src/paywall/build.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "watch": "tsc --watch",
    "format": "prettier -c .prettierrc --write \"**/*.{ts,js,cjs,json,md}\"",
    "format:check": "prettier -c .prettierrc --check \"**/*.{ts,js,cjs,json,md}\"",
    "lint": "eslint . --ext .ts --fix",
    "lint:check": "eslint . --ext .ts"
  },
  "keywords": [],
  "license": "Apache-2.0",
  "author": "Coinbase Inc.",
  "repository": "https://github.com/coinbase/x402",
  "description": "x402 Payment Protocol",
  "devDependencies": {
    "@coinbase/onchainkit": "^0.38.14",
    "@craftamap/esbuild-plugin-html": "^0.9.0",
    "@eslint/js": "^9.24.0",
    "@types/node": "^22.13.4",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@typescript-eslint/eslint-plugin": "^8.29.1",
    "@typescript-eslint/parser": "^8.29.1",
    "@wagmi/connectors": "^5.8.1",
    "@wagmi/core": "^2.17.1",
    "buffer": "^6.0.3",
    "esbuild": "^0.25.4",
    "eslint": "^9.24.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-jsdoc": "^50.6.9",
    "eslint-plugin-prettier": "^5.2.6",
    "prettier": "3.5.2",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tsup": "^8.4.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "viem": "^2.21.26",
    "vite": "^6.2.6",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.0.5"
  },
  "dependencies": {
    "viem": "^2.21.26",
    "wagmi": "^2.15.6",
    "zod": "^3.24.2"
  },
  "exports": {
    "./shared": {
      "import": {
        "types": "./dist/esm/shared/index.d.mts",
        "default": "./dist/esm/shared/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/shared/index.d.ts",
        "default": "./dist/cjs/shared/index.js"
      }
    },
    "./shared/evm": {
      "import": {
        "types": "./dist/esm/shared/evm/index.d.mts",
        "default": "./dist/esm/shared/evm/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/shared/evm/index.d.ts",
        "default": "./dist/cjs/shared/evm/index.js"
      }
    },
    "./schemes": {
      "import": {
        "types": "./dist/esm/schemes/index.d.mts",
        "default": "./dist/esm/schemes/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/schemes/index.d.ts",
        "default": "./dist/cjs/schemes/index.js"
      }
    },
    "./client": {
      "import": {
        "types": "./dist/esm/client/index.d.mts",
        "default": "./dist/esm/client/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/client/index.d.ts",
        "default": "./dist/cjs/client/index.js"
      }
    },
    "./verify": {
      "import": {
        "types": "./dist/esm/verify/index.d.mts",
        "default": "./dist/esm/verify/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/verify/index.d.ts",
        "default": "./dist/cjs/verify/index.js"
      }
    },
    "./facilitator": {
      "import": {
        "types": "./dist/esm/facilitator/index.d.mts",
        "default": "./dist/esm/facilitator/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/facilitator/index.d.ts",
        "default": "./dist/cjs/facilitator/index.js"
      }
    },
    "./types": {
      "import": {
        "types": "./dist/esm/types/index.d.mts",
        "default": "./dist/esm/types/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/types/index.d.ts",
        "default": "./dist/cjs/types/index.js"
      }
    }
  },
  "files": [
    "dist"
  ]
}



================================================
FILE: typescript/packages/x402/tsconfig.json
================================================
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "lib": ["ES2020", "DOM", "dom.iterable", "esnext"],
    "allowJs": false,
    "checkJs": false,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}



================================================
FILE: typescript/packages/x402/tsup.config.ts
================================================
import { defineConfig } from "tsup";

const baseConfig = {
  entry: {
    index: "src/index.ts",
    "shared/index": "src/shared/index.ts",
    "shared/evm/index": "src/shared/evm/index.ts",
    "schemes/index": "src/schemes/index.ts",
    "client/index": "src/client/index.ts",
    "verify/index": "src/verify/index.ts",
    "facilitator/index": "src/facilitator/index.ts",
    "types/index": "src/types/index.ts",
  },
  dts: {
    resolve: true,
  },
  sourcemap: true,
  target: "es2020",
};

export default defineConfig([
  {
    ...baseConfig,
    format: "esm",
    outDir: "dist/esm",
    clean: true,
  },
  {
    ...baseConfig,
    format: "cjs",
    outDir: "dist/cjs",
    clean: false,
  },
]);



================================================
FILE: typescript/packages/x402/vitest.config.ts
================================================
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
  },
  plugins: [tsconfigPaths({ projects: ["."] })],
}));



================================================
FILE: typescript/packages/x402/.prettierignore
================================================
docs/
dist/
node_modules/
coverage/
.github/
src/client
**/**/*.json
*.md


================================================
FILE: typescript/packages/x402/.prettierrc
================================================
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "printWidth": 100,
  "proseWrap": "never"
}



================================================
FILE: typescript/packages/x402/src/index.ts
================================================
export * from "./client";
export * from "./facilitator";

export const x402Version = 1;



================================================
FILE: typescript/packages/x402/src/client/createPaymentHeader.ts
================================================
import { LocalAccount } from "viem";
import { createPaymentHeader as createPaymentHeaderExactEVM } from "../schemes/exact/evm/client";
import { SupportedEVMNetworks } from "../types/shared";
import { SignerWallet } from "../types/shared/evm";
import { PaymentRequirements } from "../types/verify";

/**
 * Creates a payment header based on the provided client and payment requirements.
 * 
 * @param client - The signer wallet instance used to create the payment header
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns A promise that resolves to the created payment header string
 */
export async function createPaymentHeader(
  client: SignerWallet | LocalAccount,
  x402Version: number,
  paymentRequirements: PaymentRequirements,
): Promise<string> {
  if (
    paymentRequirements.scheme === "exact" &&
    SupportedEVMNetworks.includes(paymentRequirements.network)
  ) {
    return await createPaymentHeaderExactEVM(client, x402Version, paymentRequirements);
  }

  throw new Error("Unsupported scheme");
}


================================================
FILE: typescript/packages/x402/src/client/index.ts
================================================
export * from "./createPaymentHeader";
export * from "./preparePaymentHeader";
export * from "./selectPaymentRequirements";
export * from "./signPaymentHeader";


================================================
FILE: typescript/packages/x402/src/client/preparePaymentHeader.ts
================================================
import { Address } from "viem";
import { preparePaymentHeader as preparePaymentHeaderExactEVM } from "../schemes/exact/evm/client";
import { SupportedEVMNetworks } from "../types/shared";
import { PaymentRequirements, UnsignedPaymentPayload } from "../types/verify";

/**
 * Prepares a payment header with the given sender address and payment requirements.
 *
 * @param from - The sender's address from which the payment will be made
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns An unsigned payment payload that can be used to create a payment header
 */
export function preparePaymentHeader(
  from: Address,
  x402Version: number,
  paymentRequirements: PaymentRequirements,
): UnsignedPaymentPayload {
  if (
    paymentRequirements.scheme === "exact" &&
    SupportedEVMNetworks.includes(paymentRequirements.network)
  ) {
    return preparePaymentHeaderExactEVM(from, x402Version, paymentRequirements);
  }

  throw new Error("Unsupported scheme");
}



================================================
FILE: typescript/packages/x402/src/client/selectPaymentRequirements.ts
================================================
import { Network, PaymentRequirements } from "../types";
import { getUsdcChainConfigForChain } from "../shared/evm";
import { getNetworkId } from "../shared/network";

/**
 * Default selector for payment requirements.
 * Default behavior is to select the first payment requirement that has a USDC asset.
 * If no USDC payment requirement is found, the first payment requirement is selected.
 *
 * @param paymentRequirements - The payment requirements to select from.
 * @param network - The network to check against. If not provided, the network will not be checked.
 * @param scheme - The scheme to check against. If not provided, the scheme will not be checked.
 * @returns The payment requirement that is the most appropriate for the user.
 */
export function selectPaymentRequirements(paymentRequirements: PaymentRequirements[], network?: Network, scheme?: "exact"): PaymentRequirements {
  // Sort `base` payment requirements to the front of the list. This is to ensure that base is preferred if available.
  paymentRequirements.sort((a, b) => {
    if (a.network === "base" && b.network !== "base") {
      return -1;
    }
    if (a.network !== "base" && b.network === "base") {
      return 1;
    }
    return 0;
  });

  // Filter down to the scheme/network if provided
  const broadlyAcceptedPaymentRequirements = paymentRequirements.filter(requirement => {
    // If the scheme is not provided, we accept any scheme.
    const isExpectedScheme = !scheme || requirement.scheme === scheme;
    // If the chain is not provided, we accept any chain.
    const isExpectedChain = !network || network == requirement.network;

    return isExpectedScheme && isExpectedChain;
  });

  // Filter down to USDC requirements
  const usdcRequirements = broadlyAcceptedPaymentRequirements.filter(requirement => {
    // If the address is a USDC address, we return it.
    return requirement.asset === getUsdcChainConfigForChain(getNetworkId(requirement.network))?.usdcAddress;
  });

  // Prioritize USDC requirements if available
  if (usdcRequirements.length > 0) {
    return usdcRequirements[0];
  }

  // If no USDC requirements are found, return the first broadly accepted requirement.
  if (broadlyAcceptedPaymentRequirements.length > 0) {
    return broadlyAcceptedPaymentRequirements[0];
  }

  // If no matching requirements are found, return the first requirement.
  return paymentRequirements[0];
}

/**
 * Selector for payment requirements.
 *
 * @param paymentRequirements - The payment requirements to select from.
 * @param network - The network to check against. If not provided, the network will not be checked.
 * @param scheme - The scheme to check against. If not provided, the scheme will not be checked.
 * @returns The payment requirement that is the most appropriate for the user.
 */
export type PaymentRequirementsSelector = (paymentRequirements: PaymentRequirements[], network?: Network, scheme?: "exact") => PaymentRequirements;



================================================
FILE: typescript/packages/x402/src/client/signPaymentHeader.ts
================================================
import { signPaymentHeader as signPaymentHeaderExactEVM } from "../schemes/exact/evm/client";
import { encodePayment } from "../schemes/exact/evm/utils/paymentUtils";
import { SupportedEVMNetworks } from "../types/shared";
import { SignerWallet } from "../types/shared/evm";
import { PaymentRequirements, UnsignedPaymentPayload } from "../types/verify";

/**
 * Signs a payment header using the provided client and payment requirements.
 * 
 * @param client - The signer wallet instance used to sign the payment header
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @param unsignedPaymentHeader - The unsigned payment payload to be signed
 * @returns A promise that resolves to the encoded signed payment header string
 */
export async function signPaymentHeader(
  client: SignerWallet,
  paymentRequirements: PaymentRequirements,
  unsignedPaymentHeader: UnsignedPaymentPayload,
): Promise<string> {
  if (
    paymentRequirements.scheme === "exact" &&
    SupportedEVMNetworks.includes(paymentRequirements.network)
  ) {
    const signedPaymentHeader = await signPaymentHeaderExactEVM(client, paymentRequirements, unsignedPaymentHeader);
    return encodePayment(signedPaymentHeader);
  }

  throw new Error("Unsupported scheme");
}


================================================
FILE: typescript/packages/x402/src/facilitator/facilitator.ts
================================================
import { verify as verifyExact, settle as settleExact } from "../schemes/exact/evm";
import { SupportedEVMNetworks } from "../types/shared";
import { ConnectedClient, SignerWallet } from "../types/shared/evm";
import {
  PaymentPayload,
  PaymentRequirements,
  SettleResponse,
  VerifyResponse,
} from "../types/verify";
import { Chain, Transport, Account } from "viem";

/**
 * Verifies a payment payload against the required payment details regardless of the scheme
 * this function wraps all verify functions for each specific scheme
 *
 * @param client - The public client used for blockchain interactions
 * @param payload - The signed payment payload containing transfer parameters and signature
 * @param paymentRequirements - The payment requirements that the payload must satisfy
 * @returns A ValidPaymentRequest indicating if the payment is valid and any invalidation reason
 */
export async function verify<
  transport extends Transport,
  chain extends Chain,
  account extends Account | undefined,
>(
  client: ConnectedClient<transport, chain, account>,
  payload: PaymentPayload,
  paymentRequirements: PaymentRequirements,
): Promise<VerifyResponse> {
  if (
    paymentRequirements.scheme == "exact" &&
    SupportedEVMNetworks.includes(paymentRequirements.network)
  ) {
    const valid = await verifyExact(client, payload, paymentRequirements);
    return valid;
  }
  return {
    isValid: false,
    invalidReason: "invalid_scheme",
    payer: payload.payload.authorization.from,
  };
}

/**
 * Settles a payment payload against the required payment details regardless of the scheme
 * this function wraps all settle functions for each specific scheme
 *
 * @param client - The signer wallet used for blockchain interactions
 * @param payload - The signed payment payload containing transfer parameters and signature
 * @param paymentRequirements - The payment requirements that the payload must satisfy
 * @returns A SettleResponse indicating if the payment is settled and any settlement reason
 */
export async function settle<transport extends Transport, chain extends Chain>(
  client: SignerWallet<chain, transport>,
  payload: PaymentPayload,
  paymentRequirements: PaymentRequirements,
): Promise<SettleResponse> {
  if (
    paymentRequirements.scheme == "exact" &&
    SupportedEVMNetworks.includes(paymentRequirements.network)
  ) {
    return settleExact(client, payload, paymentRequirements);
  }

  return {
    success: false,
    errorReason: "invalid_scheme",
    transaction: "",
    network: paymentRequirements.network,
    payer: payload.payload.authorization.from,
  };
}

export type Supported = {
  x402Version: number;
  kind: {
    scheme: string;
    networkId: string;
  }[];
};



================================================
FILE: typescript/packages/x402/src/facilitator/index.ts
================================================
export * from "./facilitator";



================================================
FILE: typescript/packages/x402/src/paywall/README.md
================================================
# x402 Paywall

Automatic wallet connection and payment UI for x402 middleware-enabled servers. Handles wallet connection, network switching, balance checking, and payment processing.

```typescript
export const middleware = paymentMiddleware(
  address,
  {
    "/protected": { price: "$0.01" },
  },
  {
    appLogo: "/logos/your-app.png",         // Optional
    appName: "Your App Name",               // Optional
    cdpClientKey: "your-cdp-client-key",    // Optional: Enhanced RPC
  },
);
```

## Features

**Wallet Connection & Payment Processing:** Supports Coinbase Smart Wallet, Coinbase EOA, MetaMask, Phantom, Rabby, Trust Wallet, and Frame. Includes x402 payment processing by default.

**Enhanced RPC** (optional): Add `cdpClientKey` to use Coinbase's hosted RPC infrastructure for improved performance.

## Configuration Options

| Option | Description |
|--------|-------------|
| `appLogo` | Logo URL for wallet selection modal (optional, defaults to no logo) |
| `appName` | App name displayed in wallet selection modal (optional, defaults to "Dapp") |
| `cdpClientKey` | [Coinbase Developer Platform Client API Key](https://docs.cdp.coinbase.com/get-started/docs/cdp-api-keys) for enhanced RPC |


## Usage

The paywall automatically loads when a browser attempts to access a protected route configured in your middleware.

![](../../../../../static/paywall.jpg)



================================================
FILE: typescript/packages/x402/src/paywall/baseTemplate.ts
================================================
// Empty paywall HTML template. Content here is static but can be changed at runtime.
/**
 * Returns a base HTML template for the X402 paywall.
 * This template contains the structure for payment prompts, wallet connection,
 * and transaction details.
 *
 * @returns {string} HTML template string for the paywall
 */
export function getBaseTemplate(): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div id="root"></div>
    </body>
    </html>
  `;
}



================================================
FILE: typescript/packages/x402/src/paywall/buffer-polyfill.ts
================================================
// Inject Buffer polyfill
// Necessary for viem if it's not provided elsewhere, e.g. from a wallet extension

import { Buffer } from "buffer";

globalThis.Buffer = Buffer;



================================================
FILE: typescript/packages/x402/src/paywall/build.ts
================================================
import esbuild from "esbuild";
import { htmlPlugin } from "@craftamap/esbuild-plugin-html";
import fs from "fs";
import path from "path";
import { getBaseTemplate } from "./baseTemplate";

// This file only runs at build time and generates a template HTML file
// Template variables are handled at runtime, not build time

const DIST_DIR = "src/paywall/dist";
const OUTPUT_HTML = path.join(DIST_DIR, "paywall.html");
const OUTPUT_TS = path.join("src/paywall/gen", "template.ts");

// Path to Python package static directory (relative to this TypeScript package)
const PYTHON_DIR = path.join("..", "..", "..", "python", "x402", "src", "x402");
const OUTPUT_PY = path.join(PYTHON_DIR, "template.py");

const options: esbuild.BuildOptions = {
  entryPoints: ["src/paywall/index.tsx", "src/paywall/styles.css"],
  bundle: true,
  metafile: true,
  outdir: DIST_DIR,
  treeShaking: true,
  minify: true, // Use minify for production mode
  format: "iife",
  sourcemap: false,
  platform: "browser",
  target: "es2020",
  jsx: "transform",
  define: {
    "process.env.NODE_ENV": '"development"',
    global: "globalThis",
    Buffer: "globalThis.Buffer",
  },
  mainFields: ["browser", "module", "main"],
  conditions: ["browser"],
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: ["src/paywall/index.tsx", "src/paywall/styles.css"],
          filename: "paywall.html",
          title: "Payment Required",
          scriptLoading: "module",
          inline: {
            css: true,
            js: true,
          },
          htmlTemplate: getBaseTemplate(),
        },
      ],
    }),
  ],
  inject: ["./src/paywall/buffer-polyfill.ts"],
  // Mark problematic dependencies as external
  external: ["crypto"],
};

// Run the build and then create the template.ts file
/**
 * Builds the paywall HTML template with bundled JS and CSS.
 * Creates a TypeScript file containing the template as a constant for runtime use.
 * Copies the generated HTML to the Python package's static directory.
 */
async function build() {
  try {
    // First, make sure the dist directory exists
    if (!fs.existsSync(DIST_DIR)) {
      fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // Make sure gen directory exists too
    const genDir = path.dirname(OUTPUT_TS);
    if (!fs.existsSync(genDir)) {
      fs.mkdirSync(genDir, { recursive: true });
    }

    // Run esbuild to create the bundled HTML
    await esbuild.build(options);
    console.log("Build completed successfully!");

    // Read the generated HTML file
    if (fs.existsSync(OUTPUT_HTML)) {
      const html = fs.readFileSync(OUTPUT_HTML, "utf8");

      // Generate a TypeScript file with the template as a constant
      const tsContent = `// THIS FILE IS AUTO-GENERATED - DO NOT EDIT
/**
 * The pre-built, self-contained paywall template with inlined CSS and JS
 */
export const PAYWALL_TEMPLATE = ${JSON.stringify(html)};
`;

      const pyContent = `PAYWALL_TEMPLATE = ${JSON.stringify(html)}`;

      // Write the template.ts file
      fs.writeFileSync(OUTPUT_TS, tsContent);
      console.log(`Generated template.ts with bundled HTML (${html.length} bytes)`);
      fs.writeFileSync(OUTPUT_PY, pyContent);
      console.log(`Generated template.py with bundled HTML (${html.length} bytes)`);
    } else {
      throw new Error(`Bundled HTML file not found at ${OUTPUT_HTML}`);
    }
  } catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
  }
}

build();



================================================
FILE: typescript/packages/x402/src/paywall/index.tsx
================================================
import { createRoot } from "react-dom/client";
import { Providers } from "./src/Providers";
import { PaywallApp } from "./src/PaywallApp";

// Initialize the app when the window loads
window.addEventListener("load", () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error("Root element not found");
    return;
  }

  const root = createRoot(rootElement);
  root.render(
    <Providers>
      <PaywallApp />
    </Providers>,
  );
});



================================================
FILE: typescript/packages/x402/src/paywall/styles.css
================================================
@import "@coinbase/onchainkit/styles.css";
/* Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

/* Custom Styles */
:root {
  --background-color: #f9fafb;
  --container-background-color: white;
  --text-color: #111827;
  --secondary-text-color: #4b5563;
  --details-background-color: #f9fafb;
  --details-background-color-hover: #f3f4f6;
  --button-primary-color: #2563eb;
  --button-primary-hover-color: #1d4ed8;
  --button-secondary-color: #eef0f3;
  --button-secondary-hover-color: #e9ebee;
  --button-positive-color: #059669;
  --button-positive-hover-color: #047857;
  --button-error-color: #ef4444;
  --button-error-hover-color: #dc2626;
}

.ock-font-family {
  font-family: "Inter", system-ui, -apple-system, sans-serif;
}

.ock-bg-secondary, .ock-bg-default {
  background-color: var(--details-background-color);
  transition: background-color 150ms;
}

.ock-bg-secondary:hover {
  background-color: var(--details-background-color-hover);
}

.opacity-80 {
  opacity: 0.8;
}

[data-testid="ockWalletDropdown"] {
  z-index: 10;
}

body {
  min-height: 100vh;
  background-color: var(--background-color);
  font-family:
    "Inter",
    system-ui,
    -apple-system,
    sans-serif;
}

.container {
  max-width: 32rem;
  margin: 4rem auto;
  padding: 1.5rem;
  background-color: var(--container-background-color);
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--secondary-text-color);
}

.instructions {
  font-size: 0.9rem;
  color: var(--secondary-text-color);
  font-style: italic;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.button {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background-color 150ms;
}

.button-primary {
  background-color: var(--button-primary-color);
  color: white;
}

.button-primary:hover {
  background-color: var(--button-primary-hover-color);
}

.button-secondary {
  background-color: var(--button-secondary-color);
  color: var(--text-color);
}

.button-secondary:hover {
  background-color: var(--button-secondary-hover-color);
}

.button-positive {
  background-color: var(--button-positive-color);
  color: white;
}

.button-positive:hover {
  background-color: var(--button-positive-hover-color);
}

.button-error {
  background-color: var(--button-error-color);
  color: white;
}

.button-error:hover {
  background-color: var(--button-error-hover-color);
}

.payment-details {
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: var(--details-background-color);
  border-radius: 0.5rem;
}

.payment-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.payment-row:last-child {
  margin-bottom: 0;
}

.payment-label {
  color: var(--text-color);
}

.payment-value {
  font-weight: 500;
}

.hidden {
  display: none;
}

.status {
  text-align: center;
  font-size: 0.875rem;
}

.cta-container {
  display: flex;
  flex-basis: 50%;
  flex-direction: row;
  gap: 0.5rem;
}

.balance-button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  min-height: 1rem;
  min-width: 150px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}


================================================
FILE: typescript/packages/x402/src/paywall/src/PaywallApp.tsx
================================================
"use client";

import { FundButton, getOnrampBuyUrl } from "@coinbase/onchainkit/fund";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useCallback, useEffect, useMemo, useState } from "react";
import { createPublicClient, formatUnits, http, publicActions } from "viem";
import { base, baseSepolia } from "viem/chains";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";

import { selectPaymentRequirements } from "../../client";
import { exact } from "../../schemes";
import { getUSDCBalance } from "../../shared/evm";

import { Spinner } from "./Spinner";
import { useOnrampSessionToken } from "./useOnrampSessionToken";
import { ensureValidAmount } from "./utils";

/**
 * Main Paywall App Component
 *
 * @returns The PaywallApp component
 */
export function PaywallApp() {
  const { address, isConnected, chainId: connectedChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { data: wagmiWalletClient } = useWalletClient();
  const { sessionToken } = useOnrampSessionToken(address);

  const [status, setStatus] = useState<string>("");
  const [isCorrectChain, setIsCorrectChain] = useState<boolean | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [formattedUsdcBalance, setFormattedUsdcBalance] = useState<string>("");
  const [hideBalance, setHideBalance] = useState(true);

  const x402 = window.x402;
  const amount = x402.amount || 0;
  const testnet = x402.testnet ?? true;
  const paymentChain = testnet ? baseSepolia : base;
  const chainName = testnet ? "Base Sepolia" : "Base";
  const network = testnet ? "base-sepolia" : "base";
  const showOnramp = Boolean(!testnet && isConnected && x402.sessionTokenEndpoint);

  useEffect(() => {
    if (address) {
      handleSwitchChain();
      checkUSDCBalance();
    }
  }, [address]);

  const publicClient = createPublicClient({
    chain: paymentChain,
    transport: http(),
  }).extend(publicActions);

  const paymentRequirements = x402
    ? selectPaymentRequirements([x402.paymentRequirements].flat(), network, "exact")
    : null;

  useEffect(() => {
    if (isConnected && paymentChain.id === connectedChainId) {
      setIsCorrectChain(true);
      setStatus("");
    } else if (isConnected && paymentChain.id !== connectedChainId) {
      setIsCorrectChain(false);
      setStatus(`On the wrong network. Please switch to ${chainName}.`);
    } else {
      setIsCorrectChain(null);
      setStatus("");
    }
  }, [paymentChain.id, connectedChainId, isConnected]);

  const checkUSDCBalance = useCallback(async () => {
    if (!address) {
      return;
    }
    const balance = await getUSDCBalance(publicClient, address);
    const formattedBalance = formatUnits(balance, 6);
    setFormattedUsdcBalance(formattedBalance);
  }, [address, publicClient]);

  const onrampBuyUrl = useMemo(() => {
    if (!sessionToken) {
      return;
    }
    return getOnrampBuyUrl({
      presetFiatAmount: 2,
      fiatCurrency: "USD",
      sessionToken,
    });
  }, [sessionToken]);

  const handleSuccessfulResponse = useCallback(async (response: Response) => {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("text/html")) {
      document.documentElement.innerHTML = await response.text();
    } else {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.location.href = url;
    }
  }, []);

  const handleSwitchChain = useCallback(async () => {
    if (isCorrectChain) {
      return;
    }

    try {
      setStatus("");
      await switchChainAsync({ chainId: paymentChain.id });
      // Small delay to let wallet settle
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Failed to switch network");
    }
  }, [switchChainAsync, paymentChain, isCorrectChain]);

  const handlePayment = useCallback(async () => {
    if (!address || !x402 || !paymentRequirements) {
      return;
    }

    await handleSwitchChain();

    // Use wagmi's wallet client which has the correct provider for the connected wallet
    // This avoids MetaMask conflicts when multiple wallets are installed
    if (!wagmiWalletClient) {
      setStatus("Wallet client not available. Please reconnect your wallet.");
      return;
    }
    const walletClient = wagmiWalletClient.extend(publicActions);

    setIsPaying(true);

    try {
      setStatus("Checking USDC balance...");
      const balance = await getUSDCBalance(publicClient, address);

      if (balance === 0n) {
        throw new Error(`Insufficient balance. Make sure you have USDC on ${chainName}`);
      }

      setStatus("Creating payment signature...");
      const validPaymentRequirements = ensureValidAmount(paymentRequirements);
      const initialPayment = await exact.evm.createPayment(
        walletClient,
        1,
        validPaymentRequirements,
      );

      const paymentHeader: string = exact.evm.encodePayment(initialPayment);

      setStatus("Requesting content with payment...");
      const response = await fetch(x402.currentUrl, {
        headers: {
          "X-PAYMENT": paymentHeader,
          "Access-Control-Expose-Headers": "X-PAYMENT-RESPONSE",
        },
      });

      if (response.ok) {
        await handleSuccessfulResponse(response);
      } else if (response.status === 402) {
        // Try to parse error data, fallback to empty object if parsing fails
        const errorData = await response.json().catch(() => ({}));
        if (errorData && typeof errorData.x402Version === "number") {
          // Retry with server's x402Version
          const retryPayment = await exact.evm.createPayment(
            walletClient,
            errorData.x402Version,
            validPaymentRequirements,
          );

          retryPayment.x402Version = errorData.x402Version;
          const retryHeader = exact.evm.encodePayment(retryPayment);
          const retryResponse = await fetch(x402.currentUrl, {
            headers: {
              "X-PAYMENT": retryHeader,
              "Access-Control-Expose-Headers": "X-PAYMENT-RESPONSE",
            },
          });
          if (retryResponse.ok) {
            await handleSuccessfulResponse(retryResponse);
            return;
          } else {
            throw new Error(`Payment retry failed: ${retryResponse.statusText}`);
          }
        } else {
          throw new Error(`Payment failed: ${response.statusText}`);
        }
      } else {
        throw new Error(`Request failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setIsPaying(false);
    }
  }, [address, x402, paymentRequirements, publicClient, paymentChain, handleSwitchChain]);

  if (!x402 || !paymentRequirements) {
    return (
      <div className="container">
        <div className="header">
          <h1 className="title">Payment Required</h1>
          <p className="subtitle">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container gap-8">
      <div className="header">
        <h1 className="title">Payment Required</h1>
        <p>
          {paymentRequirements.description && `${paymentRequirements.description}.`} To access this
          content, please pay ${amount} {chainName} USDC.
        </p>
        {testnet && (
          <p className="instructions">
            Need Base Sepolia USDC?{" "}
            <a href="https://faucet.circle.com/" target="_blank" rel="noopener noreferrer">
              Get some <u>here</u>.
            </a>
          </p>
        )}
      </div>

      <div className="content w-full">
        <Wallet className="w-full">
          <ConnectWallet className="w-full py-3" disconnectedLabel="Connect wallet">
            <Avatar className="h-5 w-5 opacity-80" />
            <Name className="opacity-80 text-sm" />
          </ConnectWallet>
          <WalletDropdown>
            <WalletDropdownDisconnect className="opacity-80" />
          </WalletDropdown>
        </Wallet>
        {isConnected && (
          <div id="payment-section">
            <div className="payment-details">
              <div className="payment-row">
                <span className="payment-label">Wallet:</span>
                <span className="payment-value">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Loading..."}
                </span>
              </div>
              <div className="payment-row">
                <span className="payment-label">Available balance:</span>
                <span className="payment-value">
                  <button className="balance-button" onClick={() => setHideBalance(prev => !prev)}>
                    {formattedUsdcBalance && !hideBalance
                      ? `$${formattedUsdcBalance} USDC`
                      : "••••• USDC"}
                  </button>
                </span>
              </div>
              <div className="payment-row">
                <span className="payment-label">Amount:</span>
                <span className="payment-value">${amount} USDC</span>
              </div>
              <div className="payment-row">
                <span className="payment-label">Network:</span>
                <span className="payment-value">{chainName}</span>
              </div>
            </div>

            {isCorrectChain ? (
              <div className="cta-container">
                {showOnramp && (
                  <FundButton
                    fundingUrl={onrampBuyUrl}
                    text="Get more USDC"
                    hideIcon
                    className="button button-positive"
                  />
                )}
                <button
                  className="button button-primary"
                  onClick={handlePayment}
                  disabled={isPaying}
                >
                  {isPaying ? <Spinner /> : "Pay now"}
                </button>
              </div>
            ) : (
              <button className="button button-primary" onClick={handleSwitchChain}>
                Switch to {chainName}
              </button>
            )}
          </div>
        )}
        {status && <div className="status">{status}</div>}
      </div>
    </div>
  );
}



================================================
FILE: typescript/packages/x402/src/paywall/src/Providers.tsx
================================================
import { OnchainKitProvider } from "@coinbase/onchainkit";
import type { ReactNode } from "react";
import { base, baseSepolia } from "viem/chains";
import "./window.d.ts";

type ProvidersProps = {
  children: ReactNode;
};

/**
 * Providers component for the paywall
 *
 * @param props - The component props
 * @param props.children - The children of the Providers component
 * @returns The Providers component
 */
export function Providers({ children }: ProvidersProps) {
  const { testnet, cdpClientKey, appName, appLogo } = window.x402;

  return (
    <OnchainKitProvider
      apiKey={cdpClientKey || undefined}
      chain={testnet ? baseSepolia : base}
      config={{
        appearance: {
          mode: "light",
          theme: "base",
          name: appName || undefined,
          logo: appLogo || undefined,
        },
        wallet: {
          display: "modal",
          supportedWallets: {
            rabby: true,
            trust: true,
            frame: true,
          },
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}



================================================
FILE: typescript/packages/x402/src/paywall/src/Spinner.tsx
================================================
/**
 * Simple Spinner component for loading states
 *
 * @param props - The component props
 * @param props.className - Optional CSS classes to apply to the spinner
 * @returns The Spinner component
 */
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className="animate-spin border-2 border-gray-200 border-t-gray-400 rounded-full w-4 h-4"
        style={{
          animation: "spin 1s linear infinite",
          borderTopWidth: "2px",
        }}
      />
    </div>
  );
}



================================================
FILE: typescript/packages/x402/src/paywall/src/useOnrampSessionToken.ts
================================================
import { useCallback, useState, useEffect } from "react";
import { generateOnrampSessionToken } from "./utils";

type UseOnrampSessionTokenProps = {
  sessionToken: string | undefined;
};

const TOKEN_EXPIRY_TIME = 5 * 60 * 1000;

/**
 * Custom hook to manage onramp session token state and lifecycle
 *
 * @param address - The user's wallet address
 * @returns Object containing session token state
 */
export function useOnrampSessionToken(address: string | undefined): UseOnrampSessionTokenProps {
  const [sessionToken, setSessionToken] = useState<string | undefined>();
  const [tokenTimestamp, setTokenTimestamp] = useState<number | null>(null);

  const isTokenExpired = useCallback(() => {
    if (!tokenTimestamp) return true;
    return Date.now() - tokenTimestamp > TOKEN_EXPIRY_TIME;
  }, [tokenTimestamp]);

  const generateToken = useCallback(async () => {
    if (!address) {
      return;
    }

    // Token expires after 5 minutes, but once authorized it can be used
    // indefinitely with the same sessionId
    if (!sessionToken || isTokenExpired()) {
      const token = await generateOnrampSessionToken(address);
      setSessionToken(token);
      setTokenTimestamp(Date.now());
    }
  }, [address, sessionToken, isTokenExpired]);

  // Generate token when address changes or component mounts
  useEffect(() => {
    if (address) {
      generateToken();
    } else {
      setSessionToken(undefined);
      setTokenTimestamp(null);
    }
  }, [address, generateToken]);

  return {
    sessionToken,
  };
}



================================================
FILE: typescript/packages/x402/src/paywall/src/utils.ts
================================================
import type { PaymentRequirements } from "../../types";

/**
 * Safely clones an object without prototype pollution
 *
 * @param obj - The object to clone
 * @returns A safe clone of the object
 */
function safeClone<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => safeClone(item)) as T;
  }

  const cloned: Record<string, unknown> = {};
  for (const key in obj as Record<string, unknown>) {
    // Skip __proto__ and other dangerous properties
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = safeClone((obj as Record<string, unknown>)[key]);
    }
  }
  return cloned as T;
}

/**
 * Ensures a valid amount is set in payment requirements
 *
 * @param paymentRequirements - The payment requirements to validate and update
 * @returns Updated payment requirements with valid amount
 */
export function ensureValidAmount(paymentRequirements: PaymentRequirements): PaymentRequirements {
  const updatedRequirements = safeClone(paymentRequirements);

  if (window.x402?.amount) {
    try {
      const amountInBaseUnits = Math.round(window.x402.amount * 1_000_000);
      updatedRequirements.maxAmountRequired = amountInBaseUnits.toString();
    } catch (error) {
      console.error("Failed to parse amount:", error);
    }
  }

  if (
    !updatedRequirements.maxAmountRequired ||
    !/^\d+$/.test(updatedRequirements.maxAmountRequired)
  ) {
    updatedRequirements.maxAmountRequired = "10000";
  }

  return updatedRequirements;
}

/**
 * Generates a session token for the user
 *
 * @param address - The user's connected wallet address
 * @returns The session token
 */
export const generateOnrampSessionToken = async (address: string): Promise<string | undefined> => {
  const endpoint = window.x402?.sessionTokenEndpoint;
  if (!endpoint) {
    return undefined;
  }

  // Call the session token API with user's address
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      addresses: [
        {
          address,
          blockchains: ["base"], // Onramp only supports mainnet
        },
      ],
      assets: ["USDC"],
    }),
  });

  const data = await response.json();
  return data.token;
};



================================================
FILE: typescript/packages/x402/src/paywall/src/window.d.ts
================================================
import { PaymentRequirements } from "../../types/verify";

declare global {
  interface Window {
    x402: {
      amount?: number;
      testnet?: boolean;
      paymentRequirements: PaymentRequirements | PaymentRequirements[];
      currentUrl: string;
      cdpClientKey?: string;
      appName?: string;
      appLogo?: string;
      sessionTokenEndpoint?: string;
      config: {
        chainConfig: Record<
          string,
          {
            usdcAddress: string;
            usdcName: string;
          }
        >;
      };
    };
  }
}



================================================
FILE: typescript/packages/x402/src/schemes/index.ts
================================================
export * as exact from "./exact";



================================================
FILE: typescript/packages/x402/src/schemes/exact/index.ts
================================================
export * as evm from "./evm";

export const SCHEME = "exact";



================================================
FILE: typescript/packages/x402/src/schemes/exact/evm/client.test.ts
================================================
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createSignerSepolia, SignerWallet } from "../../../types/shared/evm";
import { PaymentRequirements, UnsignedPaymentPayload } from "../../../types/verify";
import { createPaymentHeader, preparePaymentHeader, signPaymentHeader } from "./client";
import { signAuthorization } from "./sign";
import { encodePayment } from "./utils/paymentUtils";

vi.mock("./sign", async () => {
  const actual = await vi.importActual("./sign");
  return {
    ...actual,
    signAuthorization: vi.fn(),
  };
});

vi.mock("./utils/paymentUtils", () => ({
  encodePayment: vi.fn().mockReturnValue("encoded-payment-header"),
}));

describe("preparePaymentHeader", () => {
  const mockPaymentRequirements: PaymentRequirements = {
    scheme: "exact",
    network: "base-sepolia",
    maxAmountRequired: "1000000",
    resource: "https://example.com/resource",
    description: "Test resource",
    mimeType: "application/json",
    payTo: "0x1234567890123456789012345678901234567890",
    maxTimeoutSeconds: 300,
    asset: "0x1234567890123456789012345678901234567890",
  };

  const mockFromAddress = "0xabcdef1234567890123456789012345678901234";

  beforeEach(() => {
    vi.useFakeTimers();
    // Set a fixed time for consistent testing
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"));
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should create a valid unsigned payment header", () => {
    const result = preparePaymentHeader(mockFromAddress, 1, mockPaymentRequirements);
    const currentTime = Math.floor(Date.now() / 1000);

    expect(result).toEqual({
      x402Version: 1,
      scheme: "exact",
      network: "base-sepolia",
      payload: {
        signature: undefined,
        authorization: {
          from: mockFromAddress,
          to: mockPaymentRequirements.payTo,
          value: mockPaymentRequirements.maxAmountRequired,
          validAfter: (currentTime - 600).toString(),
          validBefore: (currentTime + mockPaymentRequirements.maxTimeoutSeconds).toString(),
          nonce: expect.any(String),
        },
      },
    });
  });

  it("should generate a unique nonce for each call", () => {
    const result1 = preparePaymentHeader(mockFromAddress, 1, mockPaymentRequirements);
    const result2 = preparePaymentHeader(mockFromAddress, 1, mockPaymentRequirements);

    expect(result1.payload.authorization.nonce.length).toBe(66);
    expect(result2.payload.authorization.nonce.length).toBe(66);
    expect(result1.payload.authorization.nonce).not.toBe(result2.payload.authorization.nonce);
  });

  it("should calculate validAfter as 60 seconds before current time", () => {
    const result = preparePaymentHeader(mockFromAddress, 1, mockPaymentRequirements);
    const currentTime = Math.floor(Date.now() / 1000);
    const validAfter = parseInt(result.payload.authorization.validAfter);

    expect(validAfter).toBe(currentTime - 600);
  });

  it("should calculate validBefore as current time plus maxTimeoutSeconds", () => {
    const result = preparePaymentHeader(mockFromAddress, 1, mockPaymentRequirements);
    const currentTime = Math.floor(Date.now() / 1000);
    const validBefore = parseInt(result.payload.authorization.validBefore);

    expect(validBefore).toBe(currentTime + mockPaymentRequirements.maxTimeoutSeconds);
  });

  it("should handle different x402 versions", () => {
    const result = preparePaymentHeader(mockFromAddress, 2, mockPaymentRequirements);
    expect(result.x402Version).toBe(2);
  });
});

describe("signPaymentHeader", () => {
  const mockPaymentRequirements: PaymentRequirements = {
    scheme: "exact",
    network: "base-sepolia",
    maxAmountRequired: "1000000",
    resource: "https://example.com/resource",
    description: "Test resource",
    mimeType: "application/json",
    payTo: "0x1234567890123456789012345678901234567890",
    maxTimeoutSeconds: 300,
    asset: "0x1234567890123456789012345678901234567890",
  };

  const mockUnsignedHeader: UnsignedPaymentPayload = {
    x402Version: 1,
    scheme: "exact",
    network: "base-sepolia",
    payload: {
      signature: undefined,
      authorization: {
        from: "0xabcdef1234567890123456789012345678901234",
        to: "0x1234567890123456789012345678901234567890",
        value: "1000000",
        validAfter: "1704067195",
        validBefore: "1704067495",
        nonce: "1234567890",
      },
    },
  };

  const mockSignature = "0x1234567890123456789012345678901234567890123456789012345678901234";

  const createTestClient = () => {
    return createSignerSepolia(
      "0x1234567890123456789012345678901234567890123456789012345678901234",
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(signAuthorization).mockResolvedValue({ signature: mockSignature });
  });

  it("should sign the payment header and return a complete payload", async () => {
    const client = createTestClient();
    const result = await signPaymentHeader(client, mockPaymentRequirements, mockUnsignedHeader);

    expect(signAuthorization).toHaveBeenCalledWith(
      client,
      mockUnsignedHeader.payload.authorization,
      mockPaymentRequirements,
    );

    expect(result).toEqual({
      ...mockUnsignedHeader,
      payload: {
        ...mockUnsignedHeader.payload,
        signature: mockSignature,
      },
    });
  });

  it("should preserve all original fields in the signed payload", async () => {
    const client = createTestClient();
    const result = await signPaymentHeader(client, mockPaymentRequirements, mockUnsignedHeader);

    // Check that all original fields are preserved
    expect(result.x402Version).toBe(mockUnsignedHeader.x402Version);
    expect(result.scheme).toBe(mockUnsignedHeader.scheme);
    expect(result.network).toBe(mockUnsignedHeader.network);
    expect(result.payload.authorization).toEqual(mockUnsignedHeader.payload.authorization);
  });

  it("should throw an error if signing fails", async () => {
    const client = createTestClient();
    const error = new Error("Signing failed");
    vi.mocked(signAuthorization).mockRejectedValue(error);

    await expect(
      signPaymentHeader(client, mockPaymentRequirements, mockUnsignedHeader),
    ).rejects.toThrow("Signing failed");
  });
});

describe("createPaymentHeader", () => {
  const mockPaymentRequirements: PaymentRequirements = {
    scheme: "exact",
    network: "base-sepolia",
    maxAmountRequired: "1000000",
    resource: "https://example.com/resource",
    description: "Test resource",
    mimeType: "application/json",
    payTo: "0x1234567890123456789012345678901234567890",
    maxTimeoutSeconds: 300,
    asset: "0x1234567890123456789012345678901234567890",
  };

  const mockSignedPayment = {
    x402Version: 1,
    scheme: "exact",
    network: "base-sepolia",
    payload: {
      signature:
        "0x1234567890123456789012345678901234567890123456789012345678901234" as `0x${string}`,
      authorization: {
        from: "0xabcdef1234567890123456789012345678901234" as `0x${string}`,
        to: "0x1234567890123456789012345678901234567890" as `0x${string}`,
        value: "1000000",
        validAfter: "1704067195",
        validBefore: "1704067495",
        nonce: "1234567890",
      },
    },
  };

  const createTestClient = () => {
    const client = createSignerSepolia(
      "0x1234567890123456789012345678901234567890123456789012345678901234" as `0x${string}`,
    );
    return client as unknown as SignerWallet;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(signAuthorization).mockResolvedValue({
      signature: mockSignedPayment.payload.signature,
    });
  });

  it("should create and encode a payment header", async () => {
    const client = createTestClient();
    const result = await createPaymentHeader(client, 1, mockPaymentRequirements);

    expect(result).toBe("encoded-payment-header");
    expect(vi.mocked(encodePayment)).toHaveBeenCalledWith(
      expect.objectContaining({
        x402Version: 1,
        scheme: "exact",
        network: "base-sepolia",
        payload: expect.objectContaining({
          signature: mockSignedPayment.payload.signature,
          authorization: expect.objectContaining({
            from: client.account!.address,
            to: mockPaymentRequirements.payTo,
            value: mockPaymentRequirements.maxAmountRequired,
          }),
        }),
      }),
    );
  });

  it("should handle different x402 versions", async () => {
    const client = createTestClient();
    await createPaymentHeader(client, 2, mockPaymentRequirements);

    expect(vi.mocked(encodePayment)).toHaveBeenCalledWith(
      expect.objectContaining({
        x402Version: 2,
      }),
    );
  });

  it("should throw an error if signing fails", async () => {
    const client = createTestClient();
    const error = new Error("Signing failed");
    vi.mocked(signAuthorization).mockRejectedValue(error);

    await expect(createPaymentHeader(client, 1, mockPaymentRequirements)).rejects.toThrow(
      "Signing failed",
    );
  });

  it("should throw an error if encoding fails", async () => {
    const client = createTestClient();
    const error = new Error("Encoding failed");
    vi.mocked(encodePayment).mockImplementation(() => {
      throw error;
    });

    await expect(createPaymentHeader(client, 1, mockPaymentRequirements)).rejects.toThrow(
      "Encoding failed",
    );
  });
});



================================================
FILE: typescript/packages/x402/src/schemes/exact/evm/client.ts
================================================
import { Address, Chain, LocalAccount, Transport } from "viem";
import { isSignerWallet, SignerWallet } from "../../../types/shared/evm";
import { PaymentPayload, PaymentRequirements, UnsignedPaymentPayload } from "../../../types/verify";
import { createNonce, signAuthorization } from "./sign";
import { encodePayment } from "./utils/paymentUtils";

/**
 * Prepares an unsigned payment header with the given sender address and payment requirements.
 *
 * @param from - The sender's address from which the payment will be made
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns An unsigned payment payload containing authorization details
 */
export function preparePaymentHeader(
  from: Address,
  x402Version: number,
  paymentRequirements: PaymentRequirements,
): UnsignedPaymentPayload {
  const nonce = createNonce();

  const validAfter = BigInt(
    Math.floor(Date.now() / 1000) - 600, // 10 minutes before
  ).toString();
  const validBefore = BigInt(
    Math.floor(Date.now() / 1000 + paymentRequirements.maxTimeoutSeconds),
  ).toString();

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
        nonce,
      },
    },
  };
}

/**
 * Signs a payment header using the provided client and payment requirements.
 *
 * @param client - The signer wallet instance used to sign the payment header
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @param unsignedPaymentHeader - The unsigned payment payload to be signed
 * @returns A promise that resolves to the signed payment payload
 */
export async function signPaymentHeader<transport extends Transport, chain extends Chain>(
  client: SignerWallet<chain, transport> | LocalAccount,
  paymentRequirements: PaymentRequirements,
  unsignedPaymentHeader: UnsignedPaymentPayload,
): Promise<PaymentPayload> {
  const { signature } = await signAuthorization(
    client,
    unsignedPaymentHeader.payload.authorization,
    paymentRequirements,
  );

  return {
    ...unsignedPaymentHeader,
    payload: {
      ...unsignedPaymentHeader.payload,
      signature,
    },
  };
}

/**
 * Creates a complete payment payload by preparing and signing a payment header.
 *
 * @param client - The signer wallet instance used to create and sign the payment
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns A promise that resolves to the complete signed payment payload
 */
export async function createPayment<transport extends Transport, chain extends Chain>(
  client: SignerWallet<chain, transport> | LocalAccount,
  x402Version: number,
  paymentRequirements: PaymentRequirements,
): Promise<PaymentPayload> {
  const from = isSignerWallet(client) ? client.account!.address : client.address;
  const unsignedPaymentHeader = preparePaymentHeader(from, x402Version, paymentRequirements);
  return signPaymentHeader(client, paymentRequirements, unsignedPaymentHeader);
}

/**
 * Creates and encodes a payment header for the given client and payment requirements.
 *
 * @param client - The signer wallet instance used to create the payment header
 * @param x402Version - The version of the X402 protocol to use
 * @param paymentRequirements - The payment requirements containing scheme and network information
 * @returns A promise that resolves to the encoded payment header string
 */
export async function createPaymentHeader(
  client: SignerWallet | LocalAccount,
  x402Version: number,
  paymentRequirements: PaymentRequirements,
): Promise<string> {
  const payment = await createPayment(client, x402Version, paymentRequirements);
  return encodePayment(payment);
}



================================================
FILE: typescript/packages/x402/src/schemes/exact/evm/facilitator.ts
================================================
import { Account, Address, Chain, getAddress, Hex, parseErc6492Signature, Transport } from "viem";
import { getNetworkId } from "../../../shared";
import { getVersion, getERC20Balance } from "../../../shared/evm";
import {
  usdcABI as abi,
  authorizationTypes,
  config,
  ConnectedClient,
  SignerWallet,
} from "../../../types/shared/evm";
import {
  PaymentPayload,
  PaymentRequirements,
  SettleResponse,
  VerifyResponse,
} from "../../../types/verify";
import { SCHEME } from "../../exact";

/**
 * Verifies a payment payload against the required payment details
 *
 * This function performs several verification steps:
 * - Verifies protocol version compatibility
 * - Validates the permit signature
 * - Confirms USDC contract address is correct for the chain
 * - Checks permit deadline is sufficiently in the future
 * - Verifies client has sufficient USDC balance
 * - Ensures payment amount meets required minimum
 *
 * @param client - The public client used for blockchain interactions
 * @param payload - The signed payment payload containing transfer parameters and signature
 * @param paymentRequirements - The payment requirements that the payload must satisfy
 * @returns A ValidPaymentRequest indicating if the payment is valid and any invalidation reason
 */
export async function verify<
  transport extends Transport,
  chain extends Chain,
  account extends Account | undefined,
>(
  client: ConnectedClient<transport, chain, account>,
  payload: PaymentPayload,
  paymentRequirements: PaymentRequirements,
): Promise<VerifyResponse> {
  /* TODO: work with security team on brainstorming more verification steps
  verification steps:
    - ✅ verify payload version
    - ✅ verify usdc address is correct for the chain
    - ✅ verify permit signature
    - ✅ verify deadline
    - verify nonce is current
    - ✅ verify client has enough funds to cover paymentRequirements.maxAmountRequired
    - ✅ verify value in payload is enough to cover paymentRequirements.maxAmountRequired
    - check min amount is above some threshold we think is reasonable for covering gas
    - verify resource is not already paid for (next version)
    */

  // Verify payload version
  if (payload.scheme !== SCHEME || paymentRequirements.scheme !== SCHEME) {
    return {
      isValid: false,
      invalidReason: `unsupported_scheme`,
      payer: payload.payload.authorization.from,
    };
  }

  let name: string;
  let chainId: number;
  let erc20Address: Address;
  let version: string;
  try {
    chainId = getNetworkId(payload.network);
    name = paymentRequirements.extra?.name ?? config[chainId.toString()].usdcName;
    erc20Address = paymentRequirements.asset as Address;
    version = paymentRequirements.extra?.version ?? (await getVersion(client));
  } catch {
    return {
      isValid: false,
      invalidReason: `invalid_network`,
      payer: payload.payload.authorization.from,
    };
  }
  // Verify permit signature is recoverable for the owner address
  const permitTypedData = {
    types: authorizationTypes,
    primaryType: "TransferWithAuthorization" as const,
    domain: {
      name,
      version,
      chainId,
      verifyingContract: erc20Address,
    },
    message: {
      from: payload.payload.authorization.from,
      to: payload.payload.authorization.to,
      value: payload.payload.authorization.value,
      validAfter: payload.payload.authorization.validAfter,
      validBefore: payload.payload.authorization.validBefore,
      nonce: payload.payload.authorization.nonce,
    },
  };
  const recoveredAddress = await client.verifyTypedData({
    address: payload.payload.authorization.from as Address,
    ...permitTypedData,
    signature: payload.payload.signature as Hex,
  });
  if (!recoveredAddress) {
    return {
      isValid: false,
      invalidReason: "invalid_exact_evm_payload_signature", //"Invalid permit signature",
      payer: payload.payload.authorization.from,
    };
  }

  // Verify that payment was made to the correct address
  if (getAddress(payload.payload.authorization.to) !== getAddress(paymentRequirements.payTo)) {
    return {
      isValid: false,
      invalidReason: "invalid_exact_evm_payload_recipient_mismatch",
      payer: payload.payload.authorization.from,
    };
  }

  // Verify deadline is not yet expired
  // Pad 3 block to account for round tripping
  if (
    BigInt(payload.payload.authorization.validBefore) < BigInt(Math.floor(Date.now() / 1000) + 6)
  ) {
    return {
      isValid: false,
      invalidReason: "invalid_exact_evm_payload_authorization_valid_before", //"Deadline on permit isn't far enough in the future",
      payer: payload.payload.authorization.from,
    };
  }
  // Verify deadline is not yet valid
  if (BigInt(payload.payload.authorization.validAfter) > BigInt(Math.floor(Date.now() / 1000))) {
    return {
      isValid: false,
      invalidReason: "invalid_exact_evm_payload_authorization_valid_after", //"Deadline on permit is in the future",
      payer: payload.payload.authorization.from,
    };
  }
  // Verify client has enough funds to cover paymentRequirements.maxAmountRequired
  const balance = await getERC20Balance(
    client,
    erc20Address,
    payload.payload.authorization.from as Address,
  );
  if (balance < BigInt(paymentRequirements.maxAmountRequired)) {
    return {
      isValid: false,
      invalidReason: "insufficient_funds", //"Client does not have enough funds",
      payer: payload.payload.authorization.from,
    };
  }
  // Verify value in payload is enough to cover paymentRequirements.maxAmountRequired
  if (BigInt(payload.payload.authorization.value) < BigInt(paymentRequirements.maxAmountRequired)) {
    return {
      isValid: false,
      invalidReason: "invalid_exact_evm_payload_authorization_value", //"Value in payload is not enough to cover paymentRequirements.maxAmountRequired",
      payer: payload.payload.authorization.from,
    };
  }
  return {
    isValid: true,
    invalidReason: undefined,
    payer: payload.payload.authorization.from,
  };
}

/**
 * Settles a payment by executing a USDC transferWithAuthorization transaction
 *
 * This function executes the actual USDC transfer using the signed authorization from the user.
 * The facilitator wallet submits the transaction but does not need to hold or transfer any tokens itself.
 *
 * @param wallet - The facilitator wallet that will submit the transaction
 * @param paymentPayload - The signed payment payload containing the transfer parameters and signature
 * @param paymentRequirements - The original payment details that were used to create the payload
 * @returns A PaymentExecutionResponse containing the transaction status and hash
 */
export async function settle<transport extends Transport, chain extends Chain>(
  wallet: SignerWallet<chain, transport>,
  paymentPayload: PaymentPayload,
  paymentRequirements: PaymentRequirements,
): Promise<SettleResponse> {
  // re-verify to ensure the payment is still valid
  const valid = await verify(wallet, paymentPayload, paymentRequirements);

  if (!valid.isValid) {
    return {
      success: false,
      network: paymentPayload.network,
      transaction: "",
      errorReason: valid.invalidReason ?? "invalid_scheme", //`Payment is no longer valid: ${valid.invalidReason}`,
      payer: paymentPayload.payload.authorization.from,
    };
  }

  // Returns the original signature (no-op) if the signature is not a 6492 signature
  const { signature } = parseErc6492Signature(paymentPayload.payload.signature as Hex);

  const tx = await wallet.writeContract({
    address: paymentRequirements.asset as Address,
    abi,
    functionName: "transferWithAuthorization" as const,
    args: [
      paymentPayload.payload.authorization.from as Address,
      paymentPayload.payload.authorization.to as Address,
      BigInt(paymentPayload.payload.authorization.value),
      BigInt(paymentPayload.payload.authorization.validAfter),
      BigInt(paymentPayload.payload.authorization.validBefore),
      paymentPayload.payload.authorization.nonce as Hex,
      signature,
    ],
    chain: wallet.chain as Chain,
  });

  const receipt = await wallet.waitForTransactionReceipt({ hash: tx });

  if (receipt.status !== "success") {
    return {
      success: false,
      errorReason: "invalid_transaction_state", //`Transaction failed`,
      transaction: tx,
      network: paymentPayload.network,
      payer: paymentPayload.payload.authorization.from,
    };
  }

  return {
    success: true,
    transaction: tx,
    network: paymentPayload.network,
    payer: paymentPayload.payload.authorization.from,
  };
}



================================================
FILE: typescript/packages/x402/src/schemes/exact/evm/index.ts
================================================
export * from "./client";
export * from "./facilitator";
export * from "./utils/paymentUtils";



================================================
FILE: typescript/packages/x402/src/schemes/exact/evm/sign.ts
================================================
import { Chain, getAddress, Hex, LocalAccount, toHex, Transport } from "viem";
import { getNetworkId } from "../../../shared";
import {
  authorizationTypes,
  isAccount,
  isSignerWallet,
  SignerWallet,
} from "../../../types/shared/evm";
import { ExactEvmPayloadAuthorization, PaymentRequirements } from "../../../types/verify";

/**
 * Signs an EIP-3009 authorization for USDC transfer
 *
 * @param walletClient - The wallet client that will sign the authorization
 * @param params - The authorization parameters containing transfer details
 * @param params.from - The address tokens will be transferred from
 * @param params.to - The address tokens will be transferred to
 * @param params.value - The amount of USDC tokens to transfer (in base units)
 * @param params.validAfter - Unix timestamp after which the authorization becomes valid
 * @param params.validBefore - Unix timestamp before which the authorization is valid
 * @param params.nonce - Random 32-byte nonce to prevent replay attacks
 * @param paymentRequirements - The payment requirements containing asset and network information
 * @param paymentRequirements.asset - The address of the USDC contract
 * @param paymentRequirements.network - The network where the USDC contract exists
 * @param paymentRequirements.extra - The extra information containing the name and version of the ERC20 contract
 * @returns The signature for the authorization
 */
export async function signAuthorization<transport extends Transport, chain extends Chain>(
  walletClient: SignerWallet<chain, transport> | LocalAccount,
  { from, to, value, validAfter, validBefore, nonce }: ExactEvmPayloadAuthorization,
  { asset, network, extra }: PaymentRequirements,
): Promise<{ signature: Hex }> {
  const chainId = getNetworkId(network);
  const name = extra?.name;
  const version = extra?.version;

  const data = {
    types: authorizationTypes,
    domain: {
      name,
      version,
      chainId,
      verifyingContract: getAddress(asset),
    },
    primaryType: "TransferWithAuthorization" as const,
    message: {
      from: getAddress(from),
      to: getAddress(to),
      value,
      validAfter,
      validBefore,
      nonce: nonce,
    },
  };

  if (isSignerWallet(walletClient)) {
    const signature = await walletClient.signTypedData(data);
    return {
      signature,
    };
  } else if (isAccount(walletClient) && walletClient.signTypedData) {
    const signature = await walletClient.signTypedData(data);
    return {
      signature,
    };
  } else {
    throw new Error("Invalid wallet client provided does not support signTypedData");
  }
}

/**
 * Generates a random 32-byte nonce for use in authorization signatures
 *
 * @returns A random 32-byte nonce as a hex string
 */
export function createNonce(): Hex {
  const cryptoObj =
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
      ? globalThis.crypto
      : // Dynamic require is needed to support node.js
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require("crypto").webcrypto;
  return toHex(cryptoObj.getRandomValues(new Uint8Array(32)));
}



================================================
FILE: typescript/packages/x402/src/schemes/exact/evm/utils/paymentUtils.ts
================================================
import { safeBase64Encode, safeBase64Decode } from "../../../../shared";
import { PaymentPayload, PaymentPayloadSchema } from "../../../../types/verify";

/**
 * Encodes a payment payload into a base64 string, ensuring bigint values are properly stringified
 *
 * @param payment - The payment payload to encode
 * @returns A base64 encoded string representation of the payment payload
 */
export function encodePayment(payment: PaymentPayload): string {
  const safe = {
    ...payment,
    payload: {
      ...payment.payload,
      authorization: Object.fromEntries(
        Object.entries(payment.payload.authorization).map(([key, value]) => [
          key,
          typeof value === "bigint" ? (value as bigint).toString() : value,
        ]),
      ),
    },
  };
  return safeBase64Encode(JSON.stringify(safe));
}

/**
 * Decodes a base64 encoded payment string back into a PaymentPayload object
 *
 * @param payment - The base64 encoded payment string to decode
 * @returns The decoded and validated PaymentPayload object
 */
export function decodePayment(payment: string): PaymentPayload {
  const decoded = safeBase64Decode(payment);
  const parsed = JSON.parse(decoded);

  const obj = {
    ...parsed,
    payload: {
      signature: parsed.payload.signature,
      authorization: {
        ...parsed.payload.authorization,
        value: parsed.payload.authorization.value,
        validAfter: parsed.payload.authorization.validAfter,
        validBefore: parsed.payload.authorization.validBefore,
      },
    },
  };

  const validated = PaymentPayloadSchema.parse(obj);
  return validated;
}



================================================
FILE: typescript/packages/x402/src/shared/base64.ts
================================================
/**
 * Encodes a string to base64 format
 *
 * @param data - The string to be encoded to base64
 * @returns The base64 encoded string
 */
export function safeBase64Encode(data: string): string {
  if (typeof globalThis !== "undefined" && typeof globalThis.btoa === "function") {
    return globalThis.btoa(data);
  }
  return Buffer.from(data).toString("base64");
}

/**
 * Decodes a base64 string back to its original format
 *
 * @param data - The base64 encoded string to be decoded
 * @returns The decoded string in UTF-8 format
 */
export function safeBase64Decode(data: string): string {
  if (typeof globalThis !== "undefined" && typeof globalThis.atob === "function") {
    return globalThis.atob(data);
  }
  return Buffer.from(data, "base64").toString("utf-8");
}



================================================
FILE: typescript/packages/x402/src/shared/index.ts
================================================
export * from "./json";
export * from "./paywall";
export * from "./base64";
export * from "./network";
export * from "./middleware";



================================================
FILE: typescript/packages/x402/src/shared/json.ts
================================================
/**
 * Converts an object to a JSON-safe format by converting bigint values to strings
 * and recursively processing nested objects and arrays
 *
 * @param data - The object to convert to JSON-safe format
 * @returns A new object with all bigint values converted to strings
 */
export function toJsonSafe<T extends object>(data: T): object {
  if (typeof data !== "object") {
    throw new Error("Data is not an object");
  }

  /**
   * Recursively converts values to JSON-safe format
   *
   * @param value - The value to convert
   * @returns The converted value with bigints as strings
   */
  function convert(value: unknown): unknown {
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      return Object.fromEntries(Object.entries(value).map(([key, val]) => [key, convert(val)]));
    }

    if (Array.isArray(value)) {
      return value.map(convert);
    }

    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  }

  return convert(data) as object;
}



================================================
FILE: typescript/packages/x402/src/shared/middleware.test.ts
================================================
import { describe, expect, it } from "vitest";
import {
  computeRoutePatterns,
  findMatchingRoute,
  getDefaultAsset,
  processPriceToAtomicAmount,
} from "x402/shared";
import { RoutesConfig } from "./middleware";
import { Network } from "./network";

describe("computeRoutePatterns", () => {
  it("should handle simple string price routes", () => {
    const routes: RoutesConfig = {
      "/api/test": "$0.01",
      "/api/other": "$0.02",
    };

    const patterns = computeRoutePatterns(routes);

    expect(patterns).toHaveLength(2);
    expect(patterns[0]).toEqual({
      verb: "*",
      pattern: /^\/api\/test$/i,
      config: {
        price: "$0.01",
        network: "base-sepolia",
      },
    });
    expect(patterns[1]).toEqual({
      verb: "*",
      pattern: /^\/api\/other$/i,
      config: {
        price: "$0.02",
        network: "base-sepolia",
      },
    });
  });

  it("should handle routes with HTTP verbs", () => {
    const routes: RoutesConfig = {
      "GET /api/test": "$0.01",
      "POST /api/other": "$0.02",
    };

    const patterns = computeRoutePatterns(routes);

    expect(patterns).toHaveLength(2);
    expect(patterns[0]).toEqual({
      verb: "GET",
      pattern: /^\/api\/test$/i,
      config: {
        price: "$0.01",
        network: "base-sepolia",
      },
    });
    expect(patterns[1]).toEqual({
      verb: "POST",
      pattern: /^\/api\/other$/i,
      config: {
        price: "$0.02",
        network: "base-sepolia",
      },
    });
  });

  it("should handle wildcard routes", () => {
    const routes: RoutesConfig = {
      "/api/*": "$0.01",
      "GET /api/users/*": "$0.02",
    };

    const patterns = computeRoutePatterns(routes);

    expect(patterns).toHaveLength(2);
    expect(patterns[0]).toEqual({
      verb: "*",
      pattern: /^\/api\/.*?$/i,
      config: {
        price: "$0.01",
        network: "base-sepolia",
      },
    });
    expect(patterns[1]).toEqual({
      verb: "GET",
      pattern: /^\/api\/users\/.*?$/i,
      config: {
        price: "$0.02",
        network: "base-sepolia",
      },
    });
  });

  it("should handle route parameters", () => {
    const routes: RoutesConfig = {
      "/api/users/[id]": "$0.01",
      "GET /api/posts/[slug]": "$0.02",
    };

    const patterns = computeRoutePatterns(routes);

    expect(patterns).toHaveLength(2);
    expect(patterns[0]).toEqual({
      verb: "*",
      pattern: /^\/api\/users\/[^\/]+$/i,
      config: {
        price: "$0.01",
        network: "base-sepolia",
      },
    });
    expect(patterns[1]).toEqual({
      verb: "GET",
      pattern: /^\/api\/posts\/[^\/]+$/i,
      config: {
        price: "$0.02",
        network: "base-sepolia",
      },
    });
  });

  it("should handle full route config objects", () => {
    const routes: RoutesConfig = {
      "/api/test": {
        price: "$0.01",
        network: "base-sepolia",
        config: {
          description: "Test route",
          mimeType: "application/json",
        },
      },
    };

    const patterns = computeRoutePatterns(routes);

    expect(patterns).toHaveLength(1);
    expect(patterns[0]).toEqual({
      verb: "*",
      pattern: /^\/api\/test$/i,
      config: {
        price: "$0.01",
        network: "base-sepolia",
        config: {
          description: "Test route",
          mimeType: "application/json",
        },
      },
    });
  });

  it("should throw error for invalid route patterns", () => {
    const routes: RoutesConfig = {
      "GET ": "$0.01", // Invalid pattern with no path
    };

    expect(() => computeRoutePatterns(routes)).toThrow("Invalid route pattern: GET ");
  });
});

describe("findMatchingRoute", () => {
  const routes = {
    "GET /api/test": "$0.01",
    "POST /api/test": "$0.02",
    "/api/wildcard": "$0.03",
  };
  const routePatterns = computeRoutePatterns(routes);

  it("should return undefined when no routes match", () => {
    const result = findMatchingRoute(routePatterns, "/not/api", "GET");
    expect(result).toBeUndefined();
  });

  it("should match routes with wildcard verbs", () => {
    const result = findMatchingRoute(routePatterns, "/api/wildcard", "PUT");
    expect(result).toEqual(routePatterns[2]);
  });

  it("should match routes with specific verbs", () => {
    const result = findMatchingRoute(routePatterns, "/api/test", "POST");
    expect(result).toEqual(routePatterns[1]);
  });

  it("should not match routes with wrong verbs", () => {
    const result = findMatchingRoute(routePatterns, "/api/test", "PUT");
    expect(result).toBeUndefined();
  });

  it("should handle case-insensitive method matching", () => {
    const result = findMatchingRoute(routePatterns, "/api/test", "post");
    expect(result).toEqual(routePatterns[1]);
  });

  it("should handle case-insensitive path matching", () => {
    const result = findMatchingRoute(routePatterns, "/API/test", "GET");
    expect(result).toEqual(routePatterns[0]);
  });

  it("should handle empty route patterns array", () => {
    const result = findMatchingRoute([], "/api/test", "GET");
    expect(result).toBeUndefined();
  });

  it("should normalize paths with multiple consecutive slashes", () => {
    const result = findMatchingRoute(routePatterns, "//api///test", "GET");
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with trailing slashes", () => {
    const result = findMatchingRoute(routePatterns, "/api/test/", "GET");
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with multiple trailing slashes", () => {
    const result = findMatchingRoute(routePatterns, "/api/test///", "GET");
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with trailing backslash", () => {
    const result = findMatchingRoute(routePatterns, "/api/test\\", "GET");
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with multiple trailing backslashes", () => {
    const result = findMatchingRoute(routePatterns, "/api/test\\\\", "GET");
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with multiple consecutive slashes", () => {
    const result = findMatchingRoute(routePatterns, "/api///test", "GET");
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with query parameters", () => {
    const result = findMatchingRoute(routePatterns, "/api/test?foo=bar", "GET");
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with hash fragments", () => {
    const result = findMatchingRoute(routePatterns, "/api/test#section", "GET");
    expect(result).toEqual(routePatterns[0]);
  });

  // URL-encoded path tests
  it("should match basic URL-encoded paths", () => {
    const result = findMatchingRoute(routePatterns, "/api/%74est", "GET");
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with multiple URL-encoded characters", () => {
    const result = findMatchingRoute(routePatterns, "/api/%74%65%73%74", "GET"); // /api/test encoded
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with URL-encoded slashes and backslashes", () => {
    // Test various combinations of encoded slashes and backslashes
    const tests = [
      "%2Fapi%2Ftest", // /api/test (all slashes encoded)
      "%5Capi%5Ctest", // \api\test (all backslashes encoded)
      "%2Fapi/test", // /api/test (mixed encoded and raw slashes)
      "%5Capi\\test", // \api\test (mixed encoded and raw backslashes)
      "/api%2Ftest", // /api/test (mixed raw and encoded slashes)
      "\\api%5Ctest", // \api\test (mixed raw and encoded backslashes)
      "%2Fapi%5Ctest", // /api\test (mixed encoded slash and backslash)
      "/api%2F%2Ftest", // /api//test (multiple encoded slashes)
      "\\api%5C%5Ctest", // \api\\test (multiple encoded backslashes)
    ];

    // All should match the same route
    tests.forEach(path => {
      const result = findMatchingRoute(routePatterns, path, "GET");
      expect(result).toEqual(routePatterns[0]);
    });
  });

  it("should match partially URL-encoded paths", () => {
    const result = findMatchingRoute(routePatterns, "/api/t%65st", "GET"); // /api/test with just 'e' encoded
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with URL-encoded query parameters", () => {
    const result = findMatchingRoute(routePatterns, "/api/test?foo%3Dbar", "GET"); // foo=bar with = encoded
    expect(result).toEqual(routePatterns[0]);
  });

  it("should match paths with mixed URL-encoded and special characters", () => {
    const result = findMatchingRoute(routePatterns, "/api/%74est%20with%20spaces", "GET");
    expect(result).toBeUndefined(); // Should not match as the pattern doesn't include spaces
  });

  it("should handle malformed URL-encoded sequences", () => {
    const result = findMatchingRoute(routePatterns, "/api/%XX", "GET");
    expect(result).toBeUndefined(); // Should not match as %XX is not a valid encoding
  });
});

describe("getDefaultAsset", () => {
  it("should return Base USDC asset details", () => {
    const result = getDefaultAsset("base");

    expect(result).toEqual({
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      decimals: 6,
      eip712: {
        name: "USD Coin",
        version: "2",
      },
    });
  });

  it("should return Base Sepolia USDC asset details", () => {
    const result = getDefaultAsset("base-sepolia");

    expect(result).toEqual({
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      decimals: 6,
      eip712: {
        name: "USDC",
        version: "2",
      },
    });
  });

  it("should return Sei Testnet USDC asset details", () => {
    const result = getDefaultAsset("sei-testnet");

    expect(result).toEqual({
      address: "0x4fcf1784b31630811181f670aea7a7bef803eaed",
      decimals: 6,
      eip712: {
        name: "USDC",
        version: "2",
      },
    });
  });

  it("should return Sei USDC asset details", () => {
    const result = getDefaultAsset("sei");

    expect(result).toEqual({
      address: "0xe15fc38f6d8c56af07bbcbe3baf5708a2bf42392",
      decimals: 6,
      eip712: {
        name: "USDC",
        version: "2",
      },
    });
  });

  it("should handle unknown networks", () => {
    expect(() => getDefaultAsset("unknown" as Network)).toThrow("Unsupported network: unknown");
  });
});

describe("processPriceToAtomicAmount", () => {
  it("should handle string price in dollars", () => {
    const result = processPriceToAtomicAmount("$0.01", "base-sepolia");
    expect(result).toEqual({
      maxAmountRequired: "10000",
      asset: {
        address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        decimals: 6,
        eip712: {
          name: "USDC",
          version: "2",
        },
      },
    });
  });

  it("should handle number price in dollars", () => {
    const result = processPriceToAtomicAmount(0.01, "base-sepolia");
    expect(result).toEqual({
      maxAmountRequired: "10000",
      asset: {
        address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        decimals: 6,
        eip712: {
          name: "USDC",
          version: "2",
        },
      },
    });
  });

  it("should handle token amount object", () => {
    const tokenAmount = {
      amount: "1000000",
      asset: {
        address: "0x1234567890123456789012345678901234567890" as `0x${string}`,
        decimals: 18,
        eip712: {
          name: "Custom Token",
          version: "1",
        },
      },
    };
    const result = processPriceToAtomicAmount(tokenAmount, "base-sepolia");
    expect(result).toEqual({
      maxAmountRequired: "1000000",
      asset: tokenAmount.asset,
    });
  });

  it("should handle invalid price format", () => {
    const result = processPriceToAtomicAmount("invalid", "base-sepolia");
    expect(result).toEqual({
      error: expect.stringContaining("Invalid price"),
    });
  });

  it("should handle negative price", () => {
    const result = processPriceToAtomicAmount("-$0.01", "base-sepolia");
    expect(result).toEqual({
      error: expect.stringContaining("Invalid price"),
    });
  });

  it("should handle zero price", () => {
    const result = processPriceToAtomicAmount("$0", "base-sepolia");
    expect(result).toEqual({
      error: expect.stringContaining("Number must be greater than or equal to 0.0001"),
    });
  });
});



================================================
FILE: typescript/packages/x402/src/shared/middleware.ts
================================================
import { Address, Hex } from "viem";
import {
  moneySchema,
  Network,
  Price,
  RouteConfig,
  RoutePattern,
  ERC20TokenAmount,
  PaymentRequirements,
  PaymentPayload,
} from "../types";
import { RoutesConfig } from "../types";
import { safeBase64Decode } from "./base64";
import { getUsdcChainConfigForChain } from "./evm";
import { getNetworkId } from "./network";

/**
 * Computes the route patterns for the given routes config
 *
 * @param routes - The routes config to compute the patterns for
 * @returns The route patterns
 */
export function computeRoutePatterns(routes: RoutesConfig): RoutePattern[] {
  const normalizedRoutes = Object.fromEntries(
    Object.entries(routes).map(([pattern, value]) => [
      pattern,
      typeof value === "string" || typeof value === "number"
        ? ({ price: value, network: "base-sepolia" } as RouteConfig)
        : (value as RouteConfig),
    ]),
  );

  return Object.entries(normalizedRoutes).map(([pattern, routeConfig]) => {
    // Split pattern into verb and path, defaulting to "*" for verb if not specified
    const [verb, path] = pattern.includes(" ") ? pattern.split(/\s+/) : ["*", pattern];
    if (!path) {
      throw new Error(`Invalid route pattern: ${pattern}`);
    }
    return {
      verb: verb.toUpperCase(),
      pattern: new RegExp(
        `^${
          path
            // First escape all special regex characters except * and []
            .replace(/[$()+.?^{|}]/g, "\\$&")
            // Then handle our special pattern characters
            .replace(/\*/g, ".*?") // Make wildcard non-greedy and optional
            .replace(/\[([^\]]+)\]/g, "[^/]+") // Convert [param] to regex capture
            .replace(/\//g, "\\/") // Escape slashes
        }$`,
        "i",
      ),
      config: routeConfig,
    };
  });
}

/**
 * Finds the matching route pattern for the given path and method
 *
 * @param routePatterns - The route patterns to search through
 * @param path - The path to match against
 * @param method - The HTTP method to match against
 * @returns The matching route pattern or undefined if no match is found
 */
export function findMatchingRoute(
  routePatterns: RoutePattern[],
  path: string,
  method: string,
): RoutePattern | undefined {
  // Normalize the path:
  // 1. Remove query parameters and hash fragments
  // 2. Replace backslashes with forward slashes
  // 3. Replace multiple consecutive slashes with a single slash
  // 4. Keep trailing slash if path is not root
  let normalizedPath: string;
  try {
    // First split off query parameters and hash fragments
    const pathWithoutQuery = path.split(/[?#]/)[0];

    // Then decode the path - this needs to happen before any normalization
    // so encoded characters are properly handled
    const decodedPath = decodeURIComponent(pathWithoutQuery);

    // Normalize the path (just clean up slashes)
    normalizedPath = decodedPath
      .replace(/\\/g, "/") // replace backslashes
      .replace(/\/+/g, "/") // collapse slashes
      .replace(/(.+?)\/+$/, "$1"); // trim trailing slashes
  } catch {
    // If decoding fails (e.g., invalid % encoding), return undefined
    return undefined;
  }

  // Find matching route pattern
  const matchingRoutes = routePatterns.filter(({ pattern, verb }) => {
    const matchesPath = pattern.test(normalizedPath);
    const upperMethod = method.toUpperCase();
    const matchesVerb = verb === "*" || upperMethod === verb;

    const result = matchesPath && matchesVerb;
    return result;
  });

  if (matchingRoutes.length === 0) {
    return undefined;
  }

  // Use the most specific route (longest path pattern)
  const matchingRoute = matchingRoutes.reduce((a, b) =>
    b.pattern.source.length > a.pattern.source.length ? b : a,
  );

  return matchingRoute;
}

/**
 * Gets the default asset (USDC) for the given network
 *
 * @param network - The network to get the default asset for
 * @returns The default asset
 */
export function getDefaultAsset(network: Network) {
  const chainId = getNetworkId(network);
  const usdc = getUsdcChainConfigForChain(chainId);
  if (!usdc) {
    throw new Error(`Unable to get default asset on ${network}`);
  }
  return {
    address: usdc.usdcAddress,
    decimals: 6,
    eip712: {
      name: usdc.usdcName,
      version: "2",
    },
  };
}

/**
 * Parses the amount from the given price
 *
 * @param price - The price to parse
 * @param network - The network to get the default asset for
 * @returns The parsed amount or an error message
 */
export function processPriceToAtomicAmount(
  price: Price,
  network: Network,
): { maxAmountRequired: string; asset: ERC20TokenAmount["asset"] } | { error: string } {
  // Handle USDC amount (string) or token amount (ERC20TokenAmount)
  let maxAmountRequired: string;
  let asset: ERC20TokenAmount["asset"];

  if (typeof price === "string" || typeof price === "number") {
    // USDC amount in dollars
    const parsedAmount = moneySchema.safeParse(price);
    if (!parsedAmount.success) {
      return {
        error: `Invalid price (price: ${price}). Must be in the form "$3.10", 0.10, "0.001", ${parsedAmount.error}`,
      };
    }
    const parsedUsdAmount = parsedAmount.data;
    asset = getDefaultAsset(network);
    maxAmountRequired = (parsedUsdAmount * 10 ** asset.decimals).toString();
  } else {
    // Token amount in atomic units
    maxAmountRequired = price.amount;
    asset = price.asset;
  }

  return {
    maxAmountRequired,
    asset,
  };
}

/**
 * Finds the matching payment requirements for the given payment
 *
 * @param paymentRequirements - The payment requirements to search through
 * @param payment - The payment to match against
 * @returns The matching payment requirements or undefined if no match is found
 */
export function findMatchingPaymentRequirements(
  paymentRequirements: PaymentRequirements[],
  payment: PaymentPayload,
) {
  return paymentRequirements.find(
    value => value.scheme === payment.scheme && value.network === payment.network,
  );
}

/**
 * Decodes the X-PAYMENT-RESPONSE header
 *
 * @param header - The X-PAYMENT-RESPONSE header to decode
 * @returns The decoded payment response
 */
export function decodeXPaymentResponse(header: string) {
  const decoded = safeBase64Decode(header);
  return JSON.parse(decoded) as {
    success: boolean;
    transaction: Hex;
    network: Network;
    payer: Address;
  };
}



================================================
FILE: typescript/packages/x402/src/shared/network.ts
================================================
import { EvmNetworkToChainId, Network } from "../types/shared";

/**
 * Converts a network name to its corresponding chain ID
 *
 * @param network - The network name to convert to a chain ID
 * @returns The chain ID for the specified network
 * @throws Error if the network is not supported
 */
export function getNetworkId(network: Network): number {
  if (EvmNetworkToChainId.has(network)) {
    return EvmNetworkToChainId.get(network)!;
  }
  // TODO: Solana
  throw new Error(`Unsupported network: ${network}`);
}



================================================
FILE: typescript/packages/x402/src/shared/paywall.ts
================================================
import { PAYWALL_TEMPLATE } from "../paywall/gen/template";
import { config } from "../types/shared/evm/config";
import { PaymentRequirements } from "../types/verify";

interface PaywallOptions {
  amount: number;
  paymentRequirements: PaymentRequirements[];
  currentUrl: string;
  testnet: boolean;
  cdpClientKey?: string;
  appName?: string;
  appLogo?: string;
  sessionTokenEndpoint?: string;
}

/**
 * Escapes a string for safe injection into JavaScript string literals
 *
 * @param str - The string to escape
 * @returns The escaped string
 */
function escapeString(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

/**
 * Generates an HTML paywall page that allows users to pay for content access
 *
 * @param options - The options for generating the paywall
 * @param options.amount - The amount to be paid in USD
 * @param options.paymentRequirements - The payment requirements for the content
 * @param options.currentUrl - The URL of the content being accessed
 * @param options.testnet - Whether to use testnet or mainnet
 * @param options.cdpClientKey - CDP client API key for OnchainKit
 * @param options.appName - The name of the application to display in the wallet connection modal
 * @param options.appLogo - The logo of the application to display in the wallet connection modal
 * @param options.sessionTokenEndpoint - The API endpoint for generating session tokens for Onramp authentication
 * @returns An HTML string containing the paywall page
 */
export function getPaywallHtml({
  amount,
  testnet,
  paymentRequirements,
  currentUrl,
  cdpClientKey,
  appName,
  appLogo,
  sessionTokenEndpoint,
}: PaywallOptions): string {
  const logOnTestnet = testnet
    ? "console.log('Payment requirements initialized:', window.x402);"
    : "";

  // Create the configuration script to inject with proper escaping
  const configScript = `
  <script>
    window.x402 = {
      amount: ${amount},
      paymentRequirements: ${JSON.stringify(paymentRequirements)},
      testnet: ${testnet},
      currentUrl: "${escapeString(currentUrl)}",
      config: {
        chainConfig: ${JSON.stringify(config)},
      },
      cdpClientKey: "${escapeString(cdpClientKey || "")}",
      appName: "${escapeString(appName || "")}",
      appLogo: "${escapeString(appLogo || "")}",
      sessionTokenEndpoint: "${escapeString(sessionTokenEndpoint || "")}",
    };
    ${logOnTestnet}
  </script>`;

  // Inject the configuration script into the head
  return PAYWALL_TEMPLATE.replace("</head>", `${configScript}\n</head>`);
}



================================================
FILE: typescript/packages/x402/src/shared/evm/erc20.ts
================================================
import { Account, Address, Chain, Transport } from "viem";
import { usdcABI as erc20PermitABI } from "../../types/shared/evm/erc20PermitABI";
import { ConnectedClient } from "../../types/shared/evm/wallet";

/**
 * Gets the USDC balance for a specific address
 *
 * @param client - The Viem client instance connected to the blockchain
 * @param erc20Address - The address of the ERC20 contract
 * @param address - The address to check the USDC balance for
 * @returns A promise that resolves to the USDC balance as a bigint
 */
export async function getERC20Balance<
  transport extends Transport,
  chain extends Chain,
  account extends Account | undefined = undefined,
>(
  client: ConnectedClient<transport, chain, account>,
  erc20Address: Address,
  address: Address,
): Promise<bigint> {
  const balance = await client.readContract({
    address: erc20Address,
    abi: erc20PermitABI,
    functionName: "balanceOf",
    args: [address],
  });
  return balance as bigint;
}



================================================
FILE: typescript/packages/x402/src/shared/evm/index.ts
================================================
export * from "./usdc";
export * from "./erc20";



================================================
FILE: typescript/packages/x402/src/shared/evm/usdc.ts
================================================
import { Account, Address, Chain, Client, Transport } from "viem";
import { ChainConfig, config } from "../../types/shared/evm/config";
import { usdcABI as abi } from "../../types/shared/evm/erc20PermitABI";
import { ConnectedClient } from "../../types/shared/evm/wallet";

/**
 * Gets the USDC contract address for the current chain from the client
 *
 * @param client - The Viem client instance connected to the blockchain
 * @returns The USDC contract address for the current chain
 */
export function getUsdcAddress<
  transport extends Transport,
  chain extends Chain | undefined = undefined,
  account extends Account | undefined = undefined,
>(client: Client<transport, chain, account>): Address {
  return config[client.chain!.id.toString()].usdcAddress as Address;
}

/**
 * Gets the USDC contract address for a specific chain ID
 *
 * @deprecated Use `getUsdcChainConfigForChain` instead
 * @param chainId - The chain ID to get the USDC contract address for
 * @returns The USDC contract address for the specified chain
 */
export function getUsdcAddressForChain(chainId: number): Address {
  return config[chainId.toString()].usdcAddress as Address;
}

/**
 * Gets the USDC address and eip712 domain name for a specific chain ID
 *
 * @param chainId - The chain ID
 * @returns The USDC contract address and eip712 domain name  for the specified chain
 */
export function getUsdcChainConfigForChain(chainId: number): ChainConfig | undefined {
  return config[chainId.toString()];
}

// Cache for storing the version value
let versionCache: string | null = null;

/**
 * Gets the version of the USDC contract, using a cache to avoid repeated calls
 *
 * @param client - The Viem client instance connected to the blockchain
 * @returns A promise that resolves to the USDC contract version string
 */
export async function getVersion<
  transport extends Transport,
  chain extends Chain,
  account extends Account | undefined = undefined,
>(client: ConnectedClient<transport, chain, account>): Promise<string> {
  // Return cached version if available
  if (versionCache !== null) {
    return versionCache;
  }

  // Fetch and cache version if not available
  const version = await client.readContract({
    address: getUsdcAddress(client),
    abi,
    functionName: "version",
  });
  versionCache = version as string;
  return versionCache;
}

/**
 * Gets the USDC balance for a specific address
 *
 * @param client - The Viem client instance connected to the blockchain
 * @param address - The address to check the USDC balance for
 * @returns A promise that resolves to the USDC balance as a bigint
 */
export async function getUSDCBalance<
  transport extends Transport,
  chain extends Chain,
  account extends Account | undefined = undefined,
>(client: ConnectedClient<transport, chain, account>, address: Address): Promise<bigint> {
  const chainId = client.chain!.id;
  const usdc = getUsdcChainConfigForChain(chainId);
  if (!usdc) {
    return 0n;
  }
  const balance = await client.readContract({
    address: usdc.usdcAddress,
    abi,
    functionName: "balanceOf",
    args: [address],
  });
  return balance as bigint;
}



================================================
FILE: typescript/packages/x402/src/types/index.ts
================================================
export * from "./shared";
export * from "./verify";



================================================
FILE: typescript/packages/x402/src/types/shared/index.ts
================================================
export * from "./money";
export * from "./network";
export * from "./resource";
export * from "./middleware";
export * as evm from "./evm";



================================================
FILE: typescript/packages/x402/src/types/shared/middleware.ts
================================================
import { CreateHeaders } from "../../verify";
import { Money } from "./money";
import { Network } from "./network";
import { Resource } from "./resource";
import { LocalAccount } from "viem";
import { SignerWallet } from "./evm";
import { HTTPRequestStructure } from "..";

export type FacilitatorConfig = {
  url: Resource;
  createAuthHeaders?: CreateHeaders;
};

export type PaywallConfig = {
  cdpClientKey?: string;
  appName?: string;
  appLogo?: string;
  sessionTokenEndpoint?: string;
};

export type PaymentMiddlewareConfig = {
  description?: string;
  mimeType?: string;
  maxTimeoutSeconds?: number;
  inputSchema?: Omit<HTTPRequestStructure, "type" | "method">;
  outputSchema?: object;
  discoverable?: boolean;
  customPaywallHtml?: string;
  resource?: Resource;
  errorMessages?: {
    paymentRequired?: string;
    invalidPayment?: string;
    noMatchingRequirements?: string;
    verificationFailed?: string;
    settlementFailed?: string;
  };
};

export interface ERC20TokenAmount {
  amount: string;
  asset: {
    address: `0x${string}`;
    decimals: number;
    eip712: {
      name: string;
      version: string;
    };
  };
}

export type Price = Money | ERC20TokenAmount;

export interface RouteConfig {
  price: Price;
  network: Network;
  config?: PaymentMiddlewareConfig;
}

export type RoutesConfig = Record<string, Price | RouteConfig>;

export interface RoutePattern {
  verb: string;
  pattern: RegExp;
  config: RouteConfig;
}

export type Wallet = SignerWallet | LocalAccount;



================================================
FILE: typescript/packages/x402/src/types/shared/money.ts
================================================
import { z } from "zod";

export const moneySchema = z
  .union([z.string().transform(x => x.replace(/[^0-9.-]+/g, "")), z.number()])
  .pipe(z.coerce.number().min(0.0001).max(999999999));

export type Money = z.input<typeof moneySchema>;



================================================
FILE: typescript/packages/x402/src/types/shared/network.ts
================================================
import { z } from "zod";

export const NetworkSchema = z.enum([
  "base-sepolia",
  "base",
  "avalanche-fuji",
  "avalanche",
  "iotex",
  "sei",
  "sei-testnet",
]);
export type Network = z.infer<typeof NetworkSchema>;

export const SupportedEVMNetworks: Network[] = [
  "base-sepolia",
  "base",
  "avalanche-fuji",
  "avalanche",
  "iotex",
  "sei",
  "sei-testnet",
];
export const EvmNetworkToChainId = new Map<Network, number>([
  ["base-sepolia", 84532],
  ["base", 8453],
  ["avalanche-fuji", 43113],
  ["avalanche", 43114],
  ["iotex", 4689],
  ["sei", 1329],
  ["sei-testnet", 1328],
]);

export const ChainIdToNetwork = Object.fromEntries(
  SupportedEVMNetworks.map(network => [EvmNetworkToChainId.get(network), network]),
) as Record<number, Network>;



================================================
FILE: typescript/packages/x402/src/types/shared/resource.ts
================================================
export type Resource = `${string}://${string}`;



================================================
FILE: typescript/packages/x402/src/types/shared/evm/config.ts
================================================
import { Address } from "viem";

export const config: Record<string, ChainConfig> = {
  "84532": {
    usdcAddress: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    usdcName: "USDC",
  },
  "8453": {
    usdcAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    usdcName: "USD Coin",
  },
  "43113": {
    usdcAddress: "0x5425890298aed601595a70AB815c96711a31Bc65",
    usdcName: "USD Coin",
  },
  "43114": {
    usdcAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    usdcName: "USD Coin",
  },
  "4689": {
    usdcAddress: "0xcdf79194c6c285077a58da47641d4dbe51f63542",
    usdcName: "Bridged USDC",
  },
  "1328": {
    usdcAddress: "0x4fcf1784b31630811181f670aea7a7bef803eaed",
    usdcName: "USDC",
  },
  "1329": {
    usdcAddress: "0xe15fc38f6d8c56af07bbcbe3baf5708a2bf42392",
    usdcName: "USDC",
  },
};

export type ChainConfig = {
  usdcAddress: Address;
  usdcName: string;
};



================================================
FILE: typescript/packages/x402/src/types/shared/evm/eip3009.ts
================================================
export const authorizationTypes = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
};

export const authorizationPrimaryType = "TransferWithAuthorization";



================================================
FILE: typescript/packages/x402/src/types/shared/evm/erc20PermitABI.ts
================================================
export const usdcABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authorizer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "nonce",
        type: "bytes32",
      },
    ],
    name: "AuthorizationCanceled",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "authorizer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "nonce",
        type: "bytes32",
      },
    ],
    name: "AuthorizationUsed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "Blacklisted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newBlacklister",
        type: "address",
      },
    ],
    name: "BlacklisterChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "burner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Burn",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newMasterMinter",
        type: "address",
      },
    ],
    name: "MasterMinterChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "minter",
        type: "address",
      },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Mint",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "minter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minterAllowedAmount",
        type: "uint256",
      },
    ],
    name: "MinterConfigured",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "oldMinter",
        type: "address",
      },
    ],
    name: "MinterRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Pause", type: "event" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newAddress",
        type: "address",
      },
    ],
    name: "PauserChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newRescuer",
        type: "address",
      },
    ],
    name: "RescuerChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "_account",
        type: "address",
      },
    ],
    name: "UnBlacklisted",
    type: "event",
  },
  { anonymous: false, inputs: [], name: "Unpause", type: "event" },
  {
    inputs: [],
    name: "CANCEL_AUTHORIZATION_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "RECEIVE_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "TRANSFER_WITH_AUTHORIZATION_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "authorizer", type: "address" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
    ],
    name: "authorizationState",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "blacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "blacklister",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "authorizer", type: "address" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "cancelAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "authorizer", type: "address" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "cancelAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "minter", type: "address" },
      { internalType: "uint256", name: "minterAllowedAmount", type: "uint256" },
    ],
    name: "configureMinter",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currency",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "decrement", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "increment", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "string", name: "tokenName", type: "string" },
      { internalType: "string", name: "tokenSymbol", type: "string" },
      { internalType: "string", name: "tokenCurrency", type: "string" },
      { internalType: "uint8", name: "tokenDecimals", type: "uint8" },
      { internalType: "address", name: "newMasterMinter", type: "address" },
      { internalType: "address", name: "newPauser", type: "address" },
      { internalType: "address", name: "newBlacklister", type: "address" },
      { internalType: "address", name: "newOwner", type: "address" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "newName", type: "string" }],
    name: "initializeV2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "lostAndFound", type: "address" }],
    name: "initializeV2_1",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accountsToBlacklist",
        type: "address[]",
      },
      { internalType: "string", name: "newSymbol", type: "string" },
    ],
    name: "initializeV2_2",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "isBlacklisted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "isMinter",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "masterMinter",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_to", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "minter", type: "address" }],
    name: "minterAllowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "nonces",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pauser",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "validAfter", type: "uint256" },
      { internalType: "uint256", name: "validBefore", type: "uint256" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "receiveWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "validAfter", type: "uint256" },
      { internalType: "uint256", name: "validBefore", type: "uint256" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "receiveWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "minter", type: "address" }],
    name: "removeMinter",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "tokenContract",
        type: "address",
      },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "rescueERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "rescuer",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "validAfter", type: "uint256" },
      { internalType: "uint256", name: "validBefore", type: "uint256" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "bytes", name: "signature", type: "bytes" },
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
      { internalType: "uint256", name: "validAfter", type: "uint256" },
      { internalType: "uint256", name: "validBefore", type: "uint256" },
      { internalType: "bytes32", name: "nonce", type: "bytes32" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "transferWithAuthorization",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "unBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newBlacklister", type: "address" }],
    name: "updateBlacklister",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newMasterMinter", type: "address" }],
    name: "updateMasterMinter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_newPauser", type: "address" }],
    name: "updatePauser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newRescuer", type: "address" }],
    name: "updateRescuer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "pure",
    type: "function",
  },
] as const;



================================================
FILE: typescript/packages/x402/src/types/shared/evm/index.ts
================================================
export * from "./config";
export * from "./eip3009";
export * from "./erc20PermitABI";
export * from "./wallet";



================================================
FILE: typescript/packages/x402/src/types/shared/evm/wallet.test.ts
================================================
import { describe, expect, it, vi } from "vitest";
import { base, baseSepolia, avalancheFuji } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { createConnectedClient, createSigner } from "./wallet";

// Mock viem modules
vi.mock("viem", async () => {
  const actual = await vi.importActual("viem");
  return {
    ...actual,
    createPublicClient: vi.fn().mockImplementation(({ chain, transport }) => ({
      chain,
      transport,
      extend: vi.fn().mockReturnValue({
        chain,
        transport,
        // Mock public client methods
        getBlockNumber: vi.fn(),
        getBalance: vi.fn(),
      }),
    })),
    createWalletClient: vi.fn().mockImplementation(({ chain, transport, account }) => ({
      chain,
      transport,
      account,
      extend: vi.fn().mockReturnValue({
        chain,
        transport,
        account,
        // Mock wallet client methods
        sendTransaction: vi.fn(),
        signMessage: vi.fn(),
      }),
    })),
    http: vi.fn().mockReturnValue("mock-transport"),
    publicActions: vi.fn(),
  };
});

vi.mock("viem/accounts", () => ({
  privateKeyToAccount: vi.fn().mockImplementation(privateKey => ({
    address: "0x1234567890123456789012345678901234567890",
    privateKey,
    type: "local",
    source: "privateKey",
    sign: vi.fn(),
    signMessage: vi.fn(),
    signTransaction: vi.fn(),
    signTypedData: vi.fn(),
  })),
}));

describe("createConnectedClient", () => {
  it("should create a public client for base network", () => {
    const client = createConnectedClient("base");

    expect(client.chain).toEqual(base);
    expect(client.transport).toBe("mock-transport");
  });

  it("should create a public client for base-sepolia network", () => {
    const client = createConnectedClient("base-sepolia");

    expect(client.chain).toEqual(baseSepolia);
    expect(client.transport).toBe("mock-transport");
  });

  it("should create a public client for avalanche-fuji network", () => {
    const client = createConnectedClient("avalanche-fuji");

    expect(client.chain).toEqual(avalancheFuji);
    expect(client.transport).toBe("mock-transport");
  });

  it("should throw an error for unsupported network", () => {
    expect(() => createConnectedClient("unsupported-network")).toThrow(
      "Unsupported network: unsupported-network",
    );
  });

  it("should throw an error for empty network", () => {
    expect(() => createConnectedClient("")).toThrow("NETWORK environment variable is not set");
  });

  it("should throw an error for undefined network", () => {
    expect(() => createConnectedClient(undefined as unknown as string)).toThrow(
      "NETWORK environment variable is not set",
    );
  });
});

describe("createSigner", () => {
  const mockPrivateKey =
    "0x1234567890123456789012345678901234567890123456789012345678901234" as const;

  it("should create a wallet client for base network with private key", () => {
    const signer = createSigner("base", mockPrivateKey);

    expect(signer.chain).toEqual(base);
    expect(signer.transport).toBe("mock-transport");
    expect(signer.account).toBeDefined();
    expect(signer.account.address).toBe("0x1234567890123456789012345678901234567890");
    expect(privateKeyToAccount).toHaveBeenCalledWith(mockPrivateKey);
  });

  it("should create a wallet client for base-sepolia network with private key", () => {
    const signer = createSigner("base-sepolia", mockPrivateKey);

    expect(signer.chain).toEqual(baseSepolia);
    expect(signer.transport).toBe("mock-transport");
    expect(signer.account).toBeDefined();
    expect(signer.account.address).toBe("0x1234567890123456789012345678901234567890");
    expect(privateKeyToAccount).toHaveBeenCalledWith(mockPrivateKey);
  });

  it("should create a wallet client for avalanche-fuji network with private key", () => {
    const signer = createSigner("avalanche-fuji", mockPrivateKey);

    expect(signer.chain).toEqual(avalancheFuji);
    expect(signer.transport).toBe("mock-transport");
    expect(signer.account).toBeDefined();
    expect(signer.account.address).toBe("0x1234567890123456789012345678901234567890");
    expect(privateKeyToAccount).toHaveBeenCalledWith(mockPrivateKey);
  });

  it("should throw an error for unsupported network", () => {
    expect(() => createSigner("unsupported-network", mockPrivateKey)).toThrow(
      "Unsupported network: unsupported-network",
    );
  });

  it("should throw an error for empty network", () => {
    expect(() => createSigner("", mockPrivateKey)).toThrow(
      "NETWORK environment variable is not set",
    );
  });

  it("should throw an error for undefined network", () => {
    expect(() => createSigner(undefined as unknown as string, mockPrivateKey)).toThrow(
      "NETWORK environment variable is not set",
    );
  });

  it("should handle different private key formats", () => {
    const differentPrivateKey =
      "0xabcdef1234567890123456789012345678901234567890123456789012345678" as const;
    const signer = createSigner("base", differentPrivateKey);

    expect(privateKeyToAccount).toHaveBeenCalledWith(differentPrivateKey);
    expect(signer.account).toBeDefined();
  });

  it("should create unique signers for the same network with different private keys", () => {
    const privateKey1 =
      "0x1111111111111111111111111111111111111111111111111111111111111111" as const;
    const privateKey2 =
      "0x2222222222222222222222222222222222222222222222222222222222222222" as const;

    const signer1 = createSigner("base", privateKey1);
    const signer2 = createSigner("base", privateKey2);

    expect(signer1.account).toBeDefined();
    expect(signer2.account).toBeDefined();
    expect(privateKeyToAccount).toHaveBeenCalledWith(privateKey1);
    expect(privateKeyToAccount).toHaveBeenCalledWith(privateKey2);
  });
});



================================================
FILE: typescript/packages/x402/src/types/shared/evm/wallet.ts
================================================
import { createPublicClient, createWalletClient, http, publicActions } from "viem";
import type {
  Chain,
  Transport,
  Client,
  Account,
  RpcSchema,
  PublicActions,
  WalletActions,
  PublicClient,
  LocalAccount,
} from "viem";
import { baseSepolia, avalancheFuji, base, sei, seiTestnet } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import { Hex } from "viem";

// Create a public client for reading data
export type SignerWallet<
  chain extends Chain = Chain,
  transport extends Transport = Transport,
  account extends Account = Account,
> = Client<
  transport,
  chain,
  account,
  RpcSchema,
  PublicActions<transport, chain, account> & WalletActions<chain, account>
>;

export type ConnectedClient<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain,
  account extends Account | undefined = undefined,
> = PublicClient<transport, chain, account>;

/**
 * Creates a public client configured for the specified network
 *
 * @param network - The network to connect to
 * @returns A public client instance connected to the specified chain
 */
export function createConnectedClient(
  network: string,
): ConnectedClient<Transport, Chain, undefined> {
  const chain = getChainFromNetwork(network);
  return createPublicClient({
    chain,
    transport: http(),
  }).extend(publicActions);
}

/**
 * Creates a public client configured for the Base Sepolia testnet
 *
 * @deprecated Use `createConnectedClient("base-sepolia")` instead
 * @returns A public client instance connected to Base Sepolia
 */
export function createClientSepolia(): ConnectedClient<Transport, typeof baseSepolia, undefined> {
  return createConnectedClient("base-sepolia") as ConnectedClient<
    Transport,
    typeof baseSepolia,
    undefined
  >;
}

/**
 * Creates a public client configured for the Avalanche Fuji testnet
 *
 * @deprecated Use `createConnectedClient("avalanche-fuji")` instead
 * @returns A public client instance connected to Avalanche Fuji
 */
export function createClientAvalancheFuji(): ConnectedClient<
  Transport,
  typeof avalancheFuji,
  undefined
> {
  return createConnectedClient("avalanche-fuji") as ConnectedClient<
    Transport,
    typeof avalancheFuji,
    undefined
  >;
}

/**
 * Creates a wallet client configured for the specified chain with a private key
 *
 * @param network - The network to connect to
 * @param privateKey - The private key to use for signing transactions
 * @returns A wallet client instance connected to the specified chain with the provided private key
 */
export function createSigner(network: string, privateKey: Hex): SignerWallet<Chain> {
  const chain = getChainFromNetwork(network);
  return createWalletClient({
    chain,
    transport: http(),
    account: privateKeyToAccount(privateKey),
  }).extend(publicActions);
}

/**
 * Creates a wallet client configured for the Base Sepolia testnet with a private key
 *
 * @deprecated Use `createSigner("base-sepolia", privateKey)` instead
 * @param privateKey - The private key to use for signing transactions
 * @returns A wallet client instance connected to Base Sepolia with the provided private key
 */
export function createSignerSepolia(privateKey: Hex): SignerWallet<typeof baseSepolia> {
  return createSigner("base-sepolia", privateKey) as SignerWallet<typeof baseSepolia>;
}

/**
 * Creates a wallet client configured for the Avalanche Fuji testnet with a private key
 *
 * @deprecated Use `createSigner("avalanche-fuji", privateKey)` instead
 * @param privateKey - The private key to use for signing transactions
 * @returns A wallet client instance connected to Avalanche Fuji with the provided private key
 */
export function createSignerAvalancheFuji(privateKey: Hex): SignerWallet<typeof avalancheFuji> {
  return createSigner("avalanche-fuji", privateKey) as SignerWallet<typeof avalancheFuji>;
}

/**
 * Checks if a wallet is a signer wallet
 *
 * @param wallet - The wallet to check
 * @returns True if the wallet is a signer wallet, false otherwise
 */
export function isSignerWallet<
  TChain extends Chain = Chain,
  TTransport extends Transport = Transport,
  TAccount extends Account = Account,
>(
  wallet: SignerWallet<TChain, TTransport, TAccount> | LocalAccount,
): wallet is SignerWallet<TChain, TTransport, TAccount> {
  return (
    typeof wallet === "object" && wallet !== null && "chain" in wallet && "transport" in wallet
  );
}

/**
 * Checks if a wallet is an account
 *
 * @param wallet - The wallet to check
 * @returns True if the wallet is an account, false otherwise
 */
export function isAccount<
  TChain extends Chain = Chain,
  TTransport extends Transport = Transport,
  TAccount extends Account = Account,
>(wallet: SignerWallet<TChain, TTransport, TAccount> | LocalAccount): wallet is LocalAccount {
  const w = wallet as LocalAccount;
  return (
    typeof wallet === "object" &&
    wallet !== null &&
    typeof w.address === "string" &&
    typeof w.type === "string" &&
    // Check for essential signing capabilities
    typeof w.sign === "function" &&
    typeof w.signMessage === "function" &&
    typeof w.signTypedData === "function" &&
    // Check for transaction signing (required by LocalAccount)
    typeof w.signTransaction === "function"
  );
}

/**
 * Maps network strings to Chain objects
 *
 * @param network - The network string to convert to a Chain object
 * @returns The corresponding Chain object
 */
function getChainFromNetwork(network: string | undefined): Chain {
  if (!network) {
    throw new Error("NETWORK environment variable is not set");
  }

  switch (network) {
    case "base":
      return base;
    case "base-sepolia":
      return baseSepolia;
    case "avalanche-fuji":
      return avalancheFuji;
    case "sei":
      return sei;
    case "sei-testnet":
      return seiTestnet;
    default:
      throw new Error(`Unsupported network: ${network}`);
  }
}



================================================
FILE: typescript/packages/x402/src/types/verify/facilitator.ts
================================================
import { z } from "zod";
import { safeBase64Decode, safeBase64Encode } from "../../shared";
import { PaymentRequirementsSchema, SettleResponse } from "./x402Specs";

export const facilitatorRequestSchema = z.object({
  paymentHeader: z.string(),
  paymentRequirements: PaymentRequirementsSchema,
});

export type FacilitatorRequest = z.infer<typeof facilitatorRequestSchema>;

/**
 * Encodes a settlement response into a base64 header string
 *
 * @param response - The settlement response to encode
 * @returns A base64 encoded string containing the settlement response
 */
export function settleResponseHeader(response: SettleResponse): string {
  return safeBase64Encode(JSON.stringify(response));
}

/**
 * Decodes a base64 header string back into a settlement response
 *
 * @param header - The base64 encoded settlement response header
 * @returns The decoded settlement response object
 */
export function settleResponseFromHeader(header: string): SettleResponse {
  const decoded = safeBase64Decode(header);
  return JSON.parse(decoded) as SettleResponse;
}



================================================
FILE: typescript/packages/x402/src/types/verify/index.ts
================================================
export * from "./x402Specs";
export * from "./facilitator";



================================================
FILE: typescript/packages/x402/src/types/verify/x402Specs.test.ts
================================================
import { describe, it, expect } from "vitest";

describe("x402Specs Regex Patterns", () => {
  // Import the regex patterns from the source file
  const EvmAddressRegex = /^0x[0-9a-fA-F]{40}$/;
  const HexEncoded64ByteRegex = /^0x[0-9a-fA-F]{64}$/;
  const EvmECDSASignatureRegex = /^0x[0-9a-fA-F]{130}$/;
  const Evm6492SignatureRegex =
    /^0x[0-9a-fA-F]+6492649264926492649264926492649264926492649264926492649264926492$/;

  describe("EvmAddressRegex", () => {
    it("should match valid EVM addresses", () => {
      const validAddresses = [
        "0x1234567890123456789012345678901234567890",
        "0xAbCdEfAbCdEfAbCdEfAbCdEfAbCdEfAbCdEfAbCd",
        "0x0000000000000000000000000000000000000000",
        "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
        "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
        "0x1a2b3c4d5e6f7890123456789012345678901234",
      ];

      validAddresses.forEach(address => {
        expect(EvmAddressRegex.test(address)).toBe(true);
      });
    });

    it("should reject invalid EVM addresses", () => {
      const invalidAddresses = [
        "0x123", // Too short
        "0x12345678901234567890123456789012345678901", // Too long
        "1234567890123456789012345678901234567890", // Missing 0x prefix
        "0xGHIJ567890123456789012345678901234567890", // Invalid hex chars
        "0xg234567890123456789012345678901234567890", // Invalid hex char 'g'
        "", // Empty string
        "0x", // Just prefix
        "0X1234567890123456789012345678901234567890", // Wrong case prefix
        "0x123456789012345678901234567890123456789", // 39 chars (too short)
        "0x12345678901234567890123456789012345678901", // 41 chars (too long)
      ];

      invalidAddresses.forEach(address => {
        expect(EvmAddressRegex.test(address)).toBe(false);
      });
    });
  });

  describe("HexEncoded64ByteRegex", () => {
    it("should match valid 64-byte hex strings", () => {
      const validHexStrings = [
        "0x" + "0".repeat(64), // All zeros
        "0x" + "f".repeat(64), // All f's
        "0x" + "F".repeat(64), // All F's (uppercase)
        "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        "0xABCDEF1234567890ABCDEF1234567890ABCDEF1234567890ABCDEF1234567890",
        "0x" + "123456789abcdef0".repeat(4), // Pattern repeated
      ];

      validHexStrings.forEach(hexString => {
        expect(HexEncoded64ByteRegex.test(hexString)).toBe(true);
      });
    });

    it("should reject invalid hex strings", () => {
      const invalidHexStrings = [
        "0x" + "0".repeat(63), // Too short
        "0x" + "0".repeat(65), // Too long
        "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef", // No 0x prefix
        "0x" + "g".repeat(64), // Invalid hex character
        "0x" + "0".repeat(32), // 32 bytes instead of 64
        "", // Empty string
        "0x", // Just prefix
        "0X" + "0".repeat(64), // Wrong case prefix
      ];

      invalidHexStrings.forEach(hexString => {
        expect(HexEncoded64ByteRegex.test(hexString)).toBe(false);
      });
    });
  });

  describe("EvmECDSASignatureRegex", () => {
    it("should match valid ECDSA signatures", () => {
      const validSignatures = [
        "0x" + "0".repeat(130), // All zeros
        "0x" + "f".repeat(130), // All f's
        "0x" + "F".repeat(130), // All F's (uppercase)
        "0x" + "1234567890abcdef".repeat(8) + "12", // Mixed case
        "0x" + "ABCDEF1234567890".repeat(8) + "12", // Exactly 130 hex chars
      ];

      validSignatures.forEach(signature => {
        expect(EvmECDSASignatureRegex.test(signature)).toBe(true);
      });
    });

    it("should reject invalid ECDSA signatures", () => {
      const invalidSignatures = [
        "0x" + "0".repeat(129), // Too short
        "0x" + "0".repeat(131), // Too long
        "1234567890abcdef".repeat(8) + "12", // No 0x prefix
        "0x" + "g".repeat(130), // Invalid hex character
        "0x" + "0".repeat(64), // Too short (64 bytes)
        "", // Empty string
        "0x", // Just prefix
        "0X" + "0".repeat(130), // Wrong case prefix
      ];

      invalidSignatures.forEach(signature => {
        expect(EvmECDSASignatureRegex.test(signature)).toBe(false);
      });
    });
  });

  describe("Evm6492SignatureRegex", () => {
    const erc6492Suffix = "6492649264926492649264926492649264926492649264926492649264926492";

    it("should match valid ERC-6492 signatures with minimum hex chars", () => {
      const validSignatures = [
        "0x" + "a" + erc6492Suffix, // Just 1 hex char before suffix
        "0x" + "12" + erc6492Suffix, // 2 hex chars before suffix
        "0x" + "abc" + erc6492Suffix, // 3 hex chars before suffix
        "0x" + "F" + erc6492Suffix, // Single uppercase hex char
      ];

      validSignatures.forEach(signature => {
        expect(Evm6492SignatureRegex.test(signature)).toBe(true);
      });
    });

    it("should match valid ERC-6492 signatures at various lengths", () => {
      const validSignatures = [
        "0x" + "0".repeat(130) + erc6492Suffix, // Standard ECDSA length
        "0x" + "a".repeat(200) + erc6492Suffix, // 200 chars before suffix
        "0x" + "b".repeat(500) + erc6492Suffix, // 500 chars before suffix
        "0x" + "c".repeat(1000) + erc6492Suffix, // 1000 chars before suffix
        "0x" + "d".repeat(5000) + erc6492Suffix, // Very long signature
        "0x" + "1234567890abcdef".repeat(100) + erc6492Suffix, // Pattern repeated
      ];

      validSignatures.forEach(signature => {
        expect(Evm6492SignatureRegex.test(signature)).toBe(true);
      });
    });

    it("should reject invalid ERC-6492 signatures", () => {
      const invalidSignatures = [
        "0x" + erc6492Suffix, // No hex chars before suffix
        "0x" + "0".repeat(130) + "1234567890123456789012345678901234567890123456789012345678901234", // Wrong suffix
        "0x" + "0".repeat(130), // Missing suffix
        "0x" + "g" + erc6492Suffix, // Invalid hex character
        "1234567890abcdef" + erc6492Suffix, // No 0x prefix
        "", // Empty string
        "0x", // Just prefix
        "0X" + "a" + erc6492Suffix, // Wrong case prefix
        "0x" + "a" + erc6492Suffix.slice(0, -1), // Incomplete suffix
        "0x" + "a" + erc6492Suffix + "1", // Extra characters after suffix
        erc6492Suffix, // Just suffix, no prefix or hex
      ];

      invalidSignatures.forEach(signature => {
        expect(Evm6492SignatureRegex.test(signature)).toBe(false);
      });
    });

    it("should handle mixed case hex characters", () => {
      const validSignatures = [
        "0x" + "AbCdEf123456" + erc6492Suffix,
        "0x" + "DEADBEEF" + erc6492Suffix,
        "0x" + "cafebabe" + erc6492Suffix,
      ];

      validSignatures.forEach(signature => {
        expect(Evm6492SignatureRegex.test(signature)).toBe(true);
      });
    });
  });
});



================================================
FILE: typescript/packages/x402/src/types/verify/x402Specs.ts
================================================
import { z } from "zod";
import { NetworkSchema } from "../shared";
// Constants
const EvmMaxAtomicUnits = 18;
const EvmAddressRegex = /^0x[0-9a-fA-F]{40}$/;
const MixedAddressRegex = /^0x[a-fA-F0-9]{40}|[A-Za-z0-9][A-Za-z0-9-]{0,34}[A-Za-z0-9]$/;
const HexEncoded64ByteRegex = /^0x[0-9a-fA-F]{64}$/;
const EvmSignatureRegex = /^0x[0-9a-fA-F]+$/; // Flexible hex signature validation
// Enums
export const schemes = ["exact"] as const;
export const x402Versions = [1] as const;
export const ErrorReasons = [
  "insufficient_funds",
  "invalid_exact_evm_payload_authorization_valid_after",
  "invalid_exact_evm_payload_authorization_valid_before",
  "invalid_exact_evm_payload_authorization_value",
  "invalid_exact_evm_payload_signature",
  "invalid_exact_evm_payload_recipient_mismatch",
  "invalid_network",
  "invalid_payload",
  "invalid_payment_requirements",
  "invalid_scheme",
  "invalid_payment",
  "payment_expired",
  "unsupported_scheme",
  "invalid_x402_version",
  "invalid_transaction_state",
  "unexpected_verify_error",
  "unexpected_settle_error",
] as const;

// Refiners
const isInteger = (value: string) => Number.isInteger(Number(value)) && Number(value) >= 0;
const hasMaxLength = (maxLength: number) => (value: string) => value.length <= maxLength;

// x402PaymentRequirements
export const PaymentRequirementsSchema = z.object({
  scheme: z.enum(schemes),
  network: NetworkSchema,
  maxAmountRequired: z.string().refine(isInteger),
  resource: z.string().url(),
  description: z.string(),
  mimeType: z.string(),
  outputSchema: z.record(z.any()).optional(),
  payTo: z.string().regex(MixedAddressRegex),
  maxTimeoutSeconds: z.number().int(),
  asset: z.string().regex(MixedAddressRegex),
  extra: z.record(z.any()).optional(),
});
export type PaymentRequirements = z.infer<typeof PaymentRequirementsSchema>;

// x402ExactEvmPayload
export const ExactEvmPayloadAuthorizationSchema = z.object({
  from: z.string().regex(EvmAddressRegex),
  to: z.string().regex(EvmAddressRegex),
  value: z.string().refine(isInteger).refine(hasMaxLength(EvmMaxAtomicUnits)),
  validAfter: z.string().refine(isInteger),
  validBefore: z.string().refine(isInteger),
  nonce: z.string().regex(HexEncoded64ByteRegex),
});
export type ExactEvmPayloadAuthorization = z.infer<typeof ExactEvmPayloadAuthorizationSchema>;

export const ExactEvmPayloadSchema = z.object({
  signature: z.string().regex(EvmSignatureRegex),
  authorization: ExactEvmPayloadAuthorizationSchema,
});
export type ExactEvmPayload = z.infer<typeof ExactEvmPayloadSchema>;

// x402PaymentPayload
export const PaymentPayloadSchema = z.object({
  x402Version: z.number().refine(val => x402Versions.includes(val as 1)),
  scheme: z.enum(schemes),
  network: NetworkSchema,
  payload: ExactEvmPayloadSchema,
});
export type PaymentPayload = z.infer<typeof PaymentPayloadSchema>;
export type UnsignedPaymentPayload = Omit<PaymentPayload, "payload"> & {
  payload: Omit<ExactEvmPayload, "signature"> & { signature: undefined };
};

// x402 Resource Server Response
export const x402ResponseSchema = z.object({
  x402Version: z.number().refine(val => x402Versions.includes(val as 1)),
  error: z.enum(ErrorReasons).optional(),
  accepts: z.array(PaymentRequirementsSchema).optional(),
  payer: z.string().regex(MixedAddressRegex).optional(),
});
export type x402Response = z.infer<typeof x402ResponseSchema>;

// x402RequestStructure
const HTTPVerbsSchema = z.enum(["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"]);
export type HTTPVerbs = z.infer<typeof HTTPVerbsSchema>;

export const HTTPRequestStructureSchema = z.object({
  type: z.literal("http"),
  method: HTTPVerbsSchema,
  queryParams: z.record(z.string(), z.string()).optional(),
  bodyType: z.enum(["json", "form-data", "multipart-form-data", "text", "binary"]).optional(),
  bodyFields: z.record(z.string(), z.any()).optional(),
  headerFields: z.record(z.string(), z.any()).optional(),
});

// export const MCPRequestStructureSchema = z.object({
//   type: z.literal("mcp"),
//   sessionIsPayed: z.boolean(),
//   payedAction: z.object({
//     kind: z.enum(["prompts", "resources", "tools"]),
//     name: z.string(),
//   }).optional(),
// });

// export const OpenAPIRequestStructureSchema = z.object({
//   type: z.literal("openapi"),
//   openApiUrl: z.string().url(),
//   path: z.string(),
// });

export const RequestStructureSchema = z.discriminatedUnion("type", [
  HTTPRequestStructureSchema,
  // MCPRequestStructureSchema,
  // OpenAPIRequestStructureSchema,
]);

export type HTTPRequestStructure = z.infer<typeof HTTPRequestStructureSchema>;
// export type MCPRequestStructure = z.infer<typeof MCPRequestStructureSchema>;
// export type OpenAPIRequestStructure = z.infer<typeof OpenAPIRequestStructureSchema>;
export type RequestStructure = z.infer<typeof RequestStructureSchema>;

// x402DiscoveryResource
export const DiscoveredResourceSchema = z.object({
  resource: z.string(),
  type: z.enum(["http"]),
  x402Version: z.number().refine(val => x402Versions.includes(val as 1)),
  accepts: z.array(PaymentRequirementsSchema),
  lastUpdated: z.date(),
  metadata: z.record(z.any()).optional(),
});
export type DiscoveredResource = z.infer<typeof DiscoveredResourceSchema>;

// x402SettleRequest
export const SettleRequestSchema = z.object({
  paymentPayload: PaymentPayloadSchema,
  paymentRequirements: PaymentRequirementsSchema,
});
export type SettleRequest = z.infer<typeof SettleRequestSchema>;

// x402VerifyRequest
export const VerifyRequestSchema = z.object({
  paymentPayload: PaymentPayloadSchema,
  paymentRequirements: PaymentRequirementsSchema,
});
export type VerifyRequest = z.infer<typeof VerifyRequestSchema>;

// x402VerifyResponse
export const VerifyResponseSchema = z.object({
  isValid: z.boolean(),
  invalidReason: z.enum(ErrorReasons).optional(),
  payer: z.string().regex(MixedAddressRegex).optional(),
});
export type VerifyResponse = z.infer<typeof VerifyResponseSchema>;

// x402SettleResponse
export const SettleResponseSchema = z.object({
  success: z.boolean(),
  errorReason: z.enum(ErrorReasons).optional(),
  payer: z.string().regex(MixedAddressRegex).optional(),
  transaction: z.string().regex(MixedAddressRegex),
  network: NetworkSchema,
});
export type SettleResponse = z.infer<typeof SettleResponseSchema>;

// x402DiscoverListRequest
export const ListDiscoveryResourcesRequestSchema = z.object({
  type: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});
export type ListDiscoveryResourcesRequest = z.infer<typeof ListDiscoveryResourcesRequestSchema>;

// x402ListDiscoveryResourcesResponse
export const ListDiscoveryResourcesResponseSchema = z.object({
  x402Version: z.number().refine(val => x402Versions.includes(val as 1)),
  items: z.array(DiscoveredResourceSchema),
  pagination: z.object({
    limit: z.number(),
    offset: z.number(),
    total: z.number(),
  }),
});
export type ListDiscoveryResourcesResponse = z.infer<typeof ListDiscoveryResourcesResponseSchema>;

// x402SupportedPaymentKind
export const SupportedPaymentKindSchema = z.object({
  x402Version: z.number().refine(val => x402Versions.includes(val as 1)),
  scheme: z.enum(schemes),
  network: NetworkSchema,
});
export type SupportedPaymentKind = z.infer<typeof SupportedPaymentKindSchema>;

// x402SupportedPaymentKindsResponse
export const SupportedPaymentKindsResponseSchema = z.object({
  kinds: z.array(SupportedPaymentKindSchema),
});
export type SupportedPaymentKindsResponse = z.infer<typeof SupportedPaymentKindsResponseSchema>;



================================================
FILE: typescript/packages/x402/src/verify/index.ts
================================================
export * from "./useFacilitator";



================================================
FILE: typescript/packages/x402/src/verify/useFacilitator.test.ts
================================================
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useFacilitator } from "./useFacilitator";
import { PaymentPayload, PaymentRequirements } from "../types/verify";

describe("useFacilitator", () => {
  const mockPaymentPayload: PaymentPayload = {
    x402Version: 1,
    scheme: "exact",
    network: "base-sepolia",
    payload: {
      signature: "0x1234567890123456789012345678901234567890123456789012345678901234",
      authorization: {
        from: "0x1234567890123456789012345678901234567890",
        to: "0x1234567890123456789012345678901234567890",
        value: "1000000",
        validAfter: "1234567890",
        validBefore: "1234567899",
        nonce: "1234567890",
      },
    },
  };

  const mockPaymentRequirements: PaymentRequirements = {
    scheme: "exact",
    network: "base-sepolia",
    maxAmountRequired: "1000000",
    resource: "https://example.com/resource",
    description: "Test resource",
    mimeType: "application/json",
    payTo: "0x1234567890123456789012345678901234567890",
    maxTimeoutSeconds: 300,
    asset: "0x1234567890123456789012345678901234567890",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      statusText: "OK",
      json: async () => ({}),
    });
  });

  describe("verify", () => {
    it("should call fetch with the correct data and default URL", async () => {
      const { verify } = useFacilitator();
      await verify(mockPaymentPayload, mockPaymentRequirements);

      expect(fetch).toHaveBeenCalledWith("https://x402.org/facilitator/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x402Version: mockPaymentPayload.x402Version,
          paymentPayload: mockPaymentPayload,
          paymentRequirements: mockPaymentRequirements,
        }),
      });
    });

    it("should use custom URL when provided", async () => {
      const customUrl = "https://custom-facilitator.org";
      const { verify } = useFacilitator({ url: customUrl });
      await verify(mockPaymentPayload, mockPaymentRequirements);

      expect(fetch).toHaveBeenCalledWith(`${customUrl}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x402Version: mockPaymentPayload.x402Version,
          paymentPayload: mockPaymentPayload,
          paymentRequirements: mockPaymentRequirements,
        }),
      });
    });

    it("should include auth headers when createAuthHeaders is provided", async () => {
      const mockHeaders = {
        verify: { Authorization: "Bearer test-token" },
        settle: { Authorization: "Bearer test-token" },
      };
      const { verify } = useFacilitator({
        url: "https://x402.org/facilitator",
        createAuthHeaders: async () => mockHeaders,
      });
      await verify(mockPaymentPayload, mockPaymentRequirements);

      expect(fetch).toHaveBeenCalledWith(
        "https://x402.org/facilitator/verify",
        expect.objectContaining({
          headers: { "Content-Type": "application/json", ...mockHeaders.verify },
        }),
      );
    });

    it("should throw error on non-200 response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 400,
        statusText: "Bad Request",
        json: async () => ({}),
      });
      const { verify } = useFacilitator();

      await expect(verify(mockPaymentPayload, mockPaymentRequirements)).rejects.toThrow(
        "Failed to verify payment: Bad Request",
      );
    });
  });

  describe("settle", () => {
    it("should call fetch with the correct data and default URL", async () => {
      const { settle } = useFacilitator();
      await settle(mockPaymentPayload, mockPaymentRequirements);

      expect(fetch).toHaveBeenCalledWith("https://x402.org/facilitator/settle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x402Version: mockPaymentPayload.x402Version,
          paymentPayload: mockPaymentPayload,
          paymentRequirements: mockPaymentRequirements,
        }),
      });
    });

    it("should use custom URL when provided", async () => {
      const customUrl = "https://custom-facilitator.org";
      const { settle } = useFacilitator({ url: customUrl });
      await settle(mockPaymentPayload, mockPaymentRequirements);

      expect(fetch).toHaveBeenCalledWith(`${customUrl}/settle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          x402Version: mockPaymentPayload.x402Version,
          paymentPayload: mockPaymentPayload,
          paymentRequirements: mockPaymentRequirements,
        }),
      });
    });

    it("should include auth headers when createAuthHeaders is provided", async () => {
      const mockHeaders = {
        verify: { Authorization: "Bearer test-token" },
        settle: { Authorization: "Bearer test-token" },
      };
      const { settle } = useFacilitator({
        url: "https://x402.org/facilitator",
        createAuthHeaders: async () => mockHeaders,
      });
      await settle(mockPaymentPayload, mockPaymentRequirements);

      expect(fetch).toHaveBeenCalledWith(
        "https://x402.org/facilitator/settle",
        expect.objectContaining({
          headers: { "Content-Type": "application/json", ...mockHeaders.settle },
        }),
      );
    });

    it("should throw error on non-200 response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 400,
        statusText: "Bad Request",
        json: async () => ({}),
      });
      const { settle } = useFacilitator();

      await expect(settle(mockPaymentPayload, mockPaymentRequirements)).rejects.toThrow(
        "Failed to settle payment: 400 Bad Request",
      );
    });
  });

  describe("list", () => {
    it("should call fetch with the correct URL and method", async () => {
      const { list } = useFacilitator();
      await list();

      expect(fetch).toHaveBeenCalledWith("https://x402.org/facilitator/discovery/resources?", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    });

    it("should use custom URL when provided", async () => {
      const customUrl = "https://custom-facilitator.org";
      const { list } = useFacilitator({ url: customUrl });
      await list();

      expect(fetch).toHaveBeenCalledWith(`${customUrl}/discovery/resources?`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    });

    it("should properly encode query parameters", async () => {
      const { list } = useFacilitator();
      const config = {
        type: "test-type",
        limit: 10,
        offset: 20,
      };
      await list(config);

      const expectedUrl =
        "https://x402.org/facilitator/discovery/resources?type=test-type&limit=10&offset=20";
      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    });

    it("should filter out undefined query parameters", async () => {
      const { list } = useFacilitator();
      const config = {
        type: "test-type",
        limit: 10,
        offset: undefined,
      };
      await list(config);

      const expectedUrl =
        "https://x402.org/facilitator/discovery/resources?type=test-type&limit=10";
      expect(fetch).toHaveBeenCalledWith(expectedUrl, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    });

    it("should throw error on non-200 response", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        status: 400,
        statusText: "Bad Request",
        json: async () => ({}),
      });
      const { list } = useFacilitator();

      await expect(list()).rejects.toThrow("Failed to list discovery: 400 Bad Request");
    });
  });
});



================================================
FILE: typescript/packages/x402/src/verify/useFacilitator.ts
================================================
import { toJsonSafe } from "../shared";
import {
  ListDiscoveryResourcesRequest,
  ListDiscoveryResourcesResponse,
  FacilitatorConfig,
} from "../types";
import {
  PaymentPayload,
  PaymentRequirements,
  SettleResponse,
  VerifyResponse,
} from "../types/verify";

const DEFAULT_FACILITATOR_URL = "https://x402.org/facilitator";

export type CreateHeaders = () => Promise<{
  verify: Record<string, string>;
  settle: Record<string, string>;
  list?: Record<string, string>;
}>;

/**
 * Creates a facilitator client for interacting with the X402 payment facilitator service
 *
 * @param facilitator - The facilitator config to use. If not provided, the default facilitator will be used.
 * @returns An object containing verify and settle functions for interacting with the facilitator
 */
export function useFacilitator(facilitator?: FacilitatorConfig) {
  /**
   * Verifies a payment payload with the facilitator service
   *
   * @param payload - The payment payload to verify
   * @param paymentRequirements - The payment requirements to verify against
   * @returns A promise that resolves to the verification response
   */
  async function verify(
    payload: PaymentPayload,
    paymentRequirements: PaymentRequirements,
  ): Promise<VerifyResponse> {
    const url = facilitator?.url || DEFAULT_FACILITATOR_URL;

    let headers = { "Content-Type": "application/json" };
    if (facilitator?.createAuthHeaders) {
      const authHeaders = await facilitator.createAuthHeaders();
      headers = { ...headers, ...authHeaders.verify };
    }

    const res = await fetch(`${url}/verify`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        x402Version: payload.x402Version,
        paymentPayload: toJsonSafe(payload),
        paymentRequirements: toJsonSafe(paymentRequirements),
      }),
    });

    if (res.status !== 200) {
      throw new Error(`Failed to verify payment: ${res.statusText}`);
    }

    const data = await res.json();
    return data as VerifyResponse;
  }

  /**
   * Settles a payment with the facilitator service
   *
   * @param payload - The payment payload to settle
   * @param paymentRequirements - The payment requirements for the settlement
   * @returns A promise that resolves to the settlement response
   */
  async function settle(
    payload: PaymentPayload,
    paymentRequirements: PaymentRequirements,
  ): Promise<SettleResponse> {
    const url = facilitator?.url || DEFAULT_FACILITATOR_URL;

    let headers = { "Content-Type": "application/json" };
    if (facilitator?.createAuthHeaders) {
      const authHeaders = await facilitator.createAuthHeaders();
      headers = { ...headers, ...authHeaders.settle };
    }

    const res = await fetch(`${url}/settle`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        x402Version: payload.x402Version,
        paymentPayload: toJsonSafe(payload),
        paymentRequirements: toJsonSafe(paymentRequirements),
      }),
    });

    if (res.status !== 200) {
      const text = res.statusText;
      throw new Error(`Failed to settle payment: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data as SettleResponse;
  }

  /**
   * Lists the discovery items with the facilitator service
   *
   * @param config - The configuration for the discovery list request
   * @returns A promise that resolves to the discovery list response
   */
  async function list(
    config: ListDiscoveryResourcesRequest = {},
  ): Promise<ListDiscoveryResourcesResponse> {
    const url = facilitator?.url || DEFAULT_FACILITATOR_URL;

    let headers = { "Content-Type": "application/json" };
    if (facilitator?.createAuthHeaders) {
      const authHeaders = await facilitator.createAuthHeaders();
      if (authHeaders.list) {
        headers = { ...headers, ...authHeaders.list };
      }
    }

    const urlParams = new URLSearchParams(
      Object.entries(config)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => [key, value.toString()]),
    );

    const res = await fetch(`${url}/discovery/resources?${urlParams.toString()}`, {
      method: "GET",
      headers,
    });

    if (res.status !== 200) {
      const text = res.statusText;
      throw new Error(`Failed to list discovery: ${res.status} ${text}`);
    }

    const data = await res.json();
    return data as ListDiscoveryResourcesResponse;
  }

  return { verify, settle, list };
}

export const { verify, settle, list } = useFacilitator();



================================================
FILE: typescript/packages/x402-axios/README.md
================================================
# x402-axios

A utility package that extends Axios to automatically handle 402 Payment Required responses using the x402 payment protocol. This package enables seamless integration of payment functionality into your applications when making HTTP requests with Axios.

## Installation

```bash
npm install x402-axios
```

## Quick Start

```typescript
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { withPaymentInterceptor } from "x402-axios";
import axios from "axios";
import { baseSepolia } from "viem/chains";

// Create a wallet client
const account = privateKeyToAccount("0xYourPrivateKey");
const client = createWalletClient({
  account,
  transport: http(),
  chain: baseSepolia,
});

// Create an Axios instance with payment handling
const api = withPaymentInterceptor(
  axios.create({
    baseURL: "https://api.example.com",
  }),
  client
);

// Make a request that may require payment
const response = await api.get("/paid-endpoint");
console.log(response.data);
```

## Features

- Automatic handling of 402 Payment Required responses
- Automatic retry of requests with payment headers
- Payment verification and header generation
- Exposes payment response headers

## API

### `withPaymentInterceptor(axiosClient, walletClient)`

Adds a response interceptor to an Axios instance to handle 402 Payment Required responses automatically.

#### Parameters

- `axiosClient`: The Axios instance to add the interceptor to
- `walletClient`: The wallet client used to sign payment messages (must implement the x402 wallet interface)

#### Returns

The modified Axios instance with the payment interceptor that will:
1. Intercept 402 responses
2. Parse the payment requirements
3. Create a payment header using the provided wallet client
4. Retry the original request with the payment header
5. Expose the X-PAYMENT-RESPONSE header in the final response



================================================
FILE: typescript/packages/x402-axios/eslint.config.js
================================================
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: 2020,
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        Buffer: "readonly",
        exports: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      prettier: prettier,
      jsdoc: jsdoc,
      import: importPlugin,
    },
    rules: {
      ...ts.configs.recommended.rules,
      "import/first": "error",
      "prettier/prettier": "error",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_$" }],
      "jsdoc/tag-lines": ["error", "any", { startLines: 1 }],
      "jsdoc/check-alignment": "error",
      "jsdoc/no-undefined-types": "off",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/implements-on-classes": "error",
      "jsdoc/require-description": "error",
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-hyphen-before-param-description": ["error", "always"],
    },
  },
];



================================================
FILE: typescript/packages/x402-axios/package.json
================================================
{
  "name": "x402-axios",
  "version": "0.5.1",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "start": "tsx --env-file=.env index.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "tsup",
    "watch": "tsc --watch",
    "format": "prettier -c .prettierrc --write \"**/*.{ts,js,cjs,json,md}\"",
    "format:check": "prettier -c .prettierrc --check \"**/*.{ts,js,cjs,json,md}\"",
    "lint": "eslint . --ext .ts --fix",
    "lint:check": "eslint . --ext .ts"
  },
  "keywords": [],
  "license": "Apache-2.0",
  "author": "Coinbase Inc.",
  "repository": "https://github.com/coinbase/x402",
  "description": "x402 Payment Protocol",
  "devDependencies": {
    "@eslint/js": "^9.24.0",
    "@types/node": "^22.13.4",
    "@typescript-eslint/eslint-plugin": "^8.29.1",
    "@typescript-eslint/parser": "^8.29.1",
    "eslint": "^9.24.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-jsdoc": "^50.6.9",
    "eslint-plugin-prettier": "^5.2.6",
    "prettier": "3.5.2",
    "tsup": "^8.4.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.0.5",
    "vite": "^6.2.6"
  },
  "dependencies": {
    "axios": "^1.7.9",
    "viem": "^2.21.26",
    "x402": "workspace:^",
    "zod": "^3.24.2"
  },
  "exports": {
    ".": {
      "import": {
        "types": "./dist/esm/index.d.mts",
        "default": "./dist/esm/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/index.d.ts",
        "default": "./dist/cjs/index.js"
      }
    }
  },
  "files": [
    "dist"
  ]
}



================================================
FILE: typescript/packages/x402-axios/tsconfig.json
================================================
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "allowJs": false,
    "checkJs": false
  },
  "include": ["src"]
}



================================================
FILE: typescript/packages/x402-axios/tsup.config.ts
================================================
import { defineConfig } from "tsup";

const baseConfig = {
  entry: {
    index: "src/index.ts",
  },
  dts: {
    resolve: true,
  },
  sourcemap: true,
  target: "node16",
};

export default defineConfig([
  {
    ...baseConfig,
    format: "esm",
    outDir: "dist/esm",
    clean: true,
  },
  {
    ...baseConfig,
    format: "cjs",
    outDir: "dist/cjs",
    clean: false,
  },
]);



================================================
FILE: typescript/packages/x402-axios/vitest.config.ts
================================================
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
  },
  plugins: [tsconfigPaths({ projects: ["."] })],
}));



================================================
FILE: typescript/packages/x402-axios/.prettierignore
================================================
docs/
dist/
node_modules/
coverage/
.github/
src/client
**/**/*.json
*.md


================================================
FILE: typescript/packages/x402-axios/.prettierignore copy
================================================
docs/
dist/
node_modules/
coverage/
.github/
src/client
**/**/*.json
*.md


================================================
FILE: typescript/packages/x402-axios/.prettierrc
================================================
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "printWidth": 100,
  "proseWrap": "never"
}



================================================
FILE: typescript/packages/x402-axios/src/index.test.ts
================================================
import {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { evm, PaymentRequirements } from "x402/types";
import { withPaymentInterceptor } from "./index";

// Mock the createPaymentHeader function
vi.mock("x402/client", () => ({
  createPaymentHeader: vi.fn(),
  selectPaymentRequirements: vi.fn(),
}));

describe("withPaymentInterceptor()", () => {
  let mockAxiosClient: AxiosInstance;
  let mockWalletClient: typeof evm.SignerWallet;
  let interceptor: (error: AxiosError) => Promise<AxiosResponse>;

  const validPaymentRequirements: PaymentRequirements[] = [
    {
      scheme: "exact",
      network: "base-sepolia",
      maxAmountRequired: "1000000", // 1 USDC in base units
      resource: "https://api.example.com/resource",
      description: "Test payment",
      mimeType: "application/json",
      payTo: "0x1234567890123456789012345678901234567890",
      maxTimeoutSeconds: 300,
      asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on base-sepolia
    },
  ];

  const createErrorConfig = (isRetry = false): InternalAxiosRequestConfig =>
    ({
      headers: new AxiosHeaders(),
      url: "https://api.example.com",
      method: "GET",
      ...(isRetry ? { __is402Retry: true } : {}),
    }) as InternalAxiosRequestConfig;

  const createAxiosError = (
    status: number,
    config?: InternalAxiosRequestConfig,
    data?: { accepts: PaymentRequirements[]; x402Version: number },
  ): AxiosError => {
    return new AxiosError(
      "Error",
      "ERROR",
      config,
      {},
      {
        status,
        statusText: status === 402 ? "Payment Required" : "Not Found",
        data,
        headers: {},
        config: config || createErrorConfig(),
      },
    );
  };

  beforeEach(async () => {
    // Reset mocks before each test
    vi.resetAllMocks();

    // Mock axios client
    mockAxiosClient = {
      interceptors: {
        response: {
          use: vi.fn(),
        },
      },
      request: vi.fn(),
    } as unknown as AxiosInstance;

    // Mock wallet client
    mockWalletClient = {
      signMessage: vi.fn(),
    } as unknown as typeof evm.SignerWallet;

    // Mock payment requirements selector
    const { selectPaymentRequirements } = await import("x402/client");
    (selectPaymentRequirements as ReturnType<typeof vi.fn>).mockImplementation(
      (requirements, _) => requirements[0],
    );

    // Set up the interceptor
    withPaymentInterceptor(mockAxiosClient, mockWalletClient);
    interceptor = (mockAxiosClient.interceptors.response.use as ReturnType<typeof vi.fn>).mock
      .calls[0][1];
  });

  it("should return the axios client instance", () => {
    const result = withPaymentInterceptor(mockAxiosClient, mockWalletClient);
    expect(result).toBe(mockAxiosClient);
  });

  it("should set up response interceptor", () => {
    expect(mockAxiosClient.interceptors.response.use).toHaveBeenCalled();
  });

  it("should not handle non-402 errors", async () => {
    const error = createAxiosError(404);
    await expect(interceptor(error)).rejects.toBe(error);
  });

  it("should handle 402 errors and retry with payment header", async () => {
    const paymentHeader = "payment-header-value";
    const successResponse = { data: "success" } as AxiosResponse;

    const { createPaymentHeader, selectPaymentRequirements } = await import("x402/client");
    (createPaymentHeader as ReturnType<typeof vi.fn>).mockResolvedValue(paymentHeader);
    (selectPaymentRequirements as ReturnType<typeof vi.fn>).mockImplementation(
      (requirements, _) => requirements[0],
    );
    (mockAxiosClient.request as ReturnType<typeof vi.fn>).mockResolvedValue(successResponse);

    const error = createAxiosError(402, createErrorConfig(), {
      accepts: validPaymentRequirements,
      x402Version: 1,
    });

    const result = await interceptor(error);

    expect(result).toBe(successResponse);
    expect(selectPaymentRequirements).toHaveBeenCalledWith(
      validPaymentRequirements,
      undefined,
      "exact",
    );
    expect(createPaymentHeader).toHaveBeenCalledWith(
      mockWalletClient,
      1,
      validPaymentRequirements[0],
    );
    expect(mockAxiosClient.request).toHaveBeenCalledWith({
      ...error.config,
      headers: new AxiosHeaders({
        "X-PAYMENT": paymentHeader,
        "Access-Control-Expose-Headers": "X-PAYMENT-RESPONSE",
      }),
      __is402Retry: true,
    });
  });

  it("should not retry if already retried", async () => {
    const error = createAxiosError(402, createErrorConfig(true), {
      accepts: validPaymentRequirements,
      x402Version: 1,
    });
    await expect(interceptor(error)).rejects.toBe(error);
  });

  it("should reject if missing request config", async () => {
    const error = createAxiosError(402, undefined, {
      accepts: validPaymentRequirements,
      x402Version: 1,
    });
    await expect(interceptor(error)).rejects.toThrow("Missing axios request configuration");
  });

  it("should reject if payment header creation fails", async () => {
    const paymentError = new Error("Payment failed");
    const { createPaymentHeader } = await import("x402/client");
    (createPaymentHeader as ReturnType<typeof vi.fn>).mockRejectedValue(paymentError);

    const error = createAxiosError(402, createErrorConfig(), {
      accepts: validPaymentRequirements,
      x402Version: 1,
    });
    await expect(interceptor(error)).rejects.toBe(paymentError);
  });
});



================================================
FILE: typescript/packages/x402-axios/src/index.ts
================================================
import { AxiosInstance, AxiosError } from "axios";
import {
  ChainIdToNetwork,
  PaymentRequirements,
  PaymentRequirementsSchema,
  Wallet,
} from "x402/types";
import { evm } from "x402/types";
import {
  createPaymentHeader,
  PaymentRequirementsSelector,
  selectPaymentRequirements,
} from "x402/client";

/**
 * Enables the payment of APIs using the x402 payment protocol.
 *
 * When a request receives a 402 response:
 * 1. Extracts payment requirements from the response
 * 2. Creates a payment header using the provided wallet client
 * 3. Retries the original request with the payment header
 * 4. Exposes the X-PAYMENT-RESPONSE header in the final response
 *
 * @param axiosClient - The Axios instance to add the interceptor to
 * @param walletClient - A wallet client that can sign transactions and create payment headers
 * @param paymentRequirementsSelector - A function that selects the payment requirements from the response
 * @returns The modified Axios instance with the payment interceptor
 *
 * @example
 * ```typescript
 * const client = withPaymentInterceptor(
 *   axios.create(),
 *   signer
 * );
 *
 * // The client will automatically handle 402 responses
 * const response = await client.get('https://api.example.com/premium-content');
 * ```
 */
export function withPaymentInterceptor(
  axiosClient: AxiosInstance,
  walletClient: Wallet,
  paymentRequirementsSelector: PaymentRequirementsSelector = selectPaymentRequirements,
) {
  axiosClient.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      if (!error.response || error.response.status !== 402) {
        return Promise.reject(error);
      }

      try {
        const originalConfig = error.config;
        if (!originalConfig || !originalConfig.headers) {
          return Promise.reject(new Error("Missing axios request configuration"));
        }

        if ((originalConfig as { __is402Retry?: boolean }).__is402Retry) {
          return Promise.reject(error);
        }

        const { x402Version, accepts } = error.response.data as {
          x402Version: number;
          accepts: PaymentRequirements[];
        };
        const parsed = accepts.map(x => PaymentRequirementsSchema.parse(x));

        const chainId = evm.isSignerWallet(walletClient) ? walletClient.chain?.id : undefined;

        const selectedPaymentRequirements = paymentRequirementsSelector(
          parsed,
          chainId ? ChainIdToNetwork[chainId] : undefined,
          "exact",
        );
        const paymentHeader = await createPaymentHeader(
          walletClient,
          x402Version,
          selectedPaymentRequirements,
        );

        (originalConfig as { __is402Retry?: boolean }).__is402Retry = true;

        originalConfig.headers["X-PAYMENT"] = paymentHeader;
        originalConfig.headers["Access-Control-Expose-Headers"] = "X-PAYMENT-RESPONSE";

        const secondResponse = await axiosClient.request(originalConfig);
        return secondResponse;
      } catch (paymentError) {
        return Promise.reject(paymentError);
      }
    },
  );

  return axiosClient;
}

export { decodeXPaymentResponse } from "x402/shared";



================================================
FILE: typescript/packages/x402-express/README.md
================================================
# x402-express

Express middleware integration for the x402 Payment Protocol. This package allows you to easily add paywall functionality to your Express.js applications using the x402 protocol.

## Installation

```bash
npm install x402-express
```

## Quick Start

```typescript
import express from "express";
import { paymentMiddleware, Network } from "x402-express";

const app = express();

// Configure the payment middleware
app.use(paymentMiddleware(
  "0xYourAddress",
  {
    "/protected-route": {
      price: "$0.10",
      network: "base-sepolia",
      config: {
        description: "Access to premium content",
      }
    }
  }
));

// Implement your route
app.get("/protected-route", 
  (req, res) => {
    res.json({ message: "This content is behind a paywall" });
  }
);

app.listen(3000);
```

## Configuration

The `paymentMiddleware` function accepts three parameters:

1. `payTo`: Your receiving address (`0x${string}`)
2. `routes`: Route configurations for protected endpoints
3. `facilitator`: (Optional) Configuration for the x402 facilitator service
4. `paywall`: (Optional) Configuration for the built-in paywall

See the Middleware Options section below for detailed configuration options.

## Middleware Options

The middleware supports various configuration options:

### Route Configuration

```typescript
type RoutesConfig = Record<string, Price | RouteConfig>;

interface RouteConfig {
  price: Price;           // Price in USD or token amount
  network: Network;       // "base" or "base-sepolia"
  config?: PaymentMiddlewareConfig;
}
```

### Payment Configuration

```typescript
interface PaymentMiddlewareConfig {
  description?: string;               // Description of the payment
  mimeType?: string;                  // MIME type of the resource
  maxTimeoutSeconds?: number;         // Maximum time for payment (default: 60)
  outputSchema?: Record<string, any>; // JSON schema for the response
  customPaywallHtml?: string;         // Custom HTML for the paywall
  resource?: string;                  // Resource URL (defaults to request URL)
}
```

### Facilitator Configuration

```typescript
type FacilitatorConfig = {
  url: string;                        // URL of the x402 facilitator service
  createAuthHeaders?: CreateHeaders;  // Optional function to create authentication headers
};
```

### Paywall Configuration

For more on paywall configuration options, refer to the [paywall README](../x402/src/paywall/README.md).

```typescript
type PaywallConfig = {
  cdpClientKey?: string;              // Your CDP Client API Key
  appName?: string;                   // Name displayed in the paywall wallet selection modal
  appLogo?: string;                   // Logo for the paywall wallet selection modal
  sessionTokenEndpoint?: string;      // API endpoint for Coinbase Onramp session authentication
};
```

## Optional: Coinbase Onramp Integration

**Note**: Onramp integration is completely optional. Your x402 paywall will work perfectly without it. This feature is for users who want to provide an easy way for their customers to fund their wallets directly from the paywall.

When configured, a "Get more USDC" button will appear in your paywall, allowing users to purchase USDC directly through Coinbase Onramp.

### Quick Setup

#### 1. Create the Session Token Route

Add a session token endpoint to your Express app:

```typescript
import express from "express";
import { POST } from "x402-express/session-token";

const app = express();

// Add the session token endpoint
app.post("/api/x402/session-token", POST);
```

#### 2. Configure Your Middleware

Add `sessionTokenEndpoint` to your middleware configuration. This tells the paywall where to find your session token API:

```typescript
app.use(paymentMiddleware(
  payTo,
  routes,
  facilitator,
  {
    sessionTokenEndpoint: "/api/x402/session-token",
    cdpClientKey: "your-cdp-client-key",
  }
));
```

**Important**: The `sessionTokenEndpoint` must match the route you created above. You can use any path you prefer - just make sure both the route and configuration use the same path. Without this configuration, the "Get more USDC" button will be hidden.

#### 3. Get CDP API Keys

1. Go to [CDP Portal](https://portal.cdp.coinbase.com/)
2. Navigate to your project's **[API Keys](https://portal.cdp.coinbase.com/projects/api-keys)**
3. Click **Create API key**
4. Download and securely store your API key

#### 4. Enable Onramp Secure Initialization in CDP Portal

1. Go to [CDP Portal](https://portal.cdp.coinbase.com/)
2. Navigate to **Payments → [Onramp & Offramp](https://portal.cdp.coinbase.com/products/onramp)**
3. Toggle **"Enforce secure initialization"** to **Enabled**

#### 5. Set Environment Variables

Add your CDP API keys to your environment:

```bash
# .env
CDP_API_KEY_ID=your_secret_api_key_id_here
CDP_API_KEY_SECRET=your_secret_api_key_secret_here
```

### How Onramp Works

Once set up, your x402 paywall will automatically show a "Get more USDC" button when users need to fund their wallets. 

1. **Generates session token**: Your backend securely creates a session token using CDP's API
2. **Opens secure onramp**: User is redirected to Coinbase Onramp with the session token
3. **No exposed data**: Wallet addresses and app IDs are never exposed in URLs

### Troubleshooting Onramp

#### Common Issues

1. **"Missing CDP API credentials"**
    - Ensure `CDP_API_KEY_ID` and `CDP_API_KEY_SECRET` are set
    - Verify you're using **Secret API Keys**, not Client API Keys

2. **"Failed to generate session token"**
    - Check your CDP Secret API key has proper permissions
    - Verify your project has Onramp enabled

3. **API route not found**
    - Ensure you've added the session token route: `app.post("/your-path", POST)`
    - Check that your route path matches your `sessionTokenEndpoint` configuration
    - Verify the import: `import { POST } from "x402-express/session-token"`
    - Example: If you configured `sessionTokenEndpoint: "/api/custom/onramp"`, add `app.post("/api/custom/onramp", POST)`


## Resources

- [x402 Protocol](https://x402.org)
- [CDP Documentation](https://docs.cdp.coinbase.com)
- [CDP Discord](https://discord.com/invite/cdp)



================================================
FILE: typescript/packages/x402-express/eslint.config.js
================================================
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: 2020,
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        Buffer: "readonly",
        BufferEncoding: "readonly",
        exports: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      prettier: prettier,
      jsdoc: jsdoc,
      import: importPlugin,
    },
    rules: {
      ...ts.configs.recommended.rules,
      "import/first": "error",
      "prettier/prettier": "error",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_$" }],
      "jsdoc/tag-lines": ["error", "any", { startLines: 1 }],
      "jsdoc/check-alignment": "error",
      "jsdoc/no-undefined-types": "off",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/implements-on-classes": "error",
      "jsdoc/require-description": "error",
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-hyphen-before-param-description": ["error", "always"],
    },
  },
];



================================================
FILE: typescript/packages/x402-express/package.json
================================================
{
  "name": "x402-express",
  "version": "0.5.3",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "start": "tsx --env-file=.env index.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "tsup",
    "watch": "tsc --watch",
    "format": "prettier -c .prettierrc --write \"**/*.{ts,js,cjs,json,md}\"",
    "format:check": "prettier -c .prettierrc --check \"**/*.{ts,js,cjs,json,md}\"",
    "lint": "eslint . --ext .ts --fix",
    "lint:check": "eslint . --ext .ts"
  },
  "keywords": [],
  "license": "Apache-2.0",
  "author": "Coinbase Inc.",
  "repository": "https://github.com/coinbase/x402",
  "description": "x402 Payment Protocol",
  "devDependencies": {
    "@eslint/js": "^9.24.0",
    "@types/express": "^5.0.1",
    "@types/node": "^22.13.4",
    "@typescript-eslint/eslint-plugin": "^8.29.1",
    "@typescript-eslint/parser": "^8.29.1",
    "eslint": "^9.24.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-jsdoc": "^50.6.9",
    "eslint-plugin-prettier": "^5.2.6",
    "prettier": "3.5.2",
    "tsup": "^8.4.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite": "^6.2.6",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.0.5"
  },
  "dependencies": {
    "@coinbase/cdp-sdk": "^1.22.0",
    "express": "^4.18.2",
    "viem": "^2.21.26",
    "x402": "workspace:^",
    "zod": "^3.24.2"
  },
  "exports": {
    ".": {
      "import": {
        "types": "./dist/esm/index.d.mts",
        "default": "./dist/esm/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/index.d.ts",
        "default": "./dist/cjs/index.js"
      }
    }
  },
  "files": [
    "dist"
  ]
}



================================================
FILE: typescript/packages/x402-express/tsconfig.json
================================================
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "allowJs": false,
    "checkJs": false
  },
  "include": ["src"]
}



================================================
FILE: typescript/packages/x402-express/tsup.config.ts
================================================
import { defineConfig } from "tsup";

const baseConfig = {
  entry: {
    index: "src/index.ts",
  },
  dts: {
    resolve: true,
  },
  sourcemap: true,
  target: "node16",
};

export default defineConfig([
  {
    ...baseConfig,
    format: "esm",
    outDir: "dist/esm",
    clean: true,
  },
  {
    ...baseConfig,
    format: "cjs",
    outDir: "dist/cjs",
    clean: false,
  },
]);



================================================
FILE: typescript/packages/x402-express/vitest.config.ts
================================================
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
  },
  plugins: [tsconfigPaths({ projects: ["."] })],
}));



================================================
FILE: typescript/packages/x402-express/.prettierignore
================================================
docs/
dist/
node_modules/
coverage/
.github/
src/client
**/**/*.json
*.md


================================================
FILE: typescript/packages/x402-express/.prettierrc
================================================
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "printWidth": 100,
  "proseWrap": "never"
}



================================================
FILE: typescript/packages/x402-express/src/index.test.ts
================================================
import { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPaywallHtml, findMatchingRoute } from "x402/shared";
import { exact } from "x402/schemes";
import {
  PaymentMiddlewareConfig,
  PaymentPayload,
  RoutesConfig,
  FacilitatorConfig,
  RouteConfig,
} from "x402/types";
import { useFacilitator } from "x402/verify";
import { paymentMiddleware } from "./index";

// Mock dependencies
vi.mock("x402/verify", () => ({
  useFacilitator: vi.fn().mockReturnValue({
    verify: vi.fn(),
    settle: vi.fn(),
  }),
}));

vi.mock("x402/shared", async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getPaywallHtml: vi.fn(),
    getNetworkId: vi.fn().mockReturnValue("base-sepolia"),
    toJsonSafe: vi.fn(x => x),
    computeRoutePatterns: vi.fn().mockImplementation(routes => {
      const normalizedRoutes = Object.fromEntries(
        Object.entries(routes).map(([pattern, value]) => [
          pattern,
          typeof value === "string" || typeof value === "number"
            ? ({ price: value, network: "base-sepolia" } as RouteConfig)
            : (value as RouteConfig),
        ]),
      );

      return Object.entries(normalizedRoutes).map(([pattern, routeConfig]) => {
        const [verb, path] = pattern.includes(" ") ? pattern.split(/\s+/) : ["*", pattern];
        if (!path) {
          throw new Error(`Invalid route pattern: ${pattern}`);
        }
        return {
          verb: verb.toUpperCase(),
          pattern: new RegExp(
            `^${path
              .replace(/\*/g, ".*?")
              .replace(/\[([^\]]+)\]/g, "[^/]+")
              .replace(/\//g, "\\/")}$`,
          ),
          config: routeConfig,
        };
      });
    }),
    findMatchingRoute: vi
      .fn()
      .mockImplementation(
        (
          routePatterns: Array<{ pattern: RegExp; verb: string; config: RouteConfig }>,
          path: string,
          method: string,
        ) => {
          if (!routePatterns) return undefined;
          return routePatterns.find(({ pattern, verb }) => {
            const matchesPath = pattern.test(path);
            const matchesVerb = verb === "*" || verb === method.toUpperCase();
            return matchesPath && matchesVerb;
          });
        },
      ),
  };
});

vi.mock("x402/shared/evm", () => ({
  getUsdcAddressForChain: vi.fn().mockReturnValue("0x036CbD53842c5426634e7929541eC2318f3dCF7e"),
}));

// Mock exact.evm.decodePayment
vi.mock("x402/schemes", () => ({
  exact: {
    evm: {
      encodePayment: vi.fn(),
      decodePayment: vi.fn(),
    },
  },
}));

describe("paymentMiddleware()", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;
  let middleware: ReturnType<typeof paymentMiddleware>;
  let mockVerify: ReturnType<typeof useFacilitator>["verify"];
  let mockSettle: ReturnType<typeof useFacilitator>["settle"];

  const middlewareConfig: PaymentMiddlewareConfig = {
    description: "Test payment",
    mimeType: "application/json",
    maxTimeoutSeconds: 300,
    outputSchema: { type: "object" },
    inputSchema: { queryParams: { type: "string" } },
    resource: "https://api.example.com/resource",
  };
  const outputSchema = {
    input: {
      method: "GET",
      type: "http",
      discoverable: true,
      ...middlewareConfig.inputSchema,
    },
    output: middlewareConfig.outputSchema,
  };

  const facilitatorConfig: FacilitatorConfig = {
    url: "https://facilitator.example.com",
  };

  const payTo = "0x1234567890123456789012345678901234567890";

  const routesConfig: RoutesConfig = {
    "/test": {
      price: "$0.001",
      network: "base-sepolia",
      config: middlewareConfig,
    },
  };

  const validPayment: PaymentPayload = {
    scheme: "exact",
    x402Version: 1,
    network: "base-sepolia",
    payload: {
      signature: "0x123",
      authorization: {
        from: "0x123",
        to: "0x456",
        value: "0x123",
        validAfter: "0x123",
        validBefore: "0x123",
        nonce: "0x123",
      },
    },
  };
  const encodedValidPayment = "encoded-payment";

  beforeEach(() => {
    vi.resetAllMocks();
    mockReq = {
      path: "/test",
      method: "GET",
      headers: {},
      header: function (name: string) {
        return this.headers[name.toLowerCase()];
      },
    } as Request;
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
      setHeader: vi.fn().mockReturnThis(),
      end: vi.fn().mockReturnThis(),
      headersSent: false,
    } as unknown as Response;
    mockNext = vi.fn();
    mockVerify = vi.fn();
    mockSettle = vi.fn();

    vi.mocked(useFacilitator).mockReturnValue({
      verify: mockVerify,
      settle: mockSettle,
    });

    // Setup paywall HTML mock
    vi.mocked(getPaywallHtml).mockReturnValue("<html>Paywall</html>");

    // Setup exact.evm mocks
    vi.mocked(exact.evm.encodePayment).mockReturnValue(encodedValidPayment);
    vi.mocked(exact.evm.decodePayment).mockReturnValue(validPayment);

    // Setup route pattern matching mock
    vi.mocked(findMatchingRoute).mockImplementation((routePatterns, path, method) => {
      if (path === "/test" && method === "GET") {
        return {
          pattern: /^\/test$/,
          verb: "GET",
          config: {
            price: "$0.001",
            network: "base-sepolia",
            config: middlewareConfig,
          },
        };
      }
      return undefined;
    });

    middleware = paymentMiddleware(payTo, routesConfig, facilitatorConfig);
  });

  it("should return 402 with payment requirements when no payment header is present", async () => {
    mockReq.headers = {};
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(402);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "X-PAYMENT header is required",
        accepts: expect.any(Array),
        x402Version: 1,
      }),
    );
  });

  it("should return HTML paywall for browser requests", async () => {
    mockReq.headers = {
      accept: "text/html",
      "user-agent": "Mozilla/5.0",
    };
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(402);
    expect(mockRes.send).toHaveBeenCalledWith("<html>Paywall</html>");
  });

  it("should verify payment and proceed if valid", async () => {
    mockReq.headers = {
      "x-payment": encodedValidPayment,
    };
    (mockVerify as ReturnType<typeof vi.fn>).mockResolvedValue({ isValid: true });

    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(exact.evm.decodePayment).toHaveBeenCalledWith(encodedValidPayment);
    expect(mockVerify).toHaveBeenCalledWith(validPayment, expect.any(Object));
    expect(mockNext).toHaveBeenCalled();
  });

  it("should return 402 if payment verification fails", async () => {
    mockReq.headers = {
      "x-payment": "invalid-payment-header",
    };
    (exact.evm.decodePayment as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error("Invalid payment");
    });

    (mockVerify as ReturnType<typeof vi.fn>).mockResolvedValue({
      isValid: false,
      invalidReason: "insufficient_funds",
    });

    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(402);
    expect(mockRes.json).toHaveBeenCalledWith({
      x402Version: 1,
      error: new Error("Invalid payment"),
      accepts: [
        {
          scheme: "exact",
          network: "base-sepolia",
          maxAmountRequired: "1000",
          resource: "https://api.example.com/resource",
          description: "Test payment",
          mimeType: "application/json",
          payTo: "0x1234567890123456789012345678901234567890",
          maxTimeoutSeconds: 300,
          asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
          outputSchema,
          extra: {
            name: "USDC",
            version: "2",
          },
        },
      ],
    });
  });

  it("should handle settlement after response", async () => {
    mockReq.headers = {
      "x-payment": encodedValidPayment,
    };
    (mockVerify as ReturnType<typeof vi.fn>).mockResolvedValue({ isValid: true });
    (mockSettle as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      transaction: "0x123",
      network: "base-sepolia",
    });

    // Mock response.end to capture arguments
    const endArgs: Parameters<Response["end"]>[] = [];
    (mockRes.end as ReturnType<typeof vi.fn>).mockImplementation(
      (...args: Parameters<Response["end"]>) => {
        endArgs.push(args);
      },
    );

    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(exact.evm.decodePayment).toHaveBeenCalledWith(encodedValidPayment);
    expect(mockSettle).toHaveBeenCalledWith(validPayment, expect.any(Object));
    expect(mockRes.setHeader).toHaveBeenCalledWith("X-PAYMENT-RESPONSE", expect.any(String));
  });

  it("should handle settlement failure before response is sent", async () => {
    mockReq.headers = {
      "x-payment": encodedValidPayment,
    };
    (mockVerify as ReturnType<typeof vi.fn>).mockResolvedValue({ isValid: true });
    (mockSettle as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Settlement failed"));

    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(mockRes.status).toHaveBeenCalledWith(402);
    expect(mockRes.json).toHaveBeenCalledWith({
      x402Version: 1,
      error: new Error("Settlement failed"),
      accepts: [
        {
          scheme: "exact",
          network: "base-sepolia",
          maxAmountRequired: "1000",
          resource: "https://api.example.com/resource",
          description: "Test payment",
          mimeType: "application/json",
          payTo: "0x1234567890123456789012345678901234567890",
          maxTimeoutSeconds: 300,
          asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
          outputSchema,
          extra: {
            name: "USDC",
            version: "2",
          },
        },
      ],
    });
  });

  it("should handle settlement failure after response is sent", async () => {
    mockReq.headers = {
      "x-payment": encodedValidPayment,
    };
    (mockVerify as ReturnType<typeof vi.fn>).mockResolvedValue({ isValid: true });
    (mockSettle as ReturnType<typeof vi.fn>).mockRejectedValue(new Error("Settlement failed"));
    mockRes.headersSent = true;

    // Mock response.end to capture arguments
    const endArgs: Parameters<Response["end"]>[] = [];
    (mockRes.end as ReturnType<typeof vi.fn>).mockImplementation(
      (...args: Parameters<Response["end"]>) => {
        endArgs.push(args);
      },
    );

    await middleware(mockReq as Request, mockRes as Response, mockNext);

    expect(exact.evm.decodePayment).toHaveBeenCalledWith(encodedValidPayment);
    expect(mockSettle).toHaveBeenCalledWith(validPayment, expect.any(Object));
    // Should not try to send another response since headers are already sent
    expect(mockRes.status).not.toHaveBeenCalledWith(402);
  });

  it("should not settle payment if protected route returns status >= 400", async () => {
    mockReq.headers = {
      "x-payment": encodedValidPayment,
    };
    (mockVerify as ReturnType<typeof vi.fn>).mockResolvedValue({ isValid: true });
    (mockSettle as ReturnType<typeof vi.fn>).mockResolvedValue({
      success: true,
      transaction: "0x123",
      network: "base-sepolia",
    });

    // Simulate downstream handler setting status 500
    (mockRes.status as ReturnType<typeof vi.fn>).mockImplementation(function (
      this: Response,
      code: number,
    ) {
      this.statusCode = code;
      return this;
    });
    mockRes.statusCode = 500;

    // call the middleware
    await middleware(mockReq as Request, mockRes as Response, mockNext);

    // make assertions
    expect(mockSettle).not.toHaveBeenCalled();
    expect(mockRes.statusCode).toBe(500);
  });

  describe("session token integration", () => {
    it("should pass sessionTokenEndpoint to paywall HTML when configured", async () => {
      const paywallConfig = {
        cdpClientKey: "test-client-key",
        appName: "Test App",
        appLogo: "/test-logo.png",
        sessionTokenEndpoint: "/api/x402/session-token",
      };

      const middlewareWithPaywall = paymentMiddleware(
        payTo,
        routesConfig,
        facilitatorConfig,
        paywallConfig,
      );

      mockReq.headers = {
        accept: "text/html",
        "user-agent": "Mozilla/5.0",
      };

      await middlewareWithPaywall(mockReq as Request, mockRes as Response, mockNext);

      expect(getPaywallHtml).toHaveBeenCalledWith(
        expect.objectContaining({
          cdpClientKey: "test-client-key",
          appName: "Test App",
          appLogo: "/test-logo.png",
          sessionTokenEndpoint: "/api/x402/session-token",
        }),
      );
    });

    it("should not pass sessionTokenEndpoint when not configured", async () => {
      const paywallConfig = {
        cdpClientKey: "test-client-key",
        appName: "Test App",
      };

      const middlewareWithPaywall = paymentMiddleware(
        payTo,
        routesConfig,
        facilitatorConfig,
        paywallConfig,
      );

      mockReq.headers = {
        accept: "text/html",
        "user-agent": "Mozilla/5.0",
      };

      await middlewareWithPaywall(mockReq as Request, mockRes as Response, mockNext);

      expect(getPaywallHtml).toHaveBeenCalledWith(
        expect.objectContaining({
          cdpClientKey: "test-client-key",
          appName: "Test App",
          sessionTokenEndpoint: undefined,
        }),
      );
    });

    it("should pass sessionTokenEndpoint even when other paywall config is minimal", async () => {
      const paywallConfig = {
        sessionTokenEndpoint: "/custom/session-token",
      };

      const middlewareWithPaywall = paymentMiddleware(
        payTo,
        routesConfig,
        facilitatorConfig,
        paywallConfig,
      );

      mockReq.headers = {
        accept: "text/html",
        "user-agent": "Mozilla/5.0",
      };

      await middlewareWithPaywall(mockReq as Request, mockRes as Response, mockNext);

      expect(getPaywallHtml).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionTokenEndpoint: "/custom/session-token",
          cdpClientKey: undefined,
          appName: undefined,
          appLogo: undefined,
        }),
      );
    });

    it("should work without any paywall config", async () => {
      const middlewareWithoutPaywall = paymentMiddleware(payTo, routesConfig, facilitatorConfig);

      mockReq.headers = {
        accept: "text/html",
        "user-agent": "Mozilla/5.0",
      };

      await middlewareWithoutPaywall(mockReq as Request, mockRes as Response, mockNext);

      expect(getPaywallHtml).toHaveBeenCalledWith(
        expect.objectContaining({
          sessionTokenEndpoint: undefined,
          cdpClientKey: undefined,
          appName: undefined,
          appLogo: undefined,
        }),
      );
    });
  });
});



================================================
FILE: typescript/packages/x402-express/src/index.ts
================================================
import { NextFunction, Request, Response } from "express";
import { Address, getAddress } from "viem";
import { exact } from "x402/schemes";
import {
  computeRoutePatterns,
  findMatchingPaymentRequirements,
  findMatchingRoute,
  getPaywallHtml,
  processPriceToAtomicAmount,
  toJsonSafe,
} from "x402/shared";
import {
  FacilitatorConfig,
  moneySchema,
  PaymentPayload,
  PaymentRequirements,
  PaywallConfig,
  Resource,
  RoutesConfig,
  settleResponseHeader,
} from "x402/types";
import { useFacilitator } from "x402/verify";

/**
 * Creates a payment middleware factory for Express
 *
 * @param payTo - The address to receive payments
 * @param routes - Configuration for protected routes and their payment requirements
 * @param facilitator - Optional configuration for the payment facilitator service
 * @param paywall - Optional configuration for the default paywall
 * @returns An Express middleware handler
 *
 * @example
 * ```typescript
 * // Simple configuration - All endpoints are protected by $0.01 of USDC on base-sepolia
 * app.use(paymentMiddleware(
 *   '0x123...', // payTo address
 *   {
 *     price: '$0.01', // USDC amount in dollars
 *     network: 'base-sepolia'
 *   },
 *   // Optional facilitator configuration. Defaults to x402.org/facilitator for testnet usage
 * ));
 *
 * // Advanced configuration - Endpoint-specific payment requirements & custom facilitator
 * app.use(paymentMiddleware('0x123...', // payTo: The address to receive payments*    {
 *   {
 *     '/weather/*': {
 *       price: '$0.001', // USDC amount in dollars
 *       network: 'base',
 *       config: {
 *         description: 'Access to weather data'
 *       }
 *     }
 *   },
 *   {
 *     url: 'https://facilitator.example.com',
 *     createAuthHeaders: async () => ({
 *       verify: { "Authorization": "Bearer token" },
 *       settle: { "Authorization": "Bearer token" }
 *     })
 *   },
 *   {
 *     cdpClientKey: 'your-cdp-client-key',
 *     appLogo: '/images/logo.svg',
 *     appName: 'My App',
 *   }
 * ));
 * ```
 */
export function paymentMiddleware(
  payTo: Address,
  routes: RoutesConfig,
  facilitator?: FacilitatorConfig,
  paywall?: PaywallConfig,
) {
  const { verify, settle } = useFacilitator(facilitator);
  const x402Version = 1;

  // Pre-compile route patterns to regex and extract verbs
  const routePatterns = computeRoutePatterns(routes);

  return async function paymentMiddleware(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const matchingRoute = findMatchingRoute(routePatterns, req.path, req.method.toUpperCase());

    if (!matchingRoute) {
      return next();
    }

    const { price, network, config = {} } = matchingRoute.config;
    const {
      description,
      mimeType,
      maxTimeoutSeconds,
      inputSchema,
      outputSchema,
      customPaywallHtml,
      resource,
      discoverable,
    } = config;

    const atomicAmountForAsset = processPriceToAtomicAmount(price, network);
    if ("error" in atomicAmountForAsset) {
      throw new Error(atomicAmountForAsset.error);
    }
    const { maxAmountRequired, asset } = atomicAmountForAsset;

    const resourceUrl: Resource =
      resource || (`${req.protocol}://${req.headers.host}${req.path}` as Resource);

    const paymentRequirements: PaymentRequirements[] = [
      {
        scheme: "exact",
        network,
        maxAmountRequired,
        resource: resourceUrl,
        description: description ?? "",
        mimeType: mimeType ?? "",
        payTo: getAddress(payTo),
        maxTimeoutSeconds: maxTimeoutSeconds ?? 60,
        asset: getAddress(asset.address),
        // TODO: Rename outputSchema to requestStructure
        outputSchema: {
          input: {
            type: "http",
            method: req.method.toUpperCase(),
            discoverable: discoverable ?? true,
            ...inputSchema,
          },
          output: outputSchema,
        },
        extra: asset.eip712,
      },
    ];

    const payment = req.header("X-PAYMENT");
    const userAgent = req.header("User-Agent") || "";
    const acceptHeader = req.header("Accept") || "";
    const isWebBrowser = acceptHeader.includes("text/html") && userAgent.includes("Mozilla");

    if (!payment) {
      if (isWebBrowser) {
        let displayAmount: number;
        if (typeof price === "string" || typeof price === "number") {
          const parsed = moneySchema.safeParse(price);
          if (parsed.success) {
            displayAmount = parsed.data;
          } else {
            displayAmount = Number.NaN;
          }
        } else {
          displayAmount = Number(price.amount) / 10 ** price.asset.decimals;
        }

        const html =
          customPaywallHtml ||
          getPaywallHtml({
            amount: displayAmount,
            paymentRequirements: toJsonSafe(paymentRequirements) as Parameters<
              typeof getPaywallHtml
            >[0]["paymentRequirements"],
            currentUrl: req.originalUrl,
            testnet: network === "base-sepolia",
            cdpClientKey: paywall?.cdpClientKey,
            appName: paywall?.appName,
            appLogo: paywall?.appLogo,
            sessionTokenEndpoint: paywall?.sessionTokenEndpoint,
          });
        res.status(402).send(html);
        return;
      }
      res.status(402).json({
        x402Version,
        error: "X-PAYMENT header is required",
        accepts: toJsonSafe(paymentRequirements),
      });
      return;
    }

    let decodedPayment: PaymentPayload;
    try {
      decodedPayment = exact.evm.decodePayment(payment);
      decodedPayment.x402Version = x402Version;
    } catch (error) {
      res.status(402).json({
        x402Version,
        error: error || "Invalid or malformed payment header",
        accepts: toJsonSafe(paymentRequirements),
      });
      return;
    }

    const selectedPaymentRequirements = findMatchingPaymentRequirements(
      paymentRequirements,
      decodedPayment,
    );
    if (!selectedPaymentRequirements) {
      res.status(402).json({
        x402Version,
        error: "Unable to find matching payment requirements",
        accepts: toJsonSafe(paymentRequirements),
      });
      return;
    }

    try {
      const response = await verify(decodedPayment, selectedPaymentRequirements);
      if (!response.isValid) {
        res.status(402).json({
          x402Version,
          error: response.invalidReason,
          accepts: toJsonSafe(paymentRequirements),
          payer: response.payer,
        });
        return;
      }
    } catch (error) {
      res.status(402).json({
        x402Version,
        error,
        accepts: toJsonSafe(paymentRequirements),
      });
      return;
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    type EndArgs =
      | [cb?: () => void]
      | [chunk: any, cb?: () => void]
      | [chunk: any, encoding: BufferEncoding, cb?: () => void];
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const originalEnd = res.end.bind(res);
    let endArgs: EndArgs | null = null;

    res.end = function (...args: EndArgs) {
      endArgs = args;
      return res; // maintain correct return type
    };

    // Proceed to the next middleware or route handler
    await next();

    // If the response from the protected route is >= 400, do not settle payment
    if (res.statusCode >= 400) {
      res.end = originalEnd;
      if (endArgs) {
        originalEnd(...(endArgs as Parameters<typeof res.end>));
      }
      return;
    }

    try {
      const settleResponse = await settle(decodedPayment, selectedPaymentRequirements);
      const responseHeader = settleResponseHeader(settleResponse);
      res.setHeader("X-PAYMENT-RESPONSE", responseHeader);
    } catch (error) {
      // If settlement fails and the response hasn't been sent yet, return an error
      if (!res.headersSent) {
        res.status(402).json({
          x402Version,
          error,
          accepts: toJsonSafe(paymentRequirements),
        });
        return;
      }
    } finally {
      res.end = originalEnd;
      if (endArgs) {
        originalEnd(...(endArgs as Parameters<typeof res.end>));
      }
    }
  };
}

export type {
  Money,
  Network,
  PaymentMiddlewareConfig,
  Resource,
  RouteConfig,
  RoutesConfig,
} from "x402/types";



================================================
FILE: typescript/packages/x402-express/src/session-token.test.ts
================================================
import { Request, Response } from "express";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateJwt } from "@coinbase/cdp-sdk/auth";
import { POST } from "./session-token";

// Mock the CDP SDK
vi.mock("@coinbase/cdp-sdk/auth", () => ({
  generateJwt: vi.fn(),
}));

// Mock fetch globally
global.fetch = vi.fn();

describe("session-token POST handler", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockEnv: Record<string, string | undefined>;

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock environment variables
    mockEnv = {
      CDP_API_KEY_ID: "test-key-id",
      CDP_API_KEY_SECRET: "test-key-secret",
    };
    vi.stubGlobal("process", {
      env: mockEnv,
    });

    // Set up Express request and response mocks
    mockReq = {
      body: {},
    } as Request;

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("successful token generation", () => {
    it("should generate session token successfully", async () => {
      const mockJwt = "mock-jwt-token";
      const mockSessionToken = {
        token: "session-token-123",
        expires_at: "2024-01-01T00:00:00Z",
      };

      mockReq.body = {
        addresses: [{ address: "0x1234567890123456789012345678901234567890" }],
      };

      vi.mocked(generateJwt).mockResolvedValue(mockJwt);
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockSessionToken),
      } as unknown as globalThis.Response);

      await POST(mockReq as Request, mockRes as Response);

      expect(generateJwt).toHaveBeenCalledWith({
        apiKeyId: "test-key-id",
        apiKeySecret: "test-key-secret",
        requestMethod: "POST",
        requestHost: "api.developer.coinbase.com",
        requestPath: "/onramp/v1/token",
      });

      expect(fetch).toHaveBeenCalledWith("https://api.developer.coinbase.com/onramp/v1/token", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${mockJwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          addresses: [
            {
              address: "0x1234567890123456789012345678901234567890",
              blockchains: ["base"],
            },
          ],
        }),
      });

      expect(mockRes.json).toHaveBeenCalledWith(mockSessionToken);
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe("environment variable validation", () => {
    it("should return 500 when CDP_API_KEY_ID is missing", async () => {
      mockEnv.CDP_API_KEY_ID = undefined;

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Server configuration error: Missing CDP API credentials",
      });
    });

    it("should return 500 when CDP_API_KEY_SECRET is missing", async () => {
      mockEnv.CDP_API_KEY_SECRET = undefined;

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Server configuration error: Missing CDP API credentials",
      });
    });

    it("should return 500 when both API keys are missing", async () => {
      mockEnv.CDP_API_KEY_ID = undefined;
      mockEnv.CDP_API_KEY_SECRET = undefined;

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Server configuration error: Missing CDP API credentials",
      });
    });
  });

  describe("request body validation", () => {
    it("should return 400 when addresses is missing", async () => {
      mockReq.body = {};

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "addresses is required and must be a non-empty array",
      });
    });

    it("should return 400 when addresses is null", async () => {
      mockReq.body = { addresses: null };

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "addresses is required and must be a non-empty array",
      });
    });

    it("should return 400 when addresses is not an array", async () => {
      mockReq.body = { addresses: "not-an-array" };

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "addresses is required and must be a non-empty array",
      });
    });

    it("should return 400 when addresses is empty array", async () => {
      mockReq.body = { addresses: [] };

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "addresses is required and must be a non-empty array",
      });
    });
  });

  describe("JWT generation errors", () => {
    it("should return 500 when JWT generation fails", async () => {
      mockReq.body = {
        addresses: [{ address: "0x1234567890123456789012345678901234567890" }],
      };

      vi.mocked(generateJwt).mockRejectedValue(new Error("JWT generation failed"));

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });

  describe("CDP API errors", () => {
    it("should return 400 when CDP API returns 400", async () => {
      mockReq.body = {
        addresses: [{ address: "0x1234567890123456789012345678901234567890" }],
      };

      vi.mocked(generateJwt).mockResolvedValue("mock-jwt");
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        text: () => Promise.resolve("Bad Request"),
      } as unknown as globalThis.Response);

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to generate session token",
      });
    });

    it("should return 401 when CDP API returns 401", async () => {
      mockReq.body = {
        addresses: [{ address: "0x1234567890123456789012345678901234567890" }],
      };

      vi.mocked(generateJwt).mockResolvedValue("mock-jwt");
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve("Unauthorized"),
      } as unknown as globalThis.Response);

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to generate session token",
      });
    });

    it("should return 500 when CDP API returns 500", async () => {
      mockReq.body = {
        addresses: [{ address: "0x1234567890123456789012345678901234567890" }],
      };

      vi.mocked(generateJwt).mockResolvedValue("mock-jwt");
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve("Internal Server Error"),
      } as unknown as globalThis.Response);

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Failed to generate session token",
      });
    });
  });

  describe("network errors", () => {
    it("should return 500 when fetch fails", async () => {
      mockReq.body = {
        addresses: [{ address: "0x1234567890123456789012345678901234567890" }],
      };

      vi.mocked(generateJwt).mockResolvedValue("mock-jwt");
      vi.mocked(fetch).mockRejectedValue(new Error("Network error"));

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });

    it("should return 500 when response.json() fails", async () => {
      mockReq.body = {
        addresses: [{ address: "0x1234567890123456789012345678901234567890" }],
      };

      vi.mocked(generateJwt).mockResolvedValue("mock-jwt");
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.reject(new Error("JSON parsing error")),
      } as unknown as globalThis.Response);

      await POST(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Internal server error",
      });
    });
  });
});



================================================
FILE: typescript/packages/x402-express/src/session-token.ts
================================================
import { generateJwt } from "@coinbase/cdp-sdk/auth";
import type { Request, Response } from "express";

/**
 * Generate a session token for Coinbase Onramp and Offramp using Secure Init
 *
 * This endpoint creates a server-side session token that can be used
 * instead of passing appId and addresses directly in onramp/offramp URLs.
 *
 * Setup:
 * 1. Set CDP_API_KEY_ID and CDP_API_KEY_SECRET environment variables
 * 2. Add this to your Express app: app.post("/api/x402/session-token", POST);
 *
 * @param req - The Express Request containing the session token request
 * @param res - The Express Response object
 * @returns Promise<void> - The response containing the session token or error
 */
export async function POST(req: Request, res: Response) {
  try {
    // Get CDP API credentials from environment variables
    const apiKeyId = process.env.CDP_API_KEY_ID;
    const apiKeySecret = process.env.CDP_API_KEY_SECRET;

    if (!apiKeyId || !apiKeySecret) {
      console.error("Missing CDP API credentials");
      return res.status(500).json({
        error: "Server configuration error: Missing CDP API credentials",
      });
    }

    // Parse request body
    const body = req.body as {
      addresses?: Array<{ address: string; blockchains?: string[] }>;
      assets?: string[];
    };
    const { addresses, assets } = body;

    if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
      return res.status(400).json({
        error: "addresses is required and must be a non-empty array",
      });
    }

    // Generate JWT for authentication
    const jwt = await generateJwt({
      apiKeyId,
      apiKeySecret,
      requestMethod: "POST",
      requestHost: "api.developer.coinbase.com",
      requestPath: "/onramp/v1/token",
    });

    // Create session token request payload
    const tokenRequestPayload = {
      addresses: addresses.map((addr: { address: string; blockchains?: string[] }) => ({
        address: addr.address,
        blockchains: addr.blockchains || ["base"],
      })),
      ...(assets && { assets }),
    };

    // Call Coinbase API to generate session token
    const response = await fetch("https://api.developer.coinbase.com/onramp/v1/token", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tokenRequestPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to generate session token:", response.status, errorText);
      return res.status(response.status).json({
        error: "Failed to generate session token",
      });
    }

    const data = await response.json();

    return res.json(data);
  } catch (error) {
    console.error("Error generating session token:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}



================================================
FILE: typescript/packages/x402-fetch/README.md
================================================
# x402-fetch

A utility package that extends the native `fetch` API to automatically handle 402 Payment Required responses using the x402 payment protocol. This package enables seamless integration of payment functionality into your applications when making HTTP requests.

## Installation

```bash
npm install x402-fetch
```

## Quick Start

```typescript
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { wrapFetchWithPayment } from "x402-fetch";
import { baseSepolia } from "viem/chains";

// Create a wallet client
const account = privateKeyToAccount("0xYourPrivateKey");
const client = createWalletClient({
  account,
  transport: http(),
  chain: baseSepolia,
});

// Wrap the fetch function with payment handling
const fetchWithPay = wrapFetchWithPayment(fetch, client);

// Make a request that may require payment
const response = await fetchWithPay("https://api.example.com/paid-endpoint", {
  method: "GET",
});

const data = await response.json();
```

## API

### `wrapFetchWithPayment(fetch, walletClient, maxValue?, paymentRequirementsSelector?)`

Wraps the native fetch API to handle 402 Payment Required responses automatically.

#### Parameters

- `fetch`: The fetch function to wrap (typically `globalThis.fetch`)
- `walletClient`: The wallet client used to sign payment messages (must implement the x402 wallet interface)
- `maxValue`: Optional maximum allowed payment amount in base units (defaults to 0.1 USDC)
- `paymentRequirementsSelector`: Optional function to select payment requirements from the response (defaults to `selectPaymentRequirements`)

#### Returns

A wrapped fetch function that automatically handles 402 responses by:
1. Making the initial request
2. If a 402 response is received, parsing the payment requirements
3. Verifying the payment amount is within the allowed maximum
4. Creating a payment header using the provided wallet client
5. Retrying the request with the payment header

## Example

```typescript
import { config } from "dotenv";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { wrapFetchWithPayment } from "x402-fetch";
import { baseSepolia } from "viem/chains";

config();

const { PRIVATE_KEY, API_URL } = process.env;

const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
const client = createWalletClient({
  account,
  transport: http(),
  chain: baseSepolia,
});

const fetchWithPay = wrapFetchWithPayment(fetch, client);

// Make a request to a paid API endpoint
fetchWithPay(API_URL, {
  method: "GET",
})
  .then(async response => {
    const data = await response.json();
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
```




================================================
FILE: typescript/packages/x402-fetch/eslint.config.js
================================================
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: 2020,
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        Buffer: "readonly",
        RequestInfo: "readonly",
        RequestInit: "readonly",
        Response: "readonly",
        Headers: "readonly",
        exports: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      prettier: prettier,
      jsdoc: jsdoc,
      import: importPlugin,
    },
    rules: {
      ...ts.configs.recommended.rules,
      "import/first": "error",
      "prettier/prettier": "error",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_$" }],
      "jsdoc/tag-lines": ["error", "any", { startLines: 1 }],
      "jsdoc/check-alignment": "error",
      "jsdoc/no-undefined-types": "off",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/implements-on-classes": "error",
      "jsdoc/require-description": "error",
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-hyphen-before-param-description": ["error", "always"],
    },
  },
];



================================================
FILE: typescript/packages/x402-fetch/package.json
================================================
{
  "name": "x402-fetch",
  "version": "0.5.1",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "start": "tsx --env-file=.env index.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "tsup",
    "watch": "tsc --watch",
    "format": "prettier -c .prettierrc --write \"**/*.{ts,js,cjs,json,md}\"",
    "format:check": "prettier -c .prettierrc --check \"**/*.{ts,js,cjs,json,md}\"",
    "lint": "eslint . --ext .ts --fix",
    "lint:check": "eslint . --ext .ts"
  },
  "keywords": [],
  "license": "Apache-2.0",
  "author": "Coinbase Inc.",
  "repository": "https://github.com/coinbase/x402",
  "description": "x402 Payment Protocol",
  "devDependencies": {
    "@types/node": "^22.13.4",
    "@eslint/js": "^9.24.0",
    "eslint": "^9.24.0",
    "eslint-plugin-jsdoc": "^50.6.9",
    "eslint-plugin-prettier": "^5.2.6",
    "@typescript-eslint/eslint-plugin": "^8.29.1",
    "@typescript-eslint/parser": "^8.29.1",
    "eslint-plugin-import": "^2.31.0",
    "prettier": "3.5.2",
    "tsup": "^8.4.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.0.5",
    "vite": "^6.2.6"
  },
  "dependencies": {
    "viem": "^2.21.26",
    "zod": "^3.24.2",
    "x402": "workspace:^"
  },
  "exports": {
    ".": {
      "import": {
        "types": "./dist/esm/index.d.mts",
        "default": "./dist/esm/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/index.d.ts",
        "default": "./dist/cjs/index.js"
      }
    }
  },
  "files": [
    "dist"
  ]
}



================================================
FILE: typescript/packages/x402-fetch/tsconfig.json
================================================
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "allowJs": false,
    "checkJs": false,
    "lib": ["DOM"]
  },
  "include": ["src"]
}



================================================
FILE: typescript/packages/x402-fetch/tsup.config.ts
================================================
import { defineConfig } from "tsup";

const baseConfig = {
  entry: {
    index: "src/index.ts",
  },
  dts: {
    resolve: true,
  },
  sourcemap: true,
  target: "node16",
};

export default defineConfig([
  {
    ...baseConfig,
    format: "esm",
    outDir: "dist/esm",
    clean: true,
  },
  {
    ...baseConfig,
    format: "cjs",
    outDir: "dist/cjs",
    clean: false,
  },
]);



================================================
FILE: typescript/packages/x402-fetch/vitest.config.ts
================================================
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
  },
  plugins: [tsconfigPaths({ projects: ["."] })],
}));



================================================
FILE: typescript/packages/x402-fetch/.prettierignore
================================================
docs/
dist/
node_modules/
coverage/
.github/
src/client
**/**/*.json
*.md


================================================
FILE: typescript/packages/x402-fetch/.prettierrc
================================================
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "printWidth": 100,
  "proseWrap": "never"
}



================================================
FILE: typescript/packages/x402-fetch/src/index.test.ts
================================================
import { describe, it, expect, vi, beforeEach } from "vitest";
import { wrapFetchWithPayment } from "./index";
import { evm, PaymentRequirements } from "x402/types";

vi.mock("x402/client", () => ({
  createPaymentHeader: vi.fn(),
  selectPaymentRequirements: vi.fn(),
}));

type RequestInitWithRetry = RequestInit & { __is402Retry?: boolean };

describe("fetchWithPayment()", () => {
  let mockFetch: ReturnType<typeof vi.fn>;
  let mockWalletClient: typeof evm.SignerWallet;
  let wrappedFetch: ReturnType<typeof wrapFetchWithPayment>;
  const validPaymentRequirements: PaymentRequirements[] = [
    {
      scheme: "exact",
      network: "base-sepolia",
      maxAmountRequired: "100000", // 0.1 USDC in base units
      resource: "https://api.example.com/resource",
      description: "Test payment",
      mimeType: "application/json",
      payTo: "0x1234567890123456789012345678901234567890",
      maxTimeoutSeconds: 300,
      asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // USDC on base-sepolia
    },
  ];

  const createResponse = (status: number, data?: unknown): Response => {
    const response = new Response(JSON.stringify(data), {
      status,
      statusText: status === 402 ? "Payment Required" : "Not Found",
      headers: new Headers(),
    });
    return response;
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    mockFetch = vi.fn();

    mockWalletClient = {
      signMessage: vi.fn(),
    } as unknown as typeof evm.SignerWallet;

    // Mock payment requirements selector
    const { selectPaymentRequirements } = await import("x402/client");
    (selectPaymentRequirements as ReturnType<typeof vi.fn>).mockImplementation(
      (requirements, _) => requirements[0],
    );

    wrappedFetch = wrapFetchWithPayment(mockFetch, mockWalletClient);
  });

  it("should return the original response for non-402 status codes", async () => {
    const successResponse = createResponse(200, { data: "success" });
    mockFetch.mockResolvedValue(successResponse);

    const result = await wrappedFetch("https://api.example.com");

    expect(result).toBe(successResponse);
    expect(mockFetch).toHaveBeenCalledWith("https://api.example.com", undefined);
  });

  it("should handle 402 errors and retry with payment header", async () => {
    const paymentHeader = "payment-header-value";
    const successResponse = createResponse(200, { data: "success" });

    const { createPaymentHeader, selectPaymentRequirements } = await import("x402/client");
    (createPaymentHeader as ReturnType<typeof vi.fn>).mockResolvedValue(paymentHeader);
    (selectPaymentRequirements as ReturnType<typeof vi.fn>).mockImplementation(
      (requirements, _) => requirements[0],
    );
    mockFetch
      .mockResolvedValueOnce(
        createResponse(402, { accepts: validPaymentRequirements, x402Version: 1 }),
      )
      .mockResolvedValueOnce(successResponse);

    const result = await wrappedFetch("https://api.example.com", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    } as RequestInitWithRetry);

    expect(result).toBe(successResponse);
    expect(selectPaymentRequirements).toHaveBeenCalledWith(
      validPaymentRequirements,
      undefined,
      "exact",
    );
    expect(createPaymentHeader).toHaveBeenCalledWith(
      mockWalletClient,
      1,
      validPaymentRequirements[0],
    );
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenLastCalledWith("https://api.example.com", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-PAYMENT": paymentHeader,
        "Access-Control-Expose-Headers": "X-PAYMENT-RESPONSE",
      },
      __is402Retry: true,
    } as RequestInitWithRetry);
  });

  it("should not retry if already retried", async () => {
    const errorResponse = createResponse(402, {
      accepts: validPaymentRequirements,
      x402Version: 1,
    });
    mockFetch.mockResolvedValue(errorResponse);

    await expect(
      wrappedFetch("https://api.example.com", {
        __is402Retry: true,
      } as RequestInitWithRetry),
    ).rejects.toThrow("Payment already attempted");
  });

  it("should reject if missing request config", async () => {
    const errorResponse = createResponse(402, {
      accepts: validPaymentRequirements,
      x402Version: 1,
    });
    mockFetch.mockResolvedValue(errorResponse);

    await expect(wrappedFetch("https://api.example.com")).rejects.toThrow(
      "Missing fetch request configuration",
    );
  });

  it("should reject if payment amount exceeds maximum", async () => {
    const errorResponse = createResponse(402, {
      accepts: [
        {
          ...validPaymentRequirements[0],
          maxAmountRequired: "200000", // 0.2 USDC, which exceeds our default max of 0.1 USDC
        },
      ],
      x402Version: 1,
    });
    mockFetch.mockResolvedValue(errorResponse);

    await expect(
      wrappedFetch("https://api.example.com", {
        method: "GET",
      } as RequestInitWithRetry),
    ).rejects.toThrow("Payment amount exceeds maximum allowed");
  });

  it("should reject if payment header creation fails", async () => {
    const paymentError = new Error("Payment failed");
    const { createPaymentHeader } = await import("x402/client");
    (createPaymentHeader as ReturnType<typeof vi.fn>).mockRejectedValue(paymentError);
    mockFetch.mockResolvedValue(
      createResponse(402, { accepts: validPaymentRequirements, x402Version: 1 }),
    );

    await expect(
      wrappedFetch("https://api.example.com", {
        method: "GET",
      } as RequestInitWithRetry),
    ).rejects.toBe(paymentError);
  });
});



================================================
FILE: typescript/packages/x402-fetch/src/index.ts
================================================
import { ChainIdToNetwork, PaymentRequirementsSchema, Wallet } from "x402/types";
import { evm } from "x402/types";
import {
  createPaymentHeader,
  PaymentRequirementsSelector,
  selectPaymentRequirements,
} from "x402/client";

/**
 * Enables the payment of APIs using the x402 payment protocol.
 *
 * This function wraps the native fetch API to automatically handle 402 Payment Required responses
 * by creating and sending a payment header. It will:
 * 1. Make the initial request
 * 2. If a 402 response is received, parse the payment requirements
 * 3. Verify the payment amount is within the allowed maximum
 * 4. Create a payment header using the provided wallet client
 * 5. Retry the request with the payment header
 *
 * @param fetch - The fetch function to wrap (typically globalThis.fetch)
 * @param walletClient - The wallet client used to sign payment messages
 * @param maxValue - The maximum allowed payment amount in base units (defaults to 0.1 USDC)
 * @param paymentRequirementsSelector - A function that selects the payment requirements from the response
 * @returns A wrapped fetch function that handles 402 responses automatically
 *
 * @example
 * ```typescript
 * const wallet = new SignerWallet(...);
 * const fetchWithPay = wrapFetchWithPayment(fetch, wallet);
 *
 * // Make a request that may require payment
 * const response = await fetchWithPay('https://api.example.com/paid-endpoint');
 * ```
 *
 * @throws {Error} If the payment amount exceeds the maximum allowed value
 * @throws {Error} If the request configuration is missing
 * @throws {Error} If a payment has already been attempted for this request
 * @throws {Error} If there's an error creating the payment header
 */
export function wrapFetchWithPayment(
  fetch: typeof globalThis.fetch,
  walletClient: Wallet,
  maxValue: bigint = BigInt(0.1 * 10 ** 6), // Default to 0.10 USDC
  paymentRequirementsSelector: PaymentRequirementsSelector = selectPaymentRequirements,
) {
  return async (input: RequestInfo, init?: RequestInit) => {
    const response = await fetch(input, init);

    if (response.status !== 402) {
      return response;
    }

    const { x402Version, accepts } = (await response.json()) as {
      x402Version: number;
      accepts: unknown[];
    };
    const parsedPaymentRequirements = accepts.map(x => PaymentRequirementsSchema.parse(x));

    const chainId = evm.isSignerWallet(walletClient) ? walletClient.chain?.id : undefined;
    const selectedPaymentRequirements = paymentRequirementsSelector(
      parsedPaymentRequirements,
      chainId ? ChainIdToNetwork[chainId] : undefined,
      "exact",
    );

    if (BigInt(selectedPaymentRequirements.maxAmountRequired) > maxValue) {
      throw new Error("Payment amount exceeds maximum allowed");
    }

    const paymentHeader = await createPaymentHeader(
      walletClient,
      x402Version,
      selectedPaymentRequirements,
    );

    if (!init) {
      throw new Error("Missing fetch request configuration");
    }

    if ((init as { __is402Retry?: boolean }).__is402Retry) {
      throw new Error("Payment already attempted");
    }

    const newInit = {
      ...init,
      headers: {
        ...(init.headers || {}),
        "X-PAYMENT": paymentHeader,
        "Access-Control-Expose-Headers": "X-PAYMENT-RESPONSE",
      },
      __is402Retry: true,
    };

    const secondResponse = await fetch(input, newInit);
    return secondResponse;
  };
}

export { decodeXPaymentResponse } from "x402/shared";



================================================
FILE: typescript/packages/x402-hono/README.md
================================================
# x402-hono

Hono middleware integration for the x402 Payment Protocol. This package allows you to easily add paywall functionality to your Hono applications using the x402 protocol.

## Installation

```bash
npm install x402-hono
```

## Quick Start

```typescript
import { Hono } from "hono";
import { paymentMiddleware, Network } from "x402-hono";

const app = new Hono();

// Configure the payment middleware
app.use(paymentMiddleware(
  "0xYourAddress",
  {
    "/protected-route": {
      price: "$0.10",
      network: "base-sepolia",
      config: {
        description: "Access to premium content",
      }
    }
  }
));

// Implement your route
app.get("/protected-route", (c) => {
  return c.json({ message: "This content is behind a paywall" });
});

serve({
  fetch: app.fetch,
  port: 3000
});
```

## Configuration

The `paymentMiddleware` function accepts three parameters:

1. `payTo`: Your receiving address (`0x${string}`)
2. `routes`: Route configurations for protected endpoints
3. `facilitator`: (Optional) Configuration for the x402 facilitator service
4. `paywall`: (Optional) Configuration for the built-in paywall

See the Middleware Options section below for detailed configuration options.

## Middleware Options

The middleware supports various configuration options:

### Route Configuration

```typescript
type RoutesConfig = Record<string, Price | RouteConfig>;

interface RouteConfig {
  price: Price;           // Price in USD or token amount
  network: Network;       // "base" or "base-sepolia"
  config?: PaymentMiddlewareConfig;
}
```

### Payment Configuration

```typescript
interface PaymentMiddlewareConfig {
  description?: string;               // Description of the payment
  mimeType?: string;                  // MIME type of the resource
  maxTimeoutSeconds?: number;         // Maximum time for payment (default: 60)
  outputSchema?: Record<string, any>; // JSON schema for the response
  customPaywallHtml?: string;         // Custom HTML for the paywall
  resource?: string;                  // Resource URL (defaults to request URL)
}
```

### Facilitator Configuration

```typescript
type FacilitatorConfig = {
  url: string;                        // URL of the x402 facilitator service
  createAuthHeaders?: CreateHeaders;  // Optional function to create authentication headers
};
```


### Paywall Configuration

For more on paywall configuration options, refer to the [paywall README](../x402/src/paywall/README.md).

```typescript
type PaywallConfig = {
  cdpClientKey?: string;              // Your CDP Client API Key
  appName?: string;                   // Name displayed in the paywall wallet selection modal
  appLogo?: string;                   // Logo for the paywall wallet selection modal
  sessionTokenEndpoint?: string;      // API endpoint for Coinbase Onramp session authentication
};
```

## Optional: Coinbase Onramp Integration

**Note**: Onramp integration is completely optional. Your x402 paywall will work perfectly without it. This feature is for users who want to provide an easy way for their customers to fund their wallets directly from the paywall.

When configured, a "Get more USDC" button will appear in your paywall, allowing users to purchase USDC directly through Coinbase Onramp.

### Quick Setup

#### 1. Create the Session Token Route

Add a session token endpoint to your Hono app:

```typescript
import { Hono } from "hono";
import { POST } from "x402-hono/session-token";

const app = new Hono();

// Add the session token endpoint
app.post("/api/x402/session-token", POST);
```

#### 2. Configure Your Middleware

Add `sessionTokenEndpoint` to your middleware configuration. This tells the paywall where to find your session token API:

```typescript
app.use(paymentMiddleware(
  payTo,
  routes,
  facilitator,
  {
    sessionTokenEndpoint: "path/to/session-token-route",
  }
));
```

**Important**: The `sessionTokenEndpoint` must match the route you created above. You can use any path you prefer - just make sure both the route and configuration use the same path. Without this configuration, the "Get more USDC" button will be hidden.

#### 3. Get CDP API Keys

1. Go to [CDP Portal](https://portal.cdp.coinbase.com/)
2. Navigate to your project's **[API Keys](https://portal.cdp.coinbase.com/projects/api-keys)**
3. Click **Create API key**
4. Download and securely store your API key

#### 4. Enable Onramp Secure Initialization in CDP Portal

1. Go to [CDP Portal](https://portal.cdp.coinbase.com/)
2. Navigate to **Payments → [Onramp & Offramp](https://portal.cdp.coinbase.com/products/onramp)**
3. Toggle **"Enforce secure initialization"** to **Enabled**

#### 5. Set Environment Variables

Add your CDP API keys to your environment:

```bash
# .env
CDP_API_KEY_ID=your_secret_api_key_id_here
CDP_API_KEY_SECRET=your_secret_api_key_secret_here
```

### How Onramp Works

Once set up, your x402 paywall will automatically show a "Get more USDC" button when users need to fund their wallets. 

1. **Generates session token**: Your backend securely creates a session token using CDP's API
2. **Opens secure onramp**: User is redirected to Coinbase Onramp with the session token
3. **No exposed data**: Wallet addresses and app IDs are never exposed in URLs

### Troubleshooting Onramp

#### Common Issues

1. **"Missing CDP API credentials"**
    - Ensure `CDP_API_KEY_ID` and `CDP_API_KEY_SECRET` are set
    - Verify you're using **Secret API Keys**, not Client API Keys

2. **"Failed to generate session token"**
    - Check your CDP Secret API key has proper permissions
    - Verify your project has Onramp enabled

3. **API route not found**
    - Ensure you've added the session token route: `app.post("/your-path", POST)`
    - Check that your route path matches your `sessionTokenEndpoint` configuration
    - Verify the import: `import { POST } from "x402-hono/session-token"`
    - Example: If you configured `sessionTokenEndpoint: "/api/custom/onramp"`, add `app.post("/api/custom/onramp", POST)`


## Resources

- [x402 Protocol](https://x402.org)
- [CDP Documentation](https://docs.cdp.coinbase.com)
- [CDP Discord](https://discord.com/invite/cdp)



================================================
FILE: typescript/packages/x402-hono/eslint.config.js
================================================
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import jsdoc from "eslint-plugin-jsdoc";
import importPlugin from "eslint-plugin-import";

export default [
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: tsParser,
      sourceType: "module",
      ecmaVersion: 2020,
      globals: {
        process: "readonly",
        __dirname: "readonly",
        module: "readonly",
        require: "readonly",
        Buffer: "readonly",
        Headers: "readonly",
        exports: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": ts,
      prettier: prettier,
      jsdoc: jsdoc,
      import: importPlugin,
    },
    rules: {
      ...ts.configs.recommended.rules,
      "import/first": "error",
      "prettier/prettier": "error",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_$" }],
      "jsdoc/tag-lines": ["error", "any", { startLines: 1 }],
      "jsdoc/check-alignment": "error",
      "jsdoc/no-undefined-types": "off",
      "jsdoc/check-param-names": "error",
      "jsdoc/check-tag-names": "error",
      "jsdoc/check-types": "error",
      "jsdoc/implements-on-classes": "error",
      "jsdoc/require-description": "error",
      "jsdoc/require-jsdoc": [
        "error",
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: true,
            ClassDeclaration: true,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      "jsdoc/require-param": "error",
      "jsdoc/require-param-description": "error",
      "jsdoc/require-param-type": "off",
      "jsdoc/require-returns": "error",
      "jsdoc/require-returns-description": "error",
      "jsdoc/require-returns-type": "off",
      "jsdoc/require-hyphen-before-param-description": ["error", "always"],
    },
  },
];



================================================
FILE: typescript/packages/x402-hono/package.json
================================================
{
  "name": "x402-hono",
  "version": "0.5.3",
  "main": "./dist/cjs/index.js",
  "module": "./dist/esm/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "start": "tsx --env-file=.env index.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "tsup",
    "watch": "tsc --watch",
    "format": "prettier -c .prettierrc --write \"**/*.{ts,js,cjs,json,md}\"",
    "format:check": "prettier -c .prettierrc --check \"**/*.{ts,js,cjs,json,md}\"",
    "lint": "eslint . --ext .ts --fix",
    "lint:check": "eslint . --ext .ts"
  },
  "keywords": [],
  "license": "Apache-2.0",
  "author": "Coinbase Inc.",
  "repository": "https://github.com/coinbase/x402",
  "description": "x402 Payment Protocol",
  "devDependencies": {
    "@eslint/js": "^9.24.0",
    "@types/node": "^22.13.4",
    "@typescript-eslint/eslint-plugin": "^8.29.1",
    "@typescript-eslint/parser": "^8.29.1",
    "eslint": "^9.24.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-jsdoc": "^50.6.9",
    "eslint-plugin-prettier": "^5.2.6",
    "prettier": "3.5.2",
    "tsup": "^8.4.0",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vite-tsconfig-paths": "^5.1.4",
    "vitest": "^3.0.5",
    "vite": "^6.2.6"
  },
  "dependencies": {
    "@coinbase/cdp-sdk": "^1.22.0",
    "hono": "^4.7.1",
    "viem": "^2.21.26",
    "x402": "workspace:^",
    "zod": "^3.24.2"
  },
  "exports": {
    ".": {
      "import": {
        "types": "./dist/esm/index.d.mts",
        "default": "./dist/esm/index.mjs"
      },
      "require": {
        "types": "./dist/cjs/index.d.ts",
        "default": "./dist/cjs/index.js"
      }
    }
  },
  "files": [
    "dist"
  ]
}



================================================
FILE: typescript/packages/x402-hono/tsconfig.json
================================================
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "allowJs": false,
    "checkJs": false
  },
  "include": ["src"]
}



================================================
FILE: typescript/packages/x402-hono/tsup.config.ts
================================================
import { defineConfig } from "tsup";

const baseConfig = {
  entry: {
    index: "src/index.ts",
  },
  dts: {
    resolve: true,
  },
  sourcemap: true,
  target: "node16",
};

export default defineConfig([
  {
    ...baseConfig,
    format: "esm",
    outDir: "dist/esm",
    clean: true,
  },
  {
    ...baseConfig,
    format: "cjs",
    outDir: "dist/cjs",
    clean: false,
  },
]);



================================================
FILE: typescript/packages/x402-hono/vitest.config.ts
================================================
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
  test: {
    env: loadEnv(mode, process.cwd(), ""),
  },
  plugins: [tsconfigPaths({ projects: ["."] })],
}));



================================================
FILE: typescript/packages/x402-hono/.prettierignore
================================================
docs/
dist/
node_modules/
coverage/
.github/
src/client
**/**/*.json
*.md


================================================
FILE: typescript/packages/x402-hono/.prettierrc
================================================
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "printWidth": 100,
  "proseWrap": "never"
}



================================================
FILE: typescript/packages/x402-hono/src/index.test.ts
================================================
import { Context } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { exact } from "x402/schemes";
import { findMatchingRoute, getPaywallHtml } from "x402/shared";
import {
  FacilitatorConfig,
  PaymentMiddlewareConfig,
  PaymentPayload,
  RouteConfig,
  RoutesConfig,
} from "x402/types";
import { useFacilitator } from "x402/verify";
import { paymentMiddleware } from "./index";

// Mock dependencies
vi.mock("x402/verify", () => ({
  useFacilitator: vi.fn(),
}));

vi.mock("x402/shared", async importOriginal => {
  const actual = (await importOriginal()) as Record<string, unknown>;
  return {
    ...actual,
    getPaywallHtml: vi.fn(),
    getNetworkId: vi.fn().mockReturnValue("base-sepolia"),
    toJsonSafe: vi.fn(x => x),
    computeRoutePatterns: vi.fn().mockImplementation(routes => {
      const normalizedRoutes = Object.fromEntries(
        Object.entries(routes).map(([pattern, value]) => [
          pattern,
          typeof value === "string" || typeof value === "number"
            ? ({ price: value, network: "base-sepolia" } as RouteConfig)
            : (value as RouteConfig),
        ]),
      );

      return Object.entries(normalizedRoutes).map(([pattern, routeConfig]) => {
        const [verb, path] = pattern.includes(" ") ? pattern.split(/\s+/) : ["*", pattern];
        if (!path) {
          throw new Error(`Invalid route pattern: ${pattern}`);
        }
        return {
          verb: verb.toUpperCase(),
          pattern: new RegExp(
            `^${path
              .replace(/\*/g, ".*?")
              .replace(/\[([^\]]+)\]/g, "[^/]+")
              .replace(/\//g, "\\/")}$`,
          ),
          config: routeConfig,
        };
      });
    }),
    findMatchingRoute: vi
      .fn()
      .mockImplementation(
        (routePatterns: Array<{ pattern: RegExp; verb: string }>, path: string, method: string) => {
          if (!routePatterns) return undefined;
          return routePatterns.find(({ pattern, verb }) => {
            const matchesPath = pattern.test(path);
            const matchesVerb = verb === "*" || verb === method.toUpperCase();
            return matchesPath && matchesVerb;
          });
        },
      ),
  };
});

vi.mock("x402/shared/evm", () => ({
  getUsdcAddressForChain: vi.fn().mockReturnValue("0x036CbD53842c5426634e7929541eC2318f3dCF7e"),
}));

// Mock exact.evm.decodePayment
vi.mock("x402/schemes", () => ({
  exact: {
    evm: {
      encodePayment: vi.fn(),
      decodePayment: vi.fn(),
    },
  },
}));

describe("paymentMiddleware()", () => {
  let mockContext: Context;
  let mockNext: () => Promise<void>;
  let middleware: ReturnType<typeof paymentMiddleware>;
  let mockVerify: ReturnType<typeof useFacilitator>["verify"];
  let mockSettle: ReturnType<typeof useFacilitator>["settle"];

  const middlewareConfig: PaymentMiddlewareConfig = {
    description: "Test payment",
    mimeType: "application/json",
    maxTimeoutSeconds: 300,
    outputSchema: { type: "object" },
    inputSchema: { queryParams: { type: "string" } },
    resource: "https://api.example.com/resource",
  };
  const outputSchema = {
    input: {
      method: "GET",
      type: "http",
      discoverable: true,
      ...middlewareConfig.inputSchema,
    },
    output: middlewareConfig.outputSchema,
  };

  const facilitatorConfig: FacilitatorConfig = {
    url: "https://facilitator.example.com",
  };

  const payTo = "0x1234567890123456789012345678901234567890";

  const routesConfig: RoutesConfig = {
    "/weather": {
      price: "$0.001",
      network: "base-sepolia",
      config: middlewareConfig,
    },
  };

  const validPayment: PaymentPayload = {
    scheme: "exact",
    x402Version: 1,
    network: "base-sepolia",
    payload: {
      signature: "0x123",
      authorization: {
        from: "0x123",
        to: "0x456",
        value: "0x123",
        validAfter: "0x123",
        validBefore: "0x123",
        nonce: "0x123",
      },
    },
  };
  const encodedValidPayment = "encoded-payment";

  beforeEach(() => {
    vi.resetAllMocks();

    mockContext = {
      req: {
        url: "http://localhost:3000/weather",
        path: "/weather",
        method: "GET",
        header: vi.fn(),
        headers: new Headers(),
      },
      res: {
        status: 200,
        headers: new Headers(),
      },
      header: vi.fn(),
      json: vi.fn(),
      html: vi.fn(),
    } as unknown as Context;

    mockNext = vi.fn();
    mockVerify = vi.fn() as ReturnType<typeof useFacilitator>["verify"];
    mockSettle = vi.fn() as ReturnType<typeof useFacilitator>["settle"];
    (useFacilitator as ReturnType<typeof vi.fn>).mockReturnValue({
      verify: mockVerify,
      settle: mockSettle,
    });
    (getPaywallHtml as ReturnType<typeof vi.fn>).mockReturnValue("<html>Paywall</html>");

    // Setup exact.evm mocks
    (exact.evm.encodePayment as ReturnType<typeof vi.fn>).mockReturnValue(encodedValidPayment);
    (exact.evm.decodePayment as ReturnType<typeof vi.fn>).mockReturnValue(validPayment);

    // Setup findMatchingRoute mock
    (findMatchingRoute as ReturnType<typeof vi.fn>).mockImplementation(
      (routePatterns, path, method) => {
        if (path === "/weather" && method === "GET") {
          return {
            verb: "GET",
            pattern: /^\/weather$/,
            config: {
              price: "$0.001",
              network: "base-sepolia",
              config: middlewareConfig,
            },
          };
        }
        return undefined;
      },
    );

    middleware = paymentMiddleware(payTo, routesConfig, facilitatorConfig);
  });

  it("should return 402 with payment requirements when no payment header is present", async () => {
    (mockContext.req.header as ReturnType<typeof vi.fn>).mockImplementation((name: string) => {
      if (name === "Accept") return "application/json";
      return undefined;
    });

    await middleware(mockContext, mockNext);

    expect(mockContext.json).toHaveBeenCalledWith(
      {
        error: "X-PAYMENT header is required",
        accepts: [
          {
            scheme: "exact",
            network: "base-sepolia",
            maxAmountRequired: "1000",
            resource: "https://api.example.com/resource",
            description: "Test payment",
            mimeType: "application/json",
            payTo: "0x1234567890123456789012345678901234567890",
            maxTimeoutSeconds: 300,
            asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
            outputSchema,
            extra: {
              name: "USDC",
              version: "2",
            },
          },
        ],
        x402Version: 1,
      },
      402,
    );
  });

  it("should return HTML paywall for browser requests", async () => {
    (mockContext.req.header as ReturnType<typeof
    