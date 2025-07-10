import { ArticleCard } from './ArticleCard';
import { BlogPost } from '@/types/blog';

interface RecommendedArticlesProps {
  currentPostId: string;
  posts: BlogPost[];
  onAuthorClick: (authorSlug: string) => void;
  onTagClick: (tag: string) => void;
}

export const RecommendedArticles = ({ 
  currentPostId, 
  posts, 
  onAuthorClick, 
  onTagClick 
}: RecommendedArticlesProps) => {
  // Get 3 random articles excluding the current one
  const recommendedPosts = posts
    .filter(post => post.id !== currentPostId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Recommended Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendedPosts.map((post) => (
          <ArticleCard
            key={post.id}
            post={post}
            onAuthorClick={onAuthorClick}
            onTagClick={onTagClick}
          />
        ))}
      </div>
    </div>
  );
};