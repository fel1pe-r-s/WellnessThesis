import { z } from 'zod';

export const SubscriberSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name is too short').optional(),
  email: z.string().email('Invalid email address'),
  createdAt: z.date().optional(),
});
