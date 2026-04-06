'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search } from 'lucide-react';
import { SearchDialog } from './SearchDialog';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';

import { Category } from '@/lib/types';

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNewsletterOpen, setIsNewsletterOpen] = useState(false);

  return (
    <header className="bg-white shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] sticky top-0 z-50 border-b border-slate-200 transition-all duration-500">
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
                sizes="40px"
                className="object-contain transform transition-all group-hover:scale-110 duration-500 group-hover:rotate-3"
              />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-serif">
              Wellness<span className="text-lime-700 bg-clip-text text-transparent bg-gradient-to-r from-lime-700 to-lime-600">Thesis</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <DesktopNav categories={categories} />

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 hover:bg-slate-100/80 rounded-full transition-all text-slate-500 hover:text-lime-700 active:scale-90"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[2.5px]" />
            </button>
            <button
              onClick={() => setIsNewsletterOpen(true)}
              className="ml-2 px-7 py-3 text-[13px] font-black bg-gradient-to-r from-lime-700 to-lime-600 text-white rounded-full hover:shadow-[0_8px_25px_-5px_rgba(77,124,15,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 border border-lime-600/20 uppercase tracking-wider"
            >
              Subscribe
            </button>
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
          <MobileNav categories={categories} onClose={() => setIsMobileMenuOpen(false)} />
        )}
      </div>
    </header>
  );
}
