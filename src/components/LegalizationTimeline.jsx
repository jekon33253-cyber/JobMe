import React from 'react';
import FadeIn from './FadeIn';

const steps = [
  {
    number: "01",
    title: "Audyt i weryfikacja",
    description: "W ciągu 24 godzin analizujemy status prawny kandydata oraz aktualne dokumenty. Eliminujemy jakiekolwiek ryzyko prawne jeszcze przed podpisaniem umowy."
  },
  {
    number: "02",
    title: "Błyskawiczne procesowanie",
    description: "Składamy oświadczenia i wnioski o zezwolenia na pracę (Zezwolenia typu A) drogą elektroniczną bezpośrednio do urzędów (PUP / Urząd Wojewódzki). Bez kolejek i opóźnień."
  },
  {
    number: "03",
    title: "Ciągłość i pełny Compliance",
    description: "Monitorujemy terminy ważności wiz i Kart Pobytu. Automatycznie przygotowujemy przedłużenia, gwarantując firmom 100% ochrony przed kontrolami PIP, a pracownikom bezpieczną przyszłość."
  }
];

export default function LegalizationTimeline() {
  return (
    <section className="bg-zinc-50 py-20 md:py-24 px-6 md:px-12 border-y border-zinc-100" id="legalization">
      <div className="max-w-7xl mx-auto">
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
            <span className="text-[#8CC63F] font-label-bold uppercase tracking-wider mb-2 block">
              Proces Legalizacji
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-800 mb-6">
              Legalizacja bez tajemnic i barier
            </h2>
            <p className="text-base md:text-lg text-zinc-600 leading-relaxed">
              Przejmujemy 100% formalności związanych z zatrudnieniem obcokrajowców. Pełne bezpieczeństwo dla biznesu, absolutna stabilność dla pracowników.
            </p>
          </div>

          <div className="relative">
            {/* Desktop Connecting Line */}
            <div className="hidden lg:block absolute top-12 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent z-0"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 relative z-10">
              {steps.map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white p-8 rounded-2xl border border-zinc-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-start relative group"
                >
                  <div className="mb-6 flex items-center gap-4">
                    <span className="text-5xl font-black bg-gradient-to-r from-[#8CC63F] to-[#00A99D] bg-clip-text text-transparent opacity-90 group-hover:scale-105 transition-transform duration-300">
                      {step.number}
                    </span>
                    {/* Decorative subtle dot for timeline effect on desktop */}
                    <div className="hidden lg:block absolute -top-12 left-10 w-4 h-4 rounded-full bg-white border-4 border-[#00A99D] shadow-sm"></div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-zinc-800 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-zinc-700 text-base leading-relaxed">
                    {step.description}
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
