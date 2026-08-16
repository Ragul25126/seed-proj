'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { markInquiryStatusAction, deleteInquiryAction } from '../../actions';

interface InquiriesClientProps {
  initialInquiries: any[];
}

export default function InquiriesClient({ initialInquiries }: InquiriesClientProps) {
  const router = useRouter();
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
  const [isPending, startTransition] = useTransition();

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter inquiries based on search and status filter
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch =
      inq.name?.toLowerCase().includes(search.toLowerCase()) ||
      inq.email?.toLowerCase().includes(search.toLowerCase()) ||
      inq.company?.toLowerCase().includes(search.toLowerCase()) ||
      inq.message?.toLowerCase().includes(search.toLowerCase()) ||
      inq.subject?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || inq.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Open modal and auto-mark as read if new
  const handleViewInquiry = async (inq: any) => {
    setSelectedInquiry(inq);

    if (inq.status === 'new') {
      // Mark as read in DB
      const result = await markInquiryStatusAction(inq.id, 'read');
      if (result.success) {
        // Update local state
        setInquiries(prev =>
          prev.map(item =>
            item.id === inq.id ? { ...item, status: 'read' } : item
          )
        );
        // Refresh server layout to update sidebar badge
        router.refresh();
      }
    }
  };

  const handleStatusChange = async (inquiryId: string, newStatus: 'new' | 'read' | 'replied') => {
    const result = await markInquiryStatusAction(inquiryId, newStatus);
    if (result.success) {
      setInquiries(prev =>
        prev.map(item =>
          item.id === inquiryId ? { ...item, status: newStatus } : item
        )
      );
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry((prev: any) => ({ ...prev, status: newStatus }));
      }
      router.refresh();
    } else {
      alert(`Error updating status: ${result.error}`);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Avoid opening the detail modal
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    startTransition(async () => {
      const result = await deleteInquiryAction(deleteId);
      if (result.error) {
        alert(`Error deleting inquiry: ${result.error}`);
      } else {
        setInquiries(prev => prev.filter(item => item.id !== deleteId));
        if (selectedInquiry && selectedInquiry.id === deleteId) {
          setSelectedInquiry(null);
        }
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
            placeholder="Search inquiries by name, company, email, message..."
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
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full bg-[#070b13] border border-white/10 rounded-sm px-4 py-2.5 text-white text-xs focus:outline-none focus:border-gold/50 transition-colors"
          >
            <option value="all">All Statuses</option>
            <option value="new">New / Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-[#0b0f19] border border-white/10 rounded-sm overflow-hidden shadow-md">
        {filteredInquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider bg-white/5">
                  <th className="p-4 font-semibold">Sender</th>
                  <th className="p-4 font-semibold">Company</th>
                  <th className="p-4 font-semibold">Subject</th>
                  <th className="p-4 font-semibold">Message Preview</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 cursor-pointer">
                {filteredInquiries.map(inq => (
                  <tr
                    key={inq.id}
                    onClick={() => handleViewInquiry(inq)}
                    className={`hover:bg-white/5 transition-colors ${
                      inq.status === 'new' ? 'font-semibold text-white bg-gold/5' : 'text-white/70'
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-white font-medium">{inq.name}</span>
                        <span className="text-[10px] text-white/40">{inq.email}</span>
                      </div>
                    </td>
                    <td className="p-4 truncate max-w-[120px]" title={inq.company || '-'}>
                      {inq.company || '-'}
                    </td>
                    <td className="p-4 truncate max-w-[150px]" title={inq.subject || '-'}>
                      {inq.subject || '-'}
                    </td>
                    <td className="p-4 max-w-xs truncate" title={inq.message}>
                      {inq.message}
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${
                        inq.status === 'new'
                          ? 'bg-gold/10 text-gold border border-gold/25'
                          : inq.status === 'replied'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/25'
                          : 'bg-white/5 text-white/50 border border-white/10'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-4 text-white/40 text-[10px] font-mono">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => handleDeleteClick(e, inq.id)}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-white/40">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white/10 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No contact inquiries found.</p>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#0b0f19] border border-white/10 rounded-sm p-6 w-full max-w-2xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] text-white/40 font-semibold uppercase tracking-widest block mb-1">
                  Inquiry Details
                </span>
                <h4 className="text-gold font-serif text-lg tracking-wide uppercase font-semibold">
                  {selectedInquiry.subject || 'No Subject'}
                </h4>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sender details list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#070b13] border border-white/5 p-4 rounded-sm">
              <div>
                <span className="text-[10px] text-white/40 uppercase block mb-0.5">Sender Name</span>
                <span className="text-white font-medium">{selectedInquiry.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase block mb-0.5">Email Address</span>
                <a href={`mailto:${selectedInquiry.email}`} className="text-gold hover:underline font-medium">
                  {selectedInquiry.email}
                </a>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase block mb-0.5">Company</span>
                <span className="text-white font-medium">{selectedInquiry.company || '-'}</span>
              </div>
              <div>
                <span className="text-[10px] text-white/40 uppercase block mb-0.5">Phone Number</span>
                <span className="text-white font-medium">{selectedInquiry.phone || '-'}</span>
              </div>
            </div>

            {/* Message block */}
            <div className="space-y-2">
              <span className="text-[10px] text-white/40 uppercase block">Message Text</span>
              <div className="bg-[#070b13] border border-white/5 p-4 rounded-sm text-xs text-white/95 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto italic">
                "{selectedInquiry.message}"
              </div>
            </div>

            {/* Status switcher / Actions footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-white/10 pt-4 text-xs font-semibold">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-white/40 uppercase">Mark Status:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, 'read')}
                    className={`px-3 py-1 rounded-sm border transition-colors ${
                      selectedInquiry.status === 'read'
                        ? 'bg-white/10 border-white/20 text-white'
                        : 'border-white/5 text-white/40 hover:text-white'
                    }`}
                  >
                    Read
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedInquiry.id, 'replied')}
                    className={`px-3 py-1 rounded-sm border transition-colors ${
                      selectedInquiry.status === 'replied'
                        ? 'bg-green-500/10 border-green-500/25 text-green-400'
                        : 'border-white/5 text-white/40 hover:text-white'
                    }`}
                  >
                    Replied
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 uppercase tracking-widest">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-sm transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={(e) => {
                    handleDeleteClick(e, selectedInquiry.id);
                  }}
                  className="px-4 py-2 bg-red-650/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 rounded-sm transition-colors"
                >
                  Delete Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Inquiry Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-55 animate-fade-in">
          <div className="bg-[#0b0f19] border border-white/10 rounded-sm p-6 w-full max-w-sm shadow-2xl space-y-6">
            <div>
              <h4 className="text-gold font-serif text-lg tracking-wide uppercase font-semibold mb-2">
                Delete Inquiry
              </h4>
              <p className="text-sm text-white/70">
                Are you sure you want to delete this contact inquiry?
              </p>
              <p className="text-xs text-red-400 mt-2 bg-red-500/10 border border-red-500/20 p-2 rounded-sm">
                Warning: This action is permanent and cannot be undone.
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
                className="px-4 py-2.5 rounded-sm bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                {isPending ? 'Deleting...' : 'Delete Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
