import React from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

// ── desktop-only dashboard widget ──────────────────────────────
function DashboardWidget({ t }) {
  const steps = [
    { label: t('userPortal.step1'), date: t('userPortal.step1Date'), done: true },
    { label: t('userPortal.step2'), date: t('userPortal.step2Date'), done: true },
    { label: t('userPortal.step3'), status: t('userPortal.step3Status'), active: true },
  ];

  return (
    <div className="bg-[#1a1a1a] rounded-2xl border border-zinc-700/50 p-6 shadow-xl">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse" />
        <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">Live Preview</span>
      </div>

      {/* pipeline */}
      <div className="space-y-3">
        {steps.map((s, i) => (
          <div key={i} className="relative">
            {/* connecting line */}
            {i < steps.length - 1 && (
              <div className={`absolute left-3 top-9 bottom-0 w-0.5 ${
                s.done ? 'bg-[#8CC63F]' : 'bg-zinc-700'
              }`} />
            )}

            <div className="flex items-start gap-3">
              {/* status dot */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                s.done ? 'bg-[#8CC63F]' : s.active ? 'bg-[#8CC63F]/20 border-2 border-[#8CC63F]' : 'bg-zinc-700'
              }`}>
                {s.done ? (
                  <Icon name="check" className="text-white text-sm" />
                ) : s.active ? (
                  <div className="w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-zinc-500" />
                )}
              </div>

              {/* content */}
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-bold ${s.done ? 'text-zinc-300' : s.active ? 'text-white' : 'text-zinc-600'}`}>
                  {s.label}
                </p>
                {s.date && (
                  <p className="text-xs text-zinc-500 mt-0.5">{s.date}</p>
                )}
                {s.status && (
                  <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full
                                   bg-[#8CC63F]/15 text-[#A1DD22] text-xs font-bold border border-[#8CC63F]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A1DD22] animate-pulse" />
                    {s.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* mini stats */}
      <div className="mt-5 pt-4 border-t border-zinc-800 grid grid-cols-2 gap-3">
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <p className="text-[#A1DD22] text-lg font-black">2/3</p>
          <p className="text-zinc-500 text-xs">Etapy ukończone</p>
        </div>
        <div className="bg-white/5 rounded-lg p-3 text-center">
          <p className="text-white text-lg font-black">100%</p>
          <p className="text-zinc-500 text-xs">Dokumentów OK</p>
        </div>
      </div>
    </div>
  );
}

// ── main component ─────────────────────────────────────────────
export default function UserPortalTeaser() {
  const { t } = useLanguage();

  const features = [
    { icon: 'security', titleKey: 'userPortal.feature1Title', descKey: 'userPortal.feature1Desc' },
    { icon: 'touch_app', titleKey: 'userPortal.feature2Title', descKey: 'userPortal.feature2Desc' },
    { icon: 'notifications_active', titleKey: 'userPortal.feature3Title', descKey: 'userPortal.feature3Desc' },
  ];

  return (
    <section className="bg-background-white py-20 md:py-24 px-gutter" id="portal">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          {/* header */}
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00B4B4]/10 text-[#00B4B4] text-xs font-bold uppercase tracking-wide mb-4 border border-[#00B4B4]/20">
              <span className="w-2 h-2 rounded-full bg-[#00B4B4] animate-pulse" />
              Coming Soon
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-3">
              {t('userPortal.title')}
            </h2>
            <p className="text-[#00B4B4] font-bold text-lg">
              {t('userPortal.subtitle')}
            </p>
          </div>

          {/* 2-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* LEFT: features */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-3">{t('userPortal.leftTitle')}</h3>
                <p className="text-zinc-600 leading-relaxed text-sm md:text-base">{t('userPortal.leftDesc')}</p>
              </div>

              <div className="space-y-5">
                {features.map((f, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-[#00B4B4]/10 flex items-center justify-center shrink-0">
                      <Icon name={f.icon} className="text-[#00B4B4] text-xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2D2D2D] text-sm mb-0.5">{t(f.titleKey)}</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">{t(f.descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: dashboard widget */}
            <DashboardWidget t={t} />
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
