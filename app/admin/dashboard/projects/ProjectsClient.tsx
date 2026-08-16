'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { deleteProjectAction } from '../../actions';

interface ProjectsClientProps {
  initialProjects: any[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('all');
  const [isPending, startTransition] = useTransition();

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteTitle, setDeleteTitle] = useState('');

  // Filter projects based on search and division
  const filteredProjects = projects.filter(proj => {
    const matchesSearch =
      proj.title?.toLowerCase().includes(search.toLowerCase()) ||
      proj.location?.toLowerCase().includes(search.toLowerCase()) ||
      proj.client_sector?.toLowerCase().includes(search.toLowerCase());

    const matchesDivision =
      selectedDivision === 'all' || proj.division === selectedDivision;

    return matchesSearch && matchesDivision;
  });

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteId(id);
    setDeleteTitle(title);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    startTransition(async () => {
      const result = await deleteProjectAction(deleteId);
      if (result?.error) {
        alert(`Error deleting project: ${result.error}`);
      } else {
        setProjects(prev => prev.filter(p => p.id !== deleteId));
        setDeleteId(null);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-[#0b0f19] border border-white/10 p-4 rounded-sm">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search projects by title, sector, location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-2.5 pl-10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-gold/50 transition-colors"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3.5 top-3 w-4 h-4 text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedDivision}
            onChange={e => setSelectedDivision(e.target.value)}
            className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-2.5 text-white text-xs focus:outline-none focus:border-gold/50 transition-colors"
          >
            <option value="all">All Divisions</option>
            <option value="mep">MEP Consultancy</option>
            <option value="pool">Pool Consultancy</option>
          </select>
        </div>

        <Link
          href="/admin/projects/new"
          className="bg-gold hover:bg-[#b0934c] text-black font-semibold text-xs uppercase tracking-widest px-6 py-2.5 rounded-sm transition-all duration-300 flex items-center justify-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Project</span>
        </Link>
      </div>

      {/* Projects List/Table */}
      <div className="bg-[#0b0f19] border border-white/10 rounded-sm overflow-hidden shadow-md">
        {filteredProjects.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider bg-white/5">
                    <th className="p-4 font-semibold">Cover</th>
                    <th className="p-4 font-semibold">Project Title</th>
                    <th className="p-4 font-semibold">Division</th>
                    <th className="p-4 font-semibold">Sector</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Images</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredProjects.map(proj => {
                    const coverImg = proj.project_images?.find((img: any) => img.is_cover)?.image_url || '/placeholder.jpg';
                    const imageCount = proj.project_images?.length || 0;

                    return (
                      <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="relative w-12 h-8 rounded-sm overflow-hidden bg-white/5 border border-white/10">
                            <Image
                              src={coverImg}
                              alt={proj.title}
                              fill
                              unoptimized
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        </td>
                        <td className="p-4 font-medium text-white max-w-[200px] truncate" title={proj.title}>
                          {proj.title}
                        </td>
                        <td className="p-4 uppercase text-[10px] tracking-wider text-white/80">
                          {proj.division}
                        </td>
                        <td className="p-4 text-white/70">
                          {proj.client_sector}
                        </td>
                        <td className="p-4 text-white/70">
                          {proj.location}
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                            proj.status === 'Completed' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {proj.status}
                          </span>
                        </td>
                        <td className="p-4 text-center text-white/60 font-mono">
                          {imageCount}
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <Link
                            href={`/admin/projects/${proj.id}/edit`}
                            className="text-gold hover:text-[#b0934c] font-medium"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(proj.id, proj.title)}
                            className="text-red-400 hover:text-red-300 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden divide-y divide-white/5">
              {filteredProjects.map(proj => {
                const coverImg = proj.project_images?.find((img: any) => img.is_cover)?.image_url || '/placeholder.jpg';
                const imageCount = proj.project_images?.length || 0;

                return (
                  <div key={proj.id} className="pt-4 first:pt-0 flex gap-4">
                    <div className="relative w-20 h-14 rounded-sm overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                      <Image
                        src={coverImg}
                        alt={proj.title}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-white truncate mb-1">
                        {proj.title}
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="text-[9px] uppercase tracking-wider text-gold font-semibold">
                          {proj.division}
                        </span>
                        <span className="text-[9px] text-white/40">
                          {proj.location}
                        </span>
                        <span className="text-[9px] text-white/40 font-mono">
                          {imageCount} imgs
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <Link
                          href={`/admin/projects/${proj.id}/edit`}
                          className="text-gold hover:underline"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(proj.id, proj.title)}
                          className="text-red-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-white/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-sm">No projects found matching the criteria.</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0b0f19] border border-white/10 rounded-sm p-6 w-full max-w-md shadow-2xl space-y-6">
            <div>
              <h4 className="text-gold font-serif text-lg tracking-wide uppercase font-semibold mb-2">
                Confirm Deletion
              </h4>
              <p className="text-sm text-white/70">
                Are you sure you want to delete the project <strong className="text-white">"{deleteTitle}"</strong>?
              </p>
              <p className="text-xs text-red-400 mt-2 bg-red-500/10 border border-red-500/20 p-2 rounded-sm">
                Warning: This will also permanently delete all associated images from storage. This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-end gap-3 text-xs uppercase tracking-widest font-semibold">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isPending}
                className="px-4 py-2.5 rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="px-4 py-2.5 rounded-sm bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center gap-1.5"
              >
                {isPending ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
