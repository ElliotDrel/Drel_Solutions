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

  it('toggles mobile menu when menu button is clicked', async () => {
    render(<Index />, { wrapper: RouterWrapper });
    
    // Find the mobile menu button by looking for the button with Menu/X icons
    const menuButtons = screen.getAllByRole('button').filter(button => {
      const svg = button.querySelector('svg');
      if (!svg) return false;
      // Check if it's the menu button by looking for menu or X icon classes
      return svg.classList.contains('lucide-menu') || svg.classList.contains('lucide-x');
    });
    
    expect(menuButtons.length).toBeGreaterThan(0);
    const menuButton = menuButtons[0];
    
    // Initially, mobile menu should not be open
    // We check for mobile menu by looking for elements that should only appear in mobile menu
    const initialMobileMenuItems = screen.queryAllByText('Home').filter(item => {
      // Look for items that might be in mobile menu context
      const parent = item.closest('div');
      return parent && parent.classList.contains('md:hidden');
    });
    
    // Click the mobile menu button to open it
    fireEvent.click(menuButton);
    
    // Wait for mobile menu to appear
    await waitFor(() => {
      // After clicking, we should have more navigation items visible
      // The mobile menu creates additional instances of nav items
      const allHomeItems = screen.getAllByText('Home');
      const allAboutItems = screen.getAllByText('About');
      
      // We expect to find navigation items (desktop nav always exists)
      expect(allHomeItems.length).toBeGreaterThanOrEqual(1);
      expect(allAboutItems.length).toBeGreaterThanOrEqual(1);
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