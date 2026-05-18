import React, { useState } from 'react';
import FadeIn from './FadeIn';
import { useLanguage } from '../context/LanguageContext';

export default function ContactForm({ activeTab, onTabChange }) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsError(false);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.target = activeTab;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsSuccess(true);
        
        // Conversion Tracking
        if (activeTab === 'kandydat') {
          if (window.gtag) window.gtag('event', 'lead_candidate');
          if (window.fbq) window.fbq('track', 'Lead');
        } else {
          if (window.gtag) window.gtag('event', 'lead_employer');
          if (window.fbq) window.fbq('track', 'Contact');
        }

        setTimeout(() => {
          setIsSuccess(false);
          e.target.reset();
        }, 8000);
      } else {
        setIsError(true);
      }
    } catch (error) {
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-background-white py-20 md:py-24 px-gutter" id="contact">
      <FadeIn>
        <div className="max-w-7xl mx-auto">
          <div className="bg-surface-container-high rounded-xxl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Left Info Panel */}
            <div className="md:w-1/2 p-12 lg:p-16 space-y-8 bg-[#2D2D2D] text-white">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                {t('contact.title')}
              </h2>
              <p className="font-body-lg text-body-lg opacity-90">
                {t('contact.desc')}
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-[#A1DD22]">location_on</span>
                  <span className="font-body-md">{t('contact.location')}</span>
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
                {t('contact.freeConsultation')}
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
                  {t('contact.tabKandydat')}
                </button>
                <button
                  type="button"
                  onClick={() => onTabChange('pracodawca')}
                  className={`flex-1 relative z-10 px-4 text-sm md:px-6 py-2.5 rounded-full font-label-bold transition-all duration-300 ${
                    activeTab === 'pracodawca' ? 'text-white bg-[#00B4B4] shadow-md' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {t('contact.tabPracodawca')}
                </button>
              </div>

              {isSuccess ? (
                <div className="bg-[#A1DD22]/10 border border-[#A1DD22]/30 rounded-xl p-8 text-center animate-fade-in-up">
                  <div className="w-16 h-16 bg-[#A1DD22] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#A1DD22]/20">
                    <span className="material-symbols-outlined text-3xl">check</span>
                  </div>
                  <h4 className="text-xl font-bold text-zinc-800 mb-2">{t('contact.successTitle')}</h4>
                  <p className="text-zinc-700">{t('contact.successDesc')}</p>
                </div>
              ) : (
                <form className="space-y-5 animate-fade-in-up" onSubmit={handleSubmit} key={activeTab}>
                  {isError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                      {t('contact.errorMsg')}
                    </div>
                  )}
                  {activeTab === 'kandydat' ? (
                    <>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">{t('contact.nameLabel')}</label>
                        <input name="name" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#A1DD22] focus:ring-4 focus:ring-[#A1DD22]/10 focus:outline-none transition-all" placeholder={t('contact.namePlaceholder')} type="text" />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">{t('contact.phoneLabel')}</label>
                        <input name="phone" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#A1DD22] focus:ring-4 focus:ring-[#A1DD22]/10 focus:outline-none transition-all" placeholder="+48 ___ ___ ___" type="tel" />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">{t('contact.cityLabel')}</label>
                        <select name="city" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#A1DD22] focus:ring-4 focus:ring-[#A1DD22]/10 focus:outline-none transition-all appearance-none">
                          <option value="">{t('contact.cityPlaceholder')}</option>
                          <option value="Wrocław">{t('contact.cities.wroclaw')}</option>
                          <option value="Warszawa">{t('contact.cities.warszawa')}</option>
                          <option value="Kraków">{t('contact.cities.krakow')}</option>
                          <option value="Poznań">{t('contact.cities.poznan')}</option>
                          <option value="Cała Polska">{t('contact.cities.all')}</option>
                        </select>
                      </div>
                      <button disabled={isSubmitting} className={`w-full bg-[#A1DD22] text-[#2D2D2D] font-bold text-base py-4 rounded-xl shadow-md transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed animate-pulse' : 'hover:bg-[#8ec71e] hover:-translate-y-0.5 shadow-[#A1DD22]/20'}`} type="submit">
                        {isSubmitting ? t('contact.btnSending') : t('contact.btnKandydat')}
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">{t('contact.nameCompanyLabel')}</label>
                        <input name="name" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all" placeholder={t('contact.nameCompanyPlaceholder')} type="text" />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">{t('contact.cityLabel')}</label>
                        <input name="city" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all" placeholder={t('contact.cityPlaceholderB2B')} type="text" />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">{t('contact.phoneLabel')}</label>
                        <input name="phone" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all" placeholder="+48 ___ ___ ___" type="tel" />
                      </div>
                      <div>
                        <label className="block font-bold text-zinc-800 text-sm mb-2">{t('contact.emailLabel')}</label>
                        <input name="email" required className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all" placeholder={t('contact.emailPlaceholder')} type="email" />
                      </div>
                      <button disabled={isSubmitting} className={`w-full bg-[#00B4B4] text-white font-bold text-base py-4 rounded-xl shadow-md transition-all ${isSubmitting ? 'opacity-70 cursor-not-allowed animate-pulse' : 'hover:bg-[#009b9b] hover:-translate-y-0.5 shadow-[#00B4B4]/20'}`} type="submit">
                        {isSubmitting ? t('contact.btnSending') : t('contact.btnPracodawca')}
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
