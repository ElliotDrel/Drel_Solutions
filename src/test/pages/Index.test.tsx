import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '../../pages/Index';

// Mock react-router-dom Link component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to, className }: { children: React.ReactNode; to: string; className?: string }) => (
      <a href={to} className={className} data-testid="mock-link">
        {children}
      </a>
    ),
  };
});

// Wrapper component for Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

describe('Index Page', () => {
  it('renders the main heading', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    expect(screen.getByText(/AI Consulting That/i)).toBeInTheDocument();
    expect(screen.getByText(/Pays for Itself/i)).toBeInTheDocument();
  });

  it('displays the navigation with logo', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    // Use getAllByAltText since there are multiple logos (nav and footer)
    const logos = screen.getAllByAltText('Drel Solutions Logo');
    expect(logos.length).toBeGreaterThanOrEqual(1);
    expect(logos[0]).toBeInTheDocument();
    
    // Use getAllByText since there are multiple instances (nav and footer)
    const brandTexts = screen.getAllByText('Drel Solutions');
    expect(brandTexts.length).toBeGreaterThanOrEqual(1);
    expect(brandTexts[0]).toBeInTheDocument();
  });

  it('shows the main call-to-action buttons', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    const ctaButtons = screen.getAllByText(/Start Saving TIME and MONEY!/i);
    // Ensure at least one CTA button exists, but allow for multiple
    expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
    
    // Verify the first CTA button is clickable
    expect(ctaButtons[0]).toBeInTheDocument();
    expect(ctaButtons[0].closest('a, button')).toBeInTheDocument();
  });

  it('displays core values section', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    expect(screen.getByText('Automate Repetitive Tasks')).toBeInTheDocument();
    expect(screen.getByText('Cut Unnecessary Costs')).toBeInTheDocument();
    expect(screen.getByText('Make Smarter Decisions Faster')).toBeInTheDocument();
    expect(screen.getByText('Run Lean, Stay Sharp')).toBeInTheDocument();
  });

  it('displays stats section with animated counters', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    expect(screen.getByText('Real Impact. Measured in Time and Money.')).toBeInTheDocument();
    expect(screen.getByText('Saved over')).toBeInTheDocument();
    expect(screen.getByText('Freed up more than')).toBeInTheDocument();
  });

  it('shows footer with copyright information', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    expect(screen.getByText(/© 2024 Drel Solutions. All rights reserved./)).toBeInTheDocument();
  });

  it('displays AI dashboard mockup with metrics', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    expect(screen.getByText('AI Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Cost Savings')).toBeInTheDocument();
    expect(screen.getByText('Time Saved')).toBeInTheDocument();
    expect(screen.getByText('Automations')).toBeInTheDocument();
  });
}); 