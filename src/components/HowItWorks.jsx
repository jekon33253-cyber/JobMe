import React, { useState } from 'react';
import FadeIn from './FadeIn';

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('kandydat'); // 'kandydat' | 'pracodawca'

  return (
    <section className="bg-surface-container-low py-20 md:py-24 px-gutter" id="jak-to-dziala">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-8">Jak to działa</h2>
            
            {/* Tabs Toggle */}
            <div className="inline-flex bg-white p-1.5 rounded-full border border-zinc-200 shadow-sm relative">
              <button
                onClick={() => setActiveTab('kandydat')}
                className={`relative z-10 px-4 text-sm md:px-8 md:text-base py-3 rounded-full font-label-bold transition-all duration-300 ${
                  activeTab === 'kandydat' ? 'text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Dla Kandydata
              </button>
              <button
                onClick={() => setActiveTab('pracodawca')}
                className={`relative z-10 px-4 text-sm md:px-8 md:text-base py-3 rounded-full font-label-bold transition-all duration-300 ${
                  activeTab === 'pracodawca' ? 'text-white' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                Dla Pracodawcy
              </button>
              
              {/* Sliding Background */}
              <div 
                className="absolute top-1.5 bottom-1.5 w-1/2 bg-primary rounded-full transition-transform duration-300 ease-out shadow-md"
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
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">Szybki kontakt i wybór oferty</h3>
                  <p className="text-zinc-700 text-base leading-relaxed">
                    Wybierasz wygodny dla Ciebie kanał (WhatsApp, Telegram, telefon). Bez zbędnych formularzy. Od razu przechodzimy do konkretów i dopasowujemy projekt.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">2</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">Transparentna umowa</h3>
                  <p className="text-zinc-700 text-base leading-relaxed">
                    Dostajesz jasną umowę w swoim ojczystym języku jeszcze przed pierwszym dniem pracy. Z góry wiesz, ile zarobisz i jakie masz obowiązki.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">3</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">Wsparcie i Upskilling</h3>
                  <p className="text-zinc-700 text-base leading-relaxed">
                    Zyskujesz opiekę koordynatora i dostęp do darmowych szkoleń zawodowych, które pomogą Ci szybko awansować na lepiej płatne stanowisko.
                  </p>
                </div>
              </FadeIn>
            </>
          ) : (
            <>
              <FadeIn delay={100}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">1</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">Analiza potrzeb</h3>
                  <p className="text-zinc-700 text-base leading-relaxed">
                    Szybki audyt Twoich wakatów i rotacji. Opracowujemy wspólnie profil idealnego kandydata oraz ustalamy przejrzyste stawki B2B.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={200}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">2</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">Uruchomienie sieci Freecruiterów</h3>
                  <p className="text-zinc-700 text-base leading-relaxed">
                    Zlecenie natychmiast trafia do naszej platformy zrzeszającej niezależnych rekruterów. Pozwala to na masowe i błyskawiczne skalowanie zatrudnienia.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={300}>
                <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 flex flex-col h-full hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-full flex items-center justify-center font-extrabold text-xl mb-6">3</div>
                  <h3 className="text-xl font-bold text-[#2D2D2D] mb-4">Legalizacja i Compliance</h3>
                  <p className="text-zinc-700 text-base leading-relaxed">
                    Bierzemy na siebie 100% formalności związanych z dokumentacją pracowników lokalnych i zagranicznych. Gwarantujemy pełną zgodność z prawem.
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
