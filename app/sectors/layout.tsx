import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industry Sectors',
  description:
    'Explore SEED Engineering expertise across key sectors — luxury hospitality, residential developments, commercial towers, healthcare, retail, educational, and cultural projects.',
  alternates: {
    canonical: '/sectors',
  },
  openGraph: {
    title: 'Industry Sectors — SEED Engineering',
    description:
      'Explore SEED Engineering expertise across key sectors — luxury hospitality, residential developments, commercial towers, healthcare, retail, educational, and cultural projects.',
    images: ['/seedlogo.png'],
  },
};

export default function SectorsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

