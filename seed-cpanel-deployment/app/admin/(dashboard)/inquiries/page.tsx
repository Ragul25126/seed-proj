import React from 'react';
import { createClient } from '../../../../lib/supabase/server';
import InquiriesClient from './InquiriesClient';

export default async function AdminInquiriesPage() {
  const supabase = createClient();

  // Fetch all inquiries from database ordered by newest first
  const { data: inquiries, error } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contact inquiries:', error.message);
  }

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
