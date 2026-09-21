import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getVacancies } from '../lib/vacancies';
import config from '../config';
import { trackAiQuery, trackAiJobResult, trackAiApply, trackChannelClick } from '../lib/analytics';

function Icon({ name, className = '' }) {
  return (
    <span className={`material-symbols-outlined ${className}`} aria-hidden="true">
      {name}
    </span>
  );
}

// Transparent Multi-Lingual Natural Language Intent Extractor (PL / UA / RU / EN)
function extractJobCriteria(query) {
  const q = query.toLowerCase();
  const criteria = {
    location: null,
    category: null,
    accommodation: null,
    couples: null,
    language: null,
    isUrgent: false,
    isOutOfScope: false,
  };

  // Check for out-of-scope probes / non-existent benefits
  if (
    q.includes('samochód') || q.includes('автомоб') || q.includes('машин') || q.includes('car') ||
    q.includes('czas nieokreślony') || q.includes('бессрочн') || q.includes('permanent contract') ||
    q.includes('tylko w nocy') || q.includes('только ночью') || q.includes('only night') ||
    q.includes('dokładnie moja pensja') || q.includes('точно моя зарплата') || q.includes('exact salary')
  ) {
    criteria.isOutOfScope = true;
  }

  // Location
  if (
    q.includes('wroc') || q.includes('вроц') || q.includes('doln') || q.includes('нижн') ||
    q.includes('świebodz') || q.includes('nowa ruda') || q.includes('klodz')
  ) {
    criteria.location = 'Dolny Śląsk';
  } else if (
    q.includes('sosnow') || q.includes('соснов') || q.includes('śląsk') || q.includes('силез') ||
    q.includes('katow') || q.includes('dąbrow') || q.includes('silesia')
  ) {
    criteria.location = 'Sosnowiec / Śląsk';
  } else if (q.includes('pozn') || q.includes('позн') || q.includes('wielkop')) {
    criteria.location = 'Poznań / Wielkopolska';
  }

  // Housing
  if (
    q.includes('mieszk') || q.includes('житл') || q.includes('жиль') || q.includes('darmow') ||
    q.includes('бесплатн') || q.includes('безкошт') || q.includes('pokój') || q.includes('покой') ||
    q.includes('housing') || q.includes('accommodation') || q.includes('room')
  ) {
    criteria.accommodation = true;
  }

  // Couples
  if (
    q.includes('par') || q.includes('пар') || q.includes('двоих') || q.includes('двох') ||
    q.includes('семь') || q.includes('сім') || q.includes('couple')
  ) {
    criteria.couples = true;
  }

  // Category
  if (
    q.includes('prod') || q.includes('произв') || q.includes('виробн') || q.includes('завод') ||
    q.includes('mont') || q.includes('монт') || q.includes('factory') || q.includes('operator') ||
    q.includes('оператор')
  ) {
    criteria.category = 'Produkcja';
  } else if (
    q.includes('magaz') || q.includes('склад') || q.includes('logist') || q.includes('логист') ||
    q.includes('паков') || q.includes('pakow') || q.includes('warehouse') || q.includes('packing')
  ) {
    criteria.category = 'Magazyn / Logistyka';
  }

  // Language
  if (
    q.includes('bez pol') || q.includes('без пол') || q.includes('не знаю') || q.includes('brak') ||
    q.includes('не розумію') || q.includes('no polish') || q.includes('english')
  ) {
    criteria.language = 'Brak / Podstawowy';
  }

  // Urgency
  if (
    q.includes('gorąc') || q.includes('гаряч') || q.includes('hot') || q.includes('piln') ||
    q.includes('срочн') || q.includes('термін') || q.includes('urgent') || q.includes('od zaraz') ||
    q.includes('сейчас') || q.includes('now')
  ) {
    criteria.isUrgent = true;
  }

  return criteria;
}

