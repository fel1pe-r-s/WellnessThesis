'use client';
import { useState } from 'react';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
interface NewsletterFormProps {
  variant?: 'default' | 'compact';
}

export default function NewsletterForm({ variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCompact = variant === 'compact';

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
    <div 
      id="newsletter" 
      className={`
        relative overflow-hidden transition-all duration-500 shadow-xl 
        ${isCompact 
          ? 'bg-white/5 border border-white/10 rounded-[2rem] p-8 text-left shadow-white/5' 
          : 'bg-white/50 backdrop-blur-md border border-slate-200/50 rounded-[2.5rem] p-10 md:p-20 text-center shadow-slate-200/20 my-20'
        }
      `}
    >
      {/* Decorative premium elements */}
      {!isCompact && (
        <>
          <div className="absolute top-0 left-0 w-80 h-80 bg-lime-700/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />
          <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-lime-700/5 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.8)_100%)] pointer-events-none" />
        </>
      )}

      <div className={`relative z-10 ${isCompact ? 'w-full' : 'max-w-2xl mx-auto'}`}>
        <span className={`
          inline-block px-3 py-1 rounded-full uppercase font-black tracking-[0.2em] mb-4
          ${isCompact ? 'bg-white/10 text-white/60 text-[8px]' : 'bg-lime-100/50 text-lime-700 text-[10px]'}
        `}>
          {isCompact ? 'Newsletter' : 'WELLNESS THESIS NEWSLETTER'}
        </span>
        
        <h2 className={`
          font-serif font-black mb-4 leading-tight
          ${isCompact ? 'text-2xl text-white' : 'text-4xl md:text-5xl text-slate-900'}
        `}>
          {isCompact ? 'Stay Informed' : <>Join the <span className="text-lime-700 italic">Inner Circle</span></>}
        </h2>
        
        <p className={`
          font-medium mb-8 leading-relaxed
          ${isCompact ? 'text-slate-400 text-xs' : 'text-slate-500 text-lg'}
        `}>
          {isCompact 
            ? 'Insights on metabolic efficiency and longevity science.' 
            : <>Get weekly insights on metabolic efficiency, skin health, and longevity science. <span className="text-slate-900 font-bold">No spam, just helpful content for your well-being.</span></>
          }
        </p>

        <form onSubmit={handleSubmit} className={`flex gap-3 relative group/form ${isCompact ? 'flex-col' : 'flex-col md:flex-row max-w-lg mx-auto'}`}>
          <input
            type="email"
            placeholder="Your best email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending || isSuccess}
            className={`
              flex-1 px-6 py-4 rounded-xl font-medium transition-all disabled:opacity-70 
              ${isCompact 
                ? 'bg-white/10 border-white/10 text-white placeholder:text-slate-500 focus:outline-[2px] focus:outline-white/20' 
                : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-[3px] focus:outline-lime-700/20'
              }
            `}
            required
          />
          <button
            type="submit"
            disabled={isPending || isSuccess}
            className={`
              font-black rounded-xl transition-all transform active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 uppercase tracking-widest text-[10px]
              ${isCompact 
                ? 'bg-white text-slate-900 py-4 hover:bg-slate-100' 
                : 'bg-gradient-to-br from-lime-700 to-lime-600 text-white py-5 px-10 hover:shadow-[0_10px_30px_-5px_rgba(77,124,15,0.4)] hover:-translate-y-1'
              }
            `}
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Subscribe'}
          </button>
        </form>

        {isSuccess && (
          <div className={`mt-6 flex items-center gap-2 font-black animate-in fade-in slide-in-from-bottom-2 duration-500 ${isCompact ? 'text-lime-500 text-sm' : 'text-lime-700 text-lg justify-center'}`}>
            <CheckCircle className={isCompact ? 'w-4 h-4' : 'w-6 h-6'} />
            <span>Welcome!</span>
          </div>
        )}

        {error && (
          <div className={`mt-6 flex items-center gap-2 font-bold animate-in fade-in slide-in-from-bottom-2 ${isCompact ? 'text-red-400 text-[10px]' : 'text-red-600 justify-center'}`}>
             <AlertCircle className="w-4 h-4" />
             <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

