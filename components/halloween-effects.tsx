"use client"

import { useEffect, useState } from "react"

export function HalloweenEffects() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Smoke effects with purple/green mix */}
      <div className="halloween-smoke" style={{ left: "10%", bottom: "10%", animationDelay: "0s" }} />
      <div className="halloween-smoke-2" style={{ left: "20%", bottom: "15%", animationDelay: "2s" }} />
      <div className="halloween-smoke" style={{ right: "15%", bottom: "20%", animationDelay: "4s" }} />
      <div className="halloween-smoke-2" style={{ right: "25%", bottom: "10%", animationDelay: "6s" }} />
      
      {/* Green slime bubbles */}
      <div className="halloween-slime" style={{ left: "15%", animationDelay: "0s" }} />
      <div className="halloween-slime-2" style={{ left: "35%", animationDelay: "3s" }} />
      <div className="halloween-slime" style={{ right: "20%", animationDelay: "6s" }} />
      <div className="halloween-slime-2" style={{ right: "40%", animationDelay: "9s" }} />
      <div className="halloween-slime" style={{ left: "50%", animationDelay: "12s" }} />
      
      {/* Additional smoke effects */}
      <div className="halloween-smoke" style={{ left: "60%", bottom: "30%", animationDelay: "8s" }} />
      <div className="halloween-smoke-2" style={{ right: "10%", bottom: "25%", animationDelay: "10s" }} />
    </div>
  )
}

