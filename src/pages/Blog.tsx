import { useState } from 'react';
import { BlogHero } from '@/components/blog/BlogHero';
import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { PostGrid } from '@/components/blog/PostGrid';
import { BrowseControls } from '@/components/blog/BrowseControls';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { BlogPost } from '@/types/blog';
import { mockPosts } from '@/data/blog/articles';
import { TagSort } from '@/components/blog/TagSort';


const Blog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'date' | 'topic' | 'author'>('date');
  const { toast } = useToast();

  const postsPerPage = 9;
  const featuredPost = mockPosts[0];
  
  // Filter posts
  let filteredPosts = mockPosts.slice(1); // Exclude featured post
  
  if (selectedAuthor) {
    filteredPosts = filteredPosts.filter(post => post.author.slug === selectedAuthor);
  }
  
  if (selectedTags.length > 0) {
    filteredPosts = filteredPosts.filter(post =>
      selectedTags.every(tag=>post.tags.includes(tag))
    );
  }
  // Sort posts
  if (sortBy === 'date') {
    filteredPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }
  else if (sortBy === 'topic') {
    filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
  }
  else if (sortBy === 'author') {
    filteredPosts.sort((a, b) => a.author.name.localeCompare(b.author.name));
  }

  // Paginate posts
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const displayedPosts = filteredPosts.slice(0, currentPage * postsPerPage);

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
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag) // Remove if already selected
        : [...prev, tag]              // Add if not selected
    );
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

  return (
    <div className="min-h-screen bg-background">
      {/* Page Shell */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Hero Header */}
        <BlogHero />

        {/* Featured Post Banner */}
        <FeaturedPost 
          post={featuredPost}
          onAuthorClick={handleAuthorFilter}
          onTagClick={handleTagFilter}
        />

        {/* Browse Controls */}
        <BrowseControls
          sortBy={sortBy}
          onSortChange={setSortBy}
          selectedAuthor={selectedAuthor}
          selectedTags={selectedTags}
          onTagClick={handleTagFilter}
          onClearFilters={() => {
            setSelectedAuthor(null);
            setSelectedTags([]);
            setCurrentPage(1);
          }}
        />

        {/* Tag Sort Menu */}

        <TagSort onTagClick={handleTagFilter} selectedTags={selectedTags} />

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