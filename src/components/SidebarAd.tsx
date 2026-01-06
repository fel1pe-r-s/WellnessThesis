'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

interface SidebarAdProps {
  category?: string;
  adSlotData?: any; // To be typed properly with Prisma generated types if needed
}

export default function SidebarAd({ category, adSlotData }: SidebarAdProps) {
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    // In a real scenario, this would fetch from an API based on category or adSlotData
    // For now, we simulate "smart" selection based on category
    // This connects to our "Generic" requirement.
    
    // Simulate fetching "Mitolyn" for Health/Metabolism
    if (!category || category === 'Health' || category === 'Metabolism') {
        setProduct({
            name: 'Mitolyn',
            description: 'Reset your metabolic clock and burn fat more efficiently.',
            imageUrl: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600&auto=format&fit=crop',
            link: 'https://mitolyn.com/affiliate/123', // This would come from DB
            cta: 'Boost Metabolism'
        });
    } else {
         // Fallback or specific for Beauty
         setProduct({
            name: 'GlowRadio Skin',
            description: 'Radiant skin starts from within.',
            imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=600&auto=format&fit=crop',
            link: 'https://glowradio.com/affiliate/123',
            cta: 'Get Glowing'
        });
    }
  }, [category]);

  if (!product) return null;

  return (
    <div className="bg-white dark:bg-[#152822] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-[#233b32] flex flex-col items-center text-center sticky top-24 transition-colors">
      <div className="text-[10px] font-bold text-[#61897c] uppercase tracking-widest mb-4">Sponsored</div>
      
      <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#10221c] group border border-transparent dark:border-[#233b32]">
         <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="object-cover w-full h-full transform transition-transform duration-500 group-hover:scale-105"
         />
         <div className="absolute inset-0 bg-[#13eca4]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-[#f6f8f7] mb-2">{product.name}</h3>
      <p className="text-[#61897c] text-sm mb-6 leading-relaxed">
        {product.description}
      </p>

      <a 
        href={product.link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full bg-lime-700 text-white font-bold py-3 px-6 rounded-xl hover:bg-lime-800 transition-all transform hover:scale-[1.02] shadow-md flex items-center justify-center gap-2"
      >
        {product.cta} <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
