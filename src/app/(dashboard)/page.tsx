import React, { Suspense } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Clock,
  Edit,
  Star
} from 'lucide-react';
import pool from '@/lib/db';

import { Post, Product } from '@/core/domain/entities';

export const dynamic = 'force-dynamic';

async function getStats() {
  // Real stats from DB
  const { rows: postRows } = await pool.query('SELECT COUNT(*) as count FROM posts');
  const postCount = parseInt(postRows[0].count);

  const { rows: productRows } = await pool.query('SELECT COUNT(*) as count FROM products');
  const productCount = parseInt(productRows[0].count);

  const { rows: subscriberRows } = await pool.query('SELECT COUNT(*) as count FROM subscribers');
  const subscriberCount = parseInt(subscriberRows[0].count);
  
  // Real Recent Posts
  const { rows: recentPostsRows } = await pool.query(
    'SELECT * FROM posts ORDER BY created_at DESC LIMIT 5'
  );
  
  const recentPosts = recentPostsRows.map((row: any) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    imageUrl: row.image_url,
    category: row.category,
    published: row.published,
    authorId: row.author_id,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  })) as Post[];

  // Real Top Categories
  const { rows: categoryRows } = await pool.query(
    'SELECT category, COUNT(*) as count FROM posts GROUP BY category ORDER BY count DESC LIMIT 3'
  );

  const topCategories = categoryRows.map((row: any) => ({
    label: row.category,
    count: parseInt(row.count),
    progress: (postCount > 0 ? Math.min((parseInt(row.count) / postCount) * 100, 100) : 0) + '%'
  }));

  // Featured Product
  const { rows: featuredRows } = await pool.query(
    'SELECT * FROM products WHERE is_featured = true LIMIT 1'
  );
  
  let featuredProduct: Product | null = null;
  if (featuredRows.length > 0) {
      const row = featuredRows[0];
      featuredProduct = {
          id: row.id,
          name: row.name,
          description: row.description,
          imageUrl: row.image_url,
          secondaryImageUrl: row.secondary_image_url,
          affiliateLink: row.affiliate_link,
          category: row.category,
          isFeatured: row.is_featured,
          createdAt: row.created_at,
          updatedAt: row.updated_at
      };
  }
  
  return {
    totalPosts: postCount,
    totalProducts: productCount,
    totalSubscribers: subscriberCount,
    recentPosts,
    topCategories,
    featuredProduct
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium">Monitoring the WellnessThesis ecosystem.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/posts/new" className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2">
            <FileText size={14} /> New Post
          </Link>
          <Link href="/products/new" className="px-4 py-2 bg-white border border-slate-200 text-slate-900 text-xs font-bold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2">
            <ShoppingBag size={14} /> Add Product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Posts" 
          value={stats.totalPosts.toString()} 
          icon={<FileText size={20} />} 
          trend="Lifetime" 
        />
        <StatsCard 
          title="Affiliate Products" 
          value={stats.totalProducts.toString()} 
          icon={<ShoppingBag size={20} />} 
          trend="Lifetime" 
        />
        <StatsCard 
          title="Subscribers" 
          value={stats.totalSubscribers.toString()} 
          icon={<Users size={20} />} 
          trend="Community" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-serif font-black flex items-center gap-2 text-slate-900">
              <Clock size={20} className="text-lime-700" />
              Recent Insights
            </h2>
            <Link href="/posts" className="text-xs font-black text-lime-700 uppercase tracking-widest hover:underline">View All</Link>
          </div>
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[9px]">Insight</th>
                    <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[9px]">Category</th>
                    <th className="px-6 py-4 font-black text-slate-400 uppercase tracking-widest text-[9px]">Date</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentPosts.map((post) => (
                    <tr key={post.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 shrink-0">
                            {post.imageUrl ? (
                              <img src={post.imageUrl} alt="" className="object-cover w-full h-full" />
                            ) : (
                              <FileText size={16} className="text-slate-400" />
                            )}
                          </div>
                          <span className="font-bold text-slate-900 truncate max-w-[180px]">{post.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-lime-100 text-lime-700 rounded-md text-[9px] font-black uppercase tracking-wider">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs font-medium">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/posts/edit/${post.id}`} className="p-2 text-slate-400 hover:text-lime-700 transition-colors inline-block">
                          <Edit size={16} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {stats.recentPosts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">No posts yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Featured Product Management Card */}
          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 bg-lime-500/20 h-40 w-40 rounded-full blur-3xl group-hover:bg-lime-500/30 transition-colors duration-700"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6">
                <Star size={16} className="text-lime-500 fill-lime-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-lime-500">Active Spotlight</span>
              </div>

              {stats.featuredProduct ? (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/10 overflow-hidden shrink-0">
                      <img 
                        src={stats.featuredProduct.imageUrl || ''} 
                        alt={stats.featuredProduct.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg leading-tight line-clamp-2">{stats.featuredProduct.name}</h3>
                      <p className="text-xs text-white/50 font-medium mt-1 uppercase tracking-wider">{stats.featuredProduct.category}</p>
                    </div>
                  </div>
                  
                  <Link 
                    href={`/products/edit/${stats.featuredProduct.id}`}
                    className="w-full py-4 bg-white text-slate-900 font-black rounded-2xl shadow-lg hover:bg-lime-500 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                  >
                    Edit Featured Product <Edit size={14} />
                  </Link>
                </div>
              ) : (
                <div className="py-4 text-center">
                  <p className="text-sm text-white/50 mb-6 italic">No product is currently featured in the spotlight.</p>
                  <Link 
                    href="/products"
                    className="w-full py-4 bg-white/10 text-white font-black rounded-2xl border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]"
                  >
                    Select Featured
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
             <h3 className="text-lg font-serif font-black mb-6 flex items-center gap-2 text-slate-900">
                <TrendingUp size={20} className="text-lime-700" />
                Top Content Area
             </h3>
             <div className="space-y-6">
                {stats.topCategories.map((cat, i) => (
                  <CategoryProgress 
                    key={cat.label}
                    label={cat.label} 
                    count={cat.count} 
                    color={i === 0 ? "bg-lime-600" : i === 1 ? "bg-slate-400" : "bg-slate-200"} 
                    progress={cat.progress} 
                  />
                ))}
                {stats.topCategories.length === 0 && (
                  <p className="text-sm text-slate-400 italic">No category data available.</p>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend, trendUp }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-lime-700/30 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-lime-700 transition-colors border border-slate-100">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
          {trend}
          {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </div>
      </div>
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function CategoryProgress({ label, count, color, progress }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-bold">
        <span className="text-slate-900">{label}</span>
        <span className="text-slate-500">{count} posts</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-1000`} style={{ width: progress }}></div>
      </div>
    </div>
  );
}
