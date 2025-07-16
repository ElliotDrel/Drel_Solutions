import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export interface CIValidationResult {
  testCommandsFound: string[];
  ciConfigurationFound: boolean;
  testFailureBlocking: boolean;
  recommendations: string[];
  issues: {
    type: 'missing_test_command' | 'ci_not_blocking' | 'missing_ci_config';
    severity: 'critical' | 'warning';
    description: string;
    fix: string;
  }[];
}

interface CIConfigDetails {
  path: string;
  content: string;
  hasE2ETests: boolean;
  hasUnitTests: boolean;
  runsOnPR: boolean;
  runsOnPush: boolean;
}

/**
 * Check if CI configuration exists and is properly set up
 */
function checkCIConfiguration(): { found: boolean; details: CIConfigDetails | null } {
  const ciPaths = [
    '.github/workflows/test.yml',
    '.github/workflows/tests.yml', 
    '.github/workflows/ci.yml',
    '.github/workflows/main.yml'
  ];

  for (const ciPath of ciPaths) {
    const fullPath = path.join(process.cwd(), ciPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      return {
        found: true,
        details: {
          path: ciPath,
          content,
          hasE2ETests: content.includes('test:e2e') || content.includes('playwright'),
          hasUnitTests: content.includes('test') && !content.includes('test:e2e'),
          runsOnPR: content.includes('pull_request'),
          runsOnPush: content.includes('push')
        }
      };
    }
  }

  return { found: false, details: null };
}

/**
 * Extract test commands from package.json
 */
function extractTestCommands(): string[] {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error('package.json not found');
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const scripts = packageJson.scripts || {};

  const testCommands = Object.keys(scripts).filter(key => 
    key.startsWith('test') || 
    key.includes('lint') || 
    key.includes('typecheck') ||
    key.includes('validate')
  );

  return testCommands;
}

/**
 * Test if the test suite can actually fail
 * This creates a temporary test that always fails to verify CI behavior
 */
async function testFailureBlocking(): Promise<boolean> {
  const tempTestPath = path.join(process.cwd(), 'temp-validation-test.js');
  
  try {
    // Create a test that always fails
    const failingTest = `
const { test, expect } = require('@playwright/test');

test('TEMP VALIDATION - This test should always fail', async () => {
  expect(true).toBe(false); // Intentional failure
});
`;

    fs.writeFileSync(tempTestPath, failingTest);

    // Try to run the test suite - it should fail
    try {
      execSync('npm run test:e2e -- temp-validation-test.js', { 
        stdio: 'pipe',
        timeout: 30000 
      });
      
      // If we get here, the test suite didn't fail when it should have
      return false;
    } catch (error) {
      // Test suite failed as expected - this is good!
      return true;
    }
  } catch (error) {
    console.warn('Could not test failure blocking:', error);
    return false;
  } finally {
    // Clean up temp test file
    if (fs.existsSync(tempTestPath)) {
      fs.unlinkSync(tempTestPath);
    }
  }
}

/**
 * Validate CI environment and configuration
 */
export async function validateCI(): Promise<CIValidationResult> {
  console.log('🔍 Validating CI configuration...');

  const testCommands = extractTestCommands();
  const ciConfig = checkCIConfiguration();
  
  console.log('🧪 Testing failure blocking behavior...');
  const testFailureBlocking = await testFailureBlocking();

  const issues: CIValidationResult['issues'] = [];
  const recommendations: string[] = [];

  // Check for test commands
  if (testCommands.length === 0) {
    issues.push({
      type: 'missing_test_command',
      severity: 'critical',
      description: 'No test commands found in package.json',
      fix: 'Add test scripts to package.json (e.g., "test:e2e": "playwright test")'
    });
  }

  // Check for CI configuration
  if (!ciConfig.found) {
    issues.push({
      type: 'missing_ci_config',
      severity: 'critical', 
      description: 'No CI configuration found',
      fix: 'Add GitHub Actions workflow file (e.g., .github/workflows/test.yml)'
    });
  } else {
    // Check CI configuration quality
    const details = ciConfig.details;
    
    if (!details.hasE2ETests) {
      recommendations.push('Consider adding e2e tests to CI pipeline');
    }
    
    if (!details.runsOnPR) {
      recommendations.push('Consider running tests on pull requests');
    }
    
    if (!details.runsOnPush) {
      recommendations.push('Consider running tests on push to main branch');
    }
  }

  // Check test failure blocking
  if (!testFailureBlocking) {
    issues.push({
      type: 'ci_not_blocking',
      severity: 'critical',
      description: 'Test failures do not appear to block deployment',
      fix: 'Ensure CI configuration properly fails when tests fail, and that failing CI blocks deployment'
    });
  }

  // Generate recommendations
  if (testCommands.length > 0 && ciConfig.found && testFailureBlocking) {
    recommendations.push('CI configuration appears to be working correctly!');
  }

  if (testCommands.includes('test:e2e') && testCommands.includes('test:coverage')) {
    recommendations.push('Good test coverage setup detected');
  }

  return {
    testCommandsFound: testCommands,
    ciConfigurationFound: ciConfig.found,
    testFailureBlocking,
    recommendations,
    issues
  };
}