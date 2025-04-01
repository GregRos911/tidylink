
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center">
        <div className="animate-pulse-slow h-10 w-10 mx-auto rounded-full bg-primary mb-4"></div>
        <p className="text-muted-foreground">Loading link history...</p>
      </div>
    </div>
  );
};

export default LoadingState;
