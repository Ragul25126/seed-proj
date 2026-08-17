import { getAllInquiriesCached } from '../../../../lib/supabase/cached-queries';
import InquiriesClient from './InquiriesClient';

export default async function AdminInquiriesPage() {
  const inquiries = await getAllInquiriesCached();



  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-gold">Contact Inquiries</h2>
          <p className="text-xs text-white/50">Read and manage contact requests submitted from the public website.</p>
        </div>
      </div>

      <InquiriesClient initialInquiries={inquiries || []} />
    </div>
  );
}
