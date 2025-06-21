import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate between all pages successfully', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    await expect(page.getByText('AI Consulting That')).toBeVisible();
    
    // Navigate to About page
    await page.getByText('About').click();
    await page.waitForURL('/about');
    await expect(page.url()).toContain('/about');
    
    // Navigate to Contact page
    await page.getByText('Let\'s Talk').first().click();
    await page.waitForURL('/contact');
    await expect(page.url()).toContain('/contact');
    
    // Navigate to Model Advisor (through Solutions dropdown or direct link)
    await page.goto('/modeladvisor');
    await page.waitForURL('/modeladvisor');
    await expect(page.url()).toContain('/modeladvisor');
    
    // Navigate back to home
    await page.getByText('Drel Solutions').first().click();
    await page.waitForURL('/');
    await expect(page.url()).not.toContain('/about');
  });

  test('should handle 404 pages correctly', async ({ page }) => {
    await page.goto('/non-existent-page');
    await page.waitForURL('/non-existent-page');
    
    // Should show NotFound component
    await expect(page.getByText('404')).toBeVisible();
  });

  test('should work with browser back/forward buttons', async ({ page }) => {
    // Start at homepage
    await page.goto('/');
    
    // Navigate to about page
    await page.getByText('About').click();
    await page.waitForURL('/about');
    
    // Use browser back button
    await page.goBack();
    await page.waitForURL('/');
    await expect(page.getByText('AI Consulting That')).toBeVisible();
    
    // Use browser forward button
    await page.goForward();
    await page.waitForURL('/about');
  });

  test('should maintain responsive navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Open mobile menu
    const menuButton = page.getByRole('button').first();
    await menuButton.click();
    
    // Check mobile menu items are visible
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('About')).toBeVisible();
    
    // Navigate via mobile menu
    await page.getByText('About').click();
    await page.waitForURL('/about');
    await expect(page.url()).toContain('/about');
  });

  test('should handle CTA button clicks correctly', async ({ page }) => {
    await page.goto('/');
    
    // Click main CTA button
    await page.getByRole('button', { name: /Start Saving TIME and MONEY!/i }).first().click();
    await page.waitForURL('/contact');
    await expect(page.url()).toContain('/contact');
  });

  test('should maintain scroll position and smooth scrolling', async ({ page }) => {
    await page.goto('/');
    
    // Scroll down to check if page maintains scroll behavior
    await page.evaluate(() => window.scrollTo(0, 1000));
    
    // Check if page scrolled
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(500);
  });
}); 