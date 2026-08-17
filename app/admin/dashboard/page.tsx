import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  getDashboardStats,
  getUnreadInquiriesCount,
  getRecentProjects,
  getRecentInquiries
} from '../../../lib/supabase/cached-queries';

export default async function AdminDashboardOverviewPage() {
  // Fetch statistics and recent items using cached, parallel queries
  const [
    statsData,
    unreadInquiries,
    recentProjects,
    recentInquiries
  ] = await Promise.all([
    getDashboardStats(),
    getUnreadInquiriesCount(),
    getRecentProjects(),
    getRecentInquiries()
  ]);

  const { totalProjects, totalImages, totalInquiries } = statsData;

  const stats = [
    { label: 'Total Projects', value: totalProjects || 0, color: 'text-blue-400' },
    { label: 'Total Images', value: totalImages || 0, color: 'text-purple-400' },
    { label: 'Total Inquiries', value: totalInquiries || 0, color: 'text-green-400' },
    { label: 'Unread Inquiries', value: unreadInquiries || 0, color: 'text-gold' }
  ];

  return (
    <div className="space-y-8">
      {/* 1. Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#0b0f19] border border-white/10 p-6 rounded-sm shadow-md">
            <span className="text-[10px] text-white/40 font-semibold tracking-widest uppercase block mb-1">
              {stat.label}
            </span>
            <span className={`text-3xl font-serif font-bold ${stat.color}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Quick Actions */}
      <div className="bg-[#0b0f19] border border-white/10 p-6 rounded-sm shadow-md">
        <h3 className="text-gold font-serif text-sm font-semibold tracking-widest uppercase mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/dashboard/projects/new"
            className="bg-gold hover:bg-[#b0934c] text-black text-xs font-semibold uppercase tracking-widest py-3 px-4 rounded-sm transition-all duration-300 text-center"
          >
            Add New Project
          </Link>
          <Link
            href="/admin/dashboard/projects"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold uppercase tracking-widest py-3 px-4 rounded-sm transition-all duration-300 text-center"
          >
            Manage Projects
          </Link>
          <Link
            href="/admin/dashboard/inquiries"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold uppercase tracking-widest py-3 px-4 rounded-sm transition-all duration-300 text-center"
          >
            View Contact Inquiries
          </Link>
        </div>
      </div>

      {/* 3. Recent Content split grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Recent Projects Table */}
        <div className="xl:col-span-7 bg-[#0b0f19] border border-white/10 p-6 rounded-sm shadow-md overflow-hidden">
          <h3 className="text-gold font-serif text-sm font-semibold tracking-widest uppercase mb-4">
            Recent Projects
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Project</th>
                  <th className="pb-3 font-semibold">Division</th>
                  <th className="pb-3 font-semibold">Sector</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentProjects && recentProjects.length > 0 ? (
                  recentProjects.map((proj: any) => {
                    const coverImg = proj.project_images?.find((img: any) => img.is_cover)?.image_url || '/placeholder.jpg';
                    return (
                      <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 flex items-center gap-3 font-medium">
                          <div className="relative w-10 h-7 rounded-sm overflow-hidden bg-white/5 border border-white/10 flex-shrink-0">
                            <Image
                              src={coverImg}
                              alt={proj.title}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <span className="truncate max-w-[150px]" title={proj.title}>
                            {proj.title}
                          </span>
                        </td>
                        <td className="py-3 uppercase text-[10px] tracking-wider text-white/75">
                          {proj.division}
                        </td>
                        <td className="py-3 text-white/75">
                          {proj.client_sector}
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/admin/dashboard/projects/${proj.id}/edit`}
                            className="text-gold hover:text-[#b0934c] font-medium"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-white/40">
                      No recent projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="xl:col-span-5 bg-[#0b0f19] border border-white/10 p-6 rounded-sm shadow-md">
          <h3 className="text-gold font-serif text-sm font-semibold tracking-widest uppercase mb-4">
            Recent Inquiries
          </h3>
          <div className="space-y-4">
            {recentInquiries && recentInquiries.length > 0 ? (
              recentInquiries.map((inq: any) => (
                <Link
                  key={inq.id}
                  href="/admin/dashboard/inquiries"
                  className="block p-3 rounded-sm bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/10 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white">
                      {inq.name}
                    </span>
                    {inq.status === 'new' && (
                      <span className="bg-gold text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>
                  {inq.company && (
                    <span className="text-[10px] text-white/40 block mb-1">
                      {inq.company}
                    </span>
                  )}
                  <p className="text-xs text-white/70 line-clamp-2 italic">
                    "{inq.message}"
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-center py-4 text-white/40 text-xs">
                No recent contact inquiries.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
