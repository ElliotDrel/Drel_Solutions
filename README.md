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

## Configuration

Configure your API keys for the various AI providers in your environment variables:

```bash
ANTHROPIC_API_KEY=your_anthropic_key
GOOGLE_API_KEY=your_google_key
OPENAI_API_KEY=your_openai_key
```

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
