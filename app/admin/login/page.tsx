'use client';

import React, { useState, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginAction } from '../actions';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Check if redirect has an error param
  const unauthorizedError = searchParams.get('error') === 'unauthorized';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
        router.push('/admin/dashboard');
      }
    });
  };

  return (
    <main className="min-h-[calc(100vh-80px)] bg-[#070b13] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#0b0f19] border border-white/10 rounded-sm p-8 shadow-2xl z-10 relative">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <span className="text-gold text-2xl font-serif tracking-[0.2em] font-bold block mb-1">
            SEED
          </span>
          <span className="text-[10px] text-white/50 tracking-[0.3em] uppercase block">
            Engineering CMS
          </span>
        </div>

        {/* Error Notifications */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-sm mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {unauthorizedError && !error && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs px-4 py-3 rounded-sm mb-6 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Access denied: You must be an administrator to view this page.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={isPending}
              className="w-full bg-[#0a1020]/50 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="admin@seedengineering.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              disabled={isPending}
              className="w-full bg-[#0a1020]/50 border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-gold hover:bg-[#b0934c] disabled:bg-gold/40 text-black font-semibold text-xs uppercase tracking-widest py-3.5 px-4 rounded-sm transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070b13] flex items-center justify-center">
          <span className="text-gold text-xs uppercase tracking-widest animate-pulse">Loading Interface...</span>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
