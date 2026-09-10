import { PageHero } from '@/components/sections/PageHero';
import { Section, SectionLabel } from '@/components/ui/Section';
import { Reveal, Stagger, StaggerItem } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import InquiryForm from '@/components/forms/InquiryForm';

export const metadata = {
  title: 'Why SEED | Engineering high-performance buildings',
  description: 'Why developers, PMCs, architects and contractors appoint SEED Engineering. Four pillars: Engineering Excellence, Coordination Expertise, Sustainability Leadership and Commissioning Verification.',
};

export default function WhySeed() {
  return (
    <>
      <PageHero
        eyebrow="Why SEED"
        title="Engineering doesn't end at design. Neither do we."
        intro="Developers, PMCs, architects and contractors hire SEED because we answer a question most consultants avoid: how do we know the building will actually perform? We verify it."
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <SectionLabel>The fundamental question</SectionLabel>
            <h2 className="h2 max-w-md">Why choose SEED Engineering?</h2>
          </div>
          <div className="lg:col-span-7 prose-editorial">
            <p>
              Our strength lies in delivering high-performance engineering solutions with technical excellence, responsive communication, and end-to-end project ownership. Every project is led by experienced engineers who stay involved from concept through commissioning, ensuring quality, accountability, and lasting client relationships.
            </p>
          </div>
        </div>
      </Section>

      <Section dark>
        <SectionLabel dark>Four pillars</SectionLabel>
        <h2 className="h2 text-white max-w-3xl mb-14">
          Engineering excellence. Coordination expertise. Sustainability leadership. Commissioning verification.
        </h2>
        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            {
              t: 'Engineering excellence',
              b: 'Every system selection is backed by calculations — not generic templates. Our principal engineers do not run business development. They run projects. On a recent 38-storey residential tower, the same engineer who drew the system also walked commissioning on every floor.',
            },
            {
              t: 'Coordination expertise',
              b: 'On a 14,000 m² office retrofit in DIFC, we coordinated all four MEP disciplines on a single BIM model. Variation cost from clashes came in at less than 1% of contract value — against an industry average of 4–6%. We reduce site conflicts before construction begins.',
            },
            {
              t: 'Sustainability leadership',
              b: 'We evaluate energy, water, carbon, operational cost and indoor environmental quality on every project. From LEED and Estidama to Net Zero studies and carbon assessments — sustainability is an engineering discipline, not a certification exercise.',
            },
            {
              t: 'Commissioning verification',
              b: 'Engineering responsibility does not end with drawings. Air balance, water balance, electrical loads — measured and recorded against design intent. Our handover packs are signed by our own lead, not a third-party commissioning agent.',
            },
            {
              t: 'Regional expertise',
              b: 'Deep understanding of local regulations, authority requirements and climate conditions across the Middle East, Africa and Asia. We navigate jurisdiction-specific approval processes so projects are not delayed by unfamiliar requirements.',
            },
            {
              t: 'Lifecycle thinking',
              b: 'Around 70% of our clients keep us on for service after handover — because the relationship was engineering-led from day one. We design for the building that will be operated, not just built.',
            },
          ].map((p, i) => (
            <StaggerItem key={i}>
              <div className="border-t border-white/10 pt-8">
                <p className="label text-gold mb-3">0{i + 1}</p>
                <h3 className="h3 text-white mb-4">{p.t}</h3>
                <p className="text-white/55 leading-relaxed text-sm">{p.b}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Section>
        <Reveal>
          <div className="max-w-3xl">
            <SectionLabel>The honest answer</SectionLabel>
            <h2 className="h2 mb-6">We are the firm to call when performance matters.</h2>
            <p className="prose-editorial">
              <span>
                If the brief is templated and the building is generic, a larger firm may deliver it
                more cheaply at comparable quality. If the building has to perform — hit energy
                targets, pass commissioning, earn lease premium and operate reliably for decades —
                that is the conversation we are built for.
              </span>
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button href="/contact" variant="dark">Request consultation</Button>
              <Button href="/projects" variant="outline-dark">Explore projects</Button>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section dark>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <SectionLabel dark>Planning a complex building project?</SectionLabel>
            <h2 className="h2 text-white max-w-md">Speak with our engineering team.</h2>
            <p className="text-white/55 leading-relaxed text-sm mt-4">MEP design, sustainability, BIM coordination and commissioning. The first enquiry is read by a senior engineer.</p>
          </div>
          <div className="lg:col-span-7"><InquiryForm variant="dark" /></div>
        </div>
      </Section>
    </>
  );
}
