
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface FilterSectionProps {
  title: string;
  values: string[];
  selectedValue?: string;
  onSelect: (value: string | undefined) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ 
  title, 
  values, 
  selectedValue, 
  onSelect 
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{title}</Label>
      <div className="flex flex-wrap gap-1">
        {values.length > 0 ? (
          values.map((value) => (
            <Badge
              key={value}
              variant={selectedValue === value ? "default" : "outline"}
              className={
                selectedValue === value 
                  ? "bg-mediatorz-purple hover:bg-mediatorz-deep-purple cursor-pointer" 
                  : "hover:bg-background/50 cursor-pointer"
              }
              onClick={() => 
                onSelect(selectedValue === value ? undefined : value)
              }
            >
              {value}
            </Badge>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">No {title.toLowerCase()} found</p>
        )}
      </div>
    </div>
  );
};
