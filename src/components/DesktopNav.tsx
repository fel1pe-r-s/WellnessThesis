'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface DesktopNavProps {
  categories: string[];
}

export default function DesktopNav({ categories }: DesktopNavProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <nav className="hidden md:flex items-center space-x-10 text-sm font-bold tracking-wide text-slate-600">
      <div className="relative group">
        <button className="flex items-center gap-2 py-2 uppercase tracking-[0.15em] text-[10px] group-hover:text-lime-700 transition-all duration-300">
          Categories
          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180 text-slate-400 group-hover:text-lime-700" />
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/95 backdrop-blur-lg border border-slate-200 shadow-2xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <div className="grid gap-1">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/category/${cat.toLowerCase()}`}
                className="px-4 py-3 rounded-xl hover:bg-lime-50/80 hover:text-lime-700 transition-all duration-300 capitalize text-xs font-bold flex items-center justify-between group/item border border-transparent hover:border-lime-100/50"
              >
                {cat}
                <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
