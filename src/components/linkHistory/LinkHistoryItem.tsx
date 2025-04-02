
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, QrCode, Trash2, ExternalLink, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCodeGenerator from '../QRCodeGenerator';
import { TableCell, TableRow } from "@/components/ui/table";

interface LinkHistoryItemProps {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
  onDelete: (id: string) => Promise<void>;
}

const LinkHistoryItem: React.FC<LinkHistoryItemProps> = ({
  id,
  originalUrl,
  shortUrl,
  createdAt,
  clicks,
  onDelete
}) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
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
    <TableRow>
      <TableCell className="font-medium">
        <a 
          href={shortUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline flex items-center gap-1"
        >
          {new URL(shortUrl).host + new URL(shortUrl).pathname}
          <ExternalLink className="h-3 w-3 inline" />
        </a>
      </TableCell>
      <TableCell className="hidden sm:table-cell max-w-[200px] truncate">
        <span title={originalUrl}>
          {originalUrl}
        </span>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {new Date(createdAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex justify-center items-center gap-1">
          <BarChart className="h-4 w-4 text-muted-foreground" />
          {clicks}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copyToClipboard(shortUrl)}
            title="Copy link"
          >
            {copied ? (
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
                <DialogTitle>QR Code for {new URL(shortUrl).host + new URL(shortUrl).pathname}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <QRCodeGenerator url={shortUrl} />
              </div>
            </DialogContent>
          </Dialog>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(id)}
            title="Delete link"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default LinkHistoryItem;
