
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useUserLinks } from '@/services/links';
import { LinkData } from '@/services/links/types';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface LinkSelectorProps {
  selectedLink: string | null;
  onSelectLink: (linkId: string) => void;
}

const LinkSelector: React.FC<LinkSelectorProps> = ({ selectedLink, onSelectLink }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch user's links
  const { data: links, isLoading: isLoadingLinks } = useUserLinks({ searchQuery });
  
  // Filter links based on search query (client-side filtering as backup)
  const filteredLinks = links?.filter(link => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      link.original_url.toLowerCase().includes(query) || 
      link.short_url.toLowerCase().includes(query)
    );
  });
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Select a Link</CardTitle>
        <CardDescription>
          Choose one of your shortened links to generate a QR code
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search input */}
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your links..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoadingLinks ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand-blue" />
          </div>
        ) : !links || links.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-4">You don't have any links yet.</p>
            <Button onClick={() => navigate('/dashboard')}>
              Create a Link First
            </Button>
          </div>
        ) : (
          <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-1">
            {filteredLinks?.map((link: LinkData) => (
              <div 
                key={link.id}
                className={`p-3 border rounded-md cursor-pointer flex items-center ${
                  selectedLink === link.id ? 'border-brand-blue bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectLink(link.id)}
              >
                <div className="mr-2 w-4 h-4 rounded-full flex items-center justify-center">
                  {selectedLink === link.id && (
                    <div className="w-3 h-3 rounded-full bg-brand-blue" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{link.short_url.replace(window.location.origin + '/r/', 'ti.dy/')}</p>
                  <p className="text-sm text-gray-500 truncate">{link.original_url}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkSelector;
