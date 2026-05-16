import React from 'react';
import FadeIn from './FadeIn';

export default function Hero() {
  return (
    <section className="relative w-full bg-[#FFFFFF] overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      {/* Мягкие премиальные фоновые градиенты для объема */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-gradient-to-b from-[#A1DD22]/10 to-transparent rounded-full blur-[120px] opacity-70" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-gradient-to-t from-[#00B4B4]/5 to-transparent rounded-full blur-[100px] opacity-50" />

      <FadeIn>
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Левая текстовая часть (Контент занимает 7 колонок из 12) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-8 z-10">
            
            {/* Тэг-описание компании */}
            <div className="inline-flex items-center space-x-2 bg-[#F9FAFB] border border-zinc-100 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#A1DD22] animate-pulse" />
              <span className="text-xs font-semibold text-zinc-600 tracking-wide uppercase">
                Nowoczesny Ekosystem HR
              </span>
            </div>

            {/* Огромный, дорогой заголовок H1 */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#2D2D2D] tracking-tight leading-[1.1]">
              Koniec z rekrutacyjnym <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[#A1DD22] to-[#00B4B4] bg-clip-text text-transparent">
                chaosem.
              </span>
            </h1>

            {/* Сбалансированный подзаголовок */}
            <p className="text-lg md:text-xl text-zinc-700 font-normal max-w-xl leading-relaxed">
              Łączymy ludzi с uczciwym biznesem poprzez przejrzyste zasady i nowoczesną technologię. Bez ukrytych kosztów.
            </p>

            {/* Акцентные кнопки с плавными анимациями */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-2">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#A1DD22] hover:bg-[#8ec71e] text-[#2D2D2D] font-bold text-base rounded-2xl shadow-lg shadow-[#A1DD22]/20 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98] text-center">
                Znajdź pracę
              </button>
              <button className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-zinc-50 text-[#00B4B4] font-bold text-base rounded-2xl border-2 border-[#00B4B4]/30 hover:border-[#00B4B4] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] text-center">
                Znajdź pracowników
              </button>
            </div>
          </div>

          {/* Правая часть с визуалом (Занимает 5 колонок из 12) */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            
            {/* Декоративный элемент за фото, имитирующий интерфейс платформы */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#00B4B4]/20 to-transparent rounded-full blur-xl" />
            
            <div className="relative p-2 bg-white border border-zinc-100 rounded-[2.5rem] shadow-2xl shadow-zinc-200/80 overflow-hidden transform lg:rotate-2 hover:rotate-0 transition-transform duration-500 max-w-[460px] w-full">
              {/* Сама картинка */}
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=600" 
                alt="JobMe Ecosystem" 
                className="w-full h-auto object-cover rounded-[2.2rem]"
              />
              
              {/* Премиальная плашка поверх фото (Эффект Glassmorphism) */}
              <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/80 border border-white/40 p-4 rounded-2xl shadow-lg flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-600">Aktywne oferty</p>
                  <p className="text-lg font-bold text-[#2D2D2D]">+1,240 we Wrocławiu</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#A1DD22]/20 flex items-center justify-between px-3 py-2">
                  <div className="w-1.5 h-4 bg-[#A1DD22] rounded-full" />
                  <div className="w-1.5 h-6 bg-[#A1DD22] rounded-full" />
                  <div className="w-1.5 h-3 bg-[#A1DD22] rounded-full" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
      </FadeIn>
    </section>
  );
}
