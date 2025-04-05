
import { z } from 'zod';

export const senderFormSchema = z.object({
  fromName: z.string().min(2, 'Name is required'),
  fromEmail: z.string().email('Valid email is required'),
  subject: z.string().min(1, 'Subject is required'),
});

export type SenderFormValues = z.infer<typeof senderFormSchema>;
