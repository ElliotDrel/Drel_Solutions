# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Available Commands (Vercel Deployment Only)

**IMPORTANT**: This project is deployed exclusively on Vercel. No local development is performed.

### Build & Test Commands
- `npm run build` - Build for production (runs in Vercel)
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run test:run` - Run unit tests once
- `npm run test:coverage` - Run unit tests with coverage (80% minimum required)
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:ci` - Run all tests with coverage (used in CI)

### Development Note
- All development and testing happens through Vercel's build system
- Code changes are made locally, then pushed to git for Vercel deployment
- No local servers or backend processes are run

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

### Environment Setup
- **Local Development**: Not performed - all development through Vercel
- **Dependencies**: Managed through Vercel's build system
- **Environment Variables**: Set in Vercel dashboard (OpenAI API key, etc.)
- **Deployment**: Automatic through git push to connected repository

### Environment Variables
- `CONTENT_FAIL_ON_ERROR=true` - Force build failure on content processing errors (default: false)
- `NODE_ENV=production` - Production environment detection
- `CI=true` - CI environment detection (auto-set by most CI systems)
- `VITEST=true` - Excludes content processor during testing (auto-set by Vitest)

## Important Notes

### Model Documentation System
- Comprehensive model specs for Anthropic, Google, and OpenAI models
- Documentation is loaded by OpenAI service to make intelligent recommendations
- Models include capabilities, pricing, speed, accuracy characteristics

### Deployment & Development Workflow

**CRITICAL**: This project runs EXCLUSIVELY on Vercel. No local development environment exists.

#### Development Process:
1. **Code Changes**: Made locally and committed to git
2. **Testing**: All testing happens in Vercel's build pipeline
3. **Deployment**: Automatic on git push to main branch
4. **Preview**: Automatic preview deployments for feature branches

#### Build Log Requests:
When requesting build/test logs from the user:
- **Specify clearly**: Whether you need logs regardless of build outcome OR only on failure
- **Example**: "Please push to git and send me the Vercel build logs regardless of success/failure"
- **Example**: "Please push to git and send me the Vercel build logs only if the build fails"

#### Key Points:
- **No Local Backend**: All API functionality runs as Vercel serverless functions
- **No Local Testing**: All tests run in Vercel's CI/CD pipeline
- **Build Command**: `npm run test:run && npm run build` (includes tests)
- **Monitoring**: Vercel Speed Insights and Analytics integrated
- **Environment**: All environment variables managed in Vercel dashboard

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