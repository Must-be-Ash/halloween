import type { Metadata } from 'next'
import { Creepster } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import Providers from '@/components/providers'
import './globals.css'

const creepster = Creepster({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-creepster',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nano Banana Cam x402',
  description: 'Demo showcasing x402 HTTP micropayments for AI services. Pay $0.05 in USDC per image transformation using cryptocurrency - no subscriptions, instant settlement on Base network.',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'Nano Banana Cam x402',
    description: 'Demo showcasing x402 HTTP micropayments for AI services. Pay $0.05 in USDC per image transformation using cryptocurrency - no subscriptions, instant settlement on Base network.',
    url: 'https://x402-thumbnails.vercel.app',
    siteName: 'Nano Banana Cam x402',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Nano Banana Cam x402 - HTTP 402 Micropayments Demo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nano Banana Cam x402',
    description: 'Demo showcasing x402 HTTP micropayments for AI services. Pay $0.05 in USDC per image transformation using cryptocurrency - no subscriptions, instant settlement on Base network.',
    images: ['/og.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${creepster.variable} font-sans`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
