
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  cta: string;
  disabled?: boolean;
  onClick?: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  description,
  icon,
  href,
  cta,
  disabled = false,
  onClick
}) => {
  const content = (
    <Card className={cn(
      "p-4 h-full flex flex-col", 
      disabled ? "opacity-60" : "hover:shadow-md transition-shadow"
    )}>
      <div className="mb-4">{icon}</div>
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="mt-auto">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          disabled={disabled}
          onClick={onClick}
        >
          {cta}
        </Button>
      </div>
    </Card>
  );

  if (disabled) {
    return content;
  }
  
  if (onClick) {
    return (
      <div className="block h-full" onClick={onClick}>
        {content}
      </div>
    );
  }

  return (
    <Link to={href} className="block h-full">
      {content}
    </Link>
  );
};

export default QuickActionCard;
