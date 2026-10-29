import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export const metadata = {
  title: 'Residential MEP',
  description: 'MEP engineering consultancy for luxury residential developments and high-rise apartments.',
  alternates: {
    canonical: '/mep/residential',
  },
};

export default function Page() {
  return (
    <ServicePageTemplate
      division="mep"
      defaultService="Residential MEP"
      eyebrow="MEP · Residential"
      heroTitle="A home is where MEP is felt the most — and forgiven the least."
      heroIntro="From a private villa on the Palm to a thirty-storey tower in Downtown — residential systems are judged not on paper, but in the bedroom at 3am."
      realMeaningTitle="Residential MEP is hospitality engineering in disguise."
      realMeaningParagraphs={[
        'The bar for residential engineering in the UAE is moving fast. Owners and tenants compare their apartment to the last hotel they stayed in, the last serviced residence they rented, the smart home they saw at a friend\'s place. The systems we install have to keep up with that bar.',
        'A residential project — whether a single home or a tower with three hundred units — is a study in quiet. Quiet plumbing risers. Quiet AC. Quiet exhaust. Lighting that responds without being asked. Power that does not blink when the kettle and the oven run at the same time.',
        'We engineer residential MEP the way a hotelier engineers a guestroom: assuming the worst possible day, designing around the most demanding occupant, and finishing it in a way that is invisible to everyone else.',
      ]}
      approach={[
        {
          title: 'Acoustic-first plumbing and ductwork',
          body:
            'Pipe routing, riser locations and duct paths are chosen for silence first, layout convenience second. Residents do not hear neighbours, they do not hear plant, they hear what they want to hear.',
        },
        {
          title: 'Per-unit smart-ready infrastructure',
          body:
            'Every unit is wired and zoned for the smart-home layer to be added later — lighting scenes, climate scheduling, integrated AV — without ripping into walls.',
        },
        {
          title: 'Designed for FM, not just for handover',
          body:
            'Risers accessible from common areas. Valves and isolators that allow a single apartment to be serviced without dropping a stack. The kind of details that turn a building from "new" into "five years in, still feels new."',
        },
      ]}
    />
  );
}
