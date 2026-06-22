import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const content = {
  pl: {
    code: '404',
    title: 'Strona nie znaleziona',
    desc: 'Przepraszamy, ale strona, której szukasz, nie istnieje. Być może została przeniesiona lub adres jest nieprawidłowy.',
    btnHome: '← Wróć na stronę główną',
  },
  ua: {
    code: '404',
    title: 'Сторінку не знайдено',
    desc: 'Вибачте, але сторінка, яку ви шукаєте, не існує. Можливо, її було переміщено або адреса вказана невірно.',
    btnHome: '← Повернутись на головну',
  },
  en: {
    code: '404',
    title: 'Page not found',
    desc: 'Sorry, the page you are looking for does not exist. It may have been moved or the address is incorrect.',
    btnHome: '← Back to Home',
  },
};

export default function NotFoundPage({ onNavigateHome }) {
  const { currentLanguage } = useLanguage();
  const t = content[currentLanguage] || content.pl;

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <span className="text-[140px] md:text-[180px] font-black leading-none bg-gradient-to-br from-[#8CC63F] to-[#00A99D] bg-clip-text text-transparent select-none">
          {t.code}
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#2D2D2D] mt-4 mb-3">{t.title}</h1>
        <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-8">{t.desc}</p>
        <button
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 bg-[#8CC63F] hover:bg-[#7ab335] text-[#2D2D2D] font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-[#8CC63F]/20 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          {t.btnHome}
        </button>
      </div>
    </div>
  );
}
