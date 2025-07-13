export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function generateExcerpt(content: string, maxLength = 200): string {
  // Remove markdown syntax for clean excerpt
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links, keep text
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .trim()

  if (plainText.length <= maxLength) {
    return plainText
  }

  // Find the last complete word within the limit
  const truncated = plainText.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')
  
  return lastSpaceIndex > 0 
    ? truncated.substring(0, lastSpaceIndex) + '...'
    : truncated + '...'
}

export function sanitizeMarkdown(content: string): string {
  // For static markdown content processed at build time, no sanitization needed
  // Content is controlled and comes from trusted sources
  // A proper markdown processor will handle HTML escaping when added
  return content
}

export function processMarkdownToHtml(content: string): string {
  // For now, return as-is since we'll use a markdown processor later
  // This function will be enhanced with proper markdown-to-HTML conversion
  return sanitizeMarkdown(content)
}