export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string;
  category: string;
  published: boolean;
  authorId?: string;
  ctaLink?: string;
  productId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  // Product details joined
  product_name?: string;
  product_description?: string;
  product_affiliate_link?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  secondaryImageUrl?: string;
  affiliateLink: string;
  category: string;
  isFeatured: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Subscriber {
  id: string;
  email: string;
  createdAt: string | Date;
}
