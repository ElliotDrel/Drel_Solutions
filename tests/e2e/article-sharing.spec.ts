import { test, expect } from '@playwright/test';

test.describe('Article Sharing Functionality', () => {
  test('should handle complete article sharing workflow with meta tags', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
    await expect(page.locator('[data-testid="article-card"]').first()).toBeVisible();
    
    // Click first article
    await page.locator('[data-testid="article-card"]').first().click();
    await expect(page.locator('h1')).toBeVisible();
    
    // Verify essential meta tags are present (using .first() to handle duplicates)
    await expect(page.locator('meta[property="og:title"]').first()).toBeAttached();
    await expect(page.locator('meta[property="og:description"]').first()).toBeAttached();
    await expect(page.locator('meta[property="og:image"]').first()).toBeAttached();
    await expect(page.locator('meta[name="twitter:card"]').first()).toBeAttached();
    
    // Test share functionality
    const shareButton = page.locator('button:has(svg):has-text("Share")');
    await expect(shareButton).toBeVisible();
    
    // Verify accessibility
    await expect(shareButton).toHaveAttribute('aria-label');
    
    // Click share button and verify toast
    await shareButton.click();
    await expect(page.locator('[data-testid="toast"]')).toBeVisible();
    
    // Verify page title includes site name for SEO
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Drel Solutions');
    expect(pageTitle.length).toBeGreaterThan(10);
    
    // Test back navigation works
    await page.goBack();
    await expect(page.locator('[data-testid="article-card"]').first()).toBeVisible();
  });
});