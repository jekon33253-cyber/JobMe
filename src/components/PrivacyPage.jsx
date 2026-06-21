import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const content = {
  pl: {
    title: 'Polityka Prywatności',
    lastUpdated: 'Ostatnia aktualizacja: 19 czerwca 2026',
    intro: 'Niniejsza Polityka Prywatności określa zasady przetwarzania danych osobowych przez JobMe z siedzibą we Wrocławiu.',
    sections: [
      { title: '1. Administrator Danych', text: 'Administratorem Twoich danych osobowych jest JobMe z siedzibą we Wrocławiu. Kontakt: kontakt@jobme.pl.' },
      { title: '2. Jakie dane zbieramy', text: 'Zbieramy następujące dane: imię, numer telefonu, adres e-mail, miasto oraz preferowany komunikator — wyłącznie w celu odpowiedzi na Twoje zgłoszenie rekrutacyjne lub biznesowe.' },
      { title: '3. Cel przetwarzania', text: 'Dane przetwarzamy w celu: (a) kontaktu w sprawie ofert pracy, (b) kontaktu w sprawie współpracy B2B, (c) analityki ruchu na stronie (Google Analytics, Meta Pixel).' },
      { title: '4. Podstawa prawna', text: 'Podstawą przetwarzania jest Twoja zgoda (art. 6 ust. 1 lit. a RODO) wyrażona poprzez dobrowolne przesłanie formularza kontaktowego.' },
      { title: '5. Odbiorcy danych', text: 'Dane są przekazywane wyłącznie: (a) naszemu zespołowi koordynatorów, (b) narzędziom analitycznym (Google Analytics, Meta) w formie zanonimizowanej. Nie sprzedajemy ani nie udostępniamy danych podmiotom trzecim.' },
      { title: '6. Okres przechowywania', text: 'Dane przechowujemy przez okres 12 miesięcy od ostatniego kontaktu lub do momentu wycofania zgody.' },
      { title: '7. Twoje prawa', text: 'Masz prawo do: dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia oraz wniesienia sprzeciwu. W tym celu napisz na kontakt@jobme.pl.' },
      { title: '8. Pliki cookies', text: 'Strona używa plików cookies Google Analytics i Meta Pixel w celach statystycznych i marketingowych. Możesz wyłączyć cookies w ustawieniach przeglądarki.' },
      { title: '9. Zmiany w polityce', text: 'Zastrzegamy sobie prawo do aktualizacji niniejszej polityki. O istotnych zmianach poinformujemy na stronie głównej.' },
    ],
    backBtn: '← Wróć na stronę główną',
  },
  ua: {
    title: 'Політика конфіденційності',
    lastUpdated: 'Останнє оновлення: 19 червня 2026',
    intro: 'Ця Політика конфіденційності визначає правила обробки персональних даних компанією JobMe зі штаб-квартирою у Вроцлаві.',
    sections: [
      { title: '1. Адміністратор даних', text: 'Адміністратором ваших персональних даних є JobMe зі штаб-квартирою у Вроцлаві. Контакт: kontakt@jobme.pl.' },
      { title: '2. Які дані ми збираємо', text: 'Ми збираємо такі дані: ім\'я, номер телефону, електронну пошту, місто та обраний месенджер — виключно для відповіді на вашу заявку.' },
      { title: '3. Мета обробки', text: 'Дані обробляються з метою: (а) зв\'язку щодо вакансій, (б) зв\'язку щодо B2B-співпраці, (в) аналітики трафіку (Google Analytics, Meta Pixel).' },
      { title: '4. Правова основа', text: 'Підставою для обробки є ваша згода (ст. 6 п. 1 літ. a GDPR), надана шляхом добровільного надсилання контактної форми.' },
      { title: '5. Отримувачі даних', text: 'Дані передаються виключно: (а) нашій команді координаторів, (б) аналітичним інструментам (Google Analytics, Meta) в анонімізованому вигляді. Ми не продаємо та не передаємо дані третім особам.' },
      { title: '6. Термін зберігання', text: 'Дані зберігаються протягом 12 місяців з моменту останнього контакту або до відкликання згоди.' },
      { title: '7. Ваші права', text: 'Ви маєте право на: доступ до даних, виправлення, видалення, обмеження обробки, перенесення та заперечення. Для цього напишіть на kontakt@jobme.pl.' },
      { title: '8. Файли cookie', text: 'Сайт використовує файли cookie Google Analytics та Meta Pixel у статистичних і маркетингових цілях. Ви можете вимкнути cookie в налаштуваннях браузера.' },
      { title: '9. Зміни в політиці', text: 'Ми залишаємо за собою право оновлювати цю політику. Про суттєві зміни повідомимо на головній сторінці.' },
    ],
    backBtn: '← Повернутись на головну',
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: June 19, 2026',
    intro: 'This Privacy Policy outlines how JobMe, based in Wrocław, processes your personal data.',
    sections: [
      { title: '1. Data Controller', text: 'The controller of your personal data is JobMe, based in Wrocław. Contact: kontakt@jobme.pl.' },
      { title: '2. What data we collect', text: 'We collect: first name, phone number, email address, city, and preferred messenger — solely to respond to your recruitment or business inquiry.' },
      { title: '3. Purpose of processing', text: 'Data is processed to: (a) contact you about job offers, (b) contact you about B2B cooperation, (c) website traffic analytics (Google Analytics, Meta Pixel).' },
      { title: '4. Legal basis', text: 'Processing is based on your consent (Art. 6(1)(a) GDPR) given by voluntarily submitting the contact form.' },
      { title: '5. Data recipients', text: 'Data is shared only with: (a) our coordinator team, (b) analytics tools (Google Analytics, Meta) in anonymized form. We do not sell or share data with third parties.' },
      { title: '6. Retention period', text: 'Data is stored for 12 months from the last contact or until consent is withdrawn.' },
      { title: '7. Your rights', text: 'You have the right to: access, rectification, erasure, restriction of processing, data portability, and objection. Write to kontakt@jobme.pl to exercise these rights.' },
      { title: '8. Cookies', text: 'This site uses Google Analytics and Meta Pixel cookies for statistical and marketing purposes. You can disable cookies in your browser settings.' },
      { title: '9. Policy changes', text: 'We reserve the right to update this policy. Significant changes will be announced on the homepage.' },
    ],
    backBtn: '← Back to Home',
  },
};

export default function PrivacyPage({ onBack }) {
  const { currentLanguage } = useLanguage();
  const lang = content[currentLanguage] || content.pl;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-3xl mx-auto px-gutter py-28">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary text-sm font-medium transition-colors mb-8 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          {lang.backBtn}
        </button>

        <h1 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] mb-3">{lang.title}</h1>
        <p className="text-sm text-zinc-400 mb-10">{lang.lastUpdated}</p>
        <p className="text-zinc-700 leading-relaxed mb-10">{lang.intro}</p>

        <div className="space-y-8">
          {lang.sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-lg font-bold text-[#2D2D2D] mb-2">{s.title}</h2>
              <p className="text-zinc-600 leading-relaxed text-sm md:text-base">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
