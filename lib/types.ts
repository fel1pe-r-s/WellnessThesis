export interface WpCategory {
    id: number;
    count: number;
    description: string;
    link: string;
    name: string;
    slug: string;
    taxonomy: string;
    parent: number;
    meta: any[];
    _links: WpCategoryLinks;
}

export interface WpCategoryLinks {
    self: LinkHref[];
    collection: LinkHref[];
    about: LinkHref[];
    'wp:post_type': LinkHref[];
    curies: CurieLink[];
}

export interface LinkHref {
    href: string;
    targetHints?: {
        allow: string[];
    };
}

export interface CurieLink {
    name: string;
    href: string;
    templated: boolean;
}

// Extracted and normalized from WordPress Post
export interface Post {
    id: number | string;
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    createdAt: string | Date;
    updatedAt?: string | Date;
    imageUrl?: string;
    category?: string; // Principal category name
    authorId?: number;
    isFeatured?: boolean;
    // Affiliate fields (if it's a product-focused post)
    affiliateLink?: string;
}

// Product interface required by example components
export interface Product {
    id: number | string;
    name: string;
    description: string;
    imageUrl: string;
    secondaryImageUrl?: string;
    category: string;
    categorySlug?: string;
    affiliateLink: string;
    isFeatured?: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    count?: number;
}