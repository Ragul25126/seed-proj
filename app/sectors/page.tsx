'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';

const SECTORS_DATA = [
  {
    id: 'hospitality',
    num: '01',
    title: 'Hospitality',
    image: '/sectors/jw marriot sevtor image.jpeg',
    desc: 'Engineering luxury hospitality environments where guest comfort, operational efficiency and sustainability work seamlessly together. From boutique hotels to destination resorts, every system is designed to enhance the guest experience while supporting long-term operational performance.',
    cta: 'Explore hospitality projects →',
  },
  {
    id: 'residential',
    num: '02',
    title: 'Residential',
    image: '/sectors/stregis sector image.avif',
    desc: 'Designing high-performance residential environments that prioritise comfort, efficiency and reliability. Our integrated engineering solutions support luxury towers, villas and mixed-use communities through every stage of development.',
    cta: 'Explore residential projects →',
  },
  {
    id: 'commercial',
    num: '03',
    title: 'Commercial',
    image: '/sectors/Al Ajlan KSR HQ Tower.png',
    desc: 'Creating intelligent workplaces that support productivity, occupant wellbeing and future adaptability. Our engineering solutions are designed for commercial towers, headquarters and mixed-use business environments.',
    cta: 'Explore commercial projects →',
  },
  {
    id: 'education',
    num: '04',
    title: 'Education',
    image: '/sectors/Sobha Hartland.jpeg',
    desc: 'Engineering educational environments that are safe, flexible and built for long-term learning. We support schools, universities and research facilities with efficient and sustainable building systems.',
    cta: 'Explore education projects →',
  },
  {
    id: 'healthcare',
    num: '05',
    title: 'Healthcare',
    image: '/sectors/NMC Hospital.jpg',
    desc: 'Delivering resilient engineering for hospitals and healthcare facilities where reliability, infection control and uninterrupted operations are critical. Every solution is developed to support patient wellbeing and clinical excellence.',
    cta: 'Explore healthcare projects →',
  },
  {
    id: 'retail',
    num: '06',
    title: 'Retail',
    image: '/sectors/galleria-mall.jpg',
    desc: 'Engineering retail destinations that enhance customer experience while maintaining operational efficiency. From shopping malls to mixed-use retail environments, every solution supports comfort, sustainability and flexibility.',
    cta: 'Explore retail projects →',
  },
  {
    id: 'sports-stadiums',
    num: '07',
    title: 'Sports & Stadiums',
    image: '/sectors/dammam stadium.webp',
    desc: 'Providing specialist engineering for stadiums, arenas and sports complexes where crowd comfort, life safety and operational resilience are essential to world-class sporting experiences.',
    cta: 'Explore sports projects →',
  },
  {
    id: 'entertainment-cultural-public-buildings',
    num: '08',
    title: 'Entertainment, Cultural, Public Buildings & Theme Parks',
    image: '/sectors/sector_cultural_1781248059245.webp',
    desc: 'Engineering destinations that inspire people and enrich communities. We support museums, theatres, civic buildings, convention centres and theme parks with integrated engineering that balances visitor experience, operational performance and architectural ambition.',
    cta: 'Explore cultural projects →',
  },
  {
    id: 'aviation',
    num: '09',
    title: 'Aviation',
    image: '/sectors/dxb airport.png',
    desc: 'Engineering aviation facilities that demand the highest standards of safety, resilience and operational continuity. Our multidisciplinary expertise supports terminals, airport infrastructure and specialised aviation buildings.',
    cta: 'Explore aviation projects →',
  },
  {
    id: 'villas-private-estates',
    num: '10',
    title: 'Villas & Private Estates',
    image: '/sectors/JEBEL HAFEET MOUNTAIN VILLA, AL AIN.webp',
    desc: 'Creating discreet, efficient and luxurious engineering solutions for high-end private residences. Every system is tailored to deliver comfort, sustainability and long-term reliability.',
    cta: 'Explore villa projects →',
  },
  {
    id: 'infrastructure-sustainable-communities',
    num: '11',
    title: 'Infrastructure & Sustainable Communities',
    image: '/sectors/infrastructure-sustainable-communities.jpg',
    desc: 'Supporting cities and large-scale developments with integrated engineering that improves resilience, sustainability and long-term urban performance.',
    cta: 'Explore infrastructure projects →',
  },
];

export default function SectorsPage() {
  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <Image
            src="/city_aerial_night_1780504844349.webp"
            alt="Engineering Across Every Sector"
            fill
            className="object-cover opacity-25 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#0b0f19]/90 to-[#0b0f19]" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 block">
              Our expertise
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Engineering across every sector
            </h1>
            <p className="text-lg md:text-xl font-sans font-light text-slate-400 leading-relaxed max-w-3xl mx-auto">
              Every sector presents unique engineering challenges. From luxury hospitality and high-rise developments to healthcare, aviation and cultural destinations, we deliver integrated engineering solutions tailored to each project’s operational, technical and commercial requirements.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2. SECTOR CARDS GRID */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SECTORS_DATA.map((sector) => (
              <StaggerItem key={sector.id}>
                <div id={sector.id} className="bg-[#0f172a] border border-white/10 p-8 rounded-sm h-full flex flex-col justify-between hover:border-gold/40 transition-colors group scroll-mt-28">
                  <div>
                    {/* Image Container with Hover Zoom */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/5 mb-6">
                      <Image 
                        src={sector.image} 
                        alt={sector.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60 pointer-events-none" />
                      <div className="absolute top-4 left-4">
                        <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase bg-[#0b0f19]/80 backdrop-blur-sm px-3 py-1 rounded-sm border border-white/10">
                          {sector.num}
                        </span>
                      </div>
                    </div>

                    {/* Sector Title with Orange/Gold Hover Underline */}
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3 group-hover:text-gold transition-colors relative inline-block">
                      {sector.title}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full" />
                    </h2>

                    {/* 2-3 Line Description */}
                    <p className="text-slate-400 text-[13px] font-light leading-relaxed mb-6">
                      {sector.desc}
                    </p>
                  </div>

                  {/* Primary CTA Button */}
                  <div className="pt-4 border-t border-white/5">
                    <Link
                      href={`/projects?sector=${encodeURIComponent(sector.title)}`}
                      className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-gold/10 hover:bg-gold text-gold hover:text-[#0b0f19] font-sans text-[10px] font-bold tracking-[0.15em] uppercase transition-all duration-300 rounded-sm"
                    >
                      {sector.cta}
                    </Link>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* 3. FINAL CTA SECTION */}
      <section className="py-28 bg-[#0f172a] border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">Get in touch</span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
              Let’s build the future together
            </h2>
            <p className="text-slate-300 font-light text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you’re planning a luxury resort, commercial tower, healthcare facility or landmark destination, our multidisciplinary engineering team is ready to help deliver exceptional building performance.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm"
              >
                Discuss your project →
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-10 py-5 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-white hover:bg-white/5 transition-colors duration-300 rounded-sm"
              >
                Explore our projects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
