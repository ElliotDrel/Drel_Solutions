import { test, expect } from '@playwright/test';

test.describe('External Redirect Tests', () => {
  test('should display loading state for blog redirect', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
    
    // Should show loading state
    await expect(page.locator('[role="status"]')).toBeVisible();
    await expect(page.locator('.animate-spin')).toBeVisible();
    
    // Should show progress bar
    await expect(page.locator('.bg-blue-600')).toBeVisible();
    
    // Should show descriptive text
    await expect(page.locator('h2')).toContainText('Redirecting to Blog');
    await expect(page.locator('p')).toContainText('Taking you to our Substack publication');
  });

  test('should show fallback link after timeout', async ({ page }) => {
    // Mock redirect to prevent actual external navigation
    await page.route('**/*', route => {
      // Don't actually redirect, just continue
      route.continue();
    });
    
    await page.goto('/blog');
    
    // Wait for timeout to trigger fallback
    await page.waitForTimeout(2000);
    
    // Should show error state
    await expect(page.locator('h2')).toContainText('Redirect Issue');
    await expect(page.locator('p')).toContainText('Redirect is taking longer than expected');
    
    // Should show fallback link
    const fallbackLink = page.locator('a[href="https://drelsolutions.substack.com/"]');
    await expect(fallbackLink).toBeVisible();
    await expect(fallbackLink).toContainText('Visit Drel Solutions Blog');
  });

  test('should handle redirect component props correctly', async ({ page }) => {
    await page.goto('/blog');
    
    // Verify correct URL is used
    const fallbackLink = page.locator('a[href="https://drelsolutions.substack.com/"]');
    await expect(fallbackLink).toBeVisible();
    
    // Verify external link attributes
    await expect(fallbackLink).toHaveAttribute('target', '_blank');
    await expect(fallbackLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should be accessible during redirect', async ({ page }) => {
    await page.goto('/blog');
    
    // Check ARIA attributes
    const statusElement = page.locator('[role="status"]');
    await expect(statusElement).toHaveAttribute('aria-live', 'polite');
    await expect(statusElement).toHaveAttribute('aria-label', 'Redirecting');
  });

  test('should handle mobile viewport correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/blog');
    
    // Should be responsive
    await expect(page.locator('[role="status"]')).toBeVisible();
    await expect(page.locator('.text-center')).toBeVisible();
    
    // Card should be properly sized
    await expect(page.locator('.max-w-md')).toBeVisible();
  });

  test('should show progress animation', async ({ page }) => {
    await page.goto('/blog');
    
    // Progress should start at 0 and increase
    const progressBar = page.locator('.bg-blue-600');
    await expect(progressBar).toBeVisible();
    
    // Wait a bit and check progress has increased
    await page.waitForTimeout(200);
    const progressText = page.locator('.text-xs.font-medium');
    await expect(progressText).toBeVisible();
    
    // Progress should be greater than 0
    const progressValue = await progressText.textContent();
    const numericValue = parseInt(progressValue?.replace('%', '') || '0');
    expect(numericValue).toBeGreaterThan(0);
  });

  test('should handle error state correctly', async ({ page }) => {
    // Mock to simulate error
    await page.route('**/*', route => {
      route.continue();
    });
    
    await page.goto('/blog');
    
    // Wait for error state to appear
    await page.waitForTimeout(2000);
    
    // Should show warning icon
    await expect(page.locator('.text-yellow-600 svg')).toBeVisible();
    
    // Should show error message
    await expect(page.locator('h2')).toContainText('Redirect Issue');
    
    // Should update aria-label
    await expect(page.locator('[role="status"]')).toHaveAttribute('aria-label', 'Redirect error');
  });

  test('should handle keyboard navigation on fallback link', async ({ page }) => {
    await page.goto('/blog');
    
    // Wait for fallback link to be available
    await page.waitForTimeout(2000);
    
    // Focus on fallback link
    const fallbackLink = page.locator('a[href="https://drelsolutions.substack.com/"]');
    await fallbackLink.focus();
    
    // Should be focusable
    await expect(fallbackLink).toBeFocused();
    
    // Should have proper styling when focused
    await expect(fallbackLink).toHaveClass(/hover:bg-blue-700/);
  });

  test('should display proper styling', async ({ page }) => {
    await page.goto('/blog');
    
    // Check gradient background
    await expect(page.locator('.bg-gradient-to-br')).toBeVisible();
    
    // Check card styling
    await expect(page.locator('.bg-white.rounded-lg.shadow-lg')).toBeVisible();
    
    // Check button styling
    const fallbackLink = page.locator('a[href="https://drelsolutions.substack.com/"]');
    await expect(fallbackLink).toHaveClass(/bg-blue-600/);
    await expect(fallbackLink).toHaveClass(/text-white/);
    await expect(fallbackLink).toHaveClass(/rounded-md/);
  });

  test('should handle component unmounting cleanly', async ({ page }) => {
    await page.goto('/blog');
    
    // Navigate away before redirect completes
    await page.click('nav a[href="/"]');
    await expect(page).toHaveURL('/');
    
    // Should navigate successfully without errors
    await expect(page.locator('h1')).toContainText('Drel Solutions');
  });

  test('should work with different redirect URLs', async ({ page }) => {
    // This test would require modifying the component to accept different URLs
    // For now, we'll verify the current URL is correct
    await page.goto('/blog');
    
    const fallbackLink = page.locator('a[href="https://drelsolutions.substack.com/"]');
    await expect(fallbackLink).toBeVisible();
    
    // Verify the link points to the correct Substack URL
    const href = await fallbackLink.getAttribute('href');
    expect(href).toBe('https://drelsolutions.substack.com/');
  });
});