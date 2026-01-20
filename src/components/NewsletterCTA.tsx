'use client';

import React, { useState } from 'react';
import { NewsletterModal } from './NewsletterModal';

export default function NewsletterCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-xl">
          <h3 className="text-3xl font-serif font-black mb-4">Never miss an insight.</h3>
          <p className="text-slate-400 font-medium mb-8">
            Join our community of wellness seekers for weekly research updates and exclusive recommendations.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-block px-10 py-5 bg-lime-700 text-white font-black rounded-2xl shadow-xl shadow-lime-900/20 hover:bg-lime-600 transition-all uppercase tracking-widest text-xs active:scale-95"
          >
            Join the Research Community
          </button>
        </div>
      </div>
      
      <NewsletterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
