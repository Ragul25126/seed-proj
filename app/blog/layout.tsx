import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Engineering Insights & Media Coverage',
  description:
    'Read the latest engineering insights, project case studies, technical articles, and media coverage from SEED Engineering Consultants.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Engineering Insights & Media Coverage — SEED Engineering',
    description:
      'Read the latest engineering insights, project case studies, technical articles, and media coverage from SEED Engineering Consultants.',
    images: ['/seedlogo.png'],
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

