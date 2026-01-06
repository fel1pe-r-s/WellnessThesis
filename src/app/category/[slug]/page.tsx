import React from 'react';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import SidebarAd from '@/components/SidebarAd';
import NewsletterForm from '@/components/NewsletterForm';
import { getPostsByCategoryUseCase } from '@/core/use-cases';

export const dynamic = 'force-dynamic';

async function getCategoryPosts(category: string) {
    return getPostsByCategoryUseCase.execute(category);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const category = slug.charAt(0).toUpperCase() + slug.slice(1);
    return {
        title: `${category} Articles | HealthThesis`,
        description: `Explore our latest science-based articles on ${category}.`,
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
    <div className="bg-background dark:bg-[#0f1715] min-h-screen font-sans text-foreground dark:text-gray-100 transition-colors duration-300">
      <Header />
      
      <div className="bg-surface dark:bg-[#1a2421] border-b border-border dark:border-[#2a3d38] py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-4">{categoryName}</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Curated insights and scientific breakthroughs in {categoryName.toLowerCase()}.
        </p>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8">
                {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {posts.map((post) => (
                             <article key={post.id} className="bg-surface dark:bg-[#1a2421] rounded-2xl shadow-sm border border-border dark:border-[#2a3d38] overflow-hidden hover:shadow-md transition-shadow group">
                                <Link href={`/post/${post.slug}`}>
                                    <div className="aspect-video overflow-hidden bg-gray-100">
                                        <img 
                                            src={post.imageUrl || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=600'} 
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <span className="text-xs font-bold text-[#4D7C0F] uppercase tracking-wider mb-2 block">
                                            {post.category}
                                        </span>
                                         <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-3 group-hover:text-[#4D7C0F] dark:group-hover:text-[#5ea40d] transition-colors">
                                             {post.title}
                                         </h3>
                                         <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                                            {/* Strip HTML roughly */}
                                            {post.content.replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                                        </p>
                                         <span className="text-sm font-bold text-gray-900 dark:text-gray-100 underline decoration-[#FFC857] dark:decoration-[#5ea40d] decoration-2 underline-offset-2">
                                             Read Article
                                         </span>
                                    </div>
                                </Link>
                             </article>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-surface dark:bg-[#1a2421] rounded-2xl border border-dashed border-border dark:border-[#2a3d38]">
                        <p className="text-gray-500 text-lg">No articles found in this category yet.</p>
                        <Link href="/" className="text-[#4D7C0F] font-bold mt-4 inline-block hover:underline">
                            Return Home
                        </Link>
                    </div>
                )}
            </div>

            <aside className="lg:col-span-4 space-y-8">
                <SidebarAd category={categoryName} />
            </aside>

        </div>
      </div>

      <div className="container mx-auto px-6">
        <NewsletterForm />
      </div>

      <Footer />
    </div>
  );
}
