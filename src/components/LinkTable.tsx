
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
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, BarChart } from 'lucide-react';
import { Button } from "@/components/ui/button";

type SortField = 'createdAt' | 'clicks' | null;
type SortOrder = 'asc' | 'desc';

interface LinkTableProps {
  linkHistory: LinkItemType[];
  onDeleteLink: (id: string) => Promise<void>;
  onSort: (field: SortField) => void;
  sortField: SortField;
  sortOrder: SortOrder;
}

const LinkTable: React.FC<LinkTableProps> = ({ 
  linkHistory, 
  onDeleteLink,
  onSort,
  sortField,
  sortOrder
}) => {
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Short URL</TableHead>
            <TableHead className="hidden sm:table-cell">Original URL</TableHead>
            <TableHead className="hidden md:table-cell">
              <Button 
                variant="ghost" 
                className="p-0 font-medium flex items-center text-muted-foreground hover:text-foreground"
                onClick={() => onSort('createdAt')}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Created {getSortIcon('createdAt')}
              </Button>
            </TableHead>
            <TableHead className="text-center">
              <Button 
                variant="ghost" 
                className="p-0 font-medium flex items-center text-muted-foreground hover:text-foreground mx-auto"
                onClick={() => onSort('clicks')}
              >
                <BarChart className="mr-2 h-4 w-4" />
                Clicks {getSortIcon('clicks')}
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {linkHistory.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No results found. Try a different search.
              </TableCell>
            </TableRow>
          ) : (
            linkHistory.map((item) => (
              <LinkItem 
                key={item.id} 
                item={item} 
                onDelete={onDeleteLink} 
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default LinkTable;
