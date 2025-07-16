#!/usr/bin/env node

/**
 * Test-Implementation Validation Script
 * 
 * This script validates that e2e tests are properly aligned with the actual
 * application implementation. It checks:
 * 
 * 1. Route Alignment: Test route expectations vs actual app routes
 * 2. Content Alignment: Test content assertions vs actual DOM content  
 * 3. CI Configuration: Verification that test failures properly block deployment
 * 
 * Usage:
 *   npm run validate:test-alignment           # Full validation
 *   npm run validate:test-alignment --routes-only    # Routes only
 *   npm run validate:test-alignment --content-only   # Content only
 *   npm run validate:test-alignment --ci-only        # CI only
 */

import { validateRoutes } from './validation/route-validator';
import { validateContent } from './validation/content-validator';
import { validateCI } from './validation/ci-validator';
import { generateReport, printReport } from './validation/report-generator';

interface ValidationOptions {
  routesOnly?: boolean;
  contentOnly?: boolean;
  ciOnly?: boolean;
  silent?: boolean;
  outputFile?: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(): ValidationOptions {
  const args = process.argv.slice(2);
  const options: ValidationOptions = {};

  args.forEach(arg => {
    switch (arg) {
      case '--routes-only':
        options.routesOnly = true;
        break;
      case '--content-only':
        options.contentOnly = true;
        break;
      case '--ci-only':
        options.ciOnly = true;
        break;
      case '--silent':
        options.silent = true;
        break;
      default:
        if (arg.startsWith('--output=')) {
          options.outputFile = arg.split('=')[1];
        }
    }
  });

  return options;
}

/**
 * Main validation orchestrator
 */
async function runValidation(options: ValidationOptions = {}) {
  const startTime = Date.now();
  
  if (!options.silent) {
    console.log('🔍 Starting Test-Implementation Validation...\n');
  }

  try {
    // Route validation
    let routeResult;
    if (!options.contentOnly && !options.ciOnly) {
      if (!options.silent) console.log('🛣️  Validating routes...');
      routeResult = validateRoutes();
      if (!options.silent) {
        console.log(`   Found ${routeResult.appRoutes.length} app routes`);
        console.log(`   Found ${routeResult.testExpectations.length} test route expectations`);
        console.log(`   Identified ${routeResult.mismatches.length} mismatches\n`);
      }
    }

    // Content validation  
    let contentResult;
    if (!options.routesOnly && !options.ciOnly) {
      if (!options.silent) console.log('📝 Validating content...');
      contentResult = await validateContent();
      if (!options.silent) {
        console.log(`   Found ${contentResult.assertions.length} content assertions`);
        console.log(`   Extracted content from ${[...new Set(contentResult.actualContent.map(ac => ac.route))].length} routes`);
        console.log(`   Identified ${contentResult.mismatches.length} mismatches\n`);
      }
    }

    // CI validation
    let ciResult;
    if (!options.routesOnly && !options.contentOnly) {
      if (!options.silent) console.log('⚙️  Validating CI configuration...');
      ciResult = await validateCI();
      if (!options.silent) {
        console.log(`   Found ${ciResult.testCommandsFound.length} test commands`);
        console.log(`   CI configuration found: ${ciResult.ciConfigurationFound ? 'Yes' : 'No'}`);
        console.log(`   Test failure blocking: ${ciResult.testFailureBlocking ? 'Yes' : 'No'}`);
        console.log(`   Identified ${ciResult.issues.length} issues\n`);
      }
    }

    // Generate default results for skipped validations
    if (!routeResult) {
      routeResult = {
        appRoutes: [],
        testExpectations: [],
        mismatches: [],
        unusedRoutes: [],
        undocumentedExpectations: []
      };
    }

    if (!contentResult) {
      contentResult = {
        assertions: [],
        actualContent: [],
        mismatches: [],
        passedAssertions: []
      };
    }

    if (!ciResult) {
      ciResult = {
        testCommandsFound: [],
        ciConfigurationFound: false,
        testFailureBlocking: false,
        recommendations: [],
        issues: []
      };
    }

    // Generate comprehensive report
    const report = generateReport(routeResult, contentResult, ciResult);
    
    // Output results
    if (!options.silent) {
      printReport(report);
    }

    // Save to file if requested
    if (options.outputFile) {
      const fs = await import('fs');
      fs.writeFileSync(options.outputFile, JSON.stringify(report, null, 2));
      if (!options.silent) {
        console.log(`📄 Report saved to: ${options.outputFile}`);
      }
    }

    const duration = Date.now() - startTime;
    if (!options.silent) {
      console.log(`⏱️  Validation completed in ${duration}ms`);
    }

    // Exit with appropriate code
    const exitCode = report.summary.criticalIssues > 0 ? 1 : 0;
    process.exit(exitCode);

  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

/**
 * CLI entry point
 */
if (require.main === module) {
  const options = parseArgs();
  runValidation(options);
}

export { runValidation, ValidationOptions };