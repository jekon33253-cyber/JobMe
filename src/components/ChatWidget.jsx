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

// Transparent Multi-Lingual Intent & Constraint Parser (PL / UA / RU / EN)
function parseQuery(query) {
  const q = query.toLowerCase().trim();

  // 1. Unrelated questions
  if (
    q.includes('pogoda') || q.includes('погода') || q.includes('weather') ||
    q.includes('bilet') || q.includes('билет') || q.includes('ticket') ||
    q.includes('przepis') || q.includes('рецепт') || q.includes('kino') ||
    q.includes('piłka') || q.includes('футбол')
  ) {
    return { type: 'unrelated' };
  }

  // 2. Unsupported benefits / out-of-scope probes
  if (
    q.includes('samochód') || q.includes('автомоб') || q.includes('машин') || q.includes('car') || q.includes('авто') ||
    q.includes('czas nieokreślony') || q.includes('бессрочн') || q.includes('permanent contract') ||
    q.includes('tylko w nocy') || q.includes('только ночью') || q.includes('only night') ||
    q.includes('50 zł') || q.includes('50zl') || q.includes('100 zł') || q.includes('100$')
  ) {
    return { type: 'unsupported_benefit' };
  }

  // 3. Salary & Rate inquiry
  if (
    q.includes('ile można zarobić') || q.includes('ile zarobię') || q.includes('jaka stawka') ||
    q.includes('зарплат') || q.includes('дохід') || q.includes('чистыми') || q.includes('на руки') ||
    q.includes('скільки') || q.includes('зароби') || q.includes('сколько платите') ||
    q.includes('how much') || q.includes('hourly rate') || q.includes('earning')
  ) {
    return { type: 'salary_inquiry' };
  }

  // 4. Unsupported profession / category
  if (
    q.includes('kierowc') || q.includes('водій') || q.includes('водител') || q.includes('driver') ||
    q.includes('budow') || q.includes('будівельн') || q.includes('строител') || q.includes('construct') ||
    q.includes('spawacz') || q.includes('зварювальник') || q.includes('сварщик') || q.includes('welder') ||
    q.includes('sprząt') || q.includes('прибиран') || q.includes('уборк') || q.includes('clean') ||
    q.includes('kucharz') || q.includes('повар') || q.includes('cook')
  ) {
    return { type: 'unsupported_profession' };
  }

  // 5. Unsupported locations
  const unsupportedCities = ['warszaw', 'варшав', 'warsaw', 'kraków', 'krakow', 'крак', 'gdańsk', 'gdansk', 'гданьск', 'poznan', 'poznań', 'позн', 'łódź', 'lodz', 'ловіч', 'lublin', 'люблін'];
  const hasUnsupportedCity = unsupportedCities.some((city) => q.includes(city));
  if (hasUnsupportedCity) {
    return { type: 'unsupported_location' };
  }

  // 6. Regular Job Search with constraints
  const criteria = {
    type: 'job_search',
    location: null, // 'dolny_slask' | 'slask'
    housing: null, // 'free' | 'any'
    couples: false,
    languageNoReq: false,
    category: null,
    isUrgent: false,
  };

  if (
    q.includes('wroc') || q.includes('вроц') || q.includes('doln') || q.includes('нижн') ||
    q.includes('świebodz') || q.includes('nowa ruda') || q.includes('klodz')
  ) {
    criteria.location = 'dolny_slask';
  } else if (
    q.includes('sosnow') || q.includes('соснов') || q.includes('śląsk') || q.includes('силез') || q.includes('katow')
  ) {
    criteria.location = 'slask';
  }

  // Housing: distinguish strictly free from any
  if (
    q.includes('darmow') || q.includes('bezpłat') || q.includes('бесплатн') ||
    q.includes('безкошт') || q.includes('free accom') || q.includes('free hous')
  ) {
    criteria.housing = 'free';
  } else if (
    q.includes('mieszk') || q.includes('житл') || q.includes('жиль') ||
    q.includes('pokój') || q.includes('покой') || q.includes('housing') || q.includes('accommodation')
  ) {
    criteria.housing = 'any';
  }

  if (
    q.includes('par') || q.includes('пар') || q.includes('двоих') || q.includes('двох') ||
    q.includes('семь') || q.includes('сім') || q.includes('couple')
  ) {
    criteria.couples = true;
  }

  if (
    q.includes('bez pol') || q.includes('без пол') || q.includes('не знаю') ||
    q.includes('brak') || q.includes('не розумію') || q.includes('no polish')
  ) {
    criteria.languageNoReq = true;
  }

  if (
    q.includes('prod') || q.includes('произв') || q.includes('виробн') ||
    q.includes('завод') || q.includes('mont') || q.includes('монт') || q.includes('factory')
  ) {
    criteria.category = 'Produkcja';
  }

  if (
    q.includes('zaraz') || q.includes('piln') || q.includes('термін') ||
    q.includes('срочн') || q.includes('urgent') || q.includes('сейчас') || q.includes('now')
  ) {
    criteria.isUrgent = true;
  }

  return criteria;
}

