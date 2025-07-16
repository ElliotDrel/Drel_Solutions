import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Article from '../../pages/Article';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

// Mock toast
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Article Sharing', () => {
  it('should render share button with correct accessibility attributes', () => {
    renderWithRouter(<Article />);
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    expect(shareButton).toBeInTheDocument();
    expect(shareButton).toHaveAttribute('aria-label');
  });

  it('should handle share button click and copy URL to clipboard', async () => {
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');
    
    renderWithRouter(<Article />);
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalledWith(window.location.href);
    });
  });

  it('should handle clipboard API failures gracefully', async () => {
    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText')
      .mockRejectedValueOnce(new Error('Clipboard access denied'));
    
    renderWithRouter(<Article />);
    
    const shareButton = screen.getByRole('button', { name: /share/i });
    fireEvent.click(shareButton);
    
    await waitFor(() => {
      expect(writeTextSpy).toHaveBeenCalled();
    });
  });
});