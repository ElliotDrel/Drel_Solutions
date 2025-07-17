import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages with browser controls', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('AI Consulting That Pays for Itself');
    
    // Navigate to Model Advisor via dropdown
    // Handle mobile vs desktop navigation
    const isMobile = page.viewportSize()?.width && page.viewportSize()!.width < 768;
    
    if (isMobile) {
      // Mobile navigation: open mobile menu first, then click link
      await page.click('[data-testid="mobile-menu-button"]');
      await page.getByRole('link', { name: 'Model Advisor' }).click();
    } else {
      // Desktop navigation: click dropdown then menu item
      await page.click('[data-testid="nav-modeladvisor"]');
      await page.click('text=Model Advisor');
    }
    
    await expect(page).toHaveURL(/\/modeladvisor/);
    await expect(page.locator('[data-testid="model-grid"]')).toBeVisible();
    
    // Navigate to Blog
    if (isMobile) {
      // Mobile navigation: open mobile menu first, then click link
      await page.click('[data-testid="mobile-menu-button"]');
      await page.getByRole('link', { name: 'Blog' }).click();
    } else {
      // Desktop navigation: click link directly
      await page.click('[data-testid="nav-blog"]');
    }
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator('[data-testid="article-card"]').first()).toBeVisible();
    
    // Navigate to About
    if (isMobile) {
      // Mobile navigation: open mobile menu first, then click link
      await page.click('[data-testid="mobile-menu-button"]');
      await page.getByRole('link', { name: 'About' }).click();
    } else {
      // Desktop navigation: click link directly
      await page.click('[data-testid="nav-about"]');
    }
    await expect(page).toHaveURL(/\/about/);
    
    // Navigate to Contact
    if (isMobile) {
      // Mobile navigation: open mobile menu first, then click link
      await page.click('[data-testid="mobile-menu-button"]');
      await page.click('[data-testid="nav-contact"]');
    } else {
      // Desktop navigation: click link directly
      await page.click('[data-testid="nav-contact"]');
    }
    await expect(page).toHaveURL(/\/contact/);
    
    // Test browser back button
    await page.goBack();
    await expect(page).toHaveURL(/\/about/);
    
    await page.goBack();
    await expect(page).toHaveURL(/\/blog/);
    
    // Test browser forward button
    await page.goForward();
    await expect(page).toHaveURL(/\/about/);
    
    // Return to homepage via logo
    await page.click('[data-testid="nav-logo"]');
    await expect(page).toHaveURL('/');
    
    // Test 404 handling
    await page.goto('/nonexistent-page');
    await expect(page.locator('h1')).toContainText('404');
  });
});