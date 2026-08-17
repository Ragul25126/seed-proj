'use client';

import React, { useState, useTransition, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProjectAction, uploadImageAction } from '../../../actions';

interface PendingImage {
  id: string; // local only UUID for keying
  file: File;
  previewUrl: string; // object URL for local preview
  status: 'queued' | 'uploading' | 'done' | 'error';
  errorMsg?: string;
}

export default function AdminNewProjectPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form input states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);

  // Pending images state (before project is created)
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [creatingProject, setCreatingProject] = useState(false);

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

  // Pick files from the file input
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newPending: PendingImage[] = Array.from(files).map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      status: 'queued',
    }));
    setPendingImages(prev => [...prev, ...newPending]);
    // Reset file input so same file can be re-selected if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Remove a queued image
  const handleRemoveImage = (id: string) => {
    setPendingImages(prev => {
      const img = prev.find(p => p.id === id);
      if (img) URL.revokeObjectURL(img.previewUrl);
      return prev.filter(p => p.id !== id);
    });
  };

  // Move an image up or down in order
  const handleMove = (index: number, direction: 'up' | 'down') => {
    setPendingImages(prev => {
      const next = [...prev];
      const targetIdx = direction === 'up' ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= next.length) return prev;
      [next[index], next[targetIdx]] = [next[targetIdx], next[index]];
      return next;
    });
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

    setCreatingProject(true);

    startTransition(async () => {
      // Step 1: Create the project
      const result = await createProjectAction(data);
      if (result?.error) {
        setError(result.error);
        setCreatingProject(false);
        return;
      }

      const projectId = result.projectId;

      // Step 2: Upload pending images in order
      if (pendingImages.length > 0) {
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < pendingImages.length; i++) {
          const pending = pendingImages[i];
          setUploadStatus(`Uploading image ${i + 1} of ${pendingImages.length}...`);
          setPendingImages(prev => prev.map(p =>
            p.id === pending.id ? { ...p, status: 'uploading' } : p
          ));

          const imgFormData = new FormData();
          imgFormData.append('file', pending.file);

          const uploadResult = await uploadImageAction(projectId, imgFormData) as any;

          if (uploadResult?.success) {
            successCount++;
            setPendingImages(prev => prev.map(p =>
              p.id === pending.id ? { ...p, status: 'done' } : p
            ));
          } else {
            failCount++;
            setPendingImages(prev => prev.map(p =>
              p.id === pending.id ? { ...p, status: 'error', errorMsg: uploadResult?.error || 'Upload failed' } : p
            ));
          }
        }

        setUploadStatus(`Uploaded ${successCount} image(s)${failCount > 0 ? `, ${failCount} failed` : ''}.`);
      }

      // Cleanup object URLs
      pendingImages.forEach(p => URL.revokeObjectURL(p.previewUrl));

      setCreatingProject(false);
      router.refresh();
      router.push(`/admin/projects/${projectId}/edit?success=created`);
    });
  };

  const isSubmitting = isPending || creatingProject;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
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

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT: Project Details Form */}
        <div className="lg:col-span-7 bg-[#0b0f19] border border-white/10 p-8 rounded-sm shadow-md space-y-8">
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                  className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors font-mono"
                />
              </div>
            </div>
          </div>

          {/* Descriptions and Services */}
          <div className="space-y-6">
            <h3 className="text-gold font-serif text-xs font-semibold tracking-widest uppercase border-b border-white/10 pb-2">
              Description &amp; Scope of Services
            </h3>

            <div>
              <label htmlFor="services" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Scope of Services Provided
              </label>
              <input
                type="text"
                id="services"
                name="services"
                disabled={isSubmitting}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="e.g. Complete MEP Design &amp; Site Supervision"
              />
            </div>

            <div>
              <label htmlFor="short_description" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Short Description
              </label>
              <textarea
                id="short_description"
                name="short_description"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
              disabled={isSubmitting}
              className="px-6 py-3 rounded-sm bg-gold hover:bg-[#b0934c] disabled:bg-gold/40 text-black transition-colors flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{uploadStatus || 'Creating Project...'}</span>
                </>
              ) : (
                <span>Create Project{pendingImages.length > 0 ? ` & Upload ${pendingImages.length} Image${pendingImages.length > 1 ? 's' : ''}` : ''}</span>
              )}
            </button>
          </div>
        </div>

        {/* RIGHT: Project Media */}
        <div className="lg:col-span-5 bg-[#0b0f19] border border-white/10 p-6 rounded-sm shadow-md space-y-5 sticky top-[80px]">
          <div className="border-b border-white/10 pb-2 flex items-center justify-between">
            <h3 className="text-gold font-serif text-xs font-semibold tracking-widest uppercase">
              Project Media
            </h3>
            <span className="text-[10px] text-white/40 font-mono">{pendingImages.length} image{pendingImages.length !== 1 ? 's' : ''} queued</span>
          </div>

          {/* Upload Drop Zone */}
          <div
            className="bg-[#070b13] border-2 border-dashed border-white/10 rounded-sm p-5 text-center hover:border-gold/30 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleFileSelect}
              disabled={isSubmitting}
              className="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white/20 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-xs text-white/50 font-medium">Click to select images</p>
            <p className="text-[10px] text-white/30 mt-1">PNG, JPG, WEBP — multiple files allowed</p>
          </div>

          {/* Info note */}
          {pendingImages.length === 0 && (
            <p className="text-[10px] text-white/30 text-center leading-relaxed">
              Images will be uploaded to Supabase Storage when you create the project. The first image will become the cover.
            </p>
          )}

          {/* Queued Images List */}
          {pendingImages.length > 0 && (
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {pendingImages.map((img, idx) => (
                <div
                  key={img.id}
                  className={`p-3 rounded-sm bg-[#070b13] border flex items-center gap-3 ${
                    idx === 0 ? 'border-gold/50' : 'border-white/10'
                  } ${img.status === 'error' ? 'border-red-500/30 bg-red-500/5' : ''}`}
                >
                  {/* Thumbnail using local object URL */}
                  <div className="relative w-16 h-11 bg-white/5 border border-white/10 rounded-sm overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.previewUrl}
                      alt={img.file.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Status overlay */}
                    {img.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <svg className="animate-spin h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    )}
                    {img.status === 'done' && (
                      <div className="absolute inset-0 bg-green-500/40 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] text-white/60 font-mono block truncate" title={img.file.name}>
                      {img.file.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {idx === 0 && (
                        <span className="text-[9px] bg-gold/15 text-gold border border-gold/30 px-1.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                          Cover
                        </span>
                      )}
                      {img.status === 'error' && (
                        <span className="text-[9px] text-red-400">{img.errorMsg}</span>
                      )}
                      {img.status === 'queued' && (
                        <span className="text-[9px] text-white/30">Queued</span>
                      )}
                    </div>
                  </div>

                  {/* Controls */}
                  {!isSubmitting && (
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Move up */}
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        title="Move up"
                        className="p-1.5 rounded-sm text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      {/* Move down */}
                      <button
                        type="button"
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === pendingImages.length - 1}
                        title="Move down"
                        className="p-1.5 rounded-sm text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        title="Remove image"
                        className="p-1.5 rounded-sm text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload progress status */}
          {isSubmitting && uploadStatus && (
            <div className="bg-gold/10 border border-gold/20 text-gold text-xs px-4 py-3 rounded-sm flex items-center gap-2">
              <svg className="animate-spin h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{uploadStatus}</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
