import Link from 'next/link';
import { cn } from '@/lib/utils';

type Variant = 'gold' | 'outline-light' | 'outline-dark' | 'dark';

const variants: Record<Variant, string> = {
  gold: 'bg-champagne text-navy hover:bg-white tracking-[0.18em] focus-visible:ring-offset-[#0b0f19]',
  'outline-light':
    'border border-white/40 text-white hover:bg-white hover:text-navy tracking-[0.18em] focus-visible:ring-offset-[#0b0f19]',
  'outline-dark':
    'border border-navy/40 text-navy hover:bg-navy hover:text-white tracking-[0.18em] focus-visible:ring-offset-white',
  dark: 'bg-navy text-white hover:bg-slate tracking-[0.18em] focus-visible:ring-offset-[#0b0f19]',
};

export function Button({
  href,
  children,
  variant = 'gold',
  className,
  type,
  onClick,
}: {
  href?: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  const base =
    'inline-flex items-center gap-2 px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2';
  const classes = cn(base, variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        <span aria-hidden>→</span>
      </Link>
    );
  }
  return (
    <button type={type ?? 'button'} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
