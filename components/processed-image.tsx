"use client"
import { SpookyButton } from "./spooky-button"
import { ModernButton } from "./ui/modern-button"
import { Sparkles, Download, RotateCcw, X } from "lucide-react" // removed Share import

interface ProcessedImageProps {
  originalImage: string
  processedImage: string | null
  isProcessing: boolean
  filterName: string
  onReset: () => void
  onDownload: () => void
  isFrontCamera: boolean
}

export function ProcessedImage({
  originalImage,
  processedImage,
  isProcessing,
  filterName,
  onReset,
  onDownload,
  isFrontCamera,
}: ProcessedImageProps) {
  const showProcessedImage = !!processedImage
  const showOriginalImage = !processedImage

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement("a")
      link.href = processedImage
      link.download = `bananacam-${filterName}-${Date.now()}.jpg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      onDownload()
    }
  }

  return (
    <div className="h-full w-full relative bg-[#0A0A0A]">
      {/* Main image */}
      <div className="h-full w-full relative">
        {showOriginalImage && (
          <img
            src={originalImage || "/placeholder.svg"}
            alt="Original photo"
            className={`w-full h-full object-cover ${isProcessing ? "blur-md" : ""}`}
          />
        )}

        {showProcessedImage && (
          <img
            src={processedImage || "/placeholder.svg"}
            alt="Processed photo with watermark"
            className="w-full h-full object-cover"
            onLoad={() => console.log("[x402-halloween] Processed image rendered successfully")}
            onError={(e) => {
              console.log("[x402-halloween] Error rendering processed image:", e)
              console.log("[x402-halloween] Image src:", processedImage)
            }}
          />
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/50 backdrop-blur-sm">
            <div className="text-center space-y-4">
              {/* Simple spinning loader */}
              <div className="w-16 h-16 mx-auto">
                <div className="w-16 h-16 border-4 border-[#7CFC00]/20 border-t-[#7CFC00] rounded-full animate-spin"></div>
              </div>
              <p className="text-[#7CFC00] font-medium text-lg">Processing with {filterName}...</p>
            </div>
          </div>
        )}

        {/* Top controls */}
        <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-[#0A0A0A]/80 to-transparent">
          <div className="flex justify-between items-center">
            <SpookyButton
              onClick={onReset}
              variant="ghost"
              size="sm"
              icon={<X className="w-5 h-5" />}
              className="rounded-full w-10 h-10 p-0"
            />

            <div className="flex items-center space-x-2 bg-[#228B22]/30 backdrop-blur-sm rounded-full px-4 py-2 border border-[#7CFC00]/20">
              <Sparkles className="w-4 h-4 text-[#7CFC00]" />
              <span className="text-[#7CFC00] font-medium">{filterName}</span>
            </div>
          </div>
        </div>

        {/* Bottom controls */}
        {!isProcessing && processedImage && (
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 pb-12 md:pb-8 bg-gradient-to-t from-[#0A0A0A]/80 to-transparent">
            <div className="flex justify-center items-center space-x-3 md:space-x-4">
              <SpookyButton
                onClick={onReset}
                variant="ghost"
                size="md"
                icon={<RotateCcw className="w-5 md:w-6 h-5 md:h-6" />}
                className="p-3 md:p-4 rounded-2xl"
              >
                RESET
              </SpookyButton>

              <SpookyButton
                onClick={handleDownload}
                variant="primary"
                size="md"
                icon={<Download className="w-5 md:w-6 h-5 md:h-6" />}
                className="p-3 md:p-4 rounded-2xl"
              >
                DOWNLOAD
              </SpookyButton>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
