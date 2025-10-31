"use client"

import React, { useState, useCallback, useRef } from "react"

interface SpookyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg" | "xl"
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
}

export const SpookyButton = React.forwardRef<HTMLButtonElement, SpookyButtonProps>(({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
  icon,
  iconPosition = "left",
  ...props
}, ref) => {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
  const rippleCounter = useRef(0)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const createRipple = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current || disabled || loading) return

      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const newRipple = {
        id: rippleCounter.current++,
        x,
        y,
      }

      setRipples((prev) => [...prev, newRipple])

      setTimeout(() => {
        setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
      }, 600)
    },
    [disabled, loading],
  )

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) return
      createRipple(e)
      // Call onClick handler (can be from props or added by SignInModal)
      onClick?.(e as any)
    },
    [disabled, loading, onClick, createRipple],
  )

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-br from-[#228B22] via-[#32CD32] to-[#7CFC00] text-[#0A0A0A] border-[#7CFC00]/60 shadow-[0_4px_20px_rgba(124,252,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_6px_30px_rgba(124,252,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]"
      case "secondary":
        return "bg-gradient-to-br from-[#9400D3] via-[#800080] to-[#4B0082] text-[#7CFC00] border-[#9400D3]/60 shadow-[0_4px_20px_rgba(148,0,211,0.4),inset_0_1px_0_rgba(124,252,0,0.2)] hover:shadow-[0_6px_30px_rgba(148,0,211,0.6),inset_0_1px_0_rgba(124,252,0,0.3)]"
      case "ghost":
        return "bg-[#1A0A1A]/50 text-[#7CFC00] border-[#228B22]/40 shadow-[0_2px_10px_rgba(34,139,34,0.2)] hover:bg-[#228B22]/20 hover:border-[#7CFC00]/50 hover:shadow-[0_4px_20px_rgba(124,252,0,0.3)]"
      default:
        return "bg-gradient-to-br from-[#228B22] via-[#32CD32] to-[#7CFC00] text-[#0A0A0A]"
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm min-h-[36px] rounded-xl"
      case "lg":
        return "px-8 py-4 text-lg min-h-[56px] rounded-2xl"
      case "xl":
        return "px-10 py-5 text-xl min-h-[64px] rounded-3xl"
      default:
        return "px-6 py-3 text-base min-h-[48px] rounded-xl"
    }
  }

  return (
    <button
      ref={ref || buttonRef}
      onClick={handleClick}
      disabled={disabled || loading}
      onMouseDown={() => !disabled && !loading && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative
        overflow-hidden
        font-bold
        tracking-wide
        border-2
        transition-all
        duration-200
        ease-out
        cursor-pointer
        select-none
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${isPressed ? "shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)]" : ""}
        ${className}
      `}
      {...props}
      style={{
        fontFamily: "var(--font-creepster), serif",
        textShadow: variant === "primary" 
          ? "0 2px 4px rgba(0,0,0,0.3)" 
          : variant === "secondary"
          ? "0 2px 4px rgba(10,10,10,0.5), 0 0 8px rgba(124,252,0,0.3)"
          : "0 2px 4px rgba(0,0,0,0.3)",
      }}
    >
      {/* Slime drip effects */}
      <div className="absolute top-0 left-[10%] w-1 h-4 bg-[#7CFC00]/30 rounded-b-full blur-sm animate-[drip_3s_ease-in-out_infinite]" />
      <div className="absolute top-0 left-[30%] w-1.5 h-5 bg-[#32CD32]/20 rounded-b-full blur-sm animate-[drip_4s_ease-in-out_infinite_0.5s]" />
      <div className="absolute top-0 right-[25%] w-1 h-3 bg-[#7CFC00]/25 rounded-b-full blur-sm animate-[drip_3.5s_ease-in-out_infinite_1s]" />

      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "4px",
            height: "4px",
            transform: "translate(-50%, -50%)",
            animation: "spookyRipple 0.6s ease-out forwards",
          }}
        />

      ))}

      {/* Glow overlay on hover */}
      <div
        className={`
          absolute inset-0 rounded-inherit
          bg-gradient-to-t from-transparent via-white/0 to-white/10
          opacity-0 hover:opacity-100
          transition-opacity duration-300
          pointer-events-none
          ${variant === "primary" ? "mix-blend-overlay" : variant === "secondary" ? "mix-blend-screen" : ""}
        `}
      />

      {/* Button content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
        )}
        {!loading && (
          <>
            {/* Icon-only button: show icon centered */}
            {!children && icon && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            {/* Button with children: show icon based on iconPosition */}
            {children && icon && iconPosition === "left" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            {children && (
              <span className={loading ? "opacity-70" : ""}>{children}</span>
            )}
            {children && icon && iconPosition === "right" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </>
        )}
      </div>

      {/* Bottom shadow/highlight */}
      <div
        className={`
          absolute bottom-0 left-0 right-0 h-1 rounded-b-inherit
          ${variant === "primary" 
            ? "bg-gradient-to-r from-[#228B22]/60 via-[#7CFC00]/40 to-[#228B22]/60" 
            : variant === "secondary"
            ? "bg-gradient-to-r from-[#9400D3]/60 via-[#7CFC00]/30 to-[#9400D3]/60"
            : "bg-gradient-to-r from-[#228B22]/40 via-transparent to-[#228B22]/40"
          }
        `}
      />
    </button>
  )
})

SpookyButton.displayName = 'SpookyButton'

