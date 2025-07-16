import fs from 'fs';
import path from 'path';

export interface AppRoute {
  path: string;
  component: string;
  line: number;
}

export interface TestRouteExpectation {
  file: string;
  line: number;
  expectedRoute: string;
  type: 'goto' | 'expectURL';
  context: string;
}

export interface RouteValidationResult {
  appRoutes: AppRoute[];
  testExpectations: TestRouteExpectation[];
  mismatches: {
    expectedRoute: string;
    actualRoutes: string[];
    testFiles: string[];
    severity: 'critical' | 'warning';
  }[];
  unusedRoutes: string[];
  undocumentedExpectations: string[];
}

/**
 * Extract all routes defined in the React app
 */
export function extractAppRoutes(): AppRoute[] {
  const appPath = path.join(process.cwd(), 'src/App.tsx');
  
  if (!fs.existsSync(appPath)) {
    throw new Error(`App.tsx not found at ${appPath}`);
  }

  const content = fs.readFileSync(appPath, 'utf-8');
  const lines = content.split('\n');
  const routes: AppRoute[] = [];

  lines.forEach((line, index) => {
    // Match <Route path="..." element={<Component />} />
    const routeMatch = line.match(/<Route\s+path="([^"]+)"\s+element={<(\w+)[^>]*>?\s*\/?>?\s*}?\s*\/?>?/);
    if (routeMatch) {
      routes.push({
        path: routeMatch[1],
        component: routeMatch[2],
        line: index + 1
      });
    }
  });

  return routes;
}

/**
 * Extract all route expectations from e2e test files
 */
export function extractTestRouteExpectations(): TestRouteExpectation[] {
  const testsDir = path.join(process.cwd(), 'tests/e2e');
  
  if (!fs.existsSync(testsDir)) {
    throw new Error(`E2E tests directory not found at ${testsDir}`);
  }

  const testFiles = fs.readdirSync(testsDir).filter(file => file.endsWith('.spec.ts'));
  const expectations: TestRouteExpectation[] = [];

  testFiles.forEach(file => {
    const filePath = path.join(testsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      // Match page.goto('/path')
      const gotoMatch = line.match(/page\.goto\(['"`]([^'"`]+)['"`]\)/);
      if (gotoMatch) {
        expectations.push({
          file,
          line: index + 1,
          expectedRoute: gotoMatch[1],
          type: 'goto',
          context: line.trim()
        });
      }

      // Match expect(page).toHaveURL(/\/path/)
      const urlMatch = line.match(/expect\(page\)\.toHaveURL\(\/([^\/]+)\/\)/);
      if (urlMatch) {
        // Convert regex pattern back to route
        const route = '/' + urlMatch[1];
        expectations.push({
          file,
          line: index + 1,
          expectedRoute: route,
          type: 'expectURL',
          context: line.trim()
        });
      }

      // Match expect(page).toHaveURL('/exact-path')
      const exactUrlMatch = line.match(/expect\(page\)\.toHaveURL\(['"`]([^'"`]+)['"`]\)/);
      if (exactUrlMatch) {
        expectations.push({
          file,
          line: index + 1,
          expectedRoute: exactUrlMatch[1],
          type: 'expectURL',
          context: line.trim()
        });
      }
    });
  });

  return expectations;
}

/**
 * Validate routes and find mismatches
 */
export function validateRoutes(): RouteValidationResult {
  const appRoutes = extractAppRoutes();
  const testExpectations = extractTestRouteExpectations();

  const appRoutePaths = appRoutes.map(r => r.path);
  const testRoutePaths = [...new Set(testExpectations.map(e => e.expectedRoute))];

  const mismatches: RouteValidationResult['mismatches'] = [];
  const unusedRoutes: string[] = [];
  const undocumentedExpectations: string[] = [];

  // Find routes expected by tests but not defined in app
  testRoutePaths.forEach(testRoute => {
    if (!appRoutePaths.includes(testRoute)) {
      const similarRoutes = appRoutePaths.filter(appRoute => 
        appRoute.toLowerCase().replace(/[-_]/g, '') === 
        testRoute.toLowerCase().replace(/[-_]/g, '')
      );

      const testFiles = testExpectations
        .filter(e => e.expectedRoute === testRoute)
        .map(e => `${e.file}:${e.line}`);

      mismatches.push({
        expectedRoute: testRoute,
        actualRoutes: similarRoutes.length > 0 ? similarRoutes : appRoutePaths,
        testFiles,
        severity: similarRoutes.length > 0 ? 'critical' : 'warning'
      });
    }
  });

  // Find app routes not tested
  appRoutePaths.forEach(appRoute => {
    if (!testRoutePaths.includes(appRoute) && appRoute !== '*') {
      unusedRoutes.push(appRoute);
    }
  });

  // Find test expectations that don't match any app route
  testRoutePaths.forEach(testRoute => {
    if (!appRoutePaths.includes(testRoute)) {
      undocumentedExpectations.push(testRoute);
    }
  });

  return {
    appRoutes,
    testExpectations,
    mismatches,
    unusedRoutes,
    undocumentedExpectations
  };
}