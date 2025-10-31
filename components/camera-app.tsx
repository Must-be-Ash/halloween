"use client"
import { useState, useCallback } from "react"
import { useAccount, useWalletClient } from "wagmi"
import { useEvmAddress } from "@coinbase/cdp-hooks"
import { getCurrentUser, toViemAccount } from "@coinbase/cdp-core"
import { CameraCapture } from "./camera-capture"
import { ProcessedImage } from "./processed-image"
import { HalloweenEffects } from "./halloween-effects"
import { addWatermark } from "../lib/watermark"
import { createWalletClient, http, publicActions } from "viem"
import { base } from "viem/chains"

export type FilterType =
  | "none"
  | "acid"
  | "vintage"
  | "cyberpunk"
  | "underwater"
  | "medieval"
  | "apocalypse"
  | "steampunk"
  | "tropical"
  | "winter"
  | "neon_tokyo"
  | "wild_west"
  | "art_deco"
  | "fairy_tale"
  | "horror"
  | "desert_mirage"
  | "crystal_cave"
  | "floating_islands"
  | "time_machine"
  | "spy"
  | "gothic"
  | "90s"
  | "disco"

export interface Filter {
  id: FilterType
  name: string
  description: string
  prompt: string
}

const filters: Filter[] = [
  {
    id: "none",
    name: "No Filter",
    description: "Pure custom",
    prompt: "",
  },
  {
    id: "art_deco",
    name: "Frankenstein",
    description: "Monster lab",
    prompt:
      "Transform people into Frankenstein's monster: greenish-gray skin tone, neck bolts, stitched scars across face and neck, heavy brow, flat-top hairstyle, tattered Victorian clothing with leather straps, oversized boots, metal bolts and electrodes, raggedy coat. Add laboratory environment: electrical equipment, Tesla coils sparking, old stone laboratory walls, metal operating tables, bubbling beakers with green liquid, lightning rod apparatus, chains hanging, vintage scientific instruments, cobwebs, flickering electrical sparks, mysterious machinery. Apply eerie green and purple electrical lighting with dramatic shadows and stormy atmosphere.",
  },
  {
    id: "cyberpunk",
    name: "Witch",
    description: "Magical spells",
    prompt:
      "Transform people into witches: pointed black hats with buckles, flowing dark robes and cloaks, crooked nose with warts, green face paint, long fingernails, mystical amulets, broomstick accessory, spell book in hand, purple and black layered dresses, striped stockings, buckled boots, occult jewelry, wild dark hair. Add witches' environment: haunted forest with twisted trees, bubbling cauldron with green smoke, spell ingredients scattered around, magic potions in bottles, flying bats, full moon in background, mystical crystals, candles dripping wax, black cats, cobwebs, ancient spell books, magic circles on ground. Apply eerie purple and green mystical lighting with swirling magical mist and enchanted atmosphere.",
  },
  {
    id: "wild_west",
    name: "Dracula",
    description: "Vampire lord",
    prompt:
      "Transform people into vampires: pale white skin, sharp fangs visible, slicked-back dark hair, dramatic high-collared black cape with red lining, Victorian formal attire, white ruffled shirt, black vest and coat, blood-red accents, dark eyeshadow around eyes, widow's peak hairstyle, ornate rings, medallion necklace, elegant leather gloves. Add vampire castle environment: gothic castle interior, ornate coffin, stone walls with torches, cobwebs in corners, candelabras with dripping candles, red velvet curtains, ancient portraits, stone gargoyles, moonlight streaming through arched windows, bats flying, misty atmosphere, medieval chandeliers, crimson roses. Apply dramatic moonlight with deep red and purple shadows and mysterious nocturnal atmosphere.",
  },
  {
    id: "vintage",
    name: "Werewolf",
    description: "Full moon beast",
    prompt:
      "Transform people into werewolves: fur covering face and hands, pointed wolf ears, elongated snout with sharp teeth, yellow glowing eyes, claw-like fingernails, wild unkempt hair, torn and tattered clothing, muscular build, fangs visible, hairy arms and chest, animalistic features, rugged leather vest, ripped pants, bare feet with claws. Add forest environment: dark woods with twisted trees, full moon glowing bright, fog rolling through ground, ancient oak trees, scattered bones, muddy forest floor, howling wolves in distance, abandoned cabin, claw marks on trees, mysterious shadows, fallen leaves, rocky terrain. Apply silvery moonlight with blue-tinted shadows and wild nocturnal atmosphere.",
  },
  {
    id: "underwater",
    name: "Zombie",
    description: "Undead horror",
    prompt:
      "Transform people into zombies: pale gray-green decaying skin, dark circles under eyes, blood stains on face and clothes, torn and dirty clothing, disheveled hair, exposed wounds and cuts, rotting flesh appearance, missing chunks of skin, blank stare, crooked teeth, muddy hands, tattered pants and shirt, bare feet, skeletal features showing through. Add graveyard environment: old tombstones tilted and cracked, fog creeping along ground, dead trees with bare branches, freshly dug graves, zombie hands reaching from ground, broken cemetery gates, ravens perched on monuments, scattered bones, overgrown weeds, full moon behind clouds, eerie mist, abandoned mausoleums. Apply sickly green and gray lighting with foggy haze and post-apocalyptic atmosphere.",
  },
  {
    id: "medieval",
    name: "Ghost",
    description: "Ethereal spirit",
    prompt:
      "Transform people into ghosts: translucent pale white appearance, semi-transparent floating effect, flowing white sheets or burial shrouds, hollow dark eyes, ethereal glow, Victorian-era clothing faded and tattered, chains dragging behind, wispy hair flowing, spectral hands, misty aura surrounding body, vintage nightgown or old suit, barefoot hovering. Add haunted mansion environment: abandoned Victorian house interior, dusty furniture covered in white sheets, creaky wooden floors, cobwebs everywhere, antique mirrors reflecting nothing, flickering candles, old portraits on walls, grandfather clock stopped at midnight, spiral staircase, broken chandeliers, misty corners, peeling wallpaper, dusty books. Apply cold blue-white ghostly lighting with ethereal glow and supernatural atmosphere.",
  },
  {
    id: "neon_tokyo",
    name: "Mummy",
    description: "Ancient curse",
    prompt:
      "Transform people into mummies: wrapped in aged beige bandages covering entire body, bandages loosely hanging and unraveling, visible gaps showing dried skin beneath, hollow eyes peering through wrappings, ancient Egyptian jewelry and amulets, tarnished gold collar and bracelets, weathered cloth strips, dusty appearance, cracked dried skin visible in openings, hieroglyphic symbols on bandages, ceremonial headdress. Add Egyptian tomb environment: ancient pyramid interior, stone sarcophagus opened, hieroglyphics carved on walls, golden treasures scattered, dusty sandstone blocks, flickering torches, scarab beetles crawling, canopic jars, ancient scrolls, sand drifting in, mysterious shadows, crumbling pillars, treasure chambers. Apply warm amber and golden torch lighting with dusty haze and ancient cursed atmosphere.",
  },
  {
    id: "steampunk",
    name: "Skeleton",
    description: "Bones revealed",
    prompt:
      "Transform people into skeletons: white bone face paint showing skull structure, black around eyes and nose, visible teeth and jawbone, skeletal hands with bone details, rib cage painted on torso, spine visible on back, joint bones on elbows and knees, black body suit underneath with white bone overlay, skull mask or face paint, bony fingers, tattered black cloak, top hat or bone accessories. Add crypt environment: underground catacombs, skulls stacked on walls, ancient bones scattered on floor, stone archways, cobwebs hanging, rusty gates, bone piles, candlelit alcoves, medieval crypts, dusty coffins, underground passages, dripping water, moss-covered stones. Apply cold gray and blue bone-white lighting with shadowy underground atmosphere.",
  },
  {
    id: "spy",
    name: "Black Cat",
    description: "Feline familiar",
    prompt:
      "Transform people into black cat creatures: sleek black cat ears headband, painted black nose and whiskers on face, dramatic cat eye makeup, black face paint or mask, sharp drawn-on fangs, black furry tail, all-black outfit with sleek bodysuit or dress, black gloves with painted claws, cat collar with bell, furry black boots or paws, feline grace pose, yellow or green glowing contact lenses, black velvet clothing. Add mysterious alley environment: moonlit night scene, brick walls with ivy, witch's familiar setting, mysterious fog, full moon overhead, rooftop silhouettes, shadowy corners, autumn leaves scattered, iron fence with ornate design, vintage lamp posts, cobblestone streets, mysterious doorways, arched windows. Apply dramatic moonlight with deep blue and purple shadows and mystical nocturnal atmosphere.",
  },
  {
    id: "gothic",
    name: "Haunted Doll",
    description: "Possessed porcelain",
    prompt:
      "Transform people into creepy dolls: porcelain-white face paint, exaggerated round painted cheeks in pink circles, oversized painted-on eyes with long lashes, small pursed red lips, cracked face makeup showing broken porcelain, Victorian-style dress with lace and ribbons, frilly collar and sleeves, mary jane shoes with white socks, ringlet curls or pigtails with large bows, stitched mouth appearance, button eyes option, vintage doll clothing, frozen doll-like expression. Add dollhouse environment: oversized vintage dollhouse room, giant antique toys scattered around, rocking horse in corner, old teddy bears with missing eyes, vintage toy chest, floral wallpaper peeling, child's room from past era, porcelain dolls on shelves watching, broken music box, dusty playroom, cobwebs on toy furniture, cracked mirrors. Apply dim dusty lighting with eerie pink and blue tones and unsettling childhood atmosphere.",
  },
  {
    id: "90s",
    name: "Pumpkin King",
    description: "Jack's realm",
    prompt:
      "Transform people into pumpkin creatures: orange pumpkin head with carved jack-o'-lantern face, glowing triangular eyes, wide carved smile with visible teeth, stem on top of head like hat, orange and black striped clothing, skeletal pinstripe suit, bat bow tie, long spindly fingers, autumn leaves as accessories, pumpkin patch king crown, tattered elegant coat, vine decorations wrapped around arms, gothic gentleman style with pumpkin twist. Add Halloween Town environment: twisted bare trees with curled branches, rolling pumpkin patch hills, spiral mountain in background, crooked houses with steep roofs, jack-o'-lanterns everywhere glowing, autumn leaves swirling, full harvest moon, graveyard fence, scarecrows, gothic town square, stone fountain, wrought iron gates, orange and purple sky. Apply warm orange and purple Halloween lighting with magical autumn glow and whimsical spooky atmosphere.",
  },
  {
    id: "disco",
    name: "Creepy Clown",
    description: "Sinister circus",
    prompt:
      "Transform people into scary clowns: exaggerated white face paint with cracked texture, oversized red nose, sinister smile painted wider than natural mouth with sharp teeth, dramatic black eye makeup dripping down, colorful wild wig in red or rainbow, ruffled collar in bright colors, polka dot or striped costume, oversized shoes, tattered circus outfit, face paint running and smeared, evil grin expression, theatrical makeup, suspenders, bow tie, vintage circus performer clothes with dark twist. Add creepy carnival environment: abandoned circus tent with holes, rusty carnival rides, broken carousel horses, faded circus posters peeling, dim carnival lights flickering, old popcorn stands, warped funhouse mirrors, scattered balloons deflating, fog rolling across ground, dilapidated ticket booth, eerie circus music box, striped tent fabric torn, cobwebs on equipment. Apply harsh red and yellow spotlight lighting with deep shadows and unsettling carnival atmosphere.",
  },
]

