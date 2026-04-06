'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Post } from '@/lib/types';

export function SearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [queryText, setQueryText] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (queryText.length < 2) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/posts/search?q=${encodeURIComponent(queryText)}`);
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 300);
    return () => clearTimeout(timer);
  }, [queryText]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 sm:pt-32">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
        <div className="flex items-center p-4 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search articles, topics, and research..."
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 placeholder:text-slate-400"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 Transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-lime-700" />
            </div>
          ) : results && results.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-4">Results</p>
              {results.map((post: any) => (
                <Link 
                  key={post.id}
                  href={`/post/${post.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <img 
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=200'}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 group-hover:text-lime-700 transition-colors line-clamp-1">
                      {post.title}
                    </h4>
                    <p className="text-xs text-slate-500 uppercase font-semibold">{post.category}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
              ))}
            </div>
          ) : queryText.length >= 2 ? (
            <div className="py-12 text-center text-gray-500">
              No articles found for &quot;{queryText}&quot;
            </div>
          ) : (
            <div className="py-12 text-center text-gray-400">
              <p className="text-sm">Type at least 2 characters to search...</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                 {['Metabolism', 'Mitochondria', 'Nutrition', 'Beauty'].map(tag => (
                   <button 
                    key={tag}
                    onClick={() => setQueryText(tag)}
                    className="px-3 py-1 bg-slate-50 rounded-full text-xs hover:bg-lime-700/10 hover:text-lime-700 transition-colors border border-slate-100"
                   >
                     {tag}
                   </button>
                 ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
           <span>Press <kbd className="font-sans border border-slate-200 px-1 rounded shadow-sm bg-white">ESC</kbd> to close</span>
           <span className="font-bold text-lime-700">WellnessThesis Search</span>
        </div>
      </div>
    </div>
  );
}