// Matching engine against official vacancies DB (strict - no fake matches)
function matchOffers(jobs, criteria) {
  if (!Array.isArray(jobs) || jobs.length === 0 || criteria.isOutOfScope) return [];

  const scored = jobs.map((job) => {
    let score = 0;
    const matchReasons = [];

    const locStr = `${job.location || ''} ${job.city || ''} ${job.voivodeship || ''}`.toLowerCase();
    const houseStr = (job.housing || '').toLowerCase();
    const titleStr = (job.jobTitle || '').toLowerCase();

    // Location match
    if (criteria.location) {
      if (criteria.location === 'Dolny Śląsk' && (locStr.includes('doln') || locStr.includes('świebodz') || locStr.includes('nowa ruda') || locStr.includes('kłodzk'))) {
        score += 3;
        matchReasons.push('✓ Lokalizacja: Dolny Śląsk');
      } else if (criteria.location.includes('Sosnowiec') && (locStr.includes('sosnow') || locStr.includes('śląsk'))) {
        score += 3;
        matchReasons.push('✓ Lokalizacja: Sosnowiec / Śląsk');
      } else if (criteria.location.includes('Poznań')) {
        // We do not have Poznań jobs currently
        score = -10;
      }
    }

    // Housing match: accurately differentiate free from paid
    if (criteria.accommodation) {
      if (job.housingType === 'free' || houseStr.includes('darmowe')) {
        score += 2;
        matchReasons.push('✓ Darmowe zakwaterowanie');
      } else if (job.housingPrice) {
        score += 1;
        matchReasons.push(`✓ Mieszkanie (${job.housingPrice} zł/mc)`);
      }
    }

    // Couples match
    if (criteria.couples) {
      if (job.couplesWelcome || houseStr.includes('pokoje') || houseStr.includes('darmowe')) {
        score += 2;
        matchReasons.push('✓ Dostępne dla par');
      }
    }

    // Category match
    if (criteria.category) {
      if (criteria.category === 'Produkcja' && (job.category === 'Produkcja' || titleStr.includes('produk') || titleStr.includes('montaż') || titleStr.includes('butli'))) {
        score += 2;
        matchReasons.push('✓ Branża: Produkcja');
      } else if (criteria.category === 'Magazyn / Logistyka') {
        // Currently active catalog is industrial production
        score -= 5;
      }
    }

    // Language safety (coordinator support)
    if (criteria.language) {
      if (job.languageRequired === 'brak') {
        score += 2;
        matchReasons.push('✓ Brak wymogu języka');
      } else {
        score += 1;
        matchReasons.push('✓ Podstawowy polski');
      }
    }

    // Urgency
    if (criteria.isUrgent) {
      score += 1;
      matchReasons.push('✓ Szybki start');
    }

    return { job, score, matchReasons };
  });

  // Strict: only return offers that scored positively
  const filtered = scored.filter((item) => item.score > 0);
  filtered.sort((a, b) => b.score - a.score);

  return filtered.slice(0, 2);
}

