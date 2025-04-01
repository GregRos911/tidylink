
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <Loader2 className="h-10 w-10 mx-auto text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Loading link history...</p>
      </div>
    </div>
  );
};

export default LoadingState;
