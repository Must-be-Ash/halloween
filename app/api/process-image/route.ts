import { type NextRequest, NextResponse } from "next/server"
import { fal } from "@fal-ai/client"
import { rateLimiter, getClientIP } from "@/lib/rate-limiter"
import { facilitator } from "@coinbase/x402"
import { useFacilitator } from "x402/verify"
import { createThumbnailPrompt, createCombinedPrompt } from "@/lib/thumbnail-prompt"

// Configure fal client
fal.config({
  credentials: process.env.FAL_KEY,
})

// Initialize CDP facilitator (works in Node.js runtime)
const { verify: verifyPayment, settle: settlePayment } = useFacilitator(facilitator)

const RECIPIENT_ADDRESS = process.env.RECIPIENT_WALLET_ADDRESS! as `0x${string}`
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
const PAYMENT_AMOUNT = 0.01

const filterConfigs = {
  acid: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation with psychedelic acid trip aesthetics. ULTRA-REALISTIC DETAILS: For PEOPLE: Apply flowing tie-dye patterns to clothing with photorealistic fabric textures, rainbow color shifts in hair maintaining natural hair physics, kaleidoscope reflections in eyes with anatomically correct eye structure, preserve exact facial features and natural skin textures while adding subtle color morphing effects that look like real light refraction. For LANDSCAPES: Transform sky into swirling rainbow patterns with realistic cloud formations, add flowing color waves across terrain maintaining geological accuracy, create fractal patterns in trees/mountains with photorealistic bark and rock textures, preserve natural lighting physics and atmospheric perspective. For OBJECTS: Add rainbow color shifts with realistic material properties, create kaleidoscope reflections following real optical laws, maintain exact object proportions and surface textures. For FOOD: Add colorful swirling patterns while preserving realistic food textures, moisture, and natural food physics. For ANIMALS: Add colorful fur/feather patterns with anatomically correct animal features, realistic fur/feather physics. CRITICAL: Maintain photorealistic lighting, shadows, reflections, and material properties. Result must look like a real photograph taken with professional camera equipment, not digital art or illustration.",
  },
  vintage: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC werewolf costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in werewolf costume makeup, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add subtle werewolf ear headband accessory on top of head with realistic fur texture, light facial hair makeup around jawline and sideburns keeping face fully visible, small prosthetic fangs that don't obscure mouth or smile, yellow contact lenses enhancing but not hiding natural eyes, furry claw gloves on hands only, wild styled natural hair with slight teasing, torn flannel or rugged clothing with realistic wear, KEEP entire face structure, bone structure, and facial features clearly recognizable as the original person. For LANDSCAPES: Add photorealistic dark forest background with twisted trees, full moon lighting with proper lunar physics, light atmospheric fog, natural forest floor with leaves and dirt. For OBJECTS: Include forest context with weathered wood, natural forest elements. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing werewolf costume makeup for Halloween, with their face and identity FULLY PRESERVED and recognizable, authentic practical costume effects, realistic lighting, and perfect costume photography quality. The person should be immediately recognizable as themselves.",
  },
  cyberpunk: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC witch costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in witch costume, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add traditional pointed black witch hat accessory worn on head, flowing black dress or robe costume with realistic fabric, light green face paint accents on cheeks or nose keeping face recognizable, small drawn-on wart using makeup, purple or black lipstick, dark eye makeup, wild styled natural hair, occult jewelry accessories like pentagram necklace, KEEP entire face structure, expressions, and facial features clearly recognizable as the original person. For LANDSCAPES: Add photorealistic haunted forest background with twisted trees, decorative cauldron prop with dry ice smoke effect, spell book and potion bottle props, full moon lighting, atmospheric fog. For OBJECTS: Include witch accessories like broomstick prop, crystal ball, candles. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing witch costume for Halloween, with their face and identity FULLY PRESERVED and recognizable, authentic costume and makeup, realistic lighting, and perfect Halloween costume photography quality. The person should be immediately recognizable as themselves in a witch outfit.",
  },
  underwater: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC zombie costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in zombie makeup, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add light pale gray-green face paint foundation keeping facial features visible, dark circle makeup under eyes, smudged dirt and blood makeup effects on face and arms, torn and aged clothing costume with realistic weathering, messy styled hair, small drawn-on wound effects using theatrical makeup, keep natural facial expressions and features clear, KEEP entire face structure, bone structure, and facial features clearly recognizable as the original person. For LANDSCAPES: Add photorealistic graveyard background with old tombstones, atmospheric fog, dead trees, cemetery setting. For OBJECTS: Include graveyard props like weathered tombstones, iron gates, scattered leaves. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing zombie costume makeup for Halloween, with their face and identity FULLY PRESERVED and recognizable, authentic costume makeup effects, realistic lighting, and perfect Halloween costume photography quality. The person should be immediately recognizable as themselves in zombie makeup.",
  },
  medieval: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC ghost costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in ghost costume, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add pale white face paint or powder keeping all facial features clearly visible, dark eye shadow makeup creating hollow eye effect while maintaining recognizable eyes, white or vintage Victorian-style flowing dress or sheet draped as costume, wispy styled hair, ethereal soft-focus glow effect from lighting only, KEEP entire face structure, expressions, and all facial features clearly recognizable as the original person. Person's face should be fully visible through any sheer white fabric. For LANDSCAPES: Add photorealistic Victorian mansion or abandoned house background, dusty furniture with white sheets, candlelight, atmospheric setting. For OBJECTS: Include Victorian-era props, candles, vintage mirrors, dusty books. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing ghost costume for Halloween, with their face and identity FULLY PRESERVED and recognizable, authentic costume and lighting effects, realistic photography, and perfect Halloween costume quality. The person should be immediately recognizable as themselves in a ghost costume.",
  },
  apocalypse: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation with post-apocalyptic survival aesthetics. ULTRA-REALISTIC DETAILS: For PEOPLE: Add realistically weathered clothing with authentic wear patterns, genuine survival gear with realistic usage marks, maintain exact facial features with authentic environmental weathering effects on skin. For LANDSCAPES: Transform into photorealistic wasteland scenes with accurate decay physics, realistic structural damage, authentic atmospheric conditions with proper dust and debris physics. For OBJECTS: Add realistic rust and corrosion following actual oxidation processes, authentic makeshift repairs using real materials, maintain exact proportions with believable weathering. For FOOD: Present as realistic survival rations with authentic packaging wear, accurate preservation methods, maintain natural food textures under harsh conditions. For ANIMALS: Add realistic survival adaptations following evolutionary biology, authentic environmental weathering on fur/skin, maintain anatomically correct features. CRITICAL: Must look like an actual documentary photograph of real post-disaster conditions, with authentic weathering, realistic decay processes, and believable survival scenarios. Perfect disaster photography realism.",
  },
  steampunk: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC skeleton costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in skeleton costume makeup, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add white bone face paint design on face following skull structure but keeping facial features visible, black eye makeup around eyes, black nose tip makeup, white skeletal teeth painted on lips with mouth still recognizable, black bodysuit or clothing with white bone paint design on arms and torso showing rib cage and arm bones, KEEP entire face structure, expressions, and facial features clearly recognizable as the original person underneath the makeup design. For LANDSCAPES: Add photorealistic catacombs or crypt background with stone walls, candles, atmospheric setting. For OBJECTS: Include crypt props like stone archways, candlelit alcoves, gothic decor. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing skeleton face paint costume for Halloween, with their face and identity FULLY PRESERVED and recognizable through the makeup design, authentic costume makeup, realistic photography, and perfect Halloween costume quality. The person should be immediately recognizable as themselves in skeleton makeup.",
  },
  tropical: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation with vibrant tropical paradise aesthetics. ULTRA-REALISTIC DETAILS: For PEOPLE: Add authentic tropical clothing with realistic fabric textures, genuine flower leis with natural plant details, maintain exact facial features with realistic tropical lighting and natural skin tones. For LANDSCAPES: Transform into photorealistic tropical scenes with botanically accurate palm trees, authentic beach geology, crystal-clear water with realistic refraction and reflection physics. For OBJECTS: Add authentic tropical materials with realistic bamboo grain, natural island craftsmanship details, maintain exact proportions with believable tropical weathering. For FOOD: Present authentic tropical cuisine with realistic exotic fruit textures, natural coconut materials, maintain accurate food physics and moisture. For ANIMALS: Add tropical species with anatomically correct features, realistic plumage and fur textures, authentic tropical environment interactions. CRITICAL: Must look like an actual tropical vacation photograph taken with professional equipment, with authentic natural lighting, realistic tropical conditions, and perfect beach photography quality. No artificial or enhanced effects.",
  },
  winter: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation with serene winter wonderland aesthetics. ULTRA-REALISTIC DETAILS: For PEOPLE: Add authentic winter clothing with realistic fabric textures and insulation details, natural cold-weather effects on skin like rosy cheeks, maintain exact facial features with realistic winter lighting conditions. For LANDSCAPES: Transform into photorealistic snowy scenes with accurate snow physics, realistic ice formation, authentic frost patterns following natural crystallization, maintain proper winter atmospheric conditions. For OBJECTS: Add realistic snow accumulation following natural physics, authentic frost effects with accurate ice crystal formation, maintain exact proportions with believable winter weathering. For FOOD: Present authentic winter comfort food with realistic steam effects, natural hot food physics, maintain accurate food textures in cold conditions. For ANIMALS: Add realistic winter fur thickness following natural adaptation, authentic snow interaction, maintain anatomically correct features with believable cold-weather behavior. CRITICAL: Must look like an actual winter landscape photograph taken in real snow conditions, with authentic winter lighting, realistic snow physics, and perfect cold-weather photography quality.",
  },
  neon_tokyo: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC mummy costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in mummy costume, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add loose beige bandage wrapping accessories on arms, legs, and partially around torso leaving face fully visible and clear, light tan or beige face paint with facial features completely recognizable, Egyptian-style gold collar necklace and bracelet accessories, a few decorative bandage strips in hair, KEEP entire face uncovered and all facial features clearly recognizable as the original person. Face should NOT be wrapped in bandages. For LANDSCAPES: Add photorealistic Egyptian pyramid interior background, stone walls with hieroglyphics, sarcophagus prop, torch lighting, sandy atmosphere. For OBJECTS: Include Egyptian props like canopic jars, scrolls, treasure. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing mummy costume for Halloween, with their face and identity FULLY PRESERVED and completely visible with NO bandages covering face, authentic costume accessories, realistic photography, and perfect Halloween costume quality. The person should be immediately recognizable as themselves in mummy costume.",
  },
  wild_west: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC Dracula vampire costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in vampire costume, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add pale foundation makeup keeping all facial features visible, small vampire fang accessories that don't hide smile, slicked-back styled hair using gel, dramatic black cape with high collar and red lining worn as costume, Victorian-style formal black suit or dress costume, dark eye makeup, red lip color, elegant accessories like rings or medallion, KEEP entire face structure, expressions, and facial features clearly recognizable as the original person. For LANDSCAPES: Add photorealistic gothic castle interior background, stone walls, candelabras, red velvet curtains, moonlight through windows. For OBJECTS: Include gothic props like ornate coffin, candles, medieval decor. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing Dracula vampire costume for Halloween, with their face and identity FULLY PRESERVED and recognizable, authentic costume and makeup, realistic candlelight photography, and perfect Halloween costume quality. The person should be immediately recognizable as themselves in vampire attire.",
  },
  art_deco: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC Frankenstein monster costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in Frankenstein costume, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add light greenish-gray face paint or foundation keeping all facial features visible, small neck bolt accessories attached to sides of neck, drawn-on stitched scar lines using makeup keeping face recognizable, slightly flattened or gelled hairstyle, tattered dark jacket or coat costume with straps, dark clothing, KEEP entire face structure, expressions, and facial features clearly recognizable as the original person. For LANDSCAPES: Add photorealistic laboratory background with electrical equipment props, vintage scientific instruments, stone walls, atmospheric lighting. For OBJECTS: Include lab props like beakers, Tesla coil decoration, vintage equipment. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing Frankenstein monster costume for Halloween, with their face and identity FULLY PRESERVED and recognizable, authentic costume and makeup, realistic photography, and perfect Halloween costume quality. The person should be immediately recognizable as themselves in Frankenstein costume.",
  },
  fairy_tale: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation with enchanting fairy tale magic aesthetics. ULTRA-REALISTIC DETAILS: For PEOPLE: Add realistic magical clothing elements with authentic fabric textures and believable fantasy construction, maintain exact facial features with realistic magical lighting effects that follow optical physics. For LANDSCAPES: Transform into photorealistic enchanted forests with botanically accurate magical plants, realistic fairy lights using authentic light sources, maintain natural forest physics with believable magical enhancements. For OBJECTS: Add realistic magical enhancements with believable sparkle effects using real light physics, maintain exact object proportions with authentic magical craftsmanship. For FOOD: Present magical feast items with realistic food textures enhanced by believable magical presentation, maintain natural food physics with enchanted styling. For ANIMALS: Add realistic fairy tale creature elements following natural biology, maintain anatomically correct features with believable magical adaptations. CRITICAL: Must look like an actual photograph of a real fairy tale movie set or fantasy theme park, with authentic magical effects created through practical means, realistic lighting, and perfect fantasy photography quality. No obvious digital effects.",
  },
  horror: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation with atmospheric gothic horror aesthetics. ULTRA-REALISTIC DETAILS: For PEOPLE: Add authentic gothic styling with realistic fabric textures and period-accurate construction, maintain exact facial features with realistic dramatic lighting that creates natural shadows and atmospheric effects. For LANDSCAPES: Transform into photorealistic gothic scenes with architecturally accurate old buildings, authentic atmospheric fog using real weather conditions, maintain natural lighting physics with dramatic enhancement. For OBJECTS: Add realistic aged textures following natural weathering processes, authentic antique patina with believable aging, maintain exact proportions with genuine historical wear. For FOOD: Present with authentic gothic presentation using period-accurate serving methods, realistic candlelit ambiance with natural flame lighting. For ANIMALS: Add realistic atmospheric enhancement with natural dramatic lighting, maintain anatomically correct animal features with believable gothic environment adaptation. CRITICAL: Must look like an actual photograph of a real gothic location or horror movie set, with authentic atmospheric conditions, realistic lighting, and perfect dramatic photography quality. Atmospheric but not frightening.",
  },
  desert_mirage: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation with mystical Arabian desert aesthetics. ULTRA-REALISTIC DETAILS: For PEOPLE: Add authentic flowing desert robes with realistic fabric physics and wind effects, genuine ornate jewelry with realistic metalwork and gem properties, maintain exact facial features with authentic desert lighting conditions. For LANDSCAPES: Transform into photorealistic vast desert scenes with geologically accurate sand dunes, realistic oasis vegetation, authentic mirage effects following optical physics. For OBJECTS: Add genuine Arabian craftsmanship with realistic metalwork and authentic patina, maintain exact proportions with believable desert weathering and sand effects. For FOOD: Present authentic Arabian cuisine with realistic spice textures, period-accurate serving methods, maintain natural food physics in desert conditions. For ANIMALS: Add realistic desert adaptations following evolutionary biology, maintain anatomically correct features with authentic Middle Eastern environment context. CRITICAL: Must look like an actual desert photograph taken in the Arabian Peninsula, with authentic desert lighting, realistic sand physics, and perfect desert photography quality.",
  },
  crystal_cave: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation with magical crystal cave aesthetics. ULTRA-REALISTIC DETAILS: For PEOPLE: Add realistic crystalline accessories with authentic mineral properties, genuine gem-like reflections following optical physics, maintain exact facial features with realistic prismatic lighting effects created by real crystal refraction. For LANDSCAPES: Transform into photorealistic crystal caverns with geologically accurate gem formations, authentic prismatic light effects using real crystal optics, maintain natural cave physics with believable crystal growth. For OBJECTS: Add realistic crystal growth following natural mineralogy, authentic gem-like surfaces with proper refractive properties, maintain exact proportions with believable crystalline integration. For FOOD: Present with genuine crystal serving ware, realistic prismatic effects on food surfaces, maintain natural food textures with crystalline enhancement. For ANIMALS: Add realistic crystalline effects on fur/scales following natural physics, maintain anatomically correct features with believable crystal cave adaptations. CRITICAL: Must look like an actual photograph taken inside a real crystal cave or geode, with authentic mineral formations, realistic light refraction, and perfect geological photography quality.",
  },
  floating_islands: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation with ethereal floating islands aesthetics. ULTRA-REALISTIC DETAILS: For PEOPLE: Add realistic flowing clothing with authentic fabric physics in low gravity, maintain exact facial features with believable aerial lighting conditions and natural wind effects. For LANDSCAPES: Transform into photorealistic floating island scenes with geologically accurate suspended terrain, realistic cloud formations with authentic atmospheric physics, maintain natural lighting with believable aerial perspective. For OBJECTS: Add realistic levitation effects following believable physics, authentic cloud integration with natural vapor properties, maintain exact proportions with credible aerial suspension. For FOOD: Present with realistic weightless presentation following actual zero-gravity physics, maintain natural food textures in aerial conditions. For ANIMALS: Add believable wing adaptations following aerodynamic principles, maintain anatomically correct features with realistic flight physics and aerial behavior. CRITICAL: Must look like an actual photograph of a real floating landscape or aerial photography with practical effects, with authentic atmospheric conditions, realistic physics, and perfect aerial photography quality.",
  },
  time_machine: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation with temporal fusion aesthetics blending multiple eras. ULTRA-REALISTIC DETAILS: For PEOPLE: Add realistic mixed-era clothing with authentic fabric textures from different time periods, maintain exact facial features with believable temporal lighting effects that blend different era photography styles. For LANDSCAPES: Transform into photorealistic scenes blending different historical periods with architecturally accurate buildings from various eras, maintain natural lighting physics with believable temporal overlay. For OBJECTS: Add authentic era-blending design with realistic materials from different time periods, maintain exact proportions with believable temporal wear patterns showing multiple historical influences. For FOOD: Present with realistic mixed-era presentation combining authentic historical serving methods, maintain natural food textures with believable temporal fusion styling. For ANIMALS: Add realistic temporal adaptations showing believable evolutionary variations, maintain anatomically correct features with authentic multi-era environmental context. CRITICAL: Must look like an actual photograph where different time periods have been seamlessly blended using practical effects, with authentic historical materials, realistic temporal physics, and perfect multi-era photography quality.",
  },
  spy: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC black cat costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in cat costume, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add cat ear headband accessory on top of head with black fur, small black nose tip makeup, whiskers drawn on cheeks using eyeliner, cat eye makeup with winged eyeliner, all-black outfit or bodysuit costume, black tail accessory attached to costume, optional yellow or green contact lenses enhancing natural eyes, cat collar accessory, KEEP entire face structure, expressions, and facial features clearly recognizable as the original person. For LANDSCAPES: Add photorealistic moonlit night background, brick walls, mysterious fog, full moon, atmospheric urban or alley setting. For OBJECTS: Include night scene props like lamp posts, iron fence, autumn leaves. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing black cat costume for Halloween, with their face and identity FULLY PRESERVED and recognizable, authentic costume and accessories, realistic moonlight photography, and perfect Halloween costume quality. The person should be immediately recognizable as themselves in cat costume.",
  },
  gothic: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC creepy doll costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in doll costume makeup, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add pale white foundation makeup keeping all facial features visible, round pink blush circles on cheeks, doll-like eye makeup with long false lashes, small red lip makeup, light crack lines drawn on face with makeup keeping features clear, Victorian-style dress costume with lace and ribbons, hair styled in ringlets or pigtails with bows, mary jane shoes with socks, KEEP entire face structure, expressions, and facial features clearly recognizable as the original person. For LANDSCAPES: Add photorealistic vintage dollhouse or Victorian playroom background, antique toys, rocking horse, floral wallpaper, nostalgic setting. For OBJECTS: Include doll and toy props, music box, vintage furniture. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing creepy doll costume makeup for Halloween, with their face and identity FULLY PRESERVED and recognizable, authentic costume and makeup, realistic photography, and perfect Halloween costume quality. The person should be immediately recognizable as themselves in doll makeup.",
  },
  "90s": {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC pumpkin character costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in pumpkin costume, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add orange face paint keeping all facial features visible, black triangle shapes painted around eyes like jack-o'-lantern, black smile line painted on lips with natural mouth recognizable, pumpkin stem hat or headpiece accessory, orange and black striped or solid orange outfit costume, autumn leaf accessories, vine decorations as props, KEEP entire face structure, expressions, and facial features clearly recognizable as the original person. For LANDSCAPES: Add photorealistic Halloween Town or pumpkin patch background, twisted trees, jack-o'-lanterns glowing, autumn leaves, full moon, festive Halloween setting. For OBJECTS: Include Halloween props like pumpkins, scarecrows, autumn decorations. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing pumpkin character costume for Halloween, with their face and identity FULLY PRESERVED and recognizable, authentic costume and makeup, realistic photography, and perfect Halloween costume quality. The person should be immediately recognizable as themselves in pumpkin costume.",
  },
  disco: {
    prompt:
      "Create a HYPER-REALISTIC, PHOTOGRAPHIC creepy clown costume look while PRESERVING the person's exact facial features, identity, and recognizability. CRITICAL IDENTITY PRESERVATION: The person's face, eyes, nose, mouth, and unique facial characteristics MUST remain clearly visible and recognizable throughout. This should look like a person in clown costume makeup, NOT a full transformation. ULTRA-REALISTIC COSTUME DETAILS: For PEOPLE: Add white face paint foundation keeping all facial features visible, exaggerated red smile painted extending slightly beyond natural mouth but keeping lips recognizable, small round red nose accessory or makeup, colorful eye makeup, colorful wig in bright colors, ruffled collar accessory, polka dot or striped costume outfit, KEEP entire face structure, expressions, and facial features clearly recognizable as the original person. For LANDSCAPES: Add photorealistic carnival or circus background, circus tent, carnival rides, festive yet slightly eerie atmosphere. For OBJECTS: Include circus props like balloons, carnival signs, funhouse elements. CRITICAL: Must look like an actual photograph of a REAL PERSON wearing creepy clown costume for Halloween, with their face and identity FULLY PRESERVED and recognizable, authentic costume and makeup, realistic photography, and perfect Halloween costume quality. The person should be immediately recognizable as themselves in clown costume.",
  },
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check for payment header first
    const paymentHeader = request.headers.get("X-PAYMENT")

    if (!paymentHeader) {
      console.log("[x402] No payment header - returning 402")
      // Return 402 with payment requirements
      return NextResponse.json({
        x402Version: 1,
        error: "X-PAYMENT header is required",
        accepts: [{
          scheme: "exact",
          network: "base",
          maxAmountRequired: (PAYMENT_AMOUNT * 10 ** 6).toString(),
          resource: request.url,
          description: "AI image transformation with Nano Banana - $0.05",
          mimeType: "application/json",
          payTo: RECIPIENT_ADDRESS,
          maxTimeoutSeconds: 60,
          asset: USDC_BASE,
          extra: { name: "USD Coin", version: "2" }
        }]
      }, { status: 402 })
    }

    // 2. Decode and verify payment
    console.log("[x402] Decoding payment header...")
    let paymentPayload
    try {
      const decoded = Buffer.from(paymentHeader, "base64").toString("utf-8")
      paymentPayload = JSON.parse(decoded)
      console.log("[x402] Payment payload decoded:", JSON.stringify(paymentPayload, null, 2))
    } catch (error) {
      console.error("[x402] Failed to decode payment:", error)
      return NextResponse.json(
        { error: "Invalid payment header format" },
        { status: 400 }
      )
    }

    const paymentRequirements = {
      scheme: "exact" as const,
      network: "base" as const,
      maxAmountRequired: (PAYMENT_AMOUNT * 10 ** 6).toString(),
      resource: request.url,
      description: "AI image transformation with Nano Banana - $0.05",
      mimeType: "application/json",
      payTo: RECIPIENT_ADDRESS,
      maxTimeoutSeconds: 60,
      asset: USDC_BASE,
      extra: { name: "USD Coin", version: "2" }
    }

    console.log("[x402] Verifying payment with CDP facilitator...")
    console.log("[x402] Payment requirements:", JSON.stringify(paymentRequirements, null, 2))

    try {
      const verifyResult = await verifyPayment(paymentPayload, paymentRequirements)
      console.log("[x402] Verification result:", JSON.stringify(verifyResult, null, 2))

      if (!verifyResult.isValid) {
        console.error("[x402] Payment verification failed:", verifyResult.invalidReason)
        return NextResponse.json(
          { error: "Payment verification failed", reason: verifyResult.invalidReason },
          { status: 402 }
        )
      }

      console.log("[x402] Payment verified successfully for payer:", verifyResult.payer)
    } catch (error) {
      console.error("[x402] Verification error:", error)
      return NextResponse.json(
        { error: "Payment verification failed", details: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      )
    }

    // 3. Settle payment BEFORE processing image (collect money first!)
    console.log("[x402] Settling payment...")
    let settlementResult
    try {
      settlementResult = await settlePayment(paymentPayload, paymentRequirements)
      console.log("[x402] Settlement result:", JSON.stringify(settlementResult, null, 2))

      if (!settlementResult.success) {
        console.error("[x402] ❌ Settlement failed:", settlementResult.errorReason)
        return NextResponse.json(
          { error: "Payment settlement failed", reason: settlementResult.errorReason },
          { status: 402 }
        )
      }

      console.log("[x402] ✅ Payment settled successfully!")
      console.log("[x402] Transaction:", settlementResult.transaction)
      console.log("[x402] Network:", settlementResult.network)
      console.log("[x402] Payer:", settlementResult.payer)
    } catch (error) {
      console.error("[x402] Settlement error:", error)
      return NextResponse.json(
        { error: "Payment settlement failed", details: error instanceof Error ? error.message : String(error) },
        { status: 402 }
      )
    }

    // 4. Continue with rate limiting and image processing
    const clientIP = getClientIP(request)
    const rateLimitResult = await rateLimiter.isAllowed(clientIP)

    if (!rateLimitResult.allowed) {
      const resetTime = new Date(rateLimitResult.resetTime || 0).toISOString()
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetTime,
          remaining: 0,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": resetTime,
            "Retry-After": Math.ceil((rateLimitResult.resetTime! - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    const { imageUrl, filter, customPrompt } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
    }

    // Determine which prompt to use based on combination of inputs
    let finalPrompt: string

    if (customPrompt && filter && filter !== "none") {
      // Both custom prompt AND filter: combine them
      const config = filterConfigs[filter as keyof typeof filterConfigs]
      if (!config) {
        return NextResponse.json({ error: "Invalid filter" }, { status: 400 })
      }
      finalPrompt = createCombinedPrompt(customPrompt, config.prompt)
      console.log("[thumbnail-maker] Processing with combined prompt + filter:", filter)
      console.log("[thumbnail-maker] Custom content:", customPrompt.substring(0, 80) + "...")
    } else if (customPrompt) {
      // Custom prompt only (no filter or filter is "none")
      finalPrompt = createThumbnailPrompt(customPrompt)
      console.log("[thumbnail-maker] Processing with custom prompt only:", customPrompt.substring(0, 100) + "...")
    } else if (filter && filter !== "none") {
      // Filter only (backward compatible - no custom prompt)
      const config = filterConfigs[filter as keyof typeof filterConfigs]
      if (!config) {
        return NextResponse.json({ error: "Invalid filter" }, { status: 400 })
      }
      finalPrompt = config.prompt
      console.log("[thumbnail-maker] Processing with filter only:", filter)
    } else {
      return NextResponse.json({ error: "Either customPrompt or filter is required" }, { status: 400 })
    }

    console.log("[thumbnail-maker] Using transformation prompt")

    const result = await fal.subscribe("fal-ai/nano-banana/edit", {
      input: {
        prompt: finalPrompt,
        image_urls: [imageUrl],
        num_images: 1,
      },
    })

    console.log("[thumbnail-maker] Nano Banana transformation result:", result)

    const processedImageUrl = result.data?.images?.[0]?.url

    if (!processedImageUrl) {
      throw new Error("No processed image returned from Nano Banana")
    }

    console.log("[thumbnail-maker] Returning processed image without watermark")

    // 5. Add payment receipt to response headers (payment already settled before processing)
    const headers: Record<string, string> = {
      "X-RateLimit-Limit": "100",
      "X-RateLimit-Remaining": rateLimitResult.remaining?.toString() || "0",
      "X-RateLimit-Reset": new Date(rateLimitResult.resetTime || 0).toISOString(),
      "X-PAYMENT-RESPONSE": Buffer.from(JSON.stringify({
        success: true,
        transaction: settlementResult.transaction,
        network: settlementResult.network,
        payer: settlementResult.payer
      })).toString("base64")
    }

    return NextResponse.json(
      {
        processedImageUrl: processedImageUrl,
      },
      { headers }
    )
  } catch (error) {
    console.error("[thumbnail-maker] Error with Nano Banana processing:", error)
    return NextResponse.json(
      {
        error: "Failed to process image with Nano Banana",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
