export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string | null;
  category: string;
  published: boolean;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  ctaLink?: string | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string | null;
  affiliateLink: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: Date;
}
