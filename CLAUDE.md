# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Frontend Development
- `npm run dev` - Start Vite development server (port 6756)
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend Development
- `npm run start:backend` - Start Python FastAPI backend (cd backend && python main.py)
- `npm run start:full` - Start both frontend and backend concurrently

### Testing Commands
- `npm run test` - Run Vitest unit tests in watch mode
- `npm run test:ui` - Run Vitest with UI
- `npm run test:run` - Run unit tests once
- `npm run test:coverage` - Run unit tests with coverage (80% minimum required)
- `npm run test:e2e` - Run Playwright end-to-end tests
- `npm run test:e2e:ui` - Run Playwright with UI
- `npm run test:all` - Run both unit and e2e tests
- `npm run test:ci` - Run all tests with coverage (used in CI)
- `npm run test -- <filename>` - Run specific unit test file
- `npx playwright test <filename>` - Run specific e2e test file

### Backend Commands
```bash
cd backend && python main.py  # Start FastAPI server on port 3298
```

## Architecture Overview

### Frontend Architecture
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with Shadcn UI components
- **Routing**: React Router DOM with client-side routing
- **State Management**: TanStack Query for server state, React hooks for local state
- **Forms**: React Hook Form with Zod validation
- **Testing**: Vitest + React Testing Library (unit), Playwright (e2e)

### Backend Architecture
- **Framework**: FastAPI (Python)
- **Main Service**: Model recommendation API using OpenAI
- **Port**: Backend runs on port 3298
- **API Endpoint**: `/api/model_search` - takes query, returns model recommendations
- **Model Documentation**: Extensive collection of AI model specs in `model_docs/` and `public/model_docs/`

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

### Backend (`backend/`)
- `main.py` - FastAPI app with CORS, model search endpoint
- `services/openai_service.py` - OpenAI integration service
- `requirements.txt` - Python dependencies

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
- Backend API base URL varies by environment
- Model search request format: `{ query: string }`
- Response format: `{ recommendations: ModelRecommendation[] }`

### Testing Requirements
- **Unit Tests**: 80% coverage minimum (branches, functions, lines, statements)
- **E2E Tests**: Critical user journeys tested with Playwright
- **Test on**: Chromium, Firefox (CI only), Mobile Chrome
- **CI**: Tests must pass for deployment

### Environment Setup
- Node.js 18+
- Python backend dependencies in `backend/requirements.txt`
- OpenAI API key required in `.env` file
- Development server runs on port 6756
- Backend runs on port 3298

## Important Notes

### Model Documentation System
- Comprehensive model specs for Anthropic, Google, and OpenAI models
- Documentation is loaded by OpenAI service to make intelligent recommendations
- Models include capabilities, pricing, speed, accuracy characteristics

### Deployment
- Vercel integration with Speed Insights and Analytics
- Build command includes test run: `npm run test:run && npm run build`
- Only tested code reaches production

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