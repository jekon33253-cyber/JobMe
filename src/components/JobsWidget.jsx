import React, { useState } from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function JobsWidget({ onApply }) {
  const { t } = useLanguage();
  const [activeJobIdx, setActiveJobIdx] = useState(0);

  const jobs = t('jobsWidget.jobs') || [];
  const activeJob = Array.isArray(jobs) && jobs.length > activeJobIdx ? jobs[activeJobIdx] : null;

  return (
    <section className="bg-background-white py-20 md:py-24 px-gutter" id="oferty">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-4">
              {t('jobsWidget.title')}
            </h2>
            <p className="text-zinc-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
              {t('jobsWidget.subtitle')}
            </p>
          </div>

          {/* Job Selection Tabs */}
          {Array.isArray(jobs) && jobs.length > 1 && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {jobs.map((job, idx) => {
                // Get a clean short title (everything before the first parenthesis)
                const shortTitle = job.jobTitle ? job.jobTitle.split(' (')[0] : '';
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveJobIdx(idx)}
                    className={`px-6 py-3.5 rounded-2xl font-bold text-sm md:text-base border transition-all duration-300 shadow-md cursor-pointer ${
                      activeJobIdx === idx
                        ? 'bg-[#2D2D2D] text-white border-zinc-800 scale-[1.02]'
                        : 'bg-white text-zinc-600 border-zinc-200 hover:text-zinc-800 hover:border-zinc-300'
                    }`}
                  >
                    {shortTitle}
                  </button>
                );
              })}
            </div>
          )}

          {activeJob && (
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              {/* Header / Title Banner */}
              <div className="bg-gradient-to-r from-[#2D2D2D] to-zinc-800 p-8 md:p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 mix-blend-screen pointer-events-none"></div>
                
                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-primary/20 text-[#A1DD22] rounded-full text-xs font-bold uppercase tracking-wide mb-4 border border-[#A1DD22]/30">
                    Featured / Polecane
                  </span>
                  <h3 className="text-2xl md:text-4xl font-black leading-tight mb-4">
                    {activeJob.jobTitle}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 md:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  
                  {/* Left Column: Key Details */}
                  <div className="space-y-8">
                    {/* Wynagrodzenie i Umowa */}
                    <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-100">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#A1DD22]/20 flex items-center justify-center text-[#2D2D2D]">
                          <span className="material-symbols-outlined font-medium">payments</span>
                        </div>
                        <h4 className="font-bold text-zinc-800 text-lg">{t('jobsWidget.salaryLabel')}</h4>
                      </div>
                      <p className="text-2xl md:text-3xl font-black text-[#8CC63F] mb-1 leading-tight">
                        {activeJob.salary}
                      </p>
                      {activeJob.salarySub && (
                        <p className="text-sm text-zinc-500 font-medium mb-3 leading-relaxed">
                          {activeJob.salarySub}
                        </p>
                      )}
                      <p className="text-sm text-zinc-700 leading-relaxed font-medium">
                        {activeJob.contract}
                      </p>
                    </div>

                    {/* Grafik i Lokalizacja */}
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-600">
                          <span className="material-symbols-outlined text-sm font-medium">map</span>
                        </div>
                        <h4 className="font-bold text-zinc-800">{t('jobsWidget.locationLabel')}</h4>
                      </div>
                      <ul className="space-y-3 text-sm text-zinc-600 pl-11">
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[#00B4B4] text-base mt-0.5">location_on</span>
                          <span>{activeJob.location}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[#00B4B4] text-base mt-0.5">schedule</span>
                          <span className="break-words leading-relaxed">{activeJob.shifts}</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="material-symbols-outlined text-[#00B4B4] text-base mt-0.5">home</span>
                          <span className="break-words leading-relaxed">{activeJob.housing}</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Column: Obowiązki & Oferujemy */}
                  <div className="space-y-8">
                    
                    {/* Obowiązki */}
                    <div>
                      <h4 className="font-bold text-zinc-800 text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#00B4B4]">task_alt</span>
                        {t('jobsWidget.tasksLabel')}
                      </h4>
                      <ul className="space-y-3">
                        {Array.isArray(activeJob.tasks) && activeJob.tasks.map((task, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00B4B4] mt-2 shrink-0"></span>
                            <span className="text-sm text-zinc-700 leading-relaxed">{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Co oferujemy */}
                    <div>
                      <h4 className="font-bold text-zinc-800 text-lg mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#A1DD22]">star</span>
                        {t('jobsWidget.perksLabel')}
                      </h4>
                      <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                        {activeJob.perks}
                      </p>
                    </div>
                  </div>

                </div>

                {/* Call to Action */}
                <div className="mt-10 pt-8 border-t border-zinc-100 flex justify-center">
                  <button
                    onClick={() => {
                      if (window.gtag) window.gtag('event', 'click_find_job');
                      if (window.fbq) window.fbq('trackCustom', 'ClickFindJob');
                      // Pre-fill form with the Polish title as reference for HR (always pre-fill with Polish for HR team)
                      const jobsPL = t('jobsWidget.jobs', { lng: 'pl' }) || [];
                      const polishTitle = Array.isArray(jobsPL) && jobsPL[activeJobIdx] 
                        ? jobsPL[activeJobIdx].jobTitle 
                        : activeJob.jobTitle;
                      onApply(polishTitle);
                    }}
                    className="bg-primary hover:bg-[#8ec71e] text-[#2D2D2D] font-bold text-lg px-12 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto cursor-pointer"
                  >
                    {t('jobsWidget.btnApply')}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </div>

              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
