import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/sections/PageHero';
import { Section, SectionLabel } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import InquiryForm from '@/components/forms/InquiryForm';

export const metadata = {
  title: 'Pool Division — Swimming Pool Consultancy',
  description:
    'Seed Engineering Pool Division — bespoke swimming pools for hospitality, private residences and architects.',
  alternates: {
    canonical: '/pool',
  },
  openGraph: {
    title: 'Pool Division — SEED Engineering',
    description:
      'Seed Engineering Pool Division — bespoke swimming pools for hospitality, private residences and architects.',
    images: ['/seedlogo.png'],
  },
};

const services = [
  { href: '/pool/construction', label: 'Pool Construction', blurb: 'New-build pools from hydraulic concept to final tile. Hospitality, private and rooftop.' },
  { href: '/pool/renovation', label: 'Pool Renovation', blurb: 'Re-engineering existing pools — surface, plant, hydraulics, finish — to a standard above when they were built.' },
  { href: '/pool/maintenance', label: 'Pool Maintenance', blurb: 'Water chemistry, plant service, finish care. The unglamorous work that keeps a great pool feeling great.' },
  { href: '/pool/projects', label: 'Project Portfolio', blurb: 'Hotels, villas, rooftops, vitality suites — the case studies behind the division.' },
];

export default function PoolOverview() {
  return (
    <>
      <PageHero
        eyebrow="Pool & Wellness Division"
        title="Water is the most unforgiving material in any building. We treat it with the respect it deserves."
        intro="From a rooftop infinity edge in JBR to a hotel vitality suite in Jumeirah — the Pool Division engineers water as part of the architecture, not as a fitting bolted onto it."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <SectionLabel>The Practice</SectionLabel>
            <h2 className="h2">Pool engineering for clients who refuse to compromise.</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 prose-editorial">
            <p>
              The Pool Division began as a small specialist team inside Seed Engineering, called on
              when MEP projects included aquatic features that no contractor in the city wanted to
              touch — vanishing edges, vitality pools, multi-temperature suites, integrated
              architectural water.
            </p>
            <p>
              It is now a full division. We design, build, renovate and maintain pools across
              hospitality, luxury residential, and architect-led private work. Every project is led
              by a senior partner. No project is templated.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <SectionLabel>Services</SectionLabel>
        <h2 className="h2 text-navy max-w-3xl mb-14">
          Four practices, from a new build to a thirty-year-old hotel pool that has lost its way.
        </h2>
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-px bg-navy/10 border border-navy/10">
          {services.map((s) => (
            <StaggerItem key={s.href}>
              <Link href={s.href} className="block bg-white p-10 hover:bg-[#F8F6F1] transition-colors group h-full">
                <p className="label text-navy/50 mb-4 tracking-[0.3em]">{s.label}</p>
                <p className="text-navy/65 text-sm leading-relaxed mb-6">{s.blurb}</p>
                <span className="text-navy text-sm group-hover:translate-x-1 inline-block transition-transform">→</span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div>
              <SectionLabel>Why a Specialist Division</SectionLabel>
              <h2 className="h2 mb-6">A pool is a chemistry problem disguised as a finish.</h2>
              <p className="prose-editorial">
                <span>
                  General contractors treat pools as a shell, a pump and a finish. We treat them as
                  a balance of hydraulic flow, water chemistry, thermal control and architectural
                  intent — and we do not stop until all four are right.
                </span>
              </p>
              <div className="mt-8">
                <Button href="/projects" variant="outline-dark">See the Work</Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#0a1020] border border-navy/10">
              <Image
                src="/luxury_resort_pool_1780503490609.webp"
                alt="SEED Pool Engineering — Hospitality"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="navy">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionLabel dark>Start a Conversation</SectionLabel>
            <h2 className="h2 text-white">Tell us about the water.</h2>
          </div>
          <div className="lg:col-span-7">
            <InquiryForm variant="dark" defaultService="Pool Construction" />
          </div>
        </div>
      </Section>
    </>
  );
}
