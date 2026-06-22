import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useLanguage } from '../../context/LanguageContext';
import AdminLayout from './AdminLayout';

export default function AdminCandidates() {
  const { t } = useLanguage();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [candidateDocs, setCandidateDocs] = useState([]);
  const [candidateLegal, setCandidateLegal] = useState([]);

  useEffect(() => { loadCandidates(); }, []);

  async function loadCandidates() {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setCandidates(data || []);
    setLoading(false);
  }

  async function viewCandidate(candidate) {
    setSelectedCandidate(candidate);
    const [docsRes, legalRes] = await Promise.all([
      supabase.from('documents').select('*').eq('user_id', candidate.id).order('uploaded_at', { ascending: false }),
      supabase.from('legalization_steps').select('*').eq('user_id', candidate.id).order('step_order', { ascending: true }),
    ]);
    setCandidateDocs(docsRes.data || []);
    setCandidateLegal(legalRes.data || []);
  }

  async function updateLegalStep(stepId, status) {
    await supabase.from('legalization_steps').update({
      status,
      completed_at: status === 'completed' ? new Date().toISOString() : null,
    }).eq('id', stepId);
    setCandidateLegal(prev => prev.map(s => s.id === stepId ? { ...s, status, completed_at: status === 'completed' ? new Date().toISOString() : null } : s));
  }

  async function sendNotification(userId, title, message, type = 'info') {
    await supabase.from('notifications').insert({ user_id: userId, title, message, type });
  }

  const filtered = candidates.filter(c =>
    !search || (c.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.city || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.nationality || '').toLowerCase().includes(search.toLowerCase())
  );

  if (selectedCandidate) {
    const c = selectedCandidate;
    const initials = (c.full_name || 'U')[0].toUpperCase();

    return (
      <AdminLayout activePage="adminCandidates">
        <button
          onClick={() => setSelectedCandidate(null)}
          className="flex items-center gap-1 text-zinc-400 hover:text-white text-sm font-medium mb-6 transition"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Powrót do listy
        </button>

        {/* Profile header */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8CC63F] to-[#00B4B4] flex items-center justify-center text-white text-2xl font-black">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">{c.full_name || 'Brak imienia'}</h1>
              <p className="text-zinc-500 text-sm">{c.city || '—'} · {c.nationality || '—'} · {c.phone || '—'}</p>
              <div className="flex gap-2 mt-2">
                {(c.languages || []).map(l => (
                  <span key={l} className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-xs font-bold border border-purple-500/20">
                    {l.toUpperCase()}
                  </span>
                ))}
                {(c.preferred_sectors || []).map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-[#8CC63F]/10 text-[#8CC63F] text-xs font-bold border border-[#8CC63F]/20">
                    {t(`portalSectors.${s}`) || s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Documents */}
          <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">Dokumenty ({candidateDocs.length})</h2>
            {candidateDocs.length > 0 ? (
              <div className="space-y-2">
                {candidateDocs.map(doc => (
                  <DocReviewItem key={doc.id} doc={doc} onUpdate={async (id, status, notes) => {
                    await supabase.from('documents').update({ status, reviewer_notes: notes, reviewed_at: new Date().toISOString() }).eq('id', id);
                    setCandidateDocs(prev => prev.map(d => d.id === id ? { ...d, status, reviewer_notes: notes } : d));
                    await sendNotification(c.id,
                      status === 'approved' ? 'Dokument zatwierdzony' : 'Dokument odrzucony',
                      `Twój dokument "${doc.file_name}" został ${status === 'approved' ? 'zatwierdzony' : 'odrzucony'}. ${notes || ''}`,
                      status === 'approved' ? 'success' : 'warning'
                    );
                  }} />
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm text-center py-4">Brak dokumentów</p>
            )}
          </div>

          {/* Legalization */}
          <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Legalizacja</h2>
              <button
                onClick={async () => {
                  const name = prompt('Nazwa etapu:');
                  if (!name) return;
                  const order = candidateLegal.length + 1;
                  const { data } = await supabase.from('legalization_steps').insert({
                    user_id: c.id, step_name: name, step_order: order, status: 'pending'
                  }).select().single();
                  if (data) setCandidateLegal(prev => [...prev, data]);
                  await sendNotification(c.id, 'Nowy etap legalizacji', `Dodano etap: ${name}`, 'info');
                }}
                className="text-xs text-red-400 hover:text-red-300 font-bold transition flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                Dodaj etap
              </button>
            </div>
            {candidateLegal.length > 0 ? (
              <div className="space-y-2">
                {candidateLegal.map(step => (
                  <div key={step.id} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-zinc-800/40">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      step.status === 'completed' ? 'bg-[#8CC63F]' :
                      step.status === 'in_progress' ? 'bg-[#8CC63F]/20 border-2 border-[#8CC63F]' :
                      'bg-zinc-800'
                    }`}>
                      {step.status === 'completed' ? (
                        <span className="material-symbols-outlined text-white text-sm">check</span>
                      ) : step.status === 'in_progress' ? (
                        <div className="w-2 h-2 rounded-full bg-[#8CC63F] animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-zinc-500" />
                      )}
                    </div>
                    <span className="text-white text-sm font-medium flex-1">{step.step_name}</span>
                    <select
                      value={step.status}
                      onChange={e => {
                        updateLegalStep(step.id, e.target.value);
                        sendNotification(c.id, 'Status legalizacji zmieniony',
                          `Etap "${step.step_name}" zmienił status na: ${e.target.value}`,
                          e.target.value === 'completed' ? 'success' : 'info'
                        );
                      }}
                      className="bg-[#111] border border-zinc-700 rounded-lg px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:border-[#8CC63F]"
                    >
                      <option value="pending">Oczekuje</option>
                      <option value="in_progress">W trakcie</option>
                      <option value="completed">Zakończone</option>
                    </select>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-600 text-sm text-center py-4">Brak etapów</p>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activePage="adminCandidates">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Kandydaci</h1>
          <p className="text-zinc-500 text-sm mt-1">{candidates.length} zarejestrowanych</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600">search</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Szukaj po imieniu, mieście, narodowości..."
          className="w-full pl-10 pr-4 py-3 bg-[#141414] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600
                     focus:outline-none focus:border-red-500/50 transition-all"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider">Kandydat</th>
                  <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider hidden md:table-cell">Miasto</th>
                  <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider hidden md:table-cell">Narodowość</th>
                  <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Telefon</th>
                  <th className="text-left px-4 py-3 text-zinc-500 text-xs font-bold uppercase tracking-wider hidden lg:table-cell">Data</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="border-b border-zinc-800/50 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8CC63F] to-[#00B4B4] flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {(c.full_name || 'U')[0].toUpperCase()}
                        </div>
                        <span className="text-white text-sm font-bold">{c.full_name || 'Brak imienia'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-400 text-sm hidden md:table-cell">{c.city || '—'}</td>
                    <td className="px-4 py-3 text-zinc-400 text-sm hidden md:table-cell">{c.nationality || '—'}</td>
                    <td className="px-4 py-3 text-zinc-400 text-sm hidden lg:table-cell">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs hidden lg:table-cell">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString('pl-PL') : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => viewCandidate(c)}
                        className="p-2 text-zinc-600 hover:text-red-400 transition rounded-lg hover:bg-red-500/10"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <span className="material-symbols-outlined text-4xl text-zinc-700 mb-2">search_off</span>
              <p className="text-zinc-500 text-sm">Nie znaleziono kandydatów</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}

function DocReviewItem({ doc, onUpdate }) {
  const [notes, setNotes] = useState(doc.reviewer_notes || '');

  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    approved: 'text-[#8CC63F] bg-[#8CC63F]/10 border-[#8CC63F]/20',
    rejected: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="p-3 bg-[#1a1a1a] rounded-xl border border-zinc-800/40">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-white text-sm font-bold">{doc.file_name}</p>
          <p className="text-zinc-500 text-xs">{doc.doc_type} · {new Date(doc.uploaded_at).toLocaleDateString('pl-PL')}</p>
        </div>
        <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${statusColors[doc.status] || statusColors.pending}`}>
          {doc.status}
        </span>
      </div>
      {doc.status === 'pending' && (
        <div className="mt-2 space-y-2">
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Uwagi (opcjonalnie)..."
            className="w-full px-3 py-2 bg-[#111] border border-zinc-700 rounded-lg text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-red-500/50"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate(doc.id, 'approved', notes)}
              className="flex-1 py-2 rounded-lg bg-[#8CC63F]/10 text-[#8CC63F] text-xs font-bold hover:bg-[#8CC63F]/20 transition"
            >
              ✓ Zatwierdź
            </button>
            <button
              onClick={() => onUpdate(doc.id, 'rejected', notes)}
              className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 transition"
            >
              ✗ Odrzuć
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
