import { notFound } from 'next/navigation';
import { requireAdmin } from '../../../../../../lib/supabase/server';
import { createAdminClient } from '../../../../../../lib/supabase/admin';
import EditProjectClient from './EditProjectClient';

export const dynamic = 'force-dynamic';

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function AdminEditProjectPage({ params }: EditProjectPageProps) {
  // 1. Enforce server-side user authentication and admin authorization
  await requireAdmin();

  // 2. Privileged database operations executed only after verified authentication and authorization
  const privilegedClient = createAdminClient();

  // Fetch project details and images in parallel to optimize page load speed
  const [
    { data: project, error: projErr },
    { data: images }
  ] = await Promise.all([
    privilegedClient
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single(),
    privilegedClient
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
