import { test, expect } from '@playwright/test';

test.describe('Model Advisor', () => {
  test('should load page and display model filtering functionality', async ({ page }) => {
    // Mock model loading for consistent test results
    await page.route('/model_docs/index.json', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          models: [
            { path: '/model_docs/openai/gpt-4o.txt', provider: 'OpenAI' },
            { path: '/model_docs/anthropic/claude-3-opus.txt', provider: 'Anthropic' },
            { path: '/model_docs/google/gemini-2-0-flash.txt', provider: 'Google' }
          ]
        })
      });
    });

    // Mock individual model files
    await page.route('/model_docs/**/*.txt', route => {
      const url = route.request().url();
      let modelName = 'Test Model';
      let provider = 'OpenAI';
      
      if (url.includes('gpt-4o')) {
        modelName = 'GPT-4o';
        provider = 'OpenAI';
      } else if (url.includes('claude-3-opus')) {
        modelName = 'Claude-3 Opus';
        provider = 'Anthropic';
      } else if (url.includes('gemini-2-0-flash')) {
        modelName = 'Gemini 2.0 Flash';
        provider = 'Google';
      }

      route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: `Model: ${modelName}
Provider: ${provider}
Release: 2024

Description: Test model description for E2E testing.

Key Capabilities:
- Text generation
- Code completion
- Analysis

Context window: 128,000 tokens
Training cutoff: April 2024
Response speed: Fast
Cost: $0.01 per 1K tokens

Best Use Cases:
- General tasks
- Code generation
- Writing assistance

Limitations:
- Training cutoff limitations
- Context window limits`
      });
    });
    
    await page.goto('/model-advisor');
    
    // First, wait for initial loading to complete
    await expect(page.locator('text=Loading AI models...')).not.toBeVisible({ timeout: 15000 });
    
    // Verify page loads with model grid (increased timeout for model loading)
    await expect(page.locator('[data-testid="model-grid"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="model-card"]').first()).toBeVisible();
    
    // Test provider filtering - with mocked data we have 1 OpenAI model
    await page.click('[data-testid="filter-openai"]');
    await expect(page.locator('[data-testid="model-card"]')).toHaveCount(1);
    
    // Test show more/less functionality - with only 3 models, no show more needed
    // Reset to all models to see all 3
    await page.click('[data-testid="filter-all"]');
    await expect(page.locator('[data-testid="model-card"]')).toHaveCount(3);
  });

  test('should handle AI recommendations with multiple prompts', async ({ page }) => {
    // Mock model loading
    await page.route('/model_docs/index.json', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          models: [
            { path: '/model_docs/openai/gpt-4o.txt', provider: 'OpenAI' },
            { path: '/model_docs/anthropic/claude-3-opus.txt', provider: 'Anthropic' },
            { path: '/model_docs/google/gemini-2-0-flash.txt', provider: 'Google' }
          ]
        })
      });
    });

    await page.route('/model_docs/**/*.txt', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: `Model: Test Model\nProvider: Test\nRelease: 2024\n\nDescription: Test model.\n\nKey Capabilities:\n- Testing\n\nContext window: 128K\nTraining cutoff: 2024\nResponse speed: Fast\nCost: $0.01\n\nBest Use Cases:\n- Testing\n\nLimitations:\n- Test only`
      });
    });

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
    
    // Wait for initial loading to complete
    await expect(page.locator('text=Loading AI models...')).not.toBeVisible({ timeout: 15000 });
    
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
      await expect(page.locator('[data-testid="model-grid"]')).toBeVisible({ timeout: 15000 });
    }
  });

  test('should handle API errors and clear functionality', async ({ page }) => {
    // Mock model loading
    await page.route('/model_docs/index.json', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          models: [
            { path: '/model_docs/openai/gpt-4o.txt', provider: 'OpenAI' }
          ]
        })
      });
    });

    await page.route('/model_docs/**/*.txt', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: `Model: Test Model\nProvider: Test\nRelease: 2024\n\nDescription: Test model.\n\nKey Capabilities:\n- Testing\n\nContext window: 128K\nTraining cutoff: 2024\nResponse speed: Fast\nCost: $0.01\n\nBest Use Cases:\n- Testing\n\nLimitations:\n- Test only`
      });
    });

    // Mock API error
    await page.route('/api/model_search', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await page.goto('/model-advisor');
    
    // Wait for initial loading to complete
    await expect(page.locator('text=Loading AI models...')).not.toBeVisible({ timeout: 15000 });
    
    // Trigger API call
    await page.fill('[data-testid="search-input"]', 'test query');
    await page.click('[data-testid="search-button"]');
    
    // Verify error message appears
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    // Test clear functionality returns to model grid
    await page.click('[data-testid="clear-button"]');
    await expect(page.locator('[data-testid="model-grid"]')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('[data-testid="error-message"]')).not.toBeVisible();
  });
});