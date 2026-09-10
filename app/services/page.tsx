'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';

const SERVICES_DATA = [
  {
    id: 'mep-design',
    num: '01',
    title: 'MEP Design',
    tagline: 'Engineering the systems that make buildings perform.',
    desc: 'Every successful building depends on engineering systems working together seamlessly. Our multidisciplinary teams deliver coordinated mechanical, electrical and public health engineering that improves efficiency, occupant comfort and operational performance.',
    image: '/services/mep-design-pic2.jpg',
    services: [
      'HVAC Systems',
      'Electrical Distribution',
      'Public Health Engineering',
      'Fire Protection',
      'Central Plant Design',
      'BIM Coordination',
    ],
  },
  {
    id: 'mep-supervision',
    num: '02',
    title: 'MEP Supervision',
    tagline: 'Protecting engineering quality during construction.',
    desc: 'Our supervision teams ensure engineering designs are executed accurately on site, maintaining quality, compliance and smooth project delivery from installation through commissioning.',
    image: '/services/MEP supervision.png',
    services: [
      'Site Supervision',
      'Quality Assurance',
      'Shop Drawing Review',
      'Testing & Commissioning',
      'Snagging',
      'Project Handover',
    ],
  },
  {
    id: 'elv-ict-av',
    num: '03',
    title: 'ELV / ICT & AV',
    tagline: 'Creating intelligent, connected buildings.',
    desc: 'We design digital infrastructure that enables communication, automation and smart building operation while supporting future technologies.',
    image: '/service_electrical_1780505637062.webp',
    services: [
      'ICT Networks',
      'Structured Cabling',
      'Building Management Systems',
      'Smart Buildings',
      'Data Centres',
      'Audio Visual Systems',
    ],
  },
  {
    id: 'security-systems',
    num: '04',
    title: 'Security Systems',
    tagline: 'Integrated protection by design.',
    desc: 'Security systems are fully integrated into the engineering strategy, protecting people, assets and operations without compromising architecture or user experience.',
    image: '/services/intergrated security.jpeg',
    services: [
      'CCTV',
      'Access Control',
      'Intrusion Detection',
      'Visitor Management',
      'Perimeter Security',
      'Integrated Security Systems',
    ],
  },
  {
    id: 'sustainability',
    num: '05',
    title: 'Sustainability',
    tagline: 'Engineering buildings for a sustainable future.',
    desc: 'We develop practical sustainability strategies that reduce environmental impact while improving building performance and supporting recognised green certifications.',
    image: '/services/sustainablity.jpeg',
    services: [
      'Energy Modelling',
      'LEED',
      'Estidama',
      'Carbon Reduction',
      'Daylight Simulation',
      'Performance Analysis',
    ],
  },
  {
    id: 'acoustics-consultancy',
    num: '06',
    title: 'Acoustics Consultancy',
    tagline: 'Designing environments that sound as good as they look.',
    desc: 'Our acoustic specialists optimise sound quality, minimise noise and create comfortable environments across hospitality, residential, commercial and mixed-use developments.',
    image: '/services/acoustics-consultancy.jpg',
    services: [
      'Architectural Acoustics',
      'Noise Studies',
      'Vibration Control',
      'Acoustic Testing',
      'Environmental Noise',
      'Compliance',
    ],
  },
  {
    id: 'swimming-pool-water-feature',
    num: '07',
    title: 'Swimming Pool & Water Feature Design',
    tagline: 'Engineering exceptional water experiences.',
    desc: 'We provide specialist engineering for swimming pools and water features, combining hydraulic performance, water quality and aesthetic integration.',
    image: '/luxury_resort_pool_1780503490609.webp',
    services: [
      'Hydraulic Design',
      'Water Treatment',
      'Filtration',
      'Water Chemistry',
      'Pump Systems',
      'Feature Coordination',
    ],
  },
  {
    id: 'spa-design',
    num: '08',
    title: 'Spa Design',
    tagline: 'Engineering wellness environments.',
    desc: 'Specialist engineering solutions for luxury spa and wellness facilities, integrating thermal, hydrotherapy and environmental systems into a seamless guest experience.',
    image: '/services/Spa.avif',
    services: [
      'Thermal Suites',
      'Hydrotherapy',
      'Spa Plant Design',
      'Wellness Engineering',
      'Treatment Rooms',
      'MEP Coordination',
    ],
  },
];

const WHY_CHOOSE_SEED = [
  {
    title: 'Integrated multidisciplinary engineering',
    desc: 'Seamless collaboration across HVAC, Electrical, Plumbing, Fire Protection, ELV, and Sustainability disciplines from concept to handover.',
  },
  {
    title: 'BIM-led coordination',
    desc: 'Advanced 3D modeling and automated clash detection ensuring zero site conflicts and buildability prior to construction.',
  },
  {
    title: 'Sustainability-driven design',
    desc: 'Practical energy-efficient, low-carbon strategies aligned with international green building standards such as LEED & Estidama.',
  },
  {
    title: 'Concept-to-commissioning delivery',
    desc: 'Complete technical responsibility extending beyond drawings to include on-site supervision, testing, and verified building performance.',
  },
];

