import React from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function StatsBanner() {
  const { t } = useLanguage();

  const stats = [
    {
      number: "+150",
      label: t('stats.stat1'),
      subLabel: t('stats.subStat1')
    },
    {
      number: "100%",
      label: t('stats.stat2'),
      subLabel: t('stats.subStat2')
    },
    {
      number: "0 PLN",
      label: t('stats.stat3'),
      subLabel: t('stats.subStat3')
    },
    {
      number: t('contact.cities.wroclaw'),
      label: t('stats.stat4'),
      subLabel: t('stats.subStat4')
    }
  ];

  return (
    <section className="bg-zinc-50 border-y border-zinc-100 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center sm:items-start text-center sm:text-left bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="text-4xl lg:text-5xl font-black mb-3 bg-gradient-to-r from-[#8CC63F] to-[#00A99D] bg-clip-text text-transparent">
                  {stat.number}
                </h3>
                <h4 className="text-xl font-bold text-zinc-800 mb-2">
                  {stat.label}
                </h4>
                <p className="text-sm font-medium text-zinc-600 leading-relaxed">
                  {stat.subLabel}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
