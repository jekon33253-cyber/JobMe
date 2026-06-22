import React from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function ReferralProgram({ onReferClick }) {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] py-20 md:py-24 px-gutter relative overflow-hidden">
      {/* decorative bg elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00B4B4]/8 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <FadeIn>
          {/* header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 text-[#A1DD22] text-xs font-bold uppercase tracking-wide mb-4 border border-primary/30">
              <span className="w-2 h-2 rounded-full bg-[#A1DD22] animate-pulse" />
              {t('referralProgram.title')}
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {t('referralProgram.subtitle')}
            </h2>
            <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {t('referralProgram.intro')}
            </p>
          </div>

          {/* steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { num: '01', titleKey: 'referralProgram.step1Title', descKey: 'referralProgram.step1Desc', color: 'border-[#A1DD22]' },
              { num: '02', titleKey: 'referralProgram.step2Title', descKey: 'referralProgram.step2Desc', color: 'border-[#00B4B4]' },
              { num: '03', titleKey: 'referralProgram.step3Title', descKey: 'referralProgram.step3Desc', color: 'border-[#A1DD22]' },
            ].map(({ num, titleKey, descKey, color }) => (
              <div key={num}
                className={`bg-white/5 backdrop-blur-sm border-l-4 ${color} rounded-xl p-6
                           hover:bg-white/8 transition-all duration-300`}
              >
                <span className="text-[#A1DD22] text-3xl font-black opacity-40">{num}</span>
                <h3 className="text-white font-bold text-base mt-2 mb-1">{t(titleKey)}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={onReferClick}
              className="inline-flex items-center gap-2 bg-[#A1DD22] hover:bg-[#8ec71e] text-[#1a1a1a]
                         font-bold text-base px-8 py-4 rounded-2xl shadow-lg shadow-[#A1DD22]/20
                         hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span className="material-symbols-outlined">group_add</span>
              {t('referralProgram.btnRefer')}
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
