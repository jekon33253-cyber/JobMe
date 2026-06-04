import React from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function LegalizationTimeline() {
  const { t } = useLanguage();

  const steps = [
    {
      number: "01",
      title: t('legalization.s1Title'),
      description: t('legalization.s1Desc')
    },
    {
      number: "02",
      title: t('legalization.s2Title'),
      description: t('legalization.s2Desc')
    },
    {
      number: "03",
      title: t('legalization.s3Title'),
      description: t('legalization.s3Desc')
    }
  ];

  return (
    <section className="bg-zinc-50 py-20 md:py-24 px-6 md:px-12 border-y border-zinc-100" id="legalization">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <span className="text-[#8CC63F] font-label-bold uppercase tracking-wider mb-2 block">
              {t('legalization.tag')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-800 mb-6">
              {t('legalization.title')}
            </h2>
            <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
              {t('legalization.desc')}
            </p>
          </div>

          <div className="relative">
            {/* Desktop Connecting Line */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-start relative group"
                >
                  <div className="mb-6 flex items-center gap-4">
                    <span className="text-5xl font-black bg-gradient-to-r from-[#8CC63F] to-[#00A99D] bg-clip-text text-transparent opacity-90 group-hover:scale-105 transition-transform duration-300">
                      {step.number}
                    </span>
                    {/* Decorative subtle dot for timeline effect on desktop */}
                    <div className="hidden lg:block absolute -top-12 left-10 w-4 h-4 rounded-full bg-white border-4 border-[#00A99D] shadow-sm"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-zinc-800 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-zinc-700 text-base leading-relaxed break-words">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
