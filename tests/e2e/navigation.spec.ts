import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between pages with browser controls', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('AI Model Advisor');
    
    // Navigate to Model Advisor
    await page.click('[data-testid="nav-model-advisor"]');
    await expect(page).toHaveURL(/\/model-advisor/);
    await expect(page.locator('[data-testid="model-grid"]')).toBeVisible();
    
    // Navigate to Blog
    await page.click('[data-testid="nav-blog"]');
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator('[data-testid="article-card"]').first()).toBeVisible();
    
    // Navigate to About
    await page.click('[data-testid="nav-about"]');
    await expect(page).toHaveURL(/\/about/);
    
    // Navigate to Contact
    await page.click('[data-testid="nav-contact"]');
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