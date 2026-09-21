import React, { useState, useMemo } from 'react';
import FadeIn from './FadeIn';
import JobPostingSchema from './JobPostingSchema';
import { useLanguage } from '../context/LanguageContext';
import { getVacancies } from '../lib/vacancies';
import config from '../config';

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

// ── High-density Gremi Personal-inspired Card ───────────────────
function JobCard({ job, index, onNavigate, onApply, onOpenSmartLead, onViewDetails, labels }) {
  const { currentLanguage } = useLanguage();
  const icons = ['precision_manufacturing', 'gas_meter', 'icecream', 'warehouse', 'engineering'];
  const iconName = icons[index % icons.length];
  const isFeatured = index === 0;

  // Telegram deep link with job title prefilled
  const tgUrl = `https://t.me/${config.telegramUsername}?text=${encodeURIComponent(
    `Cześć! Chcę aplikować na ofertę: ${job.jobTitle}`
  )}`;

  // Monthly calculated estimate (from vacancy object or realistic fallback)
  const monthlySalaryEstimate = job.salaryMonthlyEstMin && job.salaryMonthlyEstMax
    ? `od ~${job.salaryMonthlyEstMin.toLocaleString()} do ${job.salaryMonthlyEstMax.toLocaleString()} zł`
    : 'od ~4 200 do 6 000 zł';

  const handleOpenDetails = () => {
    if (onViewDetails) {
      onViewDetails(job);
    } else {
      onNavigate(index, job.jobTitle);
    }
  };

  const isHousingFree = job.housingType === 'free' || job.housingPrice === 0;

  return (
    <div
      className="job-card group w-full text-left bg-white rounded-3xl border border-zinc-200/90 shadow-md
                 hover:shadow-2xl hover:border-primary/50 transition-all duration-300 overflow-hidden
                 flex flex-col justify-between focus-within:ring-2 focus-within:ring-primary/50 relative"
    >
      {/* Top accent gradient */}
      <div className={`h-1.5 bg-gradient-to-r from-[#8CC63F] via-[#00B4B4] to-[#0088cc] transition-all duration-300 ${
        isFeatured ? 'h-2.5' : 'group-hover:h-2'
      }`} />

      <div className="p-6 md:p-7 flex-1 flex flex-col">
        {/* Header badges row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Icon name={iconName} className="text-[#2D2D2D] text-2xl" />
            </div>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black border border-red-200 animate-pulse">
                <span className="text-sm">🔥</span>
                {currentLanguage === 'ua' ? 'Гаряча вакансія' : 'Gorąca oferta'}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {currentLanguage === 'ua' ? 'Активна' : 'Aktywna'}
          </span>
        </div>

        {/* Job Title */}
        <h3 
          onClick={handleOpenDetails}
          className="font-black text-[#2D2D2D] text-lg md:text-xl leading-snug mb-3 group-hover:text-primary transition-colors cursor-pointer"
        >
          {job.jobTitle}
        </h3>

        {/* Salary block (Monthly highlight + hourly breakdown) */}
        <div className="mb-5 p-3.5 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl md:text-2xl font-black text-[#2D2D2D] tracking-tight">
              {monthlySalaryEstimate}
            </span>
            <span className="text-[11px] font-black text-[#5a8a00] uppercase tracking-wider bg-green-100/70 px-2 py-0.5 rounded-md">
              Netto (szacunek)
            </span>
          </div>
          <p className="text-xs font-bold text-zinc-500 mt-1">
            {job.salary} {job.salarySub ? `• ${job.salarySub}` : ''}
          </p>
        </div>

        {/* Key Specs Grid */}
        <div className="space-y-2.5 mb-6 text-sm text-zinc-600">
          <div className="flex items-start gap-2.5">
            <Icon name="location_on" className="text-[#00B4B4] text-lg shrink-0 mt-0.5" />
            <span className="leading-snug font-medium">{job.location}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Icon name="schedule" className="text-[#00B4B4] text-lg shrink-0 mt-0.5" />
            <span className="leading-snug font-medium line-clamp-2">{job.shifts}</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Icon name="home" className="text-[#00B4B4] text-lg shrink-0 mt-0.5" />
            <span className="leading-snug font-medium line-clamp-1">
              {isHousingFree
                ? (currentLanguage === 'ua' ? 'Безкоштовне житло' : 'Darmowe zakwaterowanie')
                : job.housingPrice
                ? `${job.housingPrice} zł / mies. (potrącane)`
                : job.housing}
            </span>
          </div>
        </div>

        {/* ── Action Buttons Row (Telegram First) ── */}
        <div className="mt-auto pt-4 border-t border-zinc-100 flex flex-col sm:flex-row gap-2.5">
          {/* Priority 1: Telegram Direct Apply */}
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 bg-[#0088cc] hover:bg-[#0077b3] text-white font-black text-xs md:text-sm py-3 px-4 rounded-xl shadow-md shadow-[#0088cc]/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
            </svg>
            <span>{currentLanguage === 'ua' ? 'Telegram відгук' : 'Aplikuj w Telegramie'}</span>
          </a>

          {/* Priority 2: Smart Lead Modal */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onOpenSmartLead) {
                onOpenSmartLead(job);
              } else {
                onApply(job.jobTitle);
              }
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#8CC63F] hover:bg-[#7ab335] text-[#2D2D2D] font-black text-xs md:text-sm py-3 px-4 rounded-xl shadow-md shadow-primary/20 hover:shadow-lg transition-all cursor-pointer"
          >
            <Icon name="bolt" className="text-base" />
            <span>{currentLanguage === 'ua' ? 'Швидка заявка' : 'Szybka aplikacja'}</span>
          </button>

          {/* Details */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDetails();
            }}
            className="flex items-center justify-center py-3 px-3 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50 font-bold text-xs transition-colors cursor-pointer"
            aria-label={labels.btnDetails}
          >
            <Icon name="visibility" className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Widget with Filter Pills ──────────────────────────────
export default function JobsWidget({ onApply, onNavigateToJobs, onOpenSmartLead, onViewDetails }) {
  const { t, currentLanguage } = useLanguage();
  
  // Use repository as source of truth
  const jobs = useMemo(() => {
    const repoJobs = getVacancies(currentLanguage);
    if (repoJobs && repoJobs.length > 0) return repoJobs;
    return t('jobsWidget.jobs') || [];
  }, [currentLanguage, t]);

  const [activeFilter, setActiveFilter] = useState('all');

  const filterPills = [
    { id: 'all', label: currentLanguage === 'ua' ? 'Всі пропозиції' : 'Wszystkie oferty' },
    { id: 'hot', label: currentLanguage === 'ua' ? '🔥 Гарячі вакансії' : '🔥 Gorące oferty' },
    { id: 'housing', label: currentLanguage === 'ua' ? '🏠 Безкоштовне житло' : '🏠 Z darmowym mieszkaniem' },
    { id: 'couples', label: currentLanguage === 'ua' ? '👫 Для пар' : '👫 Dla par' },
    { id: 'wroclaw', label: '📍 Dolny Śląsk' },
  ];

  const filteredJobs = useMemo(() => {
    if (!Array.isArray(jobs)) return [];
    if (activeFilter === 'all') return jobs;
    if (activeFilter === 'hot') return jobs.filter((_, idx) => idx === 0);
    if (activeFilter === 'housing') return jobs.filter((j) => j.housingType === 'free' || (j.housing || '').toLowerCase().includes('darmowe'));
    if (activeFilter === 'couples') return jobs.filter((j) => j.couplesWelcome || (j.housing || '').toLowerCase().includes('pokoje'));
    if (activeFilter === 'wroclaw') return jobs.filter((j) => (j.voivodeship || '').toLowerCase().includes('dolny') || (j.location || '').toLowerCase().includes('dolny') || (j.location || '').toLowerCase().includes('świebodzice'));
    return jobs;
  }, [jobs, activeFilter]);

  const labels = {
    btnDetails: t('jobsWidget.btnDetails') || 'Szczegóły',
    btnApply: t('jobsWidget.btnApply'),
    btnViewAll: t('jobsWidget.btnViewAll') || 'Zobacz wszystkie oferty',
  };

  if (!Array.isArray(jobs) || jobs.length === 0) return null;

  return (
    <section className="bg-background-white py-20 md:py-24 px-gutter" id="oferty">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          {/* Section Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-[#5a8a00] font-black text-xs uppercase tracking-wider mb-3 border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse" />
              {currentLanguage === 'ua' ? 'Офіційне працевлаштування' : 'Legalna praca w Polsce'}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-[#2D2D2D] mb-4 tracking-tight">
              {t('jobsWidget.title')}
            </h2>
            <p className="text-zinc-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {t('jobsWidget.subtitle')}
            </p>
          </div>

          {/* Category / Filter Pills */}
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {filterPills.map((pill) => (
              <button
                key={pill.id}
                onClick={() => setActiveFilter(pill.id)}
                className={`px-4 py-2.5 rounded-full font-extrabold text-xs md:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer border ${
                  activeFilter === pill.id
                    ? 'bg-[#2D2D2D] text-white border-[#2D2D2D] shadow-md'
                    : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, idx) => (
              <React.Fragment key={job.id || idx}>
                <JobPostingSchema job={job} />
                <JobCard
                  job={job}
                  index={idx}
                  onNavigate={(i, title) => onNavigateToJobs(i, title)}
                  onApply={onApply}
                  onOpenSmartLead={onOpenSmartLead}
                  onViewDetails={onViewDetails}
                  labels={labels}
                />
              </React.Fragment>
            ))}
          </div>

          {/* Bottom Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            <button
              onClick={() => onNavigateToJobs(null)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border-2 border-zinc-300
                         text-zinc-800 font-black text-sm hover:border-primary hover:text-primary
                         transition-all duration-300 hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              {labels.btnViewAll}
              <Icon name="arrow_forward" className="text-base" />
            </button>

            {onOpenSmartLead && (
              <button
                onClick={() => onOpenSmartLead(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#8CC63F] hover:bg-[#7ab335]
                           text-[#2D2D2D] font-black text-sm shadow-md shadow-primary/20 hover:shadow-lg
                           transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <Icon name="bolt" className="text-lg" />
                {currentLanguage === 'ua' ? 'Підібрати вакансію за 30 сек' : 'Dobierz ofertę w 30 sek'}
              </button>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
