import { test, expect, Page } from '@playwright/test';

// Helper class for article sharing operations
class ArticleSharingHelper {
  constructor(private page: Page) {}

  async navigateToBlog() {
    await this.page.goto('/blog');
    await this.page.waitForLoadState('networkidle');
  }

  async clickFirstArticle() {
    // Click on the first article card in the blog list
    const firstArticle = this.page.locator('.grid article, .grid .card, [data-testid="article-card"]').first();
    await firstArticle.click();
    await this.page.waitForLoadState('networkidle');
  }

  async findShareButton() {
    // Find the share button with icon and text
    return this.page.locator('button:has(svg):has-text("Share")');
  }

  async clickShareButton() {
    const shareButton = await this.findShareButton();
    await shareButton.click();
  }

  async getMetaTagContent(property: string, nameAttr = false): Promise<string | null> {
    const selector = nameAttr ? `meta[name="${property}"]` : `meta[property="${property}"]`;
    const element = await this.page.locator(selector).first();
    return await element.getAttribute('content');
  }

  async waitForToast(text: string, timeout = 5000) {
    await this.page.waitForSelector(`:text("${text}")`, { timeout });
  }

  async checkClipboardContains(expectedUrl: string) {
    // Grant clipboard permissions
    await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Evaluate clipboard content in browser context
    const clipboardText = await this.page.evaluate(async () => {
      try {
        return await navigator.clipboard.readText();
      } catch (error) {
        // Fallback for browsers without clipboard API access
        return null;
      }
    });
    
    expect(clipboardText).toBe(expectedUrl);
  }
}

