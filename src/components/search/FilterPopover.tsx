
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FilterSection } from './FilterSection';
import { SearchFilters } from '@/types/types';

interface FilterPopoverProps {
  mediums: string[];
  environments: string[];
  styles: string[];
  moods: string[];
  searchFilters: SearchFilters;
  hasActiveFilters: boolean;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  resetSearchFilters: () => void;
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  mediums,
  environments,
  styles,
  moods,
  searchFilters,
  hasActiveFilters,
  updateSearchFilters,
  resetSearchFilters
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon"
          className={cn(
            "shrink-0 bg-background/30 border-border",
            hasActiveFilters && "text-mediatorz-purple border-mediatorz-purple/50"
          )}
        >
          <Filter className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 glass-panel">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Filter Images</h3>
          
          <FilterSection
            title="Medium"
            values={mediums}
            selectedValue={searchFilters.medium}
            onSelect={(value) => updateSearchFilters({ medium: value })}
          />
          
          <FilterSection
            title="Environment"
            values={environments}
            selectedValue={searchFilters.environment}
            onSelect={(value) => updateSearchFilters({ environment: value })}
          />
          
          <FilterSection
            title="Style"
            values={styles}
            selectedValue={searchFilters.style}
            onSelect={(value) => updateSearchFilters({ style: value })}
          />
          
          <FilterSection
            title="Mood"
            values={moods}
            selectedValue={searchFilters.mood}
            onSelect={(value) => updateSearchFilters({ mood: value })}
          />
          
          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetSearchFilters();
                setIsOpen(false);
              }}
              className="text-xs"
            >
              Reset All
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-xs bg-mediatorz-purple hover:bg-mediatorz-deep-purple"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
