
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LinkIcon, PlusCircle } from 'lucide-react';

const LinkHistoryEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow-sm border">
      <div className="p-3 bg-blue-50 rounded-full mb-4">
        <LinkIcon className="h-10 w-10 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No links found</h3>
      <p className="text-muted-foreground mb-6 text-center">You haven't created any links yet. Start shortening URLs to see your history here.</p>
      <Link to="/dashboard">
        <Button className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Short Link
        </Button>
      </Link>
    </div>
  );
};

export default LinkHistoryEmpty;
