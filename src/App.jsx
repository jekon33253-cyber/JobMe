import React, { useState } from 'react';
import Hero from './components/Hero';
import FadeIn from './components/FadeIn';
import HowItWorks from './components/HowItWorks';
import FAQSection from './components/FAQSection';
import StatsBanner from './components/StatsBanner';
import Sectors from './components/Sectors';
import LegalizationTimeline from './components/LegalizationTimeline';
import Upskilling from './components/Upskilling';
import ContactForm from './components/ContactForm';
import { useLanguage } from './context/LanguageContext';

function App() {
  const [contactTab, setContactTab] = useState('kandydat');
  const { t, currentLanguage, setCurrentLanguage } = useLanguage();

  const handleScrollToContact = (tab) => {
    setContactTab(tab);
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
      
      {/* TopNavBar */}
      <nav className="bg-background-white/90 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm">
        <div className="flex justify-between items-center px-gutter py-4 max-w-7xl mx-auto">
          <img src="/logo.webp" alt="JobMe Logo" className="h-8 md:h-10 w-auto object-contain" />
          
          <div className="hidden md:flex gap-8 items-center">
            <a className="font-button text-button text-primary border-b-2 border-primary pb-1" href="#about">{t('nav.about')}</a>
            <a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#services">{t('nav.services')}</a>
            <a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#advantages">{t('nav.advantages')}</a>
            <a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#team">{t('nav.team')}</a>
            <a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#contact">{t('nav.contact')}</a>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-1 bg-zinc-50 border border-zinc-200 rounded-lg p-1 mr-2">
              <LangButton lang="pl" />
              <LangButton lang="ua" />
              <LangButton lang="en" />
            </div>

            <button 
              onClick={() => {
                if (window.gtag) window.gtag('event', 'click_start_now');
                if (window.fbq) window.fbq('trackCustom', 'ClickStartNow');
                handleScrollToContact('kandydat');
              }}
              className="bg-primary-container text-on-primary-container font-button text-button px-6 py-3 rounded-xl hover:opacity-80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {t('nav.cta')}
            </button>
          </div>
        </div>
        {/* Mobile Language Switcher */}
        <div className="sm:hidden flex justify-center gap-2 pb-2 bg-background-white border-b border-zinc-100">
          <LangButton lang="pl" />
          <LangButton lang="ua" />
          <LangButton lang="en" />
        </div>
      </nav>

      <div className="pt-[100px] sm:pt-[80px]"> {/* Offset for fixed navbar + mobile lang switcher */}
        <Hero onCtaClick={handleScrollToContact} />
        <StatsBanner />
      </div>

      {/* About Section */}
      <section className="bg-surface-contrast py-20 md:py-24 px-gutter" id="about">
        <FadeIn>
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <span className="text-primary font-label-bold text-label-bold uppercase tracking-wider">{t('about.tag')}</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D]">{t('about.title')}</h2>
            <p className="font-body-lg text-body-lg text-zinc-700 text-base md:text-lg leading-relaxed">
              {t('about.desc')}
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Services Section */}
      <section className="bg-background-white py-20 md:py-24 px-gutter" id="services">
        <FadeIn>
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] text-center mb-16">{t('services.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service 1 */}
              <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="bg-secondary-container p-4 rounded-xl mb-6">
                  <span className="material-symbols-outlined text-on-secondary-container scale-150">business_center</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-4">{t('services.s1Title')}</h3>
                <p className="text-zinc-700 text-base leading-relaxed">
                  {t('services.s1Desc')}
                </p>
              </div>
              {/* Service 2 */}
              <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="bg-primary-fixed p-4 rounded-xl mb-6">
                  <span className="material-symbols-outlined text-on-primary-fixed scale-150">school</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-4">{t('services.s2Title')}</h3>
                <p className="text-zinc-700 text-base leading-relaxed">
                  {t('services.s2Desc')}
                </p>
              </div>
              {/* Service 3 */}
              <div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
                <div className="bg-tertiary-fixed p-4 rounded-xl mb-6">
                  <span className="material-symbols-outlined text-on-tertiary-fixed scale-150">groups</span>
                </div>
                <h3 className="font-headline-md text-headline-md mb-4">{t('services.s3Title')}</h3>
                <p className="text-zinc-700 text-base leading-relaxed">
                  {t('services.s3Desc')}
                </p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Sectors Section */}
      <Sectors />

      {/* Legalization Timeline Section */}
      <LegalizationTimeline />

      {/* Jak to dziala Section */}
      <HowItWorks />

      {/* Advantages Section */}
      <section className="bg-surface-contrast py-20 md:py-24 px-gutter" id="advantages">
        <FadeIn>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-12">{t('advantages.title')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Adv 1 */}
                  <div className="space-y-3">
                    <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
                    <h3 className="font-label-bold text-label-bold text-on-surface">{t('advantages.a1Title')}</h3>
                    <p className="text-zinc-700 text-base leading-relaxed">{t('advantages.a1Desc')}</p>
                  </div>
                  {/* Adv 2 */}
                  <div className="space-y-3">
                    <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
                    <h3 className="font-label-bold text-label-bold text-on-surface">{t('advantages.a2Title')}</h3>
                    <p className="text-zinc-700 text-base leading-relaxed">{t('advantages.a2Desc')}</p>
                  </div>
                  {/* Adv 3 */}
                  <div className="space-y-3">
                    <span className="material-symbols-outlined text-primary text-3xl">description</span>
                    <h3 className="font-label-bold text-label-bold text-on-surface">{t('advantages.a3Title')}</h3>
                    <p className="text-zinc-700 text-base leading-relaxed">{t('advantages.a3Desc')}</p>
                  </div>
                  {/* Adv 4 */}
                  <div className="space-y-3">
                    <span className="material-symbols-outlined text-primary text-3xl">devices</span>
                    <h3 className="font-label-bold text-label-bold text-on-surface">{t('advantages.a4Title')}</h3>
                    <p className="text-zinc-700 text-base leading-relaxed">{t('advantages.a4Desc')}</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <img alt="Zaufanie i profesjonalizm" className="rounded-xxl shadow-xl border-8 border-white object-cover aspect-[4/3] w-full" src="https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&q=80&w=800" />
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Upskilling Section */}
      <Upskilling />

      {/* Team Section */}
      <section className="bg-background-white py-20 md:py-24 px-gutter" id="team">
        <FadeIn>
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-4">{t('team.title')}</h2>
            <p className="text-zinc-700 text-base md:text-lg mb-16 max-w-2xl mx-auto">{t('team.desc')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team 1 */}
              <div className="bg-white rounded-xxl p-6 text-center group border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-[2rem] border-4 border-white shadow-md">
                  <img alt="Michał" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2e4MoBV6ODja8n4DkU_m9XpJXfYE8P9F05ZKP5Uqoef5qPjyy3J8YOWCR5BygPHwbqy7gYxW2zaI5wBHnWP4dJGQCO_cP149Qxtwf-wKeKb5KcsawMOp0DYST7G-hvWbD8B8AaVBajlhkck3n9KBiyheB4O4qBctGiRqM-xSyAb14VegfS3S_1ujy7SXSKlcz2HEl741kIS8j8ikP0SvuQ--ktXA_w3NgJ2Zh3AszTCWTTUR0hl4tNKhLdcWUtapykorhAlopxig"/>
                </div>
                <h3 className="font-headline-md text-headline-md">Michał</h3>
                <p className="text-primary font-label-bold mb-4">{t('team.t1Role')}</p>
                <p className="text-zinc-700 text-base italic leading-relaxed">{t('team.t1Desc')}</p>
              </div>
              {/* Team 2 */}
              <div className="bg-white rounded-xxl p-6 text-center group border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-[2rem] border-4 border-white shadow-md">
                  <img alt="Anna" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATy_o5csBvnV1AQdi6k6zH_lXPDJqOnluCjKaGQ_3KKCn1PHQCDnfSDciVnpqN-2yPsoNMKpIguPqQrZIrcF906rETOWnr7rzWBfSf3cZOTpi0XKmYHtkJ0-XaelNLA-1f30DYAqzqzkQgSNX6JhZ1gjTVrkEP_s5FOyl8pa_NCXbnjui-ib8aqreM-N1KEdhhNSNN_4b_jMew63xJPMG3chAyBhabFJMK3vIGdQ25yFT4Y1WHmQ82bcB73t17Avr-y2KTs3Y6FDc"/>
                </div>
                <h3 className="font-headline-md text-headline-md">Anna</h3>
                <p className="text-primary font-label-bold mb-4">{t('team.t2Role')}</p>
                <p className="text-zinc-700 text-base italic leading-relaxed">{t('team.t2Desc')}</p>
              </div>
              {/* Team 3 */}
              <div className="bg-white rounded-xxl p-6 text-center group border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-[2rem] border-4 border-white shadow-md">
                  <img alt="Tomasz" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3oe4bYrI5JrB8a-YWPMLiq93padLNrqsL31IokEcr_dim2VxkBULhMv9eXAXa3Q2oLDntmZ9ahQTnRhYanI5_NkEVLcabZPadS3_Cx31ChnRQJj5CIpJeMcvQPv1uT3OFbKCPPJMgFN6nxPtS-FOmokJnVPNAsXA-1L-SsqAr7ikTvYlocVCUe8OQIByweBB7FbK9q9GKzA5_VStfOwRUuer1pD1idTJZenFbdi9bGgGYsNwa59jVrgpeW6eXlxRs908ietv4aJg"/>
                </div>
                <h3 className="font-headline-md text-headline-md">Tomasz</h3>
                <p className="text-primary font-label-bold mb-4">{t('team.t3Role')}</p>
                <p className="text-zinc-700 text-base italic leading-relaxed">{t('team.t3Desc')}</p>
              </div>
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
              {/* Review 1 */}
              <div className="bg-white p-8 rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative z-0 overflow-hidden">
                <span className="material-symbols-outlined absolute -top-4 -left-2 text-9xl text-zinc-100/50 -z-10">format_quote</span>
                <div className="flex gap-1 mb-4">
                  <span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface mb-6">"{t('testimonials.r1Text')}"</p>
                <p className="font-label-bold text-label-bold">— {t('testimonials.r1Name')}</p>
              </div>
              {/* Review 2 */}
              <div className="bg-white p-8 rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative z-0 overflow-hidden">
                <span className="material-symbols-outlined absolute -top-4 -left-2 text-9xl text-zinc-100/50 -z-10">format_quote</span>
                <div className="flex gap-1 mb-4">
                  <span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-zinc-300" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface mb-6">"{t('testimonials.r2Text')}"</p>
                <p className="font-label-bold text-label-bold">— {t('testimonials.r2Name')} ({t('testimonials.r2Role')})</p>
              </div>
              {/* Review 3 */}
              <div className="bg-white p-8 rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative z-0 overflow-hidden">
                <span className="material-symbols-outlined absolute -top-4 -left-2 text-9xl text-zinc-100/50 -z-10">format_quote</span>
                <div className="flex gap-1 mb-4">
                  <span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface mb-6">"{t('testimonials.r3Text')}"</p>
                <p className="font-label-bold text-label-bold">— {t('testimonials.r3Name')}</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Contact Form Section */}
      <ContactForm activeTab={contactTab} onTabChange={setContactTab} />
      
      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-gutter py-base gap-4 max-w-7xl mx-auto min-h-[80px]">
          <img src="/logo.webp" alt="JobMe Logo" className="h-6 md:h-8 w-auto object-contain opacity-90" />
          <p className="text-zinc-700 text-base leading-relaxed">© 2026 {t('footer.rights')}</p>
          <div className="flex gap-6">
            <a className="text-zinc-600 text-base hover:text-secondary transition-colors" href="#">{t('footer.polityka')}</a>
            <a className="text-zinc-600 text-base hover:text-secondary transition-colors" href="#contact">{t('footer.kontakt')}</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
