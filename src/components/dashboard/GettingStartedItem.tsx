
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface GettingStartedItemProps {
  title: string;
  icon: React.ReactNode;
  cta?: string;
  cta1?: string;
  cta2?: string;
  href?: string;
  href1?: string;
  href2?: string;
  complete?: boolean;
  appIcons?: boolean;
}

const GettingStartedItem: React.FC<GettingStartedItemProps> = ({
  title,
  icon,
  cta,
  cta1,
  cta2,
  href,
  href1,
  href2,
  complete = false,
  appIcons = false
}) => {
  return (
    <div className="p-6 flex">
      <div className="mr-4">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          complete 
            ? "bg-green-100 text-green-600" 
            : "bg-gray-100 text-gray-500"
        )}>
          {complete ? <Check className="h-5 w-5" /> : icon}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-medium mb-3">{title}</h3>
        
        {appIcons ? (
          <div className="mb-4">
            <div className="flex gap-3">
              {/* Placeholder app icons */}
              {['bg-blue-500', 'bg-orange-500', 'bg-green-500', 'bg-purple-500'].map((color, i) => (
                <div key={i} className={`${color} w-10 h-10 rounded-full opacity-60`}></div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Find the tools that TidyLink integrates with, learn about use cases and connect them with TidyLink today.
            </p>
            <Button variant="outline" size="sm" className="mt-3">
              Explore the Apps and Integrations Marketplace
            </Button>
          </div>
        ) : cta1 && cta2 ? (
          <div className="flex flex-wrap gap-2">
            <Link to={href1 || "#"}>
              <Button variant="outline" size="sm">
                {cta1}
              </Button>
            </Link>
            <Link to={href2 || "#"}>
              <Button variant="outline" size="sm">
                {cta2}
              </Button>
            </Link>
          </div>
        ) : cta && href ? (
          <Link to={href}>
            <Button variant="outline" size="sm">
              {cta}
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default GettingStartedItem;
