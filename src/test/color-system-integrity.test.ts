/**
 * ⚠️ CRITICAL WARNING TO DEVELOPERS ⚠️
 * 
 * DO NOT MODIFY OR DISABLE THIS TEST WITHOUT EXPLICIT APPROVAL
 * 
 * This test is SUPER IMPORTANT to the full integrity of the entire website.
 * 
 * WHY THIS TEST EXISTS:
 * - The entire application uses ONE set of core brand color variables
 * - ALL colors are connected through CSS custom properties (--brand-primary, --brand-neutral-*, etc.)
 * - If even ONE file strays from this system, it will cause visual inconsistencies
 * - We migrated 153+ hardcoded colors to achieve perfect brand consistency
 * - This test prevents regressions that would break the unified color system
 * 
 * WHAT HAPPENS IF YOU BYPASS THIS TEST:
 * - Visual inconsistencies across the application
 * - Broken brand color flexibility
 * - Inability to change brand colors globally
 * - Maintenance nightmares for future developers
 * 
 * IF YOU THINK THIS TEST SHOULD BE CHANGED:
 * 1. First, ask yourself: "Is there really no way to use brand colors instead?"
 * 2. Check with the senior developer or project owner first
 * 3. Document WHY the hardcoded color is absolutely necessary
 * 4. Consider if the brand color system needs to be extended instead
 * 
 * REMEMBER: One hardcoded color can break the entire system's integrity!
 * 
 * Last updated: 2025-01-14
 * Color System Consolidation Project - Phase 5
 */

import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

