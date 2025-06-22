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
    
    // Check main CTA button - be more specific to get the first one in the hero section
    await expect(page.locator('#home').getByRole('button', { name: 'Start Saving TIME and MONEY!' })).toBeVisible();
  });

  test('should display navigation with logo and menu items', async ({ page, isMobile }) => {
    // Check logo - be more specific to get the navigation logo
    await expect(page.getByRole('navigation').getByAltText('Drel Solutions Logo')).toBeVisible();
    await expect(page.getByRole('navigation').getByText('Drel Solutions')).toBeVisible();
    
    if (isMobile) {
      // On mobile, check that the mobile menu button exists instead of navigation items
      await expect(page.getByRole('button').first()).toBeVisible(); // Hamburger menu button
      
      // Optionally, we can open the mobile menu and check the items are there
      const menuButton = page.getByRole('button').first();
      await menuButton.click();
      await page.waitForTimeout(300); // Wait for menu animation
      
      // Now check mobile menu items are visible
      await expect(page.locator('.md\\:hidden').getByText('Home')).toBeVisible();
      await expect(page.locator('.md\\:hidden').getByText('About')).toBeVisible();
      await expect(page.locator('.md\\:hidden').getByText('Model Advisor')).toBeVisible();
    } else {
      // Check navigation items (desktop) - use first() to get desktop nav items
      await expect(page.getByRole('navigation').getByText('Home').first()).toBeVisible();
      await expect(page.getByRole('navigation').getByText('About').first()).toBeVisible();
      await expect(page.getByRole('navigation').getByText('Solutions').first()).toBeVisible();
    }
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