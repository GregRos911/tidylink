
import React from 'react';
import { Link } from 'react-router-dom';

interface UsageLimitInfoProps {
  remainingLinks: number;
}

const UsageLimitInfo: React.FC<UsageLimitInfoProps> = ({ remainingLinks }) => {
  return (
    <div className="mb-4">
      <p className="text-gray-700">
        You can create <span className="font-semibold">{remainingLinks}</span> more links this month.{' '}
        <Link to="/pricing" className="text-brand-blue hover:underline">
          Upgrade for more
        </Link>.
      </p>
    </div>
  );
};

export default UsageLimitInfo;
