'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { getAllProductsUseCase } from '@/core/use-cases';

export default function ProductCarousel() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Since we are in a 'use client' component, we'll use a fetch call to an API route instead of direct use case
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="py-20 bg-[#10221c] flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#13eca4]"></div>
    </div>
  );

  if (products.length === 0) return null;

  return (
    <section className="py-24 bg-[#10221c] border-t border-[#233b32]">
      <div className="container mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="text-[#13eca4] text-xs font-black uppercase tracking-[0.2em] mb-3 block">Wellness Toolkit</span>
            <h2 className="text-3xl md:text-5xl font-black text-[#f6f8f7] uppercase tracking-tighter">Recommended Solutions</h2>
          </div>
          <div className="flex gap-4 hidden md:flex">
             <button className="p-3 rounded-xl border border-[#233b32] text-[#61897c] hover:text-[#13eca4] hover:border-[#13eca4] transition-all">
                <ChevronLeft size={24} />
             </button>
             <button className="p-3 rounded-xl border border-[#233b32] text-[#61897c] hover:text-[#13eca4] hover:border-[#13eca4] transition-all">
                <ChevronRight size={24} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-[#152822] rounded-3xl p-6 border border-[#233b32] hover:border-[#13eca4]/50 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <div className="bg-[#13eca4] p-2 rounded-xl text-[#111816]">
                    <ExternalLink size={16} />
                 </div>
              </div>
              
              <div className="aspect-square rounded-2xl overflow-hidden mb-6 bg-[#10221c] border border-[#233b32]">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <span className="text-[#61897c] text-[10px] font-bold uppercase tracking-widest mb-2 block">{product.category}</span>
              <h3 className="text-xl font-bold text-[#f6f8f7] mb-2">{product.name}</h3>
              <p className="text-[#61897c] text-sm mb-8 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              <a 
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-4 bg-[#10221c] text-[#f6f8f7] font-bold rounded-2xl border border-[#233b32] group-hover:bg-[#13eca4] group-hover:text-[#111816] transition-all"
              >
                Learn More <ShoppingBag size={18} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
