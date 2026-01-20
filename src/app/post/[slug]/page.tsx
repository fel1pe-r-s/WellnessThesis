import React from 'react';
import Link from 'next/link';
import { query } from '@/lib/db';
import { Post } from '@/lib/types';
import { Clock, Tag, User, ArrowLeft, Share2 } from 'lucide-react';
import AffiliateCTA from '@/components/AffiliateCTA';
import LatestPostsSidebar from '@/components/LatestPostsSidebar';
import NewsletterForm from '@/components/NewsletterForm';
import NewsletterCTA from '@/components/NewsletterCTA';


export const dynamic = 'force-dynamic';

async function getPost(slug: string, isPreview: boolean = false): Promise<Post | null> {
  const publishedClause = isPreview ? '' : 'AND p.published = true';
  const { rows } = await query(
    `SELECT p.*, pr.name as product_name, pr.description as product_description, pr.affiliate_link as product_affiliate_link 
     FROM posts p 
     LEFT JOIN products pr ON p.product_id = pr.id 
     WHERE p.slug = $1 ${publishedClause}`,
    [slug]
  );

  
  if (rows.length === 0) return null;
  
  const row = rows[0];
  return {
    ...row,
    imageUrl: row.image_url,
    authorId: row.author_id,
    productId: row.product_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  } as Post;
}

export default async function PostPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ preview?: string }> }) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const post = await getPost(slug, isPreview);


  if (!post) {
    return (
      <div className="container mx-auto px-6 py-32 text-center">
        <h1 className="text-4xl font-serif font-black mb-8">Post Not Found</h1>
        <Link href="/" className="text-lime-700 font-bold hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <article className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-12 lg:py-20">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-lime-700 mb-12 transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Insights
          </Link>
          
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="bg-lime-700/10 text-lime-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-lime-700/10">
                {post.category}
              </span>
              <div className="h-px w-12 bg-slate-200" />
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-4 h-4" />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black text-slate-900 leading-[1.05] tracking-tight mb-8">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 pt-4">
               <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                     <User size={18} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Author</p>
                    <p className="text-sm font-bold text-slate-900">WellnessThesis Team</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-12">
            {/* Featured Image */}
            {post.imageUrl && (
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200 aspect-video relative">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Content */}
            <div 
              className="prose prose-slate prose-lg max-w-none 
                prose-headings:font-serif prose-headings:font-black prose-headings:tracking-tight
                prose-a:text-lime-700 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-900 prose-img:rounded-3xl
                text-slate-600 font-medium leading-[1.8]"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Newsletter CTA */}
            <NewsletterCTA />
          </div>

          <aside className="lg:col-span-4 space-y-10">
            {/* Related Product */}
            {post.productId && post.product_name && (
              <div className="sticky top-24 space-y-10">
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm">
                   <h4 className="text-[9px] font-black uppercase tracking-widest text-lime-700 mb-4 flex items-center gap-2">
                     <Tag className="w-3 h-3" /> Recommended Solution
                   </h4>
                   <AffiliateCTA 
                    productName={post.product_name} 
                    description={post.product_description || ''} 
                    link={post.product_affiliate_link || ''} 
                   />
                </div>
                <LatestPostsSidebar />
                <div className="bg-slate-900 rounded-[2rem] p-4 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl" />
                   <NewsletterForm variant="compact" />
                </div>
              </div>
            )}

            {!post.productId && (
              <div className="sticky top-24 space-y-10">
                <LatestPostsSidebar />
                <div className="bg-slate-900 rounded-[2rem] p-4 text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/10 rounded-full blur-2xl" />
                   <NewsletterForm variant="compact" />
                </div>
                <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-sm text-center">
                   <Share2 className="w-6 h-6 text-slate-200 mx-auto mb-3" />
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Share this discovery</p>
                   <div className="flex justify-center gap-3">
                      {['TW', 'FB', 'LI'].map(social => (
                        <div key={social} className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 hover:text-lime-700 hover:border-lime-700/30 cursor-pointer transition-all">
                          {social}
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </aside>

        </div>
      </div>
    </article>
  );
}
