# 🧪 Testing Guide

This project uses a comprehensive testing strategy combining **Vitest** for unit/integration tests and **Playwright** for end-to-end testing, fully integrated with Vercel's CI/CD pipeline.

## 📋 Testing Strategy Overview

### 🔬 Unit & Integration Tests (Vitest + React Testing Library)
- **Purpose**: Test individual components, hooks, and utilities
- **Location**: `src/test/`
- **Coverage**: 80% minimum coverage required
- **Framework**: Vitest with React Testing Library

### 🌐 End-to-End Tests (Playwright)
- **Purpose**: Test complete user journeys and workflows
- **Location**: `tests/e2e/`
- **Coverage**: Critical user paths and cross-browser compatibility
- **Framework**: Playwright with multiple browsers

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
# Run unit tests
npm run test

# Run unit tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e

# Run both unit and e2e tests
npm run test:all
```

### Interactive Testing
```bash
# Unit tests with UI
npm run test:ui

# E2E tests with UI
npm run test:e2e:ui
```

## 📁 Project Structure

```
├── src/
│   ├── test/
│   │   ├── setup.ts              # Test configuration
│   │   ├── App.test.tsx          # App routing tests
│   │   └── pages/
│   │       └── Index.test.tsx    # Page component tests
├── tests/
│   └── e2e/
│       ├── homepage.spec.ts      # Homepage functionality
│       └── navigation.spec.ts    # Navigation between pages
├── playwright.config.ts          # Playwright configuration
├── vite.config.ts               # Vite + Vitest configuration
└── .github/workflows/test.yml   # CI/CD pipeline
```

## 🛠️ Configuration Files

### Vitest Configuration (`vite.config.ts`)
- **Environment**: jsdom for DOM testing
- **Globals**: true (no need to import test functions)
- **Coverage**: v8 provider with 80% thresholds
- **Setup**: Automatic cleanup and mocks

### Playwright Configuration (`playwright.config.ts`)
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Base URL**: Auto-detects local dev server
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: On failure only
- **Videos**: Retained on failure

## 🔄 CI/CD Integration

### GitHub Actions Workflow
The testing pipeline runs on:
- **Push to main/develop**: Full test suite
- **Pull Requests**: Tests + preview deployment testing
- **Manual triggers**: Full test suite

### Vercel Integration
- **Build Command**: `npm run test:run && npm run build`
- **Deployment**: Only proceeds if tests pass
- **Preview Testing**: E2E tests run against preview URLs

## 📊 Coverage Requirements

| Metric | Minimum | Current |
|--------|---------|---------|
| Branches | 80% | TBD |
| Functions | 80% | TBD |
| Lines | 80% | TBD |
| Statements | 80% | TBD |

## 🧪 Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('user can complete main workflow', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.getByText('Main Heading')).toBeVisible();
  
  await page.getByRole('button', { name: 'CTA Button' }).click();
  await page.waitForURL('/contact');
  
  await expect(page.url()).toContain('/contact');
});
```

## 🐛 Debugging Tests

### Unit Tests
```bash
# Run specific test file
npm run test -- Index.test.tsx

# Run tests in watch mode
npm run test

# Debug with UI
npm run test:ui
```

### E2E Tests
```bash
# Run specific test
npx playwright test homepage.spec.ts

# Run with browser UI
npm run test:e2e:ui

# Debug mode
npx playwright test --debug
```

## 📈 Test Reports

### Coverage Reports
- **HTML**: `coverage/index.html`
- **Text**: Console output
- **JSON**: `coverage/coverage-summary.json`

### Playwright Reports
- **HTML**: `playwright-report/index.html`
- **Screenshots**: `test-results/`
- **Videos**: `test-results/`

## 🔧 Troubleshooting

### Common Issues

1. **Tests failing locally but passing in CI**
   - Check Node.js version (should be 20+)
   - Clear `node_modules` and reinstall
   - Check environment variables

2. **Playwright browser installation issues**
   ```bash
   npx playwright install --with-deps
   ```

3. **Coverage thresholds not met**
   - Add more tests for uncovered code
   - Update coverage configuration if needed

4. **E2E tests timing out**
   - Increase timeout in `playwright.config.ts`
   - Add explicit waits for dynamic content

### Environment Variables

Set these in your Vercel dashboard:
- `CI=true` (automatically set)
- Add any additional environment variables your app needs

## 🎯 Best Practices

### Unit Tests
- ✅ Test component behavior, not implementation
- ✅ Use meaningful test descriptions
- ✅ Mock external dependencies
- ✅ Test edge cases and error states
- ❌ Don't test third-party library functionality

### E2E Tests
- ✅ Test critical user journeys
- ✅ Use data-testid for reliable element selection
- ✅ Test responsive behavior
- ✅ Verify cross-browser compatibility
- ❌ Don't test every possible user interaction

### General
- ✅ Keep tests fast and focused
- ✅ Use descriptive names and comments
- ✅ Maintain test independence
- ✅ Update tests when requirements change
- ❌ Don't ignore failing tests

## 🚀 Production Deployment

When you push to the `main` branch:
1. GitHub Actions runs all tests
2. If tests pass, Vercel begins deployment
3. Vercel runs `npm run test:run && npm run build`
4. If all tests pass, deployment completes
5. If any test fails, deployment is cancelled

This ensures that only tested, working code reaches production! 🎉 