import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about SEED Engineering — an integrated MEP and building engineering consultancy established in 2005 with global headquarters in Dubai and offices across Singapore and India.',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About Us — SEED Engineering',
    description:
      'Learn about SEED Engineering — an integrated MEP and building engineering consultancy established in 2005 with global headquarters in Dubai and offices across Singapore and India.',
    images: ['/seedlogo.png'],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}

