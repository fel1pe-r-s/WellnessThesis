'use client';
import React from 'react';
import Link from 'next/link';

// Mock data - would come from props/DB in real app
const products = [
  { id: 1, name: 'Mitolyn', image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400', link: '#' },
  { id: 2, name: 'GlowRadio', image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=400', link: '#' },
  { id: 3, name: 'GutRestore', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400', link: '#' },
  { id: 4, name: 'KetoMatcha', image: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=400', link: '#' },
];

export default function ProductCarousel() {
  return (
    <div className="py-12 bg-white border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
            <div>
                 <h2 className="text-2xl font-serif font-bold text-gray-900">Curated Wellness</h2>
                 <p className="text-gray-500 mt-1">Tools we trust for your journey.</p>
            </div>
            <Link href="/shop" className="text-[#4D7C0F] font-bold hover:underline">View All</Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <a key={product.id} href={product.link} className="group block">
              <div className="aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden mb-4 relative">
                 <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                 />
                 <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        View Product
                    </span>
                 </div>
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-[#4D7C0F] transition-colors">{product.name}</h3>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
