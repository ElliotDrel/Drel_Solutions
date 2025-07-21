# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Workflow

**CRITICAL**: This project runs EXCLUSIVELY on Vercel. DO NOT attempt local development, installs, or builds.

### Your Role
- Edit code files only
- Never run `npm install`, `npm run build`, or any other commands
- Code changes are made locally only
- All building, testing, and deployment happens on Vercel and Github
- **Ask for build logs** when changes could impact functionality

### Development Process
1. **Code Changes**: Edit files as requested
2. **Verification**: Request Vercel build logs for complex changes (see "When to Request Build Logs" below)
3. **Vercel Handles**: All building, testing, and deployment automatically

### Package Management
**IMPORTANT**: When package.json is modified:
- **Yarn is preferred** over npm for this project (better Windows compatibility)
- If npm fails with corrupted tarballs or missing optional dependencies:
  1. Delete `package-lock.json` and `node_modules`
  2. Use `yarn install` instead

#### Testing Commands
```bash
# Run unit tests with coverage
npm test

# Run unit tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e

# Run all tests
npm run test:all

# Build project locally
npm run build

# Run dev server for manual testing
npm run dev

# Run linting
npm run lint

# Run type checking
npm run type-check
```

#### Test Coverage Requirements
- **Minimum 80% coverage** (branches, functions, lines, statements)
- **Unit tests required** for all new components, hooks, utilities
- **E2E tests required** for new pages and critical user flows
- Tests must pass locally before requesting Vercel logs

### When to Request Vercel Build Logs
**Only request Vercel build logs AFTER local testing passes and when:**
- Deploying new features that integrate with Vercel serverless functions
- Making changes that could affect production environment specifically
- Verifying edge cases that only occur in production environment
- Final deployment validation after all local tests pass

**Local testing should catch:**
- TypeScript errors and build failures
- Unit and E2E test failures
- Linting and formatting issues
- Basic functionality and integration issues
- Coverage requirements

### Test Creation Requirements
**ALWAYS create tests when adding:**
- New React components (unit tests)
- New pages or routes (E2E tests)
- New utility functions (unit tests)
- New hooks (unit tests)
- New API integrations (integration tests)
- New features or functionality (both unit and E2E tests)

**Test files must be placed in:**
- Unit tests: `src/test/` or co-located with components
- E2E tests: `playwright/` directory
- Test utilities: `src/test/utils/`

**Important Note for Test Directory:**
- **In test folder, always use 'npm install' not 'npm ci' or code will break**

## Architecture Overview

### Frontend Architecture
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with Shadcn UI components
- **Routing**: React Router DOM with client-side routing
- **State Management**: TanStack Query for server state, React hooks for local state
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest + React Testing Library (unit), Playwright (e2e)

### Backend Architecture (Vercel Serverless)
- **Framework**: Vercel Serverless Functions (no traditional backend)
- **Main Service**: Model recommendation API using OpenAI (deployed as serverless function)
- **API Endpoint**: `/api/model_search` - takes query, returns model recommendations
- **Model Documentation**: Extensive collection of AI model specs in `model_docs/` and `public/model_docs/`
- **Note**: No local backend development - all API functionality runs on Vercel

### Key Application Flow
1. User submits query on ModelAdvisor page
2. Frontend sends request to `/api/model_search`
3. Backend OpenAI service processes query with all model documentation
4. Returns top 5 model recommendations with explanations
5. Frontend displays recommendations with why/when/rationale

## Project Structure

### Frontend (`src/`)
- `pages/` - Route components (Index, ModelAdvisor, About, Contact, NotFound)
- `components/ui/` - Shadcn UI components (Button, Dialog, etc.)
- `hooks/` - Custom React hooks (use-toast, use-mobile)
- `lib/` - Utilities (utils.ts with cn helper)
- `test/` - Unit test files

