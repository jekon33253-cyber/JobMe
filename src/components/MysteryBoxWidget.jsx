import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import FadeIn from './FadeIn';

// Weighted prizes configuration
const PRIZES = [
  {
    id: 'housing',
    weight: 50,
    icon: 'home',
    title: {
      pl: '1 miesiąc darmowego mieszkania',
      ua: '1 місяць безкоштовного проживання',
      en: '1 month of free accommodation',
    },
    subtext: {
      pl: 'Bezpłatne zakwaterowanie od pracodawcy lub +400 zł/mc dodatku do pensji za własne mieszkanie.',
      ua: 'Безкоштовне житло від роботодавця або +400 zł/міс компенсації за власне житло.',
      en: 'Free accommodation from employer or +400 PLN/mo allowance for your own flat.',
    },
    valueBadge: {
      pl: 'Wartość: do 550 zł',
      ua: 'Вартість: до 550 zł',
      en: 'Value: up to 550 PLN',
    },
    color: 'from-emerald-500 to-[#8CC63F]',
    textColor: 'text-emerald-400',
  },
  {
    id: 'cash_bonus',
    weight: 45,
    icon: 'payments',
    title: {
      pl: 'Premia na start: +500 zł netto',
      ua: 'Премія на старт: +500 zł нетто',
      en: 'Welcome Bonus: +500 PLN net',
    },
    subtext: {
      pl: 'Dodatkowa gwarantowana premia finansowa wypłacana do pierwszej pełnej wypłaty na konto.',
      ua: 'Додаткова гарантована грошова премія, що виплачується до першої повної зарплати.',
      en: 'Guaranteed bonus payout added to your first full salary transfer.',
    },
    valueBadge: {
      pl: '+500 zł do wypłaty',
      ua: '+500 zł до зарплати',
      en: '+500 PLN on top',
    },
    color: 'from-amber-400 to-yellow-500',
    textColor: 'text-amber-400',
  },
  {
    id: 'welcome_pack',
    weight: 5,
    icon: 'shopping_bag',
    title: {
      pl: 'Welcome Pack: Karta 200 zł (Biedronka / Lidl)',
      ua: 'Welcome Pack: Сертифікат 200 zł (Biedronka / Lidl)',
      en: 'Welcome Pack: 200 PLN Grocery Voucher',
    },
    subtext: {
      pl: 'Karta podarunkowa na pierwsze zakupy spożywcze w Polsce po przyjeździe na obiekt.',
      ua: 'Подарунковий сертифікат на перші продукти в Польщі після прибуття на об’єкт.',
      en: 'Voucher for your first grocery shopping upon arrival at the project site.',
    },
    valueBadge: {
      pl: '200 zł na zakupy',
      ua: '200 zł на продукти',
      en: '200 PLN Voucher',
    },
    color: 'from-[#00B4B4] to-cyan-500',
    textColor: 'text-cyan-400',
  },
];

// Determine prize by weight (90%+ chance of housing or cash bonus)
function rollPrize() {
  const rand = Math.random() * 100;
  let cumulative = 0;
  for (const prize of PRIZES) {
    cumulative += prize.weight;
    if (rand <= cumulative) {
      return prize;
    }
  }
  return PRIZES[0];
}

