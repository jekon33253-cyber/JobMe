import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import RecruiterLayout from './RecruiterLayout';

const STEPS = ['job', 'personal', 'documents', 'confirm'];

export default function RecruiterNewCandidate() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isUA = language === 'ua';
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const fileRef = useRef();

  // Pre-fill from URL params (when coming from jobs page)
  const params = new URLSearchParams(window.location.search);
  const [form, setForm] = useState({
    job_title: params.get('job') || '',
    job_location: params.get('location') || '',
    candidate_first_name: '',
    candidate_last_name: '',
    candidate_phone: '',
    candidate_email: '',
    candidate_dob: '',
    candidate_nationality: '',
    candidate_city: '',
    candidate_notes: '',
    arrival_date: '',
    messenger: '',
    worked_before: false,
    health_issues: '',
  });

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const L = {
    title: isUA ? 'Новий кандидат' : 'Nowy kandydat',
    steps: isUA
      ? ['Вакансія', 'Дані кандидата', 'Документи', 'Підтвердження']
      : ['Oferta pracy', 'Dane kandydata', 'Dokumenty', 'Potwierdzenie'],
    next: isUA ? 'Далі' : 'Dalej',
    back: isUA ? 'Назад' : 'Wstecz',
    submit: isUA ? 'Подати кандидата' : 'Wyślij kandydaturę',
    submitting: isUA ? 'Відправляємо...' : 'Wysyłanie...',
    successTitle: isUA ? 'Кандидата подано успішно!' : 'Kandydat zgłoszony!',
    successMsg: isUA ? 'Ми перевіримо документи та зв\'яжемося з вами.' : 'Sprawdzimy dokumenty i skontaktujemy się z Tobą.',
    viewAll: isUA ? 'Переглянути всіх кандидатів' : 'Zobacz wszystkich kandydatów',
    addAnother: isUA ? 'Додати ще одного' : 'Dodaj kolejnego',
    // Job step
    jobTitle: isUA ? 'Назва вакансії' : 'Nazwa stanowiska',
    jobLocation: isUA ? 'Локація' : 'Lokalizacja',
    chooseFromList: isUA ? 'або виберіть зі списку вакансій' : 'lub wybierz z listy ofert',
    goToJobs: isUA ? 'Переглянути вакансії' : 'Przeglądaj oferty',
    // Personal step
    firstName: isUA ? 'Ім\'я' : 'Imię',
    lastName: isUA ? 'Прізвище' : 'Nazwisko',
    phone: isUA ? 'Телефон (Viber, WhatsApp, Telegram)' : 'Telefon (Viber, WhatsApp, Telegram)',
    email: isUA ? 'Email кандидата' : 'Email kandydata',
    messengers: isUA ? 'Активні месенджери на номері' : 'Komunikatory na numerze',
    arrivalDate: isUA ? 'Дата приїзду' : 'Planowana data przyjazdu',
    dob: isUA ? 'Дата народження' : 'Data urodzenia',
    nationality: isUA ? 'Громадянство' : 'Narodowość',
    city: isUA ? 'Місто проживання' : 'Miasto zamieszkania',
    workedBefore: isUA ? 'Працювали раніше на цьому підприємстві?' : 'Czy pracował/a wcześniej w tym zakładzie?',
    workedYes: isUA ? 'Так, працював(ла)' : 'Tak, pracował/a',
    workedNo: isUA ? 'Ні, вперше' : 'Nie, po raz pierwszy',
    healthIssues: isUA ? 'Проблеми зі здоров\'ям / обмеження' : 'Problemy zdrowotne / ograniczenia',
    healthPlaceholder: isUA ? 'Немає або вкажіть особливості...' : 'Brak lub opisz ewentualne ograniczenia...',
    notes: isUA ? 'Примітки (додаткова інфо)' : 'Uwagi (dodatkowe info)',
    // Documents step
    docsTitle: isUA ? 'Завантажте документи' : 'Prześlij dokumenty',
    docsHint: isUA ? 'Паспорт, фото, документи на перебування' : 'Paszport, zdjęcie, dokumenty pobytowe',
    upload: isUA ? 'Вибрати файли' : 'Wybierz pliki',
    dragHint: isUA ? 'PDF, JPG, PNG — до 10 МБ' : 'PDF, JPG, PNG — maks. 10 MB',
    noDocsHint: isUA ? 'Документи можна додати пізніше' : 'Dokumenty można dodać później',
    // Confirm step
    confirmTitle: isUA ? 'Перевірте дані' : 'Sprawdź dane',
    confirmJob: isUA ? 'Вакансія' : 'Oferta pracy',
    confirmCandidate: isUA ? 'Кандидат' : 'Kandydat',
    confirmDocs: isUA ? 'Документи' : 'Dokumenty',
    agreeText: isUA ? 'Я підтверджую правильність даних та згоду кандидата на обробку персональних даних' : 'Potwierdzam poprawność danych i zgodę kandydata na przetwarzanie danych osobowych',
  };

  const [agreed, setAgreed] = useState(false);

  async function handleFileUpload(files) {
    const newDocs = [];
    for (const file of files) {
      newDocs.push({ name: file.name, file, size: file.size });
    }
    setUploadedDocs(prev => [...prev, ...newDocs]);
  }

  function handleDrop(e) {
    e.preventDefault();
    handleFileUpload(Array.from(e.dataTransfer.files));
  }

  async function handleSubmit() {
    if (!agreed) return;
    setSubmitting(true);
    try {
      // 1. Insert candidate record
      const { data: candData, error: candError } = await supabase
        .from('recruiter_candidates')
        .insert({ ...form, recruiter_id: user.id })
        .select()
        .single();

      if (candError) throw candError;

      // 2. Upload documents to Supabase storage
      for (const doc of uploadedDocs) {
        const ext = doc.name.split('.').pop();
        const path = `${user.id}/${candData.id}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage.from('recruiter-docs').upload(path, doc.file);
        if (!upErr) {
          await supabase.from('recruiter_documents').insert({
            recruiter_candidate_id: candData.id,
            recruiter_id: user.id,
            doc_type: 'other',
            file_name: doc.name,
            file_path: path,
            file_size: doc.size,
          });
        }
      }

      setDone(true);
    } catch (err) {
      console.error('Submit error:', err);
      alert(isUA ? 'Помилка при відправці. Спробуйте ще раз.' : 'Błąd podczas wysyłania. Spróbuj ponownie.');
    }
    setSubmitting(false);
  }

  if (done) {
    return (
      <RecruiterLayout activePage="candidates">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-emerald-400 text-4xl">check_circle</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-2">{L.successTitle}</h1>
          <p className="text-zinc-400 text-sm mb-8">{L.successMsg}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.href = '/recruiter/candidates'}
              className="px-6 py-3 rounded-xl bg-[#00B4B4] text-white font-bold text-sm hover:bg-[#007A7A] transition"
            >
              {L.viewAll}
            </button>
            <button
              onClick={() => { setDone(false); setStep(0); setForm({ job_title: '', job_location: '', candidate_first_name: '', candidate_last_name: '', candidate_phone: '', candidate_email: '', candidate_dob: '', candidate_nationality: '', candidate_city: '', candidate_notes: '', arrival_date: '', messenger: '', worked_before: false, health_issues: '' }); setUploadedDocs([]); setAgreed(false); }}
              className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-bold text-sm hover:border-zinc-500 transition"
            >
              {L.addAnother}
            </button>
          </div>
        </div>
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout activePage="candidates">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white">{L.title}</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  i < step ? 'bg-[#00B4B4] text-white' :
                  i === step ? 'bg-[#00B4B4] text-white shadow-lg shadow-[#00B4B4]/30' :
                  'bg-zinc-800 text-zinc-500'
                }`}>
                  {i < step ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
                </div>
                <p className={`text-[10px] mt-1 font-bold hidden sm:block ${i === step ? 'text-[#00B4B4]' : 'text-zinc-600'}`}>
                  {L.steps[i]}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all ${i < step ? 'bg-[#00B4B4]' : 'bg-zinc-800'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">

          {/* Step 0: Job */}
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">{L.steps[0]}</h2>
              <Field label={L.jobTitle} required>
                <Input value={form.job_title} onChange={v => set('job_title', v)} placeholder="Pracownik produkcji..." required />
              </Field>
              <Field label={L.jobLocation}>
                <Input value={form.job_location} onChange={v => set('job_location', v)} placeholder="Wrocław / Śląsk..." />
              </Field>
              <div className="pt-2 border-t border-zinc-800/50">
                <p className="text-zinc-500 text-xs mb-2">{L.chooseFromList}</p>
                <button
                  type="button"
                  onClick={() => window.location.href = '/recruiter/jobs'}
                  className="text-[#00B4B4] text-xs font-bold hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">work_outline</span>
                  {L.goToJobs}
                </button>
              </div>
            </div>
          )}

          {/* Step 1: Personal data */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">{L.steps[1]}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={L.firstName} required>
                  <Input value={form.candidate_first_name} onChange={v => set('candidate_first_name', v)} placeholder="Ivan" required />
                </Field>
                <Field label={L.lastName} required>
                  <Input value={form.candidate_last_name} onChange={v => set('candidate_last_name', v)} placeholder="Petrenko" required />
                </Field>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={L.phone}>
                  <Input value={form.candidate_phone} onChange={v => set('candidate_phone', v)} placeholder="+380... (Viber, WhatsApp, Telegram)" type="tel" />
                </Field>
                <Field label={L.email}>
                  <Input value={form.candidate_email} onChange={v => set('candidate_email', v)} placeholder="ivan@email.com" type="email" />
                </Field>
              </div>

              {/* Messengers tags */}
              <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  {L.messengers}
                </label>
                <div className="flex gap-2 flex-wrap">
                  {['Viber', 'WhatsApp', 'Telegram'].map(m => {
                    const active = (form.messenger || '').includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          const currentArr = form.messenger ? form.messenger.split(', ').filter(Boolean) : [];
                          const newArr = active ? currentArr.filter(x => x !== m) : [...currentArr, m];
                          set('messenger', newArr.join(', '));
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          active
                            ? 'bg-[#00B4B4] text-white border-[#00B4B4]'
                            : 'bg-[#1a1a1a] text-zinc-400 border-zinc-800 hover:border-zinc-600'
                        }`}
                      >
                        {m} {active && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={L.arrivalDate}>
                  <Input value={form.arrival_date} onChange={v => set('arrival_date', v)} type="date" />
                </Field>
                <Field label={L.dob}>
                  <Input value={form.candidate_dob} onChange={v => set('candidate_dob', v)} type="date" />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={L.nationality}>
                  <Input value={form.candidate_nationality} onChange={v => set('candidate_nationality', v)} placeholder="Ukraina" />
                </Field>
                <Field label={L.city}>
                  <Input value={form.candidate_city} onChange={v => set('candidate_city', v)} placeholder="Wrocław" />
                </Field>
              </div>

              {/* Worked before */}
              <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  {L.workedBefore}
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => set('worked_before', false)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      !form.worked_before
                        ? 'bg-[#1a1a1a] text-white border-[#00B4B4]'
                        : 'bg-[#1a1a1a]/50 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {L.workedNo}
                  </button>
                  <button
                    type="button"
                    onClick={() => set('worked_before', true)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      form.worked_before
                        ? 'bg-[#00B4B4]/20 text-[#00B4B4] border-[#00B4B4]'
                        : 'bg-[#1a1a1a]/50 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {L.workedYes}
                  </button>
                </div>
              </div>

              {/* Health issues */}
              <Field label={L.healthIssues}>
                <Input value={form.health_issues} onChange={v => set('health_issues', v)} placeholder={L.healthPlaceholder} />
              </Field>

              <Field label={L.notes}>
                <textarea
                  value={form.candidate_notes}
                  onChange={e => set('candidate_notes', e.target.value)}
                  placeholder={isUA ? 'Додаткові відомості...' : 'Dodatkowe informacje...'}
                  rows={2}
                  className="w-full px-3 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#00B4B4]/50 transition-all resize-none"
                />
              </Field>
            </div>
          )}

          {/* Step 2: Documents */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white mb-1">{L.docsTitle}</h2>
                <p className="text-zinc-500 text-xs mb-4">{isUA ? 'Завантажте документи кандидата у відповідні розділи' : 'Prześlij dokumenty kandydata w odpowiednich sekcjach'}</p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    key: 'pesel',
                    icon: 'badge',
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-500/10',
                    borderColor: 'border-blue-500/30',
                    titlePL: 'PESEL',
                    titleUA: 'ПЕСЕЛЬ',
                    descPL: 'Zaświadczenie o nadaniu numeru PESEL',
                    descUA: 'Довідка про надання номера ПЕСЕЛЬ',
                  },
                  {
                    key: 'passport',
                    icon: 'menu_book',
                    color: 'text-amber-400',
                    bgColor: 'bg-amber-500/10',
                    borderColor: 'border-amber-500/30',
                    titlePL: 'Paszport',
                    titleUA: 'Паспорт',
                    descPL: 'Pierwsza strona oraz wszystkie strony z pieczątkami i wpisami',
                    descUA: 'Перша сторінка, і всі сторінки з печатками та відмітками',
                  },
                  {
                    key: 'karta_pobytu',
                    icon: 'credit_card',
                    color: 'text-emerald-400',
                    bgColor: 'bg-emerald-500/10',
                    borderColor: 'border-emerald-500/30',
                    titlePL: 'Karta Pobytu',
                    titleUA: 'Карта Побиту',
                    descPL: 'Decyzja wojewody oraz oba boki Karty Pobytu (jeśli posiada)',
                    descUA: 'Децизія та карта побиту з двох сторін (якщо є)',
                  },
                  {
                    key: 'other',
                    icon: 'folder',
                    color: 'text-purple-400',
                    bgColor: 'bg-purple-500/10',
                    borderColor: 'border-purple-500/30',
                    titlePL: 'Inne dokumenty',
                    titleUA: 'Інші документи',
                    descPL: 'Wszystkie pozostałe dokumenty (wiza, oświadczenie, kursy itp.)',
                    descUA: 'Всі інші наявні документи (віза, освядчення, сертифікати тощо)',
                  },
                ].map(cat => {
                  const catFiles = uploadedDocs.filter(d => d.docType === cat.key);
                  return (
                    <div key={cat.key} className={`p-4 bg-[#1a1a1a] rounded-2xl border ${cat.borderColor}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl ${cat.bgColor} flex items-center justify-center shrink-0`}>
                            <span className={`material-symbols-outlined ${cat.color} text-lg`}>{cat.icon}</span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-bold">{isUA ? cat.titleUA : cat.titlePL}</p>
                            <p className="text-zinc-500 text-xs mt-0.5">{isUA ? cat.descUA : cat.descPL}</p>
                          </div>
                        </div>

                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition cursor-pointer self-start sm:self-center shrink-0">
                          <span className="material-symbols-outlined text-sm">upload</span>
                          <span>{isUA ? 'Додати файли' : 'Dodaj pliki'}</span>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={e => {
                              const files = Array.from(e.target.files);
                              const newDocs = files.map(file => ({ name: file.name, file, size: file.size, docType: cat.key }));
                              setUploadedDocs(prev => [...prev, ...newDocs]);
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>

                      {/* List files for this category */}
                      {catFiles.length > 0 ? (
                        <div className="space-y-2 mt-3 pt-3 border-t border-zinc-800/60">
                          {catFiles.map((doc, idx) => (
                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-[#111] rounded-xl border border-zinc-800/40">
                              <span className={`material-symbols-outlined ${cat.color} text-base`}>description</span>
                              <span className="text-white text-xs font-medium flex-1 truncate">{doc.name}</span>
                              <span className="text-zinc-500 text-[10px]">{(doc.size / 1024).toFixed(0)} KB</span>
                              <button
                                type="button"
                                onClick={() => setUploadedDocs(prev => prev.filter(d => d !== doc))}
                                className="text-zinc-600 hover:text-red-400 transition p-1"
                              >
                                <span className="material-symbols-outlined text-sm">close</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-zinc-600 text-[11px] italic mt-1">{isUA ? 'Файли не завантажено' : 'Brak wgranych plików'}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-zinc-600 text-xs text-center pt-2">{L.noDocsHint}</p>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-6">{L.confirmTitle}</h2>

              <div className="space-y-4 mb-6">
                <SummaryBlock icon="work_outline" label={L.confirmJob} color="text-[#00B4B4]">
                  <p className="text-white font-bold">{form.job_title || '—'}</p>
                  {form.job_location && <p className="text-zinc-400 text-xs">{form.job_location}</p>}
                </SummaryBlock>

                <SummaryBlock icon="person" label={L.confirmCandidate} color="text-[#8CC63F]">
                  <p className="text-white font-bold">{form.candidate_first_name} {form.candidate_last_name}</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs text-zinc-400">
                    {form.candidate_phone && <p>📞 {form.candidate_phone} {form.messenger ? `(${form.messenger})` : ''}</p>}
                    {form.candidate_email && <p>✉ {form.candidate_email}</p>}
                    {form.arrival_date && <p className="text-[#00B4B4] font-bold">🗓 {L.arrivalDate}: {new Date(form.arrival_date).toLocaleDateString('pl-PL')}</p>}
                    {form.candidate_nationality && <p>🌍 {form.candidate_nationality}</p>}
                    {form.candidate_city && <p>📍 {form.candidate_city}</p>}
                    <p>🏭 {L.workedBefore}: <span className={form.worked_before ? 'text-emerald-400 font-bold' : ''}>{form.worked_before ? L.workedYes : L.workedNo}</span></p>
                    {form.health_issues && <p className="col-span-2 text-amber-400">🏥 {L.healthIssues}: {form.health_issues}</p>}
                  </div>
                </SummaryBlock>

                <SummaryBlock icon="folder" label={L.confirmDocs} color="text-amber-400">
                  {uploadedDocs.length === 0 ? (
                    <p className="text-zinc-500 text-sm">{isUA ? 'Без документів' : 'Bez dokumentów'}</p>
                  ) : (
                    <div className="space-y-1">
                      {[
                        { key: 'pesel', labelPL: 'PESEL', labelUA: 'ПЕСЕЛЬ' },
                        { key: 'passport', labelPL: 'Paszport', labelUA: 'Паспорт' },
                        { key: 'karta_pobytu', labelPL: 'Karta Pobytu', labelUA: 'Карта Побиту' },
                        { key: 'other', labelPL: 'Inne', labelUA: 'Інші' },
                      ].map(cat => {
                        const catFiles = uploadedDocs.filter(d => d.docType === cat.key);
                        if (catFiles.length === 0) return null;
                        return (
                          <div key={cat.key} className="text-xs">
                            <span className="text-[#00B4B4] font-bold">{isUA ? cat.labelUA : cat.labelPL}: </span>
                            <span className="text-zinc-300">{catFiles.map(f => f.name).join(', ')}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </SummaryBlock>
              </div>

              {/* Agreement */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#00B4B4] rounded"
                />
                <span className="text-zinc-400 text-sm">{L.agreeText}</span>
              </label>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-zinc-800/50">
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-600 text-sm font-bold transition-all"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                {L.back}
              </button>
            ) : (
              <div />
            )}

            {step < STEPS.length - 1 ? (
              <button
                onClick={() => {
                  if (step === 0 && !form.job_title.trim()) return;
                  if (step === 1 && (!form.candidate_first_name.trim() || !form.candidate_last_name.trim())) return;
                  setStep(s => s + 1);
                }}
                className="flex items-center gap-1 px-5 py-2.5 rounded-xl bg-[#00B4B4] text-white text-sm font-bold hover:bg-[#007A7A] transition-all"
              >
                {L.next}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!agreed || submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00B4B4] to-[#007A7A] text-white text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all shadow-lg"
              >
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{L.submitting}</>
                ) : (
                  <><span className="material-symbols-outlined text-lg">send</span>{L.submit}</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text', required }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-[#00B4B4]/50 transition-all"
    />
  );
}

function SummaryBlock({ icon, label, color, children }) {
  return (
    <div className="p-4 bg-[#1a1a1a] rounded-xl border border-zinc-800/40">
      <div className="flex items-center gap-2 mb-2">
        <span className={`material-symbols-outlined text-lg ${color}`}>{icon}</span>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{label}</p>
      </div>
      {children}
    </div>
  );
}
