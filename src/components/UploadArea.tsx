
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, ImagePlus, AlertCircle } from 'lucide-react';
import { useImageContext } from '@/context/ImageContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const UploadArea: React.FC = () => {
  const { addImages, loading } = useImageContext();
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Filter for image files only
      const imageFiles = acceptedFiles.filter((file) =>
        file.type.startsWith('image/')
      );

      if (imageFiles.length === 0) {
        toast({
          title: 'Invalid files',
          description: 'Please upload image files only (JPEG, PNG, WebP, etc.)',
          variant: 'destructive',
        });
        return;
      }

      // Log file information for debugging
      console.log('Uploading files:', imageFiles);
      
      addImages(imageFiles);
    },
    [addImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.avif'],
    },
    disabled: loading,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(
        'w-full relative overflow-hidden rounded-xl border-2 border-dashed p-8 transition-all',
        'bg-gradient-to-br from-mediatorz-dark to-background',
        'hover:border-mediatorz-purple/50 group',
        isDragActive 
          ? 'border-mediatorz-purple shadow-lg scale-[1.01] border-opacity-100' 
          : 'border-border border-opacity-50'
      )}
    >
      {/* Background blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-mediatorz-purple/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-mediatorz-cyan/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-mediatorz-pink/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center justify-center gap-4 relative z-10">
        <div className="cosmic-card w-16 h-16 flex items-center justify-center rounded-xl">
          <div className="cosmic-card-content w-full h-full flex items-center justify-center">
            <UploadCloud 
              className={cn(
                "text-mediatorz-purple h-8 w-8 transition-transform duration-300",
                isDragActive ? "scale-110" : "group-hover:scale-110"
              )} 
            />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h3 className="text-lg font-medium">
            {isDragActive ? 'Drop images here' : 'Upload Images'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag & drop images or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: JPEG, PNG, WebP, GIF, BMP
          </p>
        </div>
        
        <Button 
          className="mt-2 bg-mediatorz-purple hover:bg-mediatorz-deep-purple text-white transition-all duration-300"
          disabled={loading}
        >
          <ImagePlus className="mr-2 h-4 w-4" />
          Select Files
        </Button>
        
        {loading && (
          <p className="text-xs text-muted-foreground animate-pulse">
            Processing uploads...
          </p>
        )}
      </div>
    </div>
  );
};
