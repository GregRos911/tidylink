
import { z } from 'zod';

export const newLinkSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
  utmSource: z.string().min(1, 'Source is required'),
  utmMedium: z.string().min(1, 'Medium is required'),
  utmCampaign: z.string().min(1, 'Campaign name is required'),
  utmContent: z.string().optional(),
  customBackhalf: z.string().optional(),
});

export type NewLinkFormValues = z.infer<typeof newLinkSchema>;