test.describe('Article Sharing Functionality', () => {
  test.beforeEach(async ({ context }) => {
    // Grant clipboard permissions for all tests
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  });

  test('should complete full sharing workflow from blog to article', async ({ page }) => {
    const helper = new ArticleSharingHelper(page);
    
    // Navigate to blog page
    await helper.navigateToBlog();
    await expect(page.getByText('All Posts')).toBeVisible();
    
    // Click on first article
    await helper.clickFirstArticle();
    
    // Verify we're on an article page
    await expect(page.url()).toMatch(/\/blog\/.+/);
    await expect(page.locator('h1')).toBeVisible();
    
    // Find and verify share button exists
    const shareButton = await helper.findShareButton();
    await expect(shareButton).toBeVisible();
    await expect(shareButton).toHaveText(/Share/);
    
    // Click share button
    await helper.clickShareButton();
    
    // Verify success toast appears
    await helper.waitForToast('Link copied!');
    await expect(page.getByText('Article link copied to clipboard.')).toBeVisible();
    
    // Verify clipboard contains correct URL
    const currentUrl = page.url();
    await helper.checkClipboardContains(currentUrl);
  });

  test('should verify Open Graph meta tags are correctly generated', async ({ page }) => {
    const helper = new ArticleSharingHelper(page);
    
    // Navigate to a specific article directly
    await page.goto('/blog/test-article'); // Assuming a test article exists
    await page.waitForLoadState('networkidle');
    
    // Check Open Graph meta tags
    const ogType = await helper.getMetaTagContent('og:type');
    const ogTitle = await helper.getMetaTagContent('og:title');
    const ogDescription = await helper.getMetaTagContent('og:description');
    const ogImage = await helper.getMetaTagContent('og:image');
    const ogUrl = await helper.getMetaTagContent('og:url');
    const ogSiteName = await helper.getMetaTagContent('og:site_name');
    
    expect(ogType).toBe('article');
    expect(ogTitle).toBeTruthy();
    expect(ogDescription).toBeTruthy();
    expect(ogImage).toBeTruthy();
    expect(ogUrl).toContain('/blog/');
    expect(ogSiteName).toBe('Drel Solutions');
  });

  test('should verify Twitter meta tags are correctly generated', async ({ page }) => {
    const helper = new ArticleSharingHelper(page);
    
    await page.goto('/blog/test-article');
    await page.waitForLoadState('networkidle');
    
    // Check Twitter meta tags
    const twitterCard = await helper.getMetaTagContent('twitter:card', true);
    const twitterTitle = await helper.getMetaTagContent('twitter:title', true);
    const twitterDescription = await helper.getMetaTagContent('twitter:description', true);
    const twitterImage = await helper.getMetaTagContent('twitter:image', true);
    const twitterUrl = await helper.getMetaTagContent('twitter:url', true);
    
    expect(twitterCard).toBe('summary_large_image');
    expect(twitterTitle).toBeTruthy();
    expect(twitterDescription).toBeTruthy();
    expect(twitterImage).toBeTruthy();
    expect(twitterUrl).toContain('/blog/');
  });

  test('should verify article-specific meta tags are generated', async ({ page }) => {
    const helper = new ArticleSharingHelper(page);
    
    await page.goto('/blog/test-article');
    await page.waitForLoadState('networkidle');
    
    // Check article-specific meta tags
    const articleAuthor = await helper.getMetaTagContent('article:author');
    const articlePublished = await helper.getMetaTagContent('article:published_time');
    const articleTags = await helper.getMetaTagContent('article:tag');
    
    expect(articleAuthor).toBeTruthy();
    expect(articlePublished).toBeTruthy();
    expect(articleTags).toBeTruthy();
  });

  test('should use default image fallback for articles without images', async ({ page }) => {
    const helper = new ArticleSharingHelper(page);
    
    // Navigate to an article that doesn't have an image (create test article or mock)
    await page.goto('/blog/no-image-article');
    await page.waitForLoadState('networkidle');
    
    // Check that default image is used in meta tags
    const ogImage = await helper.getMetaTagContent('og:image');
    const twitterImage = await helper.getMetaTagContent('twitter:image', true);
    
    expect(ogImage).toContain('/default-share-image.jpg');
    expect(twitterImage).toContain('/default-share-image.jpg');
  });

  test('should work on mobile devices', async ({ page }) => {
    const helper = new ArticleSharingHelper(page);
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Navigate to article
    await page.goto('/blog/test-article');
    await page.waitForLoadState('networkidle');
    
    // Find share button (should be responsive)
    const shareButton = await helper.findShareButton();
    await expect(shareButton).toBeVisible();
    
    // Test sharing functionality
    await helper.clickShareButton();
    await helper.waitForToast('Link copied!');
    
    // Verify clipboard functionality works on mobile
    const currentUrl = page.url();
    await helper.checkClipboardContains(currentUrl);
  });

  test('should handle clipboard failures gracefully', async ({ page }) => {
    const helper = new ArticleSharingHelper(page);
    
    // Navigate to article
    await page.goto('/blog/test-article');
    await page.waitForLoadState('networkidle');
    
    // Mock clipboard failure by overriding the clipboard API
    await page.addInitScript(() => {
      // Override clipboard to simulate failure
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: () => Promise.reject(new Error('Clipboard access denied'))
        }
      });
    });
    
    // Click share button
    await helper.clickShareButton();
    
    // Verify error toast appears
    await helper.waitForToast('Copy failed');
    await expect(page.getByText('Could not copy link to clipboard.')).toBeVisible();
  });

  test('should work with browser compatibility fallback', async ({ page }) => {
    const helper = new ArticleSharingHelper(page);
    
    // Navigate to article
    await page.goto('/blog/test-article');
    await page.waitForLoadState('networkidle');
    
    // Mock older browser environment (no clipboard API)
    await page.addInitScript(() => {
      // Remove modern clipboard API to trigger fallback
      delete (navigator as Navigator & { clipboard?: Clipboard }).clipboard;
      
      // Mock document.execCommand to succeed
      document.execCommand = () => true;
    });
    
    // Click share button
    await helper.clickShareButton();
    
    // Verify success toast still appears (fallback worked)
    await helper.waitForToast('Link copied!');
    await expect(page.getByText('Article link copied to clipboard.')).toBeVisible();
  });

  test('should maintain share functionality across different articles', async ({ page }) => {
    const helper = new ArticleSharingHelper(page);
    
    // Test multiple articles to ensure consistency
    const testArticles = ['/blog/test-article', '/blog/another-article'];
    
    for (const articleUrl of testArticles) {
      await page.goto(articleUrl);
      await page.waitForLoadState('networkidle');
      
      // Verify share button exists and works
      const shareButton = await helper.findShareButton();
      await expect(shareButton).toBeVisible();
      
      await helper.clickShareButton();
      await helper.waitForToast('Link copied!');
      
      // Verify correct URL is copied
      await helper.checkClipboardContains(page.url());
      
      // Clear any existing toasts
      await page.waitForTimeout(2000);
    }
  });

  test('should verify page title and meta description for SEO', async ({ page }) => {
    await page.goto('/blog/test-article');
    await page.waitForLoadState('networkidle');
    
    // Verify page title includes article title and site name
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Drel Solutions');
    expect(pageTitle.length).toBeGreaterThan(10);
    
    // Verify meta description exists
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    expect(metaDescription!.length).toBeGreaterThan(20);
  });

  test('should handle back navigation correctly after sharing', async ({ page }) => {
    const helper = new ArticleSharingHelper(page);
    
    // Start from blog page
    await helper.navigateToBlog();
    
    // Navigate to article
    await helper.clickFirstArticle();
    const articleUrl = page.url();
    
    // Share the article
    await helper.clickShareButton();
    await helper.waitForToast('Link copied!');
    
    // Navigate back to blog
    await page.goBack();
    await page.waitForURL('/blog');
    await expect(page.getByText('All Posts')).toBeVisible();
    
    // Navigate forward again
    await page.goForward();
    await page.waitForURL(articleUrl);
    
    // Verify share functionality still works after navigation
    await helper.clickShareButton();
    await helper.waitForToast('Link copied!');
  });

  test('should have accessible share button', async ({ page }) => {
    await page.goto('/blog/test-article');
    await page.waitForLoadState('networkidle');
    
    const shareButton = await new ArticleSharingHelper(page).findShareButton();
    
    // Verify button is keyboard accessible
    await shareButton.focus();
    await expect(shareButton).toBeFocused();
    
    // Verify button can be activated with Enter key
    await shareButton.press('Enter');
    await new ArticleSharingHelper(page).waitForToast('Link copied!');
    
    // Verify button has proper role and text
    await expect(shareButton).toHaveAttribute('role', 'button');
    await expect(shareButton).toHaveText(/Share/);
  });
});