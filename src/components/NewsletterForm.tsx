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
    <div id="newsletter" className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-16 text-center text-slate-900 my-16 relative overflow-hidden transition-colors duration-300">
      {/* Decorative circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-lime-700/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-lime-700/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-slate-900">
          Join the Inner Circle
        </h2>
        <p className="text-slate-600 text-lg mb-8">
          Get weekly insights on metabolic efficiency, skin health, and longevity science. No spam, just value.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-md mx-auto relative">
          <input
            type="email"
            placeholder="Your best email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={mutation.isPending || mutation.isSuccess}
            className="flex-1 px-6 py-4 rounded-full text-slate-900 bg-white border border-slate-200 focus:outline-none focus:ring-4 focus:ring-lime-700/10 disabled:opacity-70"
            required
          />
          <button
            type="submit"
            disabled={mutation.isPending || mutation.isSuccess}
            className="bg-lime-700 text-white font-bold py-4 px-8 rounded-full hover:bg-lime-800 transition-all transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-lg"
          >
            {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe'}
          </button>
        </form>

        {mutation.isSuccess && (
          <div className="mt-4 flex items-center justify-center gap-2 text-lime-700 font-bold animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle className="w-5 h-5" />
            <span>Successfully subscribed! Welcome aboard.</span>
          </div>
        )}

        {mutation.isError && (
          <div className="mt-4 flex items-center justify-center gap-2 text-red-200 font-bold animate-in fade-in slide-in-from-bottom-2">
             <AlertCircle className="w-5 h-5" />
             <span>{mutation.error.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
