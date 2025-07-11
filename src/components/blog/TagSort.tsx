import { mockPosts } from '@/data/blog/articles';
import { Button } from '@/components/ui/button';

// Get all unique tags from all articles
const allTags = mockPosts.flatMap(post => post.tags);
const uniqueTags = [...new Set(allTags)]; // All unique tags from all articles

interface TagSortProps {
  onTagClick: (tag: string) => void;
  selectedTags: string[];
}

export const TagSort = ({ onTagClick, selectedTags }: TagSortProps) => {
    return (
        <div>
            {uniqueTags.map((tag) => (
                <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onTagClick(tag)}
                    className="mr-2 flex-shrink-0"
                >
                    {tag}
                </Button>
            ))}
        </div>
    )
}