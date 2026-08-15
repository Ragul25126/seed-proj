'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { ProjectGallery } from '@/components/projects/ProjectGallery';

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
  image?: string | null;       // cover image URL
  images?: string[];           // all image URLs (ordered by display_order)
};

// ─── modal ───────────────────────────────────────────────────────────────────

function ProjectModal({ proj, onClose }: { proj: LiveProject; onClose: () => void }) {
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
        if (data.images && data.images.length > 0) {
          setLiveImages(data.images);
        }
      })
      .catch(() => { /* fall back to project.images */ });
  }, [proj.slug]);

  const details = [
    proj.client    && { label: 'Client',    value: proj.client },
    proj.architect && { label: 'Architect', value: proj.architect },
    proj.services  && { label: 'Services',  value: proj.services },
    proj.area      && { label: 'Area',      value: proj.area },
    proj.sector    && { label: 'Sector',    value: proj.sector },
  ].filter(Boolean) as { label: string; value: string }[];

  // Prefer live Supabase images → then server-rendered images → then cover
  const fallbackImages = (proj.images && proj.images.length > 0)
    ? proj.images
    : (proj.image ? [proj.image] : []);
  const images = (liveImages && liveImages.length > 0) ? liveImages : fallbackImages;

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
          <ProjectGallery
            images={images}
            title={proj.title}
            aspectRatio="aspect-[16/9]"
            objectFit={proj.slug === 'saas-st-regis' ? 'contain' : 'cover'}
            containImages={['/projects/mandarin-wasl-2-new.jpg', '/projects/ellington-hq.png', '/projects/uptown-mercer-house-skyline.jpg', '/projects/uptown-mercer-house-lobby.jpg', '/projects/uptown-mercer-house-pool.jpg', '/projects/uptown-mercer-house-retail.jpg', '/projects/uptown-mercer-house-balcony.jpg']}
          />
        </div>

        {/* Content */}
        <div className="p-6 sm:p-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {proj.sector && (
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold border border-gold/30 px-3 py-1 rounded-full">
                {proj.sector}
              </span>
            )}
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 border border-white/10 px-3 py-1 rounded-full">
              {proj.location.split('**')[0].trim()}
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6 leading-tight">{proj.title}</h2>

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
              href={`/projects/${proj.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-yellow-500 text-[#0b0f19] text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
            >
              VIEW FULL PROJECT PAGE →
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

function ProjectsContent({ projects }: ProjectsContentProps) {
  const searchParams = useSearchParams();
  const sectorQuery = searchParams?.get('sector');

  // Build filter options from the live Supabase project list
  const uniqueLocations = Array.from(new Set(
    projects.map(p => p.location.split('**')[0].trim())
  )).sort();
  const LOCATIONS = ['All Locations', ...uniqueLocations];

  const uniqueSectors = Array.from(new Set(
    projects.map(p => p.sector || p.clientSector || p.client_sector || '').filter(Boolean)
  )).sort();
  const SECTORS = ['All Sectors', ...uniqueSectors];

  const [filterLocation, setFilterLocation] = useState('All Locations');
  const [filterSector, setFilterSector] = useState(
    sectorQuery && SECTORS.includes(sectorQuery) ? sectorQuery : 'All Sectors'
  );
  const [selected, setSelected] = useState<LiveProject | null>(null);

  useEffect(() => {
    if (sectorQuery && SECTORS.includes(sectorQuery)) {
      setFilterSector(sectorQuery);
    }
  }, [sectorQuery]);

  const filteredProjects = projects.filter(p => {
    if (filterLocation !== 'All Locations' && !p.location.includes(filterLocation.split(',')[0])) return false;
    if (filterSector !== 'All Sectors') {
      const sec = p.sector || p.clientSector || p.client_sector || '';
      if (sec !== filterSector) return false;
    }
    return true;
  });

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19] pb-32">
      <div className="pt-32 lg:pt-40 pb-16">
        <div className="container mx-auto px-6 lg:px-12">

          <Reveal>
            <div className="mb-12 border-b border-white/10 pb-12">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">PORTFOLIO</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">Projects</h1>

              <div className="text-slate-400 font-light text-[15px] leading-relaxed max-w-4xl mb-10">
                <p className="mb-6 text-slate-300 text-base md:text-lg font-light leading-relaxed">
                  Every project reflects SEED's commitment to engineering excellence, technical precision, and coordinated delivery. From luxury hospitality and high-rise residential developments to commercial, healthcare, infrastructure, and mixed-use projects, our portfolio demonstrates how integrated engineering creates high-performance buildings across the Middle East, Africa, and Asia.
                </p>
                {/* Statistics Bar */}
                <div className="my-10 p-6 md:p-8 bg-[#0a1124] border border-gold/30 rounded-sm shadow-xl max-w-4xl">
                  <div className="grid grid-cols-3 gap-4 md:gap-8 text-center divide-x divide-white/10">
                    <div className="px-2 md:px-4">
                      <div className="text-3xl md:text-5xl font-serif font-bold text-gold mb-1">1,000+</div>
                      <div className="text-[10px] md:text-[12px] font-sans font-bold tracking-[0.2em] uppercase text-white/90">Projects</div>
                    </div>
                    <div className="px-2 md:px-4">
                      <div className="text-3xl md:text-5xl font-serif font-bold text-gold mb-1">28</div>
                      <div className="text-[10px] md:text-[12px] font-sans font-bold tracking-[0.2em] uppercase text-white/90">Cities</div>
                    </div>
                    <div className="px-2 md:px-4">
                      <div className="text-3xl md:text-5xl font-serif font-bold text-gold mb-1">21</div>
                      <div className="text-[10px] md:text-[12px] font-sans font-bold tracking-[0.2em] uppercase text-white/90">Countries</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 p-6 md:p-8 rounded-sm border border-white/10">
                <h2 className="text-lg font-serif font-bold text-white mb-6">Filter Projects</h2>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <select
                      className="w-full bg-white/5 border border-white/10 text-[13px] py-4 px-4 text-slate-300 font-medium outline-none focus:ring-1 focus:ring-gold appearance-none cursor-pointer [&>option]:text-gray-900 [&>option]:bg-white"
                      value={filterLocation}
                      onChange={e => setFilterLocation(e.target.value)}
                    >
                      {LOCATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex-1">
                    <select
                      className="w-full bg-white/5 border border-white/10 text-[13px] py-4 px-4 text-slate-300 font-medium outline-none focus:ring-1 focus:ring-gold appearance-none cursor-pointer [&>option]:text-gray-900 [&>option]:bg-white"
                      value={filterSector}
                      onChange={e => setFilterSector(e.target.value)}
                    >
                      {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex justify-start">
                  <button
                    onClick={() => { setFilterLocation('All Locations'); setFilterSector('All Sectors'); }}
                    className="text-[12px] font-bold text-gold hover:text-yellow-400 uppercase tracking-wider transition-colors"
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <Stagger key={`${filterLocation}-${filterSector}`} className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6">
            {filteredProjects.map((proj, idx) => {
              const total = filteredProjects.length;
              let spanClass = 'col-span-1 md:col-span-6 lg:col-span-4';

              if (total % 3 === 2 && idx === total - 2) spanClass += ' lg:col-start-3';
              else if (total % 3 === 1 && idx === total - 1) spanClass += ' lg:col-start-5';

              if (total % 2 === 1 && idx === total - 1) spanClass += ' md:col-start-4 lg:col-start-auto';

              const cardImage = proj.image || '';
              const imageCount = proj.images?.length ?? 0;

              return (
                <StaggerItem key={proj.id || proj.slug} className={spanClass}>
                  <div
                    className="group bg-[#0f172a] border border-white/5 rounded-sm overflow-hidden hover:border-gold/40 transition-all cursor-pointer flex flex-col h-full"
                    onClick={() => setSelected(proj)}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0a1020]">
                      {cardImage && (
                        <Image
                          src={cardImage}
                          alt={proj.title}
                          fill
                          unoptimized
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
                        <span className="text-gold text-[10px] font-bold tracking-[0.15em] uppercase mb-2 block">
                          {proj.sector || proj.clientSector || proj.client_sector}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors">{proj.title}</h3>
                        <p className="text-slate-400 text-[13px]">{proj.location.split('**')[0].trim()}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between">
                        <div className="pr-4">
                          {proj.services && (
                            <p className="text-slate-500 text-[11px] font-medium">{proj.services}</p>
                          )}
                        </div>
                        <span className="text-gold text-[10px] font-bold tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0 whitespace-nowrap">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-slate-400">No projects found matching your criteria.</p>
            </div>
          )}

          {/* CALL TO ACTION */}
          <div className="mt-32 pt-20 border-t border-white/10 text-center max-w-4xl mx-auto">
            <Reveal>
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">NEXT STEPS</span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-6">Let's Discuss Your Next Project</h2>
              <p className="text-slate-400 font-light text-[15px] leading-relaxed mb-10 max-w-2xl mx-auto">
                Whether you're planning a luxury hospitality destination, residential community, commercial tower, healthcare facility, or critical infrastructure, our multidisciplinary engineering team is ready to support your project from concept to commissioning.
              </p>
              <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm">
                Contact Our Team
              </Link>
            </Reveal>
          </div>

        </div>
      </div>

      {selected && <ProjectModal proj={selected} onClose={() => setSelected(null)} />}
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
