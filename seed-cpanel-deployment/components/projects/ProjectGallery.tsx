'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ProjectGalleryProps {
  images: string[];
  title: string;
  aspectRatio?: string;
  showThumbnails?: boolean;
  objectFit?: 'cover' | 'contain';
  containImages?: string[]; // specific image src paths that should use contain
  containSlugs?: string[];  // slugs where ALL images should use contain
  currentSlug?: string;
}

export function ProjectGallery({
  images,
  title,
  aspectRatio = 'aspect-[16/9]',
  showThumbnails = true,
  objectFit = 'cover',
  containImages = [],
  containSlugs = [],
  currentSlug = '',
}: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  // If current slug is in containSlugs, force all images to contain
  const forceContain = containSlugs.includes(currentSlug);

  const getFit = (img: string): 'object-contain' | 'object-cover' => {
    if (forceContain || objectFit === 'contain' || containImages.includes(img)) {
      return 'object-contain';
    }
    return 'object-cover';
  };

  const getStyle = (img: string): React.CSSProperties | undefined => {
    if (img === '/projects/mandarin-wasl-tower.webp') return { transform: 'scale(0.93)' };
    return undefined;
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = images[activeIndex];

  return (
    <div className="w-full space-y-4">
      {/* Main Image Display */}
      <div className={`relative ${aspectRatio} w-full overflow-hidden rounded-sm bg-[#0a1020] border border-white/10 group`}>
        <Image
          src={currentImage}
          alt={`${title} - Image ${activeIndex + 1}`}
          fill
          unoptimized
          priority={activeIndex === 0}
          className={`${getFit(currentImage)} transition-all duration-500`}
          style={getStyle(currentImage)}
          sizes="(max-width: 1200px) 100vw, 1200px"
        />

        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 pointer-events-none" />

        {/* Gallery Controls (if multiple images) */}
        {images.length > 1 && (
          <>
            {/* Prev Button */}
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-gold hover:text-black text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0 opacity-80 group-hover:opacity-100 focus:outline-none z-10"
              aria-label="Previous Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-gold hover:text-black text-white p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 opacity-80 group-hover:opacity-100 focus:outline-none z-10"
              aria-label="Next Image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Counter Badge */}
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-[11px] font-mono tracking-widest px-3 py-1 rounded-full border border-white/10 z-10">
              {activeIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {showThumbnails && images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gold/30">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-sm overflow-hidden border transition-all duration-300 ${
                idx === activeIndex
                  ? 'border-transparent scale-105 opacity-100'
                  : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/40'
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                unoptimized
                className={`${getFit(img)} transition-all duration-300`}
                style={getStyle(img)}
                sizes="96px"
              />
              {idx === activeIndex && (
                <div className="absolute inset-0 border-2 border-gold rounded-sm pointer-events-none z-10" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
