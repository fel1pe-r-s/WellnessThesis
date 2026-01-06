'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, Zap } from 'lucide-react';

export default function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user already saw this in this session
    const hasSeen = localStorage.getItem('newsletter_popup_seen');
    if (hasSeen) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsOpen(true);
        localStorage.setItem('newsletter_popup_seen', 'true');
        document.removeEventListener('mouseleave', handleMouseLeave);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setIsSubscribed(true);
        setTimeout(() => setIsOpen(false), 3000);
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-500">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 duration-700">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#13eca4]/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#13eca4]/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>
        
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors p-2 z-20"
        >
          <X size={24} strokeWidth={3} />
        </button>

        <div className="p-8 md:p-12 text-center relative z-10">
          {!isSubscribed ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-lime-700 text-white rounded-2xl mb-8 shadow-lg rotate-3">
                <Sparkles size={32} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-tight">
                Wait! Your Mitochondria Aren't Recharged Yet
              </h2>
              <p className="text-slate-600 text-lg font-medium mb-10 max-w-md mx-auto">
                Join 10,000+ biological explorers receiving weekly deep-dives into cellular efficiency and longevity.
              </p>
              
              <form onSubmit={handleSubmit} className="relative max-w-sm mx-auto group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="enter your access point (email)"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-8 py-5 rounded-2xl focus:border-lime-700 transition-all outline-none text-sm font-bold placeholder:text-slate-400"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="absolute right-2 top-2 bottom-2 bg-lime-700 text-white px-6 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-lime-800 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? 'Joining...' : (
                    <>
                      Join <Zap size={14} fill="currentColor" />
                    </>
                  )}
                </button>
              </form>
              <p className="mt-6 text-[10px] font-bold text-[#61897c] uppercase tracking-widest opacity-60">
                Zero spam. Pure science. Unsubscribe in 1-click.
              </p>
            </>
          ) : (
            <div className="py-12 animate-in zoom-in-95 duration-500">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-lime-50 text-lime-700 rounded-full mb-8 border-2 border-lime-700">
                <Send size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">
                Access Granted!
              </h2>
              <p className="text-slate-600 text-lg font-medium">
                Welcome to the frontier. Check your inbox for your first scientific briefing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
