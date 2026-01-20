import React, { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LatestPostsSidebar from '@/components/LatestPostsSidebar';
import AffiliateCTA from '@/components/AffiliateCTA';
import ProductCarousel from '@/components/ProductCarousel';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import pool from '@/lib/db';

import { Post, Product } from '@/core/domain/entities';
import { BookOpen, Clock } from 'lucide-react';
import { SidebarSkeleton, PostCardSkeleton } from '@/components/Skeleton';

export const dynamic = 'force-dynamic';

async function getPostBySlug(slug: string, isPreview: boolean = false): Promise<(Post & { product?: Product }) | null> {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, 
        pr.name as "productName", 
        pr.description as "productDescription", 
        pr.image_url as "productImageUrl", 
        pr.secondary_image_url as "productSecondaryImageUrl",
        pr.affiliate_link as "productAffiliateLink" 
      FROM posts p 
      LEFT JOIN products pr ON p.product_id = pr.id 
      WHERE p.slug = $1${isPreview ? '' : ' AND p.published = true'}`,
      [slug]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    const post: Post & { product?: Product } = {
      id: row.id,
      title: row.title,
      slug: row.slug,
      content: row.content,
      imageUrl: row.image_url,
      category: row.category,
      published: Boolean(row.published),
      isFeatured: Boolean(row.is_featured),
      authorId: row.author_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
      ctaLink: row.cta_link,
      productId: row.product_id,
    };

    if (row.product_id) {
      post.product = {
        id: row.product_id,
        name: row.productName,
        description: row.productDescription,
        imageUrl: row.productImageUrl,
        secondaryImageUrl: row.productSecondaryImageUrl,
        affiliateLink: row.productAffiliateLink,
        category: row.category, 
        isFeatured: false, 
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }

    return post;
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return null;
  }
}

async function RelatedPostsSection({ category, excludeId }: { category: string, excludeId: string }) {
  const { rows } = await pool.query(
    'SELECT * FROM posts WHERE category = $1 AND id != $2 AND published = true LIMIT 3',
    [category, excludeId]
  );
  const relatedPosts = rows.map((row: any) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    imageUrl: row.image_url,
    category: row.category,
    published: Boolean(row.published),
    authorId: row.author_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  })) as Post[];

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-24 pt-24 border-t border-slate-200/60">
      <div className="flex items-center gap-4 mb-12">
        <h3 className="text-3xl font-black font-serif tracking-tight">Recommended <span className="text-lime-700 italic">Reading</span></h3>
        <div className="h-px flex-1 bg-slate-200/60"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {relatedPosts.map((related) => (
          <Link key={related.id} href={`/post/${related.slug}`} className="group space-y-4">
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500">
              <img 
                src={related.imageUrl || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200'} 
                alt={related.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
            <div className="space-y-2">
              <p className="text-lime-700 text-[10px] font-black uppercase tracking-[0.2em]">
                {related.category || 'Wellness'}
              </p>
              <h4 className="text-xl font-black text-slate-900 group-hover:text-lime-700 transition-colors line-clamp-2 font-serif leading-tight">
                {related.title}
              </h4>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function PostPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ preview?: string }>
}) {
  const [{ slug }, { preview }] = await Promise.all([params, searchParams]);
  const isPreview = preview === 'true';
  const post = await getPostBySlug(slug, isPreview);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-lime-200 selection:text-lime-900">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article */}
          <article className="lg:col-span-8 space-y-8">
            <header className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-lime-100 text-lime-700 px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-[0.2em]">
                  {post.category || 'Wellness'}
                </span>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 font-serif leading-[1.1] tracking-tight">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 py-6 border-b border-slate-200/60">
                <div className="w-12 h-12 bg-gradient-to-br from-lime-600 to-lime-700 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-lime-700/20">
                  WT
                </div>
                <div className="flex flex-col">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">WellnessThesis Discovery</p>
                  <p className="text-xs font-medium text-slate-500">Shared with the community</p>
                </div>
              </div>
            </header>

            {post.imageUrl && (
              <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-slate-200/50">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
              </div>
            )}

            <div 
              className="prose prose-slate prose-lg max-w-none prose-serif prose-headings:font-black prose-headings:tracking-tight prose-a:text-lime-700 prose-a:no-underline hover:prose-a:underline prose-img:rounded-[2rem] prose-blockquote:border-lime-700 prose-blockquote:bg-lime-50/50 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:not-italic prose-blockquote:font-bold prose-blockquote:text-slate-800"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.product && (
              <div className="pt-8">
                <AffiliateCTA 
                  productName={post.product.name}
                  description={post.product.description || "Discover this discovery carefully shared for your well-being."}
                  link={post.product.affiliateLink}
                />
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
              <h4 className="font-bold text-slate-900 mb-4 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-lime-700" />
                About this blog
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed font-medium mb-6">
                I share updates on well-being, beauty, health, and fitness. These are practical tips, recipes, and discoveries to help you on your healthy living journey.
              </p>
              <Link href="/" className="inline-flex w-full items-center justify-center bg-slate-900 text-white px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-lime-700 transition-all active:scale-95 shadow-xl shadow-slate-200/50">
                Back to insights
              </Link>
            </div>
            
            <Suspense fallback={<SidebarSkeleton />}>
              <LatestPostsSidebar />
            </Suspense>
          </aside>
        </div>

        <Suspense fallback={<div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"><PostCardSkeleton /><PostCardSkeleton /><PostCardSkeleton /></div>}>
          <RelatedPostsSection category={post.category || ''} excludeId={post.id} />
        </Suspense>
      </div>

      <ProductCarousel />
      <Footer />
    </div>
  );
}
