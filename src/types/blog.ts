export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  author: {
    name: string;
    slug: string;
  };
  readingTime: number;
  tags: string[];
  publishedAt: string;
  slug: string;
}

export interface BlogPostContent {
  slug: string;
  content: string;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}

export interface BlogFilters {
  author?: string;
  tag?: string;
  sortBy: 'date' | 'topic';
}

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  postsPerPage: number;
}