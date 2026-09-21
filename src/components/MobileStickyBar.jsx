import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import config from '../config';

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export default function MobileStickyBar({ onOpenSmartLead, onNavigateToJobs, isModalOpen = false }) {
  const { currentLanguage } = useLanguage();
  const tgUrl = `https://t.me/${config.telegramUsername}`;

  if (isModalOpen) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[890] bg-white/95 backdrop-blur-lg border-t border-zinc-200 px-3 py-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        {/* Button 1: Browse Jobs */}
        <button
          onClick={() => {
            if (onNavigateToJobs) {
              onNavigateToJobs();
            } else {
              const el = document.getElementById('oferty');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-[#2D2D2D] font-bold text-xs transition-colors cursor-pointer"
        >
          <Icon name="travel_explore" className="text-base text-zinc-600" />
          <span>{currentLanguage === 'ua' ? 'Вакансії' : 'Oferty'}</span>
        </button>

        {/* Button 2: Smart Form Match */}
        <button
          onClick={() => onOpenSmartLead()}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#8CC63F] hover:bg-[#7ab335] text-[#2D2D2D] font-black text-xs shadow-sm transition-all cursor-pointer"
        >
          <Icon name="bolt" className="text-base text-[#2D2D2D]" />
          <span>{currentLanguage === 'ua' ? 'Підбір 30с' : 'Dobierz 30s'}</span>
        </button>

        {/* Button 3: Telegram Priority Contact */}
        <a
          href={tgUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-black text-xs shadow-sm transition-all cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
          </svg>
          <span>Telegram</span>
        </a>
      </div>
    </div>
  );
}
