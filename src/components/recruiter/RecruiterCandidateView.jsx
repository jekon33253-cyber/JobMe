import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import RecruiterLayout from './RecruiterLayout';

const STATUS_STEPS = [
  { key: 'submitted',  icon: 'send',            labelPL: 'Zgłoszono',              labelUA: 'Подано' },
  { key: 'reviewing',  icon: 'manage_search',   labelPL: 'Weryfikacja dokumentów', labelUA: 'Перевірка документів' },
  { key: 'approved',   icon: 'verified',        labelPL: 'Zatwierdzony przez JobMe', labelUA: 'Затверджено JobMe' },
  { key: 'hired',      icon: 'engineering',     labelPL: 'Zatrudniony',            labelUA: 'Найнятий' },
];

export default function RecruiterCandidateView() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isUA = language === 'ua';
  const [candidate, setCandidate] = useState(null);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get candidate ID from URL
  const id = window.location.pathname.split('/').pop();

  useEffect(() => {
    if (id && user) loadData();
  }, [id, user]);

  async function loadData() {
    const [candRes, docsRes] = await Promise.all([
      supabase.from('recruiter_candidates').select('*').eq('id', id).eq('recruiter_id', user.id).single(),
      supabase.from('recruiter_documents').select('*').eq('recruiter_candidate_id', id).order('uploaded_at', { ascending: false }),
    ]);
    setCandidate(candRes.data);
    setDocs(docsRes.data || []);
    setLoading(false);
  }

  const L = {
    back: isUA ? 'Назад до кандидатів' : 'Wróć do kandydatów',
    progress: isUA ? 'Прогрес кандидата' : 'Postęp kandydata',
    info: isUA ? 'Дані кандидата' : 'Dane kandydata',
    vacancy: isUA ? 'Вакансія' : 'Oferta pracy',
    documents: isUA ? 'Документи' : 'Dokumenty',
    noDocs: isUA ? 'Немає завантажених документів' : 'Brak przesłanych dokumentów',
    notes: isUA ? 'Примітки' : 'Uwagi',
    phone: isUA ? 'Телефон' : 'Telefon',
    email: isUA ? 'Email' : 'Email',
    nationality: isUA ? 'Громадянство' : 'Narodowość',
    city: isUA ? 'Місто' : 'Miasto',
    dob: isUA ? 'Дата народження' : 'Data urodzenia',
    statusNotes: isUA ? 'Коментар від JobMe' : 'Komentarz od JobMe',
    notFound: isUA ? 'Кандидата не знайдено' : 'Nie znaleziono kandydata',
    rejected: isUA ? 'Відхилено' : 'Odrzucony',
  };

  const STATUS_COLORS = {
    submitted: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    reviewing: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    approved: 'text-[#8CC63F] bg-[#8CC63F]/10 border-[#8CC63F]/20',
    hired: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    rejected: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  if (loading) {
    return (
      <RecruiterLayout activePage="candidates">
        <div className="flex items-center justify-center py-24">
          <div className="w-10 h-10 border-3 border-[#00B4B4] border-t-transparent rounded-full animate-spin" />
        </div>
      </RecruiterLayout>
    );
  }

  if (!candidate) {
    return (
      <RecruiterLayout activePage="candidates">
        <div className="text-center py-24">
          <span className="material-symbols-outlined text-5xl text-zinc-700 mb-3 block">person_off</span>
          <p className="text-zinc-500">{L.notFound}</p>
        </div>
      </RecruiterLayout>
    );
  }

  const currentStatusIdx = STATUS_STEPS.findIndex(s => s.key === candidate.status);
  const isRejected = candidate.status === 'rejected';

  return (
    <RecruiterLayout activePage="candidates">
      <button
        onClick={() => window.location.href = '/recruiter/candidates'}
        className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm font-medium mb-6 transition"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        {L.back}
      </button>

      {/* Profile header */}
      <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00B4B4] to-[#007A7A] flex items-center justify-center text-white text-2xl font-black shrink-0">
            {(candidate.candidate_first_name || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-extrabold text-white">
              {candidate.candidate_first_name} {candidate.candidate_last_name}
            </h1>
            <p className="text-zinc-400 text-sm mt-0.5">
              {candidate.candidate_nationality && `${candidate.candidate_nationality} · `}
              {candidate.candidate_city && `${candidate.candidate_city} · `}
              {candidate.candidate_phone}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${STATUS_COLORS[candidate.status] || STATUS_COLORS.submitted}`}>
                {isRejected ? L.rejected : (isUA ? STATUS_STEPS[currentStatusIdx]?.labelUA : STATUS_STEPS[currentStatusIdx]?.labelPL) || candidate.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress tracker */}
      {!isRejected && (
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-6">{L.progress}</h2>
          <div className="flex items-center">
            {STATUS_STEPS.map((s, i) => {
              const isCompleted = i < currentStatusIdx;
              const isCurrent = i === currentStatusIdx;
              return (
                <React.Fragment key={s.key}>
                  <div className="flex flex-col items-center min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isCompleted ? 'bg-[#00B4B4]' :
                      isCurrent ? 'bg-[#00B4B4]/20 border-2 border-[#00B4B4]' :
                      'bg-zinc-800'
                    }`}>
                      <span className={`material-symbols-outlined text-lg ${
                        isCompleted || isCurrent ? 'text-[#00B4B4]' : 'text-zinc-600'
                      } ${isCompleted ? 'text-white' : ''}`}>
                        {isCompleted ? 'check' : s.icon}
                      </span>
                    </div>
                    <p className={`text-[10px] mt-1.5 text-center font-bold hidden sm:block max-w-[80px] ${
                      isCurrent ? 'text-[#00B4B4]' : isCompleted ? 'text-zinc-400' : 'text-zinc-700'
                    }`}>
                      {isUA ? s.labelUA : s.labelPL}
                    </p>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 transition-all ${isCompleted ? 'bg-[#00B4B4]' : 'bg-zinc-800'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Status notes from JobMe */}
          {candidate.status_notes && (
            <div className="mt-4 p-3 rounded-xl bg-[#00B4B4]/5 border border-[#00B4B4]/20">
              <p className="text-xs text-zinc-500 font-bold uppercase mb-1">{L.statusNotes}</p>
              <p className="text-zinc-300 text-sm">{candidate.status_notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Rejected message */}
      {isRejected && (
        <div className="mb-6 p-4 rounded-2xl bg-red-900/20 border border-red-500/30">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-red-400 text-2xl">cancel</span>
            <div>
              <p className="text-white font-bold">{L.rejected}</p>
              {candidate.status_notes && <p className="text-zinc-400 text-sm mt-0.5">{candidate.status_notes}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Candidate info */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">{L.info}</h2>
          <div className="space-y-3">
            <InfoRow icon="work_outline" color="text-[#00B4B4]" label={L.vacancy} value={`${candidate.job_title}${candidate.job_location ? ` · ${candidate.job_location}` : ''}`} />
            {candidate.candidate_phone && <InfoRow icon="phone" color="text-emerald-400" label={L.phone} value={candidate.candidate_phone} />}
            {candidate.candidate_email && <InfoRow icon="mail" color="text-blue-400" label={L.email} value={candidate.candidate_email} />}
            {candidate.candidate_nationality && <InfoRow icon="public" color="text-purple-400" label={L.nationality} value={candidate.candidate_nationality} />}
            {candidate.candidate_city && <InfoRow icon="location_on" color="text-amber-400" label={L.city} value={candidate.candidate_city} />}
            {candidate.candidate_dob && <InfoRow icon="cake" color="text-pink-400" label={L.dob} value={new Date(candidate.candidate_dob).toLocaleDateString('pl-PL')} />}
          </div>

          {candidate.candidate_notes && (
            <div className="mt-4 pt-4 border-t border-zinc-800/50">
              <p className="text-zinc-500 text-xs font-bold uppercase mb-2">{L.notes}</p>
              <p className="text-zinc-300 text-sm">{candidate.candidate_notes}</p>
            </div>
          )}
        </div>

        {/* Documents */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">{L.documents} ({docs.length})</h2>
          {docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="material-symbols-outlined text-3xl text-zinc-700 mb-2">folder_open</span>
              <p className="text-zinc-500 text-sm">{L.noDocs}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {docs.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-zinc-800/40">
                  <span className="material-symbols-outlined text-[#00B4B4] text-lg shrink-0">description</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-bold truncate">{doc.file_name}</p>
                    <p className="text-zinc-500 text-xs">{new Date(doc.uploaded_at).toLocaleDateString('pl-PL')}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${
                    doc.status === 'approved' ? 'text-[#8CC63F] bg-[#8CC63F]/10 border-[#8CC63F]/20' :
                    doc.status === 'rejected' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                    'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
}

function InfoRow({ icon, color, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className={`material-symbols-outlined text-lg ${color} shrink-0 mt-0.5`}>{icon}</span>
      <div>
        <p className="text-zinc-500 text-xs">{label}</p>
        <p className="text-white text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
