import React, { useState } from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const { t } = useLanguage();

  const faqs = [
    {
      question: t('faq.q1'),
      answer: t('faq.a1')
    },
    {
      question: t('faq.q2'),
      answer: t('faq.a2')
    },
    {
      question: t('faq.q3'),
      answer: t('faq.a3')
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-surface-contrast py-20 md:py-24 px-gutter" id="faq">
      <div className="max-w-4xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-4">{t('faq.title')}</h2>
            <p className="text-zinc-700 text-base md:text-lg">{t('faq.desc')}</p>
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
                      <div className="px-6 pb-6 pt-0 text-zinc-700 text-base leading-relaxed border-t border-zinc-100 mt-2 break-words">
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
