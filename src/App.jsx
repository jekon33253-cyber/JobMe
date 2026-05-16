import React from 'react';
import Hero from './components/Hero';
import FadeIn from './components/FadeIn';
import HowItWorks from './components/HowItWorks';
import FAQSection from './components/FAQSection';

function App() {
  return (
    <div className="text-on-surface bg-background-white font-body-md">
      
{/* TopNavBar */}
<nav className="bg-background-white/90 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm">
<div className="flex justify-between items-center px-gutter py-4 max-w-7xl mx-auto">
<img src="/logo.webp" alt="JobMe Logo" className="h-8 md:h-10 w-auto object-contain" />
<div className="hidden md:flex gap-8 items-center">
<a className="font-button text-button text-primary border-b-2 border-primary pb-1" href="#about">O nas</a>
<a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#services">Usługi</a>
<a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#advantages">Zalety</a>
<a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#team">Zespół</a>
<a className="font-button text-button text-on-surface-variant hover:text-primary transition-colors" href="#contact">Kontakt</a>
</div>
<button className="bg-primary-container text-on-primary-container font-button text-button px-6 py-3 rounded-xl hover:opacity-80 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
                Zacznij teraz
            </button>
</div>
</nav>
<Hero />
{/* About Section */}
<section className="bg-surface-contrast py-20 md:py-24 px-gutter" id="about">
<FadeIn>
<div className="max-w-4xl mx-auto text-center space-y-6">
<span className="text-primary font-label-bold text-label-bold uppercase tracking-wider">O nas</span>
<h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D]">Więcej niż agencja</h2>
<p className="font-body-lg text-body-lg text-zinc-700 text-base md:text-lg leading-relaxed">
                Jesteśmy HR-ekosystemem z Wrocławia. Odrzucamy stare schematy traktowania ludzi jako "zasobów". 
                W JobMe stawiamy na pełną przejrzystość – u nas nie znajdziesz małego druku ani ukrytych kar umownych. 
                Budujemy mosty między ambitnymi talentami a odpowiedzialnym biznesem.
            </p>
</div>
</FadeIn>
</section>
{/* Services Section */}
<section className="bg-background-white py-20 md:py-24 px-gutter" id="services">
<FadeIn>
<div className="max-w-7xl mx-auto">
<h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] text-center mb-16">Nasze Usługi</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Service 1 */}
<div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
<div className="bg-secondary-container p-4 rounded-xl mb-6">
<span className="material-symbols-outlined text-on-secondary-container scale-150">business_center</span>
</div>
<h3 className="font-headline-md text-headline-md mb-4">Szybki najem dla firm</h3>
<p className="text-zinc-700 text-base leading-relaxed">
                        Kompleksowa obsługa pracy tymczasowej i stałej. Skupiamy się na dopasowaniu, które realnie obniża rotację w Twoim zespole.
                    </p>
</div>
{/* Service 2 */}
<div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
<div className="bg-primary-fixed p-4 rounded-xl mb-6">
<span className="material-symbols-outlined text-on-primary-fixed scale-150">school</span>
</div>
<h3 className="font-headline-md text-headline-md mb-4">Legalna praca i Upskilling</h3>
<p className="text-zinc-700 text-base leading-relaxed">
                        Dla kandydatów oferujemy nie tylko pracę, ale i rozwój. Darmowe szkolenia pozwalają na szybki awans na lepiej płatne stanowiska.
                    </p>
</div>
{/* Service 3 */}
<div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">
<div className="bg-tertiary-fixed p-4 rounded-xl mb-6">
<span className="material-symbols-outlined text-on-tertiary-fixed scale-150">groups</span>
</div>
<h3 className="font-headline-md text-headline-md mb-4">Baza Freecruiterów</h3>
<p className="text-zinc-700 text-base leading-relaxed">
                        Dostęp do unikalnej sieci niezależnych rekruterów, którzy docierają do talentów niedostępnych w standardowych kanałach.
                    </p>
