import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should display homepage with navigation and key content', async ({ page }) => {
    await page.goto('/');
    
    // Verify main hero content
    await expect(page.locator('h1')).toContainText('AI Consulting That Pays for Itself');
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
    
    // Verify navigation elements
    await expect(page.locator('[data-testid="nav-logo"]')).toBeVisible();
    // Navigation menu elements are tested individually
    
    // Verify key content sections are present
    await expect(page.locator('[data-testid="stats-section"]')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    // Test navigation menu functionality with dropdown
    // Handle mobile vs desktop navigation
    const isMobile = page.viewportSize()?.width && page.viewportSize()!.width < 768;
    
    if (isMobile) {
      // Mobile navigation: open mobile menu first, then click link
      await page.click('[data-testid="mobile-menu-button"]');
      await page.click('text=Model Advisor');
    } else {
      // Desktop navigation: click dropdown then menu item
      await page.click('[data-testid="nav-modeladvisor"]');
      await page.click('text=Model Advisor');
    }
    
    await expect(page).toHaveURL(/\/modeladvisor/);
    
    // Return to homepage
    await page.click('[data-testid="nav-logo"]');
    await expect(page).toHaveURL('/');
  });
});