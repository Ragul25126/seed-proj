import React from 'react';
import { createClient } from '../../../../lib/supabase/server';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const supabase = createClient();

  // Fetch all projects with their image references
  const { data: projects, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_images (
        id,
        image_url,
        is_cover
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error.message);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-gold">Projects Portfolio</h2>
          <p className="text-xs text-white/50">Manage your projects, upload images, and control featured states.</p>
        </div>
      </div>

      <ProjectsClient initialProjects={projects || []} />
    </div>
  );
}