</div>
</div>
</div>
</FadeIn>
</section>

{/* Jak to dziala Section */}
<HowItWorks />

{/* Advantages Section */}
<section className="bg-surface-contrast py-20 md:py-24 px-gutter" id="advantages">
<FadeIn>
<div className="max-w-7xl mx-auto">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
<div>
<h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-12">Dlaczego warto nam zaufać?</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
{/* Adv 1 */}
<div className="space-y-3">
<span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
<h3 className="font-label-bold text-label-bold text-on-surface">Zasady czyste jak szkło</h3>
<p className="text-zinc-700 text-base leading-relaxed">Żadnych ukrytych kosztów, lojalek i kar umownych. Wszystko jasno na piśmie.</p>
</div>
{/* Adv 2 */}
<div className="space-y-3">
<span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
<h3 className="font-label-bold text-label-bold text-on-surface">Aktywny koordynator</h3>
<p className="text-zinc-700 text-base leading-relaxed">Prawdziwy człowiek, który naprawdę odbiera telefon i wspiera Cię po zatrudnieniu.</p>
</div>
{/* Adv 3 */}
<div className="space-y-3">
<span className="material-symbols-outlined text-primary text-3xl">description</span>
<h3 className="font-label-bold text-label-bold text-on-surface">Błyskawiczna legalizacja</h3>
<p className="text-zinc-700 text-base leading-relaxed">100% formalności po naszej stronie. Szybki onboarding bez stresu urzędowego.</p>
</div>
{/* Adv 4 */}
<div className="space-y-3">
<span className="material-symbols-outlined text-primary text-3xl">devices</span>
<h3 className="font-label-bold text-label-bold text-on-surface">Autorska platforma HR</h3>
<p className="text-zinc-700 text-base leading-relaxed">Nasza technologia błyskawicznie łączy potrzeby biznesu z marzeniami kandydatów.</p>
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
{/* Team Section */}
<section className="bg-background-white py-20 md:py-24 px-gutter" id="team">
<FadeIn>
<div className="max-w-7xl mx-auto text-center">
<h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-4">Poznaj nasz zespół</h2>
<p className="text-zinc-700 text-base md:text-lg mb-16 max-w-2xl mx-auto">Ludzie, którzy codziennie dbają o Twoją karierę i bezpieczeństwo prawne.</p>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Team 1 */}
<div className="bg-white rounded-xxl p-6 text-center group border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
<div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-[2rem] border-4 border-white shadow-md">
<img alt="Michał" className="w-full h-full object-cover" data-alt="A headshot of a friendly professional man in his early 30s with a warm and approachable smile. He is wearing a smart casual light-colored linen shirt against a soft, bright studio background. The lighting is soft and even, emphasizing trust and friendliness. This portrait represents an expert who is supportive and clear in communication." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2e4MoBV6ODja8n4DkU_m9XpJXfYE8P9F05ZKP5Uqoef5qPjyy3J8YOWCR5BygPHwbqy7gYxW2zaI5wBHnWP4dJGQCO_cP149Qxtwf-wKeKb5KcsawMOp0DYST7G-hvWbD8B8AaVBajlhkck3n9KBiyheB4O4qBctGiRqM-xSyAb14VegfS3S_1ujy7SXSKlcz2HEl741kIS8j8ikP0SvuQ--ktXA_w3NgJ2Zh3AszTCWTTUR0hl4tNKhLdcWUtapykorhAlopxig"/>
</div>
<h3 className="font-headline-md text-headline-md">Michał</h3>
<p className="text-primary font-label-bold mb-4">Opiekun Kandydata</p>
<p className="text-zinc-700 text-base italic leading-relaxed">Wsparcie i brak zbędnego żargonu na każdym kroku.</p>
</div>
{/* Team 2 */}
<div className="bg-white rounded-xxl p-6 text-center group border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
<div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-[2rem] border-4 border-white shadow-md">
<img alt="Anna" className="w-full h-full object-cover" data-alt="A professional woman with a confident and helpful expression, dressed in a sharp teal blazer. She has a neat hairstyle and is photographed in a high-key, modern office setting. The lighting is crisp, suggesting competence and expertise in official procedures and legal matters. Her gaze is direct and reassuring." src="https://lh3.googleusercontent.com/aida-public/AB6AXuATy_o5csBvnV1AQdi6k6zH_lXPDJqOnluCjKaGQ_3KKCn1PHQCDnfSDciVnpqN-2yPsoNMKpIguPqQrZIrcF906rETOWnr7rzWBfSf3cZOTpi0XKmYHtkJ0-XaelNLA-1f30DYAqzqzkQgSNX6JhZ1gjTVrkEP_s5FOyl8pa_NCXbnjui-ib8aqreM-N1KEdhhNSNN_4b_jMew63xJPMG3chAyBhabFJMK3vIGdQ25yFT4Y1WHmQ82bcB73t17Avr-y2KTs3Y6FDc"/>
</div>
<h3 className="font-headline-md text-headline-md">Anna</h3>
<p className="text-primary font-label-bold mb-4">Ekspertka ds. Legalizacji</p>
<p className="text-zinc-700 text-base italic leading-relaxed">Twoje bezpieczeństwo w gąszczu procedur urzędowych.</p>
</div>
{/* Team 3 */}
<div className="bg-white rounded-xxl p-6 text-center group border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
<div className="w-32 h-32 mx-auto mb-6 overflow-hidden rounded-[2rem] border-4 border-white shadow-md">
<img alt="Tomasz" className="w-full h-full object-cover" data-alt="A portrait of an energetic and professional man in his late 30s with a visionary look. He is wearing a dark grey polo shirt in a bright, modern workshop environment. The background is slightly blurred but suggests a space for growth and learning. The lighting is dynamic, highlighting a sense of development and professional coaching." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3oe4bYrI5JrB8a-YWPMLiq93padLNrqsL31IokEcr_dim2VxkBULhMv9eXAXa3Q2oLDntmZ9ahQTnRhYanI5_NkEVLcabZPadS3_Cx31ChnRQJj5CIpJeMcvQPv1uT3OFbKCPPJMgFN6nxPtS-FOmokJnVPNAsXA-1L-SsqAr7ikTvYlocVCUe8OQIByweBB7FbK9q9GKzA5_VStfOwRUuer1pD1idTJZenFbdi9bGgGYsNwa59jVrgpeW6eXlxRs908ietv4aJg"/>
</div>
<h3 className="font-headline-md text-headline-md">Tomasz</h3>
<p className="text-primary font-label-bold mb-4">Specjalista ds. Upskillingu</p>
<p className="text-zinc-700 text-base italic leading-relaxed">Pomaga Ci rosnąć i zarabiać więcej każdego dnia.</p>
</div>
</div>
</div>
</FadeIn>
</section>
{/* Testimonials Section */}
<section className="bg-surface-contrast py-20 md:py-24 px-gutter">
<FadeIn>
<div className="max-w-7xl mx-auto">
<h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] text-center mb-16">Opinie naszych ludzi</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
{/* Review 1 */}
<div className="bg-white p-8 rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative z-0 overflow-hidden">
<span className="material-symbols-outlined absolute -top-4 -left-2 text-9xl text-zinc-100/50 -z-10">format_quote</span>

