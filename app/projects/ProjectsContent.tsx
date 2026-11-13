'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { formatProjectSector } from '@/lib/sectorUtils';

// ─── types ────────────────────────────────────────────────────────────────────

export type LiveProject = {
  id: string;
  slug: string;
  title: string;
  location: string;
  sector?: string | null;
  client_sector?: string | null;
  clientSector?: string | null;
  division?: string | null;
  client?: string | null;
  architect?: string | null;
  services?: string | null;
  area?: string | null;
  description?: string | null;
  short_description?: string | null;
  projectScale?: string | null;
  project_scale?: string | null;
  image?: string | null;       // cover image URL
  imageCount?: number;         // total photo count
  images?: string[];           // all image URLs (when available)
};

// ─── modal ───────────────────────────────────────────────────────────────────

function ProjectModal({ proj, onClose, sector }: { proj: LiveProject; onClose: () => void; sector?: string }) {
  // Fetch live images from Supabase when the modal opens
  const [liveImages, setLiveImages] = useState<string[] | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    if (!proj.slug) return;
    fetch(`/api/project-images?slug=${encodeURIComponent(proj.slug)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data.images)) {
          setLiveImages(data.images);
        }
      })
      .catch(() => { /* fall back to project.images */ });
  }, [proj.slug]);

  const modalSector = formatProjectSector(proj.sector || proj.clientSector || proj.client_sector);

  const details = [
    proj.client    && { label: 'Client',    value: proj.client },
    proj.architect && { label: 'Architect', value: proj.architect },
    proj.services  && { label: 'Services',  value: proj.services },
    proj.area      && { label: 'Area',      value: proj.area },
    modalSector    && { label: 'Sector',    value: modalSector },
  ].filter(Boolean) as { label: string; value: string }[];

  // Prefer live Supabase images → then server-rendered images → then cover
  const fallbackImages = (proj.images && proj.images.length > 0)
    ? proj.images
    : (proj.image ? [proj.image] : []);
  const images = (liveImages !== null && liveImages.length > 0)
    ? liveImages
    : (liveImages !== null && liveImages.length === 0 && fallbackImages.length === 0)
    ? []
    : fallbackImages;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative z-10 bg-[#0d1526] border border-white/10 w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-sm shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-black/70 hover:bg-gold hover:text-black text-white rounded-full p-2 transition-colors border border-white/20"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Hero Gallery */}
        <div className="p-4 sm:p-6 pb-0">
          {images.length > 0 ? (
            <ProjectGallery
              images={images}
              title={proj.title}
              aspectRatio="aspect-[16/9]"
              objectFit={proj.slug === 'saas-st-regis' ? 'contain' : 'cover'}
              containImages={['/projects/mandarin-wasl-2-new.jpg', '/projects/ellington-hq.png', '/projects/uptown-mercer-house-skyline.jpg', '/projects/uptown-mercer-house-lobby.jpg', '/projects/uptown-mercer-house-pool.jpg', '/projects/uptown-mercer-house-retail.jpg', '/projects/uptown-mercer-house-balcony.jpg']}
              containSlugs={['saas-st-regis', 'uptown-mercer-house', 'ellington-sands-1-2']}
              currentSlug={proj.slug}
            />
          ) : (
            <div className="w-full aspect-[16/9] bg-[#0a1020] border border-white/10 rounded-sm flex items-center justify-center text-white/30 text-xs font-mono uppercase tracking-wider">
              No Photos Available
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {modalSector ? (
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold border border-gold/30 px-3 py-1 rounded-full">
                {modalSector}
              </span>
            ) : null}
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 border border-white/10 px-3 py-1 rounded-full">
              {proj.location.split('**')[0].trim()}
            </span>
          </div>

          <h2 className="font-sans text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight">{proj.title}</h2>

          {/* Detail grid */}
          {details.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-white/10">
              {details.map(d => (
                <div key={d.label}>
                  <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold mb-1">{d.label}</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{d.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          {proj.description && (
            <div className="prose prose-invert max-w-none text-slate-300 font-light text-[15px] leading-relaxed">
              {proj.description.split('\n').map((paragraph, i) => (
                paragraph.trim() && <p key={i} className="mb-4">{paragraph}</p>
              ))}
            </div>
          )}

          {/* Link to full page */}
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-end">
            <Link
              href={`/view/${proj.slug}${sector && sector !== 'All Sectors' ? `?sector=${encodeURIComponent(sector)}` : ''}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-yellow-500 text-[#0b0f19] text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
            >
              View full project page →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── main content ─────────────────────────────────────────────────────────────

interface ProjectsContentProps {
  projects: LiveProject[];
}

const SECTORS = [
  'All Sectors',
  'Hospitality',
  'Residential',
  'Commercial',
  'Education',
  'Healthcare',
  'Retail',
  'Sports & Stadiums',
  'Entertainment & Culture',
  'Aviation',
  'Villas & Private Estates',
  'Infrastructure & Sustainable Communities',
];

// Helper to perform flexible sector matching across DB values and URL parameters
function matchSector(projSector: string | null | undefined, targetFilter: string): boolean {
  if (!targetFilter || targetFilter === 'All Sectors') return true;
  if (!projSector) return false;

  const pSec = projSector.trim().toLowerCase();
  const tSec = targetFilter.trim().toLowerCase();

  if (pSec === tSec) return true;

  if (tSec.includes('hospitality') || tSec.includes('hotel') || tSec.includes('resort')) {
    return pSec.includes('hospitality') || pSec.includes('hotel') || pSec.includes('resort');
  }
  if (tSec.includes('residential') || tSec.includes('housing') || tSec.includes('apartment')) {
    return pSec.includes('residential') || pSec.includes('apartment') || pSec.includes('housing');
  }
  if (tSec.includes('commercial') || tSec.includes('office') || tSec.includes('headquarters')) {
    return pSec.includes('commercial') || pSec.includes('office') || pSec.includes('headquarters');
  }
  if (tSec.includes('industrial') || tSec.includes('warehouse') || tSec.includes('factory')) {
    return pSec.includes('industr') || pSec.includes('factory') || pSec.includes('warehouse') || pSec.includes('logistics');
  }
  if (tSec.includes('education') || tSec.includes('school') || tSec.includes('university')) {
    return pSec.includes('education') || pSec.includes('school') || pSec.includes('university');
  }
  if (tSec.includes('healthcare') || tSec.includes('medical') || tSec.includes('clinic') || (tSec.includes('hospital') && !tSec.includes('hospitality'))) {
    // Safeguard: "hospitality" contains "hospital" as a prefix substring; exclude hospitality from healthcare
    if (pSec.includes('hospitality')) return false;
    return pSec.includes('healthcare') || pSec.includes('hospital') || pSec.includes('medical') || pSec.includes('clinic');
  }
  if (tSec.includes('retail') || tSec.includes('mall') || tSec.includes('shopping')) {
    return pSec.includes('retail') || pSec.includes('mall') || pSec.includes('shopping');
  }
  if (tSec.includes('sports') || tSec.includes('stadium') || tSec.includes('arena')) {
    return pSec.includes('sport') || pSec.includes('stadium') || pSec.includes('arena');
  }
  if (tSec.includes('entertainment') || tSec.includes('culture') || tSec.includes('museum') || tSec.includes('theatre')) {
    return pSec.includes('entertain') || pSec.includes('cultur') || pSec.includes('museum') || pSec.includes('theatre');
  }
  if (tSec.includes('public buildings') || tSec.includes('theme park') || tSec.includes('civic')) {
    return pSec.includes('public') || pSec.includes('theme') || pSec.includes('civic') || pSec.includes('park');
  }
  if (tSec.includes('aviation') || tSec.includes('airport') || tSec.includes('terminal')) {
    return pSec.includes('aviation') || pSec.includes('airport') || pSec.includes('terminal');
  }
  if (tSec.includes('villas') || tSec.includes('private estate')) {
    return pSec.includes('villa') || pSec.includes('estate');
  }
  if (tSec.includes('infrastructure') || tSec.includes('sustainable communities') || tSec.includes('sustainability')) {
    return pSec.includes('infrastructur') || pSec.includes('sustainab') || pSec.includes('utility') || pSec.includes('community');
  }

  // Safety fallback: ensure "hospitality" is never matched to "hospital" and vice versa
  if ((tSec.includes('hospital') && !tSec.includes('hospitality') && pSec.includes('hospitality')) ||
      (pSec.includes('hospital') && !pSec.includes('hospitality') && tSec.includes('hospitality'))) {
    return false;
  }

  return pSec.includes(tSec) || tSec.includes(pSec);
}

function getCountryFromLocation(location?: string | null): string {
  if (!location) return '';
  const cleanLoc = location.split('**')[0].trim();
  if (!cleanLoc) return '';

  const parts = cleanLoc.split(',').map(p => p.trim()).filter(Boolean);
  let rawCountry = parts[parts.length - 1] || cleanLoc;

  const upper = rawCountry.toUpperCase();
  if (upper === 'KSA' || upper === 'SAUDI ARABIA') {
    return 'Saudi arabia';
  }
  if (upper === 'UAE' || upper === 'UNITED ARAB EMIRATES') {
    return 'UAE';
  }
  if (upper === 'USA' || upper === 'UNITED STATES' || upper === 'UNITED STATES OF AMERICA') {
    return 'USA';
  }
  if (upper === 'UK' || upper === 'UNITED KINGDOM') {
    return 'UK';
  }

  return rawCountry.charAt(0).toUpperCase() + rawCountry.slice(1).toLowerCase();
}

function getInitialSectorFilter(sectorQuery: string | null): string {
  if (!sectorQuery || sectorQuery === 'All Sectors') return 'All Sectors';
  const clean = sectorQuery.trim();
  const matched = SECTORS.find(s => s !== 'All Sectors' && matchSector(s, clean));
  if (matched) return matched;
  const reverseMatched = SECTORS.find(s => s !== 'All Sectors' && matchSector(clean, s));
  return reverseMatched || clean;
}


// ─── scroll restoration helpers ───────────────────────────────────────────────

const SCROLL_STORAGE_KEY = 'seed_projects_scroll_state';

interface SavedScrollState {
  sector: string;
  location?: string;
  scrollY: number;
  visibleCount: number;
  projectSlug?: string;
  timestamp: number;
  restorePending: boolean;
}

function getSavedProjectsScroll(): SavedScrollState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(SCROLL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.scrollY === 'number') {
      return parsed as SavedScrollState;
    }
  } catch {}
  return null;
}

function saveProjectsScroll(state: Partial<SavedScrollState> & { scrollY: number; sector: string }) {
  if (typeof window === 'undefined') return;
  try {
    const prev = getSavedProjectsScroll() || ({} as Partial<SavedScrollState>);
    const updated: SavedScrollState = {
      sector: state.sector || prev.sector || 'All Sectors',
      location: state.location ?? prev.location,
      scrollY: Math.max(0, state.scrollY),
      visibleCount: state.visibleCount ?? prev.visibleCount ?? 12,
      projectSlug: state.projectSlug ?? prev.projectSlug,
      timestamp: Date.now(),
      restorePending: state.restorePending !== undefined ? state.restorePending : true,
    };
    sessionStorage.setItem(SCROLL_STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}

function clearProjectsScroll() {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(SCROLL_STORAGE_KEY);
  } catch {}
}

function ProjectsContent({ projects }: ProjectsContentProps) {
  const searchParams = useSearchParams();
  const sectorQuery = searchParams?.get('sector');

  // Build filter options from the live Supabase project list (unique countries)
  const uniqueCountries = Array.from(new Set(
    projects.map(p => getCountryFromLocation(p.location)).filter(Boolean)
  )).sort((a, b) => a.localeCompare(b));
  const LOCATIONS = ['All Locations', ...uniqueCountries];

  const [filterLocation, setFilterLocation] = useState('All Locations');
  const [filterSector, setFilterSector] = useState(() => getInitialSectorFilter(sectorQuery));
  const PAGE_SIZE = 12;

  // Always initialize visibleCount to PAGE_SIZE for SSR hydration consistency.
  // When returning to a sector, visibleCount is restored in useEffect after hydration.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [selected, setSelected] = useState<LiveProject | null>(null);
  const lastScrollYRef = useRef(0);

  // Sync sector filter and visible count from query params
  useEffect(() => {
    const newSec = getInitialSectorFilter(sectorQuery);
    setFilterSector(newSec);

    const saved = getSavedProjectsScroll();
    if (
      saved &&
      saved.visibleCount &&
      saved.visibleCount > PAGE_SIZE &&
      (matchSector(saved.sector, newSec) || matchSector(newSec, saved.sector))
    ) {
      setVisibleCount(saved.visibleCount);
    } else {
      setVisibleCount(PAGE_SIZE);
    }
  }, [sectorQuery]);

  // Passively track scroll position while browsing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      if (selected) return;
      const currentY = window.scrollY;
      lastScrollYRef.current = currentY;

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (window.location.pathname.startsWith('/projects') && currentY > 0) {
          saveProjectsScroll({
            sector: filterSector,
            location: filterLocation,
            scrollY: currentY,
            visibleCount,
            restorePending: true,
          });
        }
      }, 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [filterSector, filterLocation, visibleCount, selected]);

  // Reliable scroll restoration on mount or sector change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const saved = getSavedProjectsScroll();
    if (!saved || typeof saved.scrollY !== 'number' || saved.scrollY <= 0) return;
    if (!saved.restorePending) return;

    if (saved.timestamp && Date.now() - saved.timestamp > 30 * 60 * 1000) {
      clearProjectsScroll();
      return;
    }

    const sectorMatches =
      !saved.sector ||
      saved.sector === 'All Sectors' ||
      matchSector(saved.sector, filterSector) ||
      matchSector(filterSector, saved.sector);

    if (!sectorMatches) return;

    const targetY = saved.scrollY;
    let attempts = 0;
    const maxAttempts = 25;
    let rafId: number;
    let settleTimeoutId: NodeJS.Timeout;

    const applyScroll = () => {
      attempts++;

      window.scrollTo({
        top: targetY,
        behavior: 'instant' as ScrollBehavior,
      });

      const diff = Math.abs(window.scrollY - targetY);
      if (diff <= 10 || attempts >= maxAttempts) {
        settleTimeoutId = setTimeout(() => {
          if (Math.abs(window.scrollY - targetY) > 10) {
            window.scrollTo({
              top: targetY,
              behavior: 'instant' as ScrollBehavior,
            });
          }
          saveProjectsScroll({
            sector: filterSector,
            scrollY: targetY,
            restorePending: false,
          });
        }, 100);
      } else {
        rafId = requestAnimationFrame(applyScroll);
      }
    };

    rafId = requestAnimationFrame(applyScroll);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(settleTimeoutId);
    };
  }, [filterSector, visibleCount]);

  const handleSectorChange = (newSector: string) => {
    const currentY = typeof window !== 'undefined' ? window.scrollY : 0;
    setFilterSector(newSector);
    setVisibleCount(PAGE_SIZE);

    if (typeof window !== 'undefined') {
      saveProjectsScroll({
        sector: newSector,
        location: filterLocation,
        scrollY: currentY,
        visibleCount: PAGE_SIZE,
        restorePending: false,
      });

      const url = new URL(window.location.href);
      if (newSector && newSector !== 'All Sectors') {
        url.searchParams.set('sector', newSector);
      } else {
        url.searchParams.delete('sector');
      }
      const targetUrl = url.pathname + (url.search ? url.search : '');
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ sector: newSector }, '', targetUrl);
      }

      // Preserve current scroll position across DOM re-render without scrolling to top
      const preserveScroll = () => {
        if (currentY > 0 && Math.abs(window.scrollY - currentY) > 2) {
          window.scrollTo({ top: currentY, behavior: 'instant' });
        }
      };
      requestAnimationFrame(() => {
        preserveScroll();
        setTimeout(preserveScroll, 50);
      });
    }
  };

  const filteredProjects = projects.filter(p => {
    if (filterLocation !== 'All Locations') {
      const pCountry = getCountryFromLocation(p.location);
      if (pCountry !== filterLocation) return false;
    }
    if (filterSector !== 'All Sectors') {
      const sec = p.sector || p.clientSector || p.client_sector || '';
      if (!matchSector(sec, filterSector)) return false;
    }
    return true;
  });

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  const openProjectModal = (proj: LiveProject) => {
    const currentY = window.scrollY || lastScrollYRef.current;
    lastScrollYRef.current = currentY;

    saveProjectsScroll({
      sector: filterSector,
      location: filterLocation,
      scrollY: currentY,
      visibleCount,
      projectSlug: proj.slug,
      restorePending: true,
    });

    setSelected(proj);
    if (typeof window !== 'undefined' && proj.slug) {
      const currentParams = new URLSearchParams(window.location.search);
      const sectorParam = filterSector !== 'All Sectors' ? filterSector : currentParams.get('sector');
      const query = sectorParam && sectorParam !== 'All Sectors'
        ? `?sector=${encodeURIComponent(sectorParam)}`
        : '';
      const targetUrl = `/projects/${proj.slug}${query}`;
      if (window.location.pathname + window.location.search !== targetUrl) {
        window.history.pushState({ slug: proj.slug, sector: sectorParam }, '', targetUrl);
      }
    }
  };

  const closeProjectModal = () => {
    const savedY = lastScrollYRef.current;
    setSelected(null);
    if (typeof window !== 'undefined') {
      const currentParams = new URLSearchParams(window.location.search);
      const sectorParam = filterSector !== 'All Sectors' ? filterSector : currentParams.get('sector');
      const query = sectorParam && sectorParam !== 'All Sectors'
        ? `?sector=${encodeURIComponent(sectorParam)}`
        : '';
      const returnUrl = `/projects${query}`;
      if (window.location.pathname + window.location.search !== returnUrl) {
        window.history.pushState(null, '', returnUrl);
      }

      if (savedY > 0) {
        requestAnimationFrame(() => {
          window.scrollTo({ top: savedY, behavior: 'instant' });
        });
      }
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const pathname = window.location.pathname;
      const currentSearchParams = new URLSearchParams(window.location.search);
      const sectorFromUrl = currentSearchParams.get('sector');

      setFilterSector(getInitialSectorFilter(sectorFromUrl));

      if (pathname === '/projects' || pathname === '/projects/') {
        const wasModalOpen = !!selected;
        setSelected(null);
        if (wasModalOpen && lastScrollYRef.current > 0) {
          requestAnimationFrame(() => {
            window.scrollTo({ top: lastScrollYRef.current, behavior: 'instant' });
          });
        }
      } else if (pathname.startsWith('/projects/')) {
        const slug = pathname.replace('/projects/', '').split('/')[0];
        if (slug) {
          const matched = projects.find(p => p.slug === slug);
          if (matched) {
            setSelected(matched);
          }
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [projects, selected]);

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19] pb-32">
      <div className="pt-32 lg:pt-40 pb-16">
        <div className="container mx-auto px-6 lg:px-12">

          <Reveal>
            <div className="mb-12 border-b border-white/10 pb-12">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">Portfolio</span>
              <h1 className="text-4xl md:text-5xl font-sans font-bold text-white mb-8">Projects</h1>

              <div className="text-slate-400 font-light text-[15px] leading-relaxed max-w-4xl mb-10">
                <p className="mb-6 text-slate-300 text-base md:text-lg font-light leading-relaxed">
                  Every project reflects SEED's commitment to engineering excellence, technical precision and coordinated delivery. From luxury hospitality and high-rise residential developments to commercial, healthcare, infrastructure and mixed-use projects, our portfolio demonstrates how integrated engineering creates high-performance buildings across the Middle East, Africa, and Asia.
                </p>
                {/* Statistics Bar */}
                <div className="my-10 p-6 md:p-8 bg-[#0a1124] border border-gold/30 rounded-sm shadow-xl max-w-4xl">
                  <div className="grid grid-cols-3 gap-4 md:gap-8 text-center divide-x divide-white/10">
                    <div className="px-2 md:px-4">
                      <div className="text-3xl md:text-5xl font-sans font-bold text-gold mb-1">1,000+</div>
                      <div className="text-[10px] md:text-[12px] font-sans font-bold tracking-[0.2em] uppercase text-white/90">Projects</div>
                    </div>
                    <div className="px-2 md:px-4">
                      <div className="text-3xl md:text-5xl font-sans font-bold text-gold mb-1">46</div>
                      <div className="text-[10px] md:text-[12px] font-sans font-bold tracking-[0.2em] uppercase text-white/90">Cities</div>
                    </div>
                    <div className="px-2 md:px-4">
                      <div className="text-3xl md:text-5xl font-sans font-bold text-gold mb-1">26</div>
                      <div className="text-[10px] md:text-[12px] font-sans font-bold tracking-[0.2em] uppercase text-white/90">Countries</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-6 md:p-8 rounded-sm border border-white/10">
                <h2 className="text-lg font-sans font-bold text-white mb-6">Filter projects</h2>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <select
                      className="w-full bg-white/5 border border-white/10 text-[13px] py-4 px-4 text-slate-300 font-medium outline-none focus:ring-1 focus:ring-gold appearance-none cursor-pointer [&>option]:text-gray-900 [&>option]:bg-white"
                      value={filterLocation}
                      onChange={e => {
                        setFilterLocation(e.target.value);
                        setVisibleCount(PAGE_SIZE);
                      }}
                    >
                      {LOCATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <select
                      className="w-full bg-white/5 border border-white/10 text-[13px] py-4 px-4 text-slate-300 font-medium outline-none focus:ring-1 focus:ring-gold appearance-none cursor-pointer [&>option]:text-gray-900 [&>option]:bg-white"
                      value={filterSector}
                      onChange={e => handleSectorChange(e.target.value)}
                    >
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={() => {
                      const currentY = typeof window !== 'undefined' ? window.scrollY : 0;
                      setFilterLocation('All Locations');
                      handleSectorChange('All Sectors');
                      if (currentY > 0) {
                        requestAnimationFrame(() => {
                          window.scrollTo({ top: currentY, behavior: 'instant' });
                        });
                      }
                    }}
                    className="text-[12px] font-bold text-gold hover:text-yellow-400 uppercase tracking-wider transition-colors"
                  >
                    Reset filter
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <Stagger key={`${filterLocation}-${filterSector}`} className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6">
            {visibleProjects.map((proj) => {
              const spanClass = 'col-span-1 md:col-span-6 lg:col-span-4';

              const cardImage = proj.image || '';
              const imageCount = proj.imageCount ?? proj.images?.length ?? 0;

              return (
                <StaggerItem key={proj.id || proj.slug} className={spanClass}>
                  <div
                    data-project-slug={proj.slug}
                    className="group bg-[#0f172a] border border-white/5 rounded-sm overflow-hidden hover:border-gold/40 transition-all cursor-pointer flex flex-col h-full"
                    onClick={() => openProjectModal(proj)}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a1020]">
                      {cardImage ? (
                        <Image
                          src={cardImage}
                          alt={proj.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          style={
                            proj.slug === 'saas-st-regis'
                              ? { objectPosition: 'center 20%' }
                              : proj.slug === 'uptown-mercer-house'
                              ? { objectPosition: 'center 40%' }
                              : undefined
                          }
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-xs font-mono uppercase tracking-wider">
                          No Photo
                        </div>
                      )}
                      {imageCount > 1 && (
                        <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full border border-white/20 z-10 flex items-center gap-1.5 shadow-lg">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{imageCount} PHOTOS</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        {(() => {
                          const cardSector = formatProjectSector(proj.sector || proj.clientSector || proj.client_sector);
                          return cardSector ? (
                            <span className="text-gold text-[10px] font-bold tracking-[0.15em] uppercase mb-2 block">
                              {cardSector}
                            </span>
                          ) : null;
                        })()}
                        <h3 className="font-sans text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">{proj.title}</h3>
                        <p className="text-slate-400 text-[13px]">{proj.location.split('**')[0].trim()}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between">
                        <div className="pr-4">
                          {proj.services && (
                            <p className="text-slate-500 text-[11px] font-medium">{proj.services}</p>
                          )}
                        </div>
                        <span className="text-gold text-[10px] font-bold tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap">
                          View details →
                        </span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          {/* Load More Button */}
          {visibleCount < filteredProjects.length && (
            <div className="mt-16 flex flex-col items-center justify-center gap-4">
              <p className="text-xs font-mono tracking-widest uppercase text-slate-400">
                Showing {visibleProjects.length} of {filteredProjects.length} projects
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const currentY = window.scrollY;
                  const newCount = visibleCount + PAGE_SIZE;
                  setVisibleCount(newCount);
                  if (typeof window !== 'undefined' && currentY > 0) {
                    saveProjectsScroll({
                      sector: filterSector,
                      location: filterLocation,
                      scrollY: currentY,
                      visibleCount: newCount,
                      restorePending: false,
                    });
                    requestAnimationFrame(() => {
                      if (Math.abs(window.scrollY - currentY) > 5) {
                        window.scrollTo({ top: currentY, behavior: 'instant' });
                      }
                    });
                  }
                }}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#0a1124] hover:bg-gold text-gold hover:text-[#0b0f19] border border-gold/40 font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-all duration-300 rounded-sm shadow-lg group cursor-pointer"
              >
                <span>Load More Projects</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 transition-transform group-hover:translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          )}

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-slate-400">No projects found matching your criteria.</p>
            </div>
          )}

          {/* CALL TO ACTION */}
          <div className="mt-32 pt-20 border-t border-white/10 text-center max-w-4xl mx-auto">
            <Reveal>
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">Next steps</span>
              <h2 className="font-sans text-3xl md:text-5xl font-bold text-white mb-6">Let's discuss your next project</h2>
              <p className="text-slate-400 font-light text-[15px] leading-relaxed mb-10 max-w-2xl mx-auto">
                Whether you're planning a luxury hospitality destination, residential community, commercial tower, healthcare facility, or critical infrastructure, our multidisciplinary engineering team is ready to support your project from concept to commissioning.
              </p>
              <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm">
                Contact our team
              </Link>
            </Reveal>
          </div>

        </div>
      </div>

      {selected && <ProjectModal proj={selected} onClose={closeProjectModal} sector={filterSector} />}
    </div>
  );
}

export default function ProjectsContentWrapper({ projects }: ProjectsContentProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0f19]" />}>
      <ProjectsContent projects={projects} />
    </Suspense>
  );
}
