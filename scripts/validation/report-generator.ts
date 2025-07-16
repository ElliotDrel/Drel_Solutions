import { RouteValidationResult } from './route-validator';
import { ContentValidationResult } from './content-validator';
import { CIValidationResult } from './ci-validator';

export interface ValidationReport {
  summary: {
    totalIssues: number;
    criticalIssues: number;
    warningIssues: number;
    testsValidated: number;
    routesValidated: number;
    contentAssertionsValidated: number;
    overallStatus: 'PASS' | 'FAIL' | 'WARNING';
  };
  routes: RouteValidationResult;
  content: ContentValidationResult;
  ci: CIValidationResult;
  recommendations: string[];
  actionItems: {
    priority: 'high' | 'medium' | 'low';
    category: 'routes' | 'content' | 'ci' | 'process';
    description: string;
    fix: string;
    files?: string[];
  }[];
}

/**
 * Generate comprehensive validation report
 */
export function generateReport(
  routeResult: RouteValidationResult,
  contentResult: ContentValidationResult,
  ciResult: CIValidationResult
): ValidationReport {
  
  // Calculate summary stats
  const routeIssues = routeResult.mismatches.length;
  const contentIssues = contentResult.mismatches.length;
  const ciIssues = ciResult.issues.length;
  
  const criticalRouteIssues = routeResult.mismatches.filter(m => m.severity === 'critical').length;
  const criticalContentIssues = contentResult.mismatches.filter(m => m.severity === 'critical').length;
  const criticalCIIssues = ciResult.issues.filter(i => i.severity === 'critical').length;
  
  const totalIssues = routeIssues + contentIssues + ciIssues;
  const criticalIssues = criticalRouteIssues + criticalContentIssues + criticalCIIssues;
  const warningIssues = totalIssues - criticalIssues;

  // Determine overall status
  let overallStatus: 'PASS' | 'FAIL' | 'WARNING' = 'PASS';
  if (criticalIssues > 0) {
    overallStatus = 'FAIL';
  } else if (warningIssues > 0) {
    overallStatus = 'WARNING';
  }

  // Generate action items
  const actionItems = generateActionItems(routeResult, contentResult, ciResult);

  // Generate recommendations
  const recommendations = generateRecommendations(routeResult, contentResult, ciResult);

  return {
    summary: {
      totalIssues,
      criticalIssues,
      warningIssues,
      testsValidated: routeResult.testExpectations.length + contentResult.assertions.length,
      routesValidated: routeResult.appRoutes.length,
      contentAssertionsValidated: contentResult.assertions.length,
      overallStatus
    },
    routes: routeResult,
    content: contentResult,
    ci: ciResult,
    recommendations,
    actionItems
  };
}

/**
 * Generate actionable items from validation results
 */
