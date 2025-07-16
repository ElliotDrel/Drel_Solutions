import fs from 'fs';
import path from 'path';
import { chromium, Browser, Page } from '@playwright/test';

export interface ContentAssertion {
  file: string;
  line: number;
  selector: string;
  expectedText: string;
  assertionType: 'toContainText' | 'toHaveText' | 'toBeVisible';
  context: string;
}

export interface ActualContent {
  route: string;
  selector: string;
  actualText: string;
  isVisible: boolean;
  exists: boolean;
}

export interface ContentMismatch {
  assertion: ContentAssertion;
  actualContent: ActualContent | null;
  issue: 'text_mismatch' | 'element_not_found' | 'element_not_visible';
  severity: 'critical' | 'warning';
  suggestion?: string;
}

export interface ContentValidationResult {
  assertions: ContentAssertion[];
  actualContent: ActualContent[];
  mismatches: ContentMismatch[];
  passedAssertions: ContentAssertion[];
}

/**
 * Extract content assertions from e2e test files
 */
export function extractContentAssertions(): ContentAssertion[] {
  const testsDir = path.join(process.cwd(), 'tests/e2e');
  
  if (!fs.existsSync(testsDir)) {
    throw new Error(`E2E tests directory not found at ${testsDir}`);
  }

  const testFiles = fs.readdirSync(testsDir).filter(file => file.endsWith('.spec.ts'));
  const assertions: ContentAssertion[] = [];

  testFiles.forEach(file => {
    const filePath = path.join(testsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Match expect(page.locator('selector')).toContainText('text')
      const containsTextMatch = line.match(/expect\(page\.locator\(['"`]([^'"`]+)['"`]\)\)\.toContainText\(['"`]([^'"`]+)['"`]\)/);
      if (containsTextMatch) {
        assertions.push({
          file,
          line: index + 1,
          selector: containsTextMatch[1],
          expectedText: containsTextMatch[2],
          assertionType: 'toContainText',
          context: line.trim()
        });
      }

      // Match expect(page.locator('selector')).toHaveText('text')
      const hasTextMatch = line.match(/expect\(page\.locator\(['"`]([^'"`]+)['"`]\)\)\.toHaveText\(['"`]([^'"`]+)['"`]\)/);
      if (hasTextMatch) {
        assertions.push({
          file,
          line: index + 1,
          selector: hasTextMatch[1],
          expectedText: hasTextMatch[2],
          assertionType: 'toHaveText',
          context: line.trim()
        });
      }

      // Match expect(page.locator('selector')).toBeVisible()
      const visibleMatch = line.match(/expect\(page\.locator\(['"`]([^'"`]+)['"`]\)\)\.toBeVisible\(\)/);
      if (visibleMatch) {
        assertions.push({
          file,
          line: index + 1,
          selector: visibleMatch[1],
          expectedText: '', // No text expectation for visibility checks
          assertionType: 'toBeVisible',
          context: line.trim()
        });
      }
    });
  });

  return assertions;
}

/**
 * Extract actual content from the application using Playwright
 */
export async function extractActualContent(routes: string[]): Promise<ActualContent[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const actualContent: ActualContent[] = [];

  // Get base URL from environment or default to localhost
  const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:5173';

  try {
    for (const route of routes) {
      console.log(`🔍 Analyzing content for route: ${route}`);
      
      try {
        await page.goto(`${baseURL}${route}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        });

        // Common selectors to check
        const selectors = [
          'h1', 'h2', 'h3',
          '[data-testid="hero-section"]',
          '[data-testid="stats-section"]', 
          '[data-testid="model-grid"]',
          '[data-testid="article-card"]',
          '[data-testid="nav-logo"]',
          '[data-testid="nav-model-advisor"]',
          '[data-testid="nav-blog"]',
          '[data-testid="nav-about"]',
          '[data-testid="nav-contact"]',
          'footer'
        ];

        for (const selector of selectors) {
          try {
            const element = page.locator(selector).first();
            const isVisible = await element.isVisible().catch(() => false);
            const exists = await element.count().then(count => count > 0).catch(() => false);
            
            let actualText = '';
            if (exists && isVisible) {
              actualText = await element.textContent().catch(() => '') || '';
              // Clean up text (remove extra whitespace, normalize)
              actualText = actualText.replace(/\s+/g, ' ').trim();
            }

            actualContent.push({
              route,
              selector,
              actualText,
              isVisible,
              exists
            });
          } catch (error) {
            // Element not found or other error
            actualContent.push({
              route,
              selector,
              actualText: '',
              isVisible: false,
              exists: false
            });
          }
        }
      } catch (error) {
        console.warn(`⚠️  Could not load route ${route}: ${error}`);
      }
    }
  } finally {
    await browser.close();
  }

  return actualContent;
}

/**
 * Get the route context for a test file
 */
function getRouteForTestFile(file: string, assertions: ContentAssertion[]): string {
  const filePath = path.join(process.cwd(), 'tests/e2e', file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Look for page.goto() calls to determine which route this test is checking
  const gotoMatch = content.match(/page\.goto\(['"`]([^'"`]+)['"`]\)/);
  if (gotoMatch) {
    return gotoMatch[1];
  }
  
  // Default routes based on file name
  if (file.includes('homepage')) return '/';
  if (file.includes('model-advisor')) return '/modeladvisor';
  if (file.includes('blog')) return '/blog';
  if (file.includes('about')) return '/about';
  if (file.includes('contact')) return '/contact';
  
  return '/'; // Default to homepage
}

/**
 * Validate content assertions against actual content
 */
export async function validateContent(): Promise<ContentValidationResult> {
  const assertions = extractContentAssertions();
  
  // Get unique routes from test files
  const routes = [...new Set(assertions.map(a => getRouteForTestFile(a.file, assertions)))];
  
  console.log(`🔍 Extracting content from ${routes.length} routes...`);
  const actualContent = await extractActualContent(routes);
  
  const mismatches: ContentMismatch[] = [];
  const passedAssertions: ContentAssertion[] = [];

  for (const assertion of assertions) {
    const route = getRouteForTestFile(assertion.file, assertions);
    const actualElement = actualContent.find(ac => 
      ac.route === route && ac.selector === assertion.selector
    );

    if (!actualElement || !actualElement.exists) {
      mismatches.push({
        assertion,
        actualContent: actualElement || null,
        issue: 'element_not_found',
        severity: 'critical',
        suggestion: `Element with selector '${assertion.selector}' not found on route '${route}'`
      });
      continue;
    }

    if (assertion.assertionType === 'toBeVisible' && !actualElement.isVisible) {
      mismatches.push({
        assertion,
        actualContent: actualElement,
        issue: 'element_not_visible',
        severity: 'critical',
        suggestion: `Element '${assertion.selector}' exists but is not visible on route '${route}'`
      });
      continue;
    }

    if (assertion.assertionType === 'toContainText' && assertion.expectedText) {
      if (!actualElement.actualText.includes(assertion.expectedText)) {
        mismatches.push({
          assertion,
          actualContent: actualElement,
          issue: 'text_mismatch',
          severity: 'critical',
          suggestion: `Expected text '${assertion.expectedText}' not found in '${actualElement.actualText.substring(0, 100)}...'`
        });
        continue;
      }
    }

    if (assertion.assertionType === 'toHaveText' && assertion.expectedText) {
      if (actualElement.actualText !== assertion.expectedText) {
        mismatches.push({
          assertion,
          actualContent: actualElement,
          issue: 'text_mismatch',
          severity: 'critical',
          suggestion: `Expected exact text '${assertion.expectedText}' but found '${actualElement.actualText}'`
        });
        continue;
      }
    }

    // If we get here, the assertion passes
    passedAssertions.push(assertion);
  }

  return {
    assertions,
    actualContent,
    mismatches,
    passedAssertions
  };
}