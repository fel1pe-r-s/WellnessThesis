'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { SidebarAd } from './AdSlots';
import { ChevronRight, Folder } from 'lucide-react';

export default function CategoriesSidebar() {
  const { data: categories, isLoading } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-10 bg-slate-100 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
          <Folder className="w-4 h-4 text-lime-700" />
          Explore Categories
        </h4>
        <nav className="flex flex-col gap-1">
          {categories?.map((category) => (
            <Link
              key={category}
              href={`/category/${category.toLowerCase()}`}
              className="flex items-center justify-between p-3 rounded-xl text-slate-600 hover:text-lime-700 hover:bg-lime-50 transition-all group border border-transparent hover:border-lime-100"
            >
              <span className="font-semibold text-sm capitalize">{category}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
          {!categories?.length && (
            <p className="text-slate-400 text-xs italic p-2 text-center">No categories found.</p>
          )}
        </nav>
      </div>

      <SidebarAd />
    </div>
  );
}
