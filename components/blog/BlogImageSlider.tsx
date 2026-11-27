'use client';

import React, { useState, useEffect } from 'react';

interface BlogImageSliderProps {
  images: string[];
  alt: string;
}

/**
 * Interactive single-slide image carousel for multi-image blog/award articles.
 */
export function BlogImageSlider({ images, alt }: BlogImageSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const totalSlides = images.length;

  useEffect(() => {
    if (totalSlides <= 1) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
      } else if (e.key === 'ArrowRight') {
        setActiveSlide((prev) => (prev + 1) % totalSlides);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [totalSlides]);

  return (
    <div className="relative max-w-4xl mx-auto mb-12 overflow-hidden rounded-sm border border-white/10 shadow-2xl bg-[#060e25]">
      <div
        className="flex items-center w-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {images.map((imgSrc, idx) => (
          <div key={idx} className="w-full shrink-0 flex items-center justify-center">
            <img
              src={imgSrc}
              alt={idx === 0 ? alt : `${alt} - photo ${idx + 1}`}
              className="w-full h-auto max-h-[70vh] object-contain mx-auto block"
            />
          </div>
        ))}
      </div>

      {totalSlides > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/85 text-white border border-white/15 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => setActiveSlide((prev) => (prev + 1) % totalSlides)}
            aria-label="Next image"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/85 text-white border border-white/15 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm border border-white/10">
            {images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  activeSlide === idx
                    ? 'w-6 bg-gold'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
