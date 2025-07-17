import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// This test monitors the CODEOWNERS file to ensure it exists and contains @ElliotDrel
// When adding new owners to CODEOWNERS, these tests will still pass as long as @ElliotDrel remains
// The CODEOWNERS file itself contains additional guidance for editors

const CODEOWNERS_PATH = join(process.cwd(), '.github', 'CODEOWNERS');

describe('CODEOWNERS Tests', () => {
  it('should have CODEOWNERS file in .github directory', () => {
    expect(existsSync(CODEOWNERS_PATH)).toBe(true);
  });

  it('should have @ElliotDrel as owner', () => {
    const content = readFileSync(CODEOWNERS_PATH, 'utf8');
    expect(content).toContain('@ElliotDrel');
  });
});