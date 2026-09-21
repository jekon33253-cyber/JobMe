import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getVacancies } from '../lib/vacancies';
import config from '../config';
import { trackLeadStart, trackLeadComplete, trackSmartMatchComplete, trackChannelClick } from '../lib/analytics';

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export default function SmartLeadModal({ isOpen, onClose, initialVacancy = null }) {
  const { t, currentLanguage } = useLanguage();
  const jobs = useMemo(() => {
    const repoJobs = getVacancies(currentLanguage);
    if (repoJobs && repoJobs.length > 0) return repoJobs;
    return t('jobsWidget.jobs') || [];
  }, [currentLanguage, t]);

  const [leadType, setLeadType] = useState('candidate');
  // If vacancy is passed, jump straight to Step 3 (contact) to eliminate friction
  const [step, setStep] = useState(initialVacancy ? 3 : 1);
  const [candidateCity, setCandidateCity] = useState('wroclaw');
  const [housingPreference, setHousingPreference] = useState('free');
  const [polishLevel, setPolishLevel] = useState('none');
  
  // Employer state
  const [employerIndustry, setEmployerIndustry] = useState('production');
  const [headcount, setHeadcount] = useState('5-20');
  const [timeline, setTimeline] = useState('urgent');

  // Contact info
  const [name, setName] = useState('');
  const [contactValue, setContactValue] = useState('');
  const [channel, setChannel] = useState('telegram'); // 'telegram' | 'whatsapp' | 'phone'
  const [gdprConsent, setGdprConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Track lead start when modal opens
  useEffect(() => {
    if (isOpen) {
      trackLeadStart(leadType);
    }
  }, [isOpen, leadType]);

  // Keyboard accessibility: Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Real job matching logic & edge cases
  const { matchedJobs, alternativeJobs, hasExactMatches } = useMemo(() => {
    if (initialVacancy) {
      return {
        matchedJobs: [initialVacancy],
        alternativeJobs: [],
        hasExactMatches: true,
      };
    }

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return { matchedJobs: [], alternativeJobs: [], hasExactMatches: false };
    }

    let filtered = jobs;
    if (candidateCity && candidateCity !== 'any') {
      filtered = jobs.filter((j) => {
        const loc = (j.location || '').toLowerCase();
        if (candidateCity === 'wroclaw') {
          return (j.voivodeship || '').toLowerCase().includes('dolny') || loc.includes('wroc') || loc.includes('doln') || loc.includes('świebodz') || loc.includes('nowa ruda');
        }
        if (candidateCity === 'sosnowiec') {
          return j.city === 'Sosnowiec' || loc.includes('sosnow') || (loc.includes('śląsk') && !loc.includes('dolny'));
        }
        if (candidateCity === 'poznan') {
          return (j.voivodeship || '').toLowerCase().includes('wielkop') || loc.includes('pozna');
        }
        return true;
      });
    }

    // Secondary filter: housing if specified
    if (housingPreference === 'free') {
      filtered = filtered.filter((j) => j.housingType === 'free' || (j.housing || '').toLowerCase().includes('darmowe'));
    } else if (housingPreference === 'couple') {
      filtered = filtered.filter((j) => j.couplesWelcome || (j.housing || '').toLowerCase().includes('pokoje'));
    }

    const hasExact = filtered.length > 0;
    return {
      matchedJobs: hasExact ? filtered.slice(0, 2) : [],
      alternativeJobs: !hasExact ? jobs.slice(0, 2) : [],
      hasExactMatches: hasExact,
    };
  }, [jobs, candidateCity, housingPreference, initialVacancy]);

  // Calculate dynamic salary text strictly from matched jobs
  const salaryHighlight = useMemo(() => {
    if (initialVacancy?.salary) return initialVacancy.salary;
    if (matchedJobs.length > 0) {
      const rates = matchedJobs.map((j) => j.salary).filter(Boolean);
      if (rates.length === 1) return rates[0];
      return `${rates[0]} – ${rates[1] || rates[0]}`;
    }
    if (alternativeJobs.length > 0) {
      return alternativeJobs[0].salary;
    }
    return '25,00 zł / godz. netto';
  }, [matchedJobs, alternativeJobs, initialVacancy]);

  // Telegram deep-link generator
  const getTelegramUrl = () => {
    let text = `Cześć! Wypełniłem formularz na stronie JobMe.\n`;
    if (leadType === 'candidate') {
      text += `🎯 Stanowisko: ${initialVacancy ? initialVacancy.jobTitle : 'Dopasowanie ofert'}\n`;
      text += `📍 Preferencja miasta: ${candidateCity}\n`;
      text += `🏠 Mieszkanie: ${housingPreference === 'free' ? 'Wymagane darmowe' : housingPreference === 'couple' ? 'Dla pary' : 'Własne'}\n`;
      text += `🗣️ Język polski: ${polishLevel === 'none' ? 'Brak' : polishLevel === 'basic' ? 'Podstawowy' : 'Komunikatywny'}\n`;
    } else {
      text += `🏢 Szukam pracowników B2B: ${employerIndustry}\n`;
      text += `👥 Liczba: ${headcount} osób\n`;
      text += `⏱️ Termin: ${timeline}\n`;
    }
    if (name) text += `👤 Imię: ${name.trim()}\n`;
    if (contactValue) text += `📞 Kontakt: ${contactValue.trim()}\n`;

    return `https://t.me/${config.telegramUsername}?text=${encodeURIComponent(text)}`;
  };

  // WhatsApp deep-link generator
  const getWhatsAppUrl = () => {
    let text = `Cześć! Wypełniłem formularz na JobMe.\n`;
    if (leadType === 'candidate') {
      text += `🎯 Stanowisko: ${initialVacancy ? initialVacancy.jobTitle : 'Dopasowanie ofert'}\n`;
      text += `📍 Miasto: ${candidateCity}\n`;
      text += `🏠 Mieszkanie: ${housingPreference === 'free' ? 'Darmowe' : housingPreference === 'couple' ? 'Dla pary' : 'Własne'}\n`;
    } else {
      text += `🏢 Szukam pracowników B2B: ${employerIndustry} (${headcount} osób)\n`;
    }
    if (name) text += `👤 Imię: ${name.trim()}\n`;
    if (contactValue) text += `📞 Tel/Kontakt: ${contactValue.trim()}\n`;

    const cleanPhone = config.whatsappNumber || config.phoneRaw || '48574220849';
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!gdprConsent || isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedContact = contactValue.trim();

    if (!trimmedName || !trimmedContact) {
      setFormError(currentLanguage === 'ua' ? 'Будь ласка, заповніть всі обов’язкові поля' : 'Proszę wypełnić wszystkie wymagane pola');
      return;
    }

    if (channel === 'phone' || channel === 'whatsapp') {
      const digits = trimmedContact.replace(/[^0-9]/g, '');
      if (digits.length < 7) {
        setFormError(currentLanguage === 'ua' ? 'Введіть коректний номер телефону (мін. 7 цифр)' : 'Proszę podać poprawny numer telefonu (min. 7 cyfr)');
        return;
      }
    }

    setIsSubmitting(true);
    setFormError('');

    trackLeadComplete(leadType, channel, {
      city: candidateCity,
      matches: matchedJobs.length,
      has_name: Boolean(trimmedName),
      has_contact: Boolean(trimmedContact),
    });
    trackSmartMatchComplete(matchedJobs.length, { candidateCity, housingPreference });
    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="smart-lead-modal-title"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-zinc-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] text-left relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top brand gradient line */}
        <div className="h-2 bg-gradient-to-r from-[#8CC63F] via-[#00B4B4] to-[#0088cc]" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Icon name={leadType === 'candidate' ? 'person_search' : 'domain'} className="text-2xl text-[#8CC63F]" />
            </div>
            <div>
              <h3 id="smart-lead-modal-title" className="text-lg md:text-xl font-extrabold text-[#2D2D2D] leading-tight">
                {submitted 
                  ? (currentLanguage === 'ua' ? 'Ваші персональні пропозиції' : 'Twoje dopasowane oferty')
                  : initialVacancy 
                    ? (currentLanguage === 'ua' ? 'Швидка заявка на вакансію' : 'Szybka aplikacja na ofertę')
                    : (currentLanguage === 'ua' ? 'Розумний підбір за 30 секунд' : 'Inteligentny dobór w 30 sek')}
              </h3>
              <p className="text-xs text-zinc-500">
                {submitted 
                  ? (currentLanguage === 'ua' ? 'Зв’язок протягом 5–15 хвилин' : 'Kontakt w ciągu 5–15 minut')
                  : `Krok ${step} z 3 • ${leadType === 'candidate' ? (currentLanguage === 'ua' ? 'Кандидат' : 'Kandydat') : (currentLanguage === 'ua' ? 'Pracodawca' : 'Pracodawca')}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Zamknij"
          >
            <Icon name="close" className="text-lg" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Vacancy Context pill if passed */}
          {initialVacancy && !submitted && (
            <div className="p-3.5 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8CC63F] animate-pulse shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Aplikujesz na:</p>
                <p className="text-sm font-black text-[#2D2D2D] truncate">{initialVacancy.jobTitle}</p>
                <p className="text-xs font-bold text-[#5a8a00]">{initialVacancy.salary} • {initialVacancy.location}</p>
              </div>
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: Candidate vs Employer */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-sm font-bold text-zinc-700">
                    {currentLanguage === 'ua' ? 'Оберіть вашу мету:' : 'Wybierz cel zapytania:'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => { setLeadType('candidate'); setStep(2); }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-2 ${
                        leadType === 'candidate' ? 'border-[#8CC63F] bg-primary/5' : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-xl bg-[#8CC63F]/20 text-[#2D2D2D] flex items-center justify-center">
                        <Icon name="badge" className="text-xl text-[#8CC63F]" />
                      </span>
                      <span className="font-extrabold text-[#2D2D2D] text-sm">
                        {currentLanguage === 'ua' ? 'Шукаю роботу' : 'Szukam pracy'}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {currentLanguage === 'ua' ? 'Безкоштовне житло, аванси, легалізація' : 'Darmowe zakwaterowanie, zaliczki, ZUS'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => { setLeadType('employer'); setStep(2); }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col gap-2 ${
                        leadType === 'employer' ? 'border-[#00B4B4] bg-[#00B4B4]/5' : 'border-zinc-200 hover:border-zinc-300'
                      }`}
                    >
                      <span className="w-8 h-8 rounded-xl bg-[#00B4B4]/20 text-[#00B4B4] flex items-center justify-center">
                        <Icon name="business_center" className="text-xl" />
                      </span>
                      <span className="font-extrabold text-[#2D2D2D] text-sm">
                        {currentLanguage === 'ua' ? 'Шукаю персонал (B2B)' : 'Szukam pracowników'}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {currentLanguage === 'ua' ? `Підбір від 4 днів, KRAZ nr ${config.kraz}` : `Leasing, rekrutacja od 4 dni, KRAZ nr ${config.kraz}`}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Parameters for Candidate */}
              {step === 2 && leadType === 'candidate' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                      {currentLanguage === 'ua' ? 'Бажане місто / регіон' : 'Preferowana lokalizacja'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'wroclaw', label: 'Wrocław / Dolny Śląsk' },
                        { id: 'sosnowiec', label: 'Śląsk / Sosnowiec' },
                        { id: 'poznan', label: 'Poznań / Wielkopolska' },
                        { id: 'any', label: currentLanguage === 'ua' ? 'Будь-яке місто' : 'Dowolne miasto' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setCandidateCity(item.id)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            candidateCity === item.id 
                              ? 'border-[#8CC63F] bg-primary/10 text-[#2D2D2D]' 
                              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                      {currentLanguage === 'ua' ? 'Умови проживання' : 'Zakwaterowanie'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'free', label: currentLanguage === 'ua' ? 'Безкоштовно' : 'Darmowe' },
                        { id: 'couple', label: currentLanguage === 'ua' ? 'Для пар' : 'Dla pary' },
                        { id: 'own', label: currentLanguage === 'ua' ? 'Власне' : 'Własne' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setHousingPreference(item.id)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            housingPreference === item.id 
                              ? 'border-[#8CC63F] bg-primary/10 text-[#2D2D2D]' 
                              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                      {currentLanguage === 'ua' ? 'Знання польської мови' : 'Znajomość języka polskiego'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'none', label: currentLanguage === 'ua' ? 'Не знаю' : 'Brak' },
                        { id: 'basic', label: currentLanguage === 'ua' ? 'Розумію' : 'Podstawowy' },
                        { id: 'good', label: currentLanguage === 'ua' ? 'Вільно' : 'Komunikatywny' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setPolishLevel(item.id)}
                          className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            polishLevel === item.id 
                              ? 'border-[#8CC63F] bg-primary/10 text-[#2D2D2D]' 
                              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Parameters for Employer */}
              {step === 2 && leadType === 'employer' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                      {currentLanguage === 'ua' ? 'Галузь компанії' : 'Branża'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'production', label: 'Produkcja / Automotive' },
                        { id: 'warehouse', label: 'Logistyka i Magazyn' },
                        { id: 'food', label: 'Przemysł spożywczy' },
                        { id: 'other', label: 'Inna branża' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setEmployerIndustry(item.id)}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            employerIndustry === item.id 
                              ? 'border-[#00B4B4] bg-[#00B4B4]/10 text-[#2D2D2D]' 
                              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                      {currentLanguage === 'ua' ? 'Потрібна кількість працівників' : 'Zapotrzebowanie'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['1-5', '5-20', '20+'].map((hc) => (
                        <button
                          type="button"
                          key={hc}
                          onClick={() => setHeadcount(hc)}
                          className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            headcount === hc 
                              ? 'border-[#00B4B4] bg-[#00B4B4]/10 text-[#2D2D2D]' 
                              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                          }`}
                        >
                          {hc} osób
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                      {currentLanguage === 'ua' ? 'Термін старту' : 'Termin rozpoczęcia'}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'urgent', label: 'Pilnie (do 7 dni)' },
                        { id: 'standard', label: 'W 2-3 tygodnie' },
                      ].map((tm) => (
                        <button
                          type="button"
                          key={tm.id}
                          onClick={() => setTimeline(tm.id)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            timeline === tm.id 
                              ? 'border-[#00B4B4] bg-[#00B4B4]/10 text-[#2D2D2D]' 
                              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                          }`}
                        >
                          {tm.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Contacts & Priority Channel & GDPR Consent */}
              {step === 3 && (
                <div className="space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-bold flex items-center gap-2">
                      <Icon name="error" className="text-base text-red-500" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      {currentLanguage === 'ua' ? 'Ваше ім’я' : 'Twoje imię'}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={60}
                      placeholder="np. Aleksander"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-[#8CC63F] outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      {channel === 'telegram'
                        ? (currentLanguage === 'ua' ? 'Telegram нікнейм або номер телефону' : 'Telegram username lub numer telefonu')
                        : channel === 'whatsapp'
                          ? (currentLanguage === 'ua' ? 'Номер телефону для WhatsApp' : 'Numer telefonu dla WhatsApp')
                          : (currentLanguage === 'ua' ? 'Номер телефону для дзвінка' : 'Numer telefonu do kontaktu')}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      placeholder={channel === 'telegram' ? '@username lub +48 / +380...' : '+48 / +380...'}
                      value={contactValue}
                      onChange={(e) => {
                        setContactValue(e.target.value);
                        if (formError) setFormError('');
                      }}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-300 focus:ring-2 focus:ring-[#8CC63F] outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2">
                      {currentLanguage === 'ua' ? 'Оберіть пріоритетний спосіб зв’язку' : 'Wybierz preferowany kanał kontaktu'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setChannel('telegram')}
                        className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          channel === 'telegram' 
                            ? 'border-[#0088cc] bg-[#0088cc]/10 text-[#0088cc] font-black' 
                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
                        </svg>
                        <span className="text-xs">Telegram ⚡</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setChannel('whatsapp')}
                        className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          channel === 'whatsapp' 
                            ? 'border-[#25D366] bg-[#25D366]/10 text-[#25D366] font-black' 
                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        </svg>
                        <span className="text-xs">WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setChannel('phone')}
                        className={`p-2.5 rounded-xl border-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          channel === 'phone' 
                            ? 'border-zinc-800 bg-zinc-100 text-zinc-900 font-black' 
                            : 'border-zinc-200 text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        <Icon name="phone" className="text-lg" />
                        <span className="text-xs">Telefon</span>
                      </button>
                    </div>
                  </div>

                  {/* GDPR (RODO) explicit legal consent */}
                  <label className="flex items-start gap-2.5 text-xs text-zinc-600 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      required
                      checked={gdprConsent}
                      onChange={(e) => setGdprConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-zinc-300 text-[#8CC63F] focus:ring-[#8CC63F] cursor-pointer shrink-0"
                    />
                    <span className="leading-snug">
                      {currentLanguage === 'ua'
                        ? 'Я погоджуюся на обробку персональних даних для підбору вакансій та зв’язку через обраний канал згідно з Політикою конфіденційності (RODO / GDPR).'
                        : 'Wyrażam zgodę na przetwarzanie moich danych osobowych w celu kontaktu rekrutacyjnego zgodnie z Polityką Prywatności (RODO).'}
                    </span>
                  </label>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-2">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 text-sm font-bold hover:bg-zinc-50 cursor-pointer"
                  >
                    Wróć
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="ml-auto bg-[#2D2D2D] hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
                  >
                    Dalej
                    <Icon name="arrow_forward" className="text-sm" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!gdprConsent}
                    className={`ml-auto px-7 py-3.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
                      gdprConsent 
                        ? 'bg-[#8CC63F] hover:bg-[#7ab335] text-[#2D2D2D] shadow-primary/25 hover:shadow-xl' 
                        : 'bg-zinc-300 text-zinc-500 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {currentLanguage === 'ua' ? 'Показати результат' : 'Pokaż dopasowane oferty'}
                    <Icon name="bolt" className="text-lg" />
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* STEP 4: IMMEDIATE VALUE & MULTI-CHANNEL ACTION (Edge cases handled) */
            <div className="space-y-6 animate-fade-in text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#8CC63F]/20 text-[#8CC63F] flex items-center justify-center mx-auto">
                <Icon name={hasExactMatches ? "verified" : "manage_search"} className="text-3xl" />
              </div>

              <div className="space-y-2">
                <h4 className="text-xl font-black text-[#2D2D2D]">
                  {leadType === 'candidate' 
                    ? (hasExactMatches
                        ? (matchedJobs.length === 1 
                            ? (currentLanguage === 'ua' ? 'Знайдено 1 ідеальну вакансію!' : 'Znaleziono 1 pasującą ofertę!')
                            : (currentLanguage === 'ua' ? `Знайдено ${matchedJobs.length} ідеальні вакансії!` : `Znaleziono ${matchedJobs.length} pasujące oferty!`))
                        : (currentLanguage === 'ua' 
                            ? 'Немає прямих вакансій у цьому місті' 
                            : `Brak bezpośrednich wakatów w: ${candidateCity}`))
                    : (currentLanguage === 'ua' ? 'Заявку прийнято! Орієнтовний термін: 4–7 днів' : 'Szacowany czas realizacji: 4–7 dni')}
                </h4>

                <p className="text-xs md:text-sm text-zinc-600 max-w-sm mx-auto">
                  {leadType === 'candidate'
                    ? (hasExactMatches
                        ? (currentLanguage === 'ua' ? `Ставка: ${salaryHighlight}. Житло та координатор закріплені.` : `Zarobki: ${salaryHighlight}. Zapewniamy mieszkanie i pełen ZUS.`)
                        : (currentLanguage === 'ua' 
                            ? 'Рекрутер JobMe має пропозиції у сусідніх містах із безкоштовним доїздом та житлом. Оберіть зв’язок нижче:' 
                            : 'Mamy jednak świetne propozycje z darmowym dojazdem lub mieszkaniem w sąsiednim regionie:'))
                    : (currentLanguage === 'ua' ? 'Координатор B2B перевіряє доступних кандидатів у системі Freecruiter.' : 'Koordynator B2B sprawdza bazę pracowników w wybranym regionie.')}
                </p>
              </div>

              {/* Matched offers preview OR Alternative offers preview */}
              {leadType === 'candidate' && (
                <div className="space-y-2.5 text-left">
                  {!hasExactMatches && (
                    <p className="text-xs font-black text-zinc-500 uppercase tracking-wider">
                      {currentLanguage === 'ua' ? 'Рекомендовані вакансії в інших містах:' : 'Polecane oferty z darmowym dojazdem / zakwaterowaniem:'}
                    </p>
                  )}
                  {(hasExactMatches ? matchedJobs : alternativeJobs).map((j, i) => (
                    <div key={i} className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                      <div className="min-w-0 pr-3">
                        <p className="font-bold text-xs text-[#2D2D2D] truncate">{j.jobTitle}</p>
                        <p className="text-xs text-[#5a8a00] font-black">{j.salary}</p>
                        <p className="text-[11px] text-zinc-500 truncate">{j.location} • {j.housing}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        hasExactMatches ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {hasExactMatches ? '100% dopasowania' : 'Polecana alternatywa'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Multi-channel Action Display */}
              <div className="space-y-3 pt-2">
                {channel === 'telegram' && (
                  <a
                    href={getTelegramUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackChannelClick('telegram', 'smart_lead_step4')}
                    className="w-full flex items-center justify-center gap-2.5 bg-[#0088cc] hover:bg-[#0077b3] text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-[#0088cc]/25 hover:shadow-2xl transition-all duration-300 text-sm md:text-base cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
                    </svg>
                    {currentLanguage === 'ua' ? 'Отримати ці вакансії в Telegram ⚡' : 'Odbierz szczegóły w Telegramie ⚡'}
                  </a>
                )}

                {channel === 'whatsapp' && (
                  <div className="space-y-2">
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackChannelClick('whatsapp', 'smart_lead_step4')}
                      className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-[#25D366]/25 hover:shadow-2xl transition-all duration-300 text-sm md:text-base cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                      </svg>
                      {currentLanguage === 'ua' ? 'Написати у WhatsApp 💬' : 'Odbierz szczegóły na WhatsApp 💬'}
                    </a>
                    <a
                      href={getTelegramUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#0088cc] hover:underline font-bold"
                    >
                      <span>{currentLanguage === 'ua' ? 'Або відкрити в Telegram' : 'Lub otwórz w Telegramie'}</span>
                    </a>
                  </div>
                )}

                {channel === 'phone' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-left">
                      <div className="flex items-center gap-2 mb-1 text-amber-800 font-extrabold text-sm">
                        <Icon name="phone_in_talk" className="text-amber-600" />
                        <span>
                          {currentLanguage === 'ua' ? 'Очікуйте дзвінка рекрутера' : 'Rekruter oddzwoni w ciągu 15 minut'}
                        </span>
                      </div>
                      <p className="text-xs text-amber-900/80 leading-relaxed">
                        {currentLanguage === 'ua' 
                          ? `Дякуємо, ${name || 'кандидате'}! Наш спеціаліст зв'яжеться з вами за номером ${contactValue || ''} у робочий час (8:00 - 18:00).`
                          : `Dziękujemy, ${name || 'Kandydacie'}! Zgłoszenie przyjęte. Oddzwonimy na numer ${contactValue || ''} w godzinach 8:00 – 18:00.`}
                      </p>
                    </div>

                    <div className="text-xs text-zinc-500">
                      {currentLanguage === 'ua' ? 'Не хочете чекати? Напишіть нам прямо зараз:' : 'Nie chcesz czekać? Napisz do nas od razu:'}
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <a
                        href={getTelegramUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackChannelClick('telegram', 'smart_lead_step4_fallback')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0088cc]/10 text-[#0088cc] hover:bg-[#0088cc]/20 font-bold text-xs"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
                        </svg>
                        Telegram
                      </a>
                      <a
                        href={getWhatsAppUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackChannelClick('whatsapp', 'smart_lead_step4_fallback')}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-bold text-xs"
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer pt-2"
                >
                  Zamknij okno
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
