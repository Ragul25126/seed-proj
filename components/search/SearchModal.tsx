'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { SearchCategory, SearchResultItem } from '@/lib/search';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES: SearchCategory[] = ['All', 'Projects', 'Services', 'Sectors', 'Media', 'About'];

const QUICK_SUGGESTIONS = [
  'Wasl Tower',
  'MEP Design',
  'St. Regis',
  'Hospitality',
  'Supervision',
  'Sustainability',
  'Awards',
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('All');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus input & lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setActiveCategory('All');
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard shortcut listener (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Real-time search effect with debouncing
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        startTransition(() => {
          setResults(data.results || []);
          setIsLoading(false);
        });
      } catch (err) {
        console.error('Search request error:', err);
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  // Filter results by selected category tab
  const filteredResults = results.filter((item) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Projects') return item.category === 'Project';
    if (activeCategory === 'Services') return item.category === 'Service';
    if (activeCategory === 'Sectors') return item.category === 'Sector';
    if (activeCategory === 'Media') return item.category === 'Media';
    if (activeCategory === 'About') return item.category === 'About';
    return true;
  });

  // Calculate category counts
  const getCategoryCount = (cat: SearchCategory) => {
    if (cat === 'All') return results.length;
    if (cat === 'Projects') return results.filter((i) => i.category === 'Project').length;
    if (cat === 'Services') return results.filter((i) => i.category === 'Service').length;
    if (cat === 'Sectors') return results.filter((i) => i.category === 'Sector').length;
    if (cat === 'Media') return results.filter((i) => i.category === 'Media').length;
    if (cat === 'About') return results.filter((i) => i.category === 'About').length;
    return 0;
  };

  const handleSelectResult = (href: string) => {
    onClose();
    router.push(href);
  };

  const getBadgeStyle = (category: string) => {
    switch (category) {
      case 'Project':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'Service':
        return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'Sector':
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'Media':
        return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'About':
        return 'text-slate-300 bg-white/10 border-white/20';
      default:
        return 'text-gold bg-gold/10 border-gold/20';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-12 sm:pt-20 px-4 sm:px-6 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-in fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search website"
    >
      <div
        className="w-full max-w-4xl bg-[#0b0f19] border border-white/15 rounded-sm shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER INPUT BAR */}
        <div className="relative flex items-center px-6 py-5 border-b border-white/10 bg-[#0f172a]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gold mr-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, services, sectors..."
            className="w-full bg-transparent text-white placeholder-slate-400 text-lg sm:text-xl font-sans focus:outline-none tracking-wide"
          />

          {/* Loading Indicator */}
          {(isLoading || isPending) && (
            <div className="mr-3 animate-spin rounded-full h-5 w-5 border-2 border-gold border-t-transparent shrink-0" />
          )}

          {/* Clear Query Button */}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 mr-2 text-slate-400 hover:text-white transition-colors"
              aria-label="Clear search input"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Close Modal Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-widest text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-colors ml-2 shrink-0"
            aria-label="Close search modal"
          >
            <span>ESC</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CATEGORY FILTER TABS (Visible when results exist or query entered) */}
        {query.trim().length > 0 && (
          <div className="flex items-center gap-2 px-6 py-3 border-b border-white/10 bg-[#0b0f19] overflow-x-auto scrollbar-none text-xs tracking-wider uppercase">
            {CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-gold text-[#0b0f19] font-bold border-gold shadow-sm'
                      : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:border-white/20'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#0b0f19]/20 text-[#0b0f19]' : 'bg-white/10 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* RESULTS & CONTENT BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {/* Initial State: Prompt & Suggestions */}
          {!query.trim() && (
            <div className="py-10 text-center space-y-6">
              <div className="inline-flex p-4 rounded-full bg-gold/10 text-gold mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-white font-medium">Search SEED Engineering</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto font-light">
                Find landmark projects, MEP engineering services, specialized sectors, media coverage, and firm background.
              </p>

              <div className="pt-4 max-w-xl mx-auto">
                <p className="text-xs uppercase tracking-widest text-gold/80 mb-3 font-semibold">Popular Searches</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {QUICK_SUGGESTIONS.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/40 rounded transition-all"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* No Matching Results State */}
          {query.trim().length > 0 && !isLoading && filteredResults.length === 0 && (
            <div className="py-12 text-center space-y-4">
              <p className="text-lg text-slate-300 font-serif">
                No matching results found for &ldquo;<span className="text-white font-semibold">{query}</span>&rdquo;
                {activeCategory !== 'All' && <span> in category &ldquo;{activeCategory}&rdquo;</span>}.
              </p>
              <p className="text-xs text-slate-400 font-light">
                Try refining your keywords or select another category filter.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setQuery('');
                    setActiveCategory('All');
                  }}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold hover:text-white border border-gold/30 hover:border-gold rounded transition-colors"
                >
                  Clear search filters
                </button>
              </div>
            </div>
          )}

          {/* Results List */}
          {query.trim().length > 0 && filteredResults.length > 0 && (
            <div className="space-y-3">
              {filteredResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item.href)}
                  className="group p-4 sm:p-5 bg-[#0f172a]/60 hover:bg-[#0f172a] border border-white/5 hover:border-gold/40 rounded-sm transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded border ${getBadgeStyle(item.category)}`}>
                        {item.category}
                      </span>
                      {item.subtitle && (
                        <span className="text-xs text-slate-400 font-light">
                          {item.subtitle}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-serif font-bold text-white group-hover:text-gold transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center text-xs font-semibold text-slate-400 group-hover:text-gold transition-colors">
                    <span className="uppercase tracking-wider mr-1 group-hover:translate-x-0.5 transition-transform">Explore</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER METADATA */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#0b0f19] flex items-center justify-between text-[11px] text-slate-400 font-light">
          <span>
            {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
          </span>
          <span className="flex items-center gap-3">
            <span>Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-slate-200 font-mono">ESC</kbd> to close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
