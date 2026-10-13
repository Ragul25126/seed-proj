import { Reveal } from '@/components/ui/Reveal';

/**
 * Editorial dark page hero used on every inner page.
 * Pass `title` as a string OR a JSX node (use <em> for italic accent words).
 */
export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <section className="relative bg-[#050816] text-white pt-40 pb-24 md:pb-32 px-6 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[#050816]" />
      <div className="relative max-w-container mx-auto">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-12 h-px bg-champagne" />
            <span className="label text-champagne tracking-[0.35em]">{eyebrow}</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="text-white font-serif font-bold tracking-[-0.025em] leading-[1.02] text-[clamp(2.5rem,6vw,5.5rem)] max-w-5xl">
            {title}
          </h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.16}>
            <p className="mt-10 max-w-2xl text-lg text-white/65 leading-relaxed">{intro}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