describe('Color System Integrity Tests', () => {
  const getAllSourceFiles = (dir: string, extensions: string[] = ['.tsx', '.ts', '.jsx', '.js']): string[] => {
    const files: string[] = [];
    
    const traverse = (currentDir: string) => {
      const items = readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = join(currentDir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules, dist, build directories
          if (!['node_modules', 'dist', 'build', '.git'].includes(item)) {
            traverse(fullPath);
          }
        } else if (extensions.some(ext => item.endsWith(ext))) {
          files.push(fullPath);
        }
      }
    };
    
    traverse(dir);
    return files;
  };

  it('should have ZERO hardcoded Tailwind colors in the entire codebase', () => {
    const srcDir = join(process.cwd(), 'src');
    const sourceFiles = getAllSourceFiles(srcDir);
    
    // Common Tailwind color names that should NOT be hardcoded
    const forbiddenColors = [
      'slate', 'gray', 'zinc', 'neutral', 'stone',
      'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 
      'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'
    ];
    
    // Allowed color keywords (these are fine to use)
    const allowedColors = ['black', 'white', 'transparent', 'current', 'inherit'];
    
    const violations: Array<{file: string, line: number, content: string, pattern: string, suggestion: string}> = [];
    
    sourceFiles.forEach(file => {
      const content = readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Skip lines that are comments or contain brand- colors (these are correct)
        if (line.trim().startsWith('//') || line.trim().startsWith('*') || line.includes('brand-')) {
          return;
        }
        
        // Check for hardcoded color patterns
        forbiddenColors.forEach(color => {
          const patterns = [
            { 
              regex: new RegExp(`\\b(bg|text|border|from|to|via|ring|outline|decoration|divide|placeholder|caret|accent|fill|stroke|shadow)-${color}-[0-9]`, 'g'),
              type: 'tailwind-color'
            },
            {
              regex: new RegExp(`\\b(hover|focus|active|disabled|group-hover|group-focus):(bg|text|border|from|to|via|ring|outline|decoration|divide|placeholder|caret|accent|fill|stroke|shadow)-${color}-[0-9]`, 'g'),
              type: 'tailwind-state-color'
            }
          ];
          
          patterns.forEach(({regex, type}) => {
            const matches = line.match(regex);
            if (matches) {
              matches.forEach(match => {
                // Generate suggestion based on color
                let suggestion = '';
                switch (color) {
                  case 'blue':
                    suggestion = match.replace(/-blue-[0-9]+/, '-brand-primary');
                    break;
                  case 'green':
                    suggestion = match.replace(/-green-[0-9]+/, '-brand-success');
                    break;
                  case 'red':
                    suggestion = match.replace(/-red-[0-9]+/, '-brand-danger');
                    break;
                  case 'yellow':
                  case 'amber':
                    suggestion = match.replace(new RegExp(`-${color}-[0-9]+`), '-brand-warning');
                    break;
                  case 'purple':
                  case 'violet':
                    suggestion = match.replace(new RegExp(`-${color}-[0-9]+`), '-brand-accent');
                    break;
                  case 'gray':
                  case 'slate':
                  case 'zinc':
                  case 'neutral':
                  case 'stone': {
                    const numberMatch = match.match(/-[0-9]+/);
                    if (numberMatch) {
                      suggestion = match.replace(new RegExp(`-${color}-[0-9]+`), `-brand-neutral${numberMatch[0]}`);
                    }
                    break;
                  }
                  default:
                    suggestion = `Check brand color system for ${color} equivalent`;
                }
                
                violations.push({
                  file: file.replace(process.cwd(), ''),
                  line: index + 1,
                  content: line.trim(),
                  pattern: match,
                  suggestion: suggestion
                });
              });
            }
          });
        });
      });
    });
    
    // If violations found, create detailed error message
    if (violations.length > 0) {
      let errorMessage = `\n🚨 HARDCODED COLOR VIOLATIONS DETECTED! 🚨\n\n`;
      errorMessage += `Found ${violations.length} hardcoded color(s) that violate the brand color system:\n\n`;
      
      violations.forEach((violation, index) => {
        errorMessage += `${index + 1}. File: ${violation.file}:${violation.line}\n`;
        errorMessage += `   ❌ Found: ${violation.pattern}\n`;
        errorMessage += `   ✅ Use: ${violation.suggestion}\n`;
        errorMessage += `   Code: ${violation.content}\n\n`;
      });
      
      errorMessage += `💡 BRAND COLOR SYSTEM REFERENCE:\n`;
      errorMessage += `   Primary: bg-brand-primary, text-brand-primary, border-brand-primary\n`;
      errorMessage += `   Success: bg-brand-success, text-brand-success, border-brand-success\n`;
      errorMessage += `   Warning: bg-brand-warning, text-brand-warning, border-brand-warning\n`;
      errorMessage += `   Danger: bg-brand-danger, text-brand-danger, border-brand-danger\n`;
      errorMessage += `   Accent: bg-brand-accent, text-brand-accent, border-brand-accent\n`;
      errorMessage += `   Neutrals: bg-brand-neutral-50 through bg-brand-neutral-900\n\n`;
      errorMessage += `🔧 Need help? Check the brand color system documentation or ask senior dev.\n`;
      errorMessage += `⚠️ Remember: Even ONE hardcoded color breaks the entire system!\n`;
      
      throw new Error(errorMessage);
    }
    
    // If we get here, no violations found
    console.log('✅ Color system integrity verified - no hardcoded colors detected!');
    expect(violations.length).toBe(0);
  });

  it('should ensure all brand colors are properly defined in CSS', () => {
    const indexCssPath = join(process.cwd(), 'src', 'index.css');
    const cssContent = readFileSync(indexCssPath, 'utf8');
    
    // Required brand color variables
    const requiredBrandColors = [
      '--brand-primary',
      '--brand-secondary', 
      '--brand-accent',
      '--brand-success',
      '--brand-warning',
      '--brand-danger',
      '--brand-info',
      '--brand-neutral-50',
      '--brand-neutral-100',
      '--brand-neutral-200',
      '--brand-neutral-300',
      '--brand-neutral-400',
      '--brand-neutral-500',
      '--brand-neutral-600',
      '--brand-neutral-700',
      '--brand-neutral-800',
      '--brand-neutral-900'
    ];
    
    const missingColors = requiredBrandColors.filter(color => 
      !cssContent.includes(color)
    );
    
    if (missingColors.length > 0) {
      throw new Error(`Missing required brand color variables: ${missingColors.join(', ')}`);
    }
    
    expect(missingColors.length).toBe(0);
  });

  it('should verify Tailwind config includes brand colors', () => {
    const tailwindConfigPath = join(process.cwd(), 'tailwind.config.ts');
    const configContent = readFileSync(tailwindConfigPath, 'utf8');
    
    // Check that brand colors are configured
    const requiredBrandConfig = [
      'brand',
      'brand-primary',
      'brand-neutral'
    ];
    
    const missingConfig = requiredBrandConfig.filter(config => 
      !configContent.includes(config)
    );
    
    if (missingConfig.length > 0) {
      throw new Error(`Missing brand color configuration in Tailwind config: ${missingConfig.join(', ')}`);
    }
    
    expect(missingConfig.length).toBe(0);
  });
});