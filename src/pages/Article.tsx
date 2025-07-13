import { useParams, useNavigate } from 'react-router-dom';
import { Clock, User, ArrowLeft, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BlogPost } from '@/types/blog';
import { RecommendedArticles } from '@/components/blog/RecommendedArticles';
import { StayUpdatedSection } from '@/components/blog/StayUpdatedSection';
import { ArticleProgress } from '@/components/blog/ArticleProgress';
import { useToast } from '@/hooks/use-toast';
import { mockPosts, articleContent } from '@/data/blog/articles';

const Article = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuthorFilter = (authorSlug: string) => {
    navigate(`/blog?author=${authorSlug}`);
  };

  const handleTagFilter = (tag: string) => {
    navigate(`/blog?tag=${tag}`);
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

  // Find the post by slug
  const post = mockPosts.find(p => p.slug === slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Article Not Found</h1>
          <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  const content = articleContent[slug!] || '<p>Content coming soon...</p>';

  return (
    <div className="flex">
      <div className="w-80 p-4">
        <ArticleProgress content={content} />
      </div>
      <div id="article-content" className="max-h-screen bg-background mx-auto overflow-auto scrollbar-hide">
        <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
        </div>

        {/* Article Header */}
        <article className="space-y-8">
          <header className="space-y-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {post.title}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.subtitle}
            </p>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author.name}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readingTime} min read
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover"
              loading="eager"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              className="article-content space-y-6 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          {/* Author Card */}
          <Card className="mt-12 bg-background">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold text-lg">
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{post.author.name}</h3>
                  <p className="text-muted-foreground">
                    Expert in workflow optimization and process automation. Helping businesses 
                    streamline operations and improve efficiency through systematic approaches 
                    and smart technology integration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Stay Updated Section */}
          <div className="mt-16 space-y-12">
            <StayUpdatedSection onSignup={handleNewsletterSignup} />
            
            {/* Recommended Articles */}
            <RecommendedArticles
              currentPostId={post.id}
              posts={mockPosts}
              onAuthorClick={handleAuthorFilter}
              onTagClick={handleTagFilter}
            />
          </div>

          {/* Back to Top Navigation */}
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/blog')}
              size="lg"
              className="shadow-card hover:shadow-card-hover"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Articles
            </Button>
          </div>
        </article>
      </div>
    </div>
    </div>
  );
};

export default Article;