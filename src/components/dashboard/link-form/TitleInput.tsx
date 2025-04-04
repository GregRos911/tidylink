
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TitleInputProps {
  title: string;
  setTitle: (value: string) => void;
}

const TitleInput: React.FC<TitleInputProps> = ({ title, setTitle }) => {
  return (
    <div className="mb-6">
      <Label htmlFor="title" className="block mb-2 font-medium">
        Title <span className="text-gray-500 font-normal">(optional)</span>
      </Label>
      <Input
        id="title"
        placeholder="My awesome link"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default TitleInput;
