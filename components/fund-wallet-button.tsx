"use client"

import { useState, useCallback, useEffect } from "react"
import { useEvmAddress } from "@coinbase/cdp-hooks"
import { FundModal, type FundModalProps } from "@coinbase/cdp-react"
import { getBuyOptions, createBuyQuote } from "@/lib/onramp-api"
import { ModernButton } from "@/components/ui/modern-button"

interface LocationData {
  country: string
  subdivision?: string
  detected: boolean
}

export function FundWalletButton() {
  const { evmAddress } = useEvmAddress()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [location, setLocation] = useState<LocationData>({
    country: "US",
    subdivision: "CA",
    detected: false,
  })

  // Detect user's location on mount
  useEffect(() => {
    async function detectLocation() {
      try {
        const response = await fetch("/api/location")
        if (response.ok) {
          const data: LocationData = await response.json()
          setLocation(data)
          console.log(`[FundWallet] Location detected: ${data.country}${data.subdivision ? `/${data.subdivision}` : ""}`)
        }
      } catch (error) {
        console.error("[FundWallet] Failed to detect location:", error)
        // Keep default US/CA
      }
    }

    detectLocation()
  }, [])

  // Onramp API callback functions
  const fetchBuyQuote: FundModalProps["fetchBuyQuote"] = useCallback(async params => {
    return createBuyQuote(params)
  }, [])

  const fetchBuyOptions: FundModalProps["fetchBuyOptions"] = useCallback(async params => {
    return getBuyOptions(params)
  }, [])

  const handleOnrampSuccess = useCallback(() => {
    console.log("✅ Onramp purchase successful!")
    setIsModalOpen(false)
  }, [])

  // Only show for embedded wallets (CDP wallets have evmAddress from useEvmAddress)
  if (!evmAddress) {
    return null
  }

  return (
    <>
      <ModernButton onClick={() => setIsModalOpen(true)} size="sm">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Top Up</span>
      </ModernButton>

      {isModalOpen && evmAddress && (
        <FundModal
          open={isModalOpen}
          setIsOpen={setIsModalOpen}
          destinationAddress={evmAddress}
          country={location.country}
          subdivision={location.subdivision}
          cryptoCurrency="usdc"
          fiatCurrency="usd"
          fetchBuyQuote={fetchBuyQuote}
          fetchBuyOptions={fetchBuyOptions}
          network="base"
          presetAmountInputs={[2, 5, 10]}
          onSuccess={handleOnrampSuccess}
        />
      )}
    </>
  )
}
