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
1. Create files with date/time prefix and descriptive names (e.g., `07-14-25_14.30_task_analysis.md`, `07-14-25_14.45_investigation_notes.md`)
2. Use format: `MM-DD-YY_HH.MM_descriptive_name.extension`
3. Use markdown for structure and readability
4. Include timestamps for context within content
5. Reference specific files/functions with `file:line` format
6. Update files as understanding, thinking and planning evolves

### File Types
- `*.md` - Main documentation and plans
- `*.txt` - Quick notes and logs
- `*.json` - Structured data if needed

### Best Practices
- Keep files focused on single topics
- Use clear, descriptive filenames
- Include context and rationale
- Update TodoWrite tool alongside scratchpad usage
- Clean up outdated files periodically

*Note: The .scratchpad folder is for Claude Code's working memory*