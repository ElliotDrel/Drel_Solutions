import { z } from 'zod'
import { BlogPostSchema } from '../../types/blog'

export function validateFrontmatter(data: unknown): z.infer<typeof BlogPostSchema> {
  try {
    return BlogPostSchema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ')
      throw new Error(`Frontmatter validation failed: ${formattedErrors}`)
    }
    throw error
  }
}

export function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug)
}

export function validateImagePath(path: string): boolean {
  return /^\/blog\/images\//.test(path) && 
         /\.(jpg|jpeg|png|webp|svg)$/i.test(path)
}

export function validateAuthorSlug(authorSlug: string): boolean {
  return /^[a-z0-9-]+$/.test(authorSlug)
}

export function validateTags(tags: string[]): boolean {
  return tags.length <= 5 && 
         tags.every(tag => tag.length > 0 && tag.length <= 30)
}

export function validateContentStructure(content: string): { 
  isValid: boolean; 
  errors: string[] 
} {
  const errors: string[] = []
  
  // Check for minimum content length
  if (content.trim().length < 100) {
    errors.push('Content must be at least 100 characters long')
  }
  
  // Check for proper markdown structure
  if (!content.includes('#') && !content.includes('##')) {
    errors.push('Content should include at least one heading')
  }
  
  // Check for dangerous content
  if (content.includes('<script') || content.includes('javascript:')) {
    errors.push('Content contains potentially dangerous scripts')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}