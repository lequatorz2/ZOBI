
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export const FilterBadge: React.FC<FilterBadgeProps> = ({ label, value, onRemove }) => {
  return (
    <Badge 
      variant="outline" 
      className="bg-mediatorz-purple/20 text-xs flex items-center gap-1 group"
    >
      <span>{label}: {value}</span>
      <button 
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
};
