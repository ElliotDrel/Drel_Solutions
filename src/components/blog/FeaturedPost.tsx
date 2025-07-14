import { Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';

interface FeaturedPostProps {
  post: BlogPost;
  onAuthorClick: (authorSlug: string) => void;
  onTagClick: (tag: string) => void;
}

export const FeaturedPost = ({ post, onAuthorClick, onTagClick }: FeaturedPostProps) => {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 bg-gradient-card">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-full object-cover"
            loading="eager"
          />
        </div>
        <CardContent className="md:w-1/2 p-8 flex flex-col justify-center space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => onTagClick(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <h2 className="text-3xl font-bold leading-tight">
              {post.title}
            </h2>
            <p className="text-lg text-muted-foreground">
              {post.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto transition-all transform hover:scale-105 hover:shadow-lg"
              onClick={() => onAuthorClick(post.author.slug)}
            >
              <User className="h-4 w-4 mr-1" />
              {post.author.name}
            </Button>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readingTime} min read
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="w-fit shadow-card hover:shadow-card-hover bg-brand-primary text-brand-neutral-50 hover:bg-brand-neutral-50 hover:text-brand-primary transition-colors"
          >
            <Link to={`/blog/${post.slug}`}>
              Read Article
            </Link>
          </Button>
        </CardContent>
      </div>
    </Card>
  );
};