import Link from 'next/link';
import { Star } from 'lucide-react';
import { query } from '@/lib/db';


interface FeaturedProduct {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  secondaryImageUrl?: string | null;
  affiliateLink: string;
}

export default async function FeaturedProductSpotlight({ inFeed = false }: { inFeed?: boolean }) {
  let product: FeaturedProduct | null = null;

  try {
    const { rows } = await query(
      'SELECT id, name, description, image_url, secondary_image_url, affiliate_link FROM products WHERE is_featured = true LIMIT 1'
    );
    if (rows.length > 0) {
      const row = rows[0];
      product = {
        id: row.id,
        name: row.name,
        description: row.description,
        imageUrl: row.image_url,
        secondaryImageUrl: row.secondary_image_url,
        affiliateLink: row.affiliate_link,
      };
    }
  } catch (error) {
    console.error('Error fetching featured product:', error);
  }

  if (!product) return null;

  if (inFeed) {
    return (
      <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative group border border-slate-800">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 relative aspect-video md:aspect-auto self-stretch overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent" />
            <div className="absolute top-6 left-6">
              <div className="inline-flex items-center gap-1.5 bg-lime-700/80 backdrop-blur-md border border-lime-500/30 text-white text-[9px] font-black px-4 py-2 rounded-full uppercase shadow-xl">
                <Star className="w-3 h-3 fill-current" />
                Spotlight of the Week
              </div>
            </div>
          </div>
          <div className="md:w-1/2 p-8 md:p-12 space-y-6">
            <h3 className="text-3xl md:text-4xl font-black text-white font-serif tracking-tight leading-[1.1]">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-slate-400 text-lg font-medium leading-relaxed line-clamp-3">
                {product.description}
              </p>
            )}
            <div className="pt-4">
              <Link
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-lime-700 hover:bg-lime-600 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-lime-900/40 uppercase tracking-widest text-xs active:scale-95"
              >
                Acquire Exclusive Discovery
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] p-8 text-center text-white shadow-2xl relative overflow-hidden group border border-slate-700/50">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-lime-400/10 rounded-full blur-2xl opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-500/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

      <div className="inline-flex items-center gap-1.5 bg-lime-700/20 border border-lime-500/30 text-lime-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase mb-6 shadow-lg backdrop-blur-md">
        <Star className="w-3 h-3 fill-current" />
        Spotlight of the Week
      </div>

      {product.imageUrl && (
        <div className="relative w-full h-40 mb-6 rounded-2xl overflow-hidden border border-white/5">
            <img 
                src={product.secondaryImageUrl || product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        </div>
      )}

      <h3 className="text-2xl font-black mb-3 font-serif tracking-tight leading-tight">{product.name}</h3>
      {product.description && (
        <p className="text-sm text-slate-400 mb-8 line-clamp-2 font-medium leading-relaxed">{product.description}</p>
      )}

      <Link
        href={product.affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-lime-700 hover:bg-lime-600 text-white font-black py-4 rounded-2xl shadow-[0_8px_20px_-5px_rgba(77,124,15,0.4)] hover:shadow-[0_12px_25px_-5px_rgba(77,124,15,0.6)] transition-all duration-300 transform group-hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-[11px]"
      >
        Explore Product
      </Link>
    </div>
  );
}

