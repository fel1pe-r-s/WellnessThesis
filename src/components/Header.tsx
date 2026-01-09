'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ChevronDown, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { SearchDialog } from './SearchDialog';
import { useQuery } from '@tanstack/react-query';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { data: categories } = useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      return res.json();
    }
  });

  return (
    <header className="bg-white/70 backdrop-blur-xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] sticky top-0 z-50 border-b border-slate-200/50 transition-all duration-500">
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <div className="container mx-auto px-6 py-3.5">
        <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-10 h-10 drop-shadow-sm">
                <Image 
                  src="/assets/favicon.png" 
                  alt="WellnessThesis Logo" 
                  fill 
                  className="object-contain transform transition-all group-hover:scale-110 duration-500 group-hover:rotate-3"
                />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-serif">
                  Health<span className="text-lime-700 bg-clip-text text-transparent bg-gradient-to-r from-lime-700 to-lime-600">Thesis</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-10 text-sm font-bold tracking-wide text-slate-600">
              <div className="relative group">
                <button className="flex items-center gap-2 py-2 uppercase tracking-[0.15em] text-[10px] group-hover:text-lime-700 transition-all duration-300">
                  Categories
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180 text-slate-400 group-hover:text-lime-700" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white/95 backdrop-blur-lg border border-slate-200 shadow-2xl rounded-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                  <div className="grid gap-1">
                    {categories?.map((cat) => (
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

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 hover:bg-slate-100/80 rounded-full transition-all text-slate-500 hover:text-lime-700 active:scale-90" 
                  aria-label="Search"
                >
                    <Search className="w-5 h-5 stroke-[2.5px]" />
                </button>
                <Link href="#newsletter" className="ml-2 px-7 py-3 text-[13px] font-black bg-gradient-to-r from-lime-700 to-lime-600 text-white rounded-full hover:shadow-[0_8px_25px_-5px_rgba(77,124,15,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-lime-600/20 uppercase tracking-wider">
                    Subscribe
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden p-2 text-slate-600 hover:text-lime-700 transition-all active:scale-90"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-6 border-t border-slate-100 animate-in slide-in-from-top-4 duration-500 fade-in">
                <nav className="flex flex-col space-y-3 pt-6">
                    {categories?.map((item) => (
                        <Link 
                            key={item} 
                            href={`/category/${item.toLowerCase()}`}
                            className="flex items-center justify-between text-slate-700 font-bold hover:text-lime-700 px-4 py-4 rounded-xl hover:bg-lime-50/50 transition-all uppercase tracking-[0.2em] text-[10px] border border-transparent hover:border-lime-100/50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item}
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                        </Link>
                    ))}
                    <div className="pt-4">
                      <Link 
                          href="#newsletter"
                          className="block w-full text-center px-6 py-4 text-sm font-black bg-gradient-to-r from-lime-700 to-lime-600 text-white rounded-xl shadow-lg shadow-lime-700/20 uppercase tracking-widest"
                          onClick={() => setIsMobileMenuOpen(false)}
                      >
                          Subscribe to newsletter
                      </Link>
                    </div>
                </nav>
            </div>
        )}
      </div>
    </header>
  );
}
