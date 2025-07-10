import { Filter, X, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BrowseControlsProps {
  sortBy: 'date' | 'topic';
  onSortChange: (sort: 'date' | 'topic') => void;
  selectedAuthor: string | null;
  selectedTag: string | null;
  onClearFilters: () => void;
}

export const BrowseControls = ({
  sortBy,
  onSortChange,
  selectedAuthor,
  selectedTag,
  onClearFilters
}: BrowseControlsProps) => {
  const hasActiveFilters = selectedAuthor || selectedTag;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-b">
      <div className="flex items-center space-x-4">
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
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {selectedAuthor && (
            <Badge variant="secondary" className="text-xs">
              Author: {selectedAuthor.replace('-', ' ')}
            </Badge>
          )}
          
          {selectedTag && (
            <Badge variant="secondary" className="text-xs">
              Tag: {selectedTag}
            </Badge>
          )}
          
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