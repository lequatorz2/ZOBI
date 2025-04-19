import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { ImageData } from '@/types/types';
import { useImageContext } from '@/context/ImageContext';

interface ImageTagDialogProps {
  image: ImageData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImageTagDialog: React.FC<ImageTagDialogProps> = ({
  image,
  isOpen,
  onOpenChange,
}) => {
  const { addCustomTag, removeCustomTag } = useImageContext();
  const [newTag, setNewTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#9b87f5');

  const handleAddTag = () => {
    if (newTag.trim()) {
      addCustomTag(image.id, { text: newTag.trim(), color: selectedColor });
      setNewTag('');
      setSelectedColor('#9b87f5'); // Reset color picker to default
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Tags</DialogTitle>
          <DialogDescription>
            Add colored tags to this image
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex flex-col space-y-2">
            <Input
              placeholder="Enter a tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-background/50"
            />
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="h-8 w-8 rounded cursor-pointer"
              />
              <Button
                onClick={handleAddTag}
                className="flex-1"
                style={{ 
                  backgroundColor: selectedColor,
                  color: '#ffffff'
                }}
                disabled={!newTag.trim()}
              >
                Add Tag
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Current Tags</h4>
            <div className="flex flex-wrap gap-1 min-h-[28px]">
              {image.customTags.length > 0 ? (
                image.customTags.map((tag) => (
                  <Badge
                    key={tag.text}
                    variant="outline"
                    className="group"
                    style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                  >
                    {tag.text}
                    <button
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeCustomTag(image.id, tag.text)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No tags added yet</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
