'use client';

import React, { useCallback } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Product } from '@/lib/types';
import useEmblaCarousel from 'embla-carousel-react';

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: true,
    skipSnaps: false,
    dragFree: false
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(77,124,15,0.05)_0%,transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-lime-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Premium Selection</span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">Curated <span className="text-lime-500">Solutions</span></h2>
          </div>
          <div className="flex gap-4">
             <button 
                onClick={scrollPrev}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-lime-500 hover:border-lime-500/50 transition-all active:scale-90 cursor-pointer"
                aria-label="Previous products"
             >
                <ChevronLeft size={24} />
             </button>
             <button 
                onClick={scrollNext}
                className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-lime-500 hover:border-lime-500/50 transition-all active:scale-90 cursor-pointer"
                aria-label="Next products"
             >
                <ChevronRight size={24} />
             </button>
          </div>
        </div>

        {/* Embla Viewport */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex -ml-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] pl-8 min-w-0"
              >
                <div className="group bg-white/5 backdrop-blur-sm rounded-[2rem] p-5 border border-white/10 hover:border-lime-500/30 transition-all duration-700 h-full relative overflow-hidden shadow-2xl flex flex-col">
                  {/* Image Container */}
                  <div className="aspect-video rounded-xl overflow-hidden mb-6 relative bg-slate-800 shrink-0">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-20">
                       <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="block bg-lime-500 p-2.5 rounded-2xl text-slate-900 shadow-xl hover:bg-lime-400 transition-colors">
                          <ExternalLink size={18} strokeWidth={2.5} />
                       </a>
                    </div>
                  </div>

                  <div className="px-1 flex flex-col flex-1">
                    <span className="text-lime-500/80 text-[10px] font-black uppercase tracking-[0.2em] mb-3 block">{product.category}</span>
                    <h3 className="text-xl font-bold text-white mb-3 tracking-tight line-clamp-1">{product.name}</h3>
                    <p className="text-slate-400 text-[11px] mb-6 line-clamp-3 leading-relaxed font-medium flex-1">
                      {product.description}
                    </p>

                    <a 
                      href={product.affiliateLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-3 w-full py-3.5 bg-white text-slate-900 font-black rounded-xl hover:bg-lime-500 transition-all duration-500 shadow-lg active:scale-95 uppercase tracking-widest text-[9px] relative z-10"
                    >
                      Acquire Now <ShoppingBag size={18} strokeWidth={2.5} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
