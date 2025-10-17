# React Components

## Overview

CDP React components provide pre-built, customizable UI elements for common self-custodial wallet and authentication flows, built on top of the CDP Embedded Wallets SDK. This guide will help you get started with `@coinbase/cdp-react` components in your application.

<Tip>
  Check out the [CDP Web SDK reference](/sdks/cdp-sdks-v2/frontend) for comprehensive method signatures, types, and examples.
</Tip>

## Prerequisites

The fastest way to get started is to complete the [Quickstart](/embedded-wallets/quickstart). If you already have your own app, you should complete the prerequisites below before proceeding. You will need:

1. A [CDP Portal](https://portal.cdp.coinbase.com) account and CDP project
2. [Node.js 22+](https://nodejs.org/en/download) installed
3. Your local app domain [configured](/embedded-wallets/domains) in [CDP Portal](https://portal.cdp.coinbase.com/products/embedded-wallets/domains)
4. A package manager of your choice, with `cdp-react` installed:

<CodeGroup>
  ```bash pnpm
  # With pnpm
  pnpm add @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks
  ```

  ```bash yarn
  # With yarn
  yarn add @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks
  ```

  ```bash npm
  # With npm
  npm install @coinbase/cdp-react @coinbase/cdp-core @coinbase/cdp-hooks
  ```
</CodeGroup>

## 1. Setup React provider

Wrap your application with the `CDPReactProvider`, providing the necessary context for hooks and components to work correctly with CDP. It also provides access to config data and theming.

<Warning>
  **Using Next.js?** Check out our [Next.js integration guide](/embedded-wallets/nextjs) for `"use client"` requirements and common gotchas.
</Warning>

Update your main application file (e.g., `main.tsx` or `App.tsx`) to include the provider:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Your main App component
import { type Config } from '@coinbase/cdp-core';
import { CDPReactProvider, type Theme } from '@coinbase/cdp-react';

// Your CDP config
const cdpConfig: Config = {
  projectId: "your-project-id", // Replace with your Project ID from CDP Portal
  basePath: "https://api.cdp.coinbase.com", // CDP API url
  useMock: false, // Use live APIs or use mock data for testing
  debugging: false, // Log API requests and responses
  appName: "My app", // the name of your application
  appLogoUrl: "https://picsum.photos/64", // logo will be displayed in select components
}

// You can customize the theme by overriding theme variables
const themeOverrides: Partial<Theme> = {
  "colors-background": "black",
  "colors-backgroundOverlay": "rgba(0,0,0,0.5)",
  "colors-text": "white",
  "colors-textSecondary": "#999999",
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CDPReactProvider config={cdpConfig} theme={themeOverrides}>
      <App />
    </CDPReactProvider>
  </React.StrictMode>,
);
```

## 2. Render a CDP component

Now you can use the components from the library. Let's add the `AuthButton` component to your application. This component handles both sign-in and sign-out functionality.

```tsx
// In your App.tsx or any other component
import { AuthButton } from '@coinbase/cdp-react/components/AuthButton';

function App() {
  return (
    <div>
      <h1>Welcome</h1>
      <AuthButton />
    </div>
  );
}

export default App;
```

That's it! You've successfully installed `@coinbase/cdp-react`, set up the provider, and rendered your first component.

Find all available components and their documentation in the [CDP React module reference](/sdks/cdp-sdks-v2/frontend/@coinbase/cdp-react).

## 3. Customize theme (optional)

CDP React components come with a comprehensive theming system that allows you to customize the look and feel of all components to match your brand. The theme is built on a small set of core **semantic tokens** that control foundational styles like colors and typography. These are inherited by more specific **component tokens** used to style individual UI elements.

You can customize the theme by passing a `theme` object to the `CDPReactProvider`:

```tsx
import { type Theme } from "@coinbase/cdp-react/theme";

const customTheme: Partial<Theme> = {
  // Background colors
  "colors-bg-default": "#ffffff",
  "colors-bg-overlay": "rgba(0, 0, 0, 0.8)", // Override default (33% of colors-bg-alternate)
  "colors-bg-skeleton": "rgba(0, 0, 0, 0.05)", // Override default (10% of colors-fg-default)
  "colors-bg-primary": "#0052ff",
  "colors-bg-secondary": "#f5f5f5",
  
  // Text colors
  "colors-fg-default": "#000000",
  "colors-fg-muted": "#666666",
  "colors-fg-primary": "#0052ff",
  "colors-fg-onPrimary": "#ffffff",
  "colors-fg-onSecondary": "#000000",
  
  // Border colors
  "colors-line-default": "#e0e0e0",
  "colors-line-heavy": "#333333",
  "colors-line-primary": "#0052ff",
  
  // Typography
  "font-family-sans": "Inter, system-ui, sans-serif",
  "font-size-base": "16px",
};

// Apply the theme to your provider
<CDPReactProvider config={cdpConfig} theme={customTheme}>
  <App />
</CDPReactProvider>
```

<Tip>
  The theme configuration uses `Partial<Theme>`, so you only need to include the variables you want to customize. Any variables you don't specify will use CDP React's default values.
</Tip>

### Semantic theme variables

This section lists the core **semantic tokens** that form the foundation of the theme. You only need to customize these tokens to apply a new theme across your entire application.

Each token maps to a primary CSS variable which is then inherited by multiple component-level variables. The table below lists the primary mapping and provides an example of a component variable that inherits from it. For an exhaustive list of all tokens along with their default values, see the [Theming page](/embedded-wallets/theming).

<Tip>
  Theme tokens are rendered as CSS variables under the namespace `cdp-web` (i.e. `colors-page-bg-default` becomes `--cdp-web-colors-page-bg-default`).
</Tip>

| Token                   | Description                                                                                 | CSS variable mapping                                                                                |
| ----------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Backgrounds**         |                                                                                             |                                                                                                     |
| `colors-bg-default`     | Default page and input background                                                           | `--cdp-web-colors-bg-default` (inherited by e.g. `--cdp-web-colors-page-bg-default`)                |
| `colors-bg-alternate`   | Alternate backgrounds (e.g. cards)                                                          | `--cdp-web-colors-bg-alternate` (inherited by e.g. `--cdp-web-colors-code-bg-default`)              |
| `colors-bg-contrast`    | A contrast color mixed with other backgrounds to generate default hover and pressed states. | `--cdp-web-colors-bg-contrast`                                                                      |
| `colors-bg-overlay`     | Overlay UI (e.g. modals). Defaults to 33% opacity of `colors-bg-alternate`                  | `--cdp-web-colors-bg-overlay`                                                                       |
| `colors-bg-skeleton`    | Loading placeholders. Defaults to 10% opacity of `colors-fg-default`                        | `--cdp-web-colors-bg-skeleton`                                                                      |
| `colors-bg-primary`     | Primary brand background (e.g. CTA)                                                         | `--cdp-web-colors-bg-primary` (inherited by e.g. `--cdp-web-colors-cta-primary-bg-default`)         |
| `colors-bg-secondary`   | Secondary background (e.g. secondary CTA)                                                   | `--cdp-web-colors-bg-secondary` (inherited by e.g. `--cdp-web-colors-cta-secondary-bg-default`)     |
| **Text**                |                                                                                             |                                                                                                     |
| `colors-fg-default`     | Default text color                                                                          | `--cdp-web-colors-fg-default` (inherited by e.g. `--cdp-web-colors-page-text-default`)              |
| `colors-fg-muted`       | Muted/placeholder text                                                                      | `--cdp-web-colors-fg-muted` (inherited by e.g. `--cdp-web-colors-page-text-muted`)                  |
| `colors-fg-primary`     | Primary action text (e.g. links)                                                            | `--cdp-web-colors-fg-primary` (inherited by e.g. `--cdp-web-colors-link-primary-text-default`)      |
| `colors-fg-onPrimary`   | Text on primary backgrounds                                                                 | `--cdp-web-colors-fg-onPrimary` (inherited by e.g. `--cdp-web-colors-cta-primary-text-default`)     |
| `colors-fg-onSecondary` | Text on secondary backgrounds                                                               | `--cdp-web-colors-fg-onSecondary` (inherited by e.g. `--cdp-web-colors-cta-secondary-text-default`) |
| `colors-fg-positive`    | Success messaging text                                                                      | `--cdp-web-colors-fg-positive` (inherited by e.g. `--cdp-web-colors-input-successText-default`)     |
| `colors-fg-negative`    | Error messaging text                                                                        | `--cdp-web-colors-fg-negative` (inherited by e.g. `--cdp-web-colors-input-errorText-default`)       |
| `colors-fg-warning`     | Warning messaging text                                                                      | `--cdp-web-colors-fg-warning`                                                                       |
| **Borders**             |                                                                                             |                                                                                                     |
| `colors-line-default`   | Standard borders (e.g. dividers)                                                            | `--cdp-web-colors-line-default` (inherited by e.g. `--cdp-web-colors-page-border-default`)          |
| `colors-line-heavy`     | Higher contrast borders (e.g. inputs)                                                       | `--cdp-web-colors-line-heavy` (inherited by e.g. `--cdp-web-colors-input-border-default`)           |
| `colors-line-primary`   | Primary brand color borders (e.g. for focus/active state)                                   | `--cdp-web-colors-line-primary` (inherited by e.g. `--cdp-web-colors-input-border-focus`)           |
| `colors-line-positive`  | Success state borders                                                                       | `--cdp-web-colors-line-positive` (inherited by e.g. `--cdp-web-colors-input-border-success`)        |
| `colors-line-negative`  | Error borders                                                                               | `--cdp-web-colors-line-negative` (inherited by e.g. `--cdp-web-colors-input-border-error`)          |
| **Typography**          |                                                                                             |                                                                                                     |
| `font-family-sans`      | Sans-serif font family                                                                      | `--cdp-web-font-family-sans`                                                                        |
| `font-family-mono`      | Monospace font family                                                                       | `--cdp-web-font-family-mono`                                                                        |
| `font-size-base`        | Base font size                                                                              | `--cdp-web-font-size-base`                                                                          |

<Accordion title="Smart color defaults">
  Some theme colors automatically derive from other theme values, reducing the need for manual configuration:

  * **`colors-bg-overlay`**: Automatically uses 33% opacity of `colors-bg-alternate`
  * **`colors-bg-skeleton`**: Automatically uses 10% opacity of `colors-fg-default`

  This means if you only set `colors-bg-alternate` and `colors-fg-default`, the overlay and skeleton colors will automatically adjust to complement your theme with no additional configuration needed.
</Accordion>

<Tip>
  Customizing a theme variable like `colors-bg-primary` updates all components that inherit from that color without additional CSS overrides.
</Tip>

### Dynamic themes

For more dynamic theming (e.g., dark/light mode support), you can reference CSS variables in your theme definition:

```tsx
const dynamicTheme: Partial<Theme> = {
  "colors-bg-default": "var(--app-card-bg)",
  "colors-bg-primary": "var(--app-primary-color)",
  "colors-fg-default": "var(--app-text-color)",
  "colors-fg-muted": "var(--app-text-secondary)",
  // colors-bg-overlay and colors-bg-skeleton will automatically derive from other colors
  // ... other variables
};
```

Then define these CSS variables in your stylesheet:

```css
:root {
  --app-card-bg: #ffffff;
  --app-primary-color: #0052ff;
  --app-text-color: #000000;
  --app-text-secondary: #666666;
}

/* Dark mode example */
@media (prefers-color-scheme: dark) {
  :root {
    --app-card-bg: #1a1a1a;
    --app-primary-color: #3b82f6;
    --app-text-color: #ffffff;
    --app-text-secondary: #a0a0a0;
  }
}
```

<Tip>
  Theme changes are applied instantly across all CDP React components. You don't need to restart your application or refresh the page to see theme updates.
</Tip>

## What to read next

* [**CDP Web SDK Documentation**](/sdks/cdp-sdks-v2/frontend): Comprehensive API reference for the CDP Web SDK
* [**Embedded Wallet - React Hooks**](/embedded-wallets/react-hooks): Use CDP hooks for custom implementations
* [**Embedded Wallet - Theming**](/embedded-wallets/theming): Explore all semantic and component theme tokens
* [**Embedded Wallet - Wagmi Integration**](/embedded-wallets/wagmi): Combine CDP components with wagmi
* [**Embedded Wallet - Next.js**](/embedded-wallets/nextjs): Special considerations for Next.js applications
* [**Security & Export**](/embedded-wallets/security-export): Learn about private key export security considerations and implementation
