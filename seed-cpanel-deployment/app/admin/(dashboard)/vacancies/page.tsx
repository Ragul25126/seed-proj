import React from 'react';
import { getAllVacanciesCached } from '../../../../lib/supabase/cached-queries';
import VacanciesClient from './VacanciesClient';

export const metadata = {
  title: 'Careers & Vacancies | SEED Admin Dashboard',
  description: 'Manage job opportunities and vacancies at SEED Engineering.',
};

export default async function VacanciesAdminPage() {
  const vacancies = await getAllVacanciesCached();

  return (
    <div className="space-y-6">
      <VacanciesClient initialVacancies={vacancies} />
    </div>
  );
}
