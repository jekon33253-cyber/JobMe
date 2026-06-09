import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import FadeIn from './FadeIn';

// ─── config ────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '48000000000'; // замени на реальный номер
const TELEGRAM_USERNAME = 'jobme_hr';  // замени на реальный username

// ─── helpers ───────────────────────────────────────────────────
function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

// ─── FAQ accordion ─────────────────────────────────────────────
function FaqAccordion({ faqs, title }) {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold text-[#2D2D2D] mb-5 flex items-center gap-2">
        <Icon name="help_outline" className="text-[#00B4B4] text-2xl" />
        {title}
      </h3>
      <div className="space-y-3">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="border border-zinc-200 rounded-2xl overflow-hidden bg-white shadow-sm"
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer
                         hover:bg-zinc-50 transition-colors duration-200"
              aria-expanded={openIdx === i}
            >
              <span className="font-semibold text-[#2D2D2D] text-sm md:text-base pr-4">{item.q}</span>
              <Icon
                name={openIdx === i ? 'expand_less' : 'expand_more'}
                className="text-zinc-400 shrink-0 text-xl"
              />
            </button>
            {openIdx === i && (
              <div className="px-5 pb-5">
                <p className="text-sm md:text-base text-zinc-600 leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Quick contact buttons ──────────────────────────────────────
function QuickContactButtons({ jobTitle, labels }) {
  const waText = encodeURIComponent(`Hej! Jestem zainteresowany ofertą pracy: ${jobTitle}`);
  const tgText = encodeURIComponent(`Oferta: ${jobTitle}`);

  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <span className="text-sm font-semibold text-zinc-500 self-center">{labels.applyVia}:</span>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm
                   bg-[#25D366] hover:bg-[#1da851] text-white shadow-md
                   hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.111.546 4.09 1.5 5.816L0 24l6.34-1.488A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.027-1.387l-.36-.213-3.761.883.898-3.669-.234-.374A9.794 9.794 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/>
        </svg>
        {labels.whatsapp}
      </a>
      <a
        href={`https://t.me/${TELEGRAM_USERNAME}?start=${tgText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm
                   bg-[#0088cc] hover:bg-[#0077b3] text-white shadow-md
                   hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      >
        {/* Telegram SVG icon */}
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
        </svg>
        {labels.telegram}
      </a>
    </div>
  );
}

// ─── Thematic images per job index ────────────────────────────
const JOB_IMAGES = [
  // Job 0: parcel locker / electronics assembly
  'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=1200&q=80',
  // Job 1: industrial / metalwork / gas cylinders
  'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=1200&q=80',
  // Job 2: warehouse / logistics (fallback)
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
  // Job 3: engineering (fallback)
  'https://images.unsplash.com/photo-1565372195458-9de0b320ef04?auto=format&fit=crop&w=1200&q=80',
];

// ─── Single job card (expanded) ─────────────────────────────────
function JobCard({ job, index, labels, quickContactLabels, onApply, isHighlighted }) {
  const icons = ['precision_manufacturing', 'gas_meter', 'warehouse', 'engineering'];
  const iconName = icons[index % icons.length];
  const bgImage = JOB_IMAGES[index % JOB_IMAGES.length];

  return (
    <div
      id={`job-${index}`}
      className={`bg-white rounded-3xl border overflow-hidden shadow-lg transition-all duration-300
        ${isHighlighted ? 'border-primary shadow-primary/20 shadow-2xl ring-2 ring-primary/30' : 'border-zinc-200 hover:shadow-xl'}`}
    >
      {/* top accent */}
      <div className="h-1.5 bg-gradient-to-r from-primary to-[#00B4B4]" />

      {/* header with background image */}
      <div
        className="relative p-7 md:p-10 text-white overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '160px',
        }}
      >
        {/* dark gradient overlay — keeps text readable */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/65 to-[#1a3a1a]/70 pointer-events-none" />
        {/* subtle green tint strip at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
              <Icon name={iconName} className="text-primary text-xl" />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                             bg-primary/25 text-[#A1DD22] text-xs font-bold uppercase tracking-wide
                             border border-[#A1DD22]/40 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A1DD22] animate-pulse" />
              Aktywna oferta
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-black leading-tight">{job.jobTitle}</h2>
        </div>
      </div>

      {/* body */}
      <div className="p-7 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-6">
            {/* Salary */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-5 rounded-2xl border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="payments" className="text-[#2D2D2D] text-xl" />
                <h4 className="font-bold text-zinc-800">{labels.salaryLabel}</h4>
              </div>
              <p className="text-2xl font-black text-[#5a8a00] leading-tight mb-1">{job.salary}</p>
              {job.salarySub && (
                <p className="text-xs text-zinc-500 mb-2 leading-relaxed">{job.salarySub}</p>
              )}
              <p className="text-sm text-zinc-700 leading-relaxed">{job.contract}</p>
            </div>

            {/* Location */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Icon name="map" className="text-zinc-500 text-lg" />
                <h4 className="font-bold text-zinc-800">{labels.locationLabel}</h4>
              </div>
              <ul className="space-y-2.5 pl-6">
                {[
                  { icon: 'location_on', text: job.location },
                  { icon: 'schedule', text: job.shifts },
                  { icon: 'home', text: job.housing },
                ].map(({ icon, text }, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-600">
                    <Icon name={icon} className="text-[#00B4B4] text-base shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Tasks */}
            <div>
              <h4 className="font-bold text-zinc-800 mb-3 flex items-center gap-2">
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
              <h4 className="font-bold text-zinc-800 mb-3 flex items-center gap-2">
                <Icon name="star" className="text-primary text-xl" />
                {labels.perksLabel}
              </h4>
              <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                {job.perks}
              </p>
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
          <button
            onClick={() => onApply(job.jobTitle, index)}
            className="bg-primary hover:bg-[#8ec71e] text-[#2D2D2D] font-bold text-base px-8 py-4
                       rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30
                       transition-all duration-300 hover:-translate-y-0.5
                       flex items-center gap-3 cursor-pointer"
          >
            {labels.btnApply}
            <Icon name="arrow_forward" className="text-lg" />
          </button>

          <QuickContactButtons jobTitle={job.jobTitle} labels={quickContactLabels} />
        </div>
      </div>
    </div>
  );
}

// ─── Main Jobs Page ─────────────────────────────────────────────
export default function JobsPage({ onBack, onApply, highlightIdx = null }) {
  const { t } = useLanguage();

  const jobs = t('jobsWidget.jobs') || [];
  const faq = t('jobsPage.faq') || [];

  const labels = {
    salaryLabel: t('jobsWidget.salaryLabel'),
    locationLabel: t('jobsWidget.locationLabel'),
    tasksLabel: t('jobsWidget.tasksLabel'),
    perksLabel: t('jobsWidget.perksLabel'),
    btnApply: t('jobsWidget.btnApply'),
  };

  const quickContactLabels = {
    label: t('quickContact.label'),
    whatsapp: t('quickContact.whatsapp'),
    telegram: t('quickContact.telegram'),
    applyVia: t('quickContact.applyVia'),
  };

  // scroll to highlighted job on mount
  useEffect(() => {
    if (highlightIdx !== null) {
      setTimeout(() => {
        const el = document.getElementById(`job-${highlightIdx}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [highlightIdx]);

  const handleApply = (jobTitle, jobIndex) => {
    if (window.gtag) window.gtag('event', 'click_find_job');
    if (window.fbq) window.fbq('trackCustom', 'ClickFindJob');
    const jobsPL = t('jobsWidget.jobs', { lng: 'pl' }) || [];
    const polishTitle = Array.isArray(jobsPL) && jobsPL[jobIndex]
      ? jobsPL[jobIndex].jobTitle
      : jobTitle;
    onApply(polishTitle);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* page hero */}
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#3a3a3a] text-white pt-28 pb-14 px-gutter relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00B4B4]/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-medium
                       transition-colors duration-200 mb-6 cursor-pointer"
          >
            <Icon name="arrow_back" className="text-base" />
            {t('jobsPage.backBtn')}
          </button>
          <span className="inline-block px-3 py-1 bg-primary/20 text-[#A1DD22] rounded-full text-xs font-bold uppercase tracking-wide mb-4 border border-[#A1DD22]/30">
            {jobs.length} {jobs.length === 1 ? 'oferta' : 'oferty'}
          </span>
          <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
            {t('jobsPage.title')}
          </h1>
          <p className="text-zinc-300 text-base md:text-lg max-w-2xl leading-relaxed">
            {t('jobsPage.subtitle')}
          </p>
        </div>
      </div>

      {/* job cards */}
      <div className="max-w-4xl mx-auto px-gutter py-14 space-y-10">
        {Array.isArray(jobs) && jobs.map((job, idx) => (
          <FadeIn key={idx}>
            <JobCard
              job={job}
              index={idx}
              labels={labels}
              quickContactLabels={quickContactLabels}
              onApply={handleApply}
              isHighlighted={highlightIdx === idx}
            />
          </FadeIn>
        ))}

        {/* FAQ section */}
        {faq.length > 0 && (
          <FadeIn>
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-lg p-7 md:p-10">
              <FaqAccordion faqs={faq} title={t('jobsPage.faqTitle')} />
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
