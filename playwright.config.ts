import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  
  /* More workers for faster execution */
  workers: process.env.CI ? 4 : 6,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'github' : 'html',
  
  /* Global timeout for all tests */
  timeout: 15 * 1000,
  
  /* Expect timeout for assertions */
  expect: {
    timeout: 3 * 1000,
  },
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.CI ? 'http://localhost:4173' : 'http://localhost:6756',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failures */
    screenshot: 'only-on-failure',
    
    /* Record video on failures */
    video: 'retain-on-failure',
    
    /* Navigation timeout */
    navigationTimeout: 8 * 1000,
    
    /* Action timeout */
    actionTimeout: 5 * 1000,
  },

  /* Configure projects for major browsers - REDUCED for faster CI */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    
    // Only test Firefox in CI for cross-browser coverage
    ...(process.env.CI ? [{
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    }] : []),

    /* Mobile testing - only one mobile browser to save time */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: process.env.CI ? {
    command: 'npm run preview',
    url: 'http://localhost:4173',
    reuseExistingServer: false, // Always start fresh in CI
    timeout: 120 * 1000, // 2 minutes to start
    stdout: 'pipe',
    stderr: 'pipe',
  } : {
    command: 'npm run dev',
    url: 'http://localhost:6756',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
}); 