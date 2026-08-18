import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import RecruiterLayout from './RecruiterLayout';

export default function RecruiterJobs() {
  const { t, language } = useLanguage();
  const isUA = language === 'ua';
  const [selectedJob, setSelectedJob] = useState(null);

  const jobs = t('jobsPage.jobs') || [];

  const L = {
    title: isUA ? 'Актуальні вакансії' : 'Aktualne oferty pracy',
    subtitle: isUA ? 'Виберіть вакансію та подайте кандидата' : 'Wybierz ofertę i zgłoś kandydata',
    submitBtn: isUA ? 'Подати кандидата' : 'Zgłoś kandydata',
    salary: isUA ? 'Оплата' : 'Wynagrodzenie',
    location: isUA ? 'Локація' : 'Lokalizacja',
    shifts: isUA ? 'Зміни' : 'Zmiany',
    housing: isUA ? 'Житло' : 'Zakwaterowanie',
    tasks: isUA ? 'Обов\'язки' : 'Obowiązki',
    perks: isUA ? 'Бонуси' : 'Dodatki',
    contract: isUA ? 'Договір' : 'Umowa',
    back: isUA ? 'Назад до вакансій' : 'Wróć do ofert',
    count: isUA ? `${jobs.length} вакансій доступно` : `${jobs.length} ofert dostępnych`,
    noJobs: isUA ? 'Вакансій поки немає' : 'Brak ofert pracy',
  };

  if (selectedJob !== null && jobs[selectedJob]) {
    const job = jobs[selectedJob];
    return (
      <RecruiterLayout activePage="jobs">
        <button
          onClick={() => setSelectedJob(null)}
          className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm font-medium mb-6 transition"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          {L.back}
        </button>

        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-lg bg-[#00B4B4]/10 text-[#00B4B4] text-xs font-bold border border-[#00B4B4]/20">
                  {isUA ? 'Відкрита' : 'Otwarta'}
                </span>
              </div>
              <h1 className="text-2xl font-extrabold text-white">{job.jobTitle}</h1>
              <div className="flex items-center gap-1 mt-2 text-zinc-400 text-sm">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {job.location}
              </div>
            </div>
            <button
              onClick={() => window.location.href = `/recruiter/candidates/new?job=${encodeURIComponent(job.jobTitle)}&location=${encodeURIComponent(job.location)}`}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00B4B4] to-[#007A7A] text-white font-bold text-sm
                         shadow-lg shadow-[#00B4B4]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 shrink-0"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              {L.submitBtn}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Salary */}
            <InfoCard icon="payments" iconColor="text-[#8CC63F]" label={L.salary}>
              <p className="text-white font-bold">{job.salary}</p>
              {job.salarySub && <p className="text-zinc-400 text-xs mt-0.5">{job.salarySub}</p>}
            </InfoCard>

            {/* Contract */}
            <InfoCard icon="description" iconColor="text-blue-400" label={L.contract}>
              <p className="text-zinc-300 text-sm">{job.contract}</p>
            </InfoCard>

            {/* Shifts */}
            <InfoCard icon="schedule" iconColor="text-amber-400" label={L.shifts}>
              <p className="text-zinc-300 text-sm">{job.shifts}</p>
            </InfoCard>

            {/* Housing */}
            <InfoCard icon="home" iconColor="text-purple-400" label={L.housing}>
              <p className="text-zinc-300 text-sm">{job.housing}</p>
            </InfoCard>
          </div>

          <div className="space-y-4">
            {/* Tasks */}
            <InfoCard icon="task_alt" iconColor="text-[#00B4B4]" label={L.tasks}>
              <ul className="space-y-1.5">
                {(job.tasks || []).map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-zinc-300 text-sm">
                    <span className="text-[#00B4B4] mt-0.5 shrink-0">▸</span>
                    {task}
                  </li>
                ))}
              </ul>
            </InfoCard>

            {/* Perks */}
            <InfoCard icon="star" iconColor="text-yellow-400" label={L.perks}>
              <p className="text-zinc-300 text-sm">{job.perks}</p>
            </InfoCard>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout activePage="jobs">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">{L.title}</h1>
        <p className="text-zinc-500 text-sm mt-1">{L.count}</p>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <span className="material-symbols-outlined text-5xl text-zinc-700 mb-3">work_off</span>
          <p className="text-zinc-500">{L.noJobs}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jobs.map((job, i) => (
            <div
              key={i}
              className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-5 hover:border-[#00B4B4]/40 hover:bg-[#00B4B4]/5 transition-all duration-200 cursor-pointer group"
              onClick={() => setSelectedJob(i)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#00B4B4]/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[#00B4B4] text-xl">factory</span>
                </div>
                <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  {isUA ? 'Відкрита' : 'Otwarta'}
                </span>
              </div>

              <h3 className="text-white font-bold text-sm leading-tight mb-3 group-hover:text-[#00B4B4] transition-colors">
                {job.jobTitle}
              </h3>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {job.location}
                </div>
                <div className="flex items-center gap-1.5 text-[#8CC63F] text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">payments</span>
                  {job.salary}
                </div>
              </div>

              <button
                onClick={e => {
                  e.stopPropagation();
                  window.location.href = `/recruiter/candidates/new?job=${encodeURIComponent(job.jobTitle)}&location=${encodeURIComponent(job.location)}`;
                }}
                className="w-full py-2.5 rounded-xl bg-[#00B4B4]/10 text-[#00B4B4] text-xs font-bold border border-[#00B4B4]/20
                           hover:bg-[#00B4B4] hover:text-white hover:border-[#00B4B4] transition-all duration-200 flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">person_add</span>
                {L.submitBtn}
              </button>
            </div>
          ))}
        </div>
      )}
    </RecruiterLayout>
  );
}

function InfoCard({ icon, iconColor, label, children }) {
  return (
    <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className={`material-symbols-outlined text-lg ${iconColor}`}>{icon}</span>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">{label}</p>
      </div>
      {children}
    </div>
  );
}
