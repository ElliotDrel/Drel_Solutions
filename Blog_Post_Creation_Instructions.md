# Blog Post Creation Instructions

Follow these steps to add a new blog post with images to the website.

## Step-by-Step Process

### 1. Format markdown file with proper frontmatter and image references
- Create your `.md` file with required frontmatter structure
- Include all required fields: id, title, subtitle, image, author, readingTime, tags, publishedAt, slug, featured, draft
- Set hero image path: `/blog/images/posts/your-post-slug/hero.jpg`

**Example frontmatter:**
```markdown
---
id: "unique-number"
title: "Your Post Title"
subtitle: "Brief description"
image: "/blog/images/posts/your-post-slug/hero.jpg"
author:
  name: "Author Name"
  slug: "author-slug"
  avatar: "/blog/images/authors/author-name.jpg"
readingTime: 5
tags: ["tag1", "tag2"]
publishedAt: "2024-01-15"
slug: "your-post-slug"
featured: false
draft: false
---

# Your content here
```

### 2. Create image folder structure in public/blog/images/posts/
- Navigate to `public/blog/images/posts/`
- Create new folder named exactly like your post slug
- Structure: `public/blog/images/posts/your-post-slug/`

### 3. Add hero image to the post folder
- Place your main header image as `hero.jpg` in the post folder
- This image will appear at the top of your blog post
- Recommended size: landscape format, high quality

### 4. Add inline images to the post folder
- Add all your content images to the same folder
- Use descriptive filenames: `chart1.png`, `screenshot.jpg`, `diagram.svg`
- Keep images optimized for web (reasonable file sizes)

### 5. Update markdown content with inline image references
- Add image references in your markdown content using:
  - `![Alt text](/blog/images/posts/your-post-slug/image.png)`
  - Or HTML: `<img src="/blog/images/posts/your-post-slug/image.jpg" alt="Description" />`

### 6. Add markdown file to src/content/blog/posts/
- Place your completed `.md` file in `src/content/blog/posts/`
- Filename should match your slug: `your-post-slug.md`

### 7. Verify all image paths are correct and accessible
- Double-check all image paths start with `/blog/images/posts/your-post-slug/`
- Ensure image files exist in the correct folder
- Test that frontmatter image path matches your hero.jpg location

## Final File Structure

After completion, you should have:

```
src/content/blog/posts/
└── your-post-slug.md

public/blog/images/posts/your-post-slug/
├── hero.jpg
├── inline-image1.png
├── chart.svg
└── screenshot.jpg
```

## Important Notes

- The build system automatically processes new posts during Vercel deployment
- No manual registration is required - just add the files
- Build will fail if frontmatter is invalid (this is intentional)
- All image paths must be absolute paths starting with `/blog/images/posts/`
- Use unique post IDs to avoid conflicts

## Troubleshooting

- If build fails, check frontmatter format against existing posts
- Verify all image files exist at the specified paths
- Ensure slug matches both folder name and filename
- Check that all required frontmatter fields are present