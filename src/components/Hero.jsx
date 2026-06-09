import React from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onCtaClick }) {
  const { t } = useLanguage();

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
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-start">
              <button 
                onClick={() => {
                  if (window.gtag) window.gtag('event', 'click_find_job');
                  if (window.fbq) window.fbq('trackCustom', 'ClickFindJob');
                  onCtaClick('kandydat');
                }}
                className="bg-primary hover:bg-[#8ec71e] text-[#2D2D2D] font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group w-full sm:w-auto cursor-pointer"
              >
                {t('hero.btnKandydat')}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
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
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
