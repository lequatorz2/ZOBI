
import { ImageData } from '@/types/types';
import { analyzeImage, generateImageBase64, getStoredApiKey } from '@/services/geminiService';
import { toast } from '@/hooks/use-toast';

export const useImageAnalysis = (
  images: ImageData[],
  setImages: React.Dispatch<React.SetStateAction<ImageData[]>>,
  setAnalyzing: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const analyzeImages = async () => {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your Gemini API key in the settings.',
        variant: 'destructive',
      });
      return;
    }

    setAnalyzing(true);
    const unanalyzedImages = images.filter(img => !img.analyzed);
    
    if (unanalyzedImages.length === 0) {
      toast({
        title: 'No images to analyze',
        description: 'All images have already been analyzed.',
      });
      setAnalyzing(false);
      return;
    }

    toast({
      title: 'Analysis started',
      description: `Analyzing ${unanalyzedImages.length} image${unanalyzedImages.length !== 1 ? 's' : ''}...`,
    });

    try {
      // Process images one by one to avoid rate limiting
      for (const image of unanalyzedImages) {
        try {
          const base64 = await generateImageBase64(image.file);
          const metadata = await analyzeImage(base64, apiKey);
          
          setImages(prev => prev.map(img => 
            img.id === image.id 
              ? { ...img, metadata, analyzed: true } 
              : img
          ));
          
        } catch (error) {
          console.error(`Error analyzing image ${image.filename}:`, error);
          // Continue with next image even if one fails
        }
      }
      
      toast({
        title: 'Analysis complete',
        description: 'Image analysis completed successfully.',
      });
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: 'Analysis error',
        description: 'Failed to complete image analysis.',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return { analyzeImages };
};
