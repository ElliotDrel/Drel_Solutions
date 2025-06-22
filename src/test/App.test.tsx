import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from '../pages/Index';
import About from '../pages/About';
import Contact from '../pages/Contact';
import ModelAdvisor from '../pages/ModelAdvisor';
import NotFound from '../pages/NotFound';

// Mock the page components to avoid complexity in routing tests
vi.mock('../pages/Index', () => ({
  default: () => <div data-testid="index-page">Index Page</div>
}));

vi.mock('../pages/About', () => ({
  default: () => <div data-testid="about-page">About Page</div>
}));

vi.mock('../pages/Contact', () => ({
  default: () => <div data-testid="contact-page">Contact Page</div>
}));

vi.mock('../pages/ModelAdvisor', () => ({
  default: () => <div data-testid="modeladvisor-page">Model Advisor Page</div>
}));

vi.mock('../pages/NotFound', () => ({
  default: () => <div data-testid="notfound-page">Not Found Page</div>
}));

// Create a test version of App without BrowserRouter
const TestApp = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/modeladvisor" element={<ModelAdvisor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

// Helper function to render App with routing
const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <TestApp />
    </MemoryRouter>
  );
};

describe('App Routing', () => {
  it('renders Index page at root path', () => {
    renderWithRouter(['/']);
    expect(screen.getByTestId('index-page')).toBeInTheDocument();
  });

  it('renders About page at /about path', () => {
    renderWithRouter(['/about']);
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
  });

  it('renders Contact page at /contact path', () => {
    renderWithRouter(['/contact']);
    expect(screen.getByTestId('contact-page')).toBeInTheDocument();
  });

  it('renders Model Advisor page at /modeladvisor path', () => {
    renderWithRouter(['/modeladvisor']);
    expect(screen.getByTestId('modeladvisor-page')).toBeInTheDocument();
  });

  it('renders Not Found page for unknown routes', () => {
    renderWithRouter(['/unknown-route']);
    expect(screen.getByTestId('notfound-page')).toBeInTheDocument();
  });

  it('handles multiple route changes', () => {
    // Test initial route
    const { unmount } = renderWithRouter(['/']);
    expect(screen.getByTestId('index-page')).toBeInTheDocument();
    unmount();

    // Test about route
    renderWithRouter(['/about']);
    expect(screen.getByTestId('about-page')).toBeInTheDocument();
  });
}); 