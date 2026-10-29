'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    eyebrow: 'MEP · SUSTAINABILITY · BIM · COMMISSIONING',
    title: <>Engineering<br/>high-performance<br/>buildings</>,
    desc: <>SEED delivered MEP Design and Supervision for Wasl Tower, one of Dubai’s most iconic mixed-use developments, providing integrated engineering solutions that enhance building performance, coordination and long-term operational excellence.</>,
    image: '/projects/mandarin-wasl-tower.webp',
    projectInfo: 'Wasl Tower — Dubai, UAE',
  },
  {
    eyebrow: 'MEP · SUSTAINABILITY · BIM · COMMISSIONING',
    title: <>Engineering<br/>high-performance<br/>buildings</>,
    desc: <>Engineering integrated building systems for a vibrant mixed-use waterfront destination, delivering operational efficiency, sustainability and long-term building performance.</>,
    image: '/projects/portside-square.webp',
    projectInfo: 'Portside Square — Dubai, UAE',
  },
  {
    eyebrow: 'MEP · SUSTAINABILITY · BIM · COMMISSIONING',
    title: <>Engineering<br/>high-performance<br/>buildings</>,
    desc: <>Creating coordinated MEP engineering solutions for a premium residential community, designed to provide comfort, resilience and sustainable performance for modern living (Soto Grande).</>,
    image: '/projects/Soto Grande.webp',
    projectInfo: 'Soto Grande — Ras Al Khaimah, UAE',
  },
  {
    eyebrow: 'MEP · SUSTAINABILITY · BIM · COMMISSIONING',
    title: <>Engineering<br/>high-performance<br/>buildings</>,
    desc: <>Delivering intelligent engineering solutions for a luxury hospitality destination, where guest comfort, operational excellence and sustainability are seamlessly integrated (The Meriva Collection).</>,
    image: '/projects/meriva-collection.webp',
    projectInfo: 'The Meriva Collection — Dubai, UAE',
  },
  {
    eyebrow: 'MEP · SUSTAINABILITY · BIM · COMMISSIONING',
    title: <>Engineering<br/>high-performance<br/>buildings</>,
    desc: <>Providing high-performance MEP engineering for one of Abu Dhabi’s most prestigious branded residences, combining engineering excellence with luxury living and long-term operational value (The St. Regis Branded Residences).</>,
    image: '/projects/stregis sector image.avif',
    projectInfo: 'The St. Regis Branded Residences — Abu Dhabi, UAE',
  }
];

export function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [readyToPreload, setReadyToPreload] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({ 0: true });
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const [pendingTarget, setPendingTarget] = useState<number | null>(null);
  const [hasRotated, setHasRotated] = useState(false);

  const pendingRef = useRef<number | null>(null);
  pendingRef.current = pendingTarget;

  const loadedImagesRef = useRef<Record<number, boolean>>({ 0: true });
  loadedImagesRef.current = loadedImages;

  const failedImagesRef = useRef<Record<number, boolean>>({});
  failedImagesRef.current = failedImages;

  // 1. Defer preloading the next upcoming slide to avoid network contention during initial LCP (3.5s)
  useEffect(() => {
    if (current > 0) setHasRotated(true);
    setReadyToPreload(false);
    const idleTimer = setTimeout(() => {
      setReadyToPreload(true);
    }, 3500);
    return () => clearTimeout(idleTimer);
  }, [current]);

  // Helper to find the next slide that is loaded and has not failed
  const getNextLoadedSlide = useCallback((fromIdx: number): number => {
    for (let step = 1; step < slides.length; step++) {
      const candidate = (fromIdx + step) % slides.length;
      if (loadedImagesRef.current[candidate] && !failedImagesRef.current[candidate]) {
        return candidate;
      }
    }
    return fromIdx;
  }, []);

  // Function to safely navigate to a slide without blank flashes
  const goToSlide = useCallback((targetIdx: number) => {
    if (targetIdx === current) return;
    if (failedImagesRef.current[targetIdx]) return; // Never switch to a failed slide

    if (loadedImagesRef.current[targetIdx]) {
      setPendingTarget(null);
      setCurrent(targetIdx);
    } else {
      // Keep current slide visible until target slide image finishes loading
      setPendingTarget(targetIdx);
    }
  }, [current]);

  // Handle successful image load completions
  const handleImageLoad = useCallback((idx: number) => {
    setLoadedImages((prev) => {
      if (prev[idx]) return prev;
      return { ...prev, [idx]: true };
    });

    // If this loaded image was the pending target, transition now
    if (pendingRef.current === idx) {
      setPendingTarget(null);
      setCurrent(idx);
    }
  }, []);

  // Handle failed image load - never allow switching to failed slides
  const handleImageError = useCallback((idx: number) => {
    setFailedImages((prev) => {
      if (prev[idx]) return prev;
      return { ...prev, [idx]: true };
    });

    // Cancel pending transition if this image failed
    if (pendingRef.current === idx) {
      setPendingTarget(null);
    }
  }, []);

  // Cancel pending target on timeout so the carousel never gets stuck, without revealing a blank slide
  useEffect(() => {
    if (pendingTarget === null) return;
    const timeout = setTimeout(() => {
      setPendingTarget(null);
    }, 4000);
    return () => clearTimeout(timeout);
  }, [pendingTarget]);

  // 2. Automated 6-second rotation: advances to next successfully loaded slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => getNextLoadedSlide(prev));
    }, 6000);
    return () => clearInterval(timer);
  }, [current, getNextLoadedSlide]);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {slides.map((slide, idx) => {
        const isFailed = failedImages[idx];
        const isNextSlide = idx === (current + 1) % slides.length;
        const shouldRenderImage =
          !isFailed &&
          (idx === current ||
            (readyToPreload && isNextSlide) ||
            idx === pendingTarget);

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0">
              {shouldRenderImage && (
                <Image
                  src={slide.image}
                  alt={slide.projectInfo}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                  priority={idx === 0}
                  onLoad={() => handleImageLoad(idx)}
                  onError={() => handleImageError(idx)}
                />
              )}
              <div className="absolute inset-0 bg-[#0b0f19]/30" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-80" />
            </div>

            {idx === current && (
              <div className="relative z-10 h-full flex items-center">
                <div className="container mx-auto px-6 lg:px-12 pt-24">
                  <div className="max-w-4xl">
                    <div className={!hasRotated && idx === 0 ? '' : 'animate-fade-in-up'}>
                      <h1
                        className="text-4xl sm:text-6xl md:text-7xl lg:text-[90px] font-serif font-bold text-[#f8fafc] mb-6 leading-[1.25] md:leading-[1.25] lg:leading-[1.25] tracking-tight"
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
                  </div>
                </div>
              </div>
            )}

            {/* Project Details Overlay */}
            {idx === current && (
              <div className="absolute bottom-6 md:bottom-12 right-6 md:right-12 z-20 text-right transition-opacity duration-1000 delay-300 opacity-100">
                <span className="text-white text-sm md:text-base font-medium tracking-wide">{slide.projectInfo}</span>
              </div>
            )}

          </div>
        );
      })}

      {/* Carousel indicators */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-[2px] transition-all duration-500 ${
              idx === current ? 'w-12 bg-white' : 'w-6 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
