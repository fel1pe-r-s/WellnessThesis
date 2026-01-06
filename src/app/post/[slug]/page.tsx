import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SidebarAd from '@/components/SidebarAd';
import AffiliateCTA from '@/components/AffiliateCTA';
import ProductCarousel from '@/components/ProductCarousel';
import { getPostBySlugUseCase } from '@/core/use-cases';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlugUseCase.execute(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans text-gray-900">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Article */}
          <article className="lg:col-span-8 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <header className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#4D7C0F]/10 text-[#4D7C0F] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {post.category || 'Wellness'}
                  </span>
                  <span className="text-gray-400 text-sm">•</span>
                  <span className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-serif leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center text-gray-500 text-sm gap-3 border-b border-gray-100 pb-8">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    {/* Placeholder for author image */}
                    <div className="w-full h-full bg-[#4D7C0F] flex items-center justify-center text-white font-bold">HT</div>
                </div>
                <div>
                     <p className="font-bold text-gray-900 uppercase text-xs tracking-wide">HealthThesis Editorial</p>
                     <p className="text-xs">Medically Reviewed</p>
                </div>
              </div>
            </header>

            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="w-full h-[400px] object-cover rounded-xl mb-12 shadow-md" />
            )}

            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed font-serif prose-headings:font-bold prose-a:text-[#4D7C0F] prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {post.ctaLink && (
              <AffiliateCTA 
                productName="Mitolyn" // Dynamic later
                description="Discover the natural method to reset your mitochondrial clock."
                link={post.ctaLink}
              />
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
             <SidebarAd category={post.category} />
             
             {/* Fallback "About" Widget */}
             <div className="bg-[#4D7C0F] p-8 rounded-2xl text-white text-center">
                <h4 className="font-serif font-bold text-xl mb-2">About HealthThesis</h4>
                <p className="opacity-90 text-sm mb-6">Demystifying wellness with science-backed insights for longevity and vitality.</p>
                <Link href="/about" className="inline-block bg-white text-[#4D7C0F] px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors">
                    Our Mission
                </Link>
             </div>
          </aside>
        </div>
      </div>

      <ProductCarousel />
      <Footer />
    </div>
  );
}
