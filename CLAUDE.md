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

### When to Request Build Logs
**Always ask for build logs when:**
- Adding new dependencies or imports
- Modifying TypeScript interfaces or types
- Changing API endpoints or data structures
- Adding new components or pages
- Modifying routing logic
- Making changes to configuration files
- Any changes that could break functionality

**Build logs not needed for:**
- Simple CSS/styling changes
- Text content updates
- Minor UI adjustments
- Documentation updates

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
- `pages/` - Route components (Index, ModelAdvisor, About, Contact, Blog, Article, NotFound)
- `components/ui/` - Shadcn UI components (Button, Dialog, etc.)
- `components/blog/` - Blog-specific components (BlogHero, PostGrid, etc.)
- `hooks/` - Custom React hooks (use-toast, use-mobile)
- `lib/` - Utilities (utils.ts with cn helper)
- `data/blog/` - Blog data and mock content
- `types/` - TypeScript type definitions
- `test/` - Unit test files

### API (`api/`)
- Serverless functions for Vercel deployment
- `model_search.py` - Model search endpoint implementation
- OpenAI service integration for model recommendations
- **Note**: No traditional backend structure - uses Vercel serverless functions

### Documentation
- `model_docs/` - Source model documentation files
- `public/model_docs/` - Public model documentation files
- `TESTING.md` - Comprehensive testing guide

### Configuration Files
- `vite.config.ts` - Vite config with path aliases (@/ for src/), test setup
- `playwright.config.ts` - E2E test configuration
- `package.json` - Dependencies and scripts
- `tailwind.config.ts` - Tailwind configuration
- `components.json` - Shadcn UI configuration
- `.cursor/rules/` - Extensive Cursor IDE rules for development standards

## Development Workflow

### Adding New Routes
1. Create page component in `src/pages/`
2. Add route in `App.tsx` using React Router
3. Add navigation links if needed

### API Integration
- Use TanStack Query for data fetching
- API routes handled by Vercel serverless functions
- Model search request format: `{ query: string }`
- Response format: `{ recommendations: ModelRecommendation[] }`
- **Note**: All API calls go through Vercel's serverless function endpoints

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

### Code Standards
- TypeScript strict mode
- ESLint configuration enforced
- Shadcn UI components preferred
- React 18 patterns with hooks
- Path alias `@/` for `src/` directory
- Extensive Cursor IDE rules in `.cursor/rules/` covering React, testing, security, and more
- React Router DOM for client-side routing
- Lazy loading with ErrorBoundary for performance optimization

### Blog System
- Blog pages use lazy loading for performance
- Mock blog data in `src/data/blog/articles.ts`
- Blog components in `src/components/blog/`
- Routes: `/blog` (listing) and `/blog/:slug` (individual articles)
- TypeScript interfaces defined in `src/types/blog.ts`

### CRITICAL: Content Processing Build Failure Policy
**DO NOT MODIFY**: The content processor is configured to fail builds when articles fail to load. This is intentional and must be preserved.

- **Location**: `src/lib/build/content-processor.ts`
- **Behavior**: Build MUST fail if any article processing fails
- **Reasoning**: If an article fails to load, there is a problem with the file that needs immediate attention
- **Policy**: The website should NOT deploy with broken articles - all articles must load successfully
- **Never Change**: Do not add fallback mechanisms, error suppression, or continue-on-error logic to article processing
- **Current State**: Production CI automatically fails on content processing errors (line 173 in content-processor.ts)

If you encounter article loading issues, fix the underlying problem in the source files, never modify the failure behavior.

### Design System & Styling
- **Background Strategy**: All pages use hardcoded light backgrounds for consistent brand experience
- **Page Container Pattern**: `bg-gradient-to-br from-blue-50 via-white to-green-50` for main page containers
- **Theme Toggle**: Available but intentionally does NOT affect page backgrounds - only affects UI components
- **Reasoning**: Brand consistency takes precedence over system theme preferences
- **Implementation**: All `src/pages/*.tsx` files use the same gradient background pattern
- **Components**: Use Shadcn UI components which do respond to theme toggle for buttons, cards, etc.

---

## Vercel Build & Deployment Reference

*The following commands and processes are handled automatically by Vercel. This information is included for reference only.*

### Build Commands (Vercel Only)
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run test:run` - Run unit tests once
- `npm run test:coverage` - Run unit tests with coverage (80% minimum required)
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:ci` - Run all tests with coverage (used in CI)

### Environment Variables (Vercel Dashboard)
- `CONTENT_FAIL_ON_ERROR=true` - Force build failure on content processing errors (default: false)
- `NODE_ENV=production` - Production environment detection
- `CI=true` - CI environment detection (auto-set by most CI systems)
- `VITEST=true` - Excludes content processor during testing (auto-set by Vitest)

### Vercel Deployment Process
1. **Testing**: All tests run in Vercel's CI/CD pipeline
2. **Building**: `npm run test:run && npm run build` (includes tests)
3. **Deployment**: Automatic on git push to main branch
4. **Preview**: Automatic preview deployments for feature branches
5. **Monitoring**: Vercel Speed Insights and Analytics integrated
6. **Environment**: All environment variables managed in Vercel dashboard