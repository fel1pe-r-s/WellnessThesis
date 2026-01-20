import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  content: z.string().min(1, 'Content is required'),
  imageUrl: z.string().url().nullable().optional(),
  category: z.string().min(1, 'Category is required'),
  published: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  authorId: z.string().nullable().optional(),
  ctaLink: z.string().url().nullable().optional(),
  productId: z.string().nullable().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url(),
  secondaryImageUrl: z.string().url().nullable().optional(),
  affiliateLink: z.string().url(),
  category: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const SubscriberSchema = z.object({
  id: z.string().optional(),
  email: z.string().email('Invalid email address'),
  createdAt: z.date().optional(),
});

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
  role: z.enum(['admin', 'user']).default('user'),
});
