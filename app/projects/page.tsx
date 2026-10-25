import { getProjectsSummary } from '@/lib/projects';
import ProjectsContentWrapper from './ProjectsContent';

// ISR with 5-minute background revalidation; immediately invalidated on CMS updates via revalidatePath('/projects') and revalidateTag('projects')
export const revalidate = 300;

export const metadata = {
  title: 'Projects | SEED Engineering',
  description:
    'Explore SEED Engineering\'s portfolio of 1,000+ landmark projects across hospitality, residential, commercial, healthcare, and infrastructure sectors.',
};

/**
 * /projects — Server Component
 *
 * Fetches lightweight project summaries ordered by display_order ASC.
 * Secondary gallery images are loaded on-demand via /api/project-images when
 * a project modal is opened, drastically reducing initial RSC payload size.
 */
export default async function ProjectsPage() {
  const projects = await getProjectsSummary();

  return <ProjectsContentWrapper projects={projects as any} />;
}

