
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { LinkItem as LinkItemType } from '@/lib/types/linkTypes';
import LinkItem from './LinkItem';

interface LinkTableProps {
  linkHistory: LinkItemType[];
  onDeleteLink: (id: string) => Promise<void>;
}

const LinkTable: React.FC<LinkTableProps> = ({ linkHistory, onDeleteLink }) => {
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
            <LinkItem 
              key={item.id} 
              item={item} 
              onDelete={onDeleteLink} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LinkTable;
