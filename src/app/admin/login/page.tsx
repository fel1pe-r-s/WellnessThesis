'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Identity verification failed');
      }
    } catch (err) {
      setError('Connection to node failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#10221c] font-sans selection:bg-[#13eca4] selection:text-[#111816]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(19,236,164,0.05),transparent_70%)]"></div>
      
      <div className="w-full max-w-md bg-[#152822] p-10 rounded-[2.5rem] border border-[#233b32] relative z-10 shadow-2xl shadow-black/50">
        <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#13eca4]/10 rounded-2xl text-[#13eca4] mb-6 border border-[#13eca4]/20 animate-pulse">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h1 className="text-3xl font-black text-[#f6f8f7] uppercase tracking-tighter leading-none mb-2">Central Node</h1>
            <p className="text-[#61897c] font-bold text-[10px] uppercase tracking-[0.2em] opacity-80">Authorization Required</p>
        </div>

        {error && (
            <div className="mb-8 p-4 bg-red-400/10 border border-red-400/20 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
                <p className="text-red-400 text-xs font-black uppercase tracking-wider">{error}</p>
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#61897c] uppercase tracking-widest ml-1">Access Protocol (Email)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wellnessthesis.com"
              className="w-full bg-[#10221c] border-[#233b32] text-[#f6f8f7] px-6 py-4 rounded-2xl focus:ring-2 focus:ring-[#13eca4]/20 focus:border-[#13eca4] transition-all outline-none text-sm font-medium placeholder:text-[#61897c]/30"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#61897c] uppercase tracking-widest ml-1">Encryption Key (Password)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#10221c] border-[#233b32] text-[#f6f8f7] px-6 py-4 rounded-2xl focus:ring-2 focus:ring-[#13eca4]/20 focus:border-[#13eca4] transition-all outline-none text-sm font-medium placeholder:text-[#61897c]/30"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#13eca4] text-[#111816] font-black py-5 rounded-2xl hover:bg-[#0fd693] transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(19,236,164,0.3)] active:scale-95 disabled:opacity-50 disabled:transform-none uppercase tracking-widest text-sm"
          >
            {loading ? 'Validating...' : 'Initialize Session'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#233b32]/50 text-center">
            <p className="text-[10px] text-[#61897c] font-bold uppercase tracking-widest opacity-40">
                Encrypted Transaction v4.2.0
            </p>
        </div>
      </div>
    </div>
  );
}
