'use client';

import Link from 'next/link';
import { Post } from '@/core/domain/entities';
import { ArrowRight, Clock } from 'lucide-react';

interface PostCardProps {
  post: Post;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const contentSnippet = post.content
    ? post.content.replace(/<[^>]*>?/gm, '').substring(0, featured ? 200 : 120)
    : '';

  if (featured) {
    return (
      <article className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100 group">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 relative h-[300px] lg:h-auto overflow-hidden">
            <img
              src={post.imageUrl || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80"}
              alt={post.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
            <div className="absolute top-6 left-6">
              <span className="bg-lime-700 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                Featured Insight
              </span>
            </div>
          </div>
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-lime-700 text-[10px] font-black uppercase tracking-[0.2em]">
                {post.category || 'Wellness'}
              </span>
              <div className="h-px w-8 bg-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 font-serif leading-[1.1] tracking-tight group-hover:text-lime-700 transition-colors">
              <Link href={`/post/${post.slug}`}>
                {post.title}
              </Link>
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed font-medium line-clamp-3">
              {contentSnippet}...
            </p>
            <div className="pt-4">
              <Link
                href={`/post/${post.slug}`}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-lime-700 transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                Read Full Research
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 group flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80"}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="p-8 flex flex-col flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lime-700 text-[10px] font-black uppercase tracking-[0.2em]">
            {post.category || 'Discovery'}
          </span>
          <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            <Clock className="w-3 h-3" />
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 font-serif leading-tight tracking-tight group-hover:text-lime-700 transition-colors line-clamp-2">
          <Link href={`/post/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed font-medium line-clamp-2 flex-1">
          {contentSnippet}...
        </p>
        <div className="pt-4">
          <Link
            href={`/post/${post.slug}`}
            className="inline-flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] hover:text-lime-700 transition-colors"
          >
            Explore More
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
