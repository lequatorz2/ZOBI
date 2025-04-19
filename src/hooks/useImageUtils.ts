
import { v4 as uuidv4 } from 'uuid';
import { ImageData } from '@/types/types';
import { toast } from '@/hooks/use-toast';

export const useImageUtils = () => {
  const createNewImage = async (file: File): Promise<ImageData> => {
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    
    // Convert file to base64 to store in localStorage
    const reader = new FileReader();
    const fileData = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
    
    return {
      id: uuidv4(),
      file,
      url,
      fileData, // Store base64 data for localStorage persistence
      filename: file.name,
      uploadeAt: new Date(),
      analyzed: false,
      customTags: [],
    };
  };
  
  const processImages = async (files: File[]): Promise<ImageData[]> => {
    try {
      return await Promise.all(files.map(createNewImage));
    } catch (error) {
      console.error('Error processing images:', error);
      throw error;
    }
  };
  
  const handleImageUploadSuccess = (files: File[]) => {
    toast({
      title: 'Images added',
      description: `${files.length} image${files.length !== 1 ? 's' : ''} added successfully.`,
    });
  };
  
  const handleImageUploadError = (error: unknown) => {
    console.error('Error adding images:', error);
    toast({
      title: 'Error',
      description: 'Failed to process images.',
      variant: 'destructive',
    });
  };

  // Helper function to safely store data in localStorage with fallback
  const safelyStoreData = (key: string, data: string): boolean => {
    try {
      localStorage.setItem(key, data);
      return true;
    } catch (e) {
      if (e instanceof DOMException && (
        // Everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
      )) {
        console.warn('localStorage quota exceeded - operating in memory-only mode');
        return false;
      }
      // If it's some other error, rethrow it
      throw e;
    }
  };
  
  return {
    createNewImage,
    processImages,
    handleImageUploadSuccess,
    handleImageUploadError,
    safelyStoreData,
  };
};
