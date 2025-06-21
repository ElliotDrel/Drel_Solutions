import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Index from '../../pages/Index';

// Mock react-router-dom Link component
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ children, to, className }: any) => (
      <a href={to} className={className} data-testid="mock-link">
        {children}
      </a>
    ),
  };
});

// Wrapper component for Router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('Index Page', () => {
  it('renders the main heading', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    expect(screen.getByText(/AI Consulting That/i)).toBeInTheDocument();
    expect(screen.getByText(/Pays for Itself/i)).toBeInTheDocument();
  });

  it('displays the navigation with logo', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    const logo = screen.getByAltText('Drel Solutions Logo');
    expect(logo).toBeInTheDocument();
    expect(screen.getByText('Drel Solutions')).toBeInTheDocument();
  });

  it('shows the main call-to-action buttons', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    const ctaButtons = screen.getAllByText(/Start Saving TIME and MONEY!/i);
    expect(ctaButtons).toHaveLength(2); // Hero section + Core values section
  });

  it('displays core values section', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    expect(screen.getByText('Automate Repetitive Tasks')).toBeInTheDocument();
    expect(screen.getByText('Cut Unnecessary Costs')).toBeInTheDocument();
    expect(screen.getByText('Make Smarter Decisions Faster')).toBeInTheDocument();
    expect(screen.getByText('Run Lean, Stay Sharp')).toBeInTheDocument();
  });

  it('toggles mobile menu when menu button is clicked', async () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    // Mobile menu should not be visible initially
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    
    // Find and click the mobile menu button
    const menuButton = screen.getByRole('button');
    fireEvent.click(menuButton);
    
    // Mobile menu items should now be visible
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
    });
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

  it('has proper accessibility attributes', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    // Check for proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    
    // Check for proper navigation
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  it('displays AI dashboard mockup with metrics', () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    expect(screen.getByText('AI Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Cost Savings')).toBeInTheDocument();
    expect(screen.getByText('Time Saved')).toBeInTheDocument();
    expect(screen.getByText('Automations')).toBeInTheDocument();
  });
}); 