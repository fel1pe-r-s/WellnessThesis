'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Home, Dumbbell, MoveRight } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
        
        {/* Visual Section */}
        <div className="md:w-1/2 bg-slate-900 relative p-12 flex flex-col justify-between overflow-hidden min-h-[400px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-lime-700/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-lime-700 rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-lg shadow-lime-900/20">
              <Dumbbell className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-serif font-black text-white leading-[1.1] mb-6">
              Even heroes <br />
              <span className="text-lime-500 italic">need a break.</span>
            </h1>
            <p className="text-slate-400 font-medium text-lg max-w-xs leading-relaxed">
              We encountered a minor obstacle in our research. Let's redirect our energy and try again.
            </p>
          </div>

          <div className="relative z-10 mt-auto">
             <div className="flex gap-4">
                <div className="w-3 h-3 rounded-full bg-lime-700" />
                <div className="w-3 h-3 rounded-full bg-lime-700/30" />
                <div className="w-3 h-3 rounded-full bg-lime-700/30" />
             </div>
          </div>

          {/* Abstract Image Concept via CSS/Icons since I can't guarantee asset presence */}
          <div className="absolute right-[-10%] bottom-[-5%] opacity-10 scale-150 rotate-[-15deg]">
             <Dumbbell size={300} className="text-white" />
          </div>
        </div>

        {/* Action Section */}
        <div className="md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
          <span className="text-lime-700 text-[10px] font-black uppercase tracking-[0.2em] mb-4 block">
            Error Code: 503 / Service Unavailable
          </span>
          <h2 className="text-3xl font-serif font-black text-slate-900 mb-8 leading-tight">
            Our systems are catching their breath.
          </h2>
          
          <div className="space-y-6">
            <button
              onClick={() => reset()}
              className="w-full bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all group active:scale-95 shadow-xl shadow-slate-900/10"
            >
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
              Attempt Recalibration
            </button>
            
            <Link
              href="/"
              className="w-full bg-white text-slate-900 border-2 border-slate-100 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95"
            >
              <Home className="w-4 h-4" />
              Return to Base
            </Link>
          </div>

          <div className="mt-12 pt-12 border-t border-slate-100 italic">
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              "Every setback is a setup for an even stronger comeback." 
              <span className="block mt-2 font-bold text-slate-500 not-italic uppercase tracking-widest text-[10px]">
                — WellnessThesis Team
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
