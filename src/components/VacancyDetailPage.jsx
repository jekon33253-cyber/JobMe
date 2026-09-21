import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getVacancyBySlug } from '../lib/vacancies';
import SEOHead from './SEOHead';
import JobPostingSchema from './JobPostingSchema';
import config from '../config';
import { trackJobView, trackApplyStart, trackChannelClick } from '../lib/analytics';

export default function VacancyDetailPage({ slug, onOpenSmartLead, onBackToJobs }) {
  const { currentLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const vacancy = getVacancyBySlug(slug, currentLanguage);

  useEffect(() => {
    if (vacancy) {
      trackJobView(vacancy.jobTitle, vacancy.id);
    }
  }, [vacancy]);

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}/oferty/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API not permitted
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const cleanPhone = config.whatsappNumber || config.phoneRaw || '48574220849';

  // State: Vacancy expired or not found
  if (!vacancy || vacancy.status !== 'active') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-24 text-center">
        <SEOHead page="notFound" />
        <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-6">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-zinc-900 mb-3">
          {currentLanguage === 'ua' ? 'Ця вакансія вже неактивна' : 'Ta oferta pracy wygasła lub nie jest już dostępna'}
        </h1>
        <p className="text-zinc-600 max-w-md mx-auto mb-8 text-sm md:text-base leading-relaxed">
          {currentLanguage === 'ua'
            ? 'Набір на цю позицію завершено або умови було оновлено. Перегляньте актуальні перевірені пропозиції JobMe.'
            : 'Rekrutacja na to stanowisko została zakończona lub zaktualizowana. Sprawdź naszą aktualną bazę oficjalnych ofert pracy JobMe.'}
        </p>
        <button
          onClick={() => {
            if (onBackToJobs) onBackToJobs();
            else navigate('/oferty');
          }}
          className="bg-primary text-zinc-900 font-bold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {currentLanguage === 'ua' ? 'Переглянути всі вакансії' : 'Zobacz wszystkie oferty pracy'}
        </button>
      </div>
    );
  }

  const tgMessage = `Cześć! Chcę aplikować na ofertę: ${vacancy.jobTitle} (${vacancy.city || ''}) [URL: jobme.pl/oferty/${vacancy.slug}]`;
  const tgUrl = `https://t.me/${config.telegramUsername}?text=${encodeURIComponent(tgMessage)}`;

  const waMessage = `Dzień dobry! Interesuje mnie oferta: ${vacancy.jobTitle} [jobme.pl/oferty/${vacancy.slug}]`;
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;

  const isHousingFree = vacancy.housingType === 'free';
  const isAdvancesWeekly = vacancy.advances === 'weekly';

  return (
    <article className="min-h-screen bg-zinc-50 pt-24 pb-32 md:pb-20">
      <SEOHead vacancy={vacancy} />
      <JobPostingSchema job={vacancy} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* ── Breadcrumb Navigation ── */}
        <nav aria-label="Nawigacja okruszkowa" className="flex items-center gap-2 text-xs md:text-sm text-zinc-500 mb-6 flex-wrap">
          <button
            onClick={() => navigate('/')}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            {currentLanguage === 'ua' ? 'Головна' : 'Strona główna'}
          </button>
          <span>/</span>
          <button
            onClick={() => {
              if (onBackToJobs) onBackToJobs();
              else navigate('/oferty');
            }}
            className="hover:text-primary transition-colors cursor-pointer"
          >
            {currentLanguage === 'ua' ? 'Вакансії' : 'Oferty pracy'}
          </button>
          <span>/</span>
          <span className="text-zinc-900 font-semibold truncate max-w-[240px] sm:max-w-none">
            {vacancy.jobTitle}
          </span>
        </nav>

        {/* ── Main Vacancy Card ── */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm p-6 sm:p-8 md:p-10 mb-8">
          {/* Header Row: Badge, KRAZ, Share Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-zinc-100">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentLanguage === 'ua' ? 'Активний набір' : 'Aktywna rekrutacja'}
              </span>
              <span className="text-xs text-zinc-500 font-medium">
                {currentLanguage === 'ua' ? `KRAZ № ${config.kraz}` : `Certyfikat KRAZ nr ${config.kraz}`}
              </span>
              {vacancy.category && (
                <span className="text-xs bg-zinc-100 text-zinc-700 px-2.5 py-0.5 rounded-md font-medium">
                  {vacancy.category}
                </span>
              )}
            </div>

            {/* Share / Copy Link button */}
            <button
              onClick={handleCopyLink}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
              title="Kopiuj bezpośredni link do oferty"
            >
              {copied ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-emerald-700 font-bold">
                    {currentLanguage === 'ua' ? 'Посилання скопійовано!' : 'Link skopiowany!'}
                  </span>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  <span>{currentLanguage === 'ua' ? 'Поділитися вакансією' : 'Kopiuj link'}</span>
                </>
              )}
            </button>
          </div>

          {/* Job Title & Primary Rates */}
          <div className="mt-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 tracking-tight leading-snug mb-4">
              {vacancy.jobTitle}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3 mb-2">
              <span className="text-2xl sm:text-3xl font-black text-[#8CC63F]">
                {vacancy.salary}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-lg">
                {currentLanguage === 'ua' ? 'Нетто (на руки)' : 'Netto (na rękę)'}
              </span>
            </div>

            {vacancy.salarySub && (
              <p className="text-xs sm:text-sm text-zinc-600 font-medium">
                {vacancy.salarySub}
              </p>
            )}

            {vacancy.salaryMonthlyEstMin && vacancy.salaryMonthlyEstMax && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-700">
                <span className="font-semibold text-zinc-900">
                  {currentLanguage === 'ua' ? 'Орієнтовний дохід у місяць:' : 'Szacowany zarobek miesięczny:'}
                </span>
                <span className="font-bold text-zinc-900">
                  {vacancy.salaryMonthlyEstMin.toLocaleString()} – {vacancy.salaryMonthlyEstMax.toLocaleString()} zł netto
                </span>
              </div>
            )}
          </div>

          {/* ── "Wszystko w 5 sekund" (5-Second Decision Matrix) ── */}
          <div className="mt-8 pt-8 border-t border-zinc-100">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">
              {currentLanguage === 'ua' ? 'Умови вакансії за 5 секунд' : 'Warunki oferty w 5 sekund'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {/* 1. Gdzie? */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase mb-1">
                  <span>📍</span>
                  <span>{currentLanguage === 'ua' ? 'Де?' : 'Gdzie?'}</span>
                </div>
                <p className="font-bold text-zinc-900 text-sm">{vacancy.city || vacancy.location}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{vacancy.voivodeship || 'Polska'}</p>
              </div>

              {/* 2. Za ile? */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase mb-1">
                  <span>💰</span>
                  <span>{currentLanguage === 'ua' ? 'Скільки?' : 'Za ile?'}</span>
                </div>
                <p className="font-bold text-[#659725] text-sm">{vacancy.salary}</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {currentLanguage === 'ua' ? 'Студенти: 31,40 zł брутто' : 'Studenci: 31,40 zł brutto'}
                </p>
              </div>

              {/* 3. Gdzie mieszkam? */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase mb-1">
                  <span>🏠</span>
                  <span>{currentLanguage === 'ua' ? 'Проживання?' : 'Mieszkanie?'}</span>
                </div>
                <p className="font-bold text-zinc-900 text-sm">
                  {isHousingFree
                    ? currentLanguage === 'ua' ? 'Безкоштовне' : 'Darmowe zakwaterowanie'
                    : vacancy.housingPrice
                    ? `${vacancy.housingPrice} zł / mies.`
                    : 'Zgodnie z warunkami oferty'}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {isHousingFree
                    ? currentLanguage === 'ua' ? 'Покої 2–4 особи' : 'Pokoje 2–4 osobowe'
                    : currentLanguage === 'ua' ? 'Відраховується із зарплати' : 'Potrącane z wynagrodzenia'}
                </p>
              </div>

              {/* 4. Grafik / Zmiany */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase mb-1">
                  <span>⏱️</span>
                  <span>{currentLanguage === 'ua' ? 'Графік?' : 'Grafik?'}</span>
                </div>
                <p className="font-bold text-zinc-900 text-sm line-clamp-2">{vacancy.shifts}</p>
              </div>

              {/* 5. Język */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase mb-1">
                  <span>🗣️</span>
                  <span>{currentLanguage === 'ua' ? 'Мова?' : 'Język?'}</span>
                </div>
                <p className="font-bold text-zinc-900 text-sm">
                  {vacancy.languageRequired === 'brak'
                    ? currentLanguage === 'ua' ? 'Польська не потрібна' : 'Brak wymogu polskiego'
                    : currentLanguage === 'ua' ? 'Базова польська' : 'Podstawowy polski'}
                </p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {currentLanguage === 'ua' ? 'Координатор на зв’язку' : 'Koordynator na miejscu'}
                </p>
              </div>

              {/* 6. Umowa i zaliczki */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase mb-1">
                  <span>📄</span>
                  <span>{currentLanguage === 'ua' ? 'Договір?' : 'Umowa?'}</span>
                </div>
                <p className="font-bold text-zinc-900 text-sm">Umowa zlecenie + ZUS</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {isAdvancesWeekly
                    ? currentLanguage === 'ua' ? 'Аванси щотижня' : 'Zaliczki co tydzień'
                    : currentLanguage === 'ua' ? 'Аванс раз на місяць' : 'Zaliczka raz w miesiącu'}
                </p>
              </div>
            </div>
          </div>

          {/* ── Tasks Section (Obowiązki) ── */}
          {Array.isArray(vacancy.tasks) && vacancy.tasks.length > 0 && (
            <div className="mt-8 pt-8 border-t border-zinc-100">
              <h2 className="text-lg font-black text-zinc-900 mb-4">
                {currentLanguage === 'ua' ? 'Ваші обов’язки na stanowisku:' : 'Twoje obowiązki na stanowisku:'}
              </h2>
              <ul className="space-y-2.5">
                {vacancy.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-zinc-700 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-[#659725] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                      ✓
                    </span>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Perks Section (Co oferujemy) ── */}
          {vacancy.perks && (
            <div className="mt-8 pt-8 border-t border-zinc-100">
              <h2 className="text-lg font-black text-zinc-900 mb-3">
                {currentLanguage === 'ua' ? 'Що надає роботодавець:' : 'Co zapewnia pracodawca:'}
              </h2>
              <p className="text-sm text-zinc-700 leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                {vacancy.perks}
              </p>
            </div>
          )}

          {/* ── Trust & Coordinator Guarantee ── */}
          <div className="mt-8 pt-8 border-t border-zinc-100">
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xl font-bold">
                ✓
              </div>
              <div className="text-xs sm:text-sm text-emerald-950">
                <p className="font-bold mb-1">
                  {currentLanguage === 'ua'
                    ? '100% легальне працевлаштування та куратор'
                    : 'Gwarancja legalności i opieka koordynatora'}
                </p>
                <p className="text-emerald-800 leading-relaxed">
                  {currentLanguage === 'ua'
                    ? `JobMe діє згідно з реєстрацією KRAZ nr ${config.kraz}. Повний страховий захист ZUS, допомога з легалізацією та подачею на карту побиту.`
                    : `Zatrudnienie bezpośrednio w oparciu o certyfikat KRAZ nr ${config.kraz}. Pełne ubezpieczenie ZUS, wsparcie w formalnościach legalizacyjnych i bezpłatna pomoc przy karcie pobytu.`}
                </p>
              </div>
            </div>
          </div>

          {/* ── Desktop Application Action Bar ── */}
          <div className="mt-10 pt-8 border-t border-zinc-100">
            <h2 className="text-center text-sm font-bold uppercase tracking-wider text-zinc-500 mb-4">
              {currentLanguage === 'ua' ? 'Оберіть зручний спосіб відгуку' : 'Wybierz sposób aplikacji'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Telegram */}
              <a
                href={tgUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackApplyStart(vacancy.jobTitle, 'telegram');
                  trackChannelClick('telegram', `detail_page_${vacancy.slug}`);
                }}
                className="flex items-center justify-center gap-2 bg-[#229ED9] text-white font-bold text-sm py-3.5 px-4 rounded-xl hover:bg-[#1e8ec3] transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                </svg>
                {currentLanguage === 'ua' ? 'Відгукнутися в Telegram' : 'Aplikuj przez Telegram'}
              </a>

              {/* Smart Lead Form */}
              <button
                type="button"
                onClick={() => {
                  trackApplyStart(vacancy.jobTitle, 'smart_lead');
                  if (onOpenSmartLead) onOpenSmartLead(vacancy);
                }}
                className="flex items-center justify-center gap-2 bg-primary text-zinc-900 font-bold text-sm py-3.5 px-4 rounded-xl hover:bg-primary/90 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                {currentLanguage === 'ua' ? 'Швидка заявка (1 хв)' : 'Szybka aplikacja (1 min)'}
              </button>

              {/* WhatsApp */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackApplyStart(vacancy.jobTitle, 'whatsapp');
                  trackChannelClick('whatsapp', `detail_page_${vacancy.slug}`);
                }}
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm py-3.5 px-4 rounded-xl hover:bg-[#20ba59] transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.63c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.47-1.39-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.12.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.12-.22-.19-.47-.32z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => {
              if (onBackToJobs) onBackToJobs();
              else navigate('/oferty');
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-primary transition-colors cursor-pointer"
          >
            ← {currentLanguage === 'ua' ? 'Повернутися до списку вакансій' : 'Wróć do wszystkich ofert pracy'}
          </button>
        </div>
      </div>

      {/* ── Mobile Sticky Bottom Action Bar ── */}
      <aside aria-label="Aplikacja na ofertę" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 px-4 py-3 shadow-lg">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              trackApplyStart(vacancy.jobTitle, 'telegram_sticky');
              trackChannelClick('telegram', `sticky_${vacancy.slug}`);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#229ED9] text-white font-bold text-xs py-3 px-2 rounded-xl text-center shadow-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
            </svg>
            Telegram
          </a>

          <button
            type="button"
            onClick={() => {
              trackApplyStart(vacancy.jobTitle, 'smart_lead_sticky');
              if (onOpenSmartLead) onOpenSmartLead(vacancy);
            }}
            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-zinc-900 font-bold text-xs py-3 px-2 rounded-xl text-center shadow-sm cursor-pointer"
          >
            <span>⚡</span>
            {currentLanguage === 'ua' ? 'Швидка заявка' : 'Aplikuj'}
          </button>
        </div>
      </aside>
    </article>
  );
}
