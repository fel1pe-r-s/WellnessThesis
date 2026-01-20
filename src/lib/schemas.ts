import { z } from 'zod';

export const PostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required for your post'),
  slug: z.string().min(1, 'A URL slug is required'),
  content: z.string().min(1, 'Post content cannot be empty'),
  imageUrl: z.string().url('Invalid cover image URL').or(z.literal('')).nullable().optional(),
  category: z.string().min(1, 'Please select a category'),
  published: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  authorId: z.string().nullable().optional(),
  ctaLink: z.string().url('Invalid CTA link URL').or(z.literal('')).nullable().optional(),
  productId: z.string().nullable().optional(),
});

export const ProductSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().nullable().optional(),
  imageUrl: z.string().url('Invalid image URL').or(z.literal('')),
  secondaryImageUrl: z.string().url('Invalid secondary image URL').or(z.literal('')).nullable().optional(),
  affiliateLink: z.string().url('Invalid affiliate link URL').or(z.literal('')),
  category: z.string().min(1, 'Category is required'),
  isFeatured: z.boolean().default(false),
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
