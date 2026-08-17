import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../../../lib/supabase/server';
import EditProjectClient from './EditProjectClient';

export const dynamic = 'force-dynamic';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function AdminEditProjectPage({ params }: EditProjectPageProps) {
  const supabase = createClient();

  // Fetch project details and images in parallel to optimize page load speed
  const [
    { data: project, error: projErr },
    { data: images }
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single(),
    supabase
      .from('project_images')
      .select('*')
      .eq('project_id', params.id)
      .order('display_order', { ascending: true })
  ]);

  if (projErr || !project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <EditProjectClient project={project} initialImages={images || []} />
    </div>
  );
}
