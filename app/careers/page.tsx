import React from 'react';
import { getActiveVacanciesCached } from '@/lib/supabase/cached-queries';
import CareersClient from '@/components/careers/CareersClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Careers | SEED Engineering Consultants',
  description: 'Join SEED Engineering. Explore current job opportunities across engineering, corporate, and digital engineering disciplines in Dubai and India.',
};

export default async function CareersPage() {
  const vacancies = await getActiveVacanciesCached();

  return <CareersClient vacancies={vacancies} />;
}
