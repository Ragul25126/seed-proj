import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/sections/PageHero';
import { Section, SectionLabel } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import InquiryForm from '@/components/forms/InquiryForm';

export const metadata = {
  title: 'MEP Consultancy — Mechanical, Electrical, Plumbing',
  description:
    'Seed Engineering MEP consultancy in Dubai — engineered systems for buildings that need to work the day they open and a decade later.',
  alternates: {
    canonical: '/mep',
  },
  openGraph: {
    title: 'MEP Consultancy — SEED Engineering',
    description:
      'Seed Engineering MEP consultancy in Dubai — engineered systems for buildings that need to work the day they open and a decade later.',
    images: ['/seedlogo.png'],
  },
};

const services = [
  { href: '/mep/commercial', label: 'Commercial MEP', blurb: 'Towers, offices, mixed-use developments where every system has to scale and stay quiet.' },
  { href: '/mep/residential', label: 'Residential MEP', blurb: 'From a single villa to a thirty-storey tower. Systems people live with — and never notice.' },
  { href: '/mep/hvac', label: 'HVAC Systems', blurb: 'Designed for the climate this region actually has, not the climate the textbook describes.' },
  { href: '/mep/electrical-plumbing', label: 'Electrical & Plumbing', blurb: 'Two disciplines, one coordinated installation. No clashes. No surprises during commissioning.' },
  { href: '/mep/maintenance', label: 'MEP Maintenance', blurb: 'Service contracts for buildings we built, and for buildings we did not. We are technicians first.' },
  { href: '/mep/projects', label: 'Project Portfolio', blurb: 'The proof. Case studies told as stories — the brief, the challenge, the result.' },
];

export default function MEPOverview() {
  return (
    <>
      <PageHero
        eyebrow="MEP Consultancy"
        title="The systems inside a building decide whether it succeeds."
        intro="We are the engineers a developer calls when the building cannot afford to be ordinary. A studio of sixty-plus, working from Dubai, delivering across the UAE."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <SectionLabel>The Practice</SectionLabel>
            <h2 className="h2">A different way to do MEP in the UAE.</h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6 prose-editorial">
            <p>
              Most MEP consultants in this market sell a deliverable: a set of drawings, a schedule
              of works, a finished building. Seed Engineering sells a relationship with the systems
              themselves — from the first single-line diagram to the day a tenant moves out a
              decade later and the next one moves in to a building that still works.
            </p>
            <p>
              We work with developers, architects, hospitality groups and private clients. We
              design, build, commission and maintain. We sign drawings we are willing to defend,
              and we walk job sites we are willing to put our name on.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <SectionLabel>Services</SectionLabel>
        <h2 className="h2 text-navy max-w-3xl mb-14">
          Six practices under one roof, coordinated by one team.
        </h2>
        <Stagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-navy/10 border border-navy/10">
          {services.map((s) => (
            <StaggerItem key={s.href}>
              <Link
                href={s.href}
                className="block bg-white p-10 hover:bg-[#F8F6F1] transition-colors group h-full"
              >
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
              <SectionLabel>How We Work</SectionLabel>
              <h2 className="h2 mb-6">Engineering first. Documentation second. Sales never.</h2>
              <p className="prose-editorial">
                <span>Our project leads are engineers who still draw. Our directors still attend commissioning.
                The reason our handovers do not generate snag lists is that nobody on this team has stopped doing the work.</span>
              </p>
              <div className="mt-8">
                <Button href="/why-seed" variant="outline-dark">Why Seed Engineering</Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#0a1020] border border-navy/10">
              <Image
                src="/modern_mep_interior_1780503503410.webp"
                alt="Coordinated MEP building systems in commercial development"
                fill
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
            <h2 className="h2 text-white">Tell us about the building.</h2>
          </div>
          <div className="lg:col-span-7">
            <InquiryForm variant="dark" defaultService="Commercial MEP" />
          </div>
        </div>
      </Section>
    </>
  );
}
