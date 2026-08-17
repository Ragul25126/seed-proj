import { getAllProjectsCached } from '../../../../lib/supabase/cached-queries';
import ProjectsClient from './ProjectsClient';

export default async function AdminProjectsPage() {
  const projects = await getAllProjectsCached();

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
