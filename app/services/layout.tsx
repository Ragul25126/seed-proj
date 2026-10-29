import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Services',
  description:
    'Multidisciplinary engineering services including MEP design, site supervision, ELV/ICT & AV, security systems, sustainability consulting, acoustics, and swimming pool engineering.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Engineering Services — SEED Engineering',
    description:
      'Multidisciplinary engineering services including MEP design, site supervision, ELV/ICT & AV, security systems, sustainability consulting, acoustics, and swimming pool engineering.',
    images: ['/seedlogo.png'],
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

