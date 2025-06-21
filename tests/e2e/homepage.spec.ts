import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main heading and hero content', async ({ page }) => {
    // Check main heading
    await expect(page.getByText('AI Consulting That')).toBeVisible();
    await expect(page.getByText('Pays for Itself')).toBeVisible();
    
    // Check hero description
    await expect(page.getByText('We help businesses automate the repetitive')).toBeVisible();
    
    // Check main CTA button
    await expect(page.getByRole('button', { name: /Start Saving TIME and MONEY!/i })).toBeVisible();
  });

  test('should display navigation with logo and menu items', async ({ page }) => {
    // Check logo
    await expect(page.getByAltText('Drel Solutions Logo')).toBeVisible();
    await expect(page.getByText('Drel Solutions')).toBeVisible();
    
    // Check navigation items (desktop)
    await expect(page.getByText('Home')).toBeVisible();
    await expect(page.getByText('About')).toBeVisible();
    await expect(page.getByText('Solutions')).toBeVisible();
  });

  test('should display AI dashboard mockup with metrics', async ({ page }) => {
    await expect(page.getByText('AI Dashboard')).toBeVisible();
    await expect(page.getByText('Cost Savings')).toBeVisible();
    await expect(page.getByText('Time Saved')).toBeVisible();
    await expect(page.getByText('Automations')).toBeVisible();
  });

  test('should display stats section with animated counters', async ({ page }) => {
    await expect(page.getByText('Real Impact. Measured in Time and Money.')).toBeVisible();
    await expect(page.getByText('Saved over')).toBeVisible();
    await expect(page.getByText('Freed up more than')).toBeVisible();
  });

  test('should display core values section', async ({ page }) => {
    await expect(page.getByText('Built to Save You Time and Money')).toBeVisible();
    await expect(page.getByText('Automate Repetitive Tasks')).toBeVisible();
    await expect(page.getByText('Cut Unnecessary Costs')).toBeVisible();
    await expect(page.getByText('Make Smarter Decisions Faster')).toBeVisible();
    await expect(page.getByText('Run Lean, Stay Sharp')).toBeVisible();
  });

  test('should display footer with copyright', async ({ page }) => {
    await expect(page.getByText('© 2024 Drel Solutions. All rights reserved.')).toBeVisible();
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check that mobile menu button exists
    const menuButton = page.getByRole('button').first();
    await expect(menuButton).toBeVisible();
    
    // Check that content is still accessible
    await expect(page.getByText('AI Consulting That')).toBeVisible();
    await expect(page.getByText('Pays for Itself')).toBeVisible();
  });
}); 