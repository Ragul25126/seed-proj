'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';

interface ArticleItem {
  slug: string;
  headline: string;
  category: string;
  date: string;
  desc: string;
  image: string;
}

const MEDIA_COVERAGES: ArticleItem[] = [
  {
    slug: 'seed-engineering-latest-news',
    headline: 'SEED Engineering Featured in the Top MEP Consultants Powerlist 2026',
    category: 'MEDIA COVERAGE',
    date: '6 Aug 2026',
    desc: 'SEED Engineering has been featured in MEP Middle East’s Top MEP Consultants Powerlist 2026, recognising the firm’s presence and contribution to the region’s MEP engineering industry.',
    image: '/projects/news-seed-media-profile.webp',
  },
  {
    slug: 'sustainable-mep-solutions-wasl-tower',
    headline: 'SEED Engineering Consultants Sustainable MEP Solutions for Wasl Tower',
    category: 'Media Coverage',
    date: '24 Jul 2022',
    desc: 'Shaping landmark skylines, the company stands for building energy-efficient projects. SEED is a global engineering services firm in operation for almost two decades...',
    image: '/blog/wasl-tower-article.png',
  },
  {
    slug: 'east-africa-improves-ease-of-doing-business-2022',
    headline: '2022 Review: East Africa improves ease of doing business',
    category: 'Media Coverage',
    date: '15 Dec 2022',
    desc: 'Investment opportunities in East Africa are paving financial growth.',
    image: '/blog/east-africa-wind.png',
  },
  {
    slug: 'delivering-efficiency-in-conversation-with-sanu-mathew',
    headline: 'Delivering Efficiency: In conversation with Sanu Mathew',
    category: 'MEDIA COVERAGE',
    date: '24 Jul 2022',
    desc: 'Headquartered in Dubai, with design offices in Singapore, Bangalore, and Kochi is SEED Engineering Consultants, delivering efficient engineering solutions in the Building Services Industry.',
    image: '/blog/sanu-mathew-media-coverage.png',
  },
];

const AWARDS_RECOGNITION: ArticleItem[] = [
  {
    slug: 'sanu-mathew-executive-of-the-year',
    headline: 'Sanu Mathew | Honourable Achievement for Executive of the Year',
    category: 'Media Coverage',
    date: '9 Dec 2025',
    desc: 'A proud milestone for SEED Engineering. Our Managing Director, Sanu Mathew, was recognised with the Honourable Achievement for Executive of the Year – Male at the Middle East Consultant Awards 2025.',
    image: '/projects/news-sanu-mathew-award.webp',
  },
  {
    slug: 'st-regis-branded-residences-honourable-achievement',
    headline: 'St. Regis Branded Residences | Honourable Achievement',
    category: 'Media Coverage',
    date: '11 Feb 2026',
    desc: 'At the 16th Big Project Middle East Awards 2026, The St. Regis Branded Residences received an Honourable Achievement in the Project of the Year – Residential category.',
    image: '/projects/news-st-regis-award.webp',
  },
  {
    slug: 'wasl-tower-mep-project-of-the-year',
    headline: 'Wasl Tower | MEP Project of the Year',
    category: 'Media Coverage',
    date: '11 Feb 2026',
    desc: 'At the 16th Big Project Middle East Awards 2026, SEED Engineering Consultants was honoured with the MEP Project of the Year award for Wasl Tower.',
    image: '/projects/news-wasl-tower-award.webp',
  },
];

