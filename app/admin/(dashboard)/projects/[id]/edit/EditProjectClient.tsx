'use client';

import React, { useState, useTransition, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  updateProjectAction,
  uploadImageAction,
  deleteImageAction,
  setCoverImageAction,
  updateImageOrderAction
} from '../../../../actions';

interface EditProjectClientProps {
  project: any;
  initialImages: any[];
}

export default function EditProjectClient({ project, initialImages }: EditProjectClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState(initialImages);
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(
    searchParams.get('success') === 'created'
      ? { type: 'success', message: 'Project created successfully! You can now add images.' }
      : null
  );

  // Form states
  const [title, setTitle] = useState(project.title || '');
  const [slug, setSlug] = useState(project.slug || '');
  const [autoSlug, setAutoSlug] = useState(false);

  // Image delete state
  const [deleteImageId, setDeleteImageId] = useState<string | null>(null);

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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setNotification(null);

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

    startTransition(async () => {
      const result = await updateProjectAction(project.id, data);
      if (result?.error) {
        setNotification({ type: 'error', message: result.error });
      } else {
        setNotification({ type: 'success', message: 'Project details updated successfully.' });
        router.refresh();
      }
    });
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setNotification(null);

    let successCount = 0;
    let failMsg = '';

    for (let idx = 0; idx < files.length; idx++) {
      const file = files[idx];
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImageAction(project.id, formData);
      if (result.success) {
        successCount++;
      } else {
        failMsg = result.error || 'Upload error';
      }
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (successCount > 0) {
      setNotification({
        type: 'success',
        message: `Successfully uploaded ${successCount} image(s).`
      });
      // Fetch updated images
      router.refresh();
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } else if (failMsg) {
      setNotification({ type: 'error', message: `Upload failed: ${failMsg}` });
    }
  };

  // Delete image handler
  const handleConfirmDeleteImage = async () => {
    if (!deleteImageId) return;

    setNotification(null);
    const result = await deleteImageAction(deleteImageId);
    
    if (result.error) {
      setNotification({ type: 'error', message: result.error });
    } else {
      setImages(prev => prev.filter(img => img.id !== deleteImageId));
      setNotification({ type: 'success', message: 'Image deleted successfully.' });
      router.refresh();
    }
    setDeleteImageId(null);
  };

  // Set Cover image handler
  const handleSetCover = async (imageId: string) => {
    setNotification(null);
    const result = await setCoverImageAction(project.id, imageId);

    if (result.error) {
      setNotification({ type: 'error', message: result.error });
    } else {
      setImages(prev =>
        prev.map(img => ({
          ...img,
          is_cover: img.id === imageId
        }))
      );
      setNotification({ type: 'success', message: 'Cover image updated successfully.' });
      router.refresh();
    }
  };

  // Reorder handler
  const handleMoveImage = async (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;

    if (targetIdx < 0 || targetIdx >= newImages.length) return;

    // Swap
    const temp = newImages[index];
    newImages[index] = newImages[targetIdx];
    newImages[targetIdx] = temp;

    setImages(newImages);

    // Save ordering to DB
    const imageIds = newImages.map(img => img.id);
    const result = await updateImageOrderAction(project.id, imageIds) as any;
    if (result.error) {
      setNotification({ type: 'error', message: result.error });
    } else {
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h2 className="text-xl font-serif font-bold text-gold">Edit Project</h2>
        </div>
      </div>

      {/* Alert Notifications */}
      {notification && (
        <div className={`border px-4 py-3 rounded-sm flex items-center gap-2 text-xs ${
          notification.type === 'success'
            ? 'bg-green-500/10 border-green-500/30 text-green-400'
            : 'bg-red-500/10 border-red-500/30 text-red-400'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {notification.type === 'success' ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            )}
          </svg>
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Grid: Details Form & Image Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Details Form */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-7 bg-[#0b0f19] border border-white/10 p-6 rounded-sm shadow-md space-y-6">
          <h3 className="text-gold font-serif text-xs font-semibold tracking-widest uppercase border-b border-white/10 pb-2">
            Project Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                onChange={e => {
                  setSlug(e.target.value);
                  setAutoSlug(false);
                }}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
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
                defaultValue={project.division || 'mep'}
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
                defaultValue={project.client_sector || ''}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="sector" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Sector Detail
              </label>
              <input
                type="text"
                id="sector"
                name="sector"
                disabled={isPending}
                defaultValue={project.sector || ''}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
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
                defaultValue={project.location || ''}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="project_scale" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
                Project Scale *
              </label>
              <input
                type="text"
                id="project_scale"
                name="project_scale"
                required
                disabled={isPending}
                defaultValue={project.project_scale || ''}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
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
                defaultValue={project.client || ''}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
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
                defaultValue={project.architect || ''}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
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
                defaultValue={project.area || ''}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
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
                defaultValue={project.status || 'Completed'}
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
                disabled={isPending}
                defaultValue={project.display_order || 0}
                className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white text-sm focus:outline-none focus:border-gold/50 transition-colors font-mono"
              />
            </div>
          </div>

          <div>
            <label htmlFor="services" className="block text-[10px] font-semibold uppercase tracking-widest text-gold mb-2">
              Scope of Services Provided
            </label>
            <input
              type="text"
              id="services"
              name="services"
              disabled={isPending}
              defaultValue={project.services || ''}
              className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors"
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
              defaultValue={project.short_description || ''}
              className="w-full bg-[#070b13] border border-white/10 rounded-sm p-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors resize-y"
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
              defaultValue={project.full_description || ''}
              className="w-full bg-[#070b13] border border-white/10 rounded-sm p-4 text-white placeholder-white/20 text-sm focus:outline-none focus:border-gold/50 transition-colors resize-y"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="flex items-center gap-3 bg-[#070b13] border border-white/10 p-4 rounded-sm">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                value="true"
                disabled={isPending}
                defaultChecked={!!project.featured}
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
                disabled={isPending}
                defaultChecked={project.is_published !== false}
                className="w-4 h-4 rounded border-white/10 bg-[#070b13] text-gold focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="is_published" className="text-xs text-white/80 font-medium cursor-pointer select-none">
                Publish Project (make public)
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 text-xs uppercase tracking-widest font-semibold border-t border-white/10 pt-6">
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gold hover:bg-[#b0934c] disabled:bg-gold/40 text-black py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Updating Details...</span>
                </>
              ) : (
                <span>Save Project Details</span>
              )}
            </button>
          </div>
        </form>

        {/* Right Column: Image Manager */}
        <div className="lg:col-span-5 bg-[#0b0f19] border border-white/10 p-6 rounded-sm shadow-md space-y-6">
          <div className="border-b border-white/10 pb-2 flex items-center justify-between">
            <h3 className="text-gold font-serif text-xs font-semibold tracking-widest uppercase">
              Project Media
            </h3>
            <span className="text-[10px] text-white/40 font-mono">{images.length} images</span>
          </div>

          {/* Upload Input */}
          <div className="bg-[#070b13] border-2 border-dashed border-white/10 rounded-sm p-6 text-center hover:border-gold/30 transition-colors">
            <input
              type="file"
              id="image-upload"
              ref={fileInputRef}
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-2 py-4"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-xs text-gold font-semibold uppercase tracking-wider">Uploading Assets...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-white/80 font-semibold uppercase tracking-wider">Upload Images</span>
                  <span className="text-[10px] text-white/40">JPG, PNG, or WEBP. Max 10MB per file.</span>
                </>
              )}
            </label>
          </div>

          {/* Media Grid */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {images.length > 0 ? (
              images.map((img, idx) => (
                <div
                  key={img.id}
                  className={`p-3 rounded-sm bg-[#070b13] border flex items-center justify-between gap-4 ${
                    img.is_cover ? 'border-gold/50' : 'border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Thumbnail Preview */}
                    <div className="relative w-16 h-11 bg-white/5 border border-white/10 rounded-sm overflow-hidden flex-shrink-0">
                      <Image
                        src={img.image_url}
                        alt={img.alt_text || 'Render'}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    <div className="min-w-0">
                      <span className="text-[10px] text-white/40 font-mono block truncate" title={img.storage_path}>
                        {img.storage_path.split('/').pop()}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        {img.is_cover ? (
                          <span className="bg-gold text-black text-[8px] font-bold px-1 rounded-sm uppercase tracking-wider">
                            Cover Image
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetCover(img.id)}
                            className="text-white/40 hover:text-gold text-[9px] font-semibold uppercase tracking-wider"
                          >
                            Set Cover
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (reordering + delete) */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleMoveImage(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                      title="Move Up"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMoveImage(idx, 'down')}
                      disabled={idx === images.length - 1}
                      className="p-1 rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-colors"
                      title="Move Down"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setDeleteImageId(img.id)}
                      className="p-1 rounded-sm bg-red-650/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 transition-colors ml-1"
                      title="Delete Image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-white/30 text-xs italic">
                No images uploaded. Add photos using the area above.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Delete Image Confirmation Dialog */}
      {deleteImageId && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0b0f19] border border-white/10 rounded-sm p-6 w-full max-w-sm shadow-2xl space-y-6">
            <div>
              <h4 className="text-gold font-serif text-lg tracking-wide uppercase font-semibold mb-2">
                Delete Image
              </h4>
              <p className="text-sm text-white/70">
                Are you sure you want to delete this image?
              </p>
              <p className="text-xs text-white/40 mt-1">
                This will delete the database map and remove the file from storage.
              </p>
            </div>

            <div className="flex justify-end gap-3 text-xs uppercase tracking-widest font-semibold">
              <button
                onClick={() => setDeleteImageId(null)}
                className="px-4 py-2.5 rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteImage}
                className="px-4 py-2.5 rounded-sm bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Delete Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
