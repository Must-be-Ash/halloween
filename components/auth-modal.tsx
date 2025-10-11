"use client"

import { useState, useEffect } from "react"
import { SignInModal } from "@coinbase/cdp-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useIsSignedIn } from "@coinbase/cdp-hooks"
import { useAccount } from "wagmi"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [selectedOption, setSelectedOption] = useState<"email" | "wallet" | null>(null)

  // Track authentication state
  const { isSignedIn: isCDPSignedIn } = useIsSignedIn()
  const { isConnected: isWagmiConnected } = useAccount()

  // Auto-close modal when user successfully signs in
  useEffect(() => {
    if (isCDPSignedIn || isWagmiConnected) {
      // Small delay to show success state
      const timer = setTimeout(() => {
        setSelectedOption(null)
        onClose()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isCDPSignedIn, isWagmiConnected, onClose])

  if (!isOpen) return null

  if (selectedOption === "email") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <button
            onClick={() => {
              setSelectedOption(null)
              onClose()
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in with Email</h2>
            <p className="text-sm text-gray-600">
              We'll create a secure wallet for you automatically
            </p>
          </div>

          <SignInModal>
            <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl">
              Continue with Email
            </button>
          </SignInModal>

          <button
            onClick={() => setSelectedOption(null)}
            className="w-full mt-3 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to options
          </button>
        </div>
      </div>
    )
  }

  if (selectedOption === "wallet") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
          <button
            onClick={() => {
              setSelectedOption(null)
              onClose()
            }}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Wallet</h2>
            <p className="text-sm text-gray-600">
              Use MetaMask, Coinbase Wallet, or any other wallet
            </p>
          </div>

          <div className="flex justify-center">
            <ConnectButton />
          </div>

          <button
            onClick={() => setSelectedOption(null)}
            className="w-full mt-6 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to options
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome!</h2>
          <p className="text-gray-600">
            Choose how you'd like to get started
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setSelectedOption("email")}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span>Continue with Email</span>
          </button>

          <button
            onClick={() => setSelectedOption("wallet")}
            className="w-full bg-white border-2 border-gray-300 hover:border-orange-400 hover:bg-orange-50 text-gray-700 hover:text-orange-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span>Connect External Wallet</span>
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Transform photos with AI for $0.05 USDC per image
          </p>
        </div>
      </div>
    </div>
  )
}
