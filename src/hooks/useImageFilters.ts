
import { ImageData, SearchFilters } from '@/types/types';

export const useImageFilters = () => {
  const filterImages = (images: ImageData[], searchFilters: SearchFilters): ImageData[] => {
    return images.filter(image => {
      // Skip images that haven't been analyzed yet if filtering by metadata
      if (!image.analyzed && (
        searchFilters.medium || 
        searchFilters.environment || 
        searchFilters.style || 
        searchFilters.mood
      )) {
        return false;
      }

      // Search by query text
      if (searchFilters.query) {
        const query = searchFilters.query.toLowerCase();
        const metadata = image.metadata;
        
        // Search in filename
        if (image.filename.toLowerCase().includes(query)) {
          return true;
        }
        
        // Search in custom tags
        if (image.customTags.some(tag => tag.text.toLowerCase().includes(query))) {
          return true;
        }
        
        // Search in metadata if available
        if (metadata) {
          if (
            metadata.medium?.toLowerCase().includes(query) ||
            metadata.environment?.toLowerCase().includes(query) ||
            metadata.style?.toLowerCase().includes(query) ||
            metadata.mood?.toLowerCase().includes(query) ||
            metadata.scene?.toLowerCase().includes(query) ||
            metadata.colors?.some(color => color.toLowerCase().includes(query)) ||
            metadata.actions?.some(action => action.toLowerCase().includes(query)) ||
            metadata.clothes?.some(item => item.toLowerCase().includes(query))
          ) {
            return true;
          }
        }
        
        return false;
      }
      
      // Filter by specific metadata fields
      let passesFilters = true;
      
      if (searchFilters.medium && image.metadata?.medium) {
        passesFilters = passesFilters && image.metadata.medium.toLowerCase().includes(searchFilters.medium.toLowerCase());
      }
      
      if (searchFilters.environment && image.metadata?.environment) {
        passesFilters = passesFilters && image.metadata.environment.toLowerCase().includes(searchFilters.environment.toLowerCase());
      }
      
      if (searchFilters.style && image.metadata?.style) {
        passesFilters = passesFilters && image.metadata.style.toLowerCase().includes(searchFilters.style.toLowerCase());
      }
      
      if (searchFilters.mood && image.metadata?.mood) {
        passesFilters = passesFilters && image.metadata.mood.toLowerCase().includes(searchFilters.mood.toLowerCase());
      }
      
      if (searchFilters.tags && searchFilters.tags.length > 0) {
        passesFilters = passesFilters && searchFilters.tags.some(tag => 
          image.customTags.some(imageTag => imageTag.text.toLowerCase().includes(tag.toLowerCase()))
        );
      }
      
      return passesFilters;
    });
  };

  return { filterImages };
};
