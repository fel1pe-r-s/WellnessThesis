'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
                <svg className="h-10 w-10 text-[#4D7C0F] transform transition-transform group-hover:scale-110 duration-300" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 85C30 85 15 65 15 45V15L50 5L85 15V45C85 65 70 85 50 85Z" fill="#4D7C0F" opacity="0.8" />
                    <path d="M50 15C55 15 60 20 60 25C60 30 55 35 50 35C45 35 40 30 40 25C40 20 45 15 50 15Z" fill="#4D7C0F" opacity="0.9" />
                    <path d="M50 35L50 80" stroke="#4D7C0F" strokeWidth="2" />
                    <path d="M47 30L53 30L50 38L56 38L44 50L50 42L44 42L47 30Z" fill="#FFC857" />
                </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight text-gray-900 font-serif">
                Health<span className="text-[#4D7C0F]">Thesis</span>
            </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold tracking-wide text-gray-600">
            {['Metabolism', 'Nutrition', 'Beauty', 'Fitness'].map((item) => (
                <Link 
                    key={item} 
                    href={`/category/${item.toLowerCase()}`} 
                    className="relative group py-2"
                >
                    <span className="group-hover:text-[#4D7C0F] transition-colors">{item}</span>
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#4D7C0F] transition-all duration-300 group-hover:w-full"></span>
                </Link>
            ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-[#4D7C0F]" aria-label="Search">
                    <Search className="w-5 h-5" />
                </button>
                <Link href="#newsletter" className="px-6 py-2.5 text-sm font-bold bg-[#4D7C0F] text-white rounded-full hover:bg-[#3f660c] transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                    Subscribe
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
                className="md:hidden p-2 text-gray-600 hover:text-[#4D7C0F] transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                <nav className="flex flex-col space-y-4 pt-4">
                    {['Metabolism', 'Nutrition', 'Beauty', 'Fitness'].map((item) => (
                        <Link 
                            key={item} 
                            href={`/category/${item.toLowerCase()}`}
                            className="text-gray-600 font-medium hover:text-[#4D7C0F] px-2 py-1"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {item}
                        </Link>
                    ))}
                    <hr className="border-gray-100 my-2" />
                     <Link 
                        href="#newsletter"
                        className="w-full text-center px-6 py-3 text-sm font-bold bg-[#4D7C0F] text-white rounded-xl shadow-sm"
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
