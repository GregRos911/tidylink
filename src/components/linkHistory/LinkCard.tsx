
import React, { useState } from 'react';
import { 
  BarChart, 
  Calendar, 
  Copy, 
  ExternalLink, 
  Share2, 
  MoreHorizontal,
  QrCode
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { formatTidyUrl, truncateText, getFaviconUrl } from '@/services/links/utils';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SocialShareButtons from '@/components/link/SocialShareButtons';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

interface LinkCardProps {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
  onDelete: (id: string) => Promise<void>;
  hasQrCode?: boolean;
}

const LinkCard: React.FC<LinkCardProps> = ({
  id,
  originalUrl,
  shortUrl,
  createdAt,
  clicks,
  onDelete,
  hasQrCode = false
}) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const tidyUrl = formatTidyUrl(shortUrl);
  const faviconUrl = getFaviconUrl(originalUrl);
  const formattedDate = new Date(createdAt).toLocaleDateString();
  
  // Extract domain for title fallback
  const domain = new URL(originalUrl).hostname.replace('www.', '');
  const title = `${domain.charAt(0).toUpperCase() + domain.slice(1)} Link`;
  
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

  const viewDetails = () => {
    navigate(`/links/${id}`);
  };

  const viewQrCode = () => {
    if (hasQrCode) {
      navigate(`/qr-codes?linkId=${id}`);
    }
  };
  
  return (
    <Card className="h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={faviconUrl} 
              alt={`${domain} favicon`}
              className="w-8 h-8 rounded-md" 
              onError={(e) => {
                // Fallback to a default image if favicon fails to load
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base sm:text-lg font-medium line-clamp-1">
                  {title}
                </CardTitle>
                {hasQrCode && (
                  <Badge variant="outline" className="flex items-center gap-1 bg-brand-blue/10">
                    <QrCode className="h-3 w-3" />
                    <span className="text-xs">QR</span>
                  </Badge>
                )}
              </div>
              <a 
                href={shortUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-blue hover:underline text-sm font-medium flex items-center gap-1 mt-1"
              >
                {tidyUrl}
                <ExternalLink className="h-3 w-3 inline" />
              </a>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={viewDetails}>
                <BarChart className="h-4 w-4 mr-2" />
                View details
              </DropdownMenuItem>
              {hasQrCode && (
                <DropdownMenuItem onClick={viewQrCode}>
                  <QrCode className="h-4 w-4 mr-2" />
                  View QR code
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(id)} className="text-destructive focus:text-destructive">
                Delete link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <CardDescription className="line-clamp-1 text-xs text-muted-foreground">
          {truncateText(originalUrl, 50)}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart className="h-3 w-3" />
            <span>{clicks} {clicks === 1 ? 'click' : 'clicks'}</span>
          </div>
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-8"
          >
            <Copy className="h-4 w-4 mr-1" />
            {copied ? 'Copied' : 'Copy'}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <div className="p-2">
                <h3 className="text-lg font-semibold mb-4">Share your link</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-center text-brand-blue font-medium mb-2">
                    {tidyUrl}
                  </p>
                  <Button 
                    className="w-full" 
                    onClick={copyToClipboard}
                    size="sm"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy link
                  </Button>
                </div>
                <SocialShareButtons url={shortUrl} />
              </div>
            </DialogContent>
          </Dialog>
          
          {hasQrCode ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={viewQrCode}
              className="h-8"
            >
              <QrCode className="h-4 w-4 mr-1" />
              QR Code
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={viewDetails}
              className="h-8"
            >
              <BarChart className="h-4 w-4 mr-1" />
              Details
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default LinkCard;
