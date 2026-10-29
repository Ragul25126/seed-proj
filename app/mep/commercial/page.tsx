import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export const metadata = {
  title: 'Commercial MEP',
  description: 'MEP consultancy for commercial buildings — towers, offices, mixed-use developments in the UAE.',
  alternates: {
    canonical: '/mep/commercial',
  },
};

export default function Page() {
  return (
    <ServicePageTemplate
      division="mep"
      defaultService="Commercial MEP"
      eyebrow="MEP · Commercial"
      heroTitle="Your tenants notice when a building fights them. We engineer buildings that disappear."
      heroIntro="Commercial buildings are judged on dozens of small daily moments — how fast the lift arrives, how the air feels in the lobby, whether the floor plates stay quiet at peak load. We engineer the systems behind all of them."
      realMeaningTitle="Commercial MEP, written without the jargon."
      realMeaningParagraphs={[
        'A commercial building is a stack of systems that all have to work together: cooling, ventilation, power distribution, lifts, fire safety, water supply, drainage, lighting, low-voltage, and increasingly a layer of building intelligence on top. The way a tower in DIFC is judged by tenants comes down to whether those systems behave invisibly.',
        'The brief we usually receive is a floor plan, a programme, and a tenancy mix. The work we do is everything that turns that into a building a major bank, a law firm, or a tech anchor is willing to move five hundred staff into and renew their lease at the end of the term.',
        'We coordinate with the architect from concept stage, sit inside the contractor team during construction, and stay through tenant fit-out — because the systems we drew need to survive the first twenty fit-outs that follow handover.',
      ]}
      approach={[
        {
          title: 'Designed for tenancy mix, not just floor plate',
          body:
            'A trading floor and a partnership-style law office have different load profiles, different air change requirements, different acoustic tolerances. We engineer for the mix the building will actually be leased to.',
        },
        {
          title: 'Sized for the climate, not the spec',
          body:
            'The UAE peak day is not the textbook peak day. Our cooling loads, plant redundancy, and water reserves are sized for the worst week of August in this city — not the conditions a generic design assumes.',
        },
        {
          title: 'Designed to be operated',
          body:
            'A system that cannot be maintained is a system that fails. Plant rooms are laid out around the technician who has to service them, not just the engineer who has to draw them.',
        },
      ]}
    />
  );
}
