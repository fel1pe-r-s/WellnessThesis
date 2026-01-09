export interface User {
  id: string;
  email: string;
  password?: string; // Needed for auth
  name?: string | null;
  role: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string | null;
  category: string;
  published: boolean;
  authorId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  ctaLink?: string | null;
  productId?: string | null;
  product?: Product | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  secondaryImageUrl?: string | null; // Added for featured spotlight
  affiliateLink: string;
  category: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: Date;
}
