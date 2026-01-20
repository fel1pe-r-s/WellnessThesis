import React from 'react';
import { query } from '@/lib/db';
import { Post } from '@/lib/types';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { ArrowLeft, Filter } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getAllPosts(): Promise<Post[]> {
  const { rows } = await query(
    'SELECT * FROM posts WHERE published = true ORDER BY created_at DESC'
  );
  
  return rows.map((row: any) => ({
    ...row,
    imageUrl: row.image_url,
    authorId: row.author_id,
    productId: row.product_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  })) as Post[];
}

export default async function AllPostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto mb-16">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-lime-700 mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-lime-700 text-[10px] font-black uppercase tracking-[0.2em]">Research Library</span>
            <div className="h-px w-12 bg-lime-700/20" />
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{posts.length} Insights Found</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 leading-tight">
            Complete <span className="text-lime-700 italic">Archive</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium mt-4 max-w-2xl leading-relaxed">
            Our full collection of scientific insights, wellness protocols, and premium recommendations for a high-performance life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-medium italic text-lg">Our library is currently expanding. Please check back later.</p>
            <Link href="/" className="inline-block mt-8 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest">Return to Home</Link>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="bg-slate-900 rounded-[3rem] p-12 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-64 h-64 bg-lime-500/5 rounded-full blur-3xl" />
           <div className="relative z-10 max-w-2xl mx-auto">
              <h3 className="text-3xl font-serif font-black text-white mb-4">Join the Inner Circle</h3>
              <p className="text-slate-400 mb-8">Receive early access to our most groundbreaking research discoveries directly in your inbox.</p>
              <div className="max-w-md mx-auto">
                 <Link href="#newsletter" className="inline-block px-10 py-5 bg-lime-700 text-white font-black rounded-2xl hover:bg-lime-600 transition-all uppercase tracking-widest text-xs">
                    Join the Research Community
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