### API (`api/`)
- Serverless functions for Vercel deployment
- `model_search.py` - Model search endpoint implementation
- OpenAI service integration for model recommendations
- **Note**: No traditional backend structure - uses Vercel serverless functions

### Testing Requirements
- **Unit Tests**: 80% coverage minimum (branches, functions, lines, statements)
- **E2E Tests**: Critical user journeys tested with Playwright
- **Test on**: Chromium, Firefox (CI only), Mobile Chrome
- **CI**: Tests must pass for deployment

### Configuration Files
- `vite.config.ts` - Vite config with path aliases (@/ for src/), test setup
- `playwright.config.ts` - E2E test configuration
- `package.json` - Dependencies and scripts
- `tailwind.config.ts` - Tailwind configuration
- `components.json` - Shadcn UI configuration
- `.cursor/rules/` - Extensive  rules for development standards. Make sure to follow these rules.

### Testing Requirements
- **Unit Tests**: 80% coverage minimum (branches, functions, lines, statements)
- **E2E Tests**: Critical user journeys tested with Playwright
- **Test on**: Chromium, Firefox (CI only), Mobile Chrome
- **CI**: Tests must pass for deployment

## Important Notes

### Model Documentation System
- Comprehensive model specs for Anthropic, Google, and OpenAI models
- Documentation is loaded by OpenAI service to make intelligent recommendations
- Models include capabilities, pricing, speed, accuracy characteristics

### Deployment
- Vercel integration with Speed Insights and Analytics
- Only tested code reaches production

### Code Standards
- TypeScript strict mode
- ESLint configuration enforced
- Shadcn UI components preferred
- React 18 patterns with hooks
- Path alias `@/` for `src/` directory

## Brand Color System (CRITICAL)

**IMPORTANT**: This project uses a unified brand color system. NEVER use hardcoded Tailwind colors.

### Core Rules
1. **NEVER use hardcoded Tailwind colors** (bg-blue-600, text-gray-700, etc.)
2. **ALWAYS use brand color classes** (bg-brand-primary, text-brand-neutral-700, etc.)
3. **Automated protection** prevents hardcoded colors from being deployed

### Available Brand Colors

#### Core Brand Colors
```css
bg-brand-primary     /* Main brand blue */
bg-brand-secondary   /* Secondary brand color */
bg-brand-accent      /* Purple accent color */
bg-brand-success     /* Green success color */
bg-brand-warning     /* Orange warning color */
bg-brand-danger      /* Red danger color */
bg-brand-info        /* Blue info color */
```

#### Neutral Scale (50-900)
```css
bg-brand-neutral-50   /* Lightest backgrounds */
bg-brand-neutral-100  /* Light backgrounds */
bg-brand-neutral-200  /* Borders, dividers */
bg-brand-neutral-300  /* Disabled states */
bg-brand-neutral-400  /* Placeholders */
bg-brand-neutral-500  /* Secondary text */
bg-brand-neutral-600  /* Primary text */
bg-brand-neutral-700  /* Headings */
bg-brand-neutral-800  /* Emphasized text */
bg-brand-neutral-900  /* Highest contrast */
```

#### Provider-Specific Colors
```css
bg-provider-openai    /* Green (maps to brand-success) */
bg-provider-anthropic /* Purple (maps to brand-accent) */
bg-provider-google    /* Blue (maps to brand-primary) */
bg-provider-default   /* Gray (maps to brand-neutral-500) */
```

### Usage Examples

#### ❌ WRONG (Hardcoded Colors)
```css
bg-blue-600 text-gray-700 border-green-500 hover:bg-red-600
```

#### ✅ CORRECT (Brand Colors)
```css
bg-brand-primary text-brand-neutral-700 border-brand-success hover:bg-brand-danger
```

### Common Patterns

#### Text Colors
- **Headings**: `text-brand-neutral-700` or `text-brand-neutral-800`
- **Body text**: `text-brand-neutral-600`
- **Secondary text**: `text-brand-neutral-500`
- **Muted text**: `text-brand-neutral-400`

