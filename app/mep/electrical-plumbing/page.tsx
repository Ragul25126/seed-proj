import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export const metadata = {
  title: 'Electrical & Plumbing Engineering',
  description: 'Complete electrical distribution, substations, lighting design, and public health engineering.',
  alternates: {
    canonical: '/mep/electrical-plumbing',
  },
};

export default function Page() {
  return (
    <ServicePageTemplate
      division="mep"
      defaultService="Electrical & Plumbing"
      eyebrow="MEP · Electrical & Plumbing"
      heroTitle="Two disciplines that share the same walls. They should be coordinated by the same team."
      heroIntro="The reason ceilings get re-opened, screeds get re-cut and risers get re-routed is that electrical and plumbing were drawn by people who never spoke to each other. Under our roof, they do."
      realMeaningTitle="Coordination is the deliverable."
      realMeaningParagraphs={[
        'On most projects, electrical and plumbing are subcontracted to different parties, drawn by different engineers, and discovered to be in conflict only at site. The cost of that conflict is borne by the developer, in the form of variations, delays, and rework. We absorb that conflict at the design stage.',
        'Our electrical and plumbing teams sit in the same room, coordinate on the same BIM model, and resolve clashes before a single conduit is laid. Risers are routed together. Wet walls and electrical walls are planned together. Inspection access is shared.',
        'The outcome: a building where the first-fix is right the first time, the second-fix matches the drawing, and the commissioning report matches the design intent — without four rounds of site instructions in between.',
      ]}
      approach={[
        {
          title: 'One BIM model. One coordination meeting.',
          body:
            'Electrical and plumbing are coordinated in a single model from the schematic stage. Site instructions are reduced to a fraction of what other consultants generate.',
        },
        {
          title: 'Designed for the actual load — not the worst-case spec',
          body:
            'Cable sizing, breaker selection, riser dimensions are calculated for the building\'s actual tenancy. We do not inflate panels and risers just to be safe — we engineer to the real load.',
        },
        {
          title: 'Accessible isolation, everywhere',
          body:
            'Every wet stack and every distribution board has an accessible isolation point that allows an apartment, an office or a floor to be serviced without taking the building down.',
        },
      ]}
    />
  );
}
