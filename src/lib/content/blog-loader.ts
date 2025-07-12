import type { BlogContent, BlogIndex, BlogPost } from '../../types/blog'

// Fallback data when build-time generated content is not available
const fallbackBlogData: BlogIndex = {
  posts: [
    {
      id: "1",
      title: "Streamlining Team Workflows with Automation",
      subtitle: "How we reduced manual tasks by 70% using smart process automation",
      slug: "streamlining-team-workflows",
      author: { name: "Sarah Chen", slug: "sarah-chen" },
      publishedAt: "2024-01-15",
      readingTime: 8,
      tags: ["workflow", "automation", "productivity"],
      image: "/blog/images/posts/streamlining-team-workflows/hero.jpg",
      featured: true,
      draft: false
    }
    // Add other posts as needed for fallback
  ],
  authors: {},
  tags: ["workflow", "automation", "productivity"],
  totalPosts: 1,
  lastUpdated: new Date().toISOString()
}

// This will be populated by the build process or use fallback
let blogIndex: BlogIndex = fallbackBlogData

// Try to import the generated blog index
const loadBlogIndex = async () => {
  try {
    // @ts-ignore - This file will be generated at build time
    const indexModule = await import('@/content/generated/blog-index.json')
    blogIndex = indexModule.default
  } catch (error) {
    console.warn('Blog index not found, using fallback data')
    // Keep using fallback data
  }
}

// Initialize the blog index
loadBlogIndex()

export class BlogLoader {
  private static index: BlogIndex = blogIndex!
  private static contentCache = new Map<string, BlogContent>()

  static async getAllPosts(options?: {
    includeContent?: boolean
    filter?: (post: BlogPost) => boolean
    sort?: 'date' | 'title' | 'readingTime'
    limit?: number
  }): Promise<BlogPost[]> {
    let posts = this.index.posts.filter(post => !post.draft)
    
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

  static getPostsByAuthor(authorSlug: string): BlogPost[] {
    return this.index.posts.filter(post => 
      post.author.slug === authorSlug && !post.draft
    )
  }

  static getPostsByTag(tag: string): BlogPost[] {
    return this.index.posts.filter(post => 
      post.tags.includes(tag) && !post.draft
    )
  }

  static getFeaturedPosts(limit = 3): BlogPost[] {
    return this.index.posts
      .filter(post => post.featured && !post.draft)
      .slice(0, limit)
  }

  static getRecommendedPosts(currentSlug: string, limit = 3): BlogPost[] {
    const currentPost = this.index.posts.find(p => p.slug === currentSlug)
    if (!currentPost) return []

    // Simple recommendation: same tags, different post
    return this.index.posts
      .filter(post => 
        post.slug !== currentSlug && 
        !post.draft &&
        post.tags.some(tag => currentPost.tags.includes(tag))
      )
      .slice(0, limit)
  }

  static getAllTags(): string[] {
    return this.index.tags
  }

  static getAllAuthors(): Record<string, any> {
    return this.index.authors
  }

  static getIndex(): BlogIndex {
    return this.index
  }

  // Method to update index (used by build process)
  static updateIndex(newIndex: BlogIndex): void {
    this.index = newIndex
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