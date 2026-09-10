'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';
import { team } from '@/lib/data';

const TONE_BASE = 'bg-[#0b0f19]';
const TONE_LIFT = 'bg-[#0f172a]';
const TONE_NAVY = 'bg-[#0a1124]';

const AWARDS = [
  '• Big Project Middle East Awards 2026 – MEP Project of the Year – Wasl Tower',
  '• Big Project Middle East Awards 2026 – Honourable Achievement – Project of the Year (Residential) – The St. Regis Branded Residences',
  '• ISHRAE UAE MEERA Awards 2026 – Highly Commended – MEP Project of the Year – Hilton & Holiday Inn',
  '• Middle East Consultant Awards 2025 – Honourable Achievement – Executive of the Year – Male – Sanu Mathew',
];

const GLOBAL_OFFICES = [
  { city: 'Dubai', country: 'United Arab Emirates', role: 'Headquarters & Regional Design Hub', flag: '🇦🇪' },
  { city: 'Singapore', country: 'Singapore', role: 'Southeast Asia Regional Hub', flag: '🇸🇬' },
  { city: 'Mumbai', country: 'India', role: 'West India Design Center', flag: '🇮🇳' },
  { city: 'Kochi', country: 'India', role: 'South India Engineering Center', flag: '🇮🇳' },
  { city: 'Bengaluru', country: 'India', role: 'Digital Delivery & BIM Center', flag: '🇮🇳' },
  { city: 'Gurugram', country: 'India', role: 'North India Regional Office', flag: '🇮🇳' },
  { city: 'Pune', country: 'India', role: 'Engineering Design Center', flag: '🇮🇳' },
];

