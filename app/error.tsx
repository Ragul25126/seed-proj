'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error securely to the browser console without displaying raw stack traces in the UI
    console.error('[SEED Application Error]', error);
  }, [error]);

  return (
    <div className="bg-[#0b0f19] min-h-[70vh] text-slate-300 font-sans pt-40 pb-32 flex items-center selection:bg-gold selection:text-[#0b0f19]">
      <div className="container mx-auto px-6 lg:px-12 text-center max-w-xl">
        <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 block">
          Notice
        </span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
          Something went wrong
        </h1>
        <p className="text-slate-400 font-light text-[15px] mb-8 leading-relaxed">
          We encountered an unexpected issue while loading this page. Please try refreshing or return to the homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors rounded-sm shadow-md"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-gold hover:text-gold transition-colors rounded-sm"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

