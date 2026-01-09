'use client';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: async (email: string) => {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.error || 'Failed to subscribe');
      }
      return res.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) mutation.mutate(email);
  };

  return (
    <div id="newsletter" className="bg-white/50 backdrop-blur-md border border-slate-200/50 rounded-[2.5rem] p-10 md:p-20 text-center text-slate-900 my-20 relative overflow-hidden transition-all duration-500 shadow-xl shadow-slate-200/20">
      {/* Decorative premium elements */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-lime-700/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
      <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-lime-700/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-lime-100/50 text-lime-700 text-[10px] uppercase font-black tracking-[0.2em] mb-6">
          WELLNESS THESIS NEWSLETTER
        </span>
        <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 text-slate-900 leading-tight">
          Join the <span className="text-lime-700 italic">Inner Circle</span>
        </h2>
        <p className="text-slate-500 text-lg mb-10 leading-relaxed font-medium">
          Get weekly insights on metabolic efficiency, skin health, and longevity science. <span className="text-slate-900 font-bold">No spam, just helpful content for your well-being.</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto relative group/form">
          <input
            type="email"
            placeholder="Your best email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mutation.isPending || mutation.isSuccess}
            className="flex-1 px-8 py-5 rounded-2xl text-slate-900 bg-white shadow-inner border border-slate-200 focus:outline-[3px] focus:outline-lime-700/20 transition-all disabled:opacity-70 font-medium placeholder:text-slate-400"
            required
          />
          <button
            type="submit"
            disabled={mutation.isPending || mutation.isSuccess}
            className="bg-gradient-to-br from-lime-700 to-lime-600 text-white font-black py-5 px-10 rounded-2xl hover:shadow-[0_10px_30px_-5px_rgba(77,124,15,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe'}
          </button>
        </form>

        {mutation.isSuccess && (
          <div className="mt-8 flex items-center justify-center gap-3 text-lime-700 font-black animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-lg">Welcome to the inner circle!</span>
          </div>
        )}

        {mutation.isError && (
          <div className="mt-8 flex items-center justify-center gap-2 text-red-600 font-bold animate-in fade-in slide-in-from-bottom-2">
             <AlertCircle className="w-5 h-5" />
             <span>{mutation.error.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
