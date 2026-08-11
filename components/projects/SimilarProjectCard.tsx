'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SimilarProjectCardProps {
  project: {
    title: string;
    slug: string;
    sector?: string;
    clientSector?: string;
    location: string;
    image: string;
    images?: string[];
  };
}

export function SimilarProjectCard({ project }: SimilarProjectCardProps) {
  const images = project.images && project.images.length > 0 ? project.images : [project.image];
  const [activeIdx, setActiveIdx] = useState(0);

  const activeImage = images[activeIdx] || project.image;

  return (
    <div className="group block bg-[#0f172a] border border-white/5 hover:border-gold/40 transition-all rounded-sm overflow-hidden h-full flex flex-col">
      {/* Image Preview Area */}
      <div className="relative aspect-[4/3] w-full bg-[#0a1020] overflow-hidden">
        <Link href={`/projects/${project.slug}`}>
          <Image
            src={activeImage}
            alt={`${project.title} render ${activeIdx + 1}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            style={
              project.slug === 'saas-st-regis'
                ? { objectPosition: 'center 20%' }
                : project.slug === 'uptown-mercer-house'
                ? { objectPosition: 'center 40%' }
                : undefined
            }
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </Link>

        {/* Badge showing photo count */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-mono tracking-widest px-2.5 py-1 rounded-full border border-white/20 z-10 flex items-center gap-1.5 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{images.length} PHOTOS</span>
          </div>
        )}
      </div>

      {/* Thumbnail Bar for Similar Images inside Similar Projects */}
      {images.length > 1 && (
        <div className="flex items-center gap-1.5 p-2 bg-[#090f1d] border-t border-b border-white/5 overflow-x-auto scrollbar-none">
          {images.slice(0, 5).map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setActiveIdx(idx);
              }}
              className={`relative w-12 h-9 flex-shrink-0 rounded-xs overflow-hidden border transition-all ${
                idx === activeIdx
                  ? 'border-gold scale-105 opacity-100 ring-1 ring-gold/40'
                  : 'border-white/10 opacity-50 hover:opacity-100 hover:border-white/30'
              }`}
              title={`View render ${idx + 1}`}
            >
              <Image src={img} alt={`thumbnail ${idx + 1}`} fill className="object-cover" sizes="48px" />
            </button>
          ))}
          {images.length > 5 && (
            <span className="text-[9px] font-mono text-slate-400 px-1">+{images.length - 5}</span>
          )}
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-gold text-[10px] font-bold tracking-[0.15em] uppercase mb-2 block">
            {project.sector || project.clientSector}
          </span>
          <Link href={`/projects/${project.slug}`}>
            <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold transition-colors mb-2">
              {project.title}
            </h3>
          </Link>
          <p className="text-slate-400 text-[12px]">{project.location.split('**')[0].trim()}</p>
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="text-gold text-[10px] font-bold tracking-[0.1em] uppercase mt-4 block hover:underline"
        >
          View Project Details →
        </Link>
      </div>
    </div>
  );
}
