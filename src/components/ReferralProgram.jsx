import React from 'react';
import { useNavigate } from 'react-router-dom';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function ReferralProgram() {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const isUA = language === 'ua';

  return (
    <section className="bg-gradient-to-br from-[#0e1114] via-[#14181d] to-[#0a0c0e] py-20 md:py-28 px-gutter relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#00B4B4]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-[#8CC63F]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <FadeIn>
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00B4B4]/15 text-[#00B4B4] text-xs font-extrabold uppercase tracking-wider mb-4 border border-[#00B4B4]/30 shadow-lg shadow-[#00B4B4]/10">
              <span className="w-2 h-2 rounded-full bg-[#00B4B4] animate-pulse" />
              {t('referralProgram.title')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 max-w-3xl mx-auto leading-tight">
              {t('referralProgram.subtitle')}
            </h2>
            <p className="text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              {t('referralProgram.intro')}
            </p>
          </div>

          {/* Recruiter Cabinet Preview & Features */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-14">
            {/* 3 Step Cards (left 7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  num: '01',
                  titleKey: 'referralProgram.step1Title',
                  descKey: 'referralProgram.step1Desc',
                  icon: 'work',
                  color: 'from-[#00B4B4]/20 to-[#00B4B4]/5 border-[#00B4B4]/40 text-[#00B4B4]',
                },
                {
                  num: '02',
                  titleKey: 'referralProgram.step2Title',
                  descKey: 'referralProgram.step2Desc',
                  icon: 'person_add',
                  color: 'from-[#8CC63F]/20 to-[#8CC63F]/5 border-[#8CC63F]/40 text-[#8CC63F]',
                },
                {
                  num: '03',
                  titleKey: 'referralProgram.step3Title',
                  descKey: 'referralProgram.step3Desc',
                  icon: 'payments',
                  color: 'from-[#00B4B4]/20 to-[#00B4B4]/5 border-[#00B4B4]/40 text-[#00B4B4]',
                },
              ].map(({ num, titleKey, descKey, icon, color }) => (
                <div
                  key={num}
                  className={`bg-gradient-to-r ${color} border backdrop-blur-xl rounded-2xl p-6 flex items-start gap-5
                             hover:scale-[1.01] transition-all duration-300 shadow-xl`}
                >
                  <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-2xl">{icon}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black tracking-widest opacity-60 uppercase">Etap {num}</span>
                    </div>
                    <h3 className="text-white font-extrabold text-lg mb-1">{t(titleKey)}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{t(descKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Recruiter Dashboard Mockup (right 5 cols) */}
            <div className="lg:col-span-5">
              <div className="bg-[#141414] border border-zinc-800/80 rounded-3xl p-6 shadow-2xl shadow-black/80 backdrop-blur-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00B4B4]/10 rounded-full blur-2xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-zinc-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00B4B4] to-[#007A7A] flex items-center justify-center text-white font-black text-lg shadow-md shadow-[#00B4B4]/20">
                      R
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">
                        {isUA ? 'Кабінет Рекрутера' : 'Panel Rekrutera'}
                      </p>
                      <p className="text-zinc-500 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        {isUA ? 'Онлайн • Прямий доступ' : 'Online • Dostęp 24/7'}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#00B4B4]/15 text-[#00B4B4] text-[10px] font-black uppercase border border-[#00B4B4]/30">
                    Pro
                  </span>
                </div>

                {/* Dashboard Mini Stats */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-[#1a1a1a] border border-zinc-800/60 rounded-xl p-3">
                    <p className="text-zinc-500 text-[10px] uppercase font-bold">
                      {isUA ? 'База вакансій' : 'Baza wakatów'}
                    </p>
                    <p className="text-white text-xl font-black mt-0.5">45+</p>
                  </div>
                  <div className="bg-[#1a1a1a] border border-zinc-800/60 rounded-xl p-3">
                    <p className="text-zinc-500 text-[10px] uppercase font-bold">
                      {isUA ? 'Прувізія / Кандидат' : 'Prowizja / Kandydat'}
                    </p>
                    <p className="text-[#8CC63F] text-xl font-black mt-0.5">до 1 500 PLN</p>
                  </div>
                </div>

                {/* Recent Candidates Mock Activity */}
                <div className="space-y-2 mb-6">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mb-2">
                    {isUA ? 'Останні кандидатів у панелі' : 'Ostatni kandydaci w panelu'}
                  </p>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-white font-medium">Jan K. — Magazynier</span>
                    </div>
                    <span className="text-emerald-400 font-bold">+1 000 PLN</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-zinc-300 font-medium">Oleh S. — Kierowca C+E</span>
                    </div>
                    <span className="text-amber-400 font-bold">{isUA ? 'Інтерв\'ю' : 'Wywiad'}</span>
                  </div>
                </div>

                {/* Card Button */}
                <button
                  onClick={() => navigate('/portal/login')}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#00B4B4] to-[#007A7A] hover:from-[#00c7c7] hover:to-[#008f8f]
                             text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#00B4B4]/25
                             hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">handshake</span>
                  <span>{t('referralProgram.btnRefer')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <button
              onClick={() => navigate('/portal/login')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00B4B4] to-[#007A7A] hover:from-[#00c7c7] hover:to-[#008f8f]
                         text-white font-black text-base px-10 py-4.5 rounded-2xl shadow-xl shadow-[#00B4B4]/20
                         hover:shadow-2xl hover:shadow-[#00B4B4]/30 hover:-translate-y-1 active:translate-y-0
                         transition-all duration-300 cursor-pointer border border-white/10"
            >
              <span className="material-symbols-outlined text-xl">login</span>
              <span>{t('referralProgram.btnRefer')}</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

