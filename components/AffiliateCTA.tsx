'use client';

import React from 'react';
import { ArrowRight, ShoppingBag } from 'lucide-react';

interface AffiliateCTAProps {
  productName: string;
  description: string;
  link: string;
  buttonText?: string;
}

export default function AffiliateCTA({ 
  productName, 
  description, 
  link, 
  buttonText = "Claim Your Discount" 
}: AffiliateCTAProps) {
  return (
    <div className="bg-slate-50 border-2 border-slate-200 p-8 md:p-10 rounded-2xl my-12 relative overflow-hidden group shadow-xl transition-all duration-500">
      {/* Decorative background element */}
      <div className="absolute -right-12 -top-12 bg-[#13eca4]/10 h-48 w-48 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <span className="text-lime-700 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block">Exclusive Offer</span>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight leading-tight">
            Boost Your Results with {productName}
          </h2>
          <p className="text-slate-600 text-lg font-medium leading-relaxed mb-8 max-w-xl">
            {description}
          </p>
          <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-lime-700 text-white px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-wider hover:bg-lime-800 transition-all transform hover:-translate-y-1 hover:shadow-lg active:scale-95"
          >
            {buttonText} <ArrowRight className="w-6 h-6" />
          </a>
        </div>
        
        <div className="md:w-1/3 flex justify-center">
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-inner transform rotate-6 hover:rotate-0 transition-transform duration-700 group-hover:border-lime-700/50">
                <ShoppingBag className="w-24 h-24 text-lime-700 opacity-80" />
            </div>
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Verified Solution</span>
        <span>Science-Backed Formula</span>
      </div>
    </div>
  );
}
