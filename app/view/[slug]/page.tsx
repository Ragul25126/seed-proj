import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { SimilarProjectCard } from '@/components/projects/SimilarProjectCard';
import { getAllProjects, getProjectBySlug, Project } from '@/lib/projects';

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
  let matchedProj = all.find((p: Project) => p.slug.toLowerCase().replace(/[-_ ]+/g, '') === cleanParam);
  if (matchedProj) return matchedProj;

  matchedProj = all.find(
    (p: Project) =>
      p.slug.toLowerCase().includes(normalized) ||
      normalized.includes(p.slug.toLowerCase()) ||
      p.title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanParam)
  );

  return matchedProj || null;
}

export async function generateStaticParams() {
  const all = await getAllProjects();
  return all.map((p: Project) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const proj = await findProjectBySlug(params.slug);
  if (!proj) {
    return { title: 'Project Not Found | SEED Engineering' };
  }
  return {
    title: `${proj.title} - Full Case Study | SEED Engineering Projects`,
    description: `Detailed engineering case study for ${proj.title} in ${proj.location}. Delivered by SEED Engineering.`,
  };
}

export default async function ViewFullProjectPage({ params }: { params: { slug: string } }) {
  const proj = await findProjectBySlug(params.slug);

  if (!proj) {
    return (
      <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans pt-40 pb-32 flex items-center">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-2xl">
          <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">PORTFOLIO</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Project Not Found</h1>
          <p className="text-slate-400 font-light text-[15px] mb-8 leading-relaxed">
            The project case study you requested could not be found or has been moved.
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

  const allProjects = await getAllProjects();
  const relatedProjects = allProjects
    .filter((p: Project) => p.slug !== proj.slug && (p.sector === proj.sector || p.division === proj.division))
    .slice(0, 3);

  const details = [
    proj.client && { label: 'CLIENT', value: proj.client },
    proj.architect && { label: 'ARCHITECT', value: proj.architect },
    proj.services && { label: 'SERVICES', value: proj.services },
    proj.area && { label: 'BUA / AREA', value: proj.area },
    proj.sector && { label: 'SECTOR', value: proj.sector || proj.clientSector },
    proj.location && { label: 'LOCATION', value: proj.location.split('**')[0].trim() },
  ].filter(Boolean) as { label: string; value: string }[];

  const images: string[] = proj.images && proj.images.length > 0 ? proj.images : (proj.image ? [proj.image] : []);

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans selection:bg-gold selection:text-[#0b0f19] pb-32">
      {/* HERO SECTION */}
      <section className="relative pt-36 lg:pt-44 pb-20 border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <Reveal>
            <div className="mb-6">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-gold text-[11px] font-semibold tracking-[0.15em] uppercase hover:underline mb-4"
              >
                ← BACK TO ALL PROJECTS
              </Link>
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-3 block">
                {proj.sector || proj.clientSector || 'PROJECT CASE STUDY'}
              </span>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight max-w-4xl">
                {proj.title}
              </h1>
            </div>
          </Reveal>

          {/* Quick stats strip */}
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-white/10 mt-8 mb-12">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">LOCATION</p>
                <p className="text-white text-sm font-medium">{proj.location?.split('**')[0].trim()}</p>
              </div>
              {proj.services && (
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">SCOPE</p>
                  <p className="text-white text-sm font-medium line-clamp-1">{proj.services}</p>
                </div>
              )}
              {proj.client && (
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">CLIENT</p>
                  <p className="text-white text-sm font-medium line-clamp-1">{proj.client}</p>
                </div>
              )}
              {proj.area && (
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">BUA</p>
                  <p className="text-white text-sm font-medium">{proj.area}</p>
                </div>
              )}
            </div>
          </Reveal>

          {/* Featured Image & Gallery */}
          <Reveal delay={0.15}>
            <ProjectGallery
              images={images}
              title={proj.title}
              aspectRatio="aspect-[16/9] md:aspect-[21/9]"
              objectFit="cover"
              containImages={['/projects/mandarin-wasl-tower.webp', '/projects/mandarin-wasl-2-new.jpg', '/projects/ellington-hq.png']}
              containSlugs={['saas-st-regis', 'uptown-mercer-house', 'ellington-sands-1-2']}
              currentSlug={proj.slug}
            />
          </Reveal>
        </div>
      </section>

      {/* OVERVIEW & METADATA */}
      <section className="py-20 bg-[#0f172a] border-b border-white/5">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Overview text */}
            <div className="lg:col-span-7">
              <Reveal>
                <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">
                  PROJECT OVERVIEW
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
                  Engineering delivery & performance
                </h2>
                <div className="space-y-4 text-slate-300 font-light text-[16px] leading-relaxed">
                  {proj.full_description ? (
                    proj.full_description.split('\n').map((paragraph: string, i: number) => (
                      paragraph.trim() && <p key={i}>{paragraph}</p>
                    ))
                  ) : (proj.short_description || proj.description) ? (
                    (proj.short_description || proj.description)!.split('\n').map((paragraph: string, i: number) => (
                      paragraph.trim() && <p key={i}>{paragraph}</p>
                    ))
                  ) : (
                    <p>
                      SEED delivered comprehensive MEP engineering services for {proj.title}, ensuring optimal system performance, energy efficiency, constructability, and compliance with regional authority requirements.
                    </p>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Metadata Card */}
            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <div className="bg-[#0b0f19] p-8 border border-white/10 rounded-sm">
                  <h3 className="font-serif text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                    Key Project Details
                  </h3>
                  <div className="space-y-5">
                    {details.map((d) => (
                      <div key={d.label} className="flex flex-col sm:flex-row sm:justify-between border-b border-white/5 pb-3 last:border-0">
                        <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold">{d.label}</span>
                        <span className="text-white text-sm font-medium text-right mt-1 sm:mt-0">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* VISUAL SHOWCASE GRID */}
      {images.length > 1 && (
        <section className="py-20 bg-[#0b0f19] border-b border-white/5">
          <div className="container mx-auto px-6 lg:px-12">
            <Reveal>
              <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-2 block">
                VISUAL SHOWCASE
              </span>
              <h2 className="font-serif text-3xl font-bold text-white mb-8">Project Renders & Architecture</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {images.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-[16/10] bg-[#0a1020] rounded-sm overflow-hidden border border-white/10 group shadow-xl">
                    <Image
                      src={img}
                      alt={`${proj.title} Render ${idx + 1}`}
                      fill
                      unoptimized
                      className={`${(proj.slug === 'saas-st-regis' || img === '/projects/mandarin-wasl-2-new.jpg' || img === '/projects/ellington-hq.png' || img.includes('uptown-mercer-house')) ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-700`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                      <div>
                        <p className="text-gold text-[10px] font-bold tracking-widest uppercase">Rendering {idx + 1}</p>
                        <p className="text-white text-sm font-medium">{proj.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* SIMILAR PROJECTS */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-[#070b13]">
          <div className="container mx-auto px-6 lg:px-12">
            <Reveal>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-2 block">
                    RELATED EXPERIENCE
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-white">Similar Engineering Case Studies</h2>
                </div>
                <Link
                  href="/projects"
                  className="hidden md:inline-flex items-center gap-2 text-gold text-xs font-semibold tracking-widest uppercase hover:underline"
                >
                  VIEW ALL PORTFOLIO →
                </Link>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((relProj: Project) => (
                <SimilarProjectCard key={relProj.slug} project={relProj} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
