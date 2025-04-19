
import React, { useState } from 'react';
import { ImageProvider } from '@/context/ImageContext';
import { UploadArea } from '@/components/UploadArea';
import { SearchBar } from '@/components/SearchBar';
import { ImageGrid } from '@/components/ImageGrid';
import { ApiKeyDialog } from '@/components/ApiKeyDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BarChart, Brain, Github, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useImageContext } from '@/context/ImageContext';
import { getStoredApiKey } from '@/services/geminiService';
import { toast } from '@/hooks/use-toast';

const MediatorzApp = () => {
  const { images, analyzing, analyzeImages } = useImageContext();
  const [showUpload, setShowUpload] = useState(true);
  
  const unanalyzedCount = images.filter(img => !img.analyzed).length;
  
  const handleAnalyzeClick = () => {
    const apiKey = getStoredApiKey();
    if (!apiKey) {
      toast({
        title: 'API Key Required',
        description: 'Please add your Google Gemini API key in settings first.',
        variant: 'destructive',
      });
      return;
    }
    
    if (unanalyzedCount === 0) {
      toast({
        title: 'No images to analyze',
        description: 'All images have already been analyzed.',
      });
      return;
    }
    
    analyzeImages();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="cosmic-card p-0.5 sticky top-0 z-50">
        <div className="cosmic-card-content flex justify-between items-center p-4 bg-mediatorz-dark/95 backdrop-blur-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="cosmic-card w-10 h-10 flex items-center justify-center">
                <div className="cosmic-card-content w-full h-full flex items-center justify-center">
                  <Brain className="h-5 w-5 text-mediatorz-purple" />
                </div>
              </div>
              <span className="font-bold text-xl tracking-tight">MEDIATORZ</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <ApiKeyDialog />
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-6 px-4 space-y-8">
        {/* Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
          <div className="lg:col-span-2">
            <SearchBar />
          </div>
          
          <div className="flex gap-2 lg:justify-end">
            <Button 
              variant="outline"
              className={showUpload ? "bg-mediatorz-purple/20 border-mediatorz-purple/50 text-white" : ""}
              onClick={() => setShowUpload(true)}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload
            </Button>
            
            <Button
              className="bg-mediatorz-purple hover:bg-mediatorz-deep-purple text-white"
              onClick={handleAnalyzeClick}
              disabled={analyzing || unanalyzedCount === 0}
            >
              <BarChart className={`h-4 w-4 mr-2 ${analyzing ? 'animate-spin' : ''}`} /> {/* Changed Analytics to BarChart */}
              {analyzing ? 'Analyzing...' : `Analyze ${unanalyzedCount > 0 ? `(${unanalyzedCount})` : ''}`}
            </Button>
          </div>
        </div>
        
        {/* Upload Area (conditionally shown) */}
        {showUpload && (
          <div className="space-y-4">
            <UploadArea />
            
            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={() => setShowUpload(false)}
                className="text-xs"
              >
                Hide Upload Area
              </Button>
            </div>
          </div>
        )}

        <Separator className="bg-white/5" />
        
        {/* Images Grid */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Your Images</h2>
            <span className="text-sm text-muted-foreground">
              {images.length} {images.length === 1 ? 'image' : 'images'} total
            </span>
          </div>
          
          <ImageGrid />
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 border-t border-white/5 bg-gradient-to-t from-black/30 to-transparent">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} MEDIATORZ App
          </div>
          
          <div className="text-sm text-muted-foreground">
            Powered by Gemini 1.5 Vision API
          </div>
        </div>
      </footer>
    </div>
  );
};

const Index = () => {
  return (
    <ImageProvider>
      <MediatorzApp />
    </ImageProvider>
  );
};

export default Index;
