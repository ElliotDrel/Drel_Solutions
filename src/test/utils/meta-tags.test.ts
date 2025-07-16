import { describe, it, expect } from 'vitest';

// Helper functions for meta tag generation (these would be imported from actual utility files)
const generateOpenGraphTags = (title: string, description: string, image?: string) => {
  return {
    'og:title': title,
    'og:description': description,
    'og:image': image || '/default-share-image.jpg',
    'og:type': 'article',
    'og:site_name': 'Drel Solutions'
  };
};

const generateTwitterTags = (title: string, description: string, image?: string) => {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image || '/default-share-image.jpg'
  };
};

const generateArticleTags = (author: string, publishedTime: string, tags: string[]) => {
  return {
    'article:author': author,
    'article:published_time': publishedTime,
    'article:tag': tags.join(', ')
  };
};

describe('Meta Tag Generation', () => {
  describe('Open Graph Tags', () => {
    it('should generate correct Open Graph tags with custom image', () => {
      const tags = generateOpenGraphTags(
        'Test Article',
        'Test description',
        '/custom-image.jpg'
      );

      expect(tags['og:title']).toBe('Test Article');
      expect(tags['og:description']).toBe('Test description');
      expect(tags['og:image']).toBe('/custom-image.jpg');
      expect(tags['og:type']).toBe('article');
      expect(tags['og:site_name']).toBe('Drel Solutions');
    });

    it('should use default image when no custom image provided', () => {
      const tags = generateOpenGraphTags('Test Article', 'Test description');

      expect(tags['og:image']).toBe('/default-share-image.jpg');
    });
  });

  describe('Twitter Tags', () => {
    it('should generate correct Twitter tags', () => {
      const tags = generateTwitterTags(
        'Test Article',
        'Test description',
        '/custom-image.jpg'
      );

      expect(tags['twitter:card']).toBe('summary_large_image');
      expect(tags['twitter:title']).toBe('Test Article');
      expect(tags['twitter:description']).toBe('Test description');
      expect(tags['twitter:image']).toBe('/custom-image.jpg');
    });

    it('should use default image for Twitter when none provided', () => {
      const tags = generateTwitterTags('Test Article', 'Test description');

      expect(tags['twitter:image']).toBe('/default-share-image.jpg');
    });
  });

  describe('Article Tags', () => {
    it('should generate correct article-specific meta tags', () => {
      const tags = generateArticleTags(
        'John Doe',
        '2024-01-01T00:00:00Z',
        ['technology', 'productivity']
      );

      expect(tags['article:author']).toBe('John Doe');
      expect(tags['article:published_time']).toBe('2024-01-01T00:00:00Z');
      expect(tags['article:tag']).toBe('technology, productivity');
    });

    it('should handle single tag correctly', () => {
      const tags = generateArticleTags(
        'Jane Smith',
        '2024-01-01T00:00:00Z',
        ['technology']
      );

      expect(tags['article:tag']).toBe('technology');
    });

    it('should handle empty tags array', () => {
      const tags = generateArticleTags(
        'Jane Smith',
        '2024-01-01T00:00:00Z',
        []
      );

      expect(tags['article:tag']).toBe('');
    });
  });
});