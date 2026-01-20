'use client';

import React from 'react';
import { X } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal = ({ isOpen, onClose }: NewsletterModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 min-h-[100dvh]">
      {/* Soft Overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500" 
        onClick={onClose}
      />
      
      {/* Simple & Elegant Modal */}
      <div className="relative w-full max-w-md animate-in fade-in zoom-in duration-300">
        <div className="bg-white rounded-[2rem] p-8 md:p-10 text-slate-900 shadow-2xl relative overflow-hidden border border-slate-100">
           {/* Subtle decorative element */}
           <div className="absolute -top-10 -right-10 w-32 h-32 bg-lime-50 rounded-full blur-2xl pointer-events-none" />

           {/* Close Button */}
           <button 
             onClick={onClose}
             className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all active:scale-95"
           >
             <X size={18} />
           </button>

           <div className="relative z-10">
              <div className="text-center space-y-3 mb-8">
                <h3 className="text-2xl font-serif font-black tracking-tight text-slate-900">Research Updates</h3>
                <p className="text-slate-500 font-medium text-xs leading-relaxed max-w-[280px] mx-auto">
                  Weekly insights on longevity and wellness delivered with precision.
                </p>
              </div>

              <div className="space-y-4">
                <NewsletterForm variant="compact" onLight={true} />
              </div>
              
              <p className="mt-8 text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                Scientific Insights • No Spam
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