<div className="flex gap-1 mb-4">
<span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<p className="font-body-md text-body-md text-on-surface mb-6">"Brak potrąceń i stały kontakt z koordynatorem, w końcu normalna agencja. Wszystko terminowo."</p>
<p className="font-label-bold text-label-bold">— Serhii</p>
</div>
{/* Review 2 */}
<div className="bg-white p-8 rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative z-0 overflow-hidden">
<span className="material-symbols-outlined absolute -top-4 -left-2 text-9xl text-zinc-100/50 -z-10">format_quote</span>

<div className="flex gap-1 mb-4">
<span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-zinc-300" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<p className="font-body-md text-body-md text-on-surface mb-6">"Szybkie zamknięcie trudnych wakatów i minimalna rotacja. Współpraca na najwyższym poziomie. Polecam."</p>
<p className="font-label-bold text-label-bold">— Kamil (Manager Logistyki)</p>
</div>
{/* Review 3 */}
<div className="bg-white p-8 rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative z-0 overflow-hidden">
<span className="material-symbols-outlined absolute -top-4 -left-2 text-9xl text-zinc-100/50 -z-10">format_quote</span>

<div className="flex gap-1 mb-4">
<span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span><span className="material-symbols-outlined text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
</div>
<p className="font-body-md text-body-md text-on-surface mb-6">"Dzięki darmowemu kursowi awansowałam na operatora maszyn! Super podejście do pracownika."</p>
<p className="font-label-bold text-label-bold">— Oksana</p>
</div>
</div>
</div>
</FadeIn>
</section>

