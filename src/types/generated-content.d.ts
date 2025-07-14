// Type declarations for build-time generated content files

declare module '@/content/generated/blog-index.json' {
  import type { BlogIndex } from './blog'
  const content: BlogIndex
  export default content
}

declare module '@/content/generated/posts/*.json' {
  import type { BlogContent } from './blog'
  const content: BlogContent
  export default content
}

// Support for dynamic imports of post content
declare module '@/content/generated/posts/*' {
  import type { BlogContent } from './blog'
  const content: BlogContent
  export default content
}