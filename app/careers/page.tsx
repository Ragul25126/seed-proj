import React from 'react';
import { getActiveVacanciesCached } from '@/lib/supabase/cached-queries';
import CareersClient from '@/components/careers/CareersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Careers & Opportunities',
  description:
    'Join SEED Engineering. Explore current job opportunities across engineering, corporate, and digital engineering disciplines in Dubai and India.',
  alternates: {
    canonical: '/careers',
  },
  openGraph: {
    title: 'Careers & Opportunities — SEED Engineering',
    description:
      'Join SEED Engineering. Explore current job opportunities across engineering, corporate, and digital engineering disciplines in Dubai and India.',
    images: ['/seedlogo.png'],
  },
};

export default async function CareersPage() {
  const vacancies = await getActiveVacanciesCached();

  return <CareersClient vacancies={vacancies} />;
}
