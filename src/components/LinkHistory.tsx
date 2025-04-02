
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { useUserLinks } from '@/services/links';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { supabase } from '@/integrations/supabase/client';
import LinkHistoryEmpty from './linkHistory/LinkHistoryEmpty';
import LinkHistoryLoading from './linkHistory/LinkHistoryLoading';
import LinkHistoryTable from './linkHistory/LinkHistoryTable';

const LinkHistory: React.FC = () => {
  const { data: linkHistory, isLoading, error } = useUserLinks();
  
  const deleteLink = async (id: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Link deleted successfully');
    } catch (error) {
      console.error('Error deleting link:', error);
      toast.error('Failed to delete link');
    }
  };
  
  if (isLoading) {
    return <LinkHistoryLoading />;
  }
  
  if (error) {
    toast.error('Failed to load link history');
    return <div>Error loading links. Please try again later.</div>;
  }
  
  if (!linkHistory || linkHistory.length === 0) {
    return <LinkHistoryEmpty />;
  }
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Link History</CardTitle>
        <CardDescription>
          View and manage all your shortened links
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LinkHistoryTable 
          linkHistory={linkHistory.map(link => ({
            id: link.id,
            originalUrl: link.original_url,
            shortUrl: link.short_url,
            createdAt: link.created_at,
            clicks: link.clicks
          }))} 
          onDeleteLink={deleteLink} 
        />
        
        {linkHistory.length > 10 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkHistory;
