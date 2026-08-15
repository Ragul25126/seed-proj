import { PageHero } from './PageHero';
import { Section, SectionLabel } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import InquiryForm from '@/components/forms/InquiryForm';
import { ProjectCard, type ProjectCardData } from '@/components/projects/ProjectCard';

export type ServicePageProps = {
  eyebrow: string;
  heroTitle: string;
  heroIntro?: string;
  realMeaningTitle: string;
  realMeaningParagraphs: string[];
  approach: { title: string; body: string }[];
  defaultService: string;
  division?: 'mep' | 'pool';
  relatedProjects?: ProjectCardData[];
};

// Render a hero title with an italic accent on the last meaningful word.
function italicLastWord(title: string) {
  const words = title.split(' ');
  if (words.length < 2) return title;
  const last = words.pop()!;
  return (
    <>
      {words.join(' ')}{' '}
      <span>{last}</span>
    </>
  );
}

export function ServicePageTemplate(props: ServicePageProps) {
  // Only render related projects if explicitly provided by the server component caller.
  // We do NOT fall back to the hardcoded lib/data.ts portfolio here.
  const projects = props.relatedProjects ?? [];

  return (
    <>
      <PageHero
        eyebrow={props.eyebrow}
        title={italicLastWord(props.heroTitle)}
        intro={props.heroIntro}
      />

      {/* What this really means */}
      <Section tone="cream">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-4">
            <SectionLabel>What This Really Means</SectionLabel>
            <h2 className="font-sans text-3xl md:text-4xl font-medium leading-[1.1] tracking-[-0.01em] text-navy">
              {props.realMeaningTitle}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 text-navy/65 leading-relaxed space-y-5 text-[17px]">
            {props.realMeaningParagraphs.map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <p>{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* The Seed Approach */}
      <Section tone="white">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-10 h-px bg-navy/40" />
            <span className="label text-navy/60 tracking-[0.3em]">THE SEED APPROACH</span>
            <span className="block w-10 h-px bg-navy/40" />
          </div>
          <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] text-navy">
            How we do this work <span>differently.</span>
          </h2>
        </div>
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-px bg-navy/10 border border-navy/10">
          {props.approach.map((a, i) => (
            <StaggerItem key={i}>
              <div className="bg-white p-10 md:p-12 h-full">
                <p className="font-sans text-5xl text-navy/25 mb-6 font-medium">0{i + 1}</p>
                <h3 className="font-sans text-2xl font-medium text-navy mb-4">{a.title}</h3>
                <p className="text-navy/60 leading-relaxed text-[15px]">{a.body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Related projects */}
      <Section tone="cream">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-end">
          <div className="lg:col-span-7">
            <SectionLabel>Related Work</SectionLabel>
            <h2 className="font-sans text-4xl md:text-5xl font-medium leading-[1.05] text-navy">
              A few projects where this work <span>mattered.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-navy/60 leading-relaxed">
              Each case study is told as a complete story ΓÇö the brief, the challenge, the
              engineering answer.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p: any) => (
            <ProjectCard key={p._id || p.slug} project={p} />
          ))}
        </div>
      </Section>

      {/* Inquiry CTA */}
      <Section tone="navy">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-start">
          <div className="lg:col-span-5">
            <SectionLabel>Tell us about your project</SectionLabel>
            <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.05] text-white">
              The next great building usually starts with a short <span>message.</span>
            </h2>
            <p className="mt-6 text-white/70 leading-relaxed max-w-md">
              Share what you are working on. A senior member of the studio will reply within one
              working day ΓÇö not a sales script, an engineer.
            </p>
          </div>
          <div className="lg:col-span-7">
            <InquiryForm defaultService={props.defaultService} variant="dark" />
          </div>
        </div>
      </Section>
    </>
  );
}
