import { useState, useEffect } from 'react';
import { BlogHero } from '@/components/blog/BlogHero';
import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { PostGrid } from '@/components/blog/PostGrid';
import { BrowseControls } from '@/components/blog/BrowseControls';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/types/blog';
import { BlogLoader } from '@/lib/content/blog-loader';


const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'topic'>('date');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPost, setFeaturedPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const postsPerPage = 9;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        
        // Get featured posts
        const featured = await BlogLoader.getFeaturedPosts(1);
        const featuredPost = featured.length > 0 ? featured[0] : null;
        
        // Get all posts with filters
        const allPosts = await BlogLoader.getAllPosts({
          filter: (post) => {
            let include = true;
            if (selectedAuthor) {
              include = include && post.author.slug === selectedAuthor;
            }
            if (selectedTag) {
              include = include && post.tags.includes(selectedTag);
            }
            return include;
          },
          sort: sortBy === 'date' ? 'date' : 'title'
        });

        setFeaturedPost(featuredPost);
        setPosts(allPosts.filter(post => post.slug !== featuredPost?.slug)); // Exclude featured post
        setLoading(false);
      } catch (error) {
        console.error('Error loading posts:', error);
        setLoading(false);
      }
    };

    loadPosts();
  }, [selectedAuthor, selectedTag, sortBy]);

  // Paginate posts
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const displayedPosts = posts.slice(0, currentPage * postsPerPage);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleAuthorFilter = (authorSlug: string) => {
    setSelectedAuthor(selectedAuthor === authorSlug ? null : authorSlug);
    setCurrentPage(1);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(selectedTag === tag ? null : tag);
    setCurrentPage(1);
  };

  const handleNewsletterSignup = async (email: string) => {
    try {
      // In production, this would call your API
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        toast({
          title: "Success!",
          description: "You've been subscribed to our newsletter.",
        });
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "default",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
          <BlogHero />
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Page Shell */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Header */}
        <BlogHero />

        {/* Featured Post Banner */}
        {featuredPost && (
          <FeaturedPost 
            post={featuredPost}
            onAuthorClick={handleAuthorFilter}
            onTagClick={handleTagFilter}
          />
        )}

        {/* Browse Controls */}
        <BrowseControls
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedAuthor={selectedAuthor}
          selectedTag={selectedTag}
          onClearFilters={() => {
            setSelectedAuthor(null);
            setSelectedTag(null);
            setCurrentPage(1);
          }}
        />

        {/* Post Grid */}
        <PostGrid
          posts={displayedPosts}
          onAuthorClick={handleAuthorFilter}
          onTagClick={handleTagFilter}
        />

        {/* Pagination */}
        {currentPage < totalPages && (
          <div className="flex justify-center">
            <Button 
              onClick={handleLoadMore}
              variant="outline"
              size="lg"
              className="shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              Load More Articles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;