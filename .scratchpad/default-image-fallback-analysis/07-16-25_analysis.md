# Default Image Fallback Issue Analysis

## Problem
The test expects `/default-share-image.jpg` but gets `https://via.placeholder.com/1200x630/1f2937/ffffff?text=AI+Model+Advisor`.

## Root Cause Analysis

### 1. Missing Default Image File
- The `default-share-image.jpg` file does not exist in the `/public` folder
- The Article component correctly attempts to use this fallback: `post.image || '${window.location.origin}/default-share-image.jpg'`

### 2. Static Meta Tag Override
- In `index.html` lines 18 and 22, there are static meta tags:
  ```html
  <meta property="og:image" content="https://via.placeholder.com/1200x630/1f2937/ffffff?text=AI+Model+Advisor" />
  <meta name="twitter:image" content="https://via.placeholder.com/1200x630/1f2937/ffffff?text=AI+Model+Advisor" />
  ```

### 3. Test Setup Issues
- The test `'should use default image fallback for articles without images'` checks `/blog/no-image-article`
- The mock data has an article with `image: null` for 'no-image-article' 
- The Article component logic at line 115 should work: `post.image || fallback`

### 4. Helmet Override Behavior
- The Article component uses React Helmet to dynamically set meta tags
- In testing environment, Helmet might not properly override the static meta tags from index.html
- This could be due to test environment setup or Helmet configuration

## Current Test Articles
From `src/test/pages/Article.test.tsx`:
1. `test-article` - has image: 'https://example.com/test-image.jpg'
2. `no-image-article` - has image: null (should trigger fallback)

## The Issue in Production vs Test
- **Production**: Helmet should override index.html meta tags correctly
- **Test Environment**: Static meta tags from index.html are taking precedence

## Solutions Needed
1. **Create the missing default image file**: `/public/default-share-image.jpg`
2. **Fix test environment**: Ensure Helmet properly overrides static meta tags
3. **Consider removing static placeholder**: The static meta tags in index.html might not be necessary if every page uses Helmet