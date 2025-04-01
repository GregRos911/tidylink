
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { urlServices } from '@/lib/urlServices';
import LinkTable from './LinkTable';
import EmptyLinkHistory from './EmptyLinkHistory';
import LoadingState from './LoadingState';
import { LinkItem } from '@/lib/types/linkTypes';

const LinkHistory: React.FC = () => {
  const [linkHistory, setLinkHistory] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadLinkHistory();
  }, []);
  
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
      </CardHeader>
      <CardContent>
        <LinkTable linkHistory={linkHistory} onDeleteLink={deleteLink} />
      </CardContent>
    </Card>
  );
};

export default LinkHistory;
