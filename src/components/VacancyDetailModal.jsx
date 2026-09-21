import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import config from '../config';
import { trackApplyStart, trackChannelClick } from '../lib/analytics';

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export default function VacancyDetailModal({ vacancy, isOpen, onClose, onOpenSmartLead }) {
  const { t, currentLanguage } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
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

  if (!isOpen || !vacancy) return null;

  const slug = vacancy.slug || '';
  const vacancyUrl = slug ? `${window.location.origin}/oferty/${slug}` : window.location.href;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(vacancyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tgUrl = `https://t.me/${config.telegramUsername}?text=${encodeURIComponent(
    `Cześć! Chcę aplikować na ofertę: ${vacancy.jobTitle} (${vacancy.location || ''})`
  )}`;

  const cleanPhone = config.whatsappNumber || config.phoneRaw || '48574220849';
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Dzień dobry! Interesuje mnie oferta: ${vacancy.jobTitle}`
  )}`;

  const handleApplyTelegram = () => {
    trackApplyStart(vacancy.jobTitle, 'telegram');
    trackChannelClick('telegram', `vacancy_detail_${vacancy.jobTitle}`);
  };

  const handleApplyWhatsApp = () => {
    trackApplyStart(vacancy.jobTitle, 'whatsapp');
    trackChannelClick('whatsapp', `vacancy_detail_${vacancy.jobTitle}`);
  };

  const handleOpenSmartForm = () => {
    trackApplyStart(vacancy.jobTitle, 'smart_lead_form');
    onClose();
    if (onOpenSmartLead) {
      onOpenSmartLead(vacancy);
    }
  };

  const isHousingFree = vacancy.housingType === 'free' || vacancy.housingPrice === 0;
  const isAdvancesWeekly = vacancy.advances === 'weekly';

  return (
    <div
      className="fixed inset-0 z-[1050] flex items-center justify-center p-0 md:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vacancy-detail-title"
      onClick={onClose}
    >
      <div
        className="bg-white md:rounded-3xl shadow-2xl border border-zinc-200 w-full max-w-3xl h-full md:h-auto md:max-h-[92vh] flex flex-col text-left overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top brand line */}
        <div className="h-2 bg-gradient-to-r from-[#8CC63F] via-[#00B4B4] to-[#0088cc] shrink-0" />

        {/* Modal Sticky Top Header */}
        <div className="p-4 md:p-6 pb-3 border-b border-zinc-100 flex items-center justify-between bg-white shrink-0">
          {/* Breadcrumbs */}
          <div className="min-w-0 pr-4">
            <nav className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium truncate mb-1">
              <span>{currentLanguage === 'ua' ? 'Вакансії' : 'Oferty pracy'}</span>
              <span className="text-zinc-300">/</span>
              <span className="text-zinc-600 truncate">{vacancy.location}</span>
            </nav>
            <h2 id="vacancy-detail-title" className="text-lg md:text-2xl font-black text-[#2D2D2D] truncate">
              {vacancy.jobTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {slug && (
              <button
                onClick={handleCopyLink}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors cursor-pointer"
                title="Kopiuj link do oferty"
              >
                {copied ? (
                  <span className="text-emerald-700">✓ Skopiowano</span>
                ) : (
                  <>
                    <Icon name="link" className="text-sm" />
                    <span>Link</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Zamknij"
            >
              <Icon name="close" className="text-xl" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 md:p-8 overflow-y-auto space-y-8 flex-1">
          {/* Top Highlights Banner */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-5 md:p-6 rounded-2xl md:rounded-3xl relative overflow-hidden shadow-lg">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-black border border-green-500/30 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {currentLanguage === 'ua' ? `Активний набір • KRAZ № ${config.kraz}` : `Aktywna rekrutacja • KRAZ nr ${config.kraz}`}
                </span>
                <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold">
                  {currentLanguage === 'ua' ? 'Орієнтовний дохід' : 'Szacowane wynagrodzenie'}
                </p>
                <h3 className="text-2xl md:text-3xl font-black text-[#8CC63F] tracking-tight">
                  {vacancy.salary}
                </h3>
                {vacancy.salarySub && (
                  <p className="text-xs text-zinc-300 mt-1">{vacancy.salarySub}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-zinc-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <Icon name="verified_user" className="text-[#00B4B4] text-base" />
                  Legalna praca (ZUS)
                </span>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-zinc-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <Icon name="payments" className="text-amber-400 text-base" />
                  {isAdvancesWeekly
                    ? (currentLanguage === 'ua' ? 'Аванси щотижня' : 'Zaliczki co tydzień')
                    : (currentLanguage === 'ua' ? 'Аванс раз на місяць' : 'Zaliczka raz w miesiącu')}
                </span>
              </div>
            </div>
          </div>

          {/* 6-Tile "Wszystko w 5 sekund" Decision Matrix */}
          <div>
            <h4 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <Icon name="fact_check" className="text-[#00B4B4] text-lg" />
              {currentLanguage === 'ua' ? 'Ключові умови за 5 секунд' : 'Wszystkie kluczowe warunki w 5 sekund'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {/* 1. Gdzie */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <Icon name="location_on" className="text-[#00B4B4] text-base" />
                  {currentLanguage === 'ua' ? 'Де?' : 'Gdzie?'}
                </div>
                <p className="font-extrabold text-sm text-[#2D2D2D]">{vacancy.location}</p>
                <p className="text-[11px] text-zinc-500">
                  {currentLanguage === 'ua' ? 'Місце виконання роботи' : 'Miejsce wykonywania pracy'}
                </p>
              </div>

              {/* 2. Ile */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <Icon name="account_balance_wallet" className="text-[#5a8a00] text-base" />
                  {currentLanguage === 'ua' ? 'Скільки?' : 'Ile?'}
                </div>
                <p className="font-extrabold text-sm text-[#5a8a00]">{vacancy.salary}</p>
                <p className="text-[11px] text-zinc-500">
                  {currentLanguage === 'ua' ? 'Ставка на руки (netto)' : 'Stawka na rękę (netto)'}
                </p>
              </div>

              {/* 3. Mieszkanie */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <Icon name="home" className="text-[#00B4B4] text-base" />
                  {currentLanguage === 'ua' ? 'Житло?' : 'Mieszkanie?'}
                </div>
                <p className="font-extrabold text-sm text-[#2D2D2D] line-clamp-1">
                  {isHousingFree
                    ? (currentLanguage === 'ua' ? 'Безкоштовне проживання' : 'Darmowe zakwaterowanie')
                    : vacancy.housingPrice
                    ? `${vacancy.housingPrice} zł / mies.`
                    : 'Zgodnie z warunkami oferty'}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {isHousingFree
                    ? (currentLanguage === 'ua' ? 'Безкоштовно від роботодавця' : 'Bezpłatne od pracodawcy')
                    : (currentLanguage === 'ua' ? 'Покривається частково із зарплати' : 'Potrącane z wynagrodzenia')}
                </p>
              </div>

              {/* 4. Grafik */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <Icon name="schedule" className="text-[#00B4B4] text-base" />
                  {currentLanguage === 'ua' ? 'Графік?' : 'Grafik?'}
                </div>
                <p className="font-extrabold text-sm text-[#2D2D2D] line-clamp-1">{vacancy.shifts}</p>
                <p className="text-[11px] text-zinc-500">
                  {currentLanguage === 'ua' ? 'Змінний графік' : 'System zmianowy'}
                </p>
              </div>

              {/* 5. Język */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <Icon name="translate" className="text-[#00B4B4] text-base" />
                  {currentLanguage === 'ua' ? 'Польська мова?' : 'Język polski?'}
                </div>
                <p className="font-extrabold text-sm text-[#2D2D2D]">
                  {vacancy.languageRequired === 'podstawowy'
                    ? (currentLanguage === 'ua' ? 'Базова польська' : 'Podstawowy')
                    : (currentLanguage === 'ua' ? 'Не вимагається' : 'Brak wymogu')}
                </p>
                <p className="text-[11px] text-zinc-500">
                  {currentLanguage === 'ua' ? 'Координатор на зв’язку' : 'Koordynator na miejscu'}
                </p>
              </div>

              {/* 6. Umowa */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-1">
                <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider">
                  <Icon name="description" className="text-[#00B4B4] text-base" />
                  {currentLanguage === 'ua' ? 'Договір?' : 'Umowa?'}
                </div>
                <p className="font-extrabold text-sm text-[#2D2D2D]">{vacancy.contract || 'Umowa zlecenie'}</p>
                <p className="text-[11px] text-zinc-500">
                  {currentLanguage === 'ua' ? 'Повний ZUS, страхування' : 'Pełen ZUS i ubezpieczenie'}
                </p>
              </div>
            </div>
          </div>

          {/* Obowiązki (Tasks) */}
          {Array.isArray(vacancy.tasks) && vacancy.tasks.length > 0 && (
            <div>
              <h4 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icon name="task_alt" className="text-[#8CC63F] text-lg" />
                {currentLanguage === 'ua' ? 'Що потрібно робити:' : 'Zakres obowiązków:'}
              </h4>
              <ul className="space-y-2 bg-zinc-50 p-4 md:p-5 rounded-2xl border border-zinc-200/80">
                {vacancy.tasks.map((task, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-zinc-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8CC63F] mt-2 shrink-0" />
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefity i Dodatki (Perks) */}
          {vacancy.perks && (
            <div>
              <h4 className="text-sm font-extrabold text-zinc-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Icon name="star" className="text-amber-500 text-lg" />
                {currentLanguage === 'ua' ? 'Що ми гарантуємо:' : 'Co gwarantujemy:'}
              </h4>
              <p className="text-xs md:text-sm text-zinc-700 bg-amber-50/60 p-4 md:p-5 rounded-2xl border border-amber-200/70 leading-relaxed">
                {vacancy.perks}
              </p>
            </div>
          )}

          {/* Koordynator i Wsparcie */}
          <div className="p-4 md:p-5 rounded-2xl bg-zinc-100/80 border border-zinc-200 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-[#2D2D2D] shrink-0 font-bold">
              <Icon name="support_agent" className="text-2xl text-[#5a8a00]" />
            </div>
            <div className="text-xs md:text-sm text-zinc-600 leading-relaxed">
              <p className="font-extrabold text-[#2D2D2D] mb-0.5">
                {currentLanguage === 'ua' ? 'Персональний координатор на весь термін роботи' : 'Dedykowany koordynator przez cały okres zatrudnienia'}
              </p>
              <p>
                {currentLanguage === 'ua'
                  ? 'Зустріч на вокзалі, поселення в житло, оформлення банківської картки, PESEL та подання на карту побиту.'
                  : 'Pomoc w zakwaterowaniu, wyrobieniu PESEL, otwarciu konta w banku oraz złożeniu wniosku o kartę pobytu.'}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Action Bar (Desktop + Mobile) */}
        <div className="p-4 md:p-5 bg-white border-t border-zinc-200 flex flex-col sm:flex-row items-center gap-3 shrink-0 shadow-lg">
          {/* Priority 1: Telegram Direct */}
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleApplyTelegram}
            className="w-full sm:flex-1 flex items-center justify-center gap-2.5 bg-[#0088cc] hover:bg-[#0077b3] text-white font-black text-sm md:text-base py-3.5 px-5 rounded-xl shadow-md shadow-[#0088cc]/20 transition-all cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
            </svg>
            <span>{currentLanguage === 'ua' ? 'Відгукнутися в Telegram ⚡' : 'Aplikuj w Telegramie ⚡'}</span>
          </a>

          {/* Priority 2: Smart Lead Form Prefill */}
          <button
            onClick={handleOpenSmartForm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#8CC63F] hover:bg-[#7ab335] text-[#2D2D2D] font-black text-sm py-3.5 px-5 rounded-xl shadow-md shadow-primary/20 transition-all cursor-pointer"
          >
            <Icon name="bolt" className="text-base" />
            <span>{currentLanguage === 'ua' ? 'Швидка заявка (30 сек)' : 'Szybka aplikacja (30 sek)'}</span>
          </button>

          {/* Priority 3: WhatsApp direct */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleApplyWhatsApp}
            className="hidden sm:inline-flex items-center justify-center p-3.5 rounded-xl border border-zinc-200 text-zinc-600 hover:text-[#25D366] hover:border-[#25D366] transition-colors cursor-pointer"
            title="Napisz na WhatsApp"
            aria-label="WhatsApp"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
