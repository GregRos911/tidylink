
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LinkIcon } from 'lucide-react';

const LinkHistoryEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg border border-gray-200 p-8">
      <div className="text-center">
        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <LinkIcon className="h-8 w-8 text-brand-blue" />
        </div>
        <h3 className="text-xl font-medium mb-2">No links found</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start shortening URLs to see your history here. Create your first TidyLink to begin tracking clicks and sharing.
        </p>
        <Link to="/">
          <Button>Create Your First Short Link</Button>
        </Link>
      </div>
    </div>
  );
};

export default LinkHistoryEmpty;
