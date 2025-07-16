# Validation Script Implementation Plan
*Created: 2025-07-16*

## NEXT TASK: Create Test-Implementation Validation Script

### Detailed Implementation Plan

Based on strategic analysis, creating comprehensive validation script to:
1. **Discover ALL test-implementation mismatches** (not just the 2 we know about)
2. **Verify CI pipeline functionality** (ensure test failures actually block)
3. **Create reusable tooling** for future drift prevention
4. **Generate actionable reports** for systematic fixes

## Implementation Steps

### Step 1: Route Validation Component
**Purpose**: Compare test route expectations with actual app routes

**Implementation**:
```typescript
// Extract routes from src/App.tsx
const extractAppRoutes = () => {
  // Parse App.tsx to find all <Route path="..." /> declarations
  // Return: { path: string, component: string }[]
}

// Extract route expectations from e2e tests  
const extractTestRoutes = () => {
  // Parse all tests/e2e/*.spec.ts files
  // Find: page.goto('/...'), expect(page).toHaveURL(/\/.../)
  // Return: { file: string, line: number, expectedRoute: string }[]
}

// Compare and report mismatches
const validateRoutes = () => {
  // Cross-reference app routes vs test expectations
  // Report: mismatches, missing routes, unused routes
}
```

### Step 2: Content Validation Component
**Purpose**: Compare test content assertions with actual DOM content

**Implementation**:
```typescript
// Extract content assertions from tests
const extractContentAssertions = () => {
  // Find: expect(page.locator('h1')).toContainText('...')
  // Find: expect(page.locator('[data-testid="..."]')).toContainText('...')
  // Return: { file: string, line: number, selector: string, expectedText: string }[]
}

// Extract actual DOM content (requires browser automation)
const extractActualContent = async () => {
  // Use Playwright to visit each route
  // Extract text content for common selectors (h1, h2, nav elements, etc.)
  // Return: { route: string, selector: string, actualText: string }[]
}

// Compare and report mismatches
const validateContent = () => {
  // Cross-reference expected vs actual content
  // Report: text mismatches, missing elements, changed selectors
}
```

### Step 3: CI Environment Validation
**Purpose**: Verify that test failures actually block deployment

**Implementation**:
```typescript
// Create intentional test failure
const createTestFailure = () => {
  // Generate temporary test that always fails
  // Run in CI-like environment
  // Verify it properly blocks pipeline
}

// Test different failure scenarios
const validateCIBlocking = () => {
  // Test: unit test failures
  // Test: e2e test failures  
  // Test: linting failures
  // Verify: each properly blocks deployment
}
```

### Step 4: Integrated Validation Script
**Purpose**: Combine all components into comprehensive tool

**Implementation**:
```typescript
// Main validation orchestrator
const runValidation = async () => {
  console.log('🔍 Starting Test-Implementation Validation...');
  
  // Route validation
  const routeReport = await validateRoutes();
  
  // Content validation  
  const contentReport = await validateContent();
  
  // CI validation
  const ciReport = await validateCIBlocking();
  
  // Generate comprehensive report
  generateReport({ routeReport, contentReport, ciReport });
}
```

## Technical Decisions

### File Structure
```
scripts/
  validate-test-alignment.ts          # Main script
  validation/
    route-validator.ts                # Route validation logic
    content-validator.ts              # Content validation logic  
    ci-validator.ts                   # CI environment validation
    report-generator.ts               # Report generation
```

### Dependencies
- **@playwright/test**: For browser automation and DOM content extraction
- **typescript**: For type safety in validation logic
- **fs/path**: For file system operations and parsing
- **chalk**: For colored console output

### Package.json Integration
```json
{
  "scripts": {
    "validate:test-alignment": "tsx scripts/validate-test-alignment.ts",
    "validate:routes": "tsx scripts/validate-test-alignment.ts --routes-only", 
    "validate:content": "tsx scripts/validate-test-alignment.ts --content-only",
    "validate:ci": "tsx scripts/validate-test-alignment.ts --ci-only"
  }
}
```

## Success Criteria

### Immediate Goals
- [ ] Script identifies known route mismatch (`/model-advisor` vs `/modeladvisor`)
- [ ] Script identifies known content mismatch (H1 text)
- [ ] Script discovers any additional mismatches we haven't found
- [ ] Script generates actionable report for systematic fixes

### Advanced Goals  
- [ ] Script can verify CI environment blocks test failures properly
- [ ] Script is fast enough for CI integration (<30 seconds)
- [ ] Script provides specific line numbers and fix suggestions
- [ ] Script can be run with granular options (routes-only, content-only, etc.)

## Implementation Priority

**START WITH**: Route validation component
- **Why**: Most straightforward to implement
- **Why**: Addresses known critical issue immediately  
- **Why**: Provides foundation for other components
- **Why**: Can be tested and validated quickly

**NEXT**: Content validation component
**THEN**: CI environment validation
**FINALLY**: Integration and comprehensive reporting

---

*This detailed plan guides the step-by-step implementation of the validation script.*