import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import config from '../config';

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

export default function ChatWidget() {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const waUrl = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent('Hej! Mam pytanie dotyczące ofert pracy JobMe.')}`;
  const tgUrl = `https://t.me/${config.telegramUsername}`;

  if (!expanded) {
    return (
      <div className="fixed bottom-[152px] right-5 z-[910]">
        <button
          onClick={() => setExpanded(true)}
          aria-label="Czat"
          className="w-14 h-14 rounded-full bg-[#8CC63F] text-[#2D2D2D]
                     shadow-xl hover:shadow-2xl hover:-translate-y-0.5
                     transition-all duration-300 cursor-pointer
                     flex items-center justify-center
                     group"
        >
          {/* pulse ring */}
          <span className="absolute inset-0 rounded-full bg-[#8CC63F]/30 animate-ping opacity-75" />
          {/* icon */}
          <span className="relative z-10 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              <line x1="9" y1="10" x2="15" y2="10"/>
              <line x1="12" y1="7" x2="12" y2="13"/>
            </svg>
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[140px] right-5 z-[910] animate-fade-in">
      {/* popup card */}
      <div className="bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden
                      w-72 md:w-80">
        {/* header */}
        <div className="bg-[#8CC63F] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center
                            border-2 border-white/30">
              <Icon name="support_agent" className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{t('chatWidget.title')}</p>
              <p className="text-xs text-white/80 leading-tight">{t('chatWidget.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center
                       justify-center transition-colors cursor-pointer"
            aria-label={t('chatWidget.close')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* body */}
        <div className="p-5 space-y-3">
          {/* WhatsApp */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20
                       border border-[#25D366]/20 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#25D366] text-sm">{t('chatWidget.whatsapp')}</p>
              <p className="text-zinc-500 text-xs">Instant messaging</p>
            </div>
            <Icon name="arrow_forward" className="text-zinc-400 group-hover:translate-x-1 transition-transform ml-auto shrink-0" />
          </a>

          {/* Telegram */}
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-xl bg-[#0088cc]/10 hover:bg-[#0088cc]/20
                       border border-[#0088cc]/20 transition-all duration-200 group"
          >
            <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#0088cc] text-sm">{t('chatWidget.telegram')}</p>
              <p className="text-zinc-500 text-xs">Fast response</p>
            </div>
            <Icon name="arrow_forward" className="text-zinc-400 group-hover:translate-x-1 transition-transform ml-auto shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
}
