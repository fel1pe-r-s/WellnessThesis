'use client';

import React, { useState } from 'react';
import { Post, Product } from '@/lib/types';
import PostCard from './PostCard';
import ProductCarousel from './ProductCarousel';
import { Loader2, Plus } from 'lucide-react';

interface PostFeedProps {
  initialPosts: Post[];
  products: Product[];
  spotlightElement: React.ReactNode;
}

export default function PostFeed({ initialPosts, products, spotlightElement }: PostFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialPosts.length + 1);

  const handleExploration = async () => {
    // If we have more posts already loaded than we're showing, show them first
    if (visibleCount < posts.length) {
      setVisibleCount((prev) => prev + 6);
      // If we still have less than 6 new ones to show, maybe we should fetch more too?
      if (visibleCount + 6 >= posts.length && hasMore) {
        await loadMore();
      }
    } else {
      await loadMore();
      setVisibleCount((prev) => prev + 6);
    }
  };

  const loadMore = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts?offset=${offset}&limit=6`);
      if (!res.ok) throw new Error('Failed to fetch');
      
      const newPosts = await res.json();
      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setOffset((prev) => prev + newPosts.length);
        if (newPosts.length < 6) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const visiblePosts = posts.slice(0, visibleCount);
  const firstFour = visiblePosts.slice(0, 4);
  const theRest = visiblePosts.slice(4);

  // Check if we show the button: either we have more posts hidden or the API has more
  const canShowMore = visibleCount < posts.length || hasMore;

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

      {theRest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {theRest.map((post, index) => {
            const globalIndex = index + 4; // Because theRest starts after the first 4
            const isSeventh = (globalIndex + 1) % 7 === 0;

            return (
              <React.Fragment key={post.id}>
                <PostCard post={post} />
                {isSeventh && (
                  <div className="col-span-full md:hidden my-12 -mx-6">
                    <ProductCarousel products={products} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      {canShowMore && (
        <div className="pt-12 text-center">
          <button
            onClick={handleExploration}
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

      {!canShowMore && posts.length > 0 && (
        <p className="text-center text-slate-400 font-medium italic pt-12 animate-in fade-in duration-1000">
          You have reached the end of our current archives.
        </p>
      )}
    </div>
  );
}

