import React from 'react';
import { getPostsUseCase, getAllProductsUseCase, subscribeNewsletterUseCase } from '@/core/use-cases';
import { 
  FileText, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Clock,
  Eye
} from 'lucide-react';

async function getStats() {
  const posts = await getPostsUseCase.execute();
  const products = await getAllProductsUseCase.execute();
  // Assume we need a way to count subscribers if not already implemented
  // For now, let's just get everything
  const recentPosts = posts.slice(0, 5);
  
  return {
    totalPosts: posts.length,
    totalProducts: products.length,
    recentPosts,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back to the HealthThesis command center.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Posts" 
          value={stats.totalPosts.toString()} 
          icon={<FileText size={24} />} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatsCard 
          title="Affiliate Products" 
          value={stats.totalProducts.toString()} 
          icon={<ShoppingBag size={24} />} 
          trend="+5%" 
          trendUp={true} 
        />
        <StatsCard 
          title="Total Views" 
          value="12.4k" 
          icon={<Eye size={24} />} 
          trend="+18%" 
          trendUp={true} 
        />
        <StatsCard 
          title="Active Sessions" 
          value="48" 
          icon={<Users size={24} />} 
          trend="-2%" 
          trendUp={false} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Clock size={20} className="text-lime-700" />
              Recent Posts
            </h2>
            <button className="text-sm font-bold text-lime-700 hover:underline">View All</button>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Title</th>
                  <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Category</th>
                  <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Status</th>
                  <th className="px-6 py-4 font-bold text-slate-400 uppercase tracking-wider text-[10px]">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentPosts.map((post) => (
                  <tr key={post.id} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                          {post.imageUrl ? (
                            <img src={post.imageUrl} alt="" className="object-cover w-full h-full" />
                          ) : (
                            <FileText size={16} className="text-slate-400" />
                          )}
                        </div>
                        <span className="font-bold text-slate-900 truncate max-w-[200px]">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-lime-700/10 text-lime-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                        Published
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upgrade/CTA Card */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-lime-700 to-lime-600 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-8 -top-8 bg-white/20 h-32 w-32 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="text-xl font-black uppercase tracking-tight mb-2">Maximize Growth</h3>
            <p className="text-sm font-medium opacity-80 mb-6">Upgrade your analytics and SEO tools for deeper mitochondrial insights.</p>
            <button className="w-full py-3 bg-white text-lime-700 font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1">
              Go Premium
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
             <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
                <TrendingUp size={20} className="text-lime-700" />
                Top Categories
             </h3>
             <div className="space-y-4">
                <CategoryProgress label="Metabolism" count={12} color="bg-lime-700" progress="75%" />
                <CategoryProgress label="Nutrition" count={8} color="bg-blue-400" progress="45%" />
                <CategoryProgress label="Fitness" count={5} color="bg-purple-400" progress="30%" />
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
