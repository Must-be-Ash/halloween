/**
 * Creates a professional thumbnail prompt that preserves person identity
 * while applying user's custom scene description
 *
 * This template is based on our proven filter patterns that ensure:
 * - Exact facial features are preserved
 * - Natural skin textures maintained
 * - Only clothing/environment changes
 * - Photorealistic, professional quality
 */
export function createThumbnailPrompt(userDescription: string): string {
  return `Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation suitable for a professional video thumbnail.

ULTRA-REALISTIC DETAILS: For PEOPLE: maintain exact facial features with natural skin textures and authentic body proportions, style with appropriate clothing and expression that matches the scene. ${userDescription}

Apply dramatic, high-contrast lighting with professional thumbnail atmosphere that catches viewer attention.

CRITICAL: Must look like an actual professional photograph taken for a YouTube thumbnail, with authentic materials, realistic lighting, and perfect photography quality. The person's face and identity must remain clearly recognizable. No cartoon or digital art effects.`;
}
