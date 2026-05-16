import React, { useState } from 'react';
import FadeIn from './FadeIn';

const faqs = [
  {
    question: "Czy są jakieś ukryte opłaty lub kary umowne?",
    answer: "Nie. Gwarantujemy pełną transparentność. Wszystkie koszty (kwatery, dojazd, badania) są jasno rozpisane w umowie. Żadnych niespodzianek na koniec miesiąca."
  },
  {
    question: "Jakie rodzaje umów podpisujecie?",
    answer: "Stawiamy na pełną legalność. W zależności od projektu oferujemy stabilne umowy zlecenia lub umowy o pracę tymczasową, w pełni skoordynowane z polskim prawem pracy."
  },
  {
    question: "Co jeśli nie poradzę sobie z językiem lub tempem pracy?",
    answer: "Twój osobisty koordynator pomoże Ci przejść przez proces wdrożenia. Jeśli stanowisko okaże się zbyt wymagające, nie zwalniamy Cię – szukamy alternatywnego projektu w naszej bazie."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-surface-contrast py-20 md:py-24 px-gutter" id="faq">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-4">Często zadawane pytania</h2>
            <p className="text-zinc-700 text-base md:text-lg">Odpowiadamy wprost. Zero korporacyjnej nowomowy.</p>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <FadeIn key={index} delay={index * 100}>
                <div 
                  className={`bg-white rounded-xl border ${isOpen ? 'border-primary/50 shadow-md' : 'border-zinc-200'} overflow-hidden transition-all duration-300`}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left px-6 py-5 flex justify-between items-center focus:outline-none"
                  >
                    <span className="font-bold text-[#2D2D2D] text-lg pr-8">{faq.question}</span>
                    <span 
                      className={`material-symbols-outlined text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
                    >
                      expand_more
                    </span>
                  </button>
                  
                  <div 
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 pt-0 text-zinc-700 text-base leading-relaxed border-t border-zinc-100 mt-2">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
