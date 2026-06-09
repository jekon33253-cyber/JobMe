import React, { useState, useEffect, useCallback } from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

// ── small icon wrapper ──────────────────────────────────────────
function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

// ── compact job card shown in the grid ─────────────────────────
function JobCard({ job, index, onOpen, labels }) {
  const icons = ['precision_manufacturing', 'gas_meter', 'warehouse', 'engineering'];
  const iconName = icons[index % icons.length];

  return (
    <button
      onClick={() => onOpen(index)}
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
            Aktywna
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

// ── full-detail modal ──────────────────────────────────────────
function JobModal({ job, jobIndex, isOpen, onClose, onApply, labels }) {
  // close on Escape
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  if (!isOpen || !job) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={job.jobTitle}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal panel */}
      <div className="job-modal relative w-full max-w-3xl max-h-[90vh] overflow-y-auto
                      bg-white rounded-3xl shadow-2xl flex flex-col">
        {/* header gradient */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#3a3a3a] p-7 md:p-10 text-white relative overflow-hidden shrink-0">
          {/* decorative blobs */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-primary/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#00B4B4]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                               bg-primary/20 text-[#A1DD22] text-xs font-bold uppercase tracking-wide
                               border border-[#A1DD22]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A1DD22] animate-pulse" />
                Aktywna oferta
              </span>

              {/* close button */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center
                           transition-colors duration-200 shrink-0 cursor-pointer"
                aria-label="Zamknij"
              >
                <Icon name="close" className="text-white text-lg" />
              </button>
            </div>

            <h2 className="text-2xl md:text-3xl font-black leading-tight">{job.jobTitle}</h2>
          </div>
        </div>

        {/* body */}
        <div className="p-7 md:p-10 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* LEFT: salary + location */}
            <div className="space-y-6">
              {/* Salary card */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
                    <Icon name="payments" className="text-[#2D2D2D] text-lg" />
                  </div>
                  <h4 className="font-bold text-zinc-800">{labels.salaryLabel}</h4>
                </div>
                <p className="text-2xl md:text-3xl font-black text-[#5a8a00] leading-tight mb-1">
                  {job.salary}
                </p>
                {job.salarySub && (
                  <p className="text-xs text-zinc-500 leading-relaxed mb-2">{job.salarySub}</p>
                )}
                <p className="text-sm text-zinc-700 leading-relaxed">{job.contract}</p>
              </div>

              {/* Location + shifts */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Icon name="map" className="text-zinc-500 text-lg" />
                  <h4 className="font-bold text-zinc-800">{labels.locationLabel}</h4>
                </div>
                <ul className="space-y-2.5 pl-7">
                  <li className="flex items-start gap-2 text-sm text-zinc-600">
                    <Icon name="location_on" className="text-[#00B4B4] text-base shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{job.location}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-zinc-600">
                    <Icon name="schedule" className="text-[#00B4B4] text-base shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{job.shifts}</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-zinc-600">
                    <Icon name="home" className="text-[#00B4B4] text-base shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{job.housing}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* RIGHT: tasks + perks */}
            <div className="space-y-6">
              {/* Tasks */}
              <div>
                <h4 className="font-bold text-zinc-800 text-base mb-3 flex items-center gap-2">
                  <Icon name="task_alt" className="text-[#00B4B4] text-xl" />
                  {labels.tasksLabel}
                </h4>
                <ul className="space-y-2.5">
                  {Array.isArray(job.tasks) && job.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="text-sm text-zinc-700 leading-relaxed">{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Perks */}
              <div>
                <h4 className="font-bold text-zinc-800 text-base mb-3 flex items-center gap-2">
                  <Icon name="star" className="text-primary text-xl" />
                  {labels.perksLabel}
                </h4>
                <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                  {job.perks}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-center">
            <button
              onClick={() => { onClose(); onApply(job.jobTitle, jobIndex); }}
              className="bg-primary hover:bg-[#8ec71e] text-[#2D2D2D] font-bold text-base px-10 py-4
                         rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30
                         transition-all duration-300 hover:-translate-y-0.5
                         flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer"
            >
              {labels.btnApply}
              <Icon name="arrow_forward" className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── main widget ────────────────────────────────────────────────
export default function JobsWidget({ onApply }) {
  const { t } = useLanguage();
  const [openIdx, setOpenIdx] = useState(null);

  const jobs = t('jobsWidget.jobs') || [];

  const labels = {
    salaryLabel: t('jobsWidget.salaryLabel'),
    locationLabel: t('jobsWidget.locationLabel'),
    tasksLabel: t('jobsWidget.tasksLabel'),
    perksLabel: t('jobsWidget.perksLabel'),
    btnApply: t('jobsWidget.btnApply'),
    btnDetails: t('jobsWidget.btnDetails') || 'Details',
  };

  const handleApply = (jobTitle, jobIndex) => {
    if (window.gtag) window.gtag('event', 'click_find_job');
    if (window.fbq) window.fbq('trackCustom', 'ClickFindJob');
    // Always pass the Polish title for HR team
    const jobsPL = t('jobsWidget.jobs', { lng: 'pl' }) || [];
    const polishTitle = Array.isArray(jobsPL) && jobsPL[jobIndex]
      ? jobsPL[jobIndex].jobTitle
      : jobTitle;
    onApply(polishTitle);
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
              <JobCard
                key={idx}
                job={job}
                index={idx}
                onOpen={setOpenIdx}
                labels={labels}
              />
            ))}
          </div>
        </FadeIn>
      </div>

      {/* modal */}
      <JobModal
        job={openIdx !== null ? jobs[openIdx] : null}
        jobIndex={openIdx}
        isOpen={openIdx !== null}
        onClose={() => setOpenIdx(null)}
        onApply={handleApply}
        labels={labels}
      />
    </section>
  );
}
