import type { BlogContent, SEOMetadata } from '../../types/blog'

export function generateSEOMeta(post: BlogContent): SEOMetadata {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://drel.solutions'
  const postUrl = `${baseUrl}/blog/${post.frontmatter.slug}`
  
  return {
    title: `${post.frontmatter.title} | Drel Solutions Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.frontmatter.title,
      description: post.excerpt,
      image: post.frontmatter.image 
        ? `${baseUrl}${post.frontmatter.image}`
        : `${baseUrl}/blog/images/og/default.png`,
      url: postUrl
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.frontmatter.title,
      description: post.excerpt,
      author: {
        '@type': 'Person',
        name: post.frontmatter.author.name
      },
      datePublished: post.frontmatter.publishedAt,
      url: postUrl,
      image: post.frontmatter.image 
        ? `${baseUrl}${post.frontmatter.image}`
        : `${baseUrl}/blog/images/og/default.png`,
      publisher: {
        '@type': 'Organization',
        name: 'Drel Solutions',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`
        }
      },
      wordCount: post.wordCount,
      timeRequired: `PT${post.readingTime}M`
    }
  }
}

export function generateBlogListSEO(): SEOMetadata {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://drel.solutions'
  
  return {
    title: 'Blog | Drel Solutions - Process Optimization Insights',
    description: 'Expert insights on workflow optimization, process automation, and business efficiency from the Drel Solutions team.',
    openGraph: {
      title: 'Drel Solutions Blog',
      description: 'Expert insights on workflow optimization and process automation',
      image: `${baseUrl}/blog/images/og/blog-home.png`,
      url: `${baseUrl}/blog`
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Drel Solutions Blog',
      description: 'Expert insights on workflow optimization, process automation, and business efficiency',
      url: `${baseUrl}/blog`,
      publisher: {
        '@type': 'Organization',
        name: 'Drel Solutions',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`
        }
      }
    }
  }
}

export function generateAuthorSEO(authorName: string, authorSlug: string): SEOMetadata {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://drel.solutions'
  
  return {
    title: `Articles by ${authorName} | Drel Solutions Blog`,
    description: `Read articles and insights by ${authorName} on workflow optimization and process automation.`,
    openGraph: {
      title: `Articles by ${authorName}`,
      description: `Articles and insights by ${authorName}`,
      image: `${baseUrl}/blog/images/authors/${authorSlug}.jpg`,
      url: `${baseUrl}/blog?author=${authorSlug}`
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      mainEntity: {
        '@type': 'Person',
        name: authorName,
        image: `${baseUrl}/blog/images/authors/${authorSlug}.jpg`
      }
    }
  }
}

export function generateTagSEO(tag: string): SEOMetadata {
  const baseUrl = import.meta.env.VITE_BASE_URL || 'https://drel.solutions'
  
  return {
    title: `${tag} Articles | Drel Solutions Blog`,
    description: `Browse articles about ${tag} and discover insights on process optimization and automation.`,
    openGraph: {
      title: `${tag} Articles`,
      description: `Articles about ${tag}`,
      image: `${baseUrl}/blog/images/og/tag-${tag.toLowerCase().replace(/\s+/g, '-')}.png`,
      url: `${baseUrl}/blog?tag=${encodeURIComponent(tag)}`
    },
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${tag} Articles`,
      description: `Collection of articles about ${tag}`,
      url: `${baseUrl}/blog?tag=${encodeURIComponent(tag)}`
    }
  }
}