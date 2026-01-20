import { z } from 'zod';

export const SubscriberSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email address'),
  createdAt: z.date().optional(),
});
