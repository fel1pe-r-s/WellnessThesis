import { getPostsUseCase } from '@/core/use-cases';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { TopAd, InFeedAd, SidebarAd } from '@/components/AdSlots';
import NewsletterForm from '@/components/NewsletterForm';
import ProductCarousel from '@/components/ProductCarousel';
import FeaturedProductSpotlight from '@/components/FeaturedProductSpotlight';

export const dynamic = 'force-dynamic';

async function getPosts() {
  return getPostsUseCase.execute();
}

export default async function HomePage() {
  const posts = await getPosts();
  const heroPost = posts[0];
  const gridPosts = posts.slice(1);

  return (
    <div className="bg-white min-h-screen font-sans text-slate-900 transition-colors duration-300">
      {/* AD SPOT 1: Top Notification Bar */}
      {/* <div className="bg-gray-900 text-white text-xs md:text-sm py-2 text-center px-4">
        <p>
          <span className="font-bold text-[#FFC857] uppercase mr-2">Trend Alert:</span>
          New research on mitochondrial efficiency released.
          <Link href="/mytolin" className="underline hover:text-[#FFC857] ml-1 transition-colors">Read the Report &rarr;</Link>
        </p>
      </div> */}

      <Header />

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            
            {/* Hero Post */}
            {heroPost ? (
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 mb-12">
                <img 
                  src={heroPost.imageUrl || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80"} 
                  alt={heroPost.title} 
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="p-8">
                  <div className="flex items-center text-sm text-lime-700 font-bold mb-3 uppercase tracking-wider">
                    {heroPost.category || 'Wellness'} • Editor&apos;s Choice
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-serif">
                    <Link href={`/post/${heroPost.slug}`} className="hover:text-lime-700 transition-colors">
                      {heroPost.title}
                    </Link>
                  </h1>
                  <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                    {heroPost.content ? heroPost.content.replace(/<[^>]*>?/gm, '').substring(0, 200) : ''}...
                  </p>
                  <Link href={`/post/${heroPost.slug}`} className="bg-lime-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-lime-800 transition-colors duration-300 inline-block shadow-md">
                    Read Full Report
                  </Link>
                </div>
              </article>
            ) : (
                <div className="bg-white rounded-2xl p-12 text-center mb-12 border border-dashed border-gray-300">
                    <p className="text-gray-500 italic">Welcome to HealthThesis. Start by adding your first post in the admin panel.</p>
                </div>
            )}

            <h3 className="text-2xl font-bold text-slate-900 mb-8 border-b-2 border-slate-100 pb-2 font-serif">Latest Insights</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {gridPosts.map((post, index) => (
                <React.Fragment key={post.id}>
                  <article className="flex flex-col bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                    <img 
                      src={post.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80"} 
                      className="rounded-lg h-48 object-cover mb-4"
                    />
                    <h3 className="text-xl font-bold text-slate-900 mb-2 font-serif">{post.title}</h3>
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                       {post.content ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 100) : ''}...
                    </p>
                    <Link href={`/post/${post.slug}`} className="text-lime-700 font-bold text-sm mt-auto">Read More &rarr;</Link>
                  </article>
                  {/* Insert native ad after the first small article post */}
                  {index === 0 && <InFeedAd />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-4 uppercase text-xs tracking-wider">About HealthThesis</h4>
              <p className="text-slate-600 text-sm leading-relaxed">
                Practical tips and insights on wellness, nutrition, beauty, and healthy living to help you feel your best every day.
              </p>
            </div>

            <div className="sticky top-24">
              <FeaturedProductSpotlight />
              
              <div className="mt-8">
                <SidebarAd />
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="container mx-auto px-6">
           <NewsletterForm />
      </div>

      <ProductCarousel />

      <Footer />
    </div>
  );
}
