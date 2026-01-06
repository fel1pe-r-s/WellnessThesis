'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Star } from 'lucide-react';

interface FeaturedProduct {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  affiliateLink: string;
}

export default function FeaturedProductSpotlight() {
  const { data: product, isLoading } = useQuery<FeaturedProduct>({
    queryKey: ['featured-product'],
    queryFn: async () => {
      const res = await fetch('/api/products/featured');
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Failed to fetch featured product');
      }
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-lime-700 to-lime-800 rounded-xl p-6 text-center text-white shadow-xl relative overflow-hidden animate-pulse">
        <div className="h-24"></div>
      </div>
    );
  }

  if (!product) {
    return null; // Don't show anything if no featured product
  }

  return (
    <div className="bg-gradient-to-br from-lime-700 to-lime-800 rounded-xl p-6 text-center text-white shadow-xl relative overflow-hidden group">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white opacity-10 rounded-full"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-yellow-400 opacity-20 rounded-full"></div>

      {/* Badge */}
      <span className="inline-flex items-center gap-1 bg-yellow-400 text-slate-900 text-xs font-extrabold px-2 py-1 rounded uppercase mb-4 shadow-sm">
        <Star className="w-3 h-3 fill-current" />
        Trending Now
      </span>

      {/* Product Info */}
      <h3 className="text-xl font-bold mb-3 font-serif">{product.name}</h3>
      {product.description && (
        <p className="text-sm text-lime-50 mb-6 line-clamp-2">{product.description}</p>
      )}

      {/* CTA Button */}
      <Link
        href={product.affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-white text-lime-700 font-bold py-3 rounded-lg shadow-md hover:bg-yellow-400 hover:text-slate-900 transition-all duration-300 transform group-hover:-translate-y-1"
      >
        View Product
      </Link>
    </div>
  );
}