export default function ServicesPage() {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">
      
      {/* SECTION 1 – HERO BANNER */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <Image
            src="/dubai_skyline_night_1780503516791.webp"
            alt="Services Background"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#0b0f19]/90 to-[#0b0f19]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-6 block">Our capabilities</span>
            <p className="text-lg md:text-xl font-sans font-light text-slate-400 leading-relaxed max-w-3xl mx-auto">
              Integrated engineering disciplines delivering high-performance buildings through coordinated design, digital delivery and technical excellence.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 2 – INTRODUCTION */}
      <section className="py-20 md:py-28 bg-[#0f172a] border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <Reveal>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6">
              Engineering services built around performance
            </h2>
            <p className="text-base md:text-lg font-sans font-light text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Every building presents unique engineering challenges. Our multidisciplinary teams work together from concept to commissioning, delivering integrated solutions that improve building performance, reduce project risks and support long-term operational value.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 3 – ENGINEERING PROCESS (HORIZONTAL TIMELINE) */}
      <section className="py-24 md:py-32 bg-[#0b0f19] border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">Delivery methodology</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                How we deliver Engineering excellence
              </h2>
              <p className="text-slate-400 font-light text-[15px]">
                A structured 6-step engineering process that converts design intent into verified operational performance.
              </p>
            </div>
          </Reveal>

          {/* Horizontal Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            {[
              { step: 'Step 01', title: 'Understand', desc: 'We begin by understanding the client’s vision, commercial objectives and project constraints.' },
              { step: 'Step 02', title: 'Analyse', desc: 'Technical requirements, regulations and engineering risks are assessed before design begins.' },
              { step: 'Step 03', title: 'Design', desc: 'Integrated engineering solutions are developed collaboratively using BIM.' },
              { step: 'Step 04', title: 'Coordinate', desc: 'Every engineering discipline is coordinated with architecture and structure to eliminate clashes.' },
              { step: 'Step 05', title: 'Verify', desc: 'Performance simulations, reviews and quality checks ensure compliance and reliability.' },
              { step: 'Step 06', title: 'Deliver', desc: 'Construction support, commissioning and handover ensure buildings perform as intended.' },
            ].map((st, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-[#0f172a] border border-white/8 p-6 h-full flex flex-col justify-between hover:border-gold/40 transition-colors relative group rounded-sm">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gold text-[10px] font-bold tracking-widest uppercase">{st.step}</span>
                      <span className="text-white/20 group-hover:text-gold/40 transition-colors font-serif font-bold text-sm">0{i + 1}</span>
                    </div>
                    <h3 className="text-white font-serif text-lg font-bold mb-3 group-hover:text-gold transition-colors">{st.title}</h3>
                    <p className="text-slate-400 text-[12px] font-light leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 – OUR SERVICES */}
      <section className="py-24 md:py-32 border-t border-white/5 bg-[#0b0f19]">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="mb-20 max-w-3xl">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">Portfolio of services</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">Our services</h2>
              <div className="w-20 h-1 bg-gold mt-4" />
            </div>
          </Reveal>

          {SERVICES_DATA.map((service, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div id={service.id} key={service.id} className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center mb-32 last:mb-0 ${isEven ? '' : 'lg:flex-row-reverse'} scroll-mt-24`}>
                
                {/* Image Side */}
                <div className="w-full lg:w-1/2">
                  <Reveal delay={0.1}>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm shadow-2xl border border-white/5 group">
                      <Image 
                        src={service.image} 
                        alt={service.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19]/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                    </div>
                  </Reveal>
                </div>
                
                {/* Content Side */}
                <div className="w-full lg:w-1/2">
                  <Reveal delay={0.2}>
                    <div className="mb-8">
                      <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block">{service.num}</span>
                      <h3 className="text-3xl md:text-4xl font-serif font-bold text-white mb-3">{service.title}</h3>
                      <p className="text-gold font-serif italic text-base md:text-lg mb-4">{service.tagline}</p>
                      <p className="text-[14px] text-slate-400 font-light leading-relaxed max-w-xl">
                        {service.desc}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-white text-xs font-bold tracking-widest uppercase mb-4 text-gold">Services</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                        {service.services.map((item, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="text-gold mt-1 text-[10px]">◆</span>
                            <span className="text-[13px] text-slate-300 font-medium tracking-wide">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5 – WHY CHOOSE SEED */}
      <section className="py-24 md:py-32 bg-[#0f172a] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">Our advantage</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Why clients choose SEED</h2>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE_SEED.map((card, i) => (
              <StaggerItem key={i}>
                <div className="bg-[#0b0f19] border border-white/10 p-8 rounded-sm h-full flex flex-col justify-between hover:border-gold/40 transition-colors group">
                  <div>
                    <span className="text-gold text-xs font-bold tracking-widest uppercase block mb-6">0{i + 1}</span>
                    <h3 className="font-serif text-xl font-bold text-white mb-4 group-hover:text-gold transition-colors">{card.title}</h3>
                    <p className="text-slate-400 text-xs font-light leading-relaxed">{card.desc}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SECTION 6 – CALL TO ACTION */}
      <section className="py-28 bg-[#0b0f19] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">Get started</span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
              Planning a complex building project?
            </h2>
            <p className="text-slate-300 font-light text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you’re developing a luxury hotel, residential tower, commercial development or mixed-use destination, our multidisciplinary engineering teams are ready to help deliver high-performance buildings.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm"
              >
                Request consultation →
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-10 py-5 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-white hover:bg-white/5 transition-colors duration-300 rounded-sm"
              >
                Explore projects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
