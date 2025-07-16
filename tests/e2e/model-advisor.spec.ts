import { test, expect } from '@playwright/test';

test.describe('Model Advisor', () => {
  test('should load page and display model filtering functionality', async ({ page }) => {
    await page.goto('/model-advisor');
    
    // Verify page loads with model grid
    await expect(page.locator('[data-testid="model-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="model-card"]').first()).toBeVisible();
    
    // Test provider filtering
    await page.click('[data-testid="filter-openai"]');
    await expect(page.locator('[data-testid="model-card"]')).toHaveCount(5);
    
    // Test show more/less functionality
    await page.click('[data-testid="show-more"]');
    const cardCount = await page.locator('[data-testid="model-card"]').count();
    expect(cardCount).toBeGreaterThan(5);
    
    // Test show less
    await page.click('[data-testid="show-less"]');
    await expect(page.locator('[data-testid="model-card"]')).toHaveCount(5);
  });

  test('should handle AI recommendations with multiple prompts', async ({ page }) => {
    // Mock API responses for faster testing
    await page.route('/api/model_search', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          recommendations: [
            { name: 'GPT-4', provider: 'OpenAI', reasoning: 'Best for general tasks' },
            { name: 'Claude-3', provider: 'Anthropic', reasoning: 'Great for writing' },
            { name: 'Gemini', provider: 'Google', reasoning: 'Good for analysis' }
          ]
        })
      });
    });
    
    await page.goto('/model-advisor');
    
    const prompts = [
      'write an email',
      'create a Discord bot',
      'process text data'
    ];
    
    for (const prompt of prompts) {
      await page.fill('[data-testid="search-input"]', prompt);
      await page.click('[data-testid="search-button"]');
      
      // Verify recommendations appear
      await expect(page.locator('[data-testid="recommendation"]')).toHaveCount(3);
      
      // Clear results
      await page.click('[data-testid="clear-button"]');
      await expect(page.locator('[data-testid="model-grid"]')).toBeVisible();
    }
  });

  test('should handle API errors and clear functionality', async ({ page }) => {
    // Mock API error
    await page.route('/api/model_search', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await page.goto('/model-advisor');
    
    // Trigger API call
    await page.fill('[data-testid="search-input"]', 'test query');
    await page.click('[data-testid="search-button"]');
    
    // Verify error message appears
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    // Test clear functionality returns to model grid
    await page.click('[data-testid="clear-button"]');
    await expect(page.locator('[data-testid="model-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
  });
});