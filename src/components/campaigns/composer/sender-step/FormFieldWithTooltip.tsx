
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Control } from 'react-hook-form';

interface FormFieldWithTooltipProps {
  control: Control<any>;
  name: string;
  label: string;
  tooltipText: string;
  tooltipWidth?: string;
  placeholder?: string;
  type?: string;
}

const FormFieldWithTooltip: React.FC<FormFieldWithTooltipProps> = ({
  control,
  name,
  label,
  tooltipText,
  tooltipWidth = 'w-60',
  placeholder,
  type = 'text'
}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="flex items-center">
            {label}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 ml-2 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className={tooltipWidth}>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </FormLabel>
          <FormControl>
            <Input {...field} placeholder={placeholder} type={type} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormFieldWithTooltip;
