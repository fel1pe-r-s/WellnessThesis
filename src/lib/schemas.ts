import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  imageUrl: z.string().nullable().optional(),
  category: z.string(),
  published: z.boolean().default(false),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  ctaLink: z.string().nullable().optional(),
});

export type Post = z.infer<typeof PostSchema>;

export const NewsletterSubscriberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type NewsletterSubscriber = z.infer<typeof NewsletterSubscriberSchema>;
