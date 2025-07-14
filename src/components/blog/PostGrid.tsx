import { ArticleCard } from './ArticleCard';
import { BlogPost } from '@/types/blog';

interface PostGridProps {
  posts: BlogPost[];
  onAuthorClick: (authorSlug: string) => void;
  onTagClick: (tag: string) => void;
}

export const PostGrid = ({ 
  posts, 
  onAuthorClick, 
  onTagClick 
}: PostGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-0 pt-0">
      {posts.map((post) => (
        <ArticleCard
          key={post.id}
          post={post}
          onAuthorClick={onAuthorClick}
          onTagClick={onTagClick}
        />
      ))}
    </div>
  );
};