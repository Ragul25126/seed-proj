'use client';

import { useState, useRef, useId } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface FAQItem {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  items: FAQItem[];
}

export default function FAQClient({ categories }: { categories: FAQCategory[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Set<string>>(
    new Set([categories[0]?.items[0]?.id || ''])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchId = useId();

  // Filter categories and questions based on active category and search query
  const query = searchQuery.trim().toLowerCase();

  const filteredCategories = categories
    .map((category) => {
      // If a specific category is selected, skip others
      if (activeCategory !== 'all' && category.id !== activeCategory) {
        return null;
      }

      if (!query) {
        return category;
      }

      // Filter items matching query in question or text representation
      const matchingItems = category.items.filter((item) => {
        const qMatch = item.question.toLowerCase().includes(query);
        // If answer is string or standard text representation
        const aText = typeof item.answer === 'string' ? item.answer.toLowerCase() : '';
        return qMatch || aText.includes(query);
      });

      if (matchingItems.length === 0) {
        return null;
      }

      return {
        ...category,
        items: matchingItems,
      };
    })
    .filter((c): c is FAQCategory => c !== null);

  const totalVisibleItems = filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  // Toggle single item
  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Expand / collapse all visible
  const expandAll = () => {
    const allIds = filteredCategories.flatMap((cat) => cat.items.map((i) => i.id));
    setOpenItems(new Set(allIds));
  };

  const collapseAll = () => {
    setOpenItems(new Set());
  };

  // Accessible Keyboard Navigation for Accordion Headers (WAI-ARIA Pattern)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    const container = containerRef.current;
    if (!container) return;

    const buttons = Array.from(
      container.querySelectorAll<HTMLButtonElement>('button[data-faq-btn]')
    );
    const currentIndex = buttons.indexOf(target);
    if (currentIndex === -1) return;

    let nextIndex: number | null = null;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = (currentIndex + 1) % buttons.length;
        break;
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = buttons.length - 1;
        break;
      default:
        break;
    }

    if (nextIndex !== null && buttons[nextIndex]) {
      buttons[nextIndex].focus();
    }
  };

  return (
    <div className="max-w-container mx-auto px-6 lg:px-12 py-16 md:py-24" ref={containerRef}>
      {/* Category Pills & Search Bar */}
      <div className="mb-12 space-y-6">
        {/* Search Input */}
        <div className="relative max-w-xl">
          <label htmlFor={searchId} className="sr-only">
            Search frequently asked questions
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              id={searchId}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic (e.g., MEP design, pool renovation, BIM, quotation)..."
              className="w-full bg-[#0f172a] border border-white/10 rounded-sm pl-11 pr-10 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                aria-label="Clear search query"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2" role="tablist" aria-label="FAQ categories">
          <button
            type="button"
            role="tab"
            aria-selected={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-4 py-2 text-xs font-mono uppercase tracking-[0.1em] rounded-sm transition-all duration-200 border',
              activeCategory === 'all'
                ? 'bg-gold text-[#0b0f19] border-gold font-semibold shadow-sm'
                : 'bg-[#0f172a] text-slate-300 border-white/10 hover:border-gold/40 hover:text-white'
            )}
          >
            All Categories ({categories.reduce((acc, c) => acc + c.items.length, 0)})
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                'px-4 py-2 text-xs font-mono uppercase tracking-[0.1em] rounded-sm transition-all duration-200 border',
                activeCategory === category.id
                  ? 'bg-gold text-[#0b0f19] border-gold font-semibold shadow-sm'
                  : 'bg-[#0f172a] text-slate-300 border-white/10 hover:border-gold/40 hover:text-white'
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Actions bar: Results count + Expand/Collapse All */}
        <div className="flex items-center justify-between border-b border-white/5 pb-4 pt-2 text-xs text-slate-400">
          <span>
            Showing <strong className="text-white">{totalVisibleItems}</strong> {totalVisibleItems === 1 ? 'question' : 'questions'}
            {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
          </span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={expandAll}
              className="text-slate-300 hover:text-gold transition-colors underline-offset-4 hover:underline"
            >
              Expand all
            </button>
            <span className="text-white/20" aria-hidden="true">•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-slate-300 hover:text-gold transition-colors underline-offset-4 hover:underline"
            >
              Collapse all
            </button>
          </div>
        </div>
      </div>

      {/* Accordion Categories */}
      {filteredCategories.length === 0 ? (
        <div className="bg-[#0f172a] border border-white/10 p-12 text-center rounded-sm max-w-xl mx-auto my-12">
          <svg className="w-12 h-12 text-slate-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-serif font-bold text-white mb-2">No matching questions found</h3>
          <p className="text-sm text-slate-400 mb-6">
            We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;. Try using different keywords or explore our categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-[0.1em] bg-gold text-[#0b0f19] font-semibold rounded-sm hover:bg-white transition-colors"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : (
        <div className="space-y-16">
          {filteredCategories.map((category) => (
            <section key={category.id} aria-labelledby={`category-heading-${category.id}`} className="space-y-6">
              {/* Category Header */}
              <div className="border-b border-white/10 pb-4">
                <div className="mb-2">
                  <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-champagne">
                    {category.name}
                  </span>
                </div>
                <h2 id={`category-heading-${category.id}`} className="text-2xl md:text-3xl font-serif font-bold text-white">
                  {category.name}
                </h2>
                <p className="text-sm text-slate-400 mt-1 max-w-2xl font-light">
                  {category.description}
                </p>
              </div>

              {/* Accordion Group */}
              <div className="divide-y divide-white/5 border-y border-white/5">
                {category.items.map((item) => {
                  const isOpen = openItems.has(item.id);
                  const buttonId = `faq-btn-${item.id}`;
                  const panelId = `faq-panel-${item.id}`;

                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'transition-colors duration-200',
                        isOpen ? 'bg-[#0f172a]/60' : 'hover:bg-[#0f172a]/30'
                      )}
                    >
                      <h3>
                        <button
                          type="button"
                          id={buttonId}
                          data-faq-btn
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => toggleItem(item.id)}
                          onKeyDown={handleKeyDown}
                          className="w-full py-6 px-4 md:px-6 flex items-start justify-between gap-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-inset"
                        >
                          <span
                            className={cn(
                              'text-base md:text-lg font-medium transition-colors duration-200',
                              isOpen ? 'text-gold' : 'text-white group-hover:text-gold'
                            )}
                          >
                            {item.question}
                          </span>
                          <span
                            className={cn(
                              'inline-flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 shrink-0 mt-0.5',
                              isOpen
                                ? 'bg-gold/15 text-gold border-gold/40 rotate-180'
                                : 'bg-transparent text-slate-400 border-white/10 group-hover:border-gold/40 group-hover:text-white rotate-0'
                            )}
                            aria-hidden="true"
                          >
                            <svg className="w-4 h-4 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </span>
                        </button>
                      </h3>

                      {/* Accordion Content Panel with Smooth CSS Grid Animation */}
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className={cn(
                          'grid transition-all duration-300 ease-in-out',
                          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                        )}
                      >
                        <div className="overflow-hidden">
                          <div className="px-4 md:px-6 pb-6 pt-1 text-sm md:text-[15px] text-slate-300 leading-relaxed font-light space-y-3 border-l-2 border-gold/40 ml-4 md:ml-6 my-2">
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Still Have Questions CTA */}
      <div className="mt-24 bg-[#0f172a] border border-white/10 rounded-sm p-8 md:p-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="mb-4">
            <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-champagne">
              Have More Questions?
            </span>
          </div>
          <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight">
            Need specific engineering details for your development?
          </h2>
          <p className="text-slate-300 text-sm md:text-base font-light leading-relaxed mb-8 max-w-2xl">
            Every building brief has unique authority, spatial, and performance requirements. Speak directly with our engineering team to discuss technical feasibility, fee proposals, and project delivery.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button href="/contact" variant="gold">
              Contact our engineers
            </Button>
            <Button href="/services" variant="outline-light">
              Explore services
            </Button>
            <a
              href="tel:+97142564882"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-mono tracking-[0.1em] text-slate-300 hover:text-gold transition-colors"
            >
              <svg className="w-4 h-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +971 42 564 882
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

