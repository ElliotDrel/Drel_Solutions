import { Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BlogPost } from '@/types/blog';

interface FeaturedPostProps {
  post: BlogPost;
  onAuthorClick: (authorSlug: string) => void;
  onTagClick: (tag: string) => void;
}

export const FeaturedPost = ({ post, onAuthorClick, onTagClick }: FeaturedPostProps) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="block group"
      aria-label={`Read blog post: ${post.title}`}
    >
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
                  <button
                    key={tag}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors rounded-md"
                    onClick={() => onTagClick(tag)}
                    type="button"
                  >
                    <Badge variant="secondary">{tag}</Badge>
                  </button>
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
              <button
                className="flex items-center gap-1 hover:underline cursor-pointer bg-transparent border-none p-0 text-muted-foreground text-sm"
                onClick={() => onAuthorClick(post.author.slug)}
                type="button"
              >
                <User className="h-4 w-4 mr-1" />
                {post.author.name}
              </button>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {post.readingTime} min read
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
};