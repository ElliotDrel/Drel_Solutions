import type { Plugin } from 'vite'
import { readFile, writeFile, mkdir, readdir } from 'fs/promises'
import { join, extname } from 'path'
import * as yaml from 'js-yaml'
import { BlogPostSchema } from '../../types/blog'
import { calculateReadingTime, generateExcerpt, sanitizeMarkdown } from '../content/markdown'
import { validateFrontmatter, validateContentStructure } from '../content/validation'

// Robust frontmatter parser using js-yaml
function parseFrontmatter(content: string): { data: any; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content }
  }
  
  const [, frontmatterStr, bodyContent] = match
  
  try {
    // Use js-yaml to parse the frontmatter with proper YAML spec compliance
    const data = yaml.load(frontmatterStr, { 
      // Safe loading to prevent code execution
      schema: yaml.SAFE_SCHEMA,
      // Allow duplicate keys (last one wins)
      json: true 
    }) as Record<string, any> || {}
    
    return { data, content: bodyContent }
  } catch (error: any) {
    console.error('❌ YAML frontmatter parsing error:', error.message)
    console.error('📄 Failed content preview:', frontmatterStr.substring(0, 100) + '...')
    
    // Return empty data object to allow build to continue with warning
    return { data: {}, content: bodyContent }
  }
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
        const failedFiles: string[] = []
        
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
                
                // Sanitize content for XSS protection
                const sanitizedContent = sanitizeMarkdown(content)
                
                // Generate computed fields using sanitized content
                const readingTime = calculateReadingTime(sanitizedContent)
                const excerpt = generateExcerpt(sanitizedContent)
                const wordCount = sanitizedContent.split(/\s+/).length
                
                const processedPost = {
                  frontmatter: { ...frontmatter, readingTime },
                  content: sanitizedContent,
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
                console.error(`❌ Error processing ${file}:`, error)
                failedFiles.push(file)
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
        const errorReport = {
          timestamp: new Date().toISOString(),
          error: error.message,
          stack: error.stack,
          failedFiles: failedFiles.length > 0 ? failedFiles : undefined
        }
        
        console.error('❌ Content processor failed:', error.message)
        console.error('🔍 Stack trace:', error.stack)
        if (failedFiles.length > 0) {
          console.error('💥 Failed files:', failedFiles)
        }
        
        // Write error log for debugging
        try {
          await writeFile('content-processing-error.log', JSON.stringify(errorReport, null, 2))
          console.log('📋 Error details written to content-processing-error.log')
        } catch (logError) {
          console.warn('⚠️ Could not write error log:', logError.message)
        }
        
        // CRITICAL: Always fail build when content processing fails
        // This ensures broken articles never make it to deployment
        throw new Error(`Content processing failed: ${error.message}. Check content-processing-error.log for details.`)
      }
    }
  }
}

async function processAuthors(): Promise<Record<string, any>> {
  // For now, return empty object
  // This will be enhanced when we add author markdown files
  return {}
}