import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export const metadata = {
  title: 'MEP Maintenance & Asset Optimization',
  description: 'Condition assessments, asset optimization, energy audits and MEP maintenance consultancy.',
  alternates: {
    canonical: '/mep/maintenance',
  },
};

export default function Page() {
  return (
    <ServicePageTemplate
      division="mep"
      defaultService="MEP Maintenance"
      eyebrow="MEP · Maintenance & Service"
      heroTitle="A building is judged not on the day it opens, but in year three. We engineer for year three."
      heroIntro="Scheduled maintenance, emergency response, system upgrades and energy retrofits — for buildings we built, and for buildings we did not."
      realMeaningTitle="Service contracts written by engineers, not by salespeople."
      realMeaningParagraphs={[
        'Most maintenance contracts in this region read like insurance policies — full of exclusions, optional add-ons, and rates that climb steeply once the contract is signed. Ours read like an engineering brief: what we will inspect, how often, against what tolerance, and what we will fix without going back to the building owner for approval.',
        'Our maintenance teams are the same people who commission new buildings. They know how the systems should behave, because they have seen them behave that way. They are not generic technicians chasing tickets — they are engineers triaging building performance.',
        'We take over buildings we did not design, and we are honest about what we find. Sometimes the problem is a setting. Sometimes it is a missing valve. Sometimes it is a system that needs to be rebuilt. The report comes first, the recommendation second, the upsell never.',
      ]}
      approach={[
        {
          title: 'Performance-based, not visit-based',
          body:
            'We measure success by building performance — temperature stability, water quality, energy use, outage minutes — not by how many sites we visited last month.',
        },
        {
          title: 'One team across design, build and operate',
          body:
            'The engineer who maintains your building can call the engineer who designed it. The institutional memory is in the studio, not in a folder somewhere.',
        },
        {
          title: 'Honest condition surveys',
          body:
            'When we take over a building, the first report is brutally honest about what is working, what is failing, and what is going to fail. No padding the scope.',
        },
      ]}
    />
  );
}
