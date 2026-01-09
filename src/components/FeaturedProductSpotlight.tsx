import Link from 'next/link';
import { Star } from 'lucide-react';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface FeaturedProduct {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string;
  affiliateLink: string;
}

export default async function FeaturedProductSpotlight() {
  let product: FeaturedProduct | null = null;

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, description, imageUrl, affiliateLink FROM products WHERE isFeatured = 1 LIMIT 1'
    );
    if (rows.length > 0) {
      product = rows[0] as FeaturedProduct;
    }
  } catch (error) {
    console.error('Error fetching featured product:', error);
  }

  if (!product) {
    return null;
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
                src={product.imageUrl} 
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
