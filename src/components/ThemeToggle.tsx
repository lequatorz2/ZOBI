import React from 'react';
import { Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const ThemeToggle = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="icon" 
            className="p-2 transition-all duration-200 bg-opacity-20 hover:bg-opacity-30"
            disabled
          >
            <Moon className="h-5 w-5 text-slate-700" />
            <span className="sr-only">Dark Mode</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Dark Mode</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
