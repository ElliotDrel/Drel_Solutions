import { z } from 'zod'

// Zod schema for frontmatter validation
export const BlogPostSchema = z.object({
  id: z.string(),
  title: z.string().min(1), // No character limit for display title
  subtitle: z.string().min(1), // No character limit for display subtitle
  slug: z.string().regex(/^[a-z0-9-]+$/),
  author: z.object({
    name: z.string(),
    slug: z.string(),
    avatar: z.string().optional()
  }),
  publishedAt: z.string(),
  readingTime: z.number().optional(), // Auto-calculated
  tags: z.array(z.string()).max(5),
  image: z.string().optional(),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
  // SEO fields with character limits (optional for backward compatibility)
  metaTitle: z.string().min(1).max(100).optional(), // SEO title limit
  metaDescription: z.string().min(1).max(200).optional(), // SEO description limit
  canonicalUrl: z.string().url().optional()
})

export type BlogPost = z.infer<typeof BlogPostSchema>

export interface BlogContent {
  frontmatter: BlogPost
  content: string
  excerpt: string // Auto-generated
  readingTime: number // Auto-calculated
  wordCount: number
  lastModified: string
}

export interface BlogIndex {
  posts: BlogPost[]
  authors: Record<string, Author>
  tags: string[]
  totalPosts: number
  lastUpdated: string
}

export interface Author {
  name: string
  slug: string
  avatar?: string
  bio?: string
}

export interface SEOMetadata {
  title: string
  description: string
  openGraph: {
    title: string
    description: string
    image: string
    url: string
  }
  jsonLd: Record<string, unknown>
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}

export interface BlogFilters {
  author?: string;
  tag?: string;
  sortBy: 'date' | 'topic';
}

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  postsPerPage: number;
}