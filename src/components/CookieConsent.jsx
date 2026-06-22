import React, { useState, useEffect } from 'react';
import config from '../config';

// ── helpers ────────────────────────────────────────────────────
const STORAGE_KEY = 'jobme_cookie_consent';

function loadConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}

function saveConsent(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (e) { /* ignore */ }
}

function applyConsent(consent) {
  // GA4 consent
  if (typeof window.gtag === 'function') {
    const analyticsGranted = !!consent.analytics;
    window.gtag('consent', 'update', {
      analytics_storage: analyticsGranted ? 'granted' : 'denied',
      ad_storage: consent.marketing ? 'granted' : 'denied',
      ad_user_data: consent.marketing ? 'granted' : 'denied',
      ad_personalization: consent.marketing ? 'granted' : 'denied',
    });
  }

  // Meta Pixel
  if (typeof window.fbq === 'function') {
    if (consent.marketing) {
      window.fbq('consent', 'grant');
    } else {
      window.fbq('consent', 'revoke');
    }
  }
}

// ── text content ────────────────────────────────────────────────
const texts = {
  pl: {
    title: 'Szanujemy Twoją prywatność',
    desc: 'Używamy plików cookie i podobnych technologii, aby zapewnić prawidłowe działanie strony, analizować ruch (Google Analytics) oraz wyświetlać spersonalizowane reklamy (Meta Pixel). Klikając „Akceptuję wszystkie”, wyrażasz zgodę na ich użycie.',
    acceptAll: 'Akceptuję wszystkie',
    rejectAll: 'Tylko niezbędne',
    settings: 'Ustawienia',
    save: 'Zapisz ustawienia',
    necessaryTitle: 'Niezbędne',
    necessaryDesc: 'Wymagane do prawidłowego działania strony. Nie można ich wyłączyć.',
    analyticsTitle: 'Analityczne',
    analyticsDesc: 'Google Analytics — pomaga nam zrozumieć, jak użytkownicy korzystają ze strony.',
    marketingTitle: 'Marketingowe',
    marketingDesc: 'Meta Pixel — pozwala mierzyć skuteczność reklam i docierać do zainteresowanych osób.',
  },
  ua: {
    title: 'Ми поважаємо вашу конфіденційність',
    desc: 'Ми використовуємо файли cookie та подібні технології для забезпечення роботи сайту, аналізу трафіку (Google Analytics) та показу персоналізованої реклами (Meta Pixel). Натискаючи «Прийняти всі», ви погоджуєтесь на їх використання.',
    acceptAll: 'Прийняти всі',
    rejectAll: 'Тільки необхідні',
    settings: 'Налаштування',
    save: 'Зберегти налаштування',
    necessaryTitle: 'Необхідні',
    necessaryDesc: 'Потрібні для коректної роботи сайту. Їх не можна вимкнути.',
    analyticsTitle: 'Аналітичні',
    analyticsDesc: 'Google Analytics — допомагає зрозуміти, як користувачі взаємодіють із сайтом.',
    marketingTitle: 'Маркетингові',
    marketingDesc: 'Meta Pixel — дозволяє вимірювати ефективність реклами та знаходити зацікавлених людей.',
  },
  en: {
    title: 'We respect your privacy',
    desc: 'We use cookies and similar technologies to ensure the site works properly, analyse traffic (Google Analytics) and display personalised ads (Meta Pixel). By clicking "Accept all", you agree to their use.',
    acceptAll: 'Accept all',
    rejectAll: 'Essential only',
    settings: 'Settings',
    save: 'Save settings',
    necessaryTitle: 'Essential',
    necessaryDesc: 'Required for the website to function properly. Cannot be disabled.',
    analyticsTitle: 'Analytics',
    analyticsDesc: 'Google Analytics — helps us understand how users interact with the site.',
    marketingTitle: 'Marketing',
    marketingDesc: 'Meta Pixel — allows us to measure ad performance and reach interested people.',
  },
};