// 3D Gift Box SVG Component with customizable accent and ribbon
function GiftBox3D({ index, isOpening, isOpened, isSelected, onClick, disabled }) {
  const boxColors = [
    { base: '#1b3815', wall: '#27521e', lid: '#8CC63F', ribbon: '#f59e0b', shadow: 'rgba(140,198,63,0.3)' },
    { base: '#0e3436', wall: '#154e52', lid: '#00B4B4', ribbon: '#8CC63F', shadow: 'rgba(0,180,180,0.3)' },
    { base: '#2b2110', wall: '#3f3017', lid: '#f59e0b', ribbon: '#00B4B4', shadow: 'rgba(245,158,11,0.3)' },
  ];
  const color = boxColors[index % boxColors.length];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex flex-col items-center justify-center p-6 md:p-8 rounded-3xl transition-all duration-500 cursor-pointer outline-none select-none
        ${isSelected ? 'scale-105 ring-4 ring-[#8CC63F] shadow-2xl' : 'hover:-translate-y-2 hover:scale-[1.03]'}
        ${disabled && !isSelected ? 'opacity-40 grayscale pointer-events-none' : ''}
        bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-zinc-800 hover:border-zinc-600 shadow-xl`}
      style={{
        boxShadow: isSelected ? `0 20px 40px ${color.shadow}` : undefined,
      }}
    >
      {/* Box Number Tag */}
      <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-white/10 text-zinc-300 text-[11px] font-black border border-white/10 tracking-wider">
        #{index + 1}
      </div>

      {/* 3D Box Illustration */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center my-2">
        {/* Glow behind box */}
        <div
          className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-700 ${
            isOpening || isOpened ? 'opacity-80 scale-125' : 'opacity-20 group-hover:opacity-40'
          }`}
          style={{ backgroundColor: color.lid }}
        />

        {/* Gift Box SVG */}
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full drop-shadow-2xl transition-transform duration-700 ${
            isOpening ? 'animate-bounce' : ''
          }`}
        >
          {/* Bottom Box Body */}
          <rect x="35" y="65" width="90" height="70" rx="8" fill={color.wall} stroke="#18181b" strokeWidth="2" />
          
          {/* Vertical Ribbon */}
          <rect x="73" y="65" width="14" height="70" fill={color.ribbon} />
          {/* Horizontal Ribbon */}
          <rect x="35" y="95" width="90" height="12" fill={color.ribbon} opacity="0.9" />

          {/* Box Lid (Animated if opening/opened) */}
          <g
            className={`transition-all duration-700 origin-[80px_60px] ${
              isOpened ? '-translate-y-8 -rotate-12 opacity-80' : isOpening ? '-translate-y-4 -rotate-6' : 'group-hover:-translate-y-1'
            }`}
          >
            {/* Lid Base */}
            <rect x="28" y="52" width="104" height="18" rx="5" fill={color.lid} stroke="#18181b" strokeWidth="2" />
            <rect x="73" y="52" width="14" height="18" fill={color.ribbon} />

            {/* 3D Bow Ribbon on Top */}
            <path
              d="M80 52 C65 30 45 42 75 52 C45 42 65 30 80 52 Z"
              fill={color.ribbon}
              stroke="#18181b"
              strokeWidth="1.5"
            />
            <path
              d="M80 52 C95 30 115 42 85 52 C115 42 95 30 80 52 Z"
              fill={color.ribbon}
              stroke="#18181b"
              strokeWidth="1.5"
            />
            {/* Center knot */}
            <circle cx="80" cy="52" r="5" fill="#ffffff" stroke={color.ribbon} strokeWidth="2" />
          </g>

          {/* Sparkles / Light rays on opened */}
          {isOpened && (
            <g className="animate-pulse">
              <circle cx="80" cy="40" r="3" fill="#fff" />
              <circle cx="50" cy="30" r="2" fill={color.lid} />
              <circle cx="110" cy="35" r="2.5" fill="#f59e0b" />
              <circle cx="80" cy="20" r="1.5" fill="#fff" />
            </g>
          )}
        </svg>
      </div>

      {/* Box Label */}
      <div className="text-center mt-2">
        <span className="text-xs md:text-sm font-extrabold text-white group-hover:text-[#8CC63F] transition-colors">
          {isOpened ? '🎉 Otwarta!' : 'Dotknij, aby otworzyć'}
        </span>
      </div>
    </button>
  );
}

// Confetti particle burst simulation
function ConfettiOverlay() {
  const pieces = Array.from({ length: 32 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {pieces.map((_, i) => {
        const left = `${(i * 3.1) % 100}%`;
        const delay = `${(i * 0.08) % 1.5}s`;
        const size = `${6 + (i % 6)}px`;
        const colors = ['#8CC63F', '#00B4B4', '#f59e0b', '#ec4899', '#3b82f6', '#ffffff'];
        const bg = colors[i % colors.length];
        return (
          <span
            key={i}
            className="absolute top-1/4 rounded-sm animate-ping opacity-90"
            style={{
              left,
              backgroundColor: bg,
              width: size,
              height: size,
              animationDuration: '1.4s',
              animationDelay: delay,
            }}
          />
        );
      })}
    </div>
  );
}

export default function MysteryBoxWidget() {
  const { currentLanguage } = useLanguage();
  const [openedIndex, setOpenedIndex] = useState(null);
  const [openingIndex, setOpeningIndex] = useState(null);
  const [wonPrize, setWonPrize] = useState(null);

  // Check if candidate already has a saved bonus in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('jobme_pending_bonus');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Find full prize object
        const match = PRIZES.find((p) => p.id === parsed.id) || PRIZES[0];
        setWonPrize(match);
        setOpenedIndex(0);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handlePickBox = (index) => {
    if (openingIndex !== null || openedIndex !== null) return;

    setOpeningIndex(index);

    // Roll weighted prize
    const selectedPrize = rollPrize();

    setTimeout(() => {
      setOpeningIndex(null);
      setOpenedIndex(index);
      setWonPrize(selectedPrize);

      try {
        localStorage.setItem('jobme_pending_bonus', JSON.stringify({
          id: selectedPrize.id,
          title: selectedPrize.title,
          valueBadge: selectedPrize.valueBadge,
          timestamp: Date.now(),
        }));
      } catch {
        // Safe fail
      }
    }, 700);
  };

  const handleClaimAndRegister = () => {
    const bonusId = wonPrize?.id || 'housing';
    window.location.href = `/portal?mode=register&role=candidate&bonus=${bonusId}`;
  };

  const t = {
    badge: {
      pl: '🎁 Premia na Start • Ograniczona Oferta',
      ua: '🎁 Премія на Старт • Обмежена Пропозиція',
      en: '🎁 Welcome Bonus • Limited Availability',
    },
    title: {
      pl: 'Odbierz gwarantowany bonus powitalny',
      ua: 'Отримайте гарантований вітальний бонус',
      en: 'Claim your guaranteed welcome bonus',
    },
    subtitle: {
      pl: 'Wybierz jedno z 3 pudełek, zarejestruj profil kandydata i ciesz się bonusem przy rozpoczęciu pracy!',
      ua: 'Оберіть одну з 3 коробок, створіть профіль кандидата та зафіксуйте свій бонус при виході на роботу!',
      en: 'Pick one of 3 mystery boxes, create your candidate account and unlock your bonus upon job start!',
    },
    ctaClaim: {
      pl: 'Przypisz bonus do konta i zarejestruj się',
      ua: 'Закріпити бонус та зареєструватися',
      en: 'Lock bonus to profile & Sign up',
    },
    termsNotice: {
      pl: 'Bonus zostaje przypisany do profilu i aktywuje się po pomyślnym rozpoczęciu pracy na dowolnym obiekcie JobMe.',
      ua: 'Бонус закріплюється за вашим профілем та активується після виходу на зміну на будь-якому об’єкті JobMe.',
      en: 'Bonus is locked to your profile and activates upon starting work on any JobMe project.',
    },
  };

  return (
    <section className="relative py-20 px-4 sm:px-6 bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] text-white overflow-hidden border-y border-zinc-800/80">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#8CC63F]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#00B4B4]/10 blur-[130px] pointer-events-none" />

      {openedIndex !== null && <ConfettiOverlay />}

      <div className="max-w-5xl mx-auto relative z-10">
        <FadeIn>
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8CC63F]/10 text-[#8CC63F] border border-[#8CC63F]/30 text-xs md:text-sm font-black tracking-wider uppercase">
              {t.badge[currentLanguage] || t.badge.pl}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {t.title[currentLanguage] || t.title.pl}
            </h2>
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
              {t.subtitle[currentLanguage] || t.subtitle.pl}
            </p>
          </div>

          {/* 3 Mystery Boxes Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[0, 1, 2].map((idx) => (
              <GiftBox3D
                key={idx}
                index={idx}
                isOpening={openingIndex === idx}
                isOpened={openedIndex === idx}
                isSelected={openedIndex === idx}
                disabled={openedIndex !== null && openedIndex !== idx}
                onClick={() => handlePickBox(idx)}
              />
            ))}
          </div>

          {/* Revealed Prize Banner */}
          {wonPrize && (
            <div className="bg-gradient-to-r from-zinc-900 via-zinc-850 to-zinc-900 border-2 border-[#8CC63F] rounded-3xl p-6 md:p-8 shadow-2xl animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#8CC63F]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
                {/* Prize Details */}
                <div className="space-y-2 max-w-xl">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#8CC63F] text-zinc-900 text-xs font-black uppercase tracking-wider">
                      🎉 {wonPrize.valueBadge[currentLanguage] || wonPrize.valueBadge.pl}
                    </span>
                    <span className="text-xs text-zinc-400 font-bold">
                      {currentLanguage === 'ua' ? 'Ваш виграний бонус' : 'Twój wylosowany bonus'}
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-white">
                    {wonPrize.title[currentLanguage] || wonPrize.title.pl}
                  </h3>

                  <p className="text-zinc-300 text-xs md:text-sm leading-relaxed">
                    {wonPrize.subtext[currentLanguage] || wonPrize.subtext.pl}
                  </p>
                </div>

                {/* Claim CTA */}
                <div className="shrink-0 flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                  <button
                    onClick={handleClaimAndRegister}
                    className="w-full md:w-auto bg-[#8CC63F] hover:bg-[#9de043] text-zinc-950 font-black text-sm md:text-base px-8 py-4 rounded-2xl shadow-xl shadow-[#8CC63F]/25 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5"
                  >
                    <span>{t.ctaClaim[currentLanguage] || t.ctaClaim.pl}</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                  <span className="text-[11px] text-zinc-400 max-w-xs text-center md:text-right">
                    {t.termsNotice[currentLanguage] || t.termsNotice.pl}
                  </span>
                </div>
              </div>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
