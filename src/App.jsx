import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import FadeIn from './components/FadeIn';
import HowItWorks from './components/HowItWorks';
import FAQSection from './components/FAQSection';
import StatsBanner from './components/StatsBanner';
import Sectors from './components/Sectors';
import LegalizationTimeline from './components/LegalizationTimeline';
import Upskilling from './components/Upskilling';
import ContactForm from './components/ContactForm';
import JobsWidget from './components/JobsWidget';
import JobsPage from './components/JobsPage';
import PrivacyPage from './components/PrivacyPage';
import CookieConsent from './components/CookieConsent';
import NotFoundPage from './components/NotFoundPage';
import { useLanguage } from './context/LanguageContext';
import config from './config';

// ── floating chat buttons + scroll-to-top ─────────────────────
function FloatingContactButtons({ t, jobTitle }) {
  const defaultMsg = 'Hej! Chciałbym dowiedzieć się więcej o ofertach pracy.';
  const waMsg = jobTitle
    ? `Hej! Jestem zainteresowany ofertą: ${jobTitle}`
    : defaultMsg;
  const waUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;
  const tgUrl = `https://t.me/${config.telegramUsername}`;
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-6 right-5 z-[900] flex flex-col gap-3 items-end">
      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        aria-label="Do góry"
        className={`w-12 h-12 rounded-full bg-white border border-zinc-200 shadow-lg flex items-center justify-center
                   hover:shadow-xl hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer
                   ${showTop ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8CC63F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
      {/* Telegram */}
      <a
        href={tgUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center bg-[#0088cc] hover:bg-[#0077b3] text-white
                   rounded-full shadow-xl hover:shadow-2xl transition-all duration-300
                   hover:-translate-y-0.5 overflow-hidden"
        aria-label="Telegram"
      >
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
          </svg>
        </div>
        <span className="inline-block text-sm font-bold whitespace-nowrap max-w-0 overflow-hidden
                         group-hover:max-w-xs group-hover:pl-2 group-hover:pr-4 transition-all duration-300 ease-in-out">
          Telegram
        </span>
      </a>

      {/* WhatsApp */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center bg-[#25D366] hover:bg-[#1da851] text-white
                   rounded-full shadow-xl hover:shadow-2xl transition-all duration-300
                   hover:-translate-y-0.5 overflow-hidden"
        aria-label="WhatsApp"
      >
        <div className="w-12 h-12 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.111.546 4.09 1.5 5.816L0 24l6.34-1.488A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.027-1.387l-.36-.213-3.761.883.898-3.669-.234-.374A9.794 9.794 0 012.182 12C2.182 6.575 6.575 2.182 12 2.182S21.818 6.575 21.818 12 17.425 21.818 12 21.818z"/>
          </svg>
        </div>
        <span className="inline-block text-sm font-bold whitespace-nowrap max-w-0 overflow-hidden
                         group-hover:max-w-xs group-hover:pl-2 group-hover:pr-4 transition-all duration-300 ease-in-out">
          WhatsApp
        </span>
      </a>
    </div>
  );
}

function App() {
  const [contactTab, setContactTab] = useState('kandydat');
  const [prefillMessage, setPrefillMessage] = useState('');
  const [page, setPage] = useState('home');          // 'home' | 'jobs' | 'privacy' | '404'
  const [highlightJobIdx, setHighlightJobIdx] = useState(null);
  const [lastJobTitle, setLastJobTitle] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, currentLanguage, setCurrentLanguage } = useLanguage();

  useEffect(() => {
    if (currentLanguage === 'ua') {
      setContactTab('kandydat');
    }
  }, [currentLanguage]);

  // Detect unknown hash routes → show 404
  useEffect(() => {
    const knownHashes = ['', '#about', '#services', '#advantages', '#team', '#contact',
                         '#oferty', '#legalization', '#upskilling', '#jak-to-dziala', '#faq', '#sectors'];
    const checkHash = () => {
      if (page === 'home' && window.location.hash && !knownHashes.includes(window.location.hash)) {
        setPage('404');
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, [page]);

  const handleScrollToContact = (tab, jobTitle) => {
    setPage('home');
    setContactTab(tab);
    if (jobTitle) setLastJobTitle(jobTitle);
    setTimeout(() => {
      const element = document.getElementById('contact');
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleNavigateToJobs = (jobIdx, jobTitle) => {
    setHighlightJobIdx(jobIdx);
    if (jobTitle) setLastJobTitle(jobTitle);
    setPage('jobs');
    window.scrollTo({ top: 0 });
  };

  const handleBackToHome = () => {
    setPage('home');
    setTimeout(() => {
      const el = document.getElementById('oferty');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const LangButton = ({ lang }) => (
    <button
      onClick={() => setCurrentLanguage(lang)}
      className={`px-2 py-1 text-sm font-bold uppercase transition-all duration-300 rounded-md ${
        currentLanguage === lang
          ? 'text-primary bg-primary/10'
          : 'text-zinc-400 hover:text-zinc-700'
      }`}
    >
      {lang}
    </button>
  );

  return (
    <div className="text-on-surface bg-background-white font-body-md">

      {/* ── TopNavBar (always visible) ────────────────────────── */}
      <nav className="bg-background-white/90 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm">
        <div className="flex justify-between items-center px-gutter py-4 max-w-7xl mx-auto">
          <button
            onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            aria-label="Strona główna"
            className="cursor-pointer shrink-0"
          >
            <img src="/logo.webp" alt="JobMe Logo" className="h-8 md:h-10 w-auto object-contain" />
          </button>

          {/* Desktop navigation */}
          <div className="hidden md:flex gap-8 items-center">
            {page === 'home' ? (
              <>
                <a className="font-button text-button text-primary border-b-2 border-primary pb-1" href="#about">{t('nav.about')}</a>
                <a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#services">{t('nav.services')}</a>
                <a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#advantages">{t('nav.advantages')}</a>
                <a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#team">{t('nav.team')}</a>
                <a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#contact">{t('nav.contact')}</a>
              </>
            ) : (
              <button
                onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="font-button text-button text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                ← {t('nav.about')}
              </button>
            )}
            <button
              onClick={() => handleNavigateToJobs(null)}
              className={`font-button text-button font-bold transition-colors cursor-pointer px-3 py-1.5 rounded-lg
                ${page === 'jobs'
                  ? 'text-primary bg-primary/10'
                  : 'text-primary hover:bg-primary/10'}`}
            >
              {t('nav.jobs')}
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher (desktop) */}
            <div className="hidden md:flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg p-1 mr-2">
              <LangButton lang="pl" />
              <LangButton lang="ua" />
              <LangButton lang="en" />
            </div>

            {/* CTA button (desktop) */}
            <button
              onClick={() => {
                if (window.gtag) window.gtag('event', 'click_start_now');
                if (window.fbq) window.fbq('trackCustom', 'ClickStartNow');
                handleScrollToContact('kandydat');
              }}
              className="hidden md:flex bg-primary-container text-on-primary-container font-button text-button px-6 py-3 rounded-xl hover:opacity-80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {t('nav.cta')}
            </button>

            {/* Hamburger button (mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              aria-expanded={mobileMenuOpen}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu (drawer) */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-gutter pb-6 space-y-4 bg-white border-t border-zinc-100">
            {/* Language Switcher (mobile) */}
            <div className="flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg p-1 w-fit pt-4">
              <LangButton lang="pl" />
              <LangButton lang="ua" />
              <LangButton lang="en" />
            </div>

            {page === 'home' ? (
              <div className="flex flex-col gap-2">
                {[
                  { href: '#about', label: t('nav.about') },
                  { href: '#services', label: t('nav.services') },
                  { href: '#advantages', label: t('nav.advantages') },
                  { href: '#team', label: t('nav.team') },
                  { href: '#contact', label: t('nav.contact') },
                ].map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2.5 px-4 rounded-xl font-button text-button text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                    {label}
                  </a>
                ))}
              </div>
            ) : (
              <button
                onClick={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileMenuOpen(false); }}
                className="block py-2.5 px-4 rounded-xl font-button text-button text-on-surface-variant hover:text-primary transition-colors cursor-pointer text-left w-full"
              >
                ← {t('nav.about')}
              </button>
            )}

            <button
              onClick={() => { handleNavigateToJobs(null); setMobileMenuOpen(false); }}
              className={`block w-full text-left py-2.5 px-4 rounded-xl font-button text-button font-bold transition-colors cursor-pointer
                ${page === 'jobs' ? 'text-primary bg-primary/10' : 'text-primary hover:bg-primary/10'}`}
            >
              {t('nav.jobs')}
            </button>

            {/* Mobile CTA */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (window.gtag) window.gtag('event', 'click_start_now');
                if (window.fbq) window.fbq('trackCustom', 'ClickStartNow');
                handleScrollToContact('kandydat');
              }}
              className="w-full bg-primary-container text-on-primary-container font-button text-button px-6 py-3 rounded-xl hover:opacity-80 transition-all duration-300 cursor-pointer"
            >
              {t('nav.cta')}
            </button>
          </div>
        </div>
      </nav>

      {/* ── JOBS PAGE ─────────────────────────────────────────── */}
      {page === 'jobs' && (
        <JobsPage
          onBack={handleBackToHome}
          onApply={(msg) => handleScrollToContact('kandydat', msg)}
          highlightIdx={highlightJobIdx}
        />
      )}

      {/* ── PRIVACY PAGE ───────────────────────────────────────── */}
      {page === 'privacy' && (
        <PrivacyPage onBack={() => setPage('home')} />
      )}

      {/* ── 404 PAGE ──────────────────────────────────────────── */}
      {page === '404' && (
        <NotFoundPage onNavigateHome={() => { setPage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      )}

      {/* ── HOME PAGE ─────────────────────────────────────────── */}
      {page === 'home' && (
        <>
          <div className="pt-[100px] sm:pt-[80px]">
            <Hero onCtaClick={handleScrollToContact} />
            <StatsBanner />
          </div>

          <JobsWidget
            onApply={(msg) => handleScrollToContact('kandydat', msg)}
            onNavigateToJobs={handleNavigateToJobs}
          />

          {/* About Section */}
          <section className="bg-surface-contrast py-20 md:py-28 px-gutter" id="about">
            <FadeIn>
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                  {/* Left Column: Title & Mission */}
                  <div className="lg:col-span-5 space-y-6 text-left">
                    <span className="text-primary font-label-bold text-label-bold uppercase tracking-wider">{t('about.tag')}</span>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D2D2D] leading-tight">
                      {t('about.title')}
                    </h2>
                    <h3 className="text-lg md:text-xl font-bold text-zinc-500">
                      {t('about.subtitle')}
                    </h3>
                    <p className="font-body-lg text-body-lg text-zinc-700 leading-relaxed text-base md:text-lg">
                      {t('about.desc')}
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => handleScrollToContact('kandydat')}
                        className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white hover:bg-zinc-800 font-bold px-6 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                      >
                        {t('nav.cta')}
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>

                  {/* Right Column: 3 Pillars Grid */}
                  <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6">
                    {[
                      { icon: 'shield', color: 'bg-primary/10 text-primary', titleKey: 'about.value1Title', descKey: 'about.value1Desc' },
                      { icon: 'volunteer_activism', color: 'bg-[#00B4B4]/10 text-[#00B4B4]', titleKey: 'about.value2Title', descKey: 'about.value2Desc' },
                      { icon: 'hub', color: 'bg-secondary-container text-on-secondary-container', titleKey: 'about.value3Title', descKey: 'about.value3Desc' },
                    ].map(({ icon, color, titleKey, descKey }) => (
                      <div key={titleKey} className="bg-white p-6 md:p-8 rounded-2xl border border-zinc-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start">
                        <div className={`${color} p-4 rounded-xl shrink-0`}>
                          <span className="material-symbols-outlined text-3xl">{icon}</span>
                        </div>
                        <div className="space-y-2 text-left">
                          <h4 className="text-xl font-bold text-[#2D2D2D]">{t(titleKey)}</h4>
                          <p className="text-zinc-600 text-sm md:text-base leading-relaxed">{t(descKey)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* Services Section */}
          <section className="bg-background-white py-20 md:py-24 px-gutter" id="services">
            <FadeIn>
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] text-center mb-16">{t('services.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { icon: 'business_center', bg: 'bg-secondary-container', text: 'text-on-secondary-container', titleKey: 'services.s1Title', descKey: 'services.s1Desc' },
                    { icon: 'school', bg: 'bg-primary-fixed', text: 'text-on-primary-fixed', titleKey: 'services.s2Title', descKey: 'services.s2Desc' },
                    { icon: 'groups', bg: 'bg-tertiary-fixed', text: 'text-on-tertiary-fixed', titleKey: 'services.s3Title', descKey: 'services.s3Desc' },
                  ].map(({ icon, bg, text, titleKey, descKey }) => (
                    <div key={titleKey} className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                      <div className={`${bg} p-4 rounded-xl mb-6`}>
                        <span className={`material-symbols-outlined ${text} scale-150`}>{icon}</span>
                      </div>
                      <h3 className="font-headline-md text-headline-md mb-4">{t(titleKey)}</h3>
                      <p className="text-zinc-700 text-base leading-relaxed">{t(descKey)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </section>

          <Sectors />
          <LegalizationTimeline />
          <HowItWorks />

          {/* Advantages Section */}
          <section className="bg-surface-contrast py-20 md:py-24 px-gutter" id="advantages">
            <FadeIn>
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-12">{t('advantages.title')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[
                        { icon: 'verified_user', titleKey: 'advantages.a1Title', descKey: 'advantages.a1Desc' },
                        { icon: 'support_agent', titleKey: 'advantages.a2Title', descKey: 'advantages.a2Desc' },
                        { icon: 'description', titleKey: 'advantages.a3Title', descKey: 'advantages.a3Desc' },
                        { icon: 'devices', titleKey: 'advantages.a4Title', descKey: 'advantages.a4Desc' },
                      ].map(({ icon, titleKey, descKey }) => (
                        <div key={titleKey} className="space-y-3">
                          <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
                          <h3 className="font-label-bold text-label-bold text-on-surface">{t(titleKey)}</h3>
                          <p className="text-zinc-700 text-base leading-relaxed">{t(descKey)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <img alt="Zaufanie i profesjonalizm" loading="lazy" className="rounded-xxl shadow-xl border-8 border-white object-cover aspect-[4/3] w-full" src="https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&q=80&w=800" />
                  </div>
                </div>
              </div>
            </FadeIn>
          </section>

          <Upskilling />

          {/* Team Section */}
          <section className="bg-background-white py-20 md:py-24 px-gutter" id="team">
            <FadeIn>
              <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-4">{t('team.title')}</h2>
                <p className="text-zinc-700 text-base md:text-lg mb-16 max-w-2xl mx-auto">{t('team.desc')}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { name: 'Michał', roleKey: 'team.t1Role', descKey: 'team.t1Desc', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2e4MoBV6ODja8n4DkU_m9XpJXfYE8P9F05ZKP5Uqoef5qPjyy3J8YOWCR5BygPHwbqy7gYxW2zaI5wBHnWP4dJGQCO_cP149Qxtwf-wKeKb5KcsawMOp0DYST7G-hvWbD8B8AaVBajlhkck3n9KBiyheB4O4qBctGiRqM-xSyAb14VegfS3S_1ujy7SXSKlcz2HEl741kIS8j8ikP0SvuQ--ktXA_w3NgJ2Zh3AszTCWTTUR0hl4tNKhLdcWUtapykorhAlopxig' },
                    { name: 'Anna', roleKey: 'team.t2Role', descKey: 'team.t2Desc', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATy_o5csBvnV1AQdi6k6zH_lXPDJqOnluCjKaGQ_3KKCn1PHQCDnfSDciVnpqN-2yPsoNMKpIguPqQrZIrcF906rETOWnr7rzWBfSf3cZOTpi0XKmYHtkJ0-XaelNLA-1f30DYAqzqzkQgSNX6JhZ1gjTVrkEP_s5FOyl8pa_NCXbnjui-ib8aqreM-N1KEdhhNSNN_4b_jMew63xJPMG3chAyBhabFJMK3vIGdQ25yFT4Y1WHmQ82bcB73t17Avr-y2KTs3Y6FDc' },
                    { name: 'Tomasz', roleKey: 'team.t3Role', descKey: 'team.t3Desc', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3oe4bYrI5JrB8a-YWPMLiq93padLNrqsL31IokEcr_dim2VxkBULhMv9eXAXa3Q2oLDntmZ9ahQTnRhYanI5_NkEVLcabZPadS3_Cx31ChnRQJj5CIpJeMcvQPv1uT3OFbKCPPJMgFN6nxPtS-FOmokJnVPNAsXA-1L-SsqAr7ikTvYlocVCUe8OQIByweBB7FbK9q9GKzA5_VStfOwRUuer1pD1idTJZenFbdi9bGgGYsNwa59jVrgpeW6eXlxRs908ietv4aJg' },
                  ].map(({ name, roleKey, descKey, src }) => (
                    <div key={name} className="bg-white rounded-xxl p-6 text-center group border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                      <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-[2rem] border-4 border-white shadow-md">
                        <img alt={name} loading="lazy" className="w-full h-full object-cover" src={src} />
                      </div>
                      <h3 className="font-headline-md text-headline-md">{name}</h3>
                      <p className="text-primary font-label-bold mb-4">{t(roleKey)}</p>
                      <p className="text-zinc-700 text-base italic leading-relaxed">{t(descKey)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </section>

          {/* Testimonials Section */}
          <section className="bg-surface-contrast py-20 md:py-24 px-gutter">
            <FadeIn>
              <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] text-center mb-16">{t('testimonials.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { stars: 5, textKey: 'testimonials.r1Text', nameKey: 'testimonials.r1Name', roleKey: 'testimonials.r1Role' },
                    { stars: 4, textKey: 'testimonials.r2Text', nameKey: 'testimonials.r2Name', roleKey: 'testimonials.r2Role' },
                    { stars: 5, textKey: 'testimonials.r3Text', nameKey: 'testimonials.r3Name', roleKey: 'testimonials.r3Role' },
                  ].map(({ stars, textKey, nameKey, roleKey }, i) => (
                    <div key={i} className="bg-white p-8 rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative z-0 overflow-hidden">
                      <span className="material-symbols-outlined absolute -top-4 -left-2 text-9xl text-zinc-100/50 -z-10">format_quote</span>
                      <div className="flex gap-1 mb-4">
                        {[...Array(stars)].map((_, si) => (
                          <span key={si} className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                        {stars < 5 && <span className="material-symbols-outlined text-zinc-300" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                      </div>
                      <p className="font-body-md text-body-md text-on-surface mb-6">"{t(textKey)}"</p>
                      <p className="font-label-bold text-label-bold">— {t(nameKey)} {roleKey ? `(${t(roleKey)})` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </section>

          <FAQSection />
          <ContactForm activeTab={contactTab} onTabChange={setContactTab} prefillMessage={prefillMessage} />

          {/* Footer */}
          <footer className="bg-[#1a1a1a] text-zinc-300">
            <div className="max-w-7xl mx-auto px-gutter py-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Brand column */}
                <div className="space-y-4">
                  <img src="/logo.webp" alt="JobMe Logo" className="h-7 md:h-8 w-auto object-contain opacity-90" />
                  <p className="text-zinc-400 text-sm leading-relaxed">{t('footer.desc')}</p>
                </div>

                {/* Column 1: For Candidates */}
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">{t('footer.kandydat')}</h4>
                  <ul className="space-y-3">
                    <li><a href="#oferty" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t('footer.oferty')}</a></li>
                    <li><a href="#legalization" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t('footer.legalizacja')}</a></li>
                    <li><a href="#upskilling" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t('footer.upskilling')}</a></li>
                  </ul>
                </div>

                {/* Column 2: For Employers */}
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">{t('footer.pracodawca')}</h4>
                  <ul className="space-y-3">
                    <li><a href="#services" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t('footer.leasing')}</a></li>
                    <li><a href="#services" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t('footer.rekrutacja')}</a></li>
                    <li><a href="#contact" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t('footer.cennik')}</a></li>
                  </ul>
                </div>

                {/* Column 3: Company */}
                <div>
                  <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4">{t('footer.firma')}</h4>
                  <ul className="space-y-3">
                    <li><a href="#about" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t('footer.oNas')}</a></li>
                    <li><a href="#contact" className="text-zinc-400 hover:text-primary transition-colors text-sm">{t('footer.kontakt')}</a></li>
                    <li><button onClick={() => { setPage('privacy'); window.scrollTo({ top: 0 }); }} className="text-zinc-400 hover:text-primary transition-colors text-sm cursor-pointer">{t('footer.polityka')}</button></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row justify-between items-center px-gutter py-5 gap-3 max-w-7xl mx-auto">
                <p className="text-zinc-500 text-sm">© 2026 {t('footer.rights')}</p>
                <p className="text-zinc-500 text-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">location_on</span>
                  {config.location}
                </p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ── Floating WhatsApp / Telegram buttons (always visible) ── */}
      <FloatingContactButtons t={t} jobTitle={lastJobTitle} />

      {/* ── Cookie consent banner ── */}
      <CookieConsent />

    </div>
  );
}

export default App;
