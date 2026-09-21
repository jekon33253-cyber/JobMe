import React from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';
import config from '../config';

export default function Hero({ onCtaClick, onOpenSmartLead }) {
  const { t, currentLanguage } = useLanguage();
  const tgUrl = `https://t.me/${config.telegramUsername}`;

  return (
    <section 
      className="relative min-h-[90vh] flex items-center bg-cover bg-center bg-no-repeat py-24 md:py-32 px-gutter" 
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2000')" }}
    >
      {/* Exquisite dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/80 to-zinc-950/40 pointer-events-none"></div>
      
      {/* Tech grid pattern for advanced ecosystem feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Typography & CTAs */}
        <div className="space-y-8 max-w-3xl text-left">
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-label-bold text-sm mb-4 border border-primary/30 shadow-md backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {t('hero.tag')}
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h1 className="font-black text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight">
              {t('hero.title1')}{' '}
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block pb-2">
                {t('hero.title2')}
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-lg md:text-xl font-medium text-zinc-300 leading-relaxed max-w-2xl">
              {t('hero.subtitle')}
            </p>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 pt-4 justify-start">
              {/* Telegram Primary Button */}
              <a 
                href={tgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#0088cc] hover:bg-[#0077b3] text-white font-black text-base px-8 py-4 rounded-xl shadow-lg shadow-[#0088cc]/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2.5 group w-full sm:w-auto cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current shrink-0" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
                </svg>
                <span>{currentLanguage === 'ua' ? 'Вакансії в Telegram' : 'Oferty w Telegramie'}</span>
              </a>

              {/* Smart Match 30s Button */}
              {onOpenSmartLead ? (
                <button 
                  onClick={() => onOpenSmartLead(null)}
                  className="bg-primary hover:bg-[#8ec71e] text-[#2D2D2D] font-black text-base px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group w-full sm:w-auto cursor-pointer"
                >
                  <span className="material-symbols-outlined">bolt</span>
                  <span>{currentLanguage === 'ua' ? 'Підбір за 30 сек' : 'Dobierz ofertę w 30s'}</span>
                </button>
              ) : (
                <button 
                  onClick={() => onCtaClick('kandydat')}
                  className="bg-primary hover:bg-[#8ec71e] text-[#2D2D2D] font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group w-full sm:w-auto cursor-pointer"
                >
                  {t('hero.btnKandydat')}
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              )}

              {/* Employer Button */}
              <button 
                onClick={() => {
                  if (window.gtag) window.gtag('event', 'click_find_employees');
                  if (window.fbq) window.fbq('trackCustom', 'ClickFindEmployees');
                  onCtaClick('pracodawca');
                }}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group w-full sm:w-auto cursor-pointer backdrop-blur-sm"
              >
                {t('hero.btnPracodawca')}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">business</span>
              </button>
            </div>

            {/* Official Trust Badges (EWL / Gremi parity) */}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-xs md:text-sm text-zinc-300/90 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="material-symbols-outlined text-[#8CC63F] text-base">verified</span>
                {currentLanguage === 'ua' ? `Ліцензія KRAZ № ${config.kraz}` : `Certyfikat KRAZ nr ${config.kraz}`}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="material-symbols-outlined text-[#00B4B4] text-base">security</span>
                {currentLanguage === 'ua' ? '100% легальна робота (ZUS)' : '100% legalna praca i ZUS'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="material-symbols-outlined text-amber-400 text-base">home</span>
                {currentLanguage === 'ua' ? 'Перевірене житло' : 'Sprawdzone zakwaterowanie'}
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
