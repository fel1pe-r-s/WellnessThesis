import Link from 'next/link';
import { Clock, BookOpen } from 'lucide-react';
import { getPosts } from '@/lib/wordpress';


export default async function LatestPostsSidebar() {
  let posts = [];
  try {
    posts = await getPosts(5, 0); // limiting to 5 for the sidebar
  } catch (error) {
    console.error('Error fetching sidebar posts:', error);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
        <h4 className="font-bold text-slate-900 mb-4 uppercase text-[9px] tracking-[0.2em] flex items-center gap-2">
          <BookOpen className="w-3 h-3 text-lime-700" />
          Recent Articles
        </h4>
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="flex gap-3 group cursor-pointer"
            >
              <div className="relative w-12 h-12 overflow-hidden rounded-xl shrink-0 border border-slate-100 shadow-sm">
                <img
                  src={post.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h5 className="text-[12px] font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-lime-700 transition-colors">
                  {post.title}
                </h5>
                <div className="flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                  {new Date(post.createdAt || '').toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </div>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-slate-400 text-[10px] italic text-center py-2">Stay tuned for new research.</p>
          )}
        </div>
      </div>
    </div>
  );
}
