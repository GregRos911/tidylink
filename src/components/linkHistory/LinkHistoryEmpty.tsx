
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const LinkHistoryEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="text-center">
        <h3 className="text-xl font-medium mb-2">No links found</h3>
        <p className="text-muted-foreground mb-4">Start shortening URLs to see your history here.</p>
        <Link to="/">
          <Button>Create Your First Short Link</Button>
        </Link>
      </div>
    </div>
  );
};

export default LinkHistoryEmpty;
