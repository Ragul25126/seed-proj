'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';

export interface PositionItem {
  id?: string;
  ref: string;
  title: string;
  qual: string;
  dept?: string;
  apply_email?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  description: string | null;
  requirements: string | null;
  application_instructions: string | null;
  application_email: string | null;
  poster_url: string | null;
  positions: PositionItem[] | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

interface CareersClientProps {
  vacancies: Vacancy[];
}

const HIRING_STEPS = [
  { step: 'Step 01', title: 'Application', desc: 'Submit your application online or via email.' },
  { step: 'Step 02', title: 'Review', desc: 'Our recruitment team reviews your qualifications and experience.' },
  { step: 'Step 03', title: 'Interview', desc: 'Meet our technical and leadership teams.' },
  { step: 'Step 04', title: 'Offer', desc: 'Successful candidates receive an employment offer.' },
  { step: 'Step 05', title: 'Welcome to SEED', desc: 'Begin your journey with onboarding and team integration.' },
];

export default function CareersClient({ vacancies }: CareersClientProps) {
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  const activeVacancies = vacancies || [];

  const scrollToOpenings = () => {
    const el = document.getElementById('openings');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredVacancies = activeVacancies.filter(v => {
    if (activeTab === 'all') return true;
    return v.location?.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">

      {/* SECTION 01 – HERO BANNER */}
      <section className="relative pt-40 pb-28 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <Image
            src="/modern_mep_interior_1780503503410.webp"
            alt="SEED Team"
            fill
            className="object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#0b0f19]/90 to-[#0b0f19]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 block">
              Careers
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Build the future with SEED
            </h1>
            <p className="text-lg md:text-xl font-sans font-light text-slate-400 leading-relaxed max-w-3xl mx-auto mb-10">
              Join a team of passionate engineers, designers and professionals committed to delivering innovative engineering solutions. At SEED, you’ll work on landmark developments, collaborate with industry experts and build a career that makes a lasting impact.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={scrollToOpenings}
                className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm"
              >
                View open vacancies ↓
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 02 – VACANCIES SECTION */}
      <section id="openings" className="py-24 bg-[#0f172a] border-t border-white/5 scroll-mt-20">
        <div className="container mx-auto px-6 lg:px-12">

          {activeVacancies.length > 0 && (
            <div>
              <Reveal>
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-3 block">
                    We are hiring!
                  </span>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                    Current opportunities
                  </h2>
                  <p className="text-slate-400 font-light text-[15px] leading-relaxed">
                    Explore our active vacancy sections below. Click any flyer image to view in high resolution or apply directly for open positions.
                  </p>

                  {/* Office Filter Tabs */}
                  <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-6 py-3 text-[11px] font-bold tracking-wider uppercase rounded-sm border transition-all ${
                        activeTab === 'all'
                          ? 'bg-gold text-[#0b0f19] border-gold shadow-lg'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:border-gold/50'
                      }`}
                    >
                      All vacancies
                    </button>
                    <button
                      onClick={() => setActiveTab('dubai')}
                      className={`px-6 py-3 text-[11px] font-bold tracking-wider uppercase rounded-sm border transition-all ${
                        activeTab === 'dubai'
                          ? 'bg-gold text-[#0b0f19] border-gold shadow-lg'
                          : 'bg-[#0b0f19]/5 text-slate-300 border-white/10 hover:border-gold/50'
                      }`}
                    >
                      Dubai design office
                    </button>
                    <button
                      onClick={() => setActiveTab('india')}
                      className={`px-6 py-3 text-[11px] font-bold tracking-wider uppercase rounded-sm border transition-all ${
                        activeTab === 'india'
                          ? 'bg-gold text-[#0b0f19] border-gold shadow-lg'
                          : 'bg-[#0b0f19]/5 text-slate-300 border-white/10 hover:border-gold/50'
                      }`}
                    >
                      India outsourcing office
                    </button>
                  </div>
                </div>
              </Reveal>

              {/* Vacancies List */}
              <div className="max-w-6xl mx-auto space-y-16 mb-20">
                {filteredVacancies.map((v, flyerIdx) => {
                  const hasPoster = Boolean(v.poster_url && v.poster_url.trim() !== '');
                  const posterSrc = hasPoster ? v.poster_url! : '';
                  const appEmail = v.application_email || 'hr@seedengineering.com';

                  // Build positions list – only positions belonging specifically to this vacancy
                  const posList: PositionItem[] = Array.isArray(v.positions) ? v.positions : [];

                  return (
                    <Reveal key={v.id || flyerIdx}>
                      <div className="bg-[#0b0f19] border border-white/10 p-6 md:p-10 rounded-sm overflow-hidden shadow-2xl">
                        <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8">

                          {/* LEFT COLUMN: RECRUITMENT POSTER IMAGE (ONLY IF POSTER EXISTS) */}
                          {hasPoster && (
                            <div
                              className="relative w-full lg:w-1/2 aspect-[3/4.2] rounded-sm overflow-hidden border border-gold/30 shadow-2xl cursor-pointer group bg-slate-900 shrink-0"
                              onClick={() => setSelectedPoster(posterSrc)}
                            >
                              <Image
                                src={posterSrc}
                                alt={v.title}
                                fill
                                className="object-contain group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="px-6 py-3 bg-gold text-[#0b0f19] text-xs font-bold uppercase tracking-wider rounded-sm shadow-lg">
                                  🔍 Click to Enlarge Poster
                                </span>
                              </div>
                            </div>
                          )}

                          {/* RIGHT COLUMN: VACANCY INFORMATION & POSITION CARDS */}
                          <div className={`w-full ${hasPoster ? 'lg:w-1/2' : 'lg:w-full'} flex flex-col justify-between`}>
                            <div>
                              <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase block mb-2">
                                {v.location || 'Office Location'}
                              </span>
                              <h3 className="font-serif text-3xl font-bold text-white mb-4">
                                {v.title}
                              </h3>
                              {v.description && (
                                <p className="text-slate-400 text-sm font-light leading-relaxed mb-6">
                                  {v.description}
                                </p>
                              )}

                              {/* Stacked Scrollable Position Cards */}
                              {posList.length > 0 ? (
                                <div className="space-y-3 mb-8 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
                                  {posList.map((pos, pIdx) => {
                                    const mailtoSubject = `Application for REF: ${pos.ref || `POS-${pIdx+1}`} - ${encodeURIComponent(pos.title)}`;
                                    const positionEmail = pos.apply_email || appEmail;
                                    return (
                                      <div
                                        key={pIdx}
                                        className="bg-white/5 border border-white/8 p-3.5 rounded-sm flex items-center justify-between hover:border-gold/40 transition-colors"
                                      >
                                        <div className="pr-3">
                                          <span className="text-gold text-[9px] font-bold tracking-widest block uppercase">
                                            REF: {pos.ref || `POS-0${pIdx + 1}`}
                                          </span>
                                          <h4 className="text-white text-sm font-semibold">{pos.title}</h4>
                                          {pos.qual && <p className="text-slate-400 text-xs font-light">{pos.qual}</p>}
                                        </div>
                                        <a
                                          href={`mailto:${positionEmail}?subject=${mailtoSubject}`}
                                          className="px-3 py-1.5 bg-gold/10 hover:bg-gold hover:text-[#0b0f19] border border-gold/30 text-gold text-[10px] font-bold tracking-wider uppercase transition-colors shrink-0 rounded-sm"
                                        >
                                          Apply →
                                        </a>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="p-4 bg-white/5 border border-white/10 rounded-sm text-xs text-slate-400 mb-8 italic">
                                  Positions for this vacancy will be announced soon.
                                </div>
                              )}
                            </div>

                            {/* Bottom Banner Button */}
                            <a
                              href={`mailto:${appEmail}?subject=${encodeURIComponent(`Application for ${v.title}`)}`}
                              className="w-full inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm text-center"
                            >
                              Apply for {v.location || v.title} ({appEmail}) →
                            </a>
                          </div>

                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          )}

          {/* PERMANENT GENERAL CV MESSAGE SECTION */}
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="bg-[#0b0f19] border border-gold/30 p-8 md:p-12 rounded-sm text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
                <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 block">
                  Talent network
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
                  Interested in joining SEED?
                </h2>
                <p className="text-slate-300 font-light text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                  We are always interested in hearing from talented people who would like to join our team. Please send your CV to{' '}
                  <a
                    href="mailto:hr@seedengineering.com"
                    className="text-gold hover:underline font-semibold transition-colors"
                  >
                    hr@seedengineering.com
                  </a>{' '}
                  and we will keep your details on file for future opportunities.
                </p>
                <div className="flex justify-center">
                  <a
                    href="mailto:hr@seedengineering.com?subject=Speculative Application - Submit Your CV"
                    className="inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm"
                  >
                    Submit your CV
                  </a>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </section>

      {/* HIRING PROCESS STEPS */}
      <section className="py-24 bg-[#0b0f19] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-3 block">
                How we hire
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                Our recruitment process
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {HIRING_STEPS.map((step, sIdx) => (
              <Reveal key={sIdx}>
                <div className="bg-[#0f172a] border border-white/10 p-6 rounded-sm h-full flex flex-col justify-between hover:border-gold/30 transition-colors">
                  <div>
                    <span className="text-gold text-xs font-mono font-bold block mb-3">
                      {step.step}
                    </span>
                    <h3 className="text-white text-base font-semibold mb-2">{step.title}</h3>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FULLSCREEN POSTER MODAL */}
      {selectedPoster && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          onClick={() => setSelectedPoster(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-4 right-4 text-white hover:text-gold text-2xl font-bold bg-black/50 px-4 py-2 rounded-sm border border-white/20 z-10"
            >
              ✕ Close
            </button>
            <div className="relative w-full h-full max-h-[85vh]">
              <Image
                src={selectedPoster}
                alt="Recruitment Poster Enlarged"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
