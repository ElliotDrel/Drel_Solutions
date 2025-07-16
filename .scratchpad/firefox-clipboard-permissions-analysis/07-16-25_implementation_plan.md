# Firefox Clipboard Permissions - Implementation Plan

**Date:** July 16, 2025  
**Status:** Ready for Implementation

## Solution Overview

Implement browser-specific clipboard permission granting to fix Firefox E2E test failures.

## Root Cause Analysis

1. **Firefox Issue**: `grantPermissions(['clipboard-read', 'clipboard-write'])` fails in Firefox
2. **Browser Support**: Only Chromium supports these permissions in Playwright
3. **Impact**: All Firefox E2E tests fail before even reaching the actual test logic

## Implementation Strategy

### Option 1: Browser-Specific Permission Granting (RECOMMENDED)
- Check browser name before granting permissions
- Only grant clipboard permissions for Chromium
- Allow Firefox/WebKit to run without explicit permission grants

### Option 2: Try-Catch Approach
- Wrap permission grants in try-catch blocks
- Log when permissions aren't supported
- Continue test execution regardless

## Code Changes Required

### File: `tests/e2e/article-sharing.spec.ts`

#### Change 1: Update beforeEach hook (lines 58-61)
```typescript
// BEFORE
test.beforeEach(async ({ context }) => {
  // Grant clipboard permissions for all tests
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
});

// AFTER (Option 1 - Browser-specific)
test.beforeEach(async ({ context, browserName }) => {
  // Only grant clipboard permissions for Chromium browsers
  if (browserName === 'chromium') {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  }
});

// AFTER (Option 2 - Try-catch)
test.beforeEach(async ({ context }) => {
  try {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  } catch (error) {
    // Firefox and WebKit don't support clipboard permissions
    console.log('Clipboard permissions not supported in this browser');
  }
});
```

#### Change 2: Update checkClipboardContains method (lines 39-41)
```typescript
// BEFORE
async checkClipboardContains(expectedUrl: string) {
  // Grant clipboard permissions
  await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  
  // ... rest of method
}

// AFTER (Option 1 - Browser-specific)
async checkClipboardContains(expectedUrl: string) {
  // Grant clipboard permissions only for Chromium
  const browserName = this.page.context().browser()?.browserType().name();
  if (browserName === 'chromium') {
    await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  }
  
  // ... rest of method
}

// AFTER (Option 2 - Try-catch)
async checkClipboardContains(expectedUrl: string) {
  try {
    await this.page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  } catch (error) {
    // Firefox and WebKit don't support clipboard permissions
    console.log('Clipboard permissions not supported in this browser');
  }
  
  // ... rest of method
}
```

## Recommendation

**Use Option 1 (Browser-specific)** because:
1. More explicit and clear about browser differences
2. Avoids unnecessary try-catch overhead
3. Better debugging when issues occur
4. Follows Playwright best practices

## Testing Plan

1. **Chromium Tests**: Should continue working as before
2. **Firefox Tests**: Should now pass the permission grant step
3. **Mobile Chrome**: Should continue working (uses Chromium engine)
4. **Clipboard Functionality**: Should work in all browsers (Firefox doesn't need explicit permissions)

## Browser Compatibility Notes

- **Chromium**: Requires explicit permission grants
- **Firefox**: Clipboard API works without explicit permissions
- **WebKit/Safari**: Clipboard API works without explicit permissions
- **Mobile Chrome**: Uses Chromium engine, requires permissions

## Implementation Priority

**HIGH** - This blocks Firefox CI tests from running successfully.

## Files to Modify

1. `tests/e2e/article-sharing.spec.ts` - Primary fix location
2. Document solution in this scratchpad for future reference