"use client"

import { useState, useCallback } from "react"
import { useEvmAddress } from "@coinbase/cdp-hooks"
import { FundModal, type FundModalProps } from "@coinbase/cdp-react"
import { getBuyOptions, createBuyQuote } from "@/lib/onramp-api"

export function FundWalletButton() {
  const { evmAddress } = useEvmAddress()
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get the user's location (for Onramp) - you can customize this
  const userCountry = "US"
  const userSubdivision = "CA"

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
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span>Fund Wallet</span>
      </button>

      {isModalOpen && evmAddress && (
        <FundModal
          open={isModalOpen}
          setIsOpen={setIsModalOpen}
          destinationAddress={evmAddress}
          country={userCountry}
          subdivision={userSubdivision}
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
