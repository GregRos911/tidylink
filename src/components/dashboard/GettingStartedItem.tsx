
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';

interface GettingStartedItemProps {
  title: string;
  icon: React.ReactNode;
  cta?: string;
  cta1?: string;
  cta2?: string;
  href?: string;
  href1?: string;
  href2?: string;
  complete: boolean;
  appIcons?: boolean;
  onClick?: () => void;
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
  complete,
  appIcons,
  onClick
}) => {
  return (
    <div className="p-6 flex items-start gap-4">
      <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${complete ? 'bg-green-100' : 'bg-gray-100'}`}>
        {complete ? (
          <Check className="h-6 w-6 text-green-600" />
        ) : (
          <div className="text-gray-500">{icon}</div>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium mb-1">{title}</h3>
        
        {/* Action buttons */}
        {cta && href && (
          <div className="mt-2">
            {onClick ? (
              <Button variant="outline" size="sm" onClick={onClick} className="mr-1">
                {cta} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Link to={href}>
                <Button variant="outline" size="sm" className="mr-1">
                  {cta} <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        )}
        
        {/* Dual action buttons */}
        {cta1 && cta2 && href1 && href2 && (
          <div className="mt-2 flex flex-wrap gap-2">
            <Link to={href1}>
              <Button variant="outline" size="sm">
                {cta1} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link to={href2}>
              <Button variant="outline" size="sm">
                {cta2} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
        )}
        
        {/* App icons */}
        {appIcons && (
          <div className="mt-2 flex gap-2">
            <div className="h-6 w-6 rounded bg-gray-200"></div>
            <div className="h-6 w-6 rounded bg-gray-200"></div>
            <div className="h-6 w-6 rounded bg-gray-200"></div>
            <div className="h-6 w-6 rounded bg-gray-200"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GettingStartedItem;