// ── component ───────────────────────────────────────────────────
export default function CookieConsent() {
  const [saved, setSaved] = useState(loadConsent());       // null = no decision yet
  const [showSettings, setShowSettings] = useState(false); // detailed panel open
  const [draft, setDraft] = useState({ necessary: true, analytics: true, marketing: true });
  const lang = (() => {
    const htmlLang = document.documentElement.lang;
    return texts[htmlLang] ? htmlLang : 'pl';
  })();

  const t = texts[lang];

  // apply consent on mount if already saved
  useEffect(() => {
    if (saved) applyConsent(saved);
  }, []);

  const handleAcceptAll = () => {
    const consent = { necessary: true, analytics: true, marketing: true };
    saveConsent(consent);
    applyConsent(consent);
    setSaved(consent);
  };

  const handleRejectAll = () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    saveConsent(consent);
    applyConsent(consent);
    setSaved(consent);
  };

  const openSettings = () => {
    setDraft(saved || { necessary: true, analytics: true, marketing: true });
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    saveConsent(draft);
    applyConsent(draft);
    setSaved(draft);
    setShowSettings(false);
  };

  // Already decided — nothing to show
  if (saved && !showSettings) return null;

  return (
    <>
      {/* ── Bottom Banner ──────────────────────────────────── */}
      {!saved && !showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-[1000] animate-slide-up">
          <div className="bg-white border-t border-zinc-200 shadow-2xl px-4 py-4 md:px-gutter md:py-5">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#2D2D2D] text-sm mb-1">{t.title}</h3>
                <p className="text-zinc-600 text-xs md:text-sm leading-relaxed">{t.desc}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-xs md:text-sm font-bold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer"
                >
                  {t.rejectAll}
                </button>
                <button
                  onClick={openSettings}
                  className="px-4 py-2 text-xs md:text-sm font-bold text-zinc-600 bg-white border border-zinc-300 hover:bg-zinc-50 rounded-xl transition-colors cursor-pointer"
                >
                  {t.settings}
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2 text-xs md:text-sm font-bold text-[#2D2D2D] bg-[#8CC63F] hover:bg-[#7ab335] rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  {t.acceptAll}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Settings modal ─────────────────────────────────── */}
      {showSettings && (
        <div className="fixed inset-0 z-[1100] flex items-end md:items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
          {/* panel */}
          <div className="relative bg-white rounded-t-2xl md:rounded-2xl shadow-2xl w-full md:max-w-lg max-h-[85vh] overflow-y-auto p-6 md:p-8 animate-slide-up">
            <h3 className="font-extrabold text-lg text-[#2D2D2D] mb-2">{t.title}</h3>
            <p className="text-zinc-500 text-sm mb-6">{t.desc}</p>

            {/* Essential — always on */}
            <div className="flex items-start justify-between gap-4 py-4 border-b border-zinc-100">
              <div className="min-w-0">
                <h4 className="font-bold text-[#2D2D2D] text-sm">{t.necessaryTitle}</h4>
                <p className="text-zinc-500 text-xs mt-0.5">{t.necessaryDesc}</p>
              </div>
              <div className="w-10 h-6 rounded-full bg-[#8CC63F] flex items-center shrink-0 mt-0.5 opacity-60">
                <div className="w-4 h-4 rounded-full bg-white shadow ml-[22px]" />
              </div>
            </div>

            {/* Analytics toggle */}
            <div className="flex items-start justify-between gap-4 py-4 border-b border-zinc-100">
              <div className="min-w-0">
                <h4 className="font-bold text-[#2D2D2D] text-sm">{t.analyticsTitle}</h4>
                <p className="text-zinc-500 text-xs mt-0.5">{t.analyticsDesc}</p>
              </div>
              <button
                onClick={() => setDraft({ ...draft, analytics: !draft.analytics })}
                className={`w-10 h-6 rounded-full transition-colors shrink-0 mt-0.5 cursor-pointer ${
                  draft.analytics ? 'bg-[#8CC63F]' : 'bg-zinc-300'
                }`}
                role="switch"
                aria-checked={draft.analytics}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${draft.analytics ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
              </button>
            </div>

            {/* Marketing toggle */}
            <div className="flex items-start justify-between gap-4 py-4 border-b border-zinc-100">
              <div className="min-w-0">
                <h4 className="font-bold text-[#2D2D2D] text-sm">{t.marketingTitle}</h4>
                <p className="text-zinc-500 text-xs mt-0.5">{t.marketingDesc}</p>
              </div>
              <button
                onClick={() => setDraft({ ...draft, marketing: !draft.marketing })}
                className={`w-10 h-6 rounded-full transition-colors shrink-0 mt-0.5 cursor-pointer ${
                  draft.marketing ? 'bg-[#8CC63F]' : 'bg-zinc-300'
                }`}
                role="switch"
                aria-checked={draft.marketing}
              >
                <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${draft.marketing ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
              </button>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={() => { handleAcceptAll(); setShowSettings(false); }}
                className="flex-1 min-w-[120px] py-3 px-4 text-sm font-bold text-[#2D2D2D] bg-[#8CC63F] hover:bg-[#7ab335] rounded-xl transition-colors cursor-pointer"
              >
                {t.acceptAll}
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 min-w-[120px] py-3 px-4 text-sm font-bold text-white bg-[#2D2D2D] hover:bg-black rounded-xl transition-colors cursor-pointer"
              >
                {t.save}
              </button>
            </div>

            <button
              onClick={() => setShowSettings(false)}
              className="mt-3 w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer py-2"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}
    </>
  );
}
