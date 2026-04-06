'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { Category } from '@/lib/types';

interface MobileNavProps {
  categories: Category[];
  onClose: () => void;
}

export default function MobileNav({ categories, onClose }: MobileNavProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="md:hidden mt-4 pb-6 border-t border-slate-100 animate-in slide-in-from-top-4 duration-500 fade-in">
      <nav className="flex flex-col space-y-3 pt-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="flex items-center justify-between text-slate-700 font-bold hover:text-lime-700 px-4 py-4 rounded-xl hover:bg-lime-50/50 transition-all uppercase tracking-[0.2em] text-[10px] border border-transparent hover:border-lime-100/50"
            onClick={onClose}
          >
            {cat.name}
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </Link>
        ))}

      </nav>
    </div>
  );
}
