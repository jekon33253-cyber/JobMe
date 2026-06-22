import React from 'react';
import FadeIn from './FadeIn';
import JobPostingSchema from './JobPostingSchema';
import { useLanguage } from '../context/LanguageContext';

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

// ── compact card shown on home page ────────────────────────────
function JobCard({ job, index, onNavigate, labels }) {
  const { t } = useLanguage();
  const icons = ['precision_manufacturing', 'gas_meter', 'icecream', 'warehouse', 'engineering'];
  const iconName = icons[index % icons.length];

  return (
    <button
      onClick={() => onNavigate(index, job.jobTitle)}
      aria-label={job.jobTitle}
      className="job-card group w-full text-left bg-white rounded-2xl border border-zinc-200 shadow-md
                 hover:shadow-2xl hover:border-primary/40 hover:-translate-y-1.5
                 transition-all duration-300 overflow-hidden cursor-pointer focus:outline-none
                 focus:ring-2 focus:ring-primary/50"
    >
      {/* top accent bar */}
      <div className="h-1 bg-gradient-to-r from-primary to-[#00B4B4] group-hover:h-1.5 transition-all duration-300" />

      <div className="p-6 md:p-7">
        {/* icon + badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center
                          group-hover:bg-primary/20 transition-colors duration-300">
            <Icon name={iconName} className="text-[#2D2D2D] text-2xl" />
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50
                           text-green-700 text-xs font-bold border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {t('jobsWidget.badgeActiveShort')}
          </span>
        </div>

        {/* title */}
        <h3 className="font-black text-[#2D2D2D] text-base md:text-lg leading-snug mb-3
                       group-hover:text-primary transition-colors duration-200">
          {job.jobTitle}
        </h3>

        {/* salary pill */}
        <div className="inline-block px-3 py-1 rounded-lg bg-primary/10 mb-4">
          <span className="text-[#5a8a00] font-extrabold text-sm md:text-base">{job.salary}</span>
        </div>

        {/* quick info rows */}
        <ul className="space-y-2 mb-5">
          <li className="flex items-start gap-2 text-sm text-zinc-600">
            <Icon name="location_on" className="text-[#00B4B4] text-base shrink-0 mt-0.5" />
            <span className="leading-snug">{job.location}</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-zinc-600">
            <Icon name="schedule" className="text-[#00B4B4] text-base shrink-0 mt-0.5" />
            <span className="leading-snug line-clamp-2">{job.shifts}</span>
          </li>
          <li className="flex items-start gap-2 text-sm text-zinc-600">
            <Icon name="home" className="text-[#00B4B4] text-base shrink-0 mt-0.5" />
            <span className="leading-snug line-clamp-1">{job.housing}</span>
          </li>
        </ul>

        {/* CTA hint */}
        <div className="flex items-center gap-1.5 text-sm font-bold text-primary/80
                        group-hover:text-primary transition-colors duration-200">
          <span>{labels.btnDetails}</span>
          <Icon name="arrow_forward" className="text-base group-hover:translate-x-1 transition-transform duration-200" />
        </div>
      </div>
    </button>
  );
}

// ── main widget ────────────────────────────────────────────────
export default function JobsWidget({ onApply, onNavigateToJobs }) {
  const { t } = useLanguage();

  const jobs = t('jobsWidget.jobs') || [];

  const labels = {
    btnDetails: t('jobsWidget.btnDetails') || 'Details',
    btnApply: t('jobsWidget.btnApply'),
    btnViewAll: t('jobsWidget.btnViewAll') || 'View all',
  };

  if (!Array.isArray(jobs) || jobs.length === 0) return null;

  return (
    <section className="bg-background-white py-20 md:py-24 px-gutter" id="oferty">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          {/* heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-4">
              {t('jobsWidget.title')}
            </h2>
            <p className="text-zinc-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              {t('jobsWidget.subtitle')}
            </p>
          </div>

          {/* cards grid */}
          <div className={`grid gap-6 ${jobs.length === 1 ? 'max-w-sm mx-auto' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {jobs.map((job, idx) => (
              <React.Fragment key={idx}>
                <JobPostingSchema job={job} />
                <JobCard
                  job={job}
                  index={idx}
                  onNavigate={(i, title) => onNavigateToJobs(i, title)}
                  labels={labels}
                />
              </React.Fragment>
            ))}
          </div>

          {/* "View all" link */}
          <div className="flex justify-center mt-10">
            <button
              onClick={() => onNavigateToJobs(null)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-zinc-200
                         text-zinc-700 font-bold text-sm hover:border-primary hover:text-primary
                         transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              {labels.btnViewAll}
              <Icon name="open_in_new" className="text-base" />
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
