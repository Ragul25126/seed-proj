import { cn } from '@/lib/utils';

type Tone = 'white' | 'cream' | 'ink' | 'navy';

const TONE_CLASS: Record<Tone, string> = {
  white: 'bg-white text-navy',
  cream: 'bg-[#F8F6F1] text-navy',
  ink: 'bg-[#050816] text-white',
  navy: 'bg-navy text-white',
};

export function Section({
  children,
  className,
  tone = 'white',
  id,
  // legacy `dark` prop — true → ink, false → white
  dark,
}: {
  children: React.ReactNode;
  className?: string;
  tone?: Tone;
  id?: string;
  dark?: boolean;
}) {
  const effectiveTone: Tone = dark === true ? 'ink' : dark === false ? 'white' : tone;
  return (
    <section
      id={id}
      className={cn(
        'py-24 md:py-32 px-6',
        TONE_CLASS[effectiveTone],
        className,
      )}
    >
      <div className="max-w-container mx-auto w-full">{children}</div>
    </section>
  );
}

export function SectionLabel({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className="mb-6">
      <span className={cn('label tracking-[0.3em]', dark ? 'text-champagne' : 'text-navy/60')}>
        {children}
      </span>
    </div>
  );
}
