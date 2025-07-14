import { Filter, X, Calendar, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BrowseControlsProps {
  sortBy: 'date' | 'topic' | 'author';
  onSortChange: (sort: 'date' | 'topic' | 'author') => void;
  selectedAuthor: string | null;
  selectedTags: string[];
  onClearFilters: () => void;
  onTagClick: (tag: string) => void;
}

export const BrowseControls = ({
  sortBy,
  onSortChange,
  selectedAuthor,
  selectedTags,
  onClearFilters,
  onTagClick
}: BrowseControlsProps) => {
  const hasActiveFilters = selectedAuthor || (selectedTags.length > 0);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-4 border-b w-full">
      <div className="flex-1 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Browse by:</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={sortBy === 'date' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSortChange('date')}
            className="transition-colors"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Date
          </Button>
          <Button
            variant={sortBy === 'topic' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSortChange('topic')}
            className="transition-colors"
          >
            <Tag className="h-4 w-4 mr-2" />
            Topic
          </Button>
          <Button
            variant={sortBy === 'author' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSortChange('author')}
            className="transition-colors"
          >
            <User className="h-4 w-4 mr-2" />
            Author
          </Button>
        </div>
      </div>
      <div className="w-full sm:w-auto flex justify-start sm:justify-end">
        <span className="text-lg font-semibold text-brand-neutral-700">Latest Posts</span>
      </div>
      {hasActiveFilters && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedAuthor && (
            <Badge variant="secondary" className="text-xs">
              Author: {selectedAuthor.replace('-', ' ')}
            </Badge>
          )}
          {selectedTags.map(tag => (
            <Badge key={tag}>
              Tag: {tag}
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-6 px-2 text-xs hover:text-primary transition-colors"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};