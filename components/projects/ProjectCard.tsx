import Link from 'next/link';
import Image from 'next/image';
import { Placeholder } from '@/components/ui/Placeholder';

export type ProjectCardData = {
  _id?: string;
  title: string;
  slug: string;
  division?: string;
  clientSector?: string;
  location?: string;
  projectScale?: string;
  challenge?: string | any[];
  image?: string;
  stats?: { label: string; value: string }[];
};

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const challengeText =
    typeof project.challenge === 'string'
      ? project.challenge
      : 'A complex brief, delivered with engineering precision and craft.';
  const primaryStat = project.stats?.[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex flex-col h-full bg-ink text-white border border-white/5 hover:border-gold/50 transition-colors"
    >
      <div className="relative overflow-hidden aspect-[4/3] bg-[#0a1020]">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            style={
              project.slug === 'saas-st-regis'
                ? { objectPosition: 'center 20%' }
                : project.slug === 'uptown-mercer-house'
                ? { objectPosition: 'center 40%' }
                : undefined
            }
          />
        ) : (
          <Placeholder label="PROJECT PHOTO" aspect="4/3" className="!border-0 absolute inset-0" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 bg-ink/40">
          {primaryStat && (
            <div>
              <p className="label text-gold mb-1">{primaryStat.label}</p>
              <p className="text-2xl font-light">{primaryStat.value}</p>
            </div>
          )}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <p className="label text-gold mb-3">{project.clientSector || 'Project'}</p>
        <h3 className="text-xl font-semibold leading-snug mb-3 group-hover:text-gold transition-colors line-clamp-2 min-h-[3.5rem]">
          {project.title}
        </h3>
        <p className="text-sm text-white/60 leading-relaxed line-clamp-3 flex-1">{challengeText}</p>
        <p className="text-xs text-white/40 mt-4 pt-4 border-t border-white/5">
          {project.location} · {project.projectScale}
        </p>
      </div>
    </Link>
  );
}
