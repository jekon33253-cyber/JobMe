import React, { useState } from 'react';
import FadeIn from './FadeIn';

export default function ContactForm({ activeTab, onTabChange }) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Hide success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <section className="bg-background-white py-20 md:py-24 px-gutter" id="contact">
      <FadeIn>
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-container-high rounded-xxl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Left Info Panel */}
            <div className="md:w-1/2 p-12 lg:p-16 space-y-8 bg-[#2D2D2D] text-white">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Zmieńmy razem rynek pracy
              </h2>
              <p className="font-body-lg text-body-lg opacity-90">
                Czekamy na Ciebie we Wrocławiu. Porozmawiajmy o Twoich celach biznesowych lub zawodowych.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#A1DD22]">location_on</span>
                  <span className="font-body-md">Wrocław, Polska</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#00B4B4]">mail</span>
                  <span className="font-body-md">kontakt@jobme.pl</span>
                </div>
              </div>
            </div>

            {/* Right Form Panel */}
            <div className="md:w-1/2 p-8 lg:p-16 bg-white relative">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
                Bezpłatna konsultacja
              </h3>

              {/* Internal Tabs */}
              <div className="inline-flex bg-zinc-50 p-1.5 rounded-full border border-zinc-200 shadow-sm relative mb-8 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onTabChange('kandydat')}
                  className={`flex-1 relative z-10 px-4 text-sm md:px-6 py-2.5 rounded-full font-label-bold transition-all duration-300 ${
                    activeTab === 'kandydat' ? 'text-white bg-[#A1DD22] shadow-md' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Dla Kandydata
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange('pracodawca')}
                  className={`flex-1 relative z-10 px-4 text-sm md:px-6 py-2.5 rounded-full font-label-bold transition-all duration-300 ${
                    activeTab === 'pracodawca' ? 'text-white bg-[#00B4B4] shadow-md' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Dla Pracodawcy
                </button>
              </div>

              {isSubmitted ? (
                <div className="bg-[#A1DD22]/10 border border-[#A1DD22]/30 rounded-xl p-8 text-center animate-fade-in-up">
                  <div className="w-16 h-16 bg-[#A1DD22] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#A1DD22]/20">
                    <span className="material-symbols-outlined text-3xl">check</span>
                  </div>
                  <h4 className="text-xl font-bold text-zinc-800 mb-2">Dziękujemy!</h4>
                  <p className="text-zinc-700">Otrzymaliśmy Twoje zgłoszenie. Skontaktujemy się z Tobą najszybciej jak to możliwe.</p>
                </div>
              ) : (
                <form className="space-y-5 animate-fade-in-up" onSubmit={handleSubmit} key={activeTab}>
                  {activeTab === 'kandydat' ? (
                    <>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">Imię</label>
                        <input required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#A1DD22] focus:ring-4 focus:ring-[#A1DD22]/10 focus:outline-none transition-all" placeholder="Twoje imię" type="text" />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">Numer telefonu</label>
                        <input required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#A1DD22] focus:ring-4 focus:ring-[#A1DD22]/10 focus:outline-none transition-all" placeholder="+48 ___ ___ ___" type="tel" />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">Miasto</label>
                        <select required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#A1DD22] focus:ring-4 focus:ring-[#A1DD22]/10 focus:outline-none transition-all appearance-none">
                          <option value="">Wybierz miasto</option>
                          <option value="wroclaw">Wrocław</option>
                          <option value="warszawa">Warszawa</option>
                          <option value="krakow">Kraków</option>
                          <option value="poznan">Poznań</option>
                          <option value="cala-polska">Cała Polska</option>
                        </select>
                      </div>
                      <button className="w-full bg-[#A1DD22] text-[#2D2D2D] font-bold text-base py-4 rounded-xl hover:bg-[#8ec71e] transition-all shadow-md shadow-[#A1DD22]/20 hover:-translate-y-0.5" type="submit">
                        Znajdź pracę
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">Imię / Nazwa firmy</label>
                        <input required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all" placeholder="Nazwa firmy lub Twoje imię" type="text" />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">Miasto</label>
                        <input required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all" placeholder="Gdzie szukasz pracowników?" type="text" />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">Numer telefonu</label>
                        <input required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all" placeholder="+48 ___ ___ ___" type="tel" />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">Adres e-mail</label>
                        <input required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all" placeholder="kontakt@firma.pl" type="email" />
                      </div>
                      <button className="w-full bg-[#00B4B4] text-white font-bold text-base py-4 rounded-xl hover:bg-[#009b9b] transition-all shadow-md shadow-[#00B4B4]/20 hover:-translate-y-0.5" type="submit">
                        Znajdź pracowników
                      </button>
                    </>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
