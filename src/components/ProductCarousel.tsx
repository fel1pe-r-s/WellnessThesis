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
    <section className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(77,124,15,0.05)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-16">
          <div>
            <span className="text-lime-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Premium Selection</span>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">Curated <span className="text-lime-500">Solutions</span></h2>
          </div>
          <div className="flex gap-4 hidden md:flex">
             <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-lime-500 hover:border-lime-500/50 transition-all active:scale-90">
                <ChevronLeft size={24} />
             </button>
             <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-lime-500 hover:border-lime-500/50 transition-all active:scale-90">
                <ChevronRight size={24} />
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white/5 backdrop-blur-sm rounded-[2.5rem] p-7 border border-white/10 hover:border-lime-500/30 transition-all duration-700 hover:-translate-y-3 relative overflow-hidden shadow-2xl"
            >
              {/* Image Container */}
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden mb-8 relative bg-slate-800">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                   <div className="bg-lime-500 p-2.5 rounded-2xl text-slate-900 shadow-xl">
                      <ExternalLink size={18} strokeWidth={2.5} />
                   </div>
                </div>
              </div>

              <div className="px-1">
                <span className="text-lime-500/80 text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">{product.category}</span>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight line-clamp-1">{product.name}</h3>
                <p className="text-slate-400 text-sm mb-10 line-clamp-2 leading-relaxed font-medium">
                  {product.description}
                </p>

                <a 
                  href={product.affiliateLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full py-5 bg-white text-slate-900 font-black rounded-[1.25rem] hover:bg-lime-500 transition-all duration-500 shadow-lg active:scale-95 uppercase tracking-widest text-[11px]"
                >
                  Acquire Now <ShoppingBag size={18} strokeWidth={2.5} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
