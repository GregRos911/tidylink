
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Copy, QrCode, Trash2, ExternalLink, BarChart } from 'lucide-react';
import { urlServices } from '@/lib/urlServices';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCodeGenerator from './QRCodeGenerator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface LinkHistoryItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

const LinkHistory: React.FC = () => {
  const [linkHistory, setLinkHistory] = useState<LinkHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  
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
  
  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      toast.success('Link copied to clipboard!');
      
      setTimeout(() => {
        setCopied(null);
      }, 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-pulse-slow h-10 w-10 mx-auto rounded-full bg-primary mb-4"></div>
          <p className="text-muted-foreground">Loading link history...</p>
        </div>
      </div>
    );
  }
  
  if (linkHistory.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-xl font-medium mb-2">No links found</h3>
          <p className="text-muted-foreground mb-4">Start shortening URLs to see your history here.</p>
          <Link to="/">
            <Button>Create Your First Short Link</Button>
          </Link>
        </div>
      </div>
    );
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short URL</TableHead>
                <TableHead className="hidden sm:table-cell">Original URL</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="text-center">Clicks</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {linkHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    <a 
                      href={item.shortUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {new URL(item.shortUrl).host + new URL(item.shortUrl).pathname}
                      <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell max-w-[200px] truncate">
                    <span title={item.originalUrl}>
                      {item.originalUrl}
                    </span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-1">
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                      {item.clicks}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(item.shortUrl, item.id)}
                        title="Copy link"
                      >
                        {copied === item.id ? (
                          <Copy className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Generate QR code"
                          >
                            <QrCode className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>QR Code for {new URL(item.shortUrl).host + new URL(item.shortUrl).pathname}</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <QRCodeGenerator url={item.shortUrl} />
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteLink(item.id)}
                        title="Delete link"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkHistory;
