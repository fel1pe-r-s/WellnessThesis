'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';
import Image from 'next/image';
import { SearchDialog } from './SearchDialog';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100 transition-all duration-300">
      <SearchDialog isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10">
                <Image 
                  src="/assets/favicon.png" 
                  alt="WellnessThesis Logo" 
                  fill 
                  className="object-contain transform transition-transform group-hover:scale-110 duration-300"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900 font-serif">
                  Health<span className="text-lime-700">Thesis</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide text-slate-600">
            {/* {['Metabolism', 'Nutrition', 'Beauty', 'Fitness'].map((item) => (
                <Link 
                    key={item} 
                    href={`/category/${item.toLowerCase()}`} 
                    className="relative group py-2"
                >
                    <span className="group-hover:text-lime-700 transition-colors uppercase tracking-widest text-[11px]">{item}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-lime-700 transition-all duration-300 group-hover:w-full"></span>
                </Link>
            ))}*/}
            </nav> 

            {/* Actions */}
            <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-lime-700" 
                  aria-label="Search"
                >
                    <Search className="w-5 h-5" />
                </button>
                <Link href="#newsletter" className="ml-2 px-6 py-2.5 text-sm font-bold bg-lime-700 text-white rounded-full hover:bg-lime-800 transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                    Subscribe
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden p-2 text-slate-600 hover:text-lime-700 transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                <nav className="flex flex-col space-y-4 pt-4">
                    <hr className="border-slate-50 my-1" />
                    {['Metabolism', 'Nutrition', 'Beauty', 'Fitness'].map((item) => (
                        <Link 
                            key={item} 
                            href={`/category/${item.toLowerCase()}`}
                            className="text-slate-600 font-medium hover:text-lime-700 px-2 py-1 uppercase tracking-widest text-xs"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    <hr className="border-slate-50 my-2" />
                     <Link 
                        href="#newsletter"
                        className="w-full text-center px-6 py-3 text-sm font-bold bg-lime-700 text-white rounded-xl shadow-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Subscribe to Newsletter
                    </Link>
                </nav>
            </div>
        )}
      </div>
    </header>
  );
}
