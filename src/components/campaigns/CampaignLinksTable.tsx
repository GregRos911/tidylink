
import React, { useState } from 'react';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { LinkData } from '@/services/links/types';
import { toast } from 'sonner';
import { formatTidyUrl, truncateText, getDomainFromUrl } from '@/services/links/utils';

interface CampaignLinksTableProps {
  links: LinkData[];
  isLoading: boolean;
}

const CampaignLinksTable: React.FC<CampaignLinksTableProps> = ({ 
  links,
  isLoading 
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    
    toast.success('Link copied to clipboard!');
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };
  
  if (isLoading) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Destination</TableHead>
            <TableHead>Short Link</TableHead>
            <TableHead>UTM Parameters</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </TableCell>
              <TableCell className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/5"></div>
              </TableCell>
              <TableCell className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </TableCell>
              <TableCell className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/5"></div>
              </TableCell>
              <TableCell className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  
  if (links.length === 0) {
    return (
      <div className="p-8 text-center">
        <h3 className="text-lg font-semibold text-gray-700">No links yet</h3>
        <p className="text-gray-500 mt-1">
          Create your first UTM link for this campaign
        </p>
      </div>
    );
  }
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Destination</TableHead>
          <TableHead>Short Link</TableHead>
          <TableHead>UTM Parameters</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead className="w-24"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => {
          const domain = getDomainFromUrl(link.original_url);
          const shortUrl = formatTidyUrl(link.short_url);
          
          // Format UTM params for display
          const utmParams = [];
          if (link.utm_source) utmParams.push(`source: ${link.utm_source}`);
          if (link.utm_medium) utmParams.push(`medium: ${link.utm_medium}`);
          if (link.utm_campaign) utmParams.push(`campaign: ${link.utm_campaign}`);
          if (link.utm_term) utmParams.push(`term: ${link.utm_term}`);
          if (link.utm_content) utmParams.push(`content: ${link.utm_content}`);
          
          const utmString = utmParams.join(', ');
          
          return (
            <TableRow key={link.id}>
              <TableCell className="font-medium">
                <a 
                  href={link.original_url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-blue-600 hover:underline"
                >
                  {truncateText(domain, 30)}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </TableCell>
              <TableCell>{shortUrl}</TableCell>
              <TableCell>
                <span className="text-xs text-gray-500">
                  {truncateText(utmString, 40)}
                </span>
              </TableCell>
              <TableCell>{link.clicks}</TableCell>
              <TableCell>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => copyToClipboard(link.short_url, link.id)}
                  className="h-8 px-2"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  {copiedId === link.id ? 'Copied' : 'Copy'}
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default CampaignLinksTable;
