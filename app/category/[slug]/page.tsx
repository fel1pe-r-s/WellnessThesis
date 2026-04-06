import { getPostsByCategory, getProducts } from '@/lib/wordpress';
import PostCard from '@/components/PostCard';
import ProductCarousel from '@/components/ProductCarousel';
import FeaturedProductSpotlight from '@/components/FeaturedProductSpotlight';
import LatestPostsSidebar from '@/components/LatestPostsSidebar';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Fetch posts and category details concurrently
  const [{ posts, categoryName }, products] = await Promise.all([
    getPostsByCategory(slug),
    getProducts() // All products for the carousel
  ]);

  if (!categoryName) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-grow">
        {/* Header/Breadcrumb Section */}
        <section className="bg-white border-b border-slate-200/50 py-12 lg:py-16">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <Link href="/" className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-lime-700 mb-8 transition-colors group">
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Back to All Discoveries
              </Link>

              <span className="text-lime-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">Research Category</span>
              <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 leading-tight">
                Explore <span className="text-lime-700 italic">{categoryName}</span>
              </h1>
              <p className="text-slate-500 text-lg font-medium mt-4 max-w-2xl leading-relaxed">
                A curated collection of research, protocols, and insights focused on the science of {categoryName.toLowerCase()}.
              </p>
            </div>
          </div>
        </section>

        {/* Product Showcase */}
        {products && products.length > 0 && (
          <ProductCarousel products={products} />
        )}

        {/* Home-like Feed Section */}
        <section className="container mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Posts Grid */}
            <div className="lg:col-span-2">
              {posts && posts.length > 0 ? (
                <div className="space-y-12">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                    <h2 className="text-3xl font-serif font-black text-slate-900 tracking-tight">{categoryName} Research</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {posts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm px-10">
                  <p className="text-slate-400 font-medium italic text-lg">No research found in this category yet. Check back soon for new discoveries.</p>
                  <Link href="/" className="inline-block mt-8 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest">Return to Home</Link>
                </div>
              )}
            </div>

            {/* Sidebar (Consistent with Home) */}
            <aside className="lg:col-span-1">
              <div className="sticky top-24 space-y-10 flex flex-col min-h-[calc(100vh-6rem)]">
                <div className="hidden md:block">
                  <FeaturedProductSpotlight categorySlug={slug} />
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
