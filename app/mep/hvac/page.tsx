import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export const metadata = {
  title: 'HVAC Engineering',
  description: 'Specialist HVAC engineering, central chiller plant design and ventilation systems.',
  alternates: {
    canonical: '/mep/hvac',
  },
};

export default function Page() {
  return (
    <ServicePageTemplate
      division="mep"
      defaultService="HVAC Systems"
      eyebrow="MEP · HVAC"
      heroTitle="Your tenants are complaining about the temperature. Here is why that happens — and how we make sure it never does."
      heroIntro="HVAC in the UAE is not an HVAC problem. It is a thermal-envelope, occupancy-pattern, plant-redundancy and commissioning problem. We treat it as all four."
      realMeaningTitle="HVAC, in the climate it actually has to survive."
      realMeaningParagraphs={[
        'The reason most buildings in this region have an HVAC complaint log is not the equipment. It is the cooling load assumed at design stage, the lack of redundancy planned at procurement stage, and the commissioning that was rushed at handover stage. We fix all three.',
        'A chilled-water system in Dubai has to perform when ambient temperatures push 48°C. It has to operate when half the building is unoccupied for the summer. It has to recover quickly when a thousand people walk back into the lobby on a Sunday morning. The design assumptions matter.',
        'We design HVAC for the worst day, commission it for the most demanding floor, and hand it over with an air-balance report a tenant can read. The result: buildings where the thermostat is set once and not touched again.',
      ]}
      approach={[
        {
          title: 'Climate-true load modelling',
          body:
            'We model cooling loads against ten years of actual UAE climate data — not the conservative defaults baked into international design codes. Plant is sized for the real building, in the real climate.',
        },
        {
          title: 'Zoning the way the building is occupied',
          body:
            'A trading floor on the 14th floor and an executive suite on the 30th have different occupancy patterns. We zone the system around how the building is actually used, not how the floor plates look on a drawing.',
        },
        {
          title: 'Commissioning is the deliverable, not a step',
          body:
            'Air balance, water balance, controls validation, sensor calibration — all signed off by our own commissioning lead before the building opens. No commissioning, no handover.',
        },
      ]}
    />
  );
}
