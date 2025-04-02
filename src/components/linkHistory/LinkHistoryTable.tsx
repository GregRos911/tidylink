
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import LinkHistoryItem from './LinkHistoryItem';

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
            <LinkHistoryItem
              key={item.id}
              id={item.id}
              originalUrl={item.originalUrl}
              shortUrl={item.shortUrl}
              createdAt={item.createdAt}
              clicks={item.clicks}
              onDelete={onDeleteLink}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LinkHistoryTable;