{/* FAQ Section */}
<FAQSection />

{/* Contact Section */}
<section className="bg-background-white py-20 md:py-24 px-gutter" id="contact">
<FadeIn>
<div className="max-w-7xl mx-auto">
<div className="bg-surface-container-high rounded-xxl overflow-hidden shadow-2xl flex flex-col md:flex-row">
<div className="md:w-1/2 p-12 lg:p-16 space-y-8 bg-[#2D2D2D] text-white">
<h2 className="text-3xl md:text-4xl font-extrabold text-white">Zmieńmy razem rynek pracy</h2>
<p className="font-body-lg text-body-lg opacity-90">Czekamy na Ciebie we Wrocławiu. Porozmawiajmy o Twoich celach biznesowych lub zawodowych.</p>
<div className="space-y-6">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-[#A1DD22]">location_on</span>
<span className="font-body-md">Wrocław, Polska</span>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-[#00B4B4]">mail</span>
<span className="font-body-md">kontakt@jobme.pl</span>
</div>
</div>
</div>
<div className="md:w-1/2 p-12 lg:p-16 bg-white">
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">Bezpłatna konsultacja</h3>
<p className="text-zinc-700 text-base mb-8">Zostaw numer, oddzwonimy i szczerze powiemy o warunkach</p>
<form className="space-y-6">
<div>
<label className="block font-bold text-zinc-800 text-base mb-2">Imię</label>
<input className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all" placeholder="Twoje imię" type="text"/>
</div>
<div>
<label className="block font-bold text-zinc-800 text-base mb-2">Numer telefonu</label>
<input className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all" placeholder="+48 ___ ___ ___" type="tel"/>
</div>
<button className="w-full bg-[#8CC63F] text-white font-button text-button py-4 rounded-xl hover:opacity-90 transition-all shadow-md" type="submit">
                            Wyślij
                        </button>
</form>
</div>
</div>
</div>
</FadeIn>
</section>
{/* Footer */}
<footer className="bg-surface-container-low border-t border-outline-variant/20">
<div className="flex flex-col md:flex-row justify-between items-center px-gutter py-base gap-4 max-w-7xl mx-auto min-h-[80px]">
<img src="/logo.webp" alt="JobMe Logo" className="h-6 md:h-8 w-auto object-contain opacity-90" />
<p className="text-zinc-700 text-base leading-relaxed">© 2026 JobMe. Wszystkie prawa zastrzeżone.</p>
<div className="flex gap-6">
<a className="text-zinc-600 text-base hover:text-secondary transition-colors" href="#">Polityka prywatności</a>
<a className="text-zinc-600 text-base hover:text-secondary transition-colors" href="#">Regulamin</a>
<a className="text-zinc-600 text-base hover:text-secondary transition-colors" href="#contact">Kontakt</a>
</div>
</div>
</footer>

    </div>
  );
}

export default App;
