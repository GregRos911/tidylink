
import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Link as LinkIcon, 
  Copy, 
  Share2,
  Calendar, 
  ExternalLink,
  Search,
  Filter,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import MobileSidebar from '@/components/dashboard/MobileSidebar';
import { useUserLinks } from '@/services/linkService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

const MyLinksPage: React.FC = () => {
  const { data: links, isLoading } = useUserLinks();
  const [searchTerm, setSearchTerm] = useState('');
  
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };
  
  const openShareModal = (link: any) => {
    // This is a placeholder for future implementation of the share modal
    toast.info('Share functionality coming soon!');
  };
  
  const filteredLinks = links?.filter(link => {
    if (!searchTerm) return true;
    
    const lowercaseSearch = searchTerm.toLowerCase();
    
    return (
      (link.title || '').toLowerCase().includes(lowercaseSearch) ||
      link.original_url.toLowerCase().includes(lowercaseSearch) ||
      link.short_url.toLowerCase().includes(lowercaseSearch)
    );
  });
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar - Hidden on mobile */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-white border-b h-16 flex items-center px-4 md:px-6 justify-between">
          {/* Mobile menu button */}
          <div className="md:hidden">
            <MobileSidebar />
          </div>
          
          <div className="flex-1 flex items-center justify-between max-w-5xl mx-auto w-full">
            <h1 className="text-xl font-bold hidden md:block">My Links</h1>
            
            <div className="w-full max-w-md flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input 
                  placeholder="Search links..." 
                  className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <RouterLink to="/dashboard">
                <Button className="bg-brand-blue hover:bg-brand-blue/90 hidden sm:inline-flex">
                  <Plus className="mr-2 h-4 w-4" /> Create Link
                </Button>
              </RouterLink>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold md:hidden">My Links</h2>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Filter by date</span>
                </Button>
                
                <Button variant="outline" size="sm" className="hidden md:flex items-center gap-1">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Add filters</span>
                </Button>
              </div>
            </div>
            
            {isLoading ? (
              <Card className="p-8 text-center">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-4 w-3/4 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4 w-1/2 mx-auto"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                </div>
              </Card>
            ) : filteredLinks?.length ? (
              <div className="bg-white border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/3">Link details</TableHead>
                      <TableHead>Original URL</TableHead>
                      <TableHead className="hidden md:table-cell">Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {link.title || 'Untitled link'}
                            </div>
                            <div className="text-sm text-blue-600">
                              <a 
                                href={link.short_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 hover:underline"
                              >
                                {new URL(link.short_url).host + new URL(link.short_url).pathname}
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="truncate max-w-[200px]">
                          <a 
                            href={link.original_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900 hover:underline truncate block"
                            title={link.original_url}
                          >
                            {link.original_url}
                          </a>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-600">
                          {format(new Date(link.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => copyToClipboard(link.short_url)}
                              title="Copy link"
                            >
                              <Copy className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Copy</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openShareModal(link)}
                              title="Share link"
                            >
                              <Share2 className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Share</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <LinkIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">No links yet</h3>
                <p className="text-gray-600 mb-4">
                  Create your first short link to start tracking clicks and sharing with your audience.
                </p>
                <RouterLink to="/dashboard">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create your first link
                  </Button>
                </RouterLink>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyLinksPage;
