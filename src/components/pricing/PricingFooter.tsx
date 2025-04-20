
import React from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const PricingFooter: React.FC = () => (
  <footer className="bg-background border-t py-6">
    <div className="container flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center gap-2">
        <LinkIcon className="h-5 w-5 text-brand-blue" />
        <span className="font-bold bg-clip-text text-transparent bg-hero-gradient">Tidylink</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} Tidylink. All rights reserved.
      </p>
    </div>
  </footer>
);

export default PricingFooter;
