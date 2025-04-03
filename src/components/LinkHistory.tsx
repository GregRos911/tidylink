
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
import { QrCode, Link } from 'lucide-react';

interface LinkHistoryProps {
  searchQuery?: string;
  filterType?: 'all' | 'links' | 'qrcodes';
}

const LinkHistory: React.FC<LinkHistoryProps> = ({ 
  searchQuery = '', 
  filterType = 'all' 
}) => {
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
    // First apply search filter
    const matchesSearch = !searchQuery || 
      link.original_url.toLowerCase().includes(searchQuery.toLowerCase()) || 
      link.short_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (link.custom_backhalf && link.custom_backhalf.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Then apply type filter
    const hasQrCode = !!link.qr_code_design_id;
    
    if (filterType === 'all') {
      return matchesSearch;
    } else if (filterType === 'links') {
      return matchesSearch && !hasQrCode;
    } else if (filterType === 'qrcodes') {
      return matchesSearch && hasQrCode;
    }
    
    return false;
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
    const emptyMessage = filterType === 'qrcodes' 
      ? "You haven't created any QR codes yet"
      : filterType === 'links'
      ? "You haven't created any links yet"
      : "No links or QR codes found";
      
    return <LinkHistoryEmpty message={emptyMessage} />;
  }
  
  return (
    <>
      <Card className="w-full shadow-md mb-6">
        <CardHeader className="pb-0">
          <CardTitle className="text-2xl flex items-center gap-2">
            {filterType === 'qrcodes' ? (
              <>
                <QrCode className="h-5 w-5" />
                Your QR Codes
              </>
            ) : filterType === 'links' ? (
              <>
                <Link className="h-5 w-5" />
                Your Link History
              </>
            ) : (
              <>Your Link & QR Code History</>
            )}
          </CardTitle>
          <CardDescription>
            {filterType === 'qrcodes' 
              ? "View and manage all your QR codes"
              : filterType === 'links'
              ? "View and manage all your shortened links"
              : "View and manage all your shortened links and QR codes"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {filteredLinks.map(link => (
              <LinkCard
                key={link.id}
                id={link.id}
                originalUrl={link.original_url}
                shortUrl={link.short_url}
                createdAt={link.created_at}
                clicks={link.clicks}
                onDelete={deleteLink}
                hasQrCode={!!link.qr_code_design_id}
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
