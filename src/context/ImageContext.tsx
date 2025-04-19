import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { ImageData, SearchFilters, TagInfo } from '@/types/types';
import { toast } from '@/hooks/use-toast';
import { ImageContextType, ImageProviderProps } from './ImageContextTypes';
import { useImageUtils } from '@/hooks/useImageUtils';
import { useImageFilters } from '@/hooks/useImageFilters';
import { useImageAnalysis } from '@/hooks/useImageAnalysis';

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};

const LOCAL_STORAGE_KEY = 'mediatorz_images';

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
  const [images, setImages] = useState<ImageData[]>(() => {
    const savedImages = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        return parsedImages.map((img: any) => {
          const fileBlob = dataURItoBlob(img.fileData);
          const file = new File([fileBlob], img.filename, { 
            type: fileBlob.type 
          });
          const url = URL.createObjectURL(fileBlob);
          return {
            ...img,
            file,
            url,
            uploadeAt: new Date(img.uploadeAt)
          };
        });
      } catch (e) {
        console.error('Failed to parse saved images:', e);
        return [];
      }
    }
    return [];
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    medium: undefined,
    environment: undefined,
    style: undefined,
    mood: undefined,
    tags: undefined,
  });

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  };

  const { processImages, handleImageUploadSuccess, handleImageUploadError } = useImageUtils();
  const { filterImages } = useImageFilters();
  const { analyzeImages } = useImageAnalysis(images, setImages, setAnalyzing);

  useEffect(() => {
    const serializableImages = images.map(img => ({
      ...img,
      file: undefined,
      url: undefined
    }));
    
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(serializableImages));
    
    return () => {
      images.forEach(img => {
        if (img.url) URL.revokeObjectURL(img.url);
      });
    };
  }, [images]);

  const addImages = async (files: File[]) => {
    setLoading(true);
    try {
      const newImages = await processImages(files);
      setImages((prev) => [...prev, ...newImages]);
      handleImageUploadSuccess(files);
    } catch (error) {
      handleImageUploadError(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = (id: string) => {
    setImages((prev) => {
      const newImages = prev.filter((img) => img.id !== id);
      
      const imageToDelete = prev.find((img) => img.id === id);
      if (imageToDelete?.url) {
        URL.revokeObjectURL(imageToDelete.url);
      }
      
      return newImages;
    });
    toast({
      title: 'Image deleted',
      description: 'Image removed successfully.',
    });
  };

  const addCustomTag = (imageId: string, tag: TagInfo) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, customTags: [...img.customTags, tag] } 
        : img
    ));
  };

  const removeCustomTag = (imageId: string, tagText: string) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, customTags: img.customTags.filter(t => t.text !== tagText) } 
        : img
    ));
  };

  const updateSearchFilters = (filters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
  };

  const resetSearchFilters = () => {
    setSearchFilters({
      query: '',
      medium: undefined,
      environment: undefined,
      style: undefined,
      mood: undefined,
      tags: undefined,
    });
  };

  const filteredImages = filterImages(images, searchFilters);

  return (
    <ImageContext.Provider
      value={{
        images,
        loading,
        analyzing,
        searchFilters,
        filteredImages,
        addImages,
        deleteImage,
        analyzeImages,
        addCustomTag,
        removeCustomTag,
        updateSearchFilters,
        resetSearchFilters,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
