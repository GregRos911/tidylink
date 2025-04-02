
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import LinkHistoryItem from './LinkHistoryItem';
import { Card } from '@/components/ui/card';

interface LinkHistoryItem {
  id: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  clicks: number;
}

interface LinkHistoryTableProps {
  linkHistory: LinkHistoryItem[];
  onDeleteLink: (id: string) => Promise<void>;
}

const LinkHistoryTable: React.FC<LinkHistoryTableProps> = ({ linkHistory, onDeleteLink }) => {
  return (
    <div className="space-y-4">
      {linkHistory.map((link) => (
        <Card key={link.id} className="p-4 hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col space-y-1">
              <h3 className="text-lg font-semibold">
                {link.originalUrl.length > 50 
                  ? link.originalUrl.substring(0, 50) + '...' 
                  : link.originalUrl}
              </h3>
              <a 
                href={link.shortUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline font-medium"
              >
                {link.shortUrl.replace(window.location.origin + '/r/', 'ti.dy/')}
              </a>
              <p className="text-sm text-gray-500">
                {new Date(link.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
            </div>
            
            <LinkHistoryItem
              id={link.id}
              originalUrl={link.originalUrl}
              shortUrl={link.shortUrl}
              createdAt={link.createdAt}
              clicks={link.clicks}
              onDelete={onDeleteLink}
            />
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LinkHistoryTable;
