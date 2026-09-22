import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { getAllProjects, getProjectBySlug } from '@/lib/projects';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function findProjectBySlug(slugParam: string) {
  const normalized = slugParam.toLowerCase().trim();
  
  // Try exact match first via database function
  const proj = await getProjectBySlug(normalized);
  if (proj) return proj;

  // Otherwise fallback to fetching all and doing fuzzy/partial matching locally
  const all = await getAllProjects();
  const cleanParam = normalized.replace(/[-_ ]+/g, '');
  let matchedProj = all.find((p) => p.slug.toLowerCase().replace(/[-_ ]+/g, '') === cleanParam);
  if (matchedProj) return matchedProj;

  matchedProj = all.find(
    (p) =>
      p.slug.toLowerCase().includes(normalized) ||
      normalized.includes(p.slug.toLowerCase()) ||
      p.title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanParam)
  );

  return matchedProj || null;
}

export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const proj = await findProjectBySlug(params.slug);
  if (!proj) {
    return { title: 'Project Not Found | SEED Engineering' };
  }
  return {
    title: `${proj.title} - Project Details | SEED Engineering`,
    description: `Project details for ${proj.title} in ${proj.location}. Delivered by SEED Engineering.`,
  };
}

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const proj = await findProjectBySlug(params.slug);

  if (!proj) {
    return (
      <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans pt-40 pb-32 flex items-center">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-2xl">
          <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">PORTFOLIO</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Project Not Found</h1>
          <p className="text-slate-400 font-light text-[15px] mb-8 leading-relaxed">
            The project you requested could not be found or has been moved.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
            >
              EXPLORE ALL PROJECTS
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const details = [
    proj.client    && { label: 'Client',    value: proj.client },
    proj.architect && { label: 'Architect', value: proj.architect },
    proj.services  && { label: 'Services',  value: proj.services },
    proj.area      && { label: 'Area',      value: proj.area },
    proj.sector    && { label: 'Sector',    value: proj.sector || proj.clientSector },
  ].filter(Boolean) as { label: string; value: string }[];

  const images = proj.images && proj.images.length > 0 ? proj.images : [proj.image];
  const shortDescription = proj.short_description || proj.description || '';

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans pt-28 lg:pt-36 pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-5xl">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-gold text-xs font-semibold tracking-[0.15em] uppercase hover:underline"
          >
            ← Back to Projects
          </Link>

          <Link
            href={`/view/${proj.slug}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold hover:bg-yellow-500 text-[#0b0f19] text-[11px] font-bold tracking-[0.15em] uppercase transition-colors rounded-sm"
          >
            View full project page →
          </Link>
        </div>

        {/* Project Detail Card Container */}
        <div className="bg-[#0d1526] border border-white/10 rounded-sm shadow-2xl overflow-hidden">
          {/* Hero Gallery */}
          <div className="p-4 sm:p-6 pb-0">
            <ProjectGallery
              images={images}
              title={proj.title}
              aspectRatio="aspect-[16/9]"
              objectFit={proj.slug === 'saas-st-regis' ? 'contain' : 'cover'}
              containImages={['/projects/mandarin-wasl-2-new.jpg', '/projects/ellington-hq.png', '/projects/uptown-mercer-house-skyline.jpg', '/projects/uptown-mercer-house-lobby.jpg', '/projects/uptown-mercer-house-pool.jpg', '/projects/uptown-mercer-house-retail.jpg', '/projects/uptown-mercer-house-balcony.jpg']}
            />
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-10">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(proj.sector || proj.clientSector) && (
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold border border-gold/30 px-3 py-1 rounded-full">
                  {proj.sector || proj.clientSector}
                </span>
              )}
              {proj.location && (
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400 border border-white/10 px-3 py-1 rounded-full">
                  {proj.location.split('**')[0].trim()}
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white mb-6 leading-tight">
              {proj.title}
            </h1>

            {/* Detail grid */}
            {details.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-white/10">
                {details.map((d) => (
                  <div key={d.label}>
                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold mb-1">{d.label}</p>
                    <p className="text-slate-300 text-sm leading-relaxed">{d.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Short Description */}
            {shortDescription && (
              <div className="prose prose-invert max-w-none text-slate-300 font-light text-[15px] leading-relaxed">
                {shortDescription.split('\n').map((paragraph: string, i: number) => (
                  paragraph.trim() && <p key={i} className="mb-4">{paragraph}</p>
                ))}
              </div>
            )}

            {/* Link to View Full Project Page */}
            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
              <Link
                href="/projects"
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                ← Back to Projects
              </Link>
              <Link
                href={`/view/${proj.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-yellow-500 text-[#0b0f19] text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
              >
                View full project page →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
