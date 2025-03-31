
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { Copy, Check, Link2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { urlServices } from '@/lib/urlServices';
import { useNavigate } from 'react-router-dom';

const LinkShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error('Please enter a URL to shorten');
      return;
    }
    
    if (!url.match(/^(http|https):\/\/[^ "]+$/)) {
      toast.error('Please enter a valid URL including http:// or https://');
      return;
    }
    
    // Navigate to pricing page
    navigate('/pricing');
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Shorten Your URL</CardTitle>
        <CardDescription>
          Create short links that never expire and track every click
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label htmlFor="long-url" className="text-sm font-medium">
              Paste a long URL
            </label>
            <Input
              id="long-url"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full"
              required
            />
          </div>
          
          <div className="flex flex-col space-y-2">
            <label htmlFor="custom-alias" className="text-sm font-medium">
              Custom alias (optional)
            </label>
            <Input
              id="custom-alias"
              type="text"
              placeholder="my-custom-url"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for random alias
            </p>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? 'Shortening...' : 'Create a secure short link for free'}
          </Button>
          
          {shortenedUrl && (
            <div className="p-4 mt-4 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Link2 className="h-4 w-4 text-primary" />
                  <a
                    href={shortenedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-[250px] sm:max-w-md"
                  >
                    {shortenedUrl}
                  </a>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="flex items-center gap-1"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only sm:not-sr-only">Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default LinkShortener;
