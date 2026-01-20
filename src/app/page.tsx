import React from 'react';
import { query } from '@/lib/db';
import { Post, Product } from '@/lib/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import ProductCarousel from '@/components/ProductCarousel';
import FeaturedProductSpotlight from '@/components/FeaturedProductSpotlight';
import LatestPostsSidebar from '@/components/LatestPostsSidebar';
import NewsletterForm from '@/components/NewsletterForm';

export const dynamic = 'force-dynamic';

async function getBlogData() {
  const { rows: postRows } = await query(
    'SELECT * FROM posts WHERE published = true ORDER BY is_featured DESC, created_at DESC LIMIT 10'
  );

  
  const posts = postRows.map((row: any) => ({
    ...row,
    imageUrl: row.image_url,
    authorId: row.author_id,
    productId: row.product_id,
    isFeatured: row.is_featured,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  })) as Post[];


  // Fetch featured products for carousel
  const { rows: productRows } = await query(
    'SELECT * FROM products ORDER BY created_at DESC LIMIT 8'
  );
  
  const products = productRows.map((row: any) => ({
    ...row,
    imageUrl: row.image_url,
    secondaryImageUrl: row.secondary_image_url,
    affiliateLink: row.affiliate_link,
    isFeatured: row.is_featured,
  })) as Product[];

  return { posts, products };
}

export default async function BlogPage() {
  const { posts, products } = await getBlogData();
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow">
        {/* Hero Section with Featured Post */}
        {featuredPost && (
          <section className="container mx-auto px-6 py-12">
            <PostCard post={featuredPost} featured={true} />
          </section>
        )}

        {/* Product Showcase */}
        <ProductCarousel products={products} />

        {/* Main Feed Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Posts Grid */}
            <div className="lg:col-span-2 space-y-12">
              {regularPosts.length > 0 && (
                <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-12">
                  <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Recent Insights</h2>
                  <div className="hidden md:flex gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-lime-700 bg-lime-50 px-3 py-1 rounded-full border border-lime-100 italic">Latest Discoveries</span>
                  </div>
                </div>
              )}

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {regularPosts.length === 0 && !featuredPost && (
                <div className="py-20 text-center">
                  <p className="text-slate-400 font-medium italic text-lg">Our library is currently undergoing a reorganization. Check back soon for new research.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-10">
              <FeaturedProductSpotlight />
              <div className="sticky top-24 space-y-10">
                <LatestPostsSidebar />
                <div className="bg-slate-900 rounded-[2rem] p-4 text-white shadow-2xl relative overflow-hidden">
                   {/* Background decorative element */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl" />
                   <NewsletterForm variant="compact" />
                </div>
              </div>
            </aside>

          </div>
        </section>
      </main>
    </div>

  );
}
