import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export const metadata = {
  title: 'Swimming Pool Construction & Engineering',
  description: 'Structural and MEP engineering for commercial, resort, and residential swimming pools.',
  alternates: {
    canonical: '/pool/construction',
  },
};

export default function Page() {
  return (
    <ServicePageTemplate
      division="pool"
      defaultService="Pool Construction"
      eyebrow="Pool · Construction"
      heroTitle="A pool is not poured. It is engineered, then finished."
      heroIntro="From hydraulic concept to the last hand-laid mosaic tile — new-build pools for hotels, private residences, rooftops and wellness suites."
      realMeaningTitle="What goes into a pool you have not noticed before."
      realMeaningParagraphs={[
        'A pool people remember is a pool that performs at every level the eye cannot see. The hydraulic loop is balanced so the surface is glassy at any time of day. The filtration cycle is sized for full occupancy on the worst day. The water chemistry is held without any of the chlorine smell that gives most pools away.',
        'When we are appointed at concept stage, we coordinate with the architect on the geometry that matters — overflow grilles, scum lines, vanishing edges — before the structural drawings are frozen. When we are appointed at construction stage, we still recover most of what was lost.',
        'Every pool we build is commissioned by us, not by a sub-contractor. The first time the water is brought up to temperature and balanced is the first time we put our name on it.',
      ]}
      approach={[
        {
          title: 'Hydraulic-first design',
          body: 'Pumps, returns, skimmers and overflow geometry are set before tile choice. The result: a still water surface and even chemistry, regardless of occupancy.',
        },
        {
          title: 'Plant rooms designed to be operated',
          body: 'Filters, controllers and chemical dosers are arranged for the technician who has to service them, with full bypass capability for in-service maintenance.',
        },
        {
          title: 'Finish layer applied by our own crew',
          body: 'Tiling, coping and waterproofing are handled by a team that reports to us — not subcontracted out at the last stage. The result: edges and grout lines that hold up.',
        },
      ]}
    />
  );
}
