import { ServicePageTemplate } from '@/components/sections/ServicePageTemplate';

export const metadata = {
  title: 'Pool Renovation & Modernization',
  description: 'Engineering upgrades, filtration overhauls, and modernization for existing aquatic facilities.',
  alternates: {
    canonical: '/pool/renovation',
  },
};

export default function Page() {
  return (
    <ServicePageTemplate
      division="pool"
      defaultService="Pool Renovation"
      eyebrow="Pool · Renovation"
      heroTitle="Your pool was beautiful when it opened. We can make it beautiful again — and engineered better than it ever was."
      heroIntro="Re-engineering hotel pools, private pools and rooftop pools that have lost their performance, their finish, or both. Most projects begin with a survey and end with a pool the original architect would be proud of."
      realMeaningTitle="A renovation is mostly an honest survey."
      realMeaningParagraphs={[
        'A pool that has been in service for ten or fifteen years usually has three problems at once — a tired finish, a struggling plant room, and hydraulics that were never quite balanced in the first place. The temptation is to fix the visible problem and leave the rest. We do the opposite.',
        'Every renovation begins with a thorough survey: shell condition, waterproofing integrity, plant room performance, hydraulic balance, chemistry control, and architectural intent. The report you receive is honest about what is still good and what is past its life.',
        'We deliver renovations in phases that allow the asset to remain in operation — critical for hotel projects where closing a pool for a season is not an option. Plant is swapped, finishes refreshed, hydraulics re-engineered, and the pool is back in service to a standard above where it started.',
      ]}
      approach={[
        {
          title: 'Honest condition survey first',
          body: 'A renovation scope built on a fair assessment of what is failing, what is tired, and what can stay. No padded scope, no manufactured urgency.',
        },
        {
          title: 'Plant upgrade as the centrepiece',
          body: 'Most of the experience of a renovated pool comes from new plant — quieter pumps, better filtration, more accurate dosing — not from the visible finish.',
        },
        {
          title: 'Phased to keep the asset earning',
          body: 'For hospitality clients, we plan renovations around the hotel calendar — keeping pools open for guests where possible, and minimising closure when it is not.',
        },
      ]}
    />
  );
}
