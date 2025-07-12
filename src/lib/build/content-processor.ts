import type { Plugin } from 'vite'
import { readFile, writeFile, mkdir, readdir } from 'fs/promises'
import { join, extname } from 'path'
import { BlogPostSchema } from '../../types/blog'
import { calculateReadingTime, generateExcerpt } from '../content/markdown'
import { validateFrontmatter, validateContentStructure } from '../content/validation'

// Simple frontmatter parser (replacing gray-matter for now)
function parseFrontmatter(content: string): { data: any; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content }
  }
  
  const [, frontmatterStr, bodyContent] = match
  const data: any = {}
  
  // Simple YAML-like parsing
  const lines = frontmatterStr.split('\n')
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()
      
      // Remove quotes
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1)
      }
      
      // Handle arrays (basic)
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''))
      }
      
      // Handle booleans
      if (value === 'true') value = true
      if (value === 'false') value = false
      
      // Handle numbers
      if (/^\d+$/.test(value)) value = parseInt(value)
      
      // Handle nested objects (basic author handling)
      if (key === 'author' && typeof value === 'string') {
        // For now, just store as string, will be parsed later
        data[key] = { name: value, slug: value.toLowerCase().replace(/\s+/g, '-') }
      } else {
        data[key] = value
      }
    }
  }
  
  return { data, content: bodyContent }
}

export function contentProcessor(): Plugin {
  return {
    name: 'content-processor',
    buildStart: async () => {
      try {
        console.log('🔄 Processing blog content...')
        
        // Ensure generated directories exist
        await mkdir('src/content/generated/posts', { recursive: true })
        
        // For now, create a basic blog index to prevent import errors
        const basicIndex = {
          posts: [],
          authors: {},
          tags: [],
          totalPosts: 0,
          lastUpdated: new Date().toISOString()
        }
        
        await writeFile(
          'src/content/generated/blog-index.json',
          JSON.stringify(basicIndex, null, 2)
        )
        
        console.log('✅ Basic blog index created')
        
        // Check if posts directory exists
        try {
          const postFiles = await readdir('src/content/blog/posts')
          const markdownFiles = postFiles.filter(file => extname(file) === '.md')
          
          if (markdownFiles.length > 0) {
            const posts = []
            
            for (const file of markdownFiles) {
              try {
                const filePath = join('src/content/blog/posts', file)
                const raw = await readFile(filePath, 'utf-8')
                const { data, content } = parseFrontmatter(raw)
                
                // Validate frontmatter
                const frontmatter = validateFrontmatter(data)
                
                // Validate content
                const contentValidation = validateContentStructure(content)
                if (!contentValidation.isValid) {
                  console.warn(`Content validation issues in ${file}:`, contentValidation.errors)
                }
                
                // Generate computed fields
                const readingTime = calculateReadingTime(content)
                const excerpt = generateExcerpt(content)
                const wordCount = content.split(/\s+/).length
                
                const processedPost = {
                  frontmatter: { ...frontmatter, readingTime },
                  content,
                  excerpt,
                  readingTime,
                  wordCount,
                  lastModified: new Date().toISOString()
                }
                
                posts.push(processedPost.frontmatter)
                
                // Write individual post content
                await writeFile(
                  `src/content/generated/posts/${frontmatter.slug}.json`,
                  JSON.stringify(processedPost, null, 2)
                )
                
                console.log(`✅ Processed post: ${frontmatter.slug}`)
              } catch (error) {
                console.error(`Error processing ${file}:`, error)
              }
            }
            
            if (posts.length > 0) {
              // Generate enhanced blog index
              const blogIndex = {
                posts: posts.sort((a, b) => 
                  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                ),
                authors: await processAuthors(),
                tags: [...new Set(posts.flatMap(p => p.tags))].sort(),
                totalPosts: posts.length,
                lastUpdated: new Date().toISOString()
              }
              
              await writeFile(
                'src/content/generated/blog-index.json',
                JSON.stringify(blogIndex, null, 2)
              )
              
              console.log(`✅ Generated blog index with ${posts.length} posts`)
            }
          }
        } catch (error) {
          console.log('📝 No markdown posts found yet, using basic index')
        }
        
      } catch (error) {
        console.error('Error in content processor:', error)
        // Don't fail the build, just warn
      }
    }
  }
}

async function processAuthors(): Promise<Record<string, any>> {
  // For now, return empty object
  // This will be enhanced when we add author markdown files
  return {}
}