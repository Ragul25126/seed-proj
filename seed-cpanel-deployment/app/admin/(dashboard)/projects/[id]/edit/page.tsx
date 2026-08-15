import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '../../../../../../lib/supabase/server';
import EditProjectClient from './EditProjectClient';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function AdminEditProjectPage({ params }: EditProjectPageProps) {
  const supabase = createClient();

  // 1. Fetch project details
  const { data: project, error: projErr } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .single();

  if (projErr || !project) {
    notFound();
  }

  // 2. Fetch project images
  const { data: images, error: imgErr } = await supabase
    .from('project_images')
    .select('*')
    .eq('project_id', params.id)
    .order('display_order', { ascending: true });

  return (
    <div className="space-y-6">
      <EditProjectClient project={project} initialImages={images || []} />
    </div>
  );
}
