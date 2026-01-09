import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import ProductCarousel from '@/components/ProductCarousel';
import NewsletterForm from '@/components/NewsletterForm';
import FeaturedProductSpotlight from '@/components/FeaturedProductSpotlight';
import LatestPostsSidebar from '@/components/LatestPostsSidebar';
import { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { Post } from '@/core/domain/entities';
import { Suspense } from 'react';
import { PostCardSkeleton, SidebarSkeleton, Skeleton } from '@/components/Skeleton';

export const metadata: Metadata = {
  title: 'WellnessThesis | Your Guide to Wellness & Vitality',
  description: 'Sharing news, recipes, and practical tips on health and beauty to help you feel your best every day.',
};

export const dynamic = 'force-dynamic';

async function PostGrid() {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM posts WHERE published = 1 ORDER BY createdAt DESC LIMIT 5'
  );
  
  const posts = rows.map(row => ({
    ...row,
    published: Boolean(row.published),
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  })) as Post[];

  const heroPost = posts[0];
  const gridPosts = posts.slice(1);

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 shadow-sm">
        <p className="text-slate-400 font-medium italic">Welcome to WellnessThesis. New insights coming soon!</p>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Post */}
      {heroPost && (
        <section className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-lime-600 to-emerald-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative">
            <PostCard post={heroPost} featured />
          </div>
        </section>
      )}

      {/* Ad Slot - REMOVED for Approval Phase */}

      {/* Title Section */}
      <div className="flex items-center gap-4">
        <h2 className="text-3xl font-black font-serif tracking-tight">Latest <span className="text-lime-700 italic">Insights</span></h2>
        <div className="h-px flex-1 bg-slate-200/60"></div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {gridPosts.map((post) => (
          <div key={post.id} className="transition-transform duration-500 hover:-translate-y-2">
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}

function PostsLoading() {
  return (
    <div className="space-y-16">
      <PostCardSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <PostCardSkeleton />
        <PostCardSkeleton />
      </div>
    </div>
  );
}

function SidebarLoading() {
  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl border border-slate-100">
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <SidebarSkeleton />
    </div>
  );
}

export default async function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-lime-200 selection:text-lime-900">
      <Header />
      
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Suspense fallback={<PostsLoading />}>
              <PostGrid />
            </Suspense>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
              <h4 className="font-bold text-slate-900 mb-4 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-lime-700" />
                About WellnessThesis
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                I share updates on well-being, beauty, and healthy living. These are practical tips and recipes to help you on your journey.
              </p>
            </div>

            <Suspense fallback={<SidebarLoading />}>
              <FeaturedProductSpotlight />
              <LatestPostsSidebar />
            </Suspense>
          </aside>
        </div>
      </main>

      {/* Featured Section */}
      <ProductCarousel />

      {/* Newsletter Section */}
      <section className="container mx-auto px-6 py-20">
        <NewsletterForm />
      </section>

      <Footer />
    </div>
  );
}
