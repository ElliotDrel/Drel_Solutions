import { Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/types/blog';

interface ArticleCardProps {
  post: BlogPost;
  onAuthorClick: (authorSlug: string) => void;
  onTagClick: (tag: string) => void;
}

export const ArticleCard = ({ post, onAuthorClick, onTagClick }: ArticleCardProps) => {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group bg-gradient-card h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-6 flex-1 flex flex-col space-y-4">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
          
          <h3 className="text-xl font-semibold leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2">
            {post.subtitle}
          </p>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-auto transition-all transform hover:scale-105 hover:shadow-lg"
            onClick={() => onAuthorClick(post.author.slug)}
          >
            <User className="h-3 w-3 mr-1" />
            {post.author.name}
          </Button>
          
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {post.readingTime} min read
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          asChild
          className="w-full bg-brand-primary text-brand-neutral-50 hover:bg-brand-neutral-50 hover:text-brand-primary transition-colors"
        >
          <Link to={`/blog/${post.slug}`}>
            Read Article
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};