# AI Model Advisor

A comprehensive tool for comparing and selecting AI models from multiple providers including Anthropic, Google, and OpenAI.

## Features

- **Multi-Provider Support**: Compare models from Anthropic, Google, and OpenAI
- **Interactive Interface**: User-friendly interface for model selection and comparison
- **Detailed Documentation**: Comprehensive documentation for each model provider
- **Custom Prompts**: Built-in prompt management system
- **Backend Services**: Robust backend for handling API interactions

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/drel-solutions/modeladvisor.git
cd modeladvisor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Building for Production

To create a production build:

```bash
npm run build
```

## Project Structure

```
├── backend/              # Backend services and database
├── model_docs/           # Documentation for each AI provider
├── src/                  # Frontend components and services
└── public/               # Static assets
```

## Centralized Navigation & Layout

The application uses a centralized navigation bar and layout wrapper for consistent headers and navigation across all pages:

- **Navigation**: Implemented in `src/components/ui/Navigation.tsx`, this component provides a consistent header, navigation links, and a responsive mobile menu. The Blog link opens the Drel Solutions Substack in a new tab.
- **Layout**: All pages are wrapped in `src/components/Layout.tsx`, which embeds the Navigation component and ensures a unified structure.
- **/blog Redirect**: The `/blog` route triggers an external redirect to [https://drelsolutions.substack.com/](https://drelsolutions.substack.com/) using a dedicated `ExternalRedirect` component in the router.

### Example Usage

```tsx
// src/App.tsx
<Route path="/" element={<Layout><Index /></Layout>} />
<Route path="/about" element={<Layout><About /></Layout>} />
<Route path="/blog" element={<ExternalRedirect to="https://drelsolutions.substack.com/" />} />
```

## Testing

- **Unit Tests**: Located in `src/test/`, using Vitest and React Testing Library. Tests cover navigation rendering, accessibility roles, mobile menu toggling, and external link attributes.
- **E2E Tests**: Located in `tests/e2e/`, using Playwright. Tests verify navigation consistency and the /blog redirect in a real browser environment.
- **Run all tests**:
  ```bash
  npm run test:run      # Run all unit tests once
  npm run test:e2e      # Run Playwright E2E tests
  npm run test:all      # Run all tests (unit + e2e)
  ```

## Configuration

Configure your API keys for the various AI providers in your environment variables:

```bash
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
OPENAI_API_KEY=your_openai_key

# Backend Security (required for FastAPI backend)
API_KEY=your_backend_api_key              # Required for backend authentication
ALLOWED_ORIGINS=http://localhost:3000     # Comma-separated list of allowed origins for CORS
```

## Backend Security & Compliance

The backend FastAPI service now includes:
- **API Key Authentication**: All sensitive endpoints require an API key via the Authorization header.
- **Secure CORS**: Allowed origins are controlled via the ALLOWED_ORIGINS environment variable.
- **Rate Limiting**: Expensive endpoints are rate-limited to prevent abuse.
- **Robust Input Validation**: All user input is validated and sanitized.
- **Environment Variable Validation**: On startup, the backend checks for all required environment variables using `backend/config.py`.

**Required Environment Variables:**
```bash
OPENAI_API_KEY=your_openai_api_key
API_KEY=your_backend_api_key
ALLOWED_ORIGINS=http://localhost:3000
```

For full security and API guidelines, see:
- `.cursor/rules/security-audit.mdc`
- `.cursor/rules/fastapi.mdc`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions and support, please contact Drel Solutions.
