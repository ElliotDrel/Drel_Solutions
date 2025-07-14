import type { BlogContent, BlogIndex, BlogPost } from '../../types/blog'

// Import the generated blog index directly
import blogIndex from '@/content/generated/blog-index.json'

// Fallback data when build-time generated content is not available
const fallbackBlogData: BlogIndex = {
  posts: [],
  authors: {},
  tags: [],
  totalPosts: 0,
  lastUpdated: new Date().toISOString()
}

export class BlogLoader {
  private static _index: BlogIndex | null = null
  private static _loading: Promise<BlogIndex> | null = null
  private static contentCache = new Map<string, BlogContent>()

  private static async ensureIndex(): Promise<BlogIndex> {
    // If already loaded, return immediately
    if (this._index) {
      return this._index
    }
    
    // If currently loading, wait for that operation
    if (this._loading) {
      return this._loading
    }
    
    // Start loading
    this._loading = this.loadIndex()
    this._index = await this._loading
    this._loading = null
    
    return this._index
  }

  private static async loadIndex(): Promise<BlogIndex> {
    try {
      // Use the statically imported blog index for better performance
      return blogIndex as BlogIndex
    } catch (error) {
      console.warn('Blog index not found, using fallback data')
      return fallbackBlogData
    }
  }

  static async getAllPosts(options?: {
    includeContent?: boolean
    filter?: (post: BlogPost) => boolean
    sort?: 'date' | 'title' | 'readingTime'
    limit?: number
  }): Promise<BlogPost[]> {
    const index = await this.ensureIndex()
    let posts = index.posts.filter(post => !post.draft)
    
    if (options?.filter) {
      posts = posts.filter(options.filter)
    }
    
    // Pre-sorted at build time, but allow runtime sorting
    if (options?.sort) {
      posts = this.sortPosts(posts, options.sort)
    }
    
    return options?.limit ? posts.slice(0, options.limit) : posts
  }

  static async getPostBySlug(slug: string): Promise<BlogContent | null> {
    // Check cache first
    if (this.contentCache.has(slug)) {
      return this.contentCache.get(slug)!
    }

    try {
      // Dynamic import of pre-compiled content
      const contentModule = await import(`@/content/generated/posts/${slug}.json`)
      const content = contentModule.default as BlogContent
      
      this.contentCache.set(slug, content)
      return content
    } catch (error) {
      console.error(`Failed to load post: ${slug}`, error)
      return null
    }
  }

  static async getPostsByAuthor(authorSlug: string): Promise<BlogPost[]> {
    const index = await this.ensureIndex()
    return index.posts.filter(post => 
      post.author.slug === authorSlug && !post.draft
    )
  }

  static async getPostsByTag(tag: string): Promise<BlogPost[]> {
    const index = await this.ensureIndex()
    return index.posts.filter(post => 
      post.tags.includes(tag) && !post.draft
    )
  }

  static async getFeaturedPosts(limit = 3): Promise<BlogPost[]> {
    const index = await this.ensureIndex()
    return index.posts
      .filter(post => post.featured && !post.draft)
      .slice(0, limit)
  }

  static async getRecommendedPosts(currentSlug: string, limit = 3): Promise<BlogPost[]> {
    const index = await this.ensureIndex()
    const currentPost = index.posts.find(p => p.slug === currentSlug)
    if (!currentPost) return []

    // Simple recommendation: same tags, different post
    return index.posts
      .filter(post => 
        post.slug !== currentSlug && 
        !post.draft &&
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
      .slice(0, limit)
  }

  static async getAllTags(): Promise<string[]> {
    const index = await this.ensureIndex()
    return index.tags
  }

  static async getAllAuthors(): Promise<Record<string, unknown>> {
    const index = await this.ensureIndex()
    return index.authors
  }

  static async getIndex(): Promise<BlogIndex> {
    return await this.ensureIndex()
  }

  // Method to update index (used by build process)
  static updateIndex(newIndex: BlogIndex): void {
    this._index = newIndex
    this._loading = null // Clear loading state
    this.contentCache.clear() // Clear cache when index updates
  }

  private static sortPosts(posts: BlogPost[], sortBy: string): BlogPost[] {
    return [...posts].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        case 'title':
          return a.title.localeCompare(b.title)
        case 'readingTime':
          return (a.readingTime || 0) - (b.readingTime || 0)
        default:
          return 0
      }
    })
  }
}