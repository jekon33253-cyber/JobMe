import React from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function Upskilling() {
  const { t } = useLanguage();

  const progressionStages = [
    {
      stage: t('upskilling.stage1'),
      title: t('upskilling.s1Title'),
      description: t('upskilling.s1Desc')
    },
    {
      stage: t('upskilling.stage2'),
      title: t('upskilling.s2Title'),
      description: t('upskilling.s2Desc')
    },
    {
      stage: t('upskilling.stage3'),
      title: t('upskilling.s3Title'),
      description: t('upskilling.s3Desc')
    }
  ];

  return (
    <section className="bg-white py-20 md:py-24 px-6 md:px-12" id="upskilling">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Brag Metrics */}
            <div className="space-y-10">
              <div className="space-y-6">
                <span className="text-[#00A99D] font-label-bold uppercase tracking-wider mb-2 block">
                  {t('upskilling.tag')}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-800 leading-tight">
                  {t('upskilling.title')}
                </h2>
                <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
                  {t('upskilling.desc')}
                </p>
              </div>

              <div className="space-y-8 pt-4">
                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-8 h-8 rounded-full bg-[#A1DD22]/20 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[#A1DD22]"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-800 mb-2">
                      {t('upskilling.kandydatTitle')}
                    </h3>
                    <p className="text-zinc-600 leading-relaxed">
                      {t('upskilling.kandydatDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="mt-1 w-8 h-8 rounded-full bg-[#00B4B4]/20 flex items-center justify-center shrink-0">
                    <div className="w-3 h-3 rounded-full bg-[#00B4B4]"></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-zinc-800 mb-2">
                      {t('upskilling.biznesTitle')}
                    </h3>
                    <p className="text-zinc-600 leading-relaxed">
                      {t('upskilling.biznesDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Career Progression Ladder */}
            <div className="relative pl-4 sm:pl-8 lg:pl-12 border-l-2 border-zinc-100 space-y-8 py-4">
              {progressionStages.map((item, index) => (
                <div 
                  key={index}
                  className="relative bg-white p-6 md:p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-lg hover:border-[#00B4B4]/30 hover:bg-[#00B4B4]/[0.02] transition-all duration-300 transform hover:scale-[1.01] group"
                >
                  {/* Decorative bullet on the connecting line */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-[1.15rem] sm:-left-[2.15rem] lg:-left-[3.15rem] w-4 h-4 bg-white border-4 border-[#00A99D] rounded-full group-hover:scale-125 group-hover:border-[#A1DD22] transition-transform duration-300"></div>
                  
                  <span className="text-sm font-bold text-[#A1DD22] uppercase tracking-wide mb-2 block">
                    {item.stage}
                  </span>
                  <h4 className="text-xl font-bold text-zinc-800 mb-3">
                    {item.title}
                  </h4>
                  <p className="text-zinc-600 leading-relaxed text-sm md:text-base break-words">
                    {item.description}
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
