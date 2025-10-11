/**
 * Creates a professional thumbnail prompt that preserves person identity
 * while applying user's custom scene description with COMPLETE CINEMATIC MAKEOVER
 *
 * This enhanced template matches the quality of our best filters by:
 * - Preserving exact facial features and identity (CRITICAL)
 * - Transforming clothing, styling, environment, lighting completely
 * - Adding rich details, textures, materials, atmosphere
 * - Creating a cohesive cinematic world around the user's theme
 * - Photorealistic, professional movie-still quality
 */
export function createThumbnailPrompt(userDescription: string): string {
  return `Create a HYPER-REALISTIC, PHOTOGRAPHIC transformation suitable for a professional video thumbnail with COMPLETE CINEMATIC MAKEOVER.

CRITICAL TRANSFORMATION REQUIREMENTS:

For PEOPLE:
- MAINTAIN exact facial features, facial structure, and face identity (CRITICAL - face must remain clearly recognizable)
- TRANSFORM EVERYTHING ELSE: Apply complete professional styling including:
  * Professional clothing, outfit, and accessories that match the theme/scenario
  * Professional hair styling and grooming appropriate to the theme
  * Makeup and styling for high-quality thumbnail photography
  * Natural skin textures with professional lighting enhancements
  * Appropriate expression and pose that matches the scene energy

For ENVIRONMENT & SCENE:
- Create a COMPLETELY REIMAGINED background environment with:
  * Photorealistic setting with rich environmental details
  * Authentic materials, textures, and atmospheric elements
  * Professional props and scene elements that enhance the narrative
  * Cinematic depth and layering with realistic perspective
  * Rich color palette and atmospheric effects

For LIGHTING & ATMOSPHERE:
- Apply dramatic, high-contrast professional lighting with:
  * Cinematic lighting setup appropriate to the theme
  * Professional color grading and atmospheric mood
  * Realistic shadows, highlights, and light physics
  * Attention-grabbing visual impact suitable for thumbnails

USER'S SPECIFIC REQUIREMENTS:
${userDescription}

EXECUTION INSTRUCTIONS:
- Interpret the user's description as the THEME and CONTENT to include
- Build a complete cinematic world around that theme
- Transform clothing, environment, lighting, and styling to create a cohesive aesthetic
- Add rich details, textures, materials, and atmospheric elements
- Maintain photorealistic quality with professional photography standards
- The final result should look like a professionally produced promotional photograph or movie still

CRITICAL: The person's FACE and FACIAL IDENTITY must remain exactly recognizable. Transform everything else (clothing, hair styling, environment, lighting, props) to create a complete cinematic makeover. No cartoon or digital art effects - only photorealistic transformations.`;
}

/**
 * Combines a filter aesthetic with custom user content
 *
 * This allows users to specify WHAT they want (custom content)
 * while applying HOW it should look (filter aesthetic)
 *
 * @param userDescription - User's custom thumbnail content/theme
 * @param filterPrompt - Optional filter aesthetic to apply
 * @returns Combined prompt that merges both elements
 */
export function createCombinedPrompt(
  userDescription: string,
  filterPrompt?: string
): string {
  if (!filterPrompt || filterPrompt.trim() === "") {
    // No filter selected: use enhanced custom prompt only
    return createThumbnailPrompt(userDescription);
  }

  // Combine filter aesthetic with custom content
  return `${filterPrompt}

ADDITIONAL USER REQUIREMENTS TO SEAMLESSLY INTEGRATE:
${userDescription}

INTEGRATION INSTRUCTIONS:
- Maintain ALL the aesthetic, styling, and environmental transformations described above
- Seamlessly integrate the user's specific content requirements into this established world
- The user's requirements should enhance and complement the theme, not replace it
- Ensure the final result feels cohesive - as if the user's content naturally belongs in this aesthetic universe
- Continue to maintain exact facial features and identity while transforming everything else

CRITICAL: Preserve the person's face and facial identity. Apply the complete cinematic transformation as specified while naturally incorporating the user's custom elements.`;
}
