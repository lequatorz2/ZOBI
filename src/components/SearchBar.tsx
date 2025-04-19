
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useImageContext } from '@/context/ImageContext';
import { cn } from '@/lib/utils';
import { useMetadataValues } from '@/hooks/useMetadataValues';
import { FilterPopover } from './search/FilterPopover';
import { ActiveFilters } from './search/ActiveFilters';

interface SearchBarProps {
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const { searchFilters, updateSearchFilters, resetSearchFilters } = useImageContext();
  const [searchQuery, setSearchQuery] = useState(searchFilters.query);
  const { mediums, environments, styles, moods } = useMetadataValues();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSearchFilters({ query: searchQuery });
  };

  const handleReset = () => {
    setSearchQuery('');
    resetSearchFilters();
  };

  // Check if any filters are applied
  const hasActiveFilters = 
    searchFilters.medium !== undefined || 
    searchFilters.environment !== undefined || 
    searchFilters.style !== undefined || 
    searchFilters.mood !== undefined;

  return (
    <div className={cn("w-full", className)}>
      <form onSubmit={handleSearchSubmit} className="flex w-full gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            className="w-full bg-background/30 pl-10 border-border focus-visible:ring-mediatorz-purple"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <FilterPopover
          mediums={mediums}
          environments={environments}
          styles={styles}
          moods={moods}
          searchFilters={searchFilters}
          hasActiveFilters={hasActiveFilters}
          updateSearchFilters={updateSearchFilters}
          resetSearchFilters={resetSearchFilters}
        />

        <Button 
          type="submit" 
          className="bg-mediatorz-purple hover:bg-mediatorz-deep-purple"
        >
          Search
        </Button>
        
        {(searchFilters.query || hasActiveFilters) && (
          <Button
            variant="ghost"
            onClick={handleReset}
            className="text-xs"
          >
            Clear
          </Button>
        )}
      </form>
      
      <ActiveFilters 
        searchFilters={searchFilters}
        updateSearchFilters={updateSearchFilters}
      />
    </div>
  );
};
