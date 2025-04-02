
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { useUserLinks } from '@/services/links';
import LinkHistoryEmpty from './linkHistory/LinkHistoryEmpty';
import LinkHistoryLoading from './linkHistory/LinkHistoryLoading';
import LinkCard from './linkHistory/LinkCard';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface LinkHistoryProps {
  searchQuery?: string;
}

const LinkHistory: React.FC<LinkHistoryProps> = ({ searchQuery = '' }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12; // Show more items per page for card layout
  const queryClient = useQueryClient();
  
  const { data: links, isLoading, isError } = useUserLinks({
    limit: itemsPerPage,
    page: currentPage,
    orderBy: 'created_at',
    orderDirection: 'desc'
  });
  
  const filteredLinks = links?.filter(link => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      link.original_url.toLowerCase().includes(query) || 
      link.short_url.toLowerCase().includes(query) ||
      (link.custom_backhalf && link.custom_backhalf.toLowerCase().includes(query))
    );
  });
  
  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Invalidate and refetch links
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Link deleted successfully');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };
  
  if (isLoading) {
    return <LinkHistoryLoading />;
  }
  
  if (isError) {
    toast.error('Failed to load link history');
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error loading links. Please try again later.</p>
      </div>
    );
  }
  
  if (!filteredLinks || filteredLinks.length === 0) {
    return <LinkHistoryEmpty />;
  }
  
  return (
    <>
      <Card className="w-full shadow-md mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl">Your Link History</CardTitle>
          <CardDescription>
            View and manage all your shortened links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {filteredLinks.map(link => (
              <LinkCard
                key={link.id}
                id={link.id}
                originalUrl={link.original_url}
                shortUrl={link.short_url}
                createdAt={link.created_at}
                clicks={link.clicks}
                onDelete={deleteLink}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {filteredLinks.length > 0 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {[...Array(Math.min(3, Math.ceil(links.length / itemsPerPage)))].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    isActive={currentPage === i}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={
                    (currentPage + 1) * itemsPerPage >= (links?.length || 0) 
                      ? "pointer-events-none opacity-50" 
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};

export default LinkHistory;
