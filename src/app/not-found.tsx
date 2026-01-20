'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, HeartPulse } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-12 relative flex justify-center">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center animate-pulse">
            <HeartPulse className="text-rose-500 w-12 h-12" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="w-48 h-48 border border-rose-100 rounded-full animate-[ping_3s_infinite]" />
          </div>
        </div>

        <span className="text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">
          404 / Missing Discovery
        </span>
        <h1 className="text-4xl md:text-6xl font-serif font-black text-slate-900 mb-8 leading-tight">
          This path is still <br />
          <span className="text-rose-500 italic text-3xl md:text-5xl">uncharted territory.</span>
        </h1>
        <p className="text-slate-500 text-xl font-medium mb-12 max-w-lg mx-auto leading-relaxed">
          The insight you seek might have been archived or moved to a different research area.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <button
            onClick={() => window.location.href = '#search'}
            className="bg-white text-slate-900 border-2 border-slate-100 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
          >
            <Search className="w-4 h-4" />
            Explore Library
          </button>
        </div>

        <div className="mt-20 flex justify-center gap-8 opacity-20">
           {['BIOHACKING', 'NUTRITION', 'BEAUTY', 'FITNESS'].map(tag => (
             <span key={tag} className="text-[10px] font-black tracking-widest">{tag}</span>
           ))}
        </div>
      </div>
    </div>
  );
}
