# Blog Post Creation Instructions

Follow these steps to add a new blog post with images to the website.

## Step-by-Step Process

### 1. Format MDX file with proper frontmatter and SEO metadata
- Create your `.mdx` file with required frontmatter structure
- Include all required fields for SEO optimization and functionality
- Set header image path: `/blog/images/headers/your-post-slug-header.webp`

**Example frontmatter:**
```markdown
---
id: "unique-number"
title: "Your Post Title"
excerpt: "Brief description for search engines and social sharing"
category: "AI Solutions"
seoTitle: "Custom SEO Title (60 chars max)"
metaDescription: "Compelling meta description for search engines (120-160 chars)"
keywords: ["keyword1", "keyword2", "keyword3"]
focusKeyword: "primary-keyword"
headerImage: "/blog/images/headers/your-post-slug-header.webp"
author: "drel-solutions"
tags: ["tag1", "tag2"]
publishedAt: "2024-01-15"
updatedAt: "2024-01-15"
slug: "your-post-slug"
featured: false
draft: false
---

# Your content here
```

### 2. Add header image to the headers directory
- Place your main header image in `public/blog/images/headers/`
- Name it: `your-post-slug-header.webp`
- This image will appear at the top of your blog post
- Recommended: WebP format, landscape orientation, optimized for web

### 3. Add inline images to the content directory
- Add all your content images to `public/blog/images/content/`
- Use descriptive filenames: `chart1.webp`, `screenshot.webp`, `diagram.webp`
- Prefer WebP format for optimal performance
- Keep images optimized for web (reasonable file sizes)

### 4. Update MDX content with inline image references
- Add image references in your MDX content using:
  - `![Alt text](/blog/images/content/image.webp)`
  - Or use the OptimizedImage component: `<OptimizedImage src="/blog/images/content/image.webp" alt="Description" />`

### 5. Add MDX file to src/content/blog/
- Place your completed `.mdx` file in `src/content/blog/`
- Filename should match your slug: `your-post-slug.mdx`

### 6. Verify all image paths are correct and accessible
- Double-check header image path matches: `/blog/images/headers/your-post-slug-header.webp`
- Ensure content images use paths like: `/blog/images/content/image-name.webp`
- Test that frontmatter headerImage path matches your actual file location

## Final File Structure

After completion, you should have:

```
src/content/blog/
└── your-post-slug.mdx

public/blog/images/headers/
└── your-post-slug-header.webp

public/blog/images/content/
├── inline-image1.webp
├── chart.webp
└── screenshot.webp
```

## Important Notes

- The build system automatically processes MDX files at build time on Vercel
- No manual registration is required - just add the files to src/content/blog/
- Build will fail if frontmatter is missing required SEO fields (this is intentional)
- All image paths must be absolute paths starting with `/blog/images/`
- Use unique post IDs to avoid conflicts
- Author field should reference existing author IDs from src/data/blog/authors.ts
- SEO fields (metaDescription, keywords, category) are now required for optimization

## Available Authors

Use one of these author IDs in your frontmatter:
- `"drel-solutions"` - Main company author with AI expertise
- `"technical-team"` - Development team author for technical content

## Troubleshooting

- If build fails, check frontmatter format includes all required SEO fields
- Verify all image files exist at the specified paths (headers/ and content/ directories)
- Ensure slug matches filename: `your-post-slug.mdx`
- Check that metaDescription is between 120-160 characters
- Verify author ID matches an existing author in authors.ts
- Ensure all required frontmatter fields are present (see example above)