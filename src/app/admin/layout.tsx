'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  PlusCircle,
  TrendingUp,
  Users
} from 'lucide-react';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarItem = ({ href, icon, label, active }: SidebarItemProps) => (
  <Link 
    href={href}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg group transition-all duration-200 w-full ${
      active 
        ? 'bg-lime-700/10 text-lime-700' 
        : 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
    }`}
  >
    <div className={`transition-colors ${active ? 'text-lime-700' : 'group-hover:text-slate-900'}`}>
      {icon}
    </div>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden bg-white font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full shrink-0 hidden lg:flex shadow-xl">
        {/* Brand */}
        <div className="p-6 flex items-center gap-3">
          <Link href="/" className="bg-lime-700/10 p-2 rounded-lg text-lime-700 cursor-pointer hover:scale-105 transition-transform">
            <TrendingUp size={24} />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-slate-900 text-base font-bold leading-tight uppercase tracking-wider">HealthThesis</h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Admin Control</p>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-2 overflow-y-auto mt-4">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-50">Main Menu</div>
          <SidebarItem 
            href="/admin/dashboard" 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={pathname === '/admin/dashboard'} 
          />
          <SidebarItem 
            href="/admin/posts" 
            icon={<FileText size={20} />} 
            label="All Posts" 
            active={pathname === '/admin/posts'} 
          />
          <SidebarItem 
            href="/admin/products" 
            icon={<ShoppingBag size={20} />} 
            label="Affiliate Products" 
            active={pathname === '/admin/products'} 
          />
          
          <div className="px-3 mt-8 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-50">Quick Actions</div>
          <Link 
            href="/admin/editor"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-lime-700 text-white font-bold text-sm shadow-lg hover:bg-lime-800 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle size={20} />
            <span>New Post</span>
          </Link>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-200 bg-slate-100/50">
          <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-slate-200 transition-colors group">
            <div className="flex items-center gap-3">
               <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-lime-700 to-lime-600 flex items-center justify-center text-white font-bold text-xs">
                  AD
               </div>
               <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-slate-900">Admin User</span>
                  <span className="text-[10px] text-slate-400">Sign Out</span>
               </div>
            </div>
            <LogOut size={14} className="text-slate-400 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
          <div className="flex items-center gap-4">
             <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {pathname.split('/').slice(2).join(' / ') || 'Overview'}
             </h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="h-8 w-px bg-slate-200"></div>
             <Link href="/" className="text-xs font-bold text-lime-700 hover:underline flex items-center gap-1">
                View Site <PlusCircle size={14} className="rotate-45" />
             </Link>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          {children}
        </div>
      </main>
    </div>
  );
}