export default function InsightsPage() {
  const [activeModal, setActiveModal] = useState<ArticleItem | null>(null);

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19]">

      {/* SECTION 01 – HERO BANNER */}
      <section className="relative pt-40 pb-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0">
          <Image
            src="/dubai_skyline_night_1780503516791.webp"
            alt="Insights Hero"
            fill
            className="object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19] via-[#0b0f19]/90 to-[#0b0f19]" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 text-center max-w-4xl">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.25em] uppercase mb-4 block">
              KNOWLEDGE & UPDATES
            </span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
              Insights
            </h1>
            <p className="text-lg md:text-xl font-sans font-light text-slate-400 leading-relaxed max-w-3xl mx-auto">
              Practical insights from engineers who design, coordinate and commission complex buildings — covering MEP systems, sustainability, BIM coordination and building performance across the Middle East and beyond.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SECTION 02 – MEDIA & COVERAGES */}
      <section className="py-24 bg-[#0f172a] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="mb-16">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-3 block">MEDIA & UPDATES</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Media & Coverages</h2>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {MEDIA_COVERAGES.map((news, idx) => (
              <StaggerItem key={idx}>
                <div
                  className="bg-[#0b0f19] border border-white/8 p-6 rounded-sm h-full flex flex-col justify-between group hover:border-gold/40 transition-colors cursor-pointer"
                >
                  <div>
                    <Link href={`/blog/${news.slug}`} className="block relative aspect-[16/9] w-full mb-6 overflow-hidden rounded-sm bg-[#060e25]">
                      <Image
                        src={news.image}
                        alt={news.headline}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <div className="flex items-center justify-end mb-3">
                      <span className="text-slate-500 text-[11px]">{news.date}</span>
                    </div>
                    <Link href={`/blog/${news.slug}`}>
                      <h3 className="font-serif text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors">{news.headline}</h3>
                    </Link>
                    <p className="text-slate-400 text-[13px] font-light leading-relaxed mb-6">{news.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <Link
                      href={`/blog/${news.slug}`}
                      className="text-gold text-[11px] font-bold tracking-wider uppercase inline-flex items-center gap-1 hover:underline"
                    >
                      Read Full Article →
                    </Link>
                    <button
                      onClick={() => setActiveModal(news)}
                      className="text-slate-400 hover:text-white text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-sm transition-colors"
                    >
                      🔍 Preview Image
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SECTION 03 – AWARDS & RECOGNITION */}
      <section className="py-24 bg-[#0b0f19] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="mb-16">
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-3 block">ACCOLADES & HONOURS</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">Awards & Recognition</h2>
            </div>
          </Reveal>

          <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AWARDS_RECOGNITION.map((news, idx) => (
              <StaggerItem key={idx}>
                <div
                  className="bg-[#0f172a] border border-white/8 p-6 rounded-sm h-full flex flex-col justify-between group hover:border-gold/40 transition-colors cursor-pointer"
                >
                  <div>
                    <Link href={`/blog/${news.slug}`} className="block relative aspect-[16/9] w-full mb-6 overflow-hidden rounded-sm bg-[#060e25]">
                      <Image
                        src={news.image}
                        alt={news.headline}
                        fill
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <div className="flex items-center justify-end mb-3">
                      <span className="text-slate-500 text-[11px]">{news.date}</span>
                    </div>
                    <Link href={`/blog/${news.slug}`}>
                      <h3 className="font-serif text-lg font-bold text-white mb-3 group-hover:text-gold transition-colors">{news.headline}</h3>
                    </Link>
                    <p className="text-slate-400 text-[13px] font-light leading-relaxed mb-6">{news.desc}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <Link
                      href={`/blog/${news.slug}`}
                      className="text-gold text-[11px] font-bold tracking-wider uppercase inline-flex items-center gap-1 hover:underline"
                    >
                      View Award →
                    </Link>
                    <button
                      onClick={() => setActiveModal(news)}
                      className="text-slate-400 hover:text-white text-[10px] uppercase tracking-widest bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-sm transition-colors"
                    >
                      🔍 Preview Image
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ARTICLE / IMAGE PREVIEW MODAL */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-[#0f172a] border border-white/15 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-sm p-6 md:p-10 relative text-slate-300 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
            <span className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-2 block">{activeModal.date}</span>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white mb-6">{activeModal.headline}</h2>
            <div className="relative w-full aspect-[4/3] md:aspect-[16/10] mb-6 rounded-sm overflow-hidden bg-[#060e25] border border-white/10">
              <Image
                src={activeModal.image}
                alt={activeModal.headline}
                fill
                className="object-contain"
              />
            </div>
            <p className="text-slate-300 font-light leading-relaxed text-base md:text-lg mb-6">
              {activeModal.desc}
            </p>
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <Link
                href={`/blog/${activeModal.slug}`}
                className="px-8 py-3 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-xs font-bold tracking-[0.15em] uppercase transition-colors rounded-sm"
              >
                {activeModal.category.includes('Award') ? 'View Award Details →' : 'Go to Dedicated Article Page →'}
              </Link>
              <button
                onClick={() => setActiveModal(null)}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-sans text-xs font-bold tracking-[0.15em] uppercase transition-colors rounded-sm"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 04 – CALL TO ACTION */}
      <section className="py-28 relative overflow-hidden bg-[#0b0f19] border-t border-white/5">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <Reveal>
            <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">COLLABORATION</span>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-6">
              Let’s Shape the Future Together
            </h2>
            <p className="text-slate-300 font-light text-lg max-w-xl mx-auto mb-10">
              Whether you’re looking for engineering expertise, project collaboration or industry insights, our team is ready to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 rounded-sm">
                Contact Us
              </Link>
              <Link href="/projects" className="inline-flex items-center justify-center px-10 py-5 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-white hover:bg-white/5 transition-colors duration-300 rounded-sm">
                Explore Our Projects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
