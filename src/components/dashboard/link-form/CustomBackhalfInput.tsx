
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

interface CustomBackhalfInputProps {
  customBackHalf: string;
  setCustomBackHalf: (value: string) => void;
  canUseCustomBackHalf: boolean;
  remainingCustomBackHalves: number;
}

const CustomBackhalfInput: React.FC<CustomBackhalfInputProps> = ({
  customBackHalf,
  setCustomBackHalf,
  canUseCustomBackHalf,
  remainingCustomBackHalves
}) => {
  return (
    <>
      <div className="w-1/2">
        <Label htmlFor="backhalf" className="block mb-2 font-medium">
          Custom back-half <span className="text-gray-500 font-normal">(optional)</span>
        </Label>
        <Input
          id="backhalf"
          placeholder="my-brand"
          value={customBackHalf}
          onChange={(e) => setCustomBackHalf(e.target.value)}
          className="w-full"
          disabled={!canUseCustomBackHalf}
        />
      </div>
      <p className="text-gray-700 text-sm mt-2">
        You can create <span className="font-semibold">{remainingCustomBackHalves}</span> more custom back-halves this month.{' '}
        <Link to="/pricing" className="text-brand-blue hover:underline">
          Upgrade for more
        </Link>.
      </p>
    </>
  );
};

export default CustomBackhalfInput;
