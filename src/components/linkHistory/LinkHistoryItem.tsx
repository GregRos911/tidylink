
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Copy, Share2, Edit, MoreHorizontal, Trash2, ExternalLink, BarChart } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import QRCodeGenerator from '../QRCodeGenerator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from 'react-router-dom';
import SocialShareButtons from '../link/SocialShareButtons';

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
  const [isShareOpen, setIsShareOpen] = useState(false);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
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
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
          <BarChart className="h-4 w-4 text-blue-500 mr-1" />
          <span className="text-sm font-medium">{clicks} clicks</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline" 
          size="sm"
          onClick={copyToClipboard}
          className="flex items-center"
        >
          <Copy className="h-4 w-4 mr-1" />
          Copy
        </Button>
        
        <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share your link</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p className="mb-4">Share your link to various platforms:</p>
              <SocialShareButtons url={shortUrl} />
            </div>
          </DialogContent>
        </Dialog>
        
        <Link to={`/links/${id}`}>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <BarChart className="h-4 w-4 mr-1" />
            Analytics
          </Button>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="h-4 w-4 mr-2" />
              Open link
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const qrCodeDialog = document.getElementById(`qr-code-dialog-${id}`);
              if (qrCodeDialog) {
                (qrCodeDialog as HTMLDialogElement).showModal();
              }
            }}>
              QR Code
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete(id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Dialog>
          <DialogTrigger className="hidden" id={`qr-code-dialog-${id}`} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code for your link</DialogTitle>
            </DialogHeader>
            <div className="p-4 flex justify-center">
              <QRCodeGenerator url={shortUrl} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LinkHistoryItem;
