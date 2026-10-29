import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export const metadata = {
  title: 'Swimming Pool Water Treatment & Maintenance',
  description: 'Water chemistry, hydraulic filtration maintenance, and operational consulting for pools.',
  alternates: {
    canonical: '/pool/maintenance',
  },
};

export default function Page() {
  return (
    <ServicePageTemplate
      division="pool"
      defaultService="Pool Maintenance"
      eyebrow="Pool · Maintenance"
      heroTitle="A great pool is a maintained pool. The difference is visible from the first lane."
      heroIntro="Scheduled service, water chemistry, plant care and finish protection — for hospitality clients, private homeowners and architect-led residences who refuse to compromise on water quality."
      realMeaningTitle="The work nobody photographs, but everyone notices."
      realMeaningParagraphs={[
        'A pool that has been well-maintained reads instantly: the water is clear, the surface is still, the smell of chlorine is absent, the tile lines are crisp at the waterline. A pool that has been neglected reads instantly too — and no amount of cleaning hides it.',
        'Our maintenance teams are not generic technicians. They are trained in water chemistry, hydraulic balance, surface protection and equipment service. Each contract has a named lead engineer and a measurable performance standard — not just a scheduled visit count.',
        'For hospitality clients, our service includes pre-season recommissioning, peak-season daily checks, and shoulder-season equipment review. For private clients, our service is built around how the pool is actually used — not a generic monthly visit.',
      ]}
      approach={[
        {
          title: 'Chemistry held tight, year-round',
          body: 'Free chlorine, combined chlorine, pH, alkalinity, calcium hardness, cyanuric acid — all measured, dosed and logged against a stable target range. Not eyeballed.',
        },
        {
          title: 'Plant service to manufacturer cycle, on time',
          body: 'Pumps, filters, controllers, heaters and dosers serviced to schedule — and replaced before they fail, not after.',
        },
        {
          title: 'Finish protection from day one',
          body: 'Grout, coping, waterline tile and surrounding stone are inspected and maintained on a defined cycle. The kind of attention that keeps a five-year-old pool looking new.',
        },
      ]}
    />
  );
}
