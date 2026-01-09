import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white text-slate-500 py-16 border-t border-slate-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h3 className="text-2xl font-black font-serif text-slate-900 tracking-tight">Health<span className="text-lime-700">Thesis</span></h3>
            <p className="text-sm max-w-xs leading-relaxed font-medium">
              Sharing the latest discoveries in wellness, beauty, and healthy living. Join our community for practical tips and shared insights.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Community</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><Link href="/contact" className="hover:text-lime-700 transition-colors">Contact Us</Link></li>
              <li><Link href="/" className="hover:text-lime-700 transition-colors">Latest Insights</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4 text-left">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Legal</h4>
            <ul className="space-y-2 text-sm font-bold">
              <li><Link href="/privacy" className="hover:text-lime-700 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-lime-700 transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
          <p>&copy; {currentYear} HealthThesis. Shared for your well-being.</p>
          <div className="flex gap-6">
            <span className="hover:text-slate-900 transition-colors cursor-default">English Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
