
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DestinationUrlInputProps {
  destinationUrl: string;
  setDestinationUrl: (value: string) => void;
}

const DestinationUrlInput: React.FC<DestinationUrlInputProps> = ({
  destinationUrl,
  setDestinationUrl
}) => {
  return (
    <div className="mb-4">
      <Label htmlFor="destination" className="block mb-2 font-medium">
        Destination
      </Label>
      <Input
        id="destination"
        placeholder="https://example.com/my-long-url"
        value={destinationUrl}
        onChange={(e) => setDestinationUrl(e.target.value)}
        className="w-full"
        required
      />
    </div>
  );
};

export default DestinationUrlInput;
