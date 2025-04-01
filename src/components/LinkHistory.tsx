
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { urlServices } from '@/lib/urlServices';
import LinkTable from './LinkTable';
import EmptyLinkHistory from './EmptyLinkHistory';
import LoadingState from './LoadingState';
import { LinkItem } from '@/lib/types/linkTypes';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

type SortField = 'createdAt' | 'clicks' | null;
type SortOrder = 'asc' | 'desc';

const LinkHistory: React.FC = () => {
  const [linkHistory, setLinkHistory] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filteredLinks, setFilteredLinks] = useState<LinkItem[]>([]);
  
  useEffect(() => {
    loadLinkHistory();
  }, []);
  
  useEffect(() => {
    filterAndSortLinks();
  }, [linkHistory, searchQuery, sortField, sortOrder]);
  
  const loadLinkHistory = async () => {
    try {
      const history = await urlServices.getLinkHistory();
      setLinkHistory(history);
    } catch (error) {
      console.error('Error loading link history:', error);
      toast.error('Failed to load link history');
    } finally {
      setLoading(false);
    }
  };
  
  const deleteLink = async (id: string) => {
    try {
      await urlServices.deleteLink(id);
      setLinkHistory(linkHistory.filter(item => item.id !== id));
      toast.success('Link deleted successfully');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };
  
  const filterAndSortLinks = () => {
    let filtered = [...linkHistory];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(link => 
        link.originalUrl.toLowerCase().includes(query) || 
        link.shortUrl.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        if (sortField === 'createdAt') {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        } else if (sortField === 'clicks') {
          return sortOrder === 'asc' ? a.clicks - b.clicks : b.clicks - a.clicks;
        }
        return 0;
      });
    }
    
    setFilteredLinks(filtered);
  };
  
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle sort order if same field is clicked
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending order
      setSortField(field);
      setSortOrder('desc');
    }
  };
  
  if (loading) {
    return <LoadingState />;
  }
  
  if (linkHistory.length === 0) {
    return <EmptyLinkHistory />;
  }
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Your Link History</CardTitle>
        <CardDescription>
          View and manage all your shortened links
        </CardDescription>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search links..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <LinkTable 
          linkHistory={filteredLinks} 
          onDeleteLink={deleteLink}
          onSort={handleSort}
          sortField={sortField}
          sortOrder={sortOrder}
        />
      </CardContent>
    </Card>
  );
};

export default LinkHistory;
