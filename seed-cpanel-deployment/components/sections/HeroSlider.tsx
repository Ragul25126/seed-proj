'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

const slides = [
  {
    eyebrow: 'MEP · SUSTAINABILITY · BIM · COMMISSIONING',
    title: <>Engineering<br/>High-Performance<br/>Buildings</>,
    desc: <>SEED delivered MEP Design and Supervision for Wasl Tower, one of Dubai’s most iconic mixed-use developments, providing integrated engineering solutions that enhance building performance, coordination and long-term operational excellence.</>,
    image: '/projects/mandarin-wasl-tower.webp',
    projectInfo: 'Wasl Tower — Dubai, UAE',
  },
  {
    eyebrow: 'MEP · SUSTAINABILITY · BIM · COMMISSIONING',
    title: <>Engineering<br/>High-Performance<br/>Buildings</>,
    desc: <>Engineering integrated building systems for a vibrant mixed-use waterfront destination, delivering operational efficiency, sustainability and long-term building performance.</>,
    image: '/projects/portside-square.webp',
    projectInfo: 'Portside Square — Dubai, UAE',
  },
  {
    eyebrow: 'MEP · SUSTAINABILITY · BIM · COMMISSIONING',
    title: <>Engineering<br/>High-Performance<br/>Buildings</>,
    desc: <>Creating coordinated MEP engineering solutions for a premium residential community, designed to provide comfort, resilience and sustainable performance for modern living (Soto Grande).</>,
    image: '/projects/Soto Grande.webp',
    projectInfo: 'Soto Grande — Ras Al Khaimah, UAE',
  },
  {
    eyebrow: 'MEP · SUSTAINABILITY · BIM · COMMISSIONING',
    title: <>Engineering<br/>High-Performance<br/>Buildings</>,
    desc: <>Delivering intelligent engineering solutions for a luxury hospitality destination, where guest comfort, operational excellence and sustainability are seamlessly integrated (The Meriva Collection).</>,
    image: '/projects/meriva-collection.webp',
    projectInfo: 'The Meriva Collection — Dubai, UAE',
  },
  {
    eyebrow: 'MEP · SUSTAINABILITY · BIM · COMMISSIONING',
    title: <>Engineering<br/>High-Performance<br/>Buildings</>,
    desc: <>Providing high-performance MEP engineering for one of Abu Dhabi’s most prestigious branded residences, combining engineering excellence with luxury living and long-term operational value (The St. Regis Branded Residences).</>,
    image: '/projects/stregis sector image.avif',
    projectInfo: 'The St. Regis Branded Residences — Abu Dhabi, UAE',
  }
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt="Slide Background"
              fill
              className="object-cover object-center"
              priority={idx === 0}
            />
            <div className="absolute inset-0 bg-[#0b0f19]/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-80" />
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-6 lg:px-12 pt-24">
              <div className="max-w-4xl">
                {idx === current && (
                  <div className="animate-fade-in-up">
                    <h1 
                      className="text-6xl md:text-7xl lg:text-[90px] font-serif font-bold text-[#f8fafc] mb-6 leading-[1.25] md:leading-[1.25] lg:leading-[1.25] tracking-tight"
                      style={{ lineHeight: 1.25 }}
                    >
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl font-sans font-light text-slate-300 max-w-xl leading-relaxed mb-10">
                      {slide.desc}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-300 bg-gold text-[#0b0f19] hover:bg-yellow-500">
                        REQUEST CONSULTATION
                      </Link>
                      <Link href="/projects" className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-white hover:bg-white/5 transition-colors duration-300">
                        EXPLORE PROJECTS
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Details Overlay */}
          <div className={`absolute bottom-6 md:bottom-12 right-6 md:right-12 z-20 text-right transition-opacity duration-1000 delay-300 ${idx === current ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-white text-sm md:text-base font-medium tracking-wide">{slide.projectInfo}</span>
          </div>

        </div>
      ))}

      {/* Carousel indicators */}
      <div className="absolute bottom-16 left-6 lg:left-12 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-[2px] transition-all duration-500 ${
              idx === current ? 'w-12 bg-gold' : 'w-6 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
