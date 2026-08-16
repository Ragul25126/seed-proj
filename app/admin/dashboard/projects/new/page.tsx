'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProjectAction } from '../../../actions';

export default function AdminNewProjectPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form input states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);

  // Handle title changes and generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (autoSlug) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setAutoSlug(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title,
      slug,
      division: formData.get('division'),
      client_sector: formData.get('client_sector'),
      sector: formData.get('sector'),
      location: formData.get('location'),
      project_scale: formData.get('project_scale'),
      client: formData.get('client'),
      architect: formData.get('architect'),
      services: formData.get('services'),
      area: formData.get('area'),
      short_description: formData.get('short_description'),
      full_description: formData.get('full_description'),
      status: formData.get('status'),
      featured: formData.get('featured') === 'true',
      display_order: formData.get('display_order') || 0,
      is_published: formData.get('is_published') === 'true'
    };

    // Validation
    if (!data.title || !data.slug || !data.division || !data.client_sector || !data.location || !data.project_scale) {
      setError('Please fill in all required fields marked with *');
      return;
    }

    startTransition(async () => {
      const result = await createProjectAction(data);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
        router.push(`/admin/projects/${result.projectId}/edit?success=created`);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/projects"
            className="text-gold hover:underline text-xs flex items-center gap-1 mb-2 font-semibold uppercase tracking-wider"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
          <h2 className="text-xl font-serif font-bold text-gold">Add New Project</h2>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-4 py-3 rounded-sm flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#0b0f19] border border-white/10 p-8 rounded-sm shadow-md space-y-8">
        {/* Core details */}
        <div className="space-y-6">
          <h3 className="text-gold font-serif text-xs font-semibold tracking-widest uppercase border-b border-white/10 pb-2">
            Project Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                required
                disabled={isPending}
                value={title}
                onChange={handleTitleChange}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Name of the project"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                id="slug"
                required
                disabled={isPending}
                value={slug}
                onChange={handleSlugChange}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="url-slug-format"
              />
            </div>

            <div>
              <label htmlFor="division" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Division / Category *
              </label>
              <select
                id="division"
                name="division"
                required
                disabled={isPending}
                defaultValue="mep"
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
              >
                <option value="mep">MEP Consultancy</option>
                <option value="pool">Pool Consultancy</option>
              </select>
            </div>

            <div>
              <label htmlFor="client_sector" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Client Sector *
              </label>
              <input
                type="text"
                id="client_sector"
                name="client_sector"
                required
                disabled={isPending}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="e.g. Residential, Hospitality, Corporate"
              />
            </div>

            <div>
              <label htmlFor="sector" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Sector Detail (Sub-category)
              </label>
              <input
                type="text"
                id="sector"
                name="sector"
                disabled={isPending}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="e.g. High Rise Residential, Luxury Hotel"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Location *
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                disabled={isPending}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="e.g. Dubai, UAE"
              />
            </div>

            <div>
              <label htmlFor="project_scale" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Project Scale / Height *
              </label>
              <input
                type="text"
                id="project_scale"
                name="project_scale"
                required
                disabled={isPending}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="e.g. G+1 Villa, 2B+G+34 Floors"
              />
            </div>

            <div>
              <label htmlFor="client" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Client
              </label>
              <input
                type="text"
                id="client"
                name="client"
                disabled={isPending}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Client name"
              />
            </div>

            <div>
              <label htmlFor="architect" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Architect
              </label>
              <input
                type="text"
                id="architect"
                name="architect"
                disabled={isPending}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="Lead architect"
              />
            </div>

            <div>
              <label htmlFor="area" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Built-up Area
              </label>
              <input
                type="text"
                id="area"
                name="area"
                disabled={isPending}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="e.g. 15,000 sq.ft."
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Project Status
              </label>
              <select
                id="status"
                name="status"
                disabled={isPending}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
              </select>
            </div>

            <div>
              <label htmlFor="display_order" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Display Order
              </label>
              <input
                type="number"
                id="display_order"
                name="display_order"
                defaultValue={0}
                disabled={isPending}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors font-mono"
              />
            </div>
          </div>
        </div>

        {/* Descriptions and Services */}
        <div className="space-y-6">
          <h3 className="text-gold font-serif text-xs font-semibold tracking-widest uppercase border-b border-white/10 pb-2">
            Description & Scope of Services
          </h3>

          <div>
            <label htmlFor="services" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
              Scope of Services Provided
            </label>
            <input
              type="text"
              id="services"
              name="services"
              disabled={isPending}
              className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              placeholder="e.g. Complete MEP Design & Site Supervision"
            />
          </div>

          <div>
            <label htmlFor="short_description" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
              Short Description
            </label>
            <textarea
              id="short_description"
              name="short_description"
              disabled={isPending}
              rows={2}
              className="w-full bg-[#070b13] border border-white/10 rounded-sm p-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors resize-y"
              placeholder="A brief 1-2 sentence description for listing views."
            />
          </div>

          <div>
            <label htmlFor="full_description" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
              Full Description
            </label>
            <textarea
              id="full_description"
              name="full_description"
              disabled={isPending}
              rows={5}
              className="w-full bg-[#070b13] border border-white/10 rounded-sm p-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors resize-y"
              placeholder="Detailed description of the project scope, technical specifications, and key features."
            />
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-6">
          <h3 className="text-gold font-serif text-xs font-semibold tracking-widest uppercase border-b border-white/10 pb-2">
            Publishing Settings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 bg-[#070b13] border border-white/10 p-4 rounded-sm">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                value="true"
                disabled={isPending}
                className="w-4 h-4 rounded border-white/10 bg-[#070b13] text-gold focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="featured" className="text-xs text-white/80 font-medium cursor-pointer select-none">
                Mark as Featured Project
              </label>
            </div>

            <div className="flex items-center gap-3 bg-[#070b13] border border-white/10 p-4 rounded-sm">
              <input
                type="checkbox"
                id="is_published"
                name="is_published"
                value="true"
                defaultChecked
                disabled={isPending}
                className="w-4 h-4 rounded border-white/10 bg-[#070b13] text-gold focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="is_published" className="text-xs text-white/80 font-medium cursor-pointer select-none">
                Publish Project (make public)
              </label>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 text-xs uppercase tracking-widest font-semibold border-t border-white/10 pt-6">
          <Link
            href="/admin/projects"
            className="px-6 py-3 rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-6 py-3 rounded-sm bg-gold hover:bg-[#b0934c] disabled:bg-gold/40 text-black transition-colors flex items-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </>
            ) : (
              <span>Create Project</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
