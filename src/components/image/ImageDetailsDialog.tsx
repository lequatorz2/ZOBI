
import React, { useState } from 'react';
import { ImageData } from '@/types/types';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, X, Plus } from 'lucide-react';
import { getColorBadgeStyle } from '@/utils/colorUtils';
import { useImageContext } from '@/context/ImageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ImageDetailsDialogProps {
  image: ImageData;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImageDetailsDialog: React.FC<ImageDetailsDialogProps> = ({
  image,
  isOpen,
  onOpenChange,
}) => {
  const { removeCustomTag, addCustomTag } = useImageContext();
  const [newTag, setNewTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#9b87f5');
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim()) {
      addCustomTag(image.id, { text: newTag.trim(), color: selectedColor });
      setNewTag('');
      setSelectedColor('#9b87f5');
      setIsColorPickerOpen(false);
    }
  };

  const handleUpdateTagColor = (tagText: string, newColor: string) => {
    // Remove the old tag and add it back with the new color
    removeCustomTag(image.id, tagText);
    addCustomTag(image.id, { text: tagText, color: newColor });
    setEditingTag(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Image Details</DialogTitle>
          <DialogDescription>
            Detailed information about this image
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-black/20">
              <img
                src={image.url}
                alt={image.filename}
                className="h-full w-full object-cover"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{image.filename}</h3>
              <p className="text-xs text-muted-foreground">
                Uploaded on {new Date(image.uploadeAt).toLocaleString()}
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2">Tags</h4>
              
              <div className="flex items-center space-x-2 mb-2">
                <Input
                  placeholder="Add new tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      size="icon"
                      style={{ backgroundColor: selectedColor }}
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4 text-white" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="h-8 w-8 cursor-pointer"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-wrap gap-1">
                {image.customTags.length > 0 ? (
                  image.customTags.map((tag) => (
                    <Popover
                      key={tag.text}
                      open={editingTag === tag.text}
                      onOpenChange={(open) => setEditingTag(open ? tag.text : null)}
                    >
                      <PopoverTrigger asChild>
                        <Badge
                          variant="outline"
                          className="text-xs group cursor-pointer"
                          style={getColorBadgeStyle(tag.color)}
                        >
                          {tag.text}
                          <button
                            className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCustomTag(image.id, tag.text);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3">
                        <input
                          type="color"
                          value={tag.color}
                          onChange={(e) => handleUpdateTagColor(tag.text, e.target.value)}
                          className="h-8 w-8 cursor-pointer"
                        />
                      </PopoverContent>
                    </Popover>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No tags added yet</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {!image.analyzed ? (
              <div className="cosmic-card p-4 h-full flex items-center justify-center">
                <div className="cosmic-card-content text-center p-6">
                  <Loader2 className="h-10 w-10 text-mediatorz-purple animate-spin mb-4 mx-auto" />
                  <h3 className="text-lg font-medium mb-2">Not Analyzed Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    This image hasn't been analyzed with the Gemini API yet.
                  </p>
                </div>
              </div>
            ) : image.metadata ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Scene Description</h4>
                  <p className="text-sm bg-black/20 p-3 rounded-md border border-white/5">
                    {image.metadata.scene || "No description available"}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Medium</h4>
                    <p className="text-sm">{image.metadata.medium || "Unknown"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Style</h4>
                    <p className="text-sm">{image.metadata.style || "Unknown"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Mood</h4>
                    <p className="text-sm">{image.metadata.mood || "Unknown"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">Environment</h4>
                    <p className="text-sm">{image.metadata.environment || "Unknown"}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground mb-1">People</h4>
                    <p className="text-sm">
                      {image.metadata.people?.count !== undefined 
                        ? `${image.metadata.people.count} ${image.metadata.people.count === 1 ? 'person' : 'people'}`
                        : "Unknown"}
                      {image.metadata.people?.ageEstimate && ` (${image.metadata.people.ageEstimate})`}
                      {image.metadata.people?.gender && `, ${image.metadata.people.gender}`}
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Colors</h4>
                  <div className="flex flex-wrap gap-1">
                    {image.metadata.colors?.map((color, i) => (
                      <Badge
                        key={i}
                        className="text-xs"
                        style={getColorBadgeStyle(color)}
                      >
                        {color}
                      </Badge>
                    )) || "Unknown"}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Actions</h4>
                  <div className="flex flex-wrap gap-1">
                    {image.metadata.actions?.map((action, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs"
                      >
                        {action}
                      </Badge>
                    )) || "Unknown"}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-muted-foreground mb-1">Clothing</h4>
                  <div className="flex flex-wrap gap-1">
                    {image.metadata.clothes?.map((item, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="text-xs"
                      >
                        {item}
                      </Badge>
                    )) || "Unknown"}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <p className="text-muted-foreground">
                  Metadata not available
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
