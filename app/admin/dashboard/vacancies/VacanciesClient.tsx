'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  createVacancyAction,
  updateVacancyAction,
  toggleVacancyActiveAction,
  deleteVacancyAction,
  uploadVacancyPosterAction
} from '../../actions';

export interface PositionItem {
  id?: string;
  ref: string;
  title: string;
  qual: string;
  dept?: string;
  apply_email?: string;
}

export interface Vacancy {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  employment_type: string | null;
  description: string | null;
  requirements: string | null;
  application_instructions: string | null;
  application_email: string | null;
  poster_url: string | null;
  positions: PositionItem[] | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

interface VacanciesClientProps {
  initialVacancies: Vacancy[];
}

export default function VacanciesClient({ initialVacancies }: VacanciesClientProps) {
  const [vacancies, setVacancies] = useState<Vacancy[]>(initialVacancies);
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVacancy, setEditingVacancy] = useState<Vacancy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Image Upload File & Preview state
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreview, setPosterPreview] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    employment_type: 'Full-time',
    description: '',
    requirements: '',
    application_instructions: '',
    application_email: '',
    poster_url: '',
    display_order: 1,
    is_active: true,
  });

  const [positions, setPositions] = useState<PositionItem[]>([]);

  // Reset form to COMPLETELY EMPTY state for Create Mode
  const resetForm = () => {
    setFormData({
      title: '',
      department: '',
      location: '',
      employment_type: 'Full-time',
      description: '',
      requirements: '',
      application_instructions: '',
      application_email: '',
      poster_url: '',
      display_order: vacancies.length + 1,
      is_active: true,
    });
    setPositions([
      { ref: '', title: '', qual: '' }
    ]);
    setPosterFile(null);
    setPosterPreview(null);
    setEditingVacancy(null);
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (v: Vacancy) => {
    setEditingVacancy(v);
    setFormData({
      title: v.title || '',
      department: v.department || '',
      location: v.location || '',
      employment_type: v.employment_type || 'Full-time',
      description: v.description || '',
      requirements: v.requirements || '',
      application_instructions: v.application_instructions || '',
      application_email: v.application_email || '',
      poster_url: v.poster_url || '',
      display_order: v.display_order ?? 0,
      is_active: v.is_active,
    });

    setPosterFile(null);
    setPosterPreview(v.poster_url || null);

    const parsedPositions = Array.isArray(v.positions) ? v.positions : [];
    setPositions(parsedPositions.length > 0 ? parsedPositions : [
      { ref: '', title: v.title || '', qual: v.requirements || '' }
    ]);

    setErrorMsg(null);
    setIsModalOpen(true);
  };

  // Image Selection Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (PNG, JPG, WEBP)');
      return;
    }

    setPosterFile(file);
    const localUrl = URL.createObjectURL(file);
    setPosterPreview(localUrl);
    setErrorMsg(null);
  };

  const removePosterImage = () => {
    setPosterFile(null);
    setPosterPreview(null);
    setFormData(prev => ({ ...prev, poster_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Position Management
  const addPositionItem = () => {
    setPositions(prev => [
      ...prev,
      { ref: '', title: '', qual: '' }
    ]);
  };

  const updatePositionItem = (index: number, field: keyof PositionItem, value: string) => {
    setPositions(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const removePositionItem = (index: number) => {
    if (positions.length <= 1) return;
    setPositions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    let finalPosterUrl = formData.poster_url;

    // If admin selected a new image file, upload it first
    if (posterFile) {
      setIsUploading(true);
      try {
        const uploadForm = new FormData();
        uploadForm.append('file', posterFile);
        const uploadRes = await uploadVacancyPosterAction(uploadForm);
        if (uploadRes.error) {
          setErrorMsg(`Image upload failed: ${uploadRes.error}`);
          setIsLoading(false);
          setIsUploading(false);
          return;
        }
        if (uploadRes.imageUrl) {
          finalPosterUrl = uploadRes.imageUrl;
        }
      } catch (uploadErr: any) {
        setErrorMsg(`Image upload error: ${uploadErr.message}`);
        setIsLoading(false);
        setIsUploading(false);
        return;
      } finally {
        setIsUploading(false);
      }
    }

    const payload = {
      ...formData,
      poster_url: finalPosterUrl,
      positions: positions.filter(p => p.title.trim() !== '')
    };

    try {
      if (editingVacancy) {
        const res = await updateVacancyAction(editingVacancy.id, payload);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setVacancies(prev =>
            prev.map(item =>
              item.id === editingVacancy.id
                ? { ...item, ...payload }
                : item
            )
          );
          setSuccessMsg('Vacancy section updated successfully!');
          setIsModalOpen(false);
          resetForm();
        }
      } else {
        const res = await createVacancyAction(payload);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          const newVacancy: Vacancy = {
            id: res.vacancyId || Date.now().toString(),
            ...payload,
            created_at: new Date().toISOString(),
          };
          setVacancies(prev => [newVacancy, ...prev]);
          setSuccessMsg('Vacancy section created successfully!');
          setIsModalOpen(false);
          resetForm();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (v: Vacancy) => {
    const newStatus = !v.is_active;
    setVacancies(prev =>
      prev.map(item => (item.id === v.id ? { ...item, is_active: newStatus } : item))
    );

    try {
      const res = await toggleVacancyActiveAction(v.id, newStatus);
      if (res.error) {
        setVacancies(prev =>
          prev.map(item => (item.id === v.id ? { ...item, is_active: v.is_active } : item))
        );
        alert(`Failed to update status: ${res.error}`);
      }
    } catch (err: any) {
      setVacancies(prev =>
        prev.map(item => (item.id === v.id ? { ...item, is_active: v.is_active } : item))
      );
      alert(`Error updating status: ${err.message}`);
    }
  };

  const handleDelete = async (v: Vacancy) => {
    if (!confirm(`Are you sure you want to permanently delete "${v.title}"?`)) return;

    setVacancies(prev => prev.filter(item => item.id !== v.id));

    try {
      const res = await deleteVacancyAction(v.id);
      if (res.error) {
        setVacancies(prev => [...prev, v]);
        alert(`Delete failed: ${res.error}`);
      } else {
        setSuccessMsg('Vacancy section deleted successfully.');
      }
    } catch (err: any) {
      setVacancies(prev => [...prev, v]);
      alert(`Error deleting vacancy: ${err.message}`);
    }
  };

  const filteredVacancies = vacancies.filter(v => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'active'
        ? v.is_active
        : !v.is_active;

    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      v.title.toLowerCase().includes(query) ||
      (v.department && v.department.toLowerCase().includes(query)) ||
      (v.location && v.location.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0b0f19] border border-white/10 p-6 rounded-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-white mb-1">
            Careers & Vacancies Management
          </h2>
          <p className="text-xs text-slate-400">
            Manage vacancy flyers, recruitment posters, office locations, and individual job positions.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-gold hover:bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider py-3 px-6 rounded-sm transition-all duration-300 shrink-0 flex items-center gap-2 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Vacancy Section
        </button>
      </div>

      {/* Messages */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-4 rounded-sm flex justify-between items-center">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg(null)} className="font-bold">✕</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#0b0f19] border border-white/10 p-4 rounded-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              filter === 'all'
                ? 'bg-gold text-black'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            All ({vacancies.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              filter === 'active'
                ? 'bg-emerald-500 text-black font-bold'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            Active ({vacancies.filter(v => v.is_active).length})
          </button>
          <button
            onClick={() => setFilter('archived')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              filter === 'archived'
                ? 'bg-amber-500 text-black font-bold'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            Archived ({vacancies.filter(v => !v.is_active).length})
          </button>
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            placeholder="Search vacancy..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#070b13] border border-white/10 text-white text-xs rounded-sm px-3 py-2 focus:outline-none focus:border-gold"
          />
        </div>
      </div>

      {/* Vacancies Table */}
      <div className="bg-[#0b0f19] border border-white/10 rounded-sm overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-white/60 uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Order</th>
                <th className="py-3.5 px-4 font-semibold">Poster</th>
                <th className="py-3.5 px-4 font-semibold">Vacancy Heading & Location</th>
                <th className="py-3.5 px-4 font-semibold">Job Positions</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVacancies.length > 0 ? (
                filteredVacancies.map(v => {
                  const posList = Array.isArray(v.positions) ? v.positions : [];
                  return (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 text-gold font-mono font-bold">
                        #{v.display_order}
                      </td>
                      <td className="py-3.5 px-4">
                        {v.poster_url ? (
                          <div className="relative w-12 h-16 rounded-sm overflow-hidden bg-slate-900 border border-gold/30 flex-shrink-0">
                            <Image
                              src={v.poster_url}
                              alt={v.title}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No Image</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-gold text-[10px] font-bold uppercase tracking-wider block">
                          {v.location || 'Office Location'}
                        </span>
                        <div className="font-semibold text-white text-sm">{v.title}</div>
                        {v.description && (
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-light">
                            {v.description}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="bg-white/10 px-2.5 py-1 rounded-sm text-xs font-semibold text-gold">
                          {posList.length} Position{posList.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleActive(v)}
                          className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all ${
                            v.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/40 hover:bg-amber-500/20'
                          }`}
                        >
                          {v.is_active ? '✓ Active' : '📁 Archived'}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-3">
                        <button
                          onClick={() => openEditModal(v)}
                          className="text-gold hover:text-yellow-400 font-semibold uppercase text-[11px]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(v)}
                          className="text-red-400 hover:text-red-300 font-semibold uppercase text-[11px]"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-light text-sm">
                    {vacancies.length === 0 ? (
                      <div>
                        <p className="mb-2">No vacancy sections found in the database.</p>
                        <button
                          onClick={openAddModal}
                          className="text-gold hover:underline text-xs uppercase font-bold"
                        >
                          + Create first vacancy section
                        </button>
                      </div>
                    ) : (
                      'No vacancies match your filter.'
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vacancy Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b0f19] border border-white/15 rounded-sm max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-white/10 pb-4 sticky top-0 bg-[#0b0f19] z-10">
              <h3 className="text-lg font-serif font-bold text-white">
                {editingVacancy ? 'Edit Vacancy Section' : 'Add New Vacancy Section'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-sm">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* SECTION A: General Section Info */}
              <div className="space-y-4 bg-white/5 p-4 rounded-sm border border-white/5">
                <h4 className="text-xs font-bold text-gold uppercase tracking-widest border-b border-white/10 pb-2">
                  1. Section & Poster Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Office / Location Label *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dubai design office, India outsourcing office"
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#070b13] border border-white/10 text-white text-sm rounded-sm px-3.5 py-2 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Vacancy Section Heading *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dubai Engineering & corporate roles"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-[#070b13] border border-white/10 text-white text-sm rounded-sm px-3.5 py-2 focus:outline-none focus:border-gold"
                    />
                  </div>

                  {/* PROMINENT VACANCY POSTER IMAGE UPLOAD FIELD */}
                  <div className="md:col-span-2 space-y-2 pt-1 border-t border-white/10 mt-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gold">
                      VACANCY POSTER IMAGE *
                    </label>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#070b13] p-4 rounded-sm border border-white/10">
                      {/* Image Preview Box */}
                      <div className="relative w-32 h-44 rounded-sm overflow-hidden bg-slate-900 border border-gold/40 shrink-0 flex items-center justify-center text-center shadow-lg group">
                        {posterPreview ? (
                          <>
                            <Image
                              src={posterPreview}
                              alt="Vacancy Poster Preview"
                              fill
                              className="object-contain"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-2.5 py-1 bg-gold text-black text-[9px] font-bold uppercase rounded-sm"
                              >
                                Replace
                              </button>
                              <button
                                type="button"
                                onClick={removePosterImage}
                                className="px-2.5 py-1 bg-red-600 text-white text-[9px] font-bold uppercase rounded-sm"
                              >
                                Remove
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="p-2 text-slate-500 text-[10px] flex flex-col items-center gap-1">
                            <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>No Poster Selected</span>
                          </div>
                        )}
                      </div>

                      {/* File Selector & Controls */}
                      <div className="flex-1 space-y-2 w-full">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-4 py-2.5 bg-gold hover:bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            {posterPreview ? 'Change Poster Image' : 'Upload Vacancy Poster'}
                          </button>

                          {posterPreview && (
                            <button
                              type="button"
                              onClick={removePosterImage}
                              className="px-3 py-2.5 bg-white/5 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-sm transition-colors border border-white/10"
                            >
                              Remove Image
                            </button>
                          )}
                        </div>

                        {/* Optional Text URL Input fallback */}
                        <div className="pt-2">
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">
                            Or enter image path / URL manually:
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. /careers/hiring-dubai-office.png or https://..."
                            value={formData.poster_url}
                            onChange={e => {
                              setFormData({ ...formData, poster_url: e.target.value });
                              setPosterPreview(e.target.value || null);
                            }}
                            className="w-full bg-[#0b0f19] border border-white/10 text-white text-xs rounded-sm px-3 py-1.5 focus:outline-none focus:border-gold font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Introductory Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Join our flagship Dubai Design Office to work on landmark developments..."
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-[#070b13] border border-white/10 text-white text-sm rounded-sm px-3.5 py-2 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Application Email / Destination
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. hr@seedengineering.com"
                      value={formData.application_email}
                      onChange={e => setFormData({ ...formData, application_email: e.target.value })}
                      className="w-full bg-[#070b13] border border-white/10 text-white text-sm rounded-sm px-3.5 py-2 focus:outline-none focus:border-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Display Order Number
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#070b13] border border-white/10 text-white text-sm rounded-sm px-3.5 py-2 focus:outline-none focus:border-gold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: Individual Positions List Builder */}
              <div className="space-y-4 bg-white/5 p-4 rounded-sm border border-white/5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-xs font-bold text-gold uppercase tracking-widest">
                    2. Job Positions Under This Section ({positions.length})
                  </h4>
                  <button
                    type="button"
                    onClick={addPositionItem}
                    className="px-3 py-1 bg-gold hover:bg-yellow-500 text-black text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors"
                  >
                    + Add Position Card
                  </button>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                  {positions.map((pos, idx) => (
                    <div key={idx} className="bg-[#070b13] border border-white/10 p-3.5 rounded-sm space-y-3 relative group">
                      <div className="flex items-center justify-between">
                        <span className="text-gold text-[10px] font-mono font-bold uppercase">Position #{idx + 1}</span>
                        {positions.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePositionItem(idx)}
                            className="text-red-400 hover:text-red-300 text-xs font-bold"
                            title="Remove this position"
                          >
                            ✕ Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Ref Code</label>
                          <input
                            type="text"
                            placeholder="e.g. SEED-DXB-AD-E-01"
                            value={pos.ref}
                            onChange={e => updatePositionItem(idx, 'ref', e.target.value)}
                            className="w-full bg-[#0b0f19] border border-white/10 text-white text-xs rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-gold"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Position Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Associate Director – Electrical"
                            value={pos.title}
                            onChange={e => updatePositionItem(idx, 'title', e.target.value)}
                            className="w-full bg-[#0b0f19] border border-white/10 text-white text-xs rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-gold"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Qualifications / Experience</label>
                          <input
                            type="text"
                            placeholder="e.g. Graduate Engineer with 25+ Years Industry Experience"
                            value={pos.qual}
                            onChange={e => updatePositionItem(idx, 'qual', e.target.value)}
                            className="w-full bg-[#0b0f19] border border-white/10 text-white text-xs rounded-sm px-2.5 py-1.5 focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION C: Active Status */}
              <div className="pt-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active_checkbox"
                  checked={formData.is_active}
                  onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 accent-gold cursor-pointer"
                />
                <label htmlFor="is_active_checkbox" className="text-xs font-semibold text-white cursor-pointer select-none">
                  Published / Active (Visible on public Careers page)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="px-6 py-2.5 bg-gold hover:bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {(isLoading || isUploading) ? (
                    <>
                      <svg className="animate-spin w-4 h-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>{isUploading ? 'Uploading Image...' : 'Saving...'}</span>
                    </>
                  ) : editingVacancy ? (
                    'Save Changes'
                  ) : (
                    'Publish Section'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