#### Background Colors
- **Primary actions**: `bg-brand-primary text-brand-neutral-50`
- **Light backgrounds**: `bg-brand-neutral-50` or `bg-brand-neutral-100`
- **Card backgrounds**: `bg-card` (automatically maps to brand colors)

#### Borders
- **Standard borders**: `border-brand-neutral-200`
- **Emphasized borders**: `border-brand-neutral-300`

### Provider Color Utilities
Use utility functions from `src/lib/colors.ts`:
```typescript
getProviderBgClass(provider)      // Returns 'bg-provider-openai'
getProviderTextClass(provider)    // Returns 'text-provider-openai'
getProviderBorderClass(provider)  // Returns 'border-provider-openai'
```

### Automated Protection
- **Color integrity test** at `src/test/color-system-integrity.test.ts`
- **Runs automatically** in CI/CD pipeline
- **Blocks deployment** if hardcoded colors are detected
- **Provides exact suggestions** for brand color replacements

### Single Source of Truth
All colors are defined in `src/index.css` as CSS custom properties. Changing base brand colors automatically updates the entire application.

## .scratchpad Usage Guide

### Purpose
The `.scratchpad/` folder serves as Claude Code's thinking space for:
- Planning complex tasks
- Breaking down problems  
- Leaving notes between sessions
- Reasoning through solutions
- Documenting investigation findings

### When to Use
- **Complex multi-step tasks**: Break down implementation plans
- **Code investigations**: Document findings while exploring codebase
- **Problem solving**: Work through logic before implementing
- **Session continuity**: Leave notes for future reference
- **Planning**: Organize thoughts before starting work

### How to Use
1. **Organize by Specific Task, Project, or Topic:**
   - For related scratchpad files, create a subfolder inside `.scratchpad/` named after the specific task, project, or topic (e.g., `.scratchpad/model-advisor-color-refactor/`, `.scratchpad/model-advisor-search-bugfix/`, `.scratchpad/blog-tag-filter/`).
   - Avoid using broad feature names (like just `model-advisor/`). Instead, use granular, descriptive folder names that reflect the exact focus of the work.
   - Place all related scratchpad files for that specific task, project, or topic inside the corresponding subfolder.
   - **All scratchpad files must be placed inside a subfolder—do not place any files in the root of `.scratchpad/`.**
2. **File Naming:**
   - Use date/time prefix and descriptive names (e.g., `07-14-25_14.30_task_analysis.md`, `07-14-25_14.45_investigation_notes.md`).
   - Format: `MM-DD-YY_HH.MM_descriptive_name.extension`
3. **Markdown Structure:**
   - Use markdown for structure and readability
   - Include timestamps for context within content
   - Reference specific files/functions with `file:line` format
   - Update files as understanding, thinking and planning evolves

#### Example Structure
```
.scratchpad/
  model-advisor-color-refactor/
    07-14-25_14.30_color_migration_plan.md
    07-14-25_15.00_color_refactor_notes.md
  model-advisor-search-bugfix/
    07-14-25_16.00_search_bug_investigation.md
  blog-tag-filter/
    07-14-25_17.00_tag_filter_design.md
```

### File Types
- `*.md` - Main documentation and plans
- `*.txt` - Quick notes and logs
- `*.json` - Structured data if needed

### Best Practices
- Keep files focused on single topics, tasks, or projects
- **Group related files into subfolders by specific task, project, or topic—not just broad features**
- **Do not place any files in the root of `.scratchpad/`; every file must be inside a subfolder**
- Use clear, descriptive folder and file names
- Include context and rationale
- Update TodoWrite tool alongside scratchpad usage
- Clean up outdated files and folders periodically

*Note: The .scratchpad folder is for Claude Code's working memory and should now use subfolders for better organization of related work, with a focus on specificity and granularity. All files must be inside a subfolder.*