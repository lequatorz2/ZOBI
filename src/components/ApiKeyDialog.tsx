import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Key, Save, Trash2 } from 'lucide-react';
import { getStoredApiKey, storeApiKey, clearApiKey } from '@/services/geminiService';
import { toast } from '@/hooks/use-toast';

interface ApiKeyDialogProps {
  className?: string;
}

export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({ className }) => {
  const [apiKey, setApiKey] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [hasStoredKey, setHasStoredKey] = useState(false);

  useEffect(() => {
    const storedKey = getStoredApiKey();
    setHasStoredKey(!!storedKey);
    if (storedKey) {
      // Replace with * except first and last 4 chars
      const maskedKey = storedKey.length > 8
        ? `${storedKey.substring(0, 4)}${'*'.repeat(storedKey.length - 8)}${storedKey.substring(storedKey.length - 4)}`
        : '********';
      setApiKey(maskedKey);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (apiKey && !apiKey.includes('*')) {
      storeApiKey(apiKey);
      toast({
        title: 'API Key Saved',
        description: 'Your Gemini API key has been saved securely.',
      });
      setHasStoredKey(true);
      setIsOpen(false);
    } else if (!apiKey) {
      toast({
        title: 'Error',
        description: 'Please enter a valid API key.',
        variant: 'destructive',
      });
    }
  };

  const handleClear = () => {
    clearApiKey();
    setApiKey('');
    setHasStoredKey(false);
    toast({
      title: 'API Key Cleared',
      description: 'Your Gemini API key has been removed.',
    });
  };

  const handleNewKey = () => {
    setApiKey('');
    setHasStoredKey(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className={`bg-secondary/50 hover:bg-secondary border-border ${className}`}
        >
          <Settings className="h-4 w-4 mr-2" />
          API Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-mediatorz-purple" />
            <span>Gemini API Key</span>
          </DialogTitle>
          <DialogDescription>
            Enter your Google Gemini API key to enable image analysis.
            {hasStoredKey && 
              <span className="block mt-1 text-xs text-green-500">
                An API key is currently stored in your browser.
              </span>
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-left">
              API Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="apiKey"
                placeholder={hasStoredKey ? "API key is saved" : "Enter your Gemini API key"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type={hasStoredKey ? "text" : "password"}
                className="bg-background/50"
              />
              {hasStoredKey && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleNewKey}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is stored locally in your browser and is never sent to our servers.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          {hasStoredKey && (
            <Button 
              variant="destructive" 
              onClick={handleClear}
              className="w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Key
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            className="w-full bg-mediatorz-purple hover:bg-mediatorz-deep-purple sm:w-auto"
            disabled={hasStoredKey && apiKey.includes('*')}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