// Matching engine adhering strictly to Section 8:
// Never label approximate matches as exact.
function matchVacancies(jobs, parsed) {
  if (!Array.isArray(jobs) || jobs.length === 0) return { exact: [], alternatives: [] };

  if (parsed.type === 'unrelated' || parsed.type === 'unsupported_benefit') {
    return { exact: [], alternatives: [] };
  }

  if (parsed.type === 'unsupported_location' || parsed.type === 'unsupported_profession') {
    return {
      exact: [],
      alternatives: jobs.slice(0, 2).map((j) => ({
        job: j,
        isAlternative: true,
        matchReasons: ['💡 Alternatywna oferta z zakwaterowaniem'],
      })),
    };
  }

  if (parsed.type === 'salary_inquiry') {
    return {
      exact: jobs.slice(0, 2).map((j) => ({
        job: j,
        isAlternative: false,
        matchReasons: [`✓ Stawka ${j.salary}`],
      })),
      alternatives: [],
    };
  }

  // Exact filtering
  const exact = [];
  const alternatives = [];

  jobs.forEach((j) => {
    let matchesAll = true;
    const reasons = [];

    // Location
    if (parsed.location === 'dolny_slask') {
      const isDolny = (j.voivodeship || '').toLowerCase().includes('dolny') ||
                      (j.location || '').toLowerCase().includes('doln') ||
                      (j.location || '').toLowerCase().includes('świebodz') ||
                      (j.location || '').toLowerCase().includes('nowa ruda');
      if (!isDolny) matchesAll = false;
      else reasons.push('✓ Dolny Śląsk');
    }

    if (parsed.location === 'slask') {
      const isSlask = (j.city === 'Sosnowiec') ||
                      ((j.voivodeship || '').toLowerCase() === 'śląsk') ||
                      (j.location || '').toLowerCase().includes('sosnow');
      if (!isSlask) matchesAll = false;
      else reasons.push('✓ Śląsk (Sosnowiec)');
    }

    // Housing: free vs paid
    if (parsed.housing === 'free') {
      if (j.housingType !== 'free') {
        matchesAll = false; // Exclude Świebodzice (550 zł) from exact free housing
      } else {
        reasons.push('✓ Darmowe zakwaterowanie');
      }
    } else if (parsed.housing === 'any') {
      if (j.housingType === 'free') reasons.push('✓ Darmowe zakwaterowanie');
      else if (j.housingPrice) reasons.push(`✓ Mieszkanie (${j.housingPrice} zł/mc)`);
      else reasons.push('✓ Zapewnione zakwaterowanie');
    }

    // Couples
    if (parsed.couples) {
      if (!j.couplesWelcome) matchesAll = false;
      else reasons.push('✓ Pokoje dla par');
    }

    // Language
    if (parsed.languageNoReq) {
      if (j.languageRequired !== 'brak') matchesAll = false;
      else reasons.push('✓ Bez języka (koordynator)');
    }

    // Category
    if (parsed.category) {
      reasons.push('✓ Produkcja przemysłowa');
    }

    if (matchesAll) {
      exact.push({ job: j, isAlternative: false, matchReasons: reasons });
    } else if (parsed.housing === 'free' && j.housingPrice && parsed.location === 'dolny_slask') {
      // Near miss: user wanted free in Dolny Śląsk, job is in Dolny Śląsk but housing is 550 zł
      alternatives.push({
        job: j,
        isAlternative: true,
        matchReasons: ['💡 Alternatywa: zakwaterowanie 550 zł/mc potrącane z wypłaty'],
      });
    }
  });

  return { exact, alternatives };
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
        : `Cześć! 👋 Wyszukuję w aktualnej bazie ofert JobMe (KRAZ nr ${config.kraz}). Jakiej pracy szukasz? Możesz wpisać miasto, branżę lub zapytać o zakwaterowanie:`;

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

    // Natural Language Intent Extraction + Strict Matching
    setTimeout(() => {
      const parsed = parseQuery(query);
      const { exact, alternatives } = matchVacancies(jobs, parsed);
      trackAiJobResult(exact.length);

      let replyText = '';

      if (parsed.type === 'unrelated') {
        replyText = currentLanguage === 'ua'
          ? 'Я спеціалізуюся на працевлаштуванні в Польщі та підборі вакансій JobMe. Запитайте мене про актуальну роботу, зарплату, безкоштовне житло або вакансії для пар!'
          : 'Jestem asystentem rekrutacyjnym JobMe. Zapytaj mnie o aktualne oferty pracy w Polsce, zarobki na rękę, darmowe mieszkanie lub pracę dla par!';
      } else if (parsed.type === 'unsupported_benefit') {
        replyText = currentLanguage === 'ua'
          ? 'У нашій офіційній базі JobMe немає таких нестандартних умов (наприклад, службовий автомобіль, безстроковий договір чи завищені погодинні ставки). Ми працевлаштовуємо офіційно на Umowa zlecenie з повним ZUS, надаємо перевірене житло та регулярні аванси. Уточніть деталі у координатора:'
          : 'W aktualnej bazie ofert JobMe brak potwierdzenia takich warunków (np. samochód służbowy, umowa bezterminowa czy stawki powyżej rynkowych). Standard to w 100% legalna umowa zlecenie z ZUS, zakwaterowanie i zaliczki. Koordynator w Telegramie wyjaśni szczegóły:';
      } else if (parsed.type === 'salary_inquiry') {
        replyText = currentLanguage === 'ua'
          ? '💰 Базова ставка: 25,00 zł / год. нетто (для студентів до 26 років: 31,40 zł брутто). Орієнтовний місячний дохід: 4 200 – 6 000 zł netto (залежно від годин і змін). Ось наші активні вакансії:'
          : '💰 Stawka podstawowa w JobMe wynosi 25,00 zł / godz. netto (studenci do 26 lat: 31,40 zł brutto). Miesięczny zarobek na rękę wynosi średnio 4 200 – 6 000 zł netto. Oto aktualne oferty:';
      } else if (parsed.type === 'unsupported_location') {
        replyText = currentLanguage === 'ua'
          ? 'Наразі ми ведемо набір у регіонах Нижньої Сілезії (Нова Руда, Свебодзіце) та Сілезії (Сосновець). У зазначеному вами місті зараз прямих місць немає. Рекомендуємо перевірені пропозиції з житлом:'
          : 'Obecnie prowadzimy rekrutację na Dolnym Śląsku (Nowa Ruda, Świebodzice) oraz na Śląsku (Sosnowiec). W wybranym mieście nie mamy obecnie wakatów. Sprawdź dostępne alternatywy z zakwaterowaniem:';
      } else if (parsed.type === 'unsupported_profession') {
        replyText = currentLanguage === 'ua'
          ? 'JobMe спеціалізується на виробничих підприємствах, монтажі та промисловості. За вказаною спеціальністю прямих місць немає, але є перевірені виробничі вакансії, де не потрібен досвід:'
          : 'JobMe specjalizuje się w produkcji przemysłowej, montażu i automotive. Na podane stanowisko nie prowadzimy obecnie naboru. Sprawdź oferty produkcyjne niewymagające doświadczenia:';
      } else if (exact.length > 0) {
        replyText = currentLanguage === 'ua'
          ? 'Wyszukuję w aktualnej bazie ofert JobMe. Знайдено точні збіги за вашими критеріями:'
          : 'Wyszukuję w aktualnej bazie ofert JobMe. Znaleziono dokładne dopasowania spełniające Twoje kryteria:';
      } else if (alternatives.length > 0) {
        replyText = currentLanguage === 'ua'
          ? 'Точного збігу за всіма фільтрами немає, але в нас є схожі альтернативні варіанти:'
          : 'Brak 100% dopasowania do wszystkich kryteriów, ale przygotowałem zbliżone propozycje alternatywne:';
      } else {
        replyText = currentLanguage === 'ua'
          ? 'За вказаними параметрами в системі зараз немає відкритих місць. Напишіть нашому координатору в Telegram — постійно відкриваються нові зміни:'
          : 'Dla podanych kryteriów brak aktualnie wolnych miejsc. Skontaktuj się bezpośrednio z koordynatorem w Telegramie — prowadzimy rotację wakatów:';
      }

      const displayedOffers = exact.length > 0 ? exact : alternatives;

      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: replyText,
          matches: displayedOffers,
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
                    {m.matches.map(({ job, isAlternative, matchReasons }, jIdx) => (
                      <div key={jIdx} className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-left space-y-1.5">
                        <div className="flex items-baseline justify-between gap-1">
                          <p className="font-black text-xs text-[#2D2D2D] truncate">{job.jobTitle}</p>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                            isAlternative
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-green-50 text-[#5a8a00] border-green-200'
                          }`}>
                            {isAlternative ? (currentLanguage === 'ua' ? 'Альтернатива' : 'Alternatywa') : 'Netto'}
                          </span>
                        </div>
                        <p className="text-xs font-black text-[#5a8a00]">{job.salary}</p>
                        <p className="text-[11px] text-zinc-600 line-clamp-1">
                          {job.location} • {job.housingType === 'free' ? (currentLanguage === 'ua' ? 'Безкоштовне житло' : 'Darmowe mieszkanie') : job.housingPrice ? `${job.housingPrice} zł/mc` : job.housing}
                        </p>

                        {/* Match Reasons Explanations */}
                        {matchReasons && matchReasons.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {matchReasons.map((reason, rIdx) => (
                              <span key={rIdx} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                isAlternative ? 'bg-amber-100/70 text-amber-800' : 'bg-green-100/70 text-green-800'
                              }`}>
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
            onClick={() => handleSend('Wrocław z darmowym mieszkaniem')}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-bold text-zinc-700 whitespace-nowrap cursor-pointer"
          >
            📍 Wrocław + Darmowe mieszkanie
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
          <button
            onClick={() => handleSend('Ile można zarobić na rękę?')}
            className="px-2.5 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-xs font-bold text-zinc-700 whitespace-nowrap cursor-pointer"
          >
            💰 Ile na rękę?
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
            placeholder={currentLanguage === 'ua' ? 'Напр: Вроцлав, безкоштовне житло...' : 'Wpisz np. Wrocław z darmowym mieszkaniem...'}
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
