import { test, expect } from '@playwright/test';

test.describe('Navigation Flow Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate to all main pages successfully', async ({ page }) => {
    // Test Home page
    await expect(page.locator('h1')).toContainText('Drel Solutions');
    
    // Test About page navigation
    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('h1')).toContainText('About');
    
    // Test Contact page navigation
    await page.click('nav a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('h1')).toContainText('Contact');
    
    // Test Model Advisor navigation via dropdown
    await page.click('nav button[aria-controls="solutions-dropdown"]');
    await expect(page.locator('#solutions-dropdown')).toBeVisible();
    await page.click('nav a[href="/modeladvisor"]');
    await expect(page).toHaveURL('/modeladvisor');
    await expect(page.locator('h1')).toContainText('Model Advisor');
  });

  test('should handle mobile navigation correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Mobile menu should be hidden initially
    await expect(page.locator('#mobile-menu')).not.toBeVisible();
    
    // Click mobile menu button
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('#mobile-menu')).toBeVisible();
    
    // Test mobile navigation links
    await page.click('#mobile-menu a[href="/about"]');
    await expect(page).toHaveURL('/about');
    await expect(page.locator('#mobile-menu')).not.toBeVisible();
    
    // Test mobile menu closes on navigation
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('#mobile-menu')).toBeVisible();
    await page.click('#mobile-menu a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    await expect(page.locator('#mobile-menu')).not.toBeVisible();
  });

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on Solutions dropdown button
    await page.click('nav button[aria-controls="solutions-dropdown"]');
    await expect(page.locator('#solutions-dropdown')).toBeVisible();
    
    // Press Escape to close dropdown
    await page.keyboard.press('Escape');
    await expect(page.locator('#solutions-dropdown')).not.toBeVisible();
    
    // Test mobile menu keyboard navigation
    await page.setViewportSize({ width: 375, height: 667 });
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('#mobile-menu')).toBeVisible();
    
    // Press Escape to close mobile menu
    await page.keyboard.press('Escape');
    await expect(page.locator('#mobile-menu')).not.toBeVisible();
  });

  test('should handle blog redirect properly', async ({ page }) => {
    // Click blog link
    await page.click('nav a[href="/blog"]');
    
    // Should show redirect page
    await expect(page).toHaveURL('/blog');
    await expect(page.locator('[role="status"]')).toBeVisible();
    
    // Should show progress indicator
    await expect(page.locator('.animate-spin')).toBeVisible();
    await expect(page.locator('h2')).toContainText('Redirecting to Blog');
    
    // Should show fallback link
    await expect(page.locator('a[href="https://drelsolutions.substack.com/"]')).toBeVisible();
  });

  test('should maintain navigation state during page transitions', async ({ page }) => {
    // Navigate to different pages and verify navigation remains consistent
    const navigationPages = ['/about', '/contact', '/modeladvisor'];
    
    for (const pagePath of navigationPages) {
      await page.goto(pagePath);
      
      // Verify navigation bar is present
      await expect(page.locator('nav[role="navigation"]')).toBeVisible();
      
      // Verify brand link is present
      await expect(page.locator('nav a[href="/"]')).toBeVisible();
      
      // Verify all main navigation links are present
      await expect(page.locator('nav a[href="/about"]')).toBeVisible();
      await expect(page.locator('nav a[href="/blog"]')).toBeVisible();
      await expect(page.locator('nav button[aria-controls="solutions-dropdown"]')).toBeVisible();
      await expect(page.locator('nav a[href="/contact"] button, nav a[href="/contact"]')).toBeVisible();
    }
  });

  test('should handle active link styling', async ({ page }) => {
    // Test active link styling on different pages
    await page.goto('/about');
    
    // About link should have active styling
    const aboutLink = page.locator('nav a[href="/about"]');
    await expect(aboutLink).toHaveClass(/text-blue-600/);
    
    // Navigate to contact and verify active styling
    await page.goto('/contact');
    const contactButton = page.locator('nav a[href="/contact"] button');
    await expect(contactButton).toBeVisible();
    
    // Navigate to model advisor and verify active styling
    await page.goto('/modeladvisor');
    const solutionsButton = page.locator('nav button[aria-controls="solutions-dropdown"]');
    await expect(solutionsButton).toHaveClass(/text-blue-600/);
  });

  test('should handle dropdown interactions correctly', async ({ page }) => {
    const dropdownButton = page.locator('nav button[aria-controls="solutions-dropdown"]');
    const dropdown = page.locator('#solutions-dropdown');
    
    // Dropdown should be closed initially
    await expect(dropdown).not.toBeVisible();
    
    // Click to open dropdown
    await dropdownButton.click();
    await expect(dropdown).toBeVisible();
    await expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');
    
    // Click outside to close dropdown
    await page.click('body');
    await expect(dropdown).not.toBeVisible();
    await expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
    
    // Open dropdown and click on menu item
    await dropdownButton.click();
    await expect(dropdown).toBeVisible();
    await page.click('#solutions-dropdown a[href="/modeladvisor"]');
    await expect(page).toHaveURL('/modeladvisor');
    await expect(dropdown).not.toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    // Test ARIA attributes
    await expect(page.locator('nav')).toHaveAttribute('role', 'navigation');
    await expect(page.locator('nav')).toHaveAttribute('aria-label', 'Main navigation');
    
    // Test dropdown accessibility
    const dropdownButton = page.locator('nav button[aria-controls="solutions-dropdown"]');
    await expect(dropdownButton).toHaveAttribute('aria-haspopup', 'true');
    await expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
    
    await dropdownButton.click();
    await expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#solutions-dropdown')).toHaveAttribute('role', 'menu');
    
    // Test mobile menu accessibility
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileButton = page.locator('[data-testid="mobile-menu-button"]');
    await expect(mobileButton).toHaveAttribute('aria-expanded', 'false');
    await expect(mobileButton).toHaveAttribute('aria-controls', 'mobile-menu');
    
    await mobileButton.click();
    await expect(mobileButton).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#mobile-menu')).toHaveAttribute('role', 'menu');
  });

  test('should handle error scenarios gracefully', async ({ page }) => {
    // Test 404 navigation
    await page.goto('/nonexistent-page');
    await expect(page.locator('h1')).toContainText('404');
    
    // Navigation should still work
    await expect(page.locator('nav[role="navigation"]')).toBeVisible();
    await page.click('nav a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('should maintain scroll position during navigation', async ({ page }) => {
    // Navigate to a page with content
    await page.goto('/about');
    
    // Scroll down (if page has content)
    await page.evaluate(() => window.scrollTo(0, 100));
    
    // Navigate to another page
    await page.click('nav a[href="/contact"]');
    await expect(page).toHaveURL('/contact');
    
    // Should be at top of new page
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBe(0);
  });
});