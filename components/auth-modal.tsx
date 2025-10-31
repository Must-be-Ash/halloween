"use client"

import { useEffect } from "react"
import { SignInModal } from "@coinbase/cdp-react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useIsSignedIn } from "@coinbase/cdp-hooks"
import { useAccount } from "wagmi"
import { ModernButton } from "@/components/ui/modern-button"
import { SpookyButton } from "@/components/spooky-button"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  // Track authentication state
  const { isSignedIn: isCDPSignedIn } = useIsSignedIn()
  const { isConnected: isWagmiConnected } = useAccount()

  // Auto-close modal when user successfully signs in
  useEffect(() => {
    if (isCDPSignedIn || isWagmiConnected) {
      // Small delay to show success state
      const timer = setTimeout(() => {
        onClose()
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [isCDPSignedIn, isWagmiConnected, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/90 backdrop-blur-md">
      <div className="relative max-w-md w-full mx-4">
        {/* Background Card - Mostly Hidden, Only Bottom Visible */}
        <div className="absolute inset-x-0 top-8 h-[calc(100%+2rem)] bg-gradient-to-br from-[#228B22]/20 to-[#9400D3]/10 backdrop-blur-lg rounded-3xl border border-[#7CFC00]/30 flex items-end justify-center pb-6">
          <p className="text-xs text-[#7CFC00] text-center drop-shadow">
            Make a Halloween photo for $0.01
          </p>
        </div>

        {/* Top Card - Main Content with Drop Shadow */}
        <div className="relative bg-[#1A0A1A] rounded-3xl shadow-2xl border border-[#228B22]/40 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#7CFC00]/60 hover:text-[#7CFC00] hover:bg-[#228B22]/20 rounded-full p-1 transition-all duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-center mb-8">
            <div className="mx-auto mb-6 flex items-center justify-center">
              <span className="text-6xl drop-shadow-lg">🎃</span>
            </div>
            <h2 className="text-4xl font-bold text-[#7CFC00] mb-3">Say Cheese!</h2>
            <p className="text-[#7CFC00]/70">
              Choose how you'd like to get started
            </p>
          </div>

          <div className="space-y-4">
            {/* Email Auth - SignInModal wrapper opens CDP auth immediately */}
            <SignInModal>
              <SpookyButton variant="primary" size="lg" className="w-full" icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              } iconPosition="left">
                LOGIN WITH EMAIL
              </SpookyButton>
            </SignInModal>

            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-[#228B22]/40"></div>
              <span className="text-xs uppercase text-[#7CFC00]/60">or</span>
              <div className="flex-1 border-t border-[#228B22]/40"></div>
            </div>

            {/* Wallet Connect - ConnectButton.Custom for styling consistency */}
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <SpookyButton onClick={openConnectModal} variant="secondary" size="lg" className="w-full" icon={
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                } iconPosition="left">
                  CONNECT WALLET
                </SpookyButton>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      </div>
    </div>
  )
}