export function CameraApp() {
  const [selectedFilterIndex, setSelectedFilterIndex] = useState(1)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedWithFrontCamera, setCapturedWithFrontCamera] = useState(false)
  const [customPrompt, setCustomPrompt] = useState<string>("")

  // Wagmi hooks - now detect BOTH CDP and external wallets
  const { address, isConnected, connector } = useAccount()
  const { data: walletClient } = useWalletClient()

  // Detect wallet type based on connector
  // CDP connector has id/name containing "cdp" or "embedded"
  const isCDPWallet = Boolean(
    connector?.id?.toLowerCase().includes('cdp') ||
    connector?.id?.toLowerCase().includes('embedded') ||
    connector?.name?.toLowerCase().includes('cdp')
  );

  const selectedFilter = filters[selectedFilterIndex]

  const handleCapture = useCallback(
    async (imageDataUrl: string, facingMode: "user" | "environment") => {
      setCapturedImage(imageDataUrl)
      setProcessedImage(null)
      setCapturedWithFrontCamera(facingMode === "user")

      setIsProcessing(true)

      try {
        // Validate: need either custom prompt OR a filter (not "none")
        const hasCustomPrompt = customPrompt.trim().length > 0
        const hasFilter = selectedFilter.id !== "none"

        if (!hasCustomPrompt && !hasFilter) {
          throw new Error("Please enter a custom prompt or select a filter")
        }

        // Log what we're processing
        if (hasCustomPrompt && !hasFilter) {
          console.log("[thumbnail-maker] Processing with custom prompt only:", customPrompt.substring(0, 50) + "...")
        } else if (!hasCustomPrompt && hasFilter) {
          console.log("[thumbnail-maker] Processing with filter only:", selectedFilter.id)
        } else {
          console.log("[thumbnail-maker] Processing with custom prompt + filter:", selectedFilter.id)
          console.log("[thumbnail-maker] Custom prompt:", customPrompt.substring(0, 50) + "...")
        }

        // Check if wallet is connected
        if (!isConnected) {
          throw new Error("Please connect your wallet to process images")
        }

        // Import x402-fetch
        const { wrapFetchWithPayment } = await import("x402-fetch")

        // Create viem client based on wallet type
        // Type annotation bypasses complex viem/x402 type incompatibility
        let viemClient: any

        if (isCDPWallet) {
          // Using CDP embedded wallet (email sign-in)
          console.log("[thumbnail-maker] Using CDP embedded wallet for x402 payment")

          try {
            const user = await getCurrentUser()
            if (user && user.evmAccounts && user.evmAccounts.length > 0) {
              const viemAccount = await toViemAccount(user.evmAccounts[0])
              const chain = base
              const rpcUrl = 'https://mainnet.base.org'

              viemClient = createWalletClient({
                account: viemAccount,
                chain: chain,
                transport: http(rpcUrl),
              }).extend(publicActions)
            } else {
              throw new Error("No CDP wallet account found")
            }
          } catch (cdpError) {
            console.error("[thumbnail-maker] Failed to setup CDP wallet:", cdpError)
            throw new Error("Failed to setup embedded wallet for payment")
          }
        } else if (walletClient) {
          // Using external wallet (MetaMask, Coinbase Wallet, etc.)
          console.log("[thumbnail-maker] Using external wallet for x402 payment")
          viemClient = walletClient.extend(publicActions)
        } else {
          throw new Error("No wallet client available")
        }

        // Create wrapped fetch with payment handling
        // @ts-ignore - viem client types are compatible but TypeScript has issues with complex generics
        const fetchWithPayment = wrapFetchWithPayment(
          fetch,
          viemClient,
          BigInt(0.1 * 10 ** 6) // Max payment: $0.10 USDC
        ) as typeof fetch

        // Make request with x402 payment handling
        // Send both customPrompt and filter (filter may be "none")
        const requestInit: RequestInit = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl: imageDataUrl,
            customPrompt: customPrompt,
            filter: selectedFilter.id,
          }),
        }

        const response = await fetchWithPayment("/api/process-image", requestInit)

        console.log("[thumbnail-maker] API response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.log("[thumbnail-maker] API error response:", errorText)
          throw new Error(`Error processing image: ${response.status} ${errorText}`)
        }

        const data = await response.json()
        console.log("[thumbnail-maker] API response data:", data)

        if (data.processedImageUrl) {
          console.log("[thumbnail-maker] Setting processed image URL:", data.processedImageUrl)

          try {
            console.log("[thumbnail-maker] Adding watermark to processed image")
            const watermarkedImage = await addWatermark(data.processedImageUrl, facingMode === "user")
            console.log("[thumbnail-maker] Watermark applied successfully")
            setProcessedImage(watermarkedImage)
            setIsProcessing(false)
          } catch (watermarkError) {
            console.error("[thumbnail-maker] Error adding watermark:", watermarkError)
            setProcessedImage(data.processedImageUrl)
            setIsProcessing(false)
          }

          const img = new Image()
          img.crossOrigin = "anonymous"
          img.onload = () => {
          console.log("[thumbnail-maker] Processed image loaded successfully")
          }
          img.onerror = (error) => {
            console.log("[thumbnail-maker] Error loading processed image:", error)
            console.log("[thumbnail-maker] Falling back to original image")
            addWatermark(imageDataUrl, facingMode === "user")
              .then((watermarkedFallback) => {
                setProcessedImage(watermarkedFallback)
                setIsProcessing(false)
              })
              .catch(() => {
                setProcessedImage(imageDataUrl)
                setIsProcessing(false)
              })
          }
          img.src = data.processedImageUrl
        } else {
          console.log("[thumbnail-maker] No processed image URL in response, using original with watermark")
          try {
            const watermarkedImage = await addWatermark(imageDataUrl, facingMode === "user")
            setProcessedImage(watermarkedImage)
          } catch (error) {
            console.error("[thumbnail-maker] Error adding watermark to fallback:", error)
            setProcessedImage(imageDataUrl)
          }
          setIsProcessing(false)
        }
      } catch (error) {
        console.error("[thumbnail-maker] Error processing image:", error)
        try {
          const watermarkedImage = await addWatermark(imageDataUrl, facingMode === "user")
          setProcessedImage(watermarkedImage)
        } catch (watermarkError) {
          console.error("[thumbnail-maker] Error adding watermark to error fallback:", watermarkError)
          setProcessedImage(imageDataUrl)
        }
        setIsProcessing(false)
      }
    },
    [selectedFilter, isConnected, isCDPWallet, walletClient, customPrompt],
  )

  const handleReset = () => {
    setCapturedImage(null)
    setProcessedImage(null)
    setIsProcessing(false)
    setCapturedWithFrontCamera(false)
  }

  const handleDownload = () => {
    if (!processedImage) return

    try {
      if (processedImage.startsWith("data:")) {
        const byteCharacters = atob(processedImage.split(",")[1])
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: "image/jpeg" })

        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `filtered-photo-${selectedFilter.id}-${Date.now()}.jpg`
        link.style.display = "none"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        setTimeout(() => URL.revokeObjectURL(url), 100)
      } else {
        const link = document.createElement("a")
        link.href = processedImage
        link.download = `filtered-photo-${selectedFilter.id}-${Date.now()}.jpg`
        link.style.display = "none"
        link.setAttribute("target", "_self")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (error) {
      console.error("Download failed:", error)
      window.location.href = processedImage
    }
  }

  const handleFilterSelect = (index: number) => {
    setSelectedFilterIndex(index)
  }

  return (
    <div
      className="h-dvh w-screen bg-[#0A0A0A] overflow-hidden fixed inset-0 touch-none select-none"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <div className="absolute inset-0 z-0">
        <HalloweenEffects />
      </div>
      {!capturedImage ? (
        <CameraCapture
          onCapture={handleCapture}
          selectedFilter={selectedFilter}
          onFilterSelect={handleFilterSelect}
          filterIndex={selectedFilterIndex}
          filters={filters}
          isWalletConnected={isConnected}
          walletAddress={address || undefined}
          isCDPWallet={isCDPWallet}
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
        />
      ) : (
        <ProcessedImage
          originalImage={capturedImage}
          processedImage={processedImage}
          isProcessing={isProcessing}
          filterName={selectedFilter.name}
          onReset={handleReset}
          onDownload={handleDownload}
          isFrontCamera={capturedWithFrontCamera}
        />
      )}
    </div>
  )
}
