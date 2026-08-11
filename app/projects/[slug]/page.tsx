import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { portfolio, featuredProjects } from '@/lib/data';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { SimilarProjectCard } from '@/components/projects/SimilarProjectCard';

// Combine all projects from portfolio and featuredProjects for lookup
function getAllProjects() {
  const map = new Map<string, any>();
  
  // Add portfolio projects
  portfolio.forEach((p) => {
    if (p.slug) map.set(p.slug.toLowerCase(), p);
  });
  
  // Add featured projects if missing
  featuredProjects.forEach((fp: any) => {
    if (fp.slug && !map.has(fp.slug.toLowerCase())) {
      map.set(fp.slug.toLowerCase(), {
        title: fp.title,
        slug: fp.slug,
        division: fp.division || 'mep',
        clientSector: fp.clientSector,
        sector: fp.clientSector?.split('·')[0].trim() || 'Engineering',
        location: fp.location,
        projectScale: fp.projectScale,
        client: 'Confidential Developer',
        architect: 'International Lead Architect',
        services: fp.scope || 'MEP Design & Supervision',
        area: fp.projectScale,
        image: fp.image,
        images: fp.images,
        description: typeof fp.challenge === 'string' ? fp.challenge : 'Engineering design & supervision for complex multi-disciplinary development.',
      });
    }
  });

  return Array.from(map.values());
}

function findProjectBySlug(slugParam: string) {
  const all = getAllProjects();
  const normalized = slugParam.toLowerCase().trim();
  
  // Exact match
  let proj = all.find((p) => p.slug.toLowerCase() === normalized);
  if (proj) return proj;

  // Fuzzy slug match (replacing underscores/spaces/hyphens)
  const cleanParam = normalized.replace(/[-_ ]+/g, '');
  proj = all.find((p) => p.slug.toLowerCase().replace(/[-_ ]+/g, '') === cleanParam);
  if (proj) return proj;

  // Partial match by title or slug
  proj = all.find(
    (p) =>
      p.slug.toLowerCase().includes(normalized) ||
      normalized.includes(p.slug.toLowerCase()) ||
      p.title.toLowerCase().replace(/[^a-z0-9]/g, '').includes(cleanParam)
  );

  return proj || null;
}

export async function generateStaticParams() {
  const all = getAllProjects();
  return all.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const proj = findProjectBySlug(params.slug);
  if (!proj) {
    return { title: 'Project Not Found | SEED Engineering' };
  }
  return {
    title: `${proj.title} | SEED Engineering Projects`,
    description: `Engineering case study for ${proj.title} in ${proj.location}. Delivered by SEED Engineering.`,
  };
}

export default function SingleProjectPage({ params }: { params: { slug: string } }) {
  const proj = findProjectBySlug(params.slug);

  if (!proj) {
    // Render an elegant inline fallback instead of a generic 404 page
    return (
      <div className="bg-[#0b0f19] min-h-screen text-slate-300 font-sans pt-40 pb-32 flex items-center">
        <div className="container mx-auto px-6 lg:px-12 text-center max-w-2xl">
          <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-4 block">PORTFOLIO</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">Project Overview</h1>
          <p className="text-slate-400 font-light text-[15px] mb-8 leading-relaxed">
            The project you requested is part of SEED’s global portfolio of landmark engineering developments across the Middle East, Africa, and Asia.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center justify-center px-8 py-4 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
            >
              EXPLORE ALL PROJECTS
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-gold hover:text-gold transition-colors"
            >
              CONTACT OUR TEAM
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const allProjects = getAllProjects();
  const relatedProjects = allProjects
    .filter((p) => p.slug !== proj.slug && (p.sector === proj.sector || p.division === proj.division))
    .slice(0, 3);

  const details = [
    proj.client && { label: 'CLIENT', value: proj.client },
    proj.architect && { label: 'ARCHITECT', value: proj.architect },
    proj.services && { label: 'SERVICES', value: proj.services },
    proj.area && { label: 'BUA / AREA', value: proj.area },
    proj.sector && { label: 'SECTOR', value: proj.sector || proj.clientSector },
    proj.location && { label: 'LOCATION', value: proj.location.split('**')[0].trim() },
  ].filter(Boolean) as { label: string; value: string }[];

  const images = proj.images && proj.images.length > 0 ? proj.images : [proj.image];

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
              containImages={['/projects/mandarin-wasl-tower.webp', '/projects/mandarin-wasl-2.jpg', '/projects/ellington-hq.png']}
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
                  Engineering Delivery & Performance
                </h2>
                <div className="space-y-4 text-slate-300 font-light text-[16px] leading-relaxed">
                  {proj.description ? (
                    proj.description.split('\n').map((paragraph: string, i: number) => (
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
                      className={`${(proj.slug === 'saas-st-regis' || img === '/projects/mandarin-wasl-2.jpg' || img === '/projects/ellington-hq.png' || img.includes('uptown-mercer-house')) ? 'object-contain' : 'object-cover'} group-hover:scale-105 transition-transform duration-700`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                      <div>
                        <span className="text-gold text-[10px] font-mono tracking-widest uppercase block mb-1">
                          IMAGE {idx + 1} OF {images.length}
                        </span>
                        <p className="text-white text-sm font-medium">{proj.title} — Architectural View</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* RELATED WORK */}
      {relatedProjects.length > 0 && (
        <section className="py-20 bg-[#0b0f19]">
          <div className="container mx-auto px-6 lg:px-12">
            <Reveal>
              <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <span className="text-gold text-[10px] font-semibold tracking-[0.2em] uppercase mb-2 block">
                    RELATED WORK
                  </span>
                  <h2 className="font-serif text-3xl font-bold text-white">Similar Engineering Projects</h2>
                </div>
                <Link
                  href="/projects"
                  className="text-gold text-[11px] font-bold tracking-[0.15em] uppercase hover:underline"
                >
                  VIEW ALL PROJECTS →
                </Link>
              </div>
            </Reveal>

            <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedProjects.map((rp, idx) => (
                <StaggerItem key={idx}>
                  <SimilarProjectCard project={rp} />
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      {/* CALL TO ACTION */}
      <section className="py-20 bg-[#0f172a] border-t border-white/5 text-center">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          <Reveal>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Planning a Similar Development?
            </h2>
            <p className="text-slate-400 font-light text-[15px] mb-8 leading-relaxed">
              Connect with SEED’s multidisciplinary engineering team to discuss MEP design, BIM coordination, sustainability, and field supervision for your project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-10 py-5 bg-gold hover:bg-yellow-500 text-[#0b0f19] font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
              >
                REQUEST CONSULTATION
              </Link>
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-10 py-5 border border-white/20 text-white font-sans text-[11px] font-bold tracking-[0.15em] uppercase hover:border-gold hover:text-gold transition-colors"
              >
                EXPLORE PORTFOLIO
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
