import React, { useState } from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('kandydat'); // 'kandydat' | 'pracodawca'
  const { t } = useLanguage();

  return (
    <section className="bg-surface-container-low py-20 md:py-24 px-gutter" id="jak-to-dziala">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-8">{t('howItWorks.title')}</h2>
            
            {/* Tabs Toggle */}
            <div className="inline-flex bg-white p-1.5 rounded-full border border-zinc-200 shadow-sm relative w-full sm:w-auto max-w-[400px] overflow-hidden">
              <button
                onClick={() => setActiveTab('kandydat')}
                className={`relative z-10 flex-1 px-2 text-xs sm:text-sm md:px-8 md:text-base py-3 rounded-full font-label-bold transition-all duration-300 ${
                  activeTab === 'kandydat' ? 'text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {t('howItWorks.tabKandydat')}
              </button>
              <button
                onClick={() => setActiveTab('pracodawca')}
                className={`relative z-10 flex-1 px-2 text-xs sm:text-sm md:px-8 md:text-base py-3 rounded-full font-label-bold transition-all duration-300 ${
                  activeTab === 'pracodawca' ? 'text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {t('howItWorks.tabPracodawca')}
              </button>
              
              {/* Sliding Background */}
              <div 
                className="absolute top-1.5 bottom-1.5 bg-primary rounded-full transition-transform duration-300 ease-out shadow-md"
                style={{ 
                  transform: activeTab === 'kandydat' ? 'translateX(0)' : 'translateX(100%)',
                  left: '6px',
                  width: 'calc(50% - 6px)'
                }}
              />
            </div>
          </div>
        </FadeIn>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeTab === 'kandydat' ? (
            <>
              <FadeIn delay={100}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">1</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">{t('howItWorks.k1Title')}</h3>
                  <p className="text-zinc-700 text-base leading-relaxed break-words">
                    {t('howItWorks.k1Desc')}
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">2</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">{t('howItWorks.k2Title')}</h3>
                  <p className="text-zinc-700 text-base leading-relaxed break-words">
                    {t('howItWorks.k2Desc')}
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">3</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">{t('howItWorks.k3Title')}</h3>
                  <p className="text-zinc-700 text-base leading-relaxed break-words">
                    {t('howItWorks.k3Desc')}
                  </p>
                </div>
              </FadeIn>
            </>
          ) : (
            <>
              <FadeIn delay={100}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">1</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">{t('howItWorks.p1Title')}</h3>
                  <p className="text-zinc-700 text-base leading-relaxed break-words">
                    {t('howItWorks.p1Desc')}
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">2</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">{t('howItWorks.p2Title')}</h3>
                  <p className="text-zinc-700 text-base leading-relaxed break-words">
                    {t('howItWorks.p2Desc')}
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">3</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">{t('howItWorks.p3Title')}</h3>
                  <p className="text-zinc-700 text-base leading-relaxed break-words">
                    {t('howItWorks.p3Desc')}
                  </p>
                </div>
              </FadeIn>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
