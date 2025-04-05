
import React from 'react';
import { Link2Icon } from 'lucide-react';
import { LinkData } from '@/services/links/types';

interface ExistingLinksListProps {
  links: LinkData[] | undefined;
  isLoading: boolean;
  selectedLinkId?: string;
  onSelectLink: (linkId: string) => void;
}

const ExistingLinksList: React.FC<ExistingLinksListProps> = ({
  links,
  isLoading,
  selectedLinkId,
  onSelectLink
}) => {
  if (isLoading) {
    return <p className="text-sm text-gray-500">Loading links...</p>;
  }
  
  if (!links || links.length === 0) {
    return <p className="text-sm text-gray-500">No links found for this campaign. Create a new one.</p>;
  }
  
  return (
    <div className="grid gap-3">
      {links.map(link => (
        <div 
          key={link.id}
          className={`
            flex items-center border rounded-md p-2 cursor-pointer 
            ${selectedLinkId === link.id ? 'bg-gray-100 border-gray-400' : 'hover:bg-gray-50'}
          `}
          onClick={() => onSelectLink(link.id)}
        >
          <Link2Icon className="h-4 w-4 text-gray-500 flex-shrink-0" />
          <div className="ml-3 flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{link.original_url}</p>
            <p className="text-xs text-gray-500 truncate">{link.short_url}</p>
          </div>
          <div className="ml-2 flex-shrink-0 text-xs text-gray-500">
            {link.clicks} clicks
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExistingLinksList;
