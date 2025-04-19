
import React from 'react';
import { SearchFilters } from '@/types/types';
import { FilterBadge } from './FilterBadge';

interface ActiveFiltersProps {
  searchFilters: SearchFilters;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({ 
  searchFilters, 
  updateSearchFilters 
}) => {
  const hasActiveFilters = 
    searchFilters.medium !== undefined || 
    searchFilters.environment !== undefined || 
    searchFilters.style !== undefined || 
    searchFilters.mood !== undefined;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <span className="text-xs text-muted-foreground">Active filters:</span>
      
      {searchFilters.medium && (
        <FilterBadge 
          label="Medium"
          value={searchFilters.medium}
          onRemove={() => updateSearchFilters({ medium: undefined })}
        />
      )}
      
      {searchFilters.environment && (
        <FilterBadge 
          label="Environment"
          value={searchFilters.environment}
          onRemove={() => updateSearchFilters({ environment: undefined })}
        />
      )}
      
      {searchFilters.style && (
        <FilterBadge 
          label="Style"
          value={searchFilters.style}
          onRemove={() => updateSearchFilters({ style: undefined })}
        />
      )}
      
      {searchFilters.mood && (
        <FilterBadge 
          label="Mood"
          value={searchFilters.mood}
          onRemove={() => updateSearchFilters({ mood: undefined })}
        />
      )}
    </div>
  );
};
