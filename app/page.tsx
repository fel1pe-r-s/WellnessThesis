import PostCard from '@/components/PostCard';
import ProductCarousel from '@/components/ProductCarousel';
import FeaturedProductSpotlight from '@/components/FeaturedProductSpotlight';
import LatestPostsSidebar from '@/components/LatestPostsSidebar';
import PostFeed from '@/components/PostFeed';

import { getPosts, getProducts, getFeaturedPost } from '@/lib/wordpress';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const posts = await getPosts(10, 0);
  const products = await getProducts(); // This gets home page "destaque" products by default
  const stickyPost = await getFeaturedPost();

  const featuredPost = stickyPost || posts[0];
  const regularPosts = posts.filter(p => p.id !== featuredPost?.id);

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
        {products && products.length > 0 && (
          <ProductCarousel products={products} />
        )}

        {/* Main Feed Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Posts Grid */}
            <div className="lg:col-span-2">
              {regularPosts.length > 0 && (
                <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-12">
                  <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Recent Insights</h2>
                  <div className="hidden md:flex gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-lime-700 bg-lime-50 px-3 py-1 rounded-full border border-lime-100 italic">Latest Discoveries</span>
                  </div>
                </div>
              )}

              <PostFeed
                initialPosts={regularPosts}
                products={products}
                spotlightElement={<FeaturedProductSpotlight inFeed={true} />}
              />


              {regularPosts.length === 0 && !featuredPost && (
                <div className="py-20 text-center">
                  <p className="text-slate-400 font-medium italic text-lg">Our library is currently undergoing a reorganization. Check back soon for new research.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-10 flex flex-col min-h-[calc(100vh-6rem)]">
                <div className="hidden md:block">
                  <FeaturedProductSpotlight />
                </div>
                <LatestPostsSidebar />


              </div>
            </aside>

          </div>
        </section>
      </main>
    </div>
  );
}
