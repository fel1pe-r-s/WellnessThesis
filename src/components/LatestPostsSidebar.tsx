import Link from 'next/link';
import { Clock, BookOpen } from 'lucide-react';
import { Post } from '@/core/domain/entities';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

export default async function LatestPostsSidebar() {
  let posts: Post[] = [];
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, slug, imageUrl, createdAt FROM posts WHERE published = 1 ORDER BY createdAt DESC LIMIT 5'
    );
    posts = rows.map(row => ({
      ...row,
      createdAt: new Date(row.createdAt),
    })) as Post[];
  } catch (error) {
    console.error('Error fetching sidebar posts:', error);
  }

  return (
    <div className="space-y-8">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
        <h4 className="font-bold text-slate-900 mb-6 uppercase text-[10px] tracking-[0.2em] flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-lime-700" />
          Recent Articles
        </h4>
        <div className="flex flex-col gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/post/${post.slug}`}
              className="flex gap-4 group cursor-pointer"
            >
              <div className="relative w-16 h-16 overflow-hidden rounded-lg shrink-0 border border-slate-100">
                <img
                  src={post.imageUrl || "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=100&q=80"}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <h5 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-lime-700 transition-colors">
                  {post.title}
                </h5>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 font-medium">
                  <Clock className="w-3 h-3" />
                  {new Date(post.createdAt || '').toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short'
                  })}
                </div>
              </div>
            </Link>
          ))}
          {posts.length === 0 && (
            <p className="text-slate-400 text-xs italic text-center py-4">Stay tuned for new articles!</p>
          )}
        </div>
      </div>
    </div>
  );
}
