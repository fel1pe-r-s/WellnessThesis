
import React from 'react';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft, User, Calendar, Tag, Clock } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function getPost(slug: string) {
  const { rows } = await query(`
    SELECT p.*, u.name as author_name 
    FROM posts p 
    LEFT JOIN users u ON p.author_id = u.id 
    WHERE p.slug = $1
  `, [slug]);
  
  return rows[0];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) return { title: 'Post Not Found' };

  return {
    title: post.title,
    description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''), // Strip HTML for desc
    openGraph: {
      images: post.image_url ? [post.image_url] : [],
    }
  };
}

export default async function PostPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === 'true';

  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // If not published and not in preview mode, hide it (simulating public access)
  // But user said "não temos aquela limitação", implying admins can see it.
  // Since we rely on the preview link, we'll allow it if isPreview is true.
  if (!post.published && !isPreview) {
     notFound();
  }

  // Format date
  const date = new Date(post.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate read time (approximate)
  const words = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.ceil(words / 200);

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Header / Nav */}
      <header className="fixed top-0 w-full z-50 bg-[#FDFBF7]/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
           <Link href="/posts" className="flex items-center gap-2 text-slate-500 hover:text-lime-700 transition-colors">
              <ArrowLeft size={20} />
              <span className="text-sm font-bold uppercase tracking-wider">Back to Dashboard</span>
           </Link>
           {isPreview && (
             <div className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-yellow-200">
               Preview Mode
             </div>
           )}
        </div>
      </header>

      <main className="pt-32 pb-20 px-6">
        <article className="max-w-3xl mx-auto space-y-12">
           {/* Hero Section */}
           <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {readTime} min read
                  </span>
                  <span className="bg-lime-50 text-lime-700 px-2 py-1 rounded-md">
                    {post.category}
                  </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 leading-tight tracking-tight">
                {post.title}
              </h1>

              {post.author_name && (
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
                   <User size={16} />
                   <span>By {post.author_name}</span>
                </div>
              )}
           </div>

           {/* Featured Image */}
           {post.image_url && (
             <div className="relative aspect-video rounded-[2rem] overflow-hidden shadow-2xl">
               <img 
                 src={post.image_url} 
                 alt={post.title} 
                 className="w-full h-full object-cover"
               />
             </div>
           )}

           {/* Content */}
           <div 
             className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:font-black prose-a:text-lime-700 hover:prose-a:text-lime-800 prose-img:rounded-2xl max-w-none"
             dangerouslySetInnerHTML={{ __html: post.content }}
           />
           
           {/* Product CTA (if linked) */}
           {post.product_id && (
              <div className="mt-16 p-8 bg-slate-900 rounded-3xl text-white text-center space-y-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                 <div className="relative z-10 space-y-6">
                    <h3 className="text-2xl font-serif font-bold">Recommended for this topic</h3>
                    <p className="text-slate-300 max-w-md mx-auto">Check out our curated selection related to this insight.</p>
                    <Link href={`/product-link/${post.product_id}`} className="inline-block px-8 py-4 bg-lime-500 text-slate-900 font-bold uppercase tracking-widest rounded-xl hover:bg-lime-400 transition-colors shadow-lg hover:shadow-lime-500/25">
                       View Product
                    </Link>
                 </div>
              </div>
           )}
        </article>
      </main>
    </div>
  );
}
