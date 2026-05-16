const fs = require('fs');

let content = fs.readFileSync('src/App.jsx', 'utf-8');

// 1. Spacing
content = content.replace(/py-section-gap/g, 'py-20 md:py-24');

// 1. Headings
content = content.replace(/<h2 className="font-headline-lg text-headline-lg text-on-surface">/g, '<h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D]">');
content = content.replace(/<h2 className="font-headline-lg text-headline-lg text-on-surface text-center mb-16">/g, '<h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] text-center mb-16">');
content = content.replace(/<h2 className="font-headline-lg text-headline-lg text-on-surface mb-12">/g, '<h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-12">');
content = content.replace(/<h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">/g, '<h2 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-4">');

// 2. Services Cards
content = content.replace(/<div className="bg-surface-container-lowest p-8 rounded-xxl shadow-sm hover:shadow-md transition-shadow border border-outline-variant\/30 flex flex-col items-center text-center">/g, '<div className="bg-white p-8 rounded-xxl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 flex flex-col items-center text-center">');

// 2. Team Section
content = content.replace(/<div className="bg-surface-container-low rounded-xxl p-6 text-center group">/g, '<div className="bg-white rounded-xxl p-6 text-center group border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">');
content = content.replace(/rounded-full border-4 border-white shadow-md/g, 'rounded-[2rem] border-4 border-white shadow-md');

// 2. Testimonials
const oldTestimonial1 = '<div className="bg-background-white p-8 rounded-xl shadow-sm border-l-4 border-primary">';
const newTestimonial = `<div className="bg-white p-8 rounded-xl border border-zinc-100 shadow-xl shadow-zinc-200/50 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 relative z-0 overflow-hidden">
<span className="material-symbols-outlined absolute -top-4 -left-2 text-9xl text-zinc-100/50 -z-10">format_quote</span>`;
const oldTestimonial2 = '<div className="bg-background-white p-8 rounded-xl shadow-sm border-l-4 border-secondary">';

content = content.replace(new RegExp(oldTestimonial1.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newTestimonial);
content = content.replace(new RegExp(oldTestimonial2.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newTestimonial);

// 3. Contact Section
content = content.replace(/<div className="md:w-1\/2 p-12 lg:p-16 space-y-8 bg-primary text-on-primary">/g, '<div className="md:w-1/2 p-12 lg:p-16 space-y-8 bg-[#2D2D2D] text-white">');
content = content.replace(/<h2 className="font-headline-lg text-headline-lg">Zmieńmy razem rynek pracy<\/h2>/g, '<h2 className="text-3xl md:text-4xl font-extrabold text-white">Zmieńmy razem rynek pracy</h2>');

content = content.replace(/<span className="material-symbols-outlined">location_on<\/span>/g, '<span className="material-symbols-outlined text-[#A1DD22]">location_on</span>');
content = content.replace(/<span className="material-symbols-outlined">mail<\/span>/g, '<span className="material-symbols-outlined text-[#00B4B4]">mail</span>');

// Inputs
content = content.replace(/<input className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface-contrast focus:ring-2 focus:ring-secondary focus:outline-none"/g, '<input className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-[#00B4B4] focus:ring-4 focus:ring-[#00B4B4]/10 focus:outline-none transition-all"');

// Footer year
content = content.replace(/© 2024 JobMe/g, '© 2026 JobMe');

fs.writeFileSync('src/App.jsx', content);
console.log('App.jsx refactored.');
