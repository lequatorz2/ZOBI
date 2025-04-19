
import { ImageData, SearchFilters, TagInfo } from '@/types/types';

export interface ImageContextType {
  images: ImageData[];
  loading: boolean;
  analyzing: boolean;
  searchFilters: SearchFilters;
  filteredImages: ImageData[];
  addImages: (files: File[]) => void;
  deleteImage: (id: string) => void;
  analyzeImages: () => Promise<void>;
  addCustomTag: (imageId: string, tag: TagInfo) => void;
  removeCustomTag: (imageId: string, tagText: string) => void;
  updateSearchFilters: (filters: Partial<SearchFilters>) => void;
  resetSearchFilters: () => void;
}

export interface ImageProviderProps {
  children: React.ReactNode;
}
