
import { useImageContext } from '@/context/ImageContext';
import { ImageData, ImageMetadata } from '@/types/types';

export const useMetadataValues = () => {
  const { images } = useImageContext();
  
  const getUniqueMetadataValues = (field: keyof ImageMetadata) => {
    const values = new Set<string>();

    images.forEach(image => {
      if (image.metadata) {
        const value = image.metadata[field] as string | undefined;
        if (value) values.add(value);
      }
    });

    return Array.from(values).sort();
  };

  return {
    mediums: getUniqueMetadataValues('medium'),
    environments: getUniqueMetadataValues('environment'),
    styles: getUniqueMetadataValues('style'),
    moods: getUniqueMetadataValues('mood')
  };
};