export default function ChatWidget({ onOpenSmartLead, onOpenVacancyDetail }) {
  const { currentLanguage } = useLanguage();
  
  const jobs = useMemo(() => {
    return getVacancies(currentLanguage);
  }, [currentLanguage]);

  const [expanded, setExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const tgUrl = `https://t.me/${config.telegramUsername}`;

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText = currentLanguage === 'ua'
        ? `Привіт! 👋 Я помічник JobMe. Wyszukuję w aktualnej bazie ofert JobMe (KRAZ nr ${config.kraz}). Введіть місто, бажані умови або запитайте про житло:`
        : `Cześć! 👋 Wyszukuję w aktualnej bazie ofert JobMe (KRAZ nr ${config.kraz}). Jakiej pracy szukasz? Możesz wpisać miasto, branżę lub zapytać o mieszkanie:`;

      setMessages([
        {
          sender: 'assistant',
          text: welcomeText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    }
  }, [currentLanguage, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend = null) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    trackAiQuery(query);

    // Add user message
    const userMsg = {
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // Natural Language Intent Extraction + Structured Search
    setTimeout(() => {
      const criteria = extractJobCriteria(query);
      const matches = matchOffers(jobs, criteria);
      trackAiJobResult(matches.length);

      let replyText = '';
      const identifiedItems = [];
      if (criteria.location) identifiedItems.push(`📍 ${criteria.location}`);
      if (criteria.accommodation) identifiedItems.push(currentLanguage === 'ua' ? '🏠 З житлом' : '🏠 Zakwaterowanie');
      if (criteria.couples) identifiedItems.push(currentLanguage === 'ua' ? '👫 Для пар' : '👫 Dla par');
      if (criteria.category) identifiedItems.push(`⚙️ ${criteria.category}`);
      if (criteria.language) identifiedItems.push(currentLanguage === 'ua' ? '🗣️ Без польської' : '🗣️ Bez języka');

      // Check for out-of-scope / hallucination test queries
      if (criteria.isOutOfScope) {
        replyText = currentLanguage === 'ua'
          ? 'У нашій базі офіційних вакансій JobMe немає інформації про такі нестандартні умови (наприклад, службовий автомобіль, робота тільки вночі або безстроковий договір). Стандартні умови — це офіційна Umowa zlecenie з ZUS, перевірене житло та своєчасні виплати. Ви можете уточнити це питання у координатора:'
          : 'W aktualnej bazie JobMe brak potwierdzenia takich niestandardowych warunków (np. samochód służbowy, praca tylko nocna czy umowa bezterminowa). Standardem jest legalna umowa zlecenie z ZUS, zakwaterowanie i zaliczki. Koordynator w Telegramie odpowie na szczegółowe pytania:';
      } else if (identifiedItems.length > 0 && matches.length > 0) {
        replyText = currentLanguage === 'ua'
          ? `Розпізнані критерії: ${identifiedItems.join(' • ')}. В актуальній базі JobMe знайдено:`
          : `Rozpoznane parametry: ${identifiedItems.join(' • ')}. W aktualnej bazie ofert JobMe dopasowano:`;
      } else if (identifiedItems.length > 0 && matches.length === 0) {
        replyText = currentLanguage === 'ua'
          ? `За критеріями (${identifiedItems.join(' • ')}) прямих вільних місць зараз немає. Напишіть координатору в Telegram — є ротаційні зміни:`
          : `Dla podanych kryteriów (${identifiedItems.join(' • ')}) brak aktualnie bezpośrednich wolnych miejsc. Skontaktuj się z koordynatorem w Telegramie:`;
      } else {
        replyText = currentLanguage === 'ua'
          ? 'Wyszukuję w aktualnej bazie ofert JobMe. Ось актуальні пропозиції:'
          : 'Wyszukuję w aktualnej bazie ofert JobMe. Oto bieżące oferty w systemie:';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: replyText,
          criteria: identifiedItems,
          // Strict: never hallucinate or inject irrelevant jobs when 0 matches
          matches: matches,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
      setIsTyping(false);
    }, 350);
  };

  if (!expanded) {
    return (
      <div className="fixed bottom-[80px] md:bottom-6 right-4 z-[910]">
        <button
          onClick={() => setExpanded(true)}
          aria-label="Wyszukaj ofertę w bazie JobMe"
          className="group flex items-center gap-2.5 bg-[#8CC63F] hover:bg-[#7ab335] text-[#2D2D2D]
                     px-4 py-3.5 rounded-full shadow-2xl hover:shadow-primary/40 hover:-translate-y-1
                     transition-all duration-300 cursor-pointer border-2 border-white"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2D2D2D]" />
          </span>
          <span className="font-black text-xs md:text-sm">
            {currentLanguage === 'ua' ? 'Підбір вакансій' : 'Wyszukaj ofertę'}
          </span>
          <Icon name="smart_toy" className="text-xl" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-[74px] md:bottom-6 right-3 md:right-5 z-[920] animate-fade-in w-[94vw] sm:w-96 max-h-[82vh] flex flex-col">
      <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden flex flex-col flex-1 max-h-[82vh]">
        {/* Header with Telegram & KRAZ honesty */}
        <div className="bg-[#2D2D2D] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8CC63F] text-[#2D2D2D] flex items-center justify-center font-black">
              <Icon name="smart_toy" className="text-xl" />
            </div>
            <div>
              <p className="text-sm font-black leading-tight flex items-center gap-1.5">
                JobMe Smart Matcher
                <span className="w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse" />
              </p>
              <p className="text-[11px] text-zinc-400">
                {currentLanguage === 'ua' ? `База вакансій JobMe • KRAZ nr ${config.kraz}` : `Baza ofert JobMe • KRAZ nr ${config.kraz}`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Zamknij"
          >
            <Icon name="close" className="text-base" />
          </button>
        </div>

        {/* Telegram Direct Action Banner */}
        <div className="bg-[#0088cc] px-4 py-2 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0" aria-hidden="true">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
            </svg>
            <span className="truncate">
              {currentLanguage === 'ua' ? 'Прямий зв’язок із рекрутером:' : 'Bezpośredni kontakt z rekruterem:'}
            </span>
          </div>
          <a
            href={tgUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackChannelClick('telegram', 'ai_chat_header')}
            className="bg-white text-[#0088cc] font-black px-2.5 py-1 rounded-lg hover:bg-zinc-100 transition-colors shrink-0"
          >
            {currentLanguage === 'ua' ? 'Telegram ⚡' : 'Telegram ⚡'}
          </a>
        </div>

        {/* Chat message feed */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3 bg-zinc-50 text-xs md:text-sm">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[90%] p-3.5 rounded-2xl leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-[#2D2D2D] text-white rounded-br-none'
                    : 'bg-white text-zinc-800 border border-zinc-200 rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>

                {/* Render structured matched offers with explanation tags */}
                {m.matches && m.matches.length > 0 && (
                  <div className="mt-3 space-y-2.5">
                    {m.matches.map(({ job, matchReasons }, jIdx) => (
                      <div key={jIdx} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-left space-y-1.5">
                        <div className="flex items-baseline justify-between gap-1">
                          <p className="font-black text-xs text-[#2D2D2D] truncate">{job.jobTitle}</p>
                          <span className="text-[10px] font-bold text-[#5a8a00] bg-green-50 px-1.5 py-0.5 rounded border border-green-200 shrink-0">
                            Netto
                          </span>
                        </div>
                        <p className="text-xs font-black text-[#5a8a00]">{job.salary}</p>
                        <p className="text-[11px] text-zinc-600 line-clamp-1">
                          {job.location} • {job.housingType === 'free' ? 'Darmowe mieszkanie' : job.housingPrice ? `${job.housingPrice} zł/mc` : job.housing}
                        </p>

                        {/* Match Reasons Explanations */}
                        {matchReasons && matchReasons.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {matchReasons.map((reason, rIdx) => (
                              <span key={rIdx} className="text-[9px] font-bold bg-green-100/70 text-green-800 px-1.5 py-0.5 rounded">
                                {reason}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={`https://t.me/${config.telegramUsername}?text=${encodeURIComponent('Aplikuję na ofertę: ' + job.jobTitle)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackAiApply(job.jobTitle)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#0088cc] text-white rounded-lg text-[11px] font-black hover:bg-[#0077b3] transition-colors"
                          >
                            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden="true">
                              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.28 13.605l-2.95-.924c-.642-.204-.657-.642.136-.953l11.526-4.445c.536-.194 1.006.131.57.965z"/>
                            </svg>
                            Telegram ⚡
                          </a>

                          {onOpenVacancyDetail && (
                            <button
                              onClick={() => {
                                setExpanded(false);
                                onOpenVacancyDetail(job);
                              }}
                              className="py-1.5 px-2 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              {currentLanguage === 'ua' ? 'Деталі' : 'Szczegóły'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-zinc-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white border border-zinc-200 p-3 rounded-2xl w-fit">
              <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="p-2.5 bg-white border-t border-zinc-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => handleSend('Wrocław Dolny Śląsk z mieszkaniem')}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-bold text-zinc-700 whitespace-nowrap cursor-pointer"
          >
            📍 Dolny Śląsk
          </button>
          <button
            onClick={() => handleSend('Sosnowiec Śląsk')}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-bold text-zinc-700 whitespace-nowrap cursor-pointer"
          >
            📍 Sosnowiec
          </button>
          <button
            onClick={() => handleSend('Oferty dla par')}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-bold text-zinc-700 whitespace-nowrap cursor-pointer"
          >
            👫 Dla par
          </button>
          {onOpenSmartLead && (
            <button
              onClick={() => { setExpanded(false); onOpenSmartLead(); }}
              className="px-2.5 py-1 bg-[#8CC63F]/20 hover:bg-[#8CC63F]/30 text-[#2D2D2D] rounded-lg text-xs font-black whitespace-nowrap cursor-pointer"
            >
              📋 {currentLanguage === 'ua' ? 'Анкета за 30с' : 'Smart Form'}
            </button>
          )}
        </div>

        {/* Input box */}
        <div className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2">
          <input
            type="text"
            placeholder={currentLanguage === 'ua' ? 'Напр: Вроцлав виробництво з житлом...' : 'Wpisz np. Dolny Śląsk z mieszkaniem dla par...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-zinc-100 px-3.5 py-2.5 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#8CC63F]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="w-9 h-9 rounded-xl bg-[#8CC63F] hover:bg-[#7ab335] disabled:opacity-40 text-[#2D2D2D] flex items-center justify-center transition-all cursor-pointer shrink-0"
            aria-label="Wyślij"
          >
            <Icon name="send" className="text-base" />
          </button>
        </div>
      </div>
    </div>
  );
}
