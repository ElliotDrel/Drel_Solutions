import { mockPosts } from '@/data/blog/articles';
import { Button } from '@/components/ui/button';

// Get all unique tags from all articles
const allTags = mockPosts.flatMap(post => post.tags);
const uniqueTags = [...new Set(allTags)]; // All unique tags from all articles

interface TagSortProps {
  onTagClick: (tag: string) => void;
  selectedTag: string | null;
}

export const TagSort = ({ onTagClick, selectedTag }: TagSortProps) => {
    return (
        <div className="relative">
            <div className="flex overflow-x-auto scrollbar-hide">
                {uniqueTags.map((tag) => (
                    <Button
                        key={tag}
                        variant={selectedTag === tag ? "default" : "ghost"}
                        size="sm"
                        onClick={() => onTagClick(tag)}
                        className="mr-2 flex-shrink-0"
                    >
                        {tag}
                    </Button>
                ))}
            </div>
            {/* Left fade */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
            {/* Right fade */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
        </div>
    )
}