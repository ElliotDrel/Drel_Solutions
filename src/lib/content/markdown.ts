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
  // Comprehensive XSS protection - remove all potentially dangerous content
  return content
    // Script tags (case-insensitive, with attributes and content)
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Event handlers (onclick, onload, onerror, etc.)
    .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\s*on\w+\s*=\s*[^"'\s>]+/gi, '')
    // JavaScript protocols (case-insensitive)
    .replace(/javascript\s*:/gi, '')
    // Data URIs with script content or HTML
    .replace(/data\s*:\s*text\/html[^"'>]*/gi, '')
    .replace(/data\s*:\s*application\/[^"'>]*script[^"'>]*/gi, '')
    // Style tags and CSS expressions (IE-specific)
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/-moz-binding\s*:/gi, '')
    // Iframe, object, embed, and other potentially dangerous tags
    .replace(/<(iframe|object|embed|applet|link)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
    .replace(/<(iframe|object|embed|applet|link|meta|base)\b[^>]*\/?>/gi, '')
    // Form elements that could be problematic
    .replace(/<(form|input|button|textarea|select|option)\b[^>]*>/gi, '')
    .replace(/<\/(form|input|button|textarea|select|option)>/gi, '')
    // SVG with script content
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
    // Comments that might contain malicious content
    .replace(/<!--[\s\S]*?-->/g, '')
    // Generic dangerous attribute patterns
    .replace(/\s*(src|href|action|formaction|background|poster)\s*=\s*["']?\s*javascript:/gi, '')
    .replace(/\s*(src|href|action|formaction|background|poster)\s*=\s*["']?\s*data:/gi, '')
    .replace(/\s*(src|href|action|formaction|background|poster)\s*=\s*["']?\s*vbscript:/gi, '')
}

export function processMarkdownToHtml(content: string): string {
  // For now, return as-is since we'll use a markdown processor later
  // This function will be enhanced with proper markdown-to-HTML conversion
  return sanitizeMarkdown(content)
}