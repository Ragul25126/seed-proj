import React from 'react';

export default function EditProjectLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-3 w-28 bg-white/10 rounded mb-2" />
          <div className="h-6 w-40 bg-gold/30 rounded" />
        </div>
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Skeleton */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-white/10 p-6 rounded-sm shadow-md space-y-6">
          <div className="h-4 w-32 bg-gold/20 rounded border-b border-white/10 pb-2" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-2.5 w-20 bg-white/10 rounded" />
                <div className="h-11 w-full bg-[#070b13] border border-white/5 rounded-sm" />
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="h-2.5 w-32 bg-white/10 rounded" />
            <div className="h-11 w-full bg-[#070b13] border border-white/5 rounded-sm" />
          </div>

          <div className="space-y-2">
            <div className="h-2.5 w-28 bg-white/10 rounded" />
            <div className="h-24 w-full bg-[#070b13] border border-white/5 rounded-sm" />
          </div>

          <div className="h-12 w-full bg-gold/20 rounded-sm mt-6" />
        </div>

        {/* Right Column: Media Manager Skeleton */}
        <div className="lg:col-span-5 bg-[#0b0f19] border border-white/10 p-6 rounded-sm shadow-md space-y-6">
          <div className="border-b border-white/10 pb-2 flex items-center justify-between">
            <div className="h-4 w-28 bg-gold/20 rounded" />
            <div className="h-3 w-14 bg-white/10 rounded" />
          </div>

          {/* Upload Placeholder */}
          <div className="bg-[#070b13] border-2 border-dashed border-white/10 rounded-sm p-8 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/5" />
            <div className="h-3 w-24 bg-white/10 rounded" />
          </div>

          {/* Media Items Skeletons */}
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 rounded-sm bg-[#070b13] border border-white/10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-11 bg-white/10 rounded-sm flex-shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-32 bg-white/10 rounded" />
                    <div className="h-2 w-16 bg-white/5 rounded" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="w-6 h-6 bg-white/5 rounded-sm" />
                  <div className="w-6 h-6 bg-white/5 rounded-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
