import React, { useState } from 'react';
import { ImageData } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Tag, Info } from 'lucide-react';
import { useImageContext } from '@/context/ImageContext';
import { ImageDetailsDialog } from './image/ImageDetailsDialog';
import { ImageTagDialog } from './image/ImageTagDialog';
import { getColorBadgeStyle } from '@/utils/colorUtils';

interface ImageCardProps {
  image: ImageData;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const { deleteImage } = useImageContext();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);

  return (
    <>
      <div className="cosmic-card group h-full">
        <div className="cosmic-card-content h-full">
          <div className="relative flex flex-col h-full">
            <div className="relative aspect-square overflow-hidden rounded-t-lg bg-black/20">
              <img
                src={image.url}
                alt={image.filename}
                className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            
            <div className="flex flex-col flex-grow p-2 space-y-1">
              <h3 className="text-xs font-medium truncate" title={image.filename}>
                {image.filename}
              </h3>
              
              {image.customTags.length > 0 && (
                <div className="flex flex-wrap gap-1 min-h-[20px]">
                  {image.customTags.slice(0, 2).map((tag) => (
                    <Badge
                      key={tag.text}
                      variant="outline"
                      className="text-[10px] px-1 py-0"
                      style={getColorBadgeStyle(tag.color)}
                    >
                      {tag.text}
                    </Badge>
                  ))}
                  {image.customTags.length > 2 && (
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1 py-0 bg-secondary/50"
                    >
                      +{image.customTags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
              
              <div className="flex justify-between mt-auto pt-1">
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsTagDialogOpen(true)}
                  >
                    <Tag className="h-3 w-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsDetailsOpen(true)}
                  >
                    <Info className="h-3 w-3" />
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => deleteImage(image.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ImageDetailsDialog
        image={image}
        isOpen={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
      
      <ImageTagDialog
        image={image}
        isOpen={isTagDialogOpen}
        onOpenChange={setIsTagDialogOpen}
      />
    </>
  );
};