export default function AboutPage() {
  const [selectedOffice, setSelectedOffice] = useState<string | null>('Dubai');
  const leadership = team;

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">
      
      {/* ============ PAGE HERO ============ */}
      <section className={`relative ${TONE_BASE} text-white pt-40 pb-28 overflow-hidden`}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#0b0f19]" />
        <div className="relative max-w-container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="flex items-center gap-3 mb-8">
              <span className="block w-12 h-px bg-gold" />
              <span className="label text-gold tracking-[0.35em] text-[10px] font-semibold uppercase">ABOUT SEED</span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="font-serif text-[47px] md:text-[59px] lg:text-[71px] font-bold leading-[1.05] tracking-[-0.015em] max-w-5xl text-white">
              We solve engineering problems. We reduce project risk. We coordinate complex systems. We deliver measurable building performance.
            </h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-10 max-w-3xl text-lg md:text-xl text-slate-300 leading-relaxed font-light">
              Since 2005, SEED has delivered integrated MEP engineering design, supervision, sustainability consulting, BIM coordination and commissioning services for complex developments across the Middle East, Africa and India. Our engineering solutions prioritise performance, efficiency and long-term value throughout the building lifecycle.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ SECTION 2 – OUR STORY ============ */}
      <section className={`${TONE_LIFT} text-white py-24 md:py-32 border-t border-white/5`}>
        <div className="max-w-container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <span className="text-gold text-[10px] font-semibold tracking-[0.3em] uppercase mb-5 block">OUR STORY</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold leading-[1.1] text-white">
                Built on Engineering Excellence.
              </h2>
            </Reveal>
          </div>
          <div className="lg:col-span-7 text-slate-300 leading-relaxed space-y-6 text-[15px] font-light">
            <p>
              SEED Engineering was established in 2005 with a clear vision: to redefine building services engineering through technical excellence, collaboration and innovation.
            </p>
            <p>
              Over the past two decades, SEED has grown into one of the region’s leading MEP engineering consultancies, delivering projects across hospitality, residential, commercial, healthcare, education and mixed-use sectors.
            </p>
            <p>
              Today, with more than 200 professionals across seven offices, SEED partners with developers, architects and contractors to deliver high-performing buildings across the Middle East, Africa and India.
            </p>
          </div>
        </div>
      </section>

      {/* ============ SECTION 3 – WHY SEED ============ */}
      <section className={`${TONE_NAVY} text-white py-24 md:py-32 border-t border-white/5`}>
        <div className="max-w-container mx-auto px-6">
          <Reveal>
            <div className="mb-16">
              <span className="text-gold text-[10px] font-semibold tracking-[0.3em] uppercase mb-5 block">WHY SEED</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-white">
                Engineering That Delivers More Than Design
              </h2>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                title: 'Engineering Excellence',
                desc: 'Every engineering decision is driven by technical expertise, performance analysis and long-term operational value.',
              },
              {
                num: '02',
                title: 'Integrated Design',
                desc: 'MEP engineering, sustainability, BIM coordination and commissioning are delivered through a fully integrated approach.',
              },
              {
                num: '03',
                title: 'Performance Verification',
                desc: 'Our involvement extends beyond design through supervision, testing and commissioning support to ensure systems perform as intended.',
              },
              {
                num: '04',
                title: 'Digital Delivery',
                desc: 'Advanced BIM workflows improve coordination, reduce clashes and enhance project delivery.',
              },
              {
                num: '05',
                title: 'Regional Expertise',
                desc: 'Extensive experience across multiple markets enables SEED to deliver solutions aligned with local authority requirements and international best practices.',
              },
            ].map((card, i) => (
              <StaggerItem key={i}>
                <div className="bg-[#0b0f19] border border-white/10 p-8 md:p-10 h-full flex flex-col justify-between hover:border-gold/40 transition-colors group rounded-sm">
                  <div>
                    <span className="text-gold text-xs font-bold tracking-widest uppercase block mb-6">{card.num}</span>
                    <h3 className="font-serif text-2xl font-bold text-white mb-4 group-hover:text-gold transition-colors">{card.title}</h3>
                    <p className="text-slate-400 text-sm font-light leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============ SECTION 4 – LEADERSHIP ============ */}
      <section className={`${TONE_BASE} text-white py-24 md:py-32 border-t border-white/5`}>
        <div className="max-w-container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal>
              <span className="text-gold text-[10px] font-semibold tracking-[0.3em] uppercase mb-5 block">LEADERSHIP</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] text-white">
                Engineering Leadership
              </h2>
              <p className="mt-6 text-slate-400 text-base md:text-lg leading-relaxed font-light">
                SEED’s leadership team remains actively involved throughout every stage of project delivery, bringing decades of engineering expertise, strategic direction and technical excellence to every commission.
              </p>
            </Reveal>
          </div>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {leadership.map((m: any) => (
              <StaggerItem key={m._id || m.name} className="flex flex-col">
                <div className="bg-[#0f172a] border border-white/10 p-8 md:p-10 h-full flex-grow flex flex-col items-center text-center rounded-sm hover:border-gold/40 transition-colors group">
                  <div className="relative aspect-[3/4] w-full mb-7 overflow-hidden bg-[#0b0f19] rounded-sm">
                    {m.image ? (
                      <Image src={m.image} alt={m.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="font-serif text-7xl text-gold/30 select-none">
                          {m.name.split(' ').map((p: string) => p[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-white group-hover:text-gold transition-colors">
                      {m.name}
                    </h3>
                    {m.linkedin && (
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-gold transition-colors" aria-label={`${m.name} LinkedIn`}>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                      </a>
                    )}
                  </div>
                  <p className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-4">{m.role}</p>
                  <p className="text-sm text-slate-400 font-light leading-relaxed">{m.bio}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============ SECTION 5 – COMPANY STATISTICS ============ */}
      <section className={`${TONE_NAVY} text-white py-24 md:py-32 relative overflow-hidden border-t border-white/5`}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative max-w-container mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-gold text-[10px] font-semibold tracking-[0.3em] uppercase mb-4 block">COMPANY STATISTICS</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">SEED at a Glance</h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
            {[
              { v: 20, suf: '+', l: 'Years in Practice' },
              { v: 200, suf: '+', l: 'Engineering Professionals' },
              { v: 7, suf: '', l: 'Global Offices' },
              { v: 21, suf: '', l: 'Countries Served' },
            ].map((s) => (
              <Reveal key={s.l}>
                <div className="p-8 bg-[#0b0f19] border border-white/10 rounded-sm hover:border-gold/40 transition-colors">
                  <p className="font-serif text-5xl md:text-7xl font-bold text-gold mb-3">
                    <CountUp to={s.v} suffix={s.suf} />
                  </p>
                  <p className="text-xs md:text-sm font-sans font-bold tracking-[0.15em] uppercase text-slate-300">{s.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 6 – ENGINEERING PROCESS ============ */}
      <section className={`${TONE_BASE} text-white py-24 md:py-32 border-t border-white/5`}>
        <div className="max-w-container mx-auto px-6">
          <div className="mb-16 max-w-3xl">
            <Reveal>
              <span className="text-gold text-[10px] font-semibold tracking-[0.3em] uppercase mb-4 block">OUR PROCESS</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Our Engineering Process
              </h2>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed font-light">
                Every project follows a structured engineering methodology that transforms design intent into measurable building performance.
              </p>
            </Reveal>
          </div>

          <div className="space-y-0 border border-white/10">
            {[
              {
                step: '01',
                title: 'Define Design Criteria',
                desc: 'Every project begins with understanding the building, its operational requirements, applicable codes, energy targets, and owner expectations. We establish the design basis before a single system is selected.',
                outputs: ['Design Basis Report', 'Load Calculations', 'Performance Criteria', 'Code Compliance Strategy'],
              },
              {
                step: '02',
                title: 'Engineer the Systems',
                desc: 'We develop HVAC, Electrical, Plumbing, Fire Protection, ELV, and Sustainability strategies based on engineering calculations — not generic templates. System selection is driven by performance, constructability, maintainability, and lifecycle cost.',
                outputs: ['Engineering Calculations', 'Equipment Schedules', 'System Narratives', 'Preliminary Cost Alignment'],
              },
              {
                step: '03',
                title: 'Coordinate Across Disciplines',
                desc: 'Most construction issues originate at discipline interfaces. We coordinate architecture, structure, MEP, specialist vendors, and site constraints before construction begins. Clash detection is only one part of coordination — the objective is buildability.',
                outputs: ['Coordinated BIM Models', 'Clash Resolution Reports', 'Interface Reviews', 'Construction-Ready Layouts'],
              },
              {
                step: '04',
                title: 'Validate Before Construction',
                desc: 'Every major engineering decision is reviewed against performance requirements, installation constraints, and operational intent. Designs are subjected to internal quality checks before issue.',
                outputs: ['Design Reviews', 'Quality Assurance Checks', 'Risk Register Updates', 'Issue-for-Construction Documentation'],
              },
              {
                step: '05',
                title: 'Verify Performance On Site',
                desc: 'Engineering responsibility does not end with drawings. We verify installation quality, witness testing, support commissioning activities, and confirm systems perform as intended.',
                outputs: ['Site Inspections', 'Testing & Balancing Reviews', 'Commissioning Reports', 'Final Performance Verification'],
              },
            ].map((phase, i) => (
              <Reveal key={i}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-0 border-b border-white/10 last:border-b-0">
                  <div className="md:col-span-1 bg-[#0f172a] p-8 flex items-start justify-center md:justify-start border-r border-white/10">
                    <span className="text-gold font-serif text-2xl font-bold">{phase.step}</span>
                  </div>
                  <div className="md:col-span-5 bg-[#0f172a] p-8 border-r border-white/10">
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-4">{phase.title}</h3>
                    <p className="text-slate-400 leading-relaxed text-sm font-light">{phase.desc}</p>
                  </div>
                  <div className="md:col-span-6 bg-[#0b0f19] p-8">
                    <p className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-4">Outputs</p>
                    <ul className="space-y-2">
                      {phase.outputs.map((o, j) => (
                        <li key={j} className="flex items-start gap-3 text-slate-300 text-sm leading-relaxed font-light">
                          <span className="text-gold mt-1 shrink-0">—</span>
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 7 – AWARDS & RECOGNITION ============ */}
      <section className={`${TONE_LIFT} text-white py-24 md:py-32 border-t border-white/5`}>
        <div className="max-w-container mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-gold text-[10px] font-semibold tracking-[0.3em] uppercase mb-4 block">RECOGNITION</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white">Award-Winning Engineering Excellence</h2>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {AWARDS.map((award, idx) => (
              <StaggerItem key={idx}>
                <div className="bg-[#0b0f19] border border-white/10 p-8 rounded-sm hover:border-gold/40 transition-colors group flex items-start h-full">
                  <p className="text-slate-200 text-base md:text-lg leading-relaxed font-light">
                    {award}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============ SECTION 8 – GLOBAL PRESENCE ============ */}
      <section className={`${TONE_NAVY} text-white py-24 md:py-32 border-t border-white/5`}>
        <div className="max-w-container mx-auto px-6">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-gold text-[10px] font-semibold tracking-[0.3em] uppercase mb-4 block">OUR PRESENCE</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Engineering Across Regions</h2>
              <p className="text-slate-300 text-base md:text-lg leading-relaxed font-light max-w-2xl mx-auto">
                With strategically located offices and project experience across the Middle East, Africa and India, SEED delivers engineering solutions that combine regional expertise with international standards.
              </p>
            </div>
          </Reveal>

          {/* Interactive Office Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {GLOBAL_OFFICES.map((off) => (
              <Reveal key={off.city}>
                <div
                  onClick={() => setSelectedOffice(off.city)}
                  className={`p-6 rounded-sm border cursor-pointer transition-all ${
                    selectedOffice === off.city
                      ? 'bg-gold/10 border-gold shadow-lg shadow-gold/10'
                      : 'bg-[#0b0f19] border-white/10 hover:border-gold/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{off.flag}</span>
                    <span className="text-gold text-[10px] font-bold tracking-widest uppercase">{off.country}</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white mb-2">{off.city}</h3>
                  <p className="text-slate-400 text-xs font-light">{off.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SECTION 9 – CALL TO ACTION ============ */}
      <section className={`${TONE_BASE} text-white py-28 md:py-36 relative overflow-hidden border-t border-white/5`}>
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.3em] uppercase mb-4 block">START YOUR PROJECT</span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
              Let’s Build Better Together
            </h2>
            <p className="text-slate-300 font-light text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you’re developing a luxury hospitality destination, a high-rise commercial tower or a complex mixed-use development, SEED is ready to help deliver engineering solutions that perform from concept through operation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm"
              >
                Request Consultation →
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-10 py-5 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-white hover:bg-white/5 transition-colors duration-300 rounded-sm"
              >
                Explore Projects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
