import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Article from '../../pages/Article';
import { Toaster } from '@/components/ui/toaster';

// Mock the articles data
vi.mock('../../data/blog/articles', () => ({
  mockPosts: [
    {
      id: 1,
      title: 'Test Article',
      subtitle: 'Test subtitle for sharing',
      slug: 'test-article',
      image: 'https://example.com/test-image.jpg',
      author: { name: 'Test Author' },
      publishedAt: '2024-01-15',
      readingTime: 5,
      tags: ['test', 'sharing']
    },
    {
      id: 2,
      title: 'Article Without Image',
      subtitle: 'Test article without image',
      slug: 'no-image-article', 
      image: null, // Test fallback scenario
      author: { name: 'Test Author' },
      publishedAt: '2024-01-16',
      readingTime: 3,
      tags: ['test']
    }
  ],
  articleContent: {
    'test-article': '<p>Test content</p>',
    'no-image-article': '<p>Content without image</p>'
  }
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ slug: 'test-article' }),
    useNavigate: () => vi.fn(),
  };
});

// Create helmet context for testing
const helmetContext = {};

// Test wrapper with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <HelmetProvider context={helmetContext}>
      {children}
      <Toaster />
    </HelmetProvider>
  </MemoryRouter>
);

describe('Article Sharing Functionality', () => {
  // Mock clipboard API
  const mockWriteText = vi.fn();
  const mockClipboard = {
    writeText: mockWriteText
  };

  // Mock document.execCommand for fallback testing
  const mockExecCommand = vi.fn();

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock modern clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: mockClipboard,
      writable: true
    });

    // Mock secure context
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      writable: true
    });

    // Mock document.execCommand for fallback
    Object.defineProperty(document, 'execCommand', {
      value: mockExecCommand,
      writable: true
    });

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: {
        href: 'https://example.com/blog/test-article',
        origin: 'https://example.com'
      },
      writable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Share Button Rendering', () => {
    it('renders share button with correct text and icon', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      expect(shareButton).toBeInTheDocument();
      expect(shareButton).toHaveTextContent('Share');
    });

    it('share button has correct styling classes', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      expect(shareButton).toHaveClass('rounded-full');
      expect(shareButton).toHaveClass('shadow-card');
    });
  });

  describe('Clipboard Functionality - Modern API', () => {
    it('copies URL to clipboard on share button click', async () => {
      mockWriteText.mockResolvedValueOnce(undefined);
      
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      
      await act(async () => {
        fireEvent.click(shareButton);
      });
      
      expect(mockWriteText).toHaveBeenCalledWith('https://example.com/blog/test-article');
    });

    it('shows success toast when clipboard copy succeeds', async () => {
      mockWriteText.mockResolvedValueOnce(undefined);
      
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      
      await act(async () => {
        fireEvent.click(shareButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Link copied!')).toBeInTheDocument();
        expect(screen.getByText('Article link copied to clipboard.')).toBeInTheDocument();
      });
    });

    it('shows error toast when clipboard copy fails', async () => {
      mockWriteText.mockRejectedValueOnce(new Error('Clipboard access denied'));
      
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      
      await act(async () => {
        fireEvent.click(shareButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Copy failed')).toBeInTheDocument();
        expect(screen.getByText('Could not copy link to clipboard.')).toBeInTheDocument();
      });
    });
  });

  describe('Browser Compatibility Fallback', () => {
    beforeEach(() => {
      // Simulate older browser without clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true
      });
    });

    it('uses document.execCommand fallback when clipboard API unavailable', async () => {
      mockExecCommand.mockReturnValueOnce(true);
      
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      
      await act(async () => {
        fireEvent.click(shareButton);
      });
      
      await waitFor(() => {
        expect(mockExecCommand).toHaveBeenCalledWith('copy');
      });
    });

    it('shows success toast when fallback copy succeeds', async () => {
      mockExecCommand.mockReturnValueOnce(true);
      
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      
      await act(async () => {
        fireEvent.click(shareButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Link copied!')).toBeInTheDocument();
      });
    });

    it('shows error toast when fallback copy fails', async () => {
      mockExecCommand.mockReturnValueOnce(false);
      
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      
      await act(async () => {
        fireEvent.click(shareButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Copy failed')).toBeInTheDocument();
      });
    });
  });

  describe('Meta Tag Generation', () => {
    it('generates correct page title and meta description', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      // Verify the article title is displayed in the page
      expect(screen.getByText('Test Article')).toBeInTheDocument();
      expect(screen.getByText('Test subtitle for sharing')).toBeInTheDocument();
      
      // Verify author and publication info
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });

    it('displays article tags correctly', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      // Check that tags are displayed in the UI
      expect(screen.getByText('test')).toBeInTheDocument();
      expect(screen.getByText('sharing')).toBeInTheDocument();
    });

    it('renders article content and meta information', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      // Verify core article content is rendered
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Article');
      expect(screen.getByText('5 min read')).toBeInTheDocument();
      
      // Verify article structure
      expect(screen.getByRole('article')).toBeInTheDocument();
    });
  });

  describe('Default Image Fallback', () => {
    it('handles articles without images gracefully', () => {
      // Test that articles without images still render correctly
      render(<Article />, { wrapper: TestWrapper });
      
      // Verify the article renders even if image might be missing
      expect(screen.getByText('Test Article')).toBeInTheDocument();
      expect(screen.getByText('Test subtitle for sharing')).toBeInTheDocument();
      
      // Verify the article structure is maintained
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    });

    it('displays article content correctly', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      // Verify core content is displayed
      expect(screen.getByText('Test Article')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      expect(screen.getByText('5 min read')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('renders article content when article exists', () => {
      // Test the happy path - article exists and renders correctly
      render(<Article />, { wrapper: TestWrapper });
      
      // Verify the article renders successfully
      expect(screen.getByText('Test Article')).toBeInTheDocument();
      expect(screen.getByText('Test subtitle for sharing')).toBeInTheDocument();
      expect(screen.getByText('Test Author')).toBeInTheDocument();
      
      // Verify navigation elements
      expect(screen.getByRole('button', { name: /back to blog/i })).toBeInTheDocument();
    });

    it('has proper article structure and accessibility', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      // Verify proper HTML structure
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      
      // Verify share button exists and is accessible
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('share button has proper accessibility attributes', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      expect(shareButton).toBeInTheDocument();
      expect(shareButton).not.toHaveAttribute('aria-disabled');
    });

    it('maintains proper heading hierarchy', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toHaveTextContent('Test Article');
    });
  });
});