function generateActionItems(
  routeResult: RouteValidationResult,
  contentResult: ContentValidationResult,
  ciResult: CIValidationResult
): ValidationReport['actionItems'] {
  const actionItems: ValidationReport['actionItems'] = [];

  // Route mismatches
  routeResult.mismatches.forEach(mismatch => {
    actionItems.push({
      priority: mismatch.severity === 'critical' ? 'high' : 'medium',
      category: 'routes',
      description: `Route mismatch: Tests expect '${mismatch.expectedRoute}' but app defines ${mismatch.actualRoutes.join(', ')}`,
      fix: mismatch.actualRoutes.length === 1 
        ? `Update test files to use '${mismatch.actualRoutes[0]}' instead of '${mismatch.expectedRoute}'`
        : `Choose correct route from: ${mismatch.actualRoutes.join(', ')} and update tests`,
      files: mismatch.testFiles
    });
  });

  // Content mismatches
  contentResult.mismatches.forEach(mismatch => {
    actionItems.push({
      priority: mismatch.severity === 'critical' ? 'high' : 'medium',
      category: 'content',
      description: `Content assertion failure in ${mismatch.assertion.file}:${mismatch.assertion.line}`,
      fix: mismatch.suggestion || 'Review and update test assertion',
      files: [`tests/e2e/${mismatch.assertion.file}`]
    });
  });

  // CI issues
  ciResult.issues.forEach(issue => {
    actionItems.push({
      priority: issue.severity === 'critical' ? 'high' : 'medium',
      category: 'ci',
      description: issue.description,
      fix: issue.fix
    });
  });

  return actionItems.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

/**
 * Generate recommendations based on validation results
 */
function generateRecommendations(
  routeResult: RouteValidationResult,
  contentResult: ContentValidationResult,
  ciResult: CIValidationResult
): string[] {
  const recommendations: string[] = [];

  // Route recommendations
  if (routeResult.unusedRoutes.length > 0) {
    recommendations.push(`Consider adding tests for unused routes: ${routeResult.unusedRoutes.join(', ')}`);
  }

  if (routeResult.mismatches.length === 0) {
    recommendations.push('✅ All route tests are correctly aligned with app routes');
  }

  // Content recommendations
  if (contentResult.passedAssertions.length > 0) {
    recommendations.push(`✅ ${contentResult.passedAssertions.length} content assertions are passing correctly`);
  }

  if (contentResult.mismatches.length === 0) {
    recommendations.push('✅ All content assertions are correctly aligned with app content');
  }

  // CI recommendations
  recommendations.push(...ciResult.recommendations);

  // Process recommendations
  if (routeResult.mismatches.length === 0 && contentResult.mismatches.length === 0) {
    recommendations.push('🎉 Consider integrating this validation script into CI to prevent future drift');
  }

  if (routeResult.testExpectations.length > 10) {
    recommendations.push('Consider organizing test expectations documentation for better maintainability');
  }

  return recommendations;
}

/**
 * Generate human-readable console output
 */
export function printReport(report: ValidationReport): void {
  const { summary } = report;
  
  console.log('\n' + '='.repeat(80));
  console.log('🔍 TEST-IMPLEMENTATION VALIDATION REPORT');
  console.log('='.repeat(80));
  
  // Summary
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Status: ${getStatusEmoji(summary.overallStatus)} ${summary.overallStatus}`);
  console.log(`   Total Issues: ${summary.totalIssues} (${summary.criticalIssues} critical, ${summary.warningIssues} warnings)`);
  console.log(`   Tests Validated: ${summary.testsValidated}`);
  console.log(`   Routes Validated: ${summary.routesValidated}`);
  console.log(`   Content Assertions: ${summary.contentAssertionsValidated}`);

  // Route Results
  console.log(`\n🛣️  ROUTE VALIDATION:`);
  if (report.routes.mismatches.length === 0) {
    console.log(`   ✅ All ${report.routes.appRoutes.length} routes correctly aligned`);
  } else {
    console.log(`   ❌ ${report.routes.mismatches.length} route mismatches found:`);
    report.routes.mismatches.forEach(mismatch => {
      console.log(`      • Expected: '${mismatch.expectedRoute}' → Actual: ${mismatch.actualRoutes.join(', ')}`);
      console.log(`        Files: ${mismatch.testFiles.join(', ')}`);
    });
  }

  // Content Results
  console.log(`\n📝 CONTENT VALIDATION:`);
  if (report.content.mismatches.length === 0) {
    console.log(`   ✅ All ${report.content.assertions.length} content assertions aligned`);
  } else {
    console.log(`   ❌ ${report.content.mismatches.length} content mismatches found:`);
    report.content.mismatches.forEach(mismatch => {
      console.log(`      • ${mismatch.assertion.file}:${mismatch.assertion.line} - ${mismatch.issue}`);
      if (mismatch.suggestion) {
        console.log(`        Fix: ${mismatch.suggestion}`);
      }
    });
  }

  // CI Results
  console.log(`\n⚙️  CI VALIDATION:`);
  if (report.ci.issues.length === 0) {
    console.log(`   ✅ CI configuration appears healthy`);
  } else {
    console.log(`   ❌ ${report.ci.issues.length} CI issues found:`);
    report.ci.issues.forEach(issue => {
      console.log(`      • ${issue.description}`);
      console.log(`        Fix: ${issue.fix}`);
    });
  }

  // Action Items
  if (report.actionItems.length > 0) {
    console.log(`\n🎯 ACTION ITEMS (${report.actionItems.length}):`);
    report.actionItems.forEach((item, index) => {
      const priority = item.priority.toUpperCase();
      const emoji = item.priority === 'high' ? '🔥' : item.priority === 'medium' ? '⚠️' : 'ℹ️';
      console.log(`   ${index + 1}. ${emoji} [${priority}] ${item.description}`);
      console.log(`      Fix: ${item.fix}`);
      if (item.files && item.files.length > 0) {
        console.log(`      Files: ${item.files.join(', ')}`);
      }
    });
  }

  // Recommendations
  if (report.recommendations.length > 0) {
    console.log(`\n💡 RECOMMENDATIONS:`);
    report.recommendations.forEach(rec => {
      console.log(`   • ${rec}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log(`Validation completed. Status: ${getStatusEmoji(summary.overallStatus)} ${summary.overallStatus}`);
  console.log('='.repeat(80) + '\n');
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case 'PASS': return '✅';
    case 'WARNING': return '⚠️';
    case 'FAIL': return '❌';
    default: return '❓';
  }
}