export interface ImageData {
    id: string;
    file: File;
    url: string;
    fileData: string; // Base64 data for persistence
    filename: string;
    uploadeAt: Date;
    analyzed: boolean;
    metadata?: ImageMetadata;
    customTags: TagInfo[];
  }
  
  export interface TagInfo {
    text: string;
    color: string;
  }
  
  export interface ImageMetadata {
    medium?: string;
    people?: {
      count?: number;
      ageEstimate?: string;
      gender?: string;
    };
    actions?: string[];
    clothes?: string[];
    environment?: string;
    colors?: string[];
    style?: string;
    mood?: string;
    scene?: string;
  }
  
  export interface SearchFilters {
    query: string;
    medium?: string;
    environment?: string;
    style?: string;
    mood?: string;
    tags?: string[];
  }
  