import React from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function Hero({ onCtaClick }) {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-background-white py-16 md:py-24 px-gutter flex items-center min-h-[90vh]">
      {/* Abstract Background Shapes */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl opacity-60 mix-blend-multiply"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        {/* Left Column: Typography & CTAs */}
        <div className="space-y-8 max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
          <FadeIn delay={100}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-label-bold text-sm mb-4 border border-primary/20 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              {t('hero.tag')}
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <h1 className="font-black text-5xl md:text-6xl lg:text-7xl text-[#1a1a1a] leading-[1.05] tracking-tight">
              {t('hero.title1')}{' '}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block pb-2">
                {t('hero.title2')}
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={300}>
            <p className="text-lg md:text-xl font-semibold text-zinc-700 leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </FadeIn>

          <FadeIn delay={400}>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
              <button 
                onClick={() => {
                  if (window.gtag) window.gtag('event', 'click_find_job');
                  if (window.fbq) window.fbq('trackCustom', 'ClickFindJob');
                  onCtaClick('kandydat');
                }}
                className="bg-primary hover:bg-[#8ec71e] text-[#2D2D2D] font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group w-full sm:w-auto"
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
                className="bg-secondary hover:bg-[#009b9b] text-white font-bold text-base px-8 py-4 rounded-xl shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center gap-2 group w-full sm:w-auto"
              >
                {t('hero.btnPracodawca')}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">business</span>
              </button>
            </div>
          </FadeIn>

          {/* Social Proof Mini */}
          <FadeIn delay={500}>
            <div className="pt-8 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                <img src="https://i.pravatar.cc/100?img=33" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                <img src="https://i.pravatar.cc/100?img=47" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
                <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" />
              </div>

            </div>
          </FadeIn>
        </div>

        {/* Right Column: Premium Visual */}
        <div className="relative hidden lg:block h-full min-h-[500px]">
          <FadeIn delay={300}>
            <div className="relative w-full h-full flex justify-end">
              {/* Main Image */}
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=1000" 
                alt="Modern HR Professionals" 
                className="w-4/5 h-[600px] object-cover rounded-3xl shadow-2xl border-8 border-white z-10"
              />
              
              {/* Floating Card 1 */}
              <div className="absolute top-12 left-0 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 z-20 flex items-center gap-4 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">verified</span>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase">{t('hero.btnKandydat')}</p>
                  <p className="text-sm font-bold text-zinc-800">100% {t('stats.stat2')}</p>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute bottom-24 -left-12 bg-white p-4 rounded-2xl shadow-xl border border-zinc-100 z-20 flex items-center gap-4 animate-fade-in-up" style={{animationDelay: '1.1s'}}>
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">trending_up</span>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 font-bold uppercase">{t('stats.stat1')}</p>
                  <p className="text-sm font-bold text-zinc-800">+150 Freecruiterów</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  );
}
