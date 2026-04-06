import Link from 'next/link';
import { getPostBySlug } from '@/lib/wordpress';
import { Clock, ArrowLeft, User, Calendar } from 'lucide-react';
import FeaturedProductSpotlight from '@/components/FeaturedProductSpotlight';
import LatestPostsSidebar from '@/components/LatestPostsSidebar';
import { notFound } from 'next/navigation';

import './post-content.css';

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-slate-50 min-h-screen flex flex-col">
      {/* Hero Header Section */}
      <section className="bg-white border-b border-slate-200/60 pt-16 pb-12 lg:pt-24 lg:pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto lg:mx-0">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-lime-700 mb-12 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Insights
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-10">
              <span className="bg-lime-50 text-lime-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-lime-100 italic">
                {post.category || 'Wellness Research'}
              </span>
              <div className="hidden md:block h-px w-10 bg-slate-200" />
              <div className="flex items-center gap-2 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-slate-900 leading-[1.05] tracking-tight mb-10">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 py-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-200 shadow-inner">
                  <User size={20} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mb-0.5">Autor</p>
                  <p className="text-sm font-bold text-slate-900">WellnessThesis Editorial Team</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
          <div className="lg:col-span-8">
            <div className="space-y-12">
              {/* Featured Image */}
              {post.imageUrl && (
                <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 aspect-[16/9] relative group">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
                </div>
              )}

              {/* Post Content */}
              <div
                className="wp-post-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Post Footer / Tags / Metadata */}
              <div className="pt-16 mt-16 border-t border-slate-200/60 flex flex-wrap gap-4 items-center justify-between">

                <div className="flex items-center gap-2 text-slate-400 text-xs font-medium italic">
                  <Clock size={14} />
                  Published on {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Matching Home Page Pattern */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-12">
              <div>
                <FeaturedProductSpotlight />
              </div>

              <LatestPostsSidebar />

              {/* Placeholder for legal/community info if needed */}

            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
