'use client';

import React, { useState } from 'react';
import { Post } from '@/lib/types';
import PostCard from './PostCard';
import { Loader2, Plus } from 'lucide-react';

interface PostFeedProps {
  initialPosts: Post[];
  spotlightElement: React.ReactNode;
}

export default function PostFeed({ initialPosts, spotlightElement }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialPosts.length + 1);

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts?offset=${offset}&limit=6`);
 // +1 to skip the featured post if offset includes it
      if (!res.ok) throw new Error('Failed to fetch');
      
      const newPosts = await res.json();
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setOffset((prev) => prev + newPosts.length);
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const firstFour = posts.slice(0, 4);
  const theRest = posts.slice(4);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {firstFour.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {firstFour.length >= 4 && spotlightElement && (
        <div className="my-16 md:hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {spotlightElement}
        </div>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {theRest.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="pt-12 text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white border border-slate-200 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-slate-900 hover:border-lime-700 hover:text-lime-700 transition-all active:scale-95 disabled:opacity-50 shadow-sm hover:shadow-xl"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-lime-700" />
            ) : (
              <>
                Continue Exploration
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              </>
            )}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-slate-400 font-medium italic pt-12">
          You have reached the end of our current archives.
        </p>
      )}
    </div>
  );
}
