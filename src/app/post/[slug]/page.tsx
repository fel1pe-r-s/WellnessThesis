import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SidebarAd from '@/components/SidebarAd';
import AffiliateCTA from '@/components/AffiliateCTA';
import ProductCarousel from '@/components/ProductCarousel';
import { getPostBySlugUseCase, getRelatedPostsUseCase } from '@/core/use-cases';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlugUseCase.execute(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPostsUseCase.execute(post.category || '', post.id);

  return (
    <div className="bg-background dark:bg-[#0f1715] min-h-screen font-sans text-foreground dark:text-gray-100 transition-colors duration-300">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article */}
          <article className="lg:col-span-8 bg-surface dark:bg-[#1a2421] p-8 md:p-12 rounded-2xl shadow-sm border border-border dark:border-[#2a3d38]">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#13eca4]/10 dark:bg-[#13eca4]/20 text-[#111816] dark:text-[#13eca4] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {post.category || 'Wellness'}
                  </span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-serif leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm gap-3 border-b border-gray-100 dark:border-[#2a3d38] pb-8">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    {/* Placeholder for author image */}
                    <div className="w-full h-full bg-[#13eca4] flex items-center justify-center text-[#111816] font-bold">HT</div>
                </div>
                <div>
                     <p className="font-bold text-gray-900 dark:text-gray-200 uppercase text-xs tracking-wide">HealthThesis Editorial</p>
                     <p className="text-xs">Medically Reviewed</p>
                </div>
              </div>
            </header>

            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="w-full h-[400px] object-cover rounded-xl mb-12 shadow-md" />
            )}

            <div 
              className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed font-serif prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-a:text-[#13eca4] dark:prose-a:text-[#13eca4] prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.product && (
              <AffiliateCTA 
                productName={post.product.name}
                description={post.product.description || "Discover the natural path to wellness."}
                link={post.product.affiliateLink}
              />
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
             <SidebarAd category={post.category} />
             
             {/* Fallback "About" Widget */}
             <div className="bg-[#4D7C0F] dark:bg-[#1a2421] border border-transparent dark:border-[#2a3d38] p-8 rounded-2xl text-white text-center">
                <h4 className="font-serif font-bold text-xl mb-2">About HealthThesis</h4>
                <p className="opacity-90 text-sm mb-6">Demystifying wellness with science-backed insights for longevity and vitality.</p>
                <Link href="/about" className="inline-block bg-white text-[#4D7C0F] px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                    Our Mission
                </Link>
             </div>
          </aside>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-20">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 font-serif">Recommended Reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/post/${related.slug}`} className="group">
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shadow-sm border border-gray-100 dark:border-[#2a3d38]">
                    <img 
                      src={related.imageUrl || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200'} 
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-[#13eca4] dark:text-[#13eca4] text-[10px] font-bold uppercase tracking-wider mb-2">
                    {related.category || 'Wellness'}
                  </p>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-[#13eca4] dark:group-hover:text-[#13eca4] transition-colors line-clamp-2">
                    {related.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <ProductCarousel />
      <Footer />
    </div>
  );
}
