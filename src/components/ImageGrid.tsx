
import React from 'react';
import { useImageContext } from '@/context/ImageContext';
import { ImageCard } from './ImageCard';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  className?: string;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ className }) => {
  const { filteredImages, loading } = useImageContext();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
        <Loader2 className="h-12 w-12 text-mediatorz-purple animate-spin mb-4" />
        <p className="text-muted-foreground">Loading images...</p>
      </div>
    );
  }

  if (filteredImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[300px] text-center">
        <div className="cosmic-card w-16 h-16 flex items-center justify-center mb-4">
          <div className="cosmic-card-content w-full h-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-mediatorz-purple opacity-70"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10.8" />
              <rect x="11" y="7" width="6" height="4" rx="1" />
              <circle cx="17" cy="17" r="3" />
              <path d="m21 21-1.9-1.9" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">No images found</h3>
        <p className="text-muted-foreground max-w-md">
          {filteredImages.length === 0
            ? "Upload some images to get started or adjust your search filters."
            : "No images match your current search criteria. Try adjusting your filters."}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3", className)}>
      {filteredImages.map((image) => (
        <ImageCard key={image.id} image={image} />
      ))}
    </div>
  );
};
