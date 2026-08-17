import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
import { logoutAction } from '../actions';

import { getUnreadInquiriesCount } from '../../../lib/supabase/cached-queries';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminDashboardLayout({ children }: AdminLayoutProps) {
  const supabase = createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const unreadCount = await getUnreadInquiriesCount();

  if (!user) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-[#070b13] text-white flex flex-col md:flex-row font-sans">
      {/* 1. LEFT SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#0b0f19] border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between flex-shrink-0 md:sticky md:top-[80px] md:h-[calc(100vh-80px)] overflow-y-auto">
        <div>
          {/* Sidebar Brand/Logo */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <span className="text-gold text-xl font-serif tracking-[0.2em] font-bold block">
                SEED
              </span>
              <span className="text-[9px] text-white/40 tracking-[0.2em] uppercase block">
                Engineering CMS
              </span>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="p-4 space-y-1.5">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium hover:bg-white/5 hover:text-gold transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
              </svg>
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/dashboard/projects"
              className="flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium hover:bg-white/5 hover:text-gold transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>Projects</span>
            </Link>

            <Link
              href="/admin/dashboard/inquiries"
              className="flex items-center justify-between px-4 py-3 rounded-sm text-sm font-medium hover:bg-white/5 hover:text-gold transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Inquiries</span>
              </div>
              {unreadCount !== null && unreadCount > 0 && (
                <span className="bg-gold text-black text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {unreadCount}
                </span>
              )}
            </Link>
          </nav>
        </div>

        {/* Sidebar Footer / User Info */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          <div className="px-4">
            <span className="text-[10px] text-white/40 block uppercase tracking-wider mb-0.5">Logged In</span>
            <span className="text-xs text-white/80 font-medium truncate block" title={user.email}>
              {user.email}
            </span>
          </div>

          <form action={logoutAction} className="w-full">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium hover:bg-red-500/10 text-red-400 transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* 2. MAIN CONTENT BODY */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-[#0b0f19] border-b border-white/10 flex items-center px-8 flex-shrink-0">
          <h1 className="text-gold font-serif text-lg tracking-wide uppercase font-semibold">
            SEED CMS Overview
          </h1>
        </header>

        {/* Main Routing Container */}
        <main className="flex-1 p-8 bg-[#070b13]">
          {children}
        </main>
      </div>
    </div>
  );
}
