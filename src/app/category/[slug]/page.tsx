import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PostCard from '@/components/PostCard';
import LatestPostsSidebar from '@/components/LatestPostsSidebar';
import NewsletterForm from '@/components/NewsletterForm';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { Post } from '@/core/domain/entities';
import { SidebarSkeleton, PostCardSkeleton } from '@/components/Skeleton';
import { BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCategoryPosts(category: string): Promise<Post[]> {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM posts WHERE LOWER(category) = LOWER(?) AND published = 1 ORDER BY createdAt DESC',
      [category]
    );
    return rows.map(row => ({
      ...row,
      published: Boolean(row.published),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt),
    })) as Post[];
  } catch (error) {
    console.error('Error fetching category posts:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = slug.charAt(0).toUpperCase() + slug.slice(1);
    return {
        title: `${category} | WellnessThesis`,
        description: `Discovery and insights about ${category.toLowerCase()} to improve your daily well-being.`,
    };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = await getCategoryPosts(slug);
  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  if (!posts) {
     return notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-lime-200 selection:text-lime-900">
      <Header />
      
      {/* Category Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-16 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-lime-100 text-lime-700 text-[10px] uppercase font-black tracking-[0.2em] mb-4">
            Category
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-black text-slate-900 mb-4 tracking-tight">{categoryName}</h1>
          <p className="text-slate-500 font-medium max-w-xl mx-auto italic">
              Carefully shared insights and findings about {categoryName.toLowerCase()} for the community.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8">
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {posts.map((post) => (
                          <div key={post.id} className="transition-transform duration-500 hover:-translate-y-2">
                            <PostCard post={post} />
                          </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <p className="text-slate-400 font-medium italic">No insights found in this category yet. Stay tuned!</p>
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 space-y-8">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                  <h4 className="font-bold text-slate-900 mb-4 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-lime-700" />
                    WellnessThesis
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    Exploring {categoryName.toLowerCase()} through shared discoveries. Practical tips and science-based findings for a better lifestyle.
                  </p>
                </div>
                
                <Suspense fallback={<SidebarSkeleton />}>
                  <LatestPostsSidebar />
                </Suspense>
            </aside>

        </div>
      </div>

      <section className="container mx-auto px-6 py-20">
        <NewsletterForm />
      </section>

      <Footer />
    </div>
  );
}
