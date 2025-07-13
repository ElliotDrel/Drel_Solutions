import type { Plugin } from 'vite'
import { readFile, writeFile, mkdir, readdir } from 'fs/promises'
import { join, extname } from 'path'
import { BlogPostSchema } from '../../types/blog'
import { calculateReadingTime, generateExcerpt, sanitizeMarkdown } from '../content/markdown'
import { validateFrontmatter, validateContentStructure } from '../content/validation'

// Enhanced frontmatter parser with multi-line YAML object support
function parseFrontmatter(content: string): { data: any; content: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/
  const match = content.match(frontmatterRegex)
  
  if (!match) {
    return { data: {}, content }
  }
  
  const [, frontmatterStr, bodyContent] = match
  const data: any = {}
  
  // Enhanced YAML-like parsing with multi-line object support
  const lines = frontmatterStr.split('\n')
  let currentKey: string | null = null
  let currentObject: any = null
  let indentLevel = 0
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    // Skip empty lines
    if (!trimmedLine) continue
    
    // Calculate current line indent
    const lineIndent = line.length - line.trimStart().length
    
    // Check if this is a top-level key
    const colonIndex = line.indexOf(':')
    if (colonIndex > 0 && lineIndent === 0) {
      // Save previous object if we were building one
      if (currentKey && currentObject) {
        data[currentKey] = currentObject
      }
      
      currentKey = line.substring(0, colonIndex).trim()
      let value = line.substring(colonIndex + 1).trim()
      
      // If value is empty, this might be start of an object
      if (!value) {
        currentObject = {}
        indentLevel = lineIndent
        continue
      }
      
      // Process single-line values
      value = parseValue(value)
      data[currentKey] = value
      currentKey = null
      currentObject = null
    }
    // Handle nested object properties
    else if (currentKey && currentObject && lineIndent > 0) {
      const nestedColonIndex = trimmedLine.indexOf(':')
      if (nestedColonIndex > 0) {
        const nestedKey = trimmedLine.substring(0, nestedColonIndex).trim()
        let nestedValue = trimmedLine.substring(nestedColonIndex + 1).trim()
        nestedValue = parseValue(nestedValue)
        currentObject[nestedKey] = nestedValue
      }
    }
  }
  
  // Save final object if we were building one
  if (currentKey && currentObject) {
    data[currentKey] = currentObject
  }
  
  return { data, content: bodyContent }
}

// Helper function to parse individual values
function parseValue(value: string): any {
  // Remove quotes
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1)
  }
  
  // Handle arrays
  if (value.startsWith('[') && value.endsWith(']')) {
    return value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''))
  }
  
  // Handle booleans
  if (value === 'true') return true
  if (value === 'false') return false
  
  // Handle numbers
  if (/^\d+$/.test(value)) return parseInt(value)
  
  // Return as string
  return value
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
        
        // Environment-based error handling
        const failOnError = process.env.CONTENT_FAIL_ON_ERROR === 'true'
        const isProduction = process.env.NODE_ENV === 'production'
        const isCi = process.env.CI === 'true'
        
        // Write error log for debugging
        try {
          await writeFile('content-processing-error.log', JSON.stringify(errorReport, null, 2))
          console.log('📋 Error details written to content-processing-error.log')
        } catch (logError) {
          console.warn('⚠️ Could not write error log:', logError.message)
        }
        
        if (failOnError || (isProduction && isCi)) {
          throw new Error(`Content processing failed: ${error.message}. Check content-processing-error.log for details.`)
        } else {
          console.warn('⚠️ Continuing build despite content processing errors.')
          console.warn('💡 Set CONTENT_FAIL_ON_ERROR=true to halt build on content errors.')
          console.warn('📝 In production CI, builds will fail automatically on content errors.')
        }
      }
    }
  }
}

async function processAuthors(): Promise<Record<string, any>> {
  // For now, return empty object
  // This will be enhanced when we add author markdown files
  return {}
}