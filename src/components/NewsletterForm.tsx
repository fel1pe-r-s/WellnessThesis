'use client';
import { useState } from 'react';
export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsPending(true);
    setError(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to subscribe');
      }

      setIsSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsPending(false);
    }
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
            disabled={isPending || isSuccess}
            className="flex-1 px-8 py-5 rounded-2xl text-slate-900 bg-white shadow-inner border border-slate-200 focus:outline-[3px] focus:outline-lime-700/20 transition-all disabled:opacity-70 font-medium placeholder:text-slate-400"
            required
          />
          <button
            type="submit"
            disabled={isPending || isSuccess}
            className="bg-gradient-to-br from-lime-700 to-lime-600 text-white font-black py-5 px-10 rounded-2xl hover:shadow-[0_10px_30px_-5px_rgba(77,124,15,0.4)] transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe'}
          </button>
        </form>

        {isSuccess && (
          <div className="mt-8 flex items-center justify-center gap-3 text-lime-700 font-black animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <span className="text-lg">Welcome to the inner circle!</span>
          </div>
        )}

        {error && (
          <div className="mt-8 flex items-center justify-center gap-2 text-red-600 font-bold animate-in fade-in slide-in-from-bottom-2">
             <AlertCircle className="w-5 h-5" />
             <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
