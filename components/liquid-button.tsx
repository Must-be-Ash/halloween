"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { LiquidGlass } from "./liquid-glass"

interface LiquidButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg" | "xl"
  disabled?: boolean
  loading?: boolean
  className?: string
  style?: React.CSSProperties
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  rippleEffect?: boolean
}

export function LiquidButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  style,
  icon,
  iconPosition = "left",
  rippleEffect = true,
}: LiquidButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "text-white border-[#7CFC00]/40 hover:border-[#7CFC00]/60 [background:linear-gradient(135deg,rgba(124,252,0,0.2)_0%,rgba(148,0,211,0.15)_100%)] hover:[background:linear-gradient(135deg,rgba(124,252,0,0.3)_0%,rgba(148,0,211,0.2)_100%)]"
      case "secondary":
        return "text-[#7CFC00] border-[#228B22]/30 hover:border-[#228B22]/50 [background:rgba(34,139,34,0.1)] hover:[background:rgba(34,139,34,0.15)]"
      case "ghost":
        return "text-white border-[#228B22]/20 hover:border-[#228B22]/30 [background:transparent] hover:[background:rgba(34,139,34,0.05)]"
      case "danger":
        return "text-white border-[#FF4500]/40 hover:border-[#FF4500]/60 [background:rgba(255,69,0,0.2)] hover:[background:rgba(255,69,0,0.3)]"
      default:
        return "text-white border-[#228B22]/30 [background:rgba(34,139,34,0.1)]"
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm rounded-xl"
      case "lg":
        return "px-8 py-4 text-lg rounded-2xl"
      case "xl":
        return "px-10 py-5 text-xl rounded-3xl"
      default:
        return "px-6 py-3 text-base rounded-2xl"
    }
  }

  const handleClick = useCallback(() => {
    if (disabled || loading) return

    setIsPressed(false)
    onClick?.()
  }, [disabled, loading, onClick])

  const buttonContent = (
    <div className="flex items-center justify-center gap-2">
      {loading && <div className="w-4 h-4 border-2 border-[#7CFC00]/30 border-t-[#7CFC00] rounded-full animate-spin" />}
      {icon && iconPosition === "left" && !loading && <span className="flex-shrink-0">{icon}</span>}
      <span className={loading ? "opacity-70" : ""}>{children}</span>
      {icon && iconPosition === "right" && !loading && <span className="flex-shrink-0">{icon}</span>}
    </div>
  )

  return (
    <LiquidGlass
      variant="button"
      intensity="medium"
      rippleEffect={rippleEffect}
      flowOnHover={!disabled}
      stretchOnDrag={!disabled}
      onClick={handleClick}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${isPressed ? "scale-95" : ""}
        transition-all duration-150 ease-out
        font-medium
        select-none
        backdrop-blur-3xl
        ${className}
      `}
      style={style}
    >
      {buttonContent}
    </LiquidGlass>
  )
}
