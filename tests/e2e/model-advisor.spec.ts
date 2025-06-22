import { test, expect } from '@playwright/test';

test.describe('Model Advisor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/modeladvisor');
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('should load the Model Advisor page correctly', async ({ page }) => {
    // Check main heading
    await expect(page.getByText('AI Model Advisor')).toBeVisible();
    await expect(page.getByText('Compare and select the perfect AI model')).toBeVisible();
    
    // Check AI-powered search section
    await expect(page.getByText('AI-Powered Model Recommendations')).toBeVisible();
    await expect(page.getByPlaceholder(/e\.g\., I need to build a customer service/)).toBeVisible();
    
    // Check filter buttons are present
    await expect(page.getByRole('button', { name: 'All Models' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'OpenAI' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Anthropic' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Google' })).toBeVisible();
  });

  test('should filter models by provider using buttons', async ({ page }) => {
    // Wait for models to load
    await page.waitForSelector('[data-testid="model-card"], .models-grid-section > div', { timeout: 10000 });
    
    // Check initial state - should show all models
    const allModelsButton = page.getByRole('button', { name: 'All Models' });
    await expect(allModelsButton).toHaveClass(/bg-blue-600/);
    
    // Count initial models
    const initialCards = await page.locator('.models-grid-section > div').count();
    expect(initialCards).toBeGreaterThan(0);
    
    // Test OpenAI filter
    await page.getByRole('button', { name: 'OpenAI' }).click();
    await page.waitForTimeout(500); // Wait for filtering
    
    // Check OpenAI button is active
    const openaiButton = page.getByRole('button', { name: 'OpenAI' });
    await expect(openaiButton).toHaveClass(/bg-green-600/);
    
    // Verify only OpenAI models are shown
    const openaiCards = await page.locator('.models-grid-section > div').count();
    expect(openaiCards).toBeGreaterThan(0);
    
    // Check that visible cards contain OpenAI badge
    const visibleCards = page.locator('.models-grid-section > div').first();
    await expect(visibleCards.locator('text=OpenAI')).toBeVisible();
    
    // Test Anthropic filter
    await page.getByRole('button', { name: 'Anthropic' }).click();
    await page.waitForTimeout(500);
    
    const anthropicButton = page.getByRole('button', { name: 'Anthropic' });
    await expect(anthropicButton).toHaveClass(/bg-purple-600/);
    
    // Verify only Anthropic models are shown
    const anthropicCards = await page.locator('.models-grid-section > div').count();
    expect(anthropicCards).toBeGreaterThan(0);
    
    // Test Google filter
    await page.getByRole('button', { name: 'Google' }).click();
    await page.waitForTimeout(500);
    
    const googleButton = page.getByRole('button', { name: 'Google' });
    await expect(googleButton).toHaveClass(/bg-blue-600/);
    
    // Verify only Google models are shown
    const googleCards = await page.locator('.models-grid-section > div').count();
    expect(googleCards).toBeGreaterThan(0);
    
    // Test back to All Models
    await page.getByRole('button', { name: 'All Models' }).click();
    await page.waitForTimeout(500);
    
    await expect(allModelsButton).toHaveClass(/bg-blue-600/);
    const finalCards = await page.locator('.models-grid-section > div').count();
    expect(finalCards).toBe(initialCards);
  });

  test('should test AI model recommendations with "write an email" prompt', async ({ page }) => {
    const searchBox = page.getByPlaceholder(/e\.g\., I need to build a customer service/);
    const searchButton = page.getByRole('button', { name: 'Get AI Recommendations' });
    
    // Enter the prompt
    await searchBox.fill('write an email');
    await expect(searchButton).toBeEnabled();
    
    // Mock the API response with delay to simulate real API call
    await page.route('/api/model_search', async route => {
      // Add delay to simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          recommendations: [
            {
              rank: 1,
              name: 'GPT-4.1',
              provider: 'OpenAI',
              why: 'Excellent for writing tasks with strong language understanding',
              when: 'When you need high-quality, coherent email writing',
              rationale: 'Top choice for professional communication tasks'
            },
            {
              rank: 2,
              name: 'Claude Sonnet 4',
              provider: 'Anthropic',
              why: 'Great for professional writing with careful tone',
              when: 'When you need thoughtful, well-structured emails',
              rationale: 'Strong alternative for writing tasks'
            },
            {
              rank: 3,
              name: 'Gemini 2.5 Pro',
              provider: 'Google',
              why: 'Good general purpose model for writing',
              when: 'When you need cost-effective email generation',
              rationale: 'Solid third option for writing tasks'
            },
            {
              rank: 4,
              name: 'GPT-4o Mini',
              provider: 'OpenAI',
              why: 'Fast and cost-effective for simple emails',
              when: 'When you need quick email generation',
              rationale: 'Budget-friendly option for basic writing'
            },
            {
              rank: 5,
              name: 'Claude Haiku 3.5',
              provider: 'Anthropic',
              why: 'Lightweight option for simple writing tasks',
              when: 'When you need basic email assistance',
              rationale: 'Most economical choice for simple writing'
            }
          ]
        })
      });
    });
    
    // Click search and wait for results
    await searchButton.click();
    
    // Wait for loading animation to appear and disappear
    await expect(page.getByText('AI is Thinking')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('AI is Thinking')).toBeHidden({ timeout: 20000 });
    
    // Check that recommendations are displayed
    await expect(page.getByText('Top 5 Recommended Models for Your Task')).toBeVisible();
    
    // Check that all 5 recommendations are shown
    await expect(page.getByText('#1')).toBeVisible();
    await expect(page.getByText('GPT-4.1')).toBeVisible();
    await expect(page.getByText('#2')).toBeVisible();
    await expect(page.getByText('Claude Sonnet 4')).toBeVisible();
    await expect(page.getByText('#5')).toBeVisible();
    
    // Verify recommendation details
    await expect(page.getByText('Excellent for writing tasks with strong language understanding')).toBeVisible();
  });

  test('should test AI model recommendations with "create a Discord bot in Python" prompt', async ({ page }) => {
    const searchBox = page.getByPlaceholder(/e\.g\., I need to build a customer service/);
    const searchButton = page.getByRole('button', { name: 'Get AI Recommendations' });
    
    // Enter the prompt
    await searchBox.fill('create a Discord bot in Python');
    
    // Mock the API response with delay
    await page.route('/api/model_search', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          recommendations: [
            {
              rank: 1,
              name: 'GPT-4.1',
              provider: 'OpenAI',
              why: 'Excellent coding capabilities with strong Python knowledge',
              when: 'When you need complex Discord bot development',
              rationale: 'Best overall coding model for Discord bots'
            },
            {
              rank: 2,
              name: 'Claude Sonnet 4',
              provider: 'Anthropic',
              why: 'Strong coding abilities with good documentation',
              when: 'When you need well-documented Discord bot code',
              rationale: 'Great alternative for coding with explanations'
            },
            {
              rank: 3,
              name: 'Codex Mini Latest',
              provider: 'OpenAI',
              why: 'Specialized coding model optimized for Python',
              when: 'When you need focused Python development',
              rationale: 'Specialized for coding tasks'
            },
            {
              rank: 4,
              name: 'GPT-4o',
              provider: 'OpenAI',
              why: 'Good coding capabilities with multimodal support',
              when: 'When you need Discord bot with image features',
              rationale: 'Solid choice for feature-rich bots'
            },
            {
              rank: 5,
              name: 'Gemini 2.5 Pro',
              provider: 'Google',
              why: 'Capable coding model with good Python support',
              when: 'When you need cost-effective bot development',
              rationale: 'Budget-friendly coding option'
            }
          ]
        })
      });
    });
    
    // Click search and wait for results
    await searchButton.click();
    await expect(page.getByText('AI is Thinking')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('AI is Thinking')).toBeHidden({ timeout: 20000 });
    
    // Check results
    await expect(page.getByText('Top 5 Recommended Models for Your Task')).toBeVisible();
    await expect(page.getByText('Excellent coding capabilities with strong Python knowledge')).toBeVisible();
    await expect(page.getByText('Codex Mini Latest')).toBeVisible();
  });

  test('should test AI model recommendations with "process a large amount of text data for cheap" prompt', async ({ page }) => {
    const searchBox = page.getByPlaceholder(/e\.g\., I need to build a customer service/);
    const searchButton = page.getByRole('button', { name: 'Get AI Recommendations' });
    
    // Enter the prompt
    await searchBox.fill('process a large amount of text data for cheap');
    
    // Mock the API response focusing on cost-effective models
    await page.route('/api/model_search', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          recommendations: [
            {
              rank: 1,
              name: 'GPT-4o Mini',
              provider: 'OpenAI',
              why: 'Most cost-effective model for large-scale text processing',
              when: 'When you need to process massive amounts of text cheaply',
              rationale: 'Best price-to-performance ratio for bulk processing'
            },
            {
              rank: 2,
              name: 'Claude Haiku 3.5',
              provider: 'Anthropic',
              why: 'Very fast and economical for text analysis',
              when: 'When you need quick, cheap text processing',
              rationale: 'Excellent speed and cost efficiency'
            },
            {
              rank: 3,
              name: 'GPT-3.5 Turbo',
              provider: 'OpenAI',
              why: 'Proven cost-effective model for text tasks',
              when: 'When you need reliable, cheap text processing',
              rationale: 'Time-tested economical choice'
            },
            {
              rank: 4,
              name: 'Gemini 2.0 Flash',
              provider: 'Google',
              why: 'Fast and affordable for text processing',
              when: 'When you need Google ecosystem integration',
              rationale: 'Good alternative with competitive pricing'
            },
            {
              rank: 5,
              name: 'Gemma 3',
              provider: 'Google',
              why: 'Open-source model for cost-conscious processing',
              when: 'When you want maximum cost control',
              rationale: 'Most economical option available'
            }
          ]
        })
      });
    });
    
    // Click search and wait for results
    await searchButton.click();
    await expect(page.getByText('AI is Thinking')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('AI is Thinking')).toBeHidden({ timeout: 20000 });
    
    // Check results focus on cost-effectiveness
    await expect(page.getByText('Top 5 Recommended Models for Your Task')).toBeVisible();
    await expect(page.getByText('Most cost-effective model for large-scale text processing')).toBeVisible();
    await expect(page.getByText('GPT-4o Mini')).toBeVisible();
    await expect(page.getByText('Gemma 3')).toBeVisible();
  });

  test('should test AI model recommendations with "do a very hard Calc 3 math problem" prompt', async ({ page }) => {
    const searchBox = page.getByPlaceholder(/e\.g\., I need to build a customer service/);
    const searchButton = page.getByRole('button', { name: 'Get AI Recommendations' });
    
    // Enter the prompt
    await searchBox.fill('do a very hard Calc 3 math problem');
    
    // Mock the API response focusing on reasoning capabilities
    await page.route('/api/model_search', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          recommendations: [
            {
              rank: 1,
              name: 'o3 Pro',
              provider: 'OpenAI',
              why: 'Advanced reasoning model optimized for complex mathematical problems',
              when: 'When you need the highest level of mathematical reasoning',
              rationale: 'Top-tier reasoning capabilities for complex math'
            },
            {
              rank: 2,
              name: 'o3',
              provider: 'OpenAI',
              why: 'Strong reasoning capabilities for mathematical tasks',
              when: 'When you need advanced math problem solving',
              rationale: 'Excellent reasoning at lower cost than Pro'
            },
            {
              rank: 3,
              name: 'Claude Opus 4',
              provider: 'Anthropic',
              why: 'Excellent analytical and reasoning abilities',
              when: 'When you need detailed mathematical explanations',
              rationale: 'Strong alternative for complex reasoning'
            },
            {
              rank: 4,
              name: 'GPT-4.1',
              provider: 'OpenAI',
              why: 'Very capable at mathematical reasoning and problem solving',
              when: 'When you need reliable math problem solving',
              rationale: 'Proven track record for mathematical tasks'
            },
            {
              rank: 5,
              name: 'Gemini 2.5 Pro',
              provider: 'Google',
              why: 'Good mathematical capabilities with step-by-step reasoning',
              when: 'When you need cost-effective math problem solving',
              rationale: 'Solid mathematical abilities at good value'
            }
          ]
        })
      });
    });
    
    // Click search and wait for results
    await searchButton.click();
    await expect(page.getByText('AI is Thinking')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('AI is Thinking')).toBeHidden({ timeout: 20000 });
    
    // Check results focus on reasoning models
    await expect(page.getByText('Top 5 Recommended Models for Your Task')).toBeVisible();
    await expect(page.getByText('Advanced reasoning model optimized for complex mathematical problems')).toBeVisible();
    await expect(page.getByText('o3 Pro')).toBeVisible();
    await expect(page.getByText('Claude Opus 4')).toBeVisible();
  });

  test('should clear search results and return to model browser', async ({ page }) => {
    const searchBox = page.getByPlaceholder(/e\.g\., I need to build a customer service/);
    const searchButton = page.getByRole('button', { name: 'Get AI Recommendations' });
    
    // Enter a search and get results
    await searchBox.fill('test query');
    
    await page.route('/api/model_search', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          recommendations: [
            {
              rank: 1,
              name: 'Test Model',
              provider: 'OpenAI',
              why: 'Test reason',
              when: 'Test when',
              rationale: 'Test rationale'
            },
            {
              rank: 2,
              name: 'Test Model 2',
              provider: 'Anthropic',
              why: 'Test reason 2',
              when: 'Test when 2',
              rationale: 'Test rationale 2'
            },
            {
              rank: 3,
              name: 'Test Model 3',
              provider: 'Google',
              why: 'Test reason 3',
              when: 'Test when 3',
              rationale: 'Test rationale 3'
            },
            {
              rank: 4,
              name: 'Test Model 4',
              provider: 'OpenAI',
              why: 'Test reason 4',
              when: 'Test when 4',
              rationale: 'Test rationale 4'
            },
            {
              rank: 5,
              name: 'Test Model 5',
              provider: 'Anthropic',
              why: 'Test reason 5',
              when: 'Test when 5',
              rationale: 'Test rationale 5'
            }
          ]
        })
      });
    });
    
    await searchButton.click();
    await expect(page.getByText('AI is Thinking')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('AI is Thinking')).toBeHidden({ timeout: 20000 });
    
    // Verify recommendations are shown
    await expect(page.getByText('Top 5 Recommended Models for Your Task')).toBeVisible();
    
    // Click Clear button
    await page.getByRole('button', { name: 'Clear' }).click();
    
    // Verify we're back to the model browser
    await expect(page.getByText('Top 5 Recommended Models for Your Task')).toBeHidden();
    await expect(page.getByRole('button', { name: 'All Models' })).toBeVisible();
    await expect(page.locator('.models-grid-section')).toBeVisible();
    
    // Search box should be cleared
    await expect(searchBox).toHaveValue('');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    const searchBox = page.getByPlaceholder(/e\.g\., I need to build a customer service/);
    const searchButton = page.getByRole('button', { name: 'Get AI Recommendations' });
    
    // Enter a search
    await searchBox.fill('test error handling');
    
    // Mock API error with delay
    await page.route('/api/model_search', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    });
    
    await searchButton.click();
    await expect(page.getByText('AI is Thinking')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('AI is Thinking')).toBeHidden({ timeout: 20000 });
    
    // Check error message is displayed
    await expect(page.getByText(/Failed to get recommendations/)).toBeVisible();
    
    // Verify search functionality still works after error
    await expect(searchBox).toBeVisible();
    await expect(searchButton).toBeEnabled();
  });

  test('should display model cards with correct information', async ({ page }) => {
    // Wait for models to load
    await page.waitForSelector('.models-grid-section > div', { timeout: 10000 });
    
    // Check that model cards are displayed
    const modelCards = page.locator('.models-grid-section > div');
    const cardCount = await modelCards.count();
    expect(cardCount).toBeGreaterThan(0);
    
    // Check first model card has required elements
    const firstCard = modelCards.first();
    
    // Should have a title
    await expect(firstCard.locator('h3, .font-bold').first()).toBeVisible();
    
    // Should have a provider badge
    await expect(firstCard.locator('text=/OpenAI|Anthropic|Google/')).toBeVisible();
    
    // Should have "Learn More" button
    await expect(firstCard.locator('text=Learn More')).toBeVisible();
  });

  test('should test "Show More/Less Models" functionality', async ({ page }) => {
    // Wait for models to load
    await page.waitForSelector('.models-grid-section > div', { timeout: 10000 });
    
    // Count initial visible models (should be 6 or less)
    const initialCards = await page.locator('.models-grid-section > div').count();
    
    // Check if "Show More" button exists (only if there are more than 6 models)
    const showMoreButton = page.getByRole('button', { name: /Show More Models/ });
    
    if (await showMoreButton.isVisible()) {
      // Click "Show More"
      await showMoreButton.click();
      await page.waitForTimeout(500);
      
      // Should now show more models
      const expandedCards = await page.locator('.models-grid-section > div').count();
      expect(expandedCards).toBeGreaterThan(initialCards);
      
      // Button should now say "Show Less"
      await expect(page.getByRole('button', { name: 'Show Less Models' })).toBeVisible();
      
      // Click "Show Less"
      await page.getByRole('button', { name: 'Show Less Models' }).click();
      await page.waitForTimeout(500);
      
      // Should be back to original count
      const collapsedCards = await page.locator('.models-grid-section > div').count();
      expect(collapsedCards).toBe(initialCards);
    }
  });
}); 