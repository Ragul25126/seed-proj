'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while mobile menu open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
    <header
      className={cn(
        pathname.startsWith('/admin') ? 'sticky' : 'fixed',
        'top-0 left-0 right-0 z-40 transition-colors duration-300',
        (scrolled || pathname !== '/') && !open ? 'bg-[#0b0f19] shadow-md border-b border-white/5' : 'bg-transparent'
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-5 lg:px-12">
        <div className="flex flex-col gap-1">
          <Link href="/" className="flex items-center gap-3 z-[60] relative">
            <Image
              src="/seedlogo.png"
              alt="Seed Engineering"
              width={140}
              height={42}
              className="h-10 w-auto brightness-0 invert"
            />
          </Link>
          <span className="text-[10px] text-white/50 tracking-[0.2em] uppercase hidden lg:block ml-1">Engineering High-Performance Buildings</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          <Link href="/about" className="text-sm font-sans font-medium tracking-[0.15em] uppercase text-white/80 hover:text-white transition-colors duration-300">ABOUT</Link>
          <Link href="/services" className="text-sm font-sans font-medium tracking-[0.15em] uppercase text-white/80 hover:text-white transition-colors duration-300">SERVICES</Link>
          <Link href="/sectors" className="text-sm font-sans font-medium tracking-[0.15em] uppercase text-white/80 hover:text-white transition-colors duration-300">SECTORS</Link>
          <Link href="/projects" className="text-sm font-sans font-medium tracking-[0.15em] uppercase text-white/80 hover:text-white transition-colors duration-300">PROJECTS</Link>
          <Link href="/blog" className="text-sm font-sans font-medium tracking-[0.15em] uppercase text-white/80 hover:text-white transition-colors duration-300">INSIGHTS</Link>
          <Link href="/careers" className="text-sm font-sans font-medium tracking-[0.15em] uppercase text-white/80 hover:text-white transition-colors duration-300">CAREERS</Link>
          <Link href="/contact" className="text-sm font-sans font-medium tracking-[0.15em] uppercase text-white/80 hover:text-white transition-colors duration-300">CONTACT</Link>
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden relative text-white p-2 -mr-2 z-50"
        >
          <div className="space-y-[5px]">
            <span
              className={cn(
                'block h-[1.5px] w-7 bg-current transition-transform duration-300 origin-center',
                open && 'translate-y-[6.5px] rotate-45',
              )}
            />
            <span
              className={cn(
                'block h-[1.5px] w-7 bg-current transition-opacity duration-200',
                open && 'opacity-0',
              )}
            />
            <span
              className={cn(
                'block h-[1.5px] w-7 bg-current transition-transform duration-300 origin-center',
                open && '-translate-y-[6.5px] -rotate-45',
              )}
            />
          </div>
        </button>
      </div>

    </header>

    {/* Mobile full-screen menu */}
    <div
      className={cn(
        'lg:hidden fixed inset-0 z-[45] bg-ink text-white transition-opacity duration-300',
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <div
        className="absolute inset-0 opacity-15"
        style={{ backgroundImage: "url('/seedv3/hero.webp')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/95 to-ink" />

      <div className="relative z-10 h-full flex flex-col overflow-y-auto pt-20 pb-10 px-7">
          {/* Top bar with close button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="block w-10 h-px bg-champagne" />
              <span className="label text-champagne tracking-[0.3em]">MENU</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-medium tracking-widest uppercase"
            >
              <span>Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Primary nav */}
          <nav className="flex flex-col">
            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="font-serif text-3xl md:text-4xl font-bold leading-tight py-3 border-b border-white/10 hover:text-gold hover:pl-3 transition-all"
            >
              About
            </Link>
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="font-serif text-3xl md:text-4xl font-bold leading-tight py-3 border-b border-white/10 hover:text-gold hover:pl-3 transition-all"
            >
              Services
            </Link>
            <Link
              href="/sectors"
              onClick={() => setOpen(false)}
              className="font-serif text-3xl md:text-4xl font-bold leading-tight py-3 border-b border-white/10 hover:text-gold hover:pl-3 transition-all"
            >
              Sectors
            </Link>
            <Link
              href="/projects"
              onClick={() => setOpen(false)}
              className="font-serif text-3xl md:text-4xl font-bold leading-tight py-3 border-b border-white/10 hover:text-gold hover:pl-3 transition-all"
            >
              Projects
            </Link>
            <Link
              href="/blog"
              onClick={() => setOpen(false)}
              className="font-serif text-3xl md:text-4xl font-bold leading-tight py-3 border-b border-white/10 hover:text-gold hover:pl-3 transition-all"
            >
              Insights
            </Link>
            <Link
              href="/careers"
              onClick={() => setOpen(false)}
              className="font-serif text-3xl md:text-4xl font-bold leading-tight py-3 border-b border-white/10 hover:text-gold hover:pl-3 transition-all"
            >
              Careers
            </Link>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="font-serif text-3xl md:text-4xl font-bold leading-tight py-3 border-b border-white/10 hover:text-gold hover:pl-3 transition-all"
            >
              Contact
            </Link>
          </nav>

          {/* Footer block */}
          <div className="mt-auto pt-10">
            <Link
              href="/inquiry"
              className="block w-full text-center bg-champagne hover:bg-white text-navy px-6 py-4 text-sm font-medium tracking-[0.22em] transition-colors mb-6"
            >
              REQUEST A QUOTE
            </Link>
            <div className="space-y-2 text-sm text-white/55">
              <p>
                <a href="tel:+97142564882" className="hover:text-champagne">+971 4 256 4882</a>
              </p>
              <p>
                <a href="mailto:contact@seedengineering.com" className="hover:text-champagne">
                  contact@seedengineering.com
                </a>
              </p>
              <p className="pt-3 text-white/40 text-xs leading-relaxed">
                #303, Old Commercial Bank of Dubai Building<br />
                Abu Baker Al Siddique Road, Deira, Dubai
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

