import React from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function Sectors() {
  const { t } = useLanguage();

  const sectors = [
    {
      title: t('sectors.s1Title'),
      description: t('sectors.s1Desc'),
      icon: "precision_manufacturing"
    },
    {
      title: t('sectors.s2Title'),
      description: t('sectors.s2Desc'),
      icon: "local_shipping"
    },
    {
      title: t('sectors.s3Title'),
      description: t('sectors.s3Desc'),
      icon: "support_agent"
    },
    {
      title: t('sectors.s4Title'),
      description: t('sectors.s4Desc'),
      icon: "computer"
    }
  ];

  return (
    <section className="bg-white py-20 md:py-24 px-6 md:px-12 relative overflow-hidden" id="sectors">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[#00A99D] font-label-bold uppercase tracking-wider mb-2 block">
              {t('sectors.tag')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-800 mb-6">
              {t('sectors.title')}
            </h2>
            <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
              {t('sectors.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {sectors.map((sector, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl border border-zinc-100 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col items-start"
              >
                <div className="w-14 h-14 rounded-xl bg-[#00B4B4]/10 flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[#00A99D] text-3xl">
                    {sector.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-zinc-800 mb-3">
                  {sector.title}
                </h3>
                <p className="text-zinc-600 text-base leading-relaxed">
                  {sector.description}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
