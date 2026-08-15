import { getAllProjects } from '@/lib/projects';
import ProjectsContentWrapper from './ProjectsContent';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Projects | SEED Engineering',
  description:
    'Explore SEED Engineering\'s portfolio of 1,000+ landmark projects across hospitality, residential, commercial, healthcare, and infrastructure sectors.',
};

/**
 * /projects — Server Component
 *
 * Fetches ALL projects from public.projects ordered by display_order ASC.
 * Project ORDER is determined solely by projects.display_order — never by
 * array index or any image-related field.
 *
 * Images for each project come from public.project_images (via getAllProjects).
 * The hardcoded lib/data.ts portfolio array is NOT used here.
 */
export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return <ProjectsContentWrapper projects={projects} />;
}
