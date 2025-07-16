import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

// Test wrapper with all required providers
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <HelmetProvider>
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
      fireEvent.click(shareButton);
      
      expect(mockWriteText).toHaveBeenCalledWith('https://example.com/blog/test-article');
    });

    it('shows success toast when clipboard copy succeeds', async () => {
      mockWriteText.mockResolvedValueOnce(undefined);
      
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);
      
      await waitFor(() => {
        expect(screen.getByText('Link copied!')).toBeInTheDocument();
        expect(screen.getByText('Article link copied to clipboard.')).toBeInTheDocument();
      });
    });

    it('shows error toast when clipboard copy fails', async () => {
      mockWriteText.mockRejectedValueOnce(new Error('Clipboard access denied'));
      
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);
      
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
      fireEvent.click(shareButton);
      
      await waitFor(() => {
        expect(mockExecCommand).toHaveBeenCalledWith('copy');
      });
    });

    it('shows success toast when fallback copy succeeds', async () => {
      mockExecCommand.mockReturnValueOnce(true);
      
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);
      
      await waitFor(() => {
        expect(screen.getByText('Link copied!')).toBeInTheDocument();
      });
    });

    it('shows error toast when fallback copy fails', async () => {
      mockExecCommand.mockReturnValueOnce(false);
      
      render(<Article />, { wrapper: TestWrapper });
      
      const shareButton = screen.getByRole('button', { name: /share/i });
      fireEvent.click(shareButton);
      
      await waitFor(() => {
        expect(screen.getByText('Copy failed')).toBeInTheDocument();
      });
    });
  });

  describe('Meta Tag Generation', () => {
    it('generates correct Open Graph meta tags', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      // Check for Open Graph meta tags in document head
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      const ogImage = document.querySelector('meta[property="og:image"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      
      expect(ogTitle?.getAttribute('content')).toBe('Test Article');
      expect(ogDescription?.getAttribute('content')).toBe('Test subtitle for sharing');
      expect(ogImage?.getAttribute('content')).toBe('https://example.com/test-image.jpg');
      expect(ogUrl?.getAttribute('content')).toBe('https://example.com/blog/test-article');
    });

    it('generates correct Twitter meta tags', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      const twitterCard = document.querySelector('meta[name="twitter:card"]');
      
      expect(twitterTitle?.getAttribute('content')).toBe('Test Article');
      expect(twitterDescription?.getAttribute('content')).toBe('Test subtitle for sharing');
      expect(twitterImage?.getAttribute('content')).toBe('https://example.com/test-image.jpg');
      expect(twitterCard?.getAttribute('content')).toBe('summary_large_image');
    });

    it('generates article-specific meta tags', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      const articleAuthor = document.querySelector('meta[property="article:author"]');
      const articlePublished = document.querySelector('meta[property="article:published_time"]');
      const articleTags = document.querySelector('meta[property="article:tag"]');
      
      expect(articleAuthor?.getAttribute('content')).toBe('Test Author');
      expect(articlePublished?.getAttribute('content')).toBe('2024-01-15');
      expect(articleTags?.getAttribute('content')).toBe('test, sharing');
    });
  });

  describe('Default Image Fallback', () => {
    beforeEach(() => {
      // Mock useParams to return article without image
      vi.mocked(vi.importActual('react-router-dom')).useParams = () => ({ 
        slug: 'no-image-article' 
      });
    });

    it('uses default image when post.image is missing', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      const ogImage = document.querySelector('meta[property="og:image"]');
      const twitterImage = document.querySelector('meta[name="twitter:image"]');
      
      expect(ogImage?.getAttribute('content')).toBe('https://example.com/default-share-image.jpg');
      expect(twitterImage?.getAttribute('content')).toBe('https://example.com/default-share-image.jpg');
    });

    it('displays article content correctly even without image', () => {
      render(<Article />, { wrapper: TestWrapper });
      
      expect(screen.getByText('Article Without Image')).toBeInTheDocument();
      expect(screen.getByText('Test article without image')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('handles non-existent article gracefully', () => {
      vi.mocked(vi.importActual('react-router-dom')).useParams = () => ({ 
        slug: 'non-existent-article' 
      });
      
      render(<Article />, { wrapper: TestWrapper });
      
      expect(screen.getByText('Article Not Found')).toBeInTheDocument();
      expect(screen.getByText("The article you're looking for doesn't exist.")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /back to blog/i })).toBeInTheDocument();
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