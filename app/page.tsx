import Link from 'next/link';
import Image from 'next/image';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { CountUp } from '@/components/ui/CountUp';
import { HeroSlider } from '@/components/sections/HeroSlider';

export const metadata = {
  title: 'SEED Engineering — Engineering High-Performance Buildings',
  description: 'SEED delivers integrated MEP engineering, sustainability consulting, and commissioning services for complex developments globally.',
};

const CORE_SERVICES = [
  { title: 'Mechanical Engineering', desc: 'HVAC systems designed for performance, efficiency and operational reliability across all building types.', icon: 'M4 4h16v16H4z' },
  { title: 'Electrical Engineering', desc: 'Power distribution, lighting, emergency systems and resilience planning for modern buildings.', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
  { title: 'Public Health Engineering', desc: 'Water supply, drainage, irrigation and specialist plumbing systems for every project scale.', icon: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' },
  { title: 'Fire Protection', desc: 'Life safety systems engineered to international standards for occupant protection.', icon: 'M12 2c0 0-5 6-5 11a5 5 0 1 0 10 0c0-5-5-11-5-11z' },
  { title: 'ELV Systems', desc: 'Security, ICT, BMS and integrated smart building infrastructure for intelligent operations.', icon: 'M5 12h14M12 5v14' },
  { title: 'Sustainability', desc: 'Energy modelling, green certifications and carbon reduction strategies for LEED, Estidama and WELL.', icon: 'M12 2v20M4.93 4.93l14.14 14.14M2 12h20M4.93 19.07L19.07 4.93' },
  { title: 'BIM Coordination', desc: 'Multidisciplinary coordination and clash-free construction documentation from concept to IFC.', icon: 'M4 4h16v16H4z' },
  { title: 'Commissioning', desc: 'Performance verification ensuring every system operates exactly as intended — on site.', icon: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z' },
];

const SECTORS = [
  'Hospitality', 'Residential', 'Commercial', 'Mixed-Use', 'Education', 'Healthcare', 'Retail', 
  'Sports & Stadiums', 'Entertainment, Cultural & Public Buildings', 'Airports', 'Theme Parks', 'Villas', 'Infrastructure & Sustainable Communities'
];

export default function HomePage() {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">
      <HeroSlider />

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 md:py-32 bg-[#0f172a]">
        <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <Reveal>
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">WHO WE ARE</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Engineering Decisions,<br/>Not Just Drawings.
              </h2>
              <div className="space-y-6 text-slate-400 text-[15px] leading-relaxed font-light mb-10">
                <p>
                  SEED solves engineering problems. We reduce project risk through analytical rigour, proactive BIM coordination, and hands-on commissioning — ensuring the built outcome matches the design intent.
                </p>
                <p>
                  We coordinate complex systems across disciplines and deliver measurable building performance. Every system we design is verified in the field.
                </p>
                <p>
                  Operating across the Middle East, Africa, and Asia since 2005 — with 200+ engineers across 7 offices.
                </p>
              </div>
              <Link href="/services" className="inline-flex items-center justify-center px-8 py-4 font-sans text-[11px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 bg-white text-[#0b0f19] hover:bg-slate-200">
                OUR CAPABILITIES
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <div className="relative aspect-[3/4] md:aspect-[4/5] w-full max-w-md mx-auto lg:ml-auto">
              <Image 
                src="/projects/mandarin-wasl-tower.webp" 
                alt="MEP Engineering" 
                fill 
                className="object-cover" 
              />
              <div className="absolute -bottom-6 -left-6 bg-gold p-8 w-48 shadow-2xl">
                <div className="text-4xl font-serif font-bold text-[#0b0f19] mb-2">20+</div>
                <div className="text-[11px] font-sans font-medium uppercase tracking-wider text-[#0b0f19] leading-tight">
                  Years of<br/>Engineering<br/>Excellence
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 md:py-32 bg-[#1a1d24]">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="mb-16 max-w-2xl">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">ENGINEERING SERVICES</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Integrated Engineering<br/>Solutions.
              </h2>
              <p className="text-slate-400 font-light text-[15px] leading-relaxed">
                From high-rise luxury towers to complex infrastructure, our eight core disciplines provide a seamless delivery framework that governs every phase of your project.
              </p>
              <div className="mt-8">
                <Link href="/services" className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300">
                  VIEW OUR SERVICES
                </Link>
              </div>
            </div>
          </Reveal>
          <Stagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_SERVICES.map((service, i) => (
              <StaggerItem key={i}>
                <div className="group p-6 border border-white/8 bg-[#0f172a] hover:border-gold/40 hover:bg-[#0f172a]/80 transition-all duration-300 h-full">
                  <svg className="w-6 h-6 text-gold mb-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                  </svg>
                  <h3 className="text-white font-serif text-[17px] font-semibold mb-3 group-hover:text-gold transition-colors">{service.title}</h3>
                  <p className="text-slate-400 text-[13px] font-light leading-relaxed">{service.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* PORTFOLIO SECTION */}
      <section id="projects" className="py-24 md:py-32 bg-[#0b0f19]">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="mb-16 max-w-2xl text-center mx-auto">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">PORTFOLIO</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Featured Projects
              </h2>
              <p className="text-slate-400 font-light text-[15px] leading-relaxed">
                Every project begins with a problem to solve. Below are a selection of landmark developments where SEED delivered integrated MEP engineering, sustainability and BIM coordination across complex, multi-disciplinary programmes.
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-6xl mx-auto">
            {[
              { img: '/projects/mandarin-wasl-tower.webp', title: 'Mandarin Oriental Wasl Tower', loc: 'DUBAI, UAE' },
              { img: '/projects/saas---st-regis-pic-1.webp', title: 'St. Regis Branded Residence', loc: 'ABU DHABI, UAE' },
              { img: '/projects/ellington-sands-1---2-aurelie-dubai-islands---plot-b---vision---rev02.webp', title: 'Ellington Sands 1 & 2', loc: 'DUBAI, UAE' }
            ].map((proj, idx) => (
              <StaggerItem key={idx}>
                <div className="group relative overflow-hidden cursor-pointer rounded-sm bg-[#0a1020] border border-white/5 flex flex-col h-full">
                  <div className="relative w-full h-[400px]">
                    <Image
                      src={proj.img}
                      alt={proj.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent opacity-90 transition-opacity duration-300 pointer-events-none" />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end pointer-events-none">
                    <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-3 block">{proj.loc}</span>
                    <h3 className="font-serif text-xl md:text-2xl font-bold text-white group-hover:text-gold transition-colors">{proj.title}</h3>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal>
            <div className="text-center">
              <Link href="/projects" className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-sans text-[11px] font-semibold tracking-[0.15em] uppercase hover:border-gold hover:text-gold transition-colors duration-300">
                VIEW ALL PROJECTS
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-24 bg-[#0b0f19] border-y border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/5">
            {[
              { value: 142, suffix: '', label: 'Projects Delivered' },
              { value: 8, suffix: ' M+', label: 'Sq Ft Designed' },
              { value: 21, suffix: '+', label: 'Countries' },
              { value: 21, suffix: '+', label: 'Years of Experience' },
            ].map((stat, i) => (
              <StaggerItem key={i} className="px-4">
                <div className="text-5xl md:text-6xl font-serif font-bold text-gold mb-4 flex justify-center items-baseline">
                  <CountUp to={stat.value} />
                  <span className="text-3xl ml-1">{stat.suffix}</span>
                </div>
                <div className="text-[11px] font-medium tracking-[0.15em] uppercase text-white">
                  {stat.label}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ENGINEERING DELIVERY FRAMEWORK */}
      <section id="process" className="py-24 md:py-32 bg-[#0f172a]">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="mb-20 max-w-3xl">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">OUR PROCESS</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-white mb-6">
                Our Engineering<br/>Delivery Framework
              </h2>
              <p className="text-slate-400 font-light text-[15px] leading-relaxed">
                Engineering responsibility does not end with drawings. Five progressive stages — the framework that governs every project we deliver from brief to building performance.
              </p>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-white/8">
            {[
              {
                step: '01',
                title: 'Define Design Criteria',
                desc: 'Every project begins with understanding the building, its operational requirements, applicable codes, energy targets, and owner expectations. We establish the design basis before a single system is selected.',
                items: ['Design Basis Report', 'Load Calculations', 'Performance Criteria', 'Code Compliance Strategy']
              },
              {
                step: '02',
                title: 'Engineer the Systems',
                desc: 'We develop HVAC, Electrical, Plumbing, Fire Protection, ELV and Sustainability strategies based on engineering calculations — not generic templates. System selection is driven by performance, constructability, maintainability and lifecycle cost.',
                items: ['Engineering Calculations', 'Equipment Schedules', 'System Narratives', 'Preliminary Cost Alignment']
              },
              {
                step: '03',
                title: 'Coordinate Across Disciplines',
                desc: 'Most construction issues originate at discipline interfaces. We coordinate architecture, structure, MEP, specialist vendors and site constraints before construction begins. Clash detection is only one part — the objective is buildability.',
                items: ['Coordinated BIM Models', 'Clash Resolution Reports', 'Interface Reviews', 'Construction-Ready Layouts']
              },
              {
                step: '04',
                title: 'Validate Before Construction',
                desc: 'Every major engineering decision is reviewed against performance requirements, installation constraints and operational intent. Designs are subjected to internal quality checks before issue.',
                items: ['Design Reviews', 'Quality Assurance Checks', 'Risk Register Updates', 'Issue-for-Construction Docs']
              },
              {
                step: '05',
                title: 'Verify Performance On Site',
                desc: 'Engineering responsibility does not end with drawings. We verify installation quality, witness testing, support commissioning activities and confirm systems perform as intended.',
                items: ['Site Inspections', 'Testing & Balancing Reviews', 'Commissioning Reports', 'Final Performance Verification']
              },
            ].map((phase, i) => (
              <StaggerItem key={i}>
                <div className={`p-8 h-full border-r border-white/8 last:border-r-0 hover:bg-white/3 transition-colors duration-300`}>
                  <span className="text-gold text-[11px] font-bold block mb-2">{phase.step}</span>
                  <h3 className="text-xl font-serif font-bold text-white mb-4">{phase.title}</h3>
                  <p className="text-slate-500 text-[12px] leading-relaxed mb-5">{phase.desc}</p>
                  <p className="text-gold text-[9px] font-bold tracking-[0.15em] uppercase mb-3">Outputs</p>
                  <ul className="space-y-2">
                    {phase.items.map((item, j) => (
                      <li key={j} className="text-slate-400 font-light text-[12px] leading-relaxed flex items-start gap-2">
                        <span className="text-gold/50 mt-1 shrink-0">—</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SECTORS SECTION */}
      <section className="py-24 md:py-32 bg-[#0b0f19]">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">INDUSTRIES</span>
            <h2 className="font-serif text-4xl font-bold text-white mb-6">Industries We Serve</h2>
            <p className="text-slate-400 font-light text-[14px] leading-relaxed max-w-2xl mx-auto mb-16">
              Our engineering expertise spans the full range of complex building typologies — each with distinct regulatory, performance and operational demands.
            </p>
            <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
              {SECTORS.map((sector, i) => (
                <Link key={i} href={`/projects?sector=${encodeURIComponent(sector)}`} className="px-6 py-4 border border-white/10 bg-transparent text-[11px] font-medium tracking-[0.1em] uppercase text-white hover:border-gold hover:text-gold transition-colors cursor-pointer block">
                  {sector}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <Image
          src="/city_aerial_night_1780504844349.webp"
          alt="Contact Background"
          fill
          className="object-cover opacity-50 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-[#0b0f19]/60" />
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-6 block">START A CONVERSATION</span>
            <h2 className="font-serif text-5xl md:text-6xl font-bold text-white mb-6">
              Planning a Complex<br/>Building Project?
            </h2>
            <p className="text-slate-300 font-light text-lg max-w-xl mx-auto mb-10">
              Speak with our engineering team about MEP design, sustainability, BIM coordination and commissioning requirements.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300">
                REQUEST CONSULTATION
              </Link>
              <Link href="/projects" className="inline-flex items-center justify-center px-10 py-5 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-white hover:bg-white/5 transition-colors duration-300">
                EXPLORE PROJECTS
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
