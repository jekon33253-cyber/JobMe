import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import AdminLayout from './AdminLayout';

export default function AdminDocReview() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => { loadDocs(); }, []);

  async function loadDocs() {
    const { data } = await supabase
      .from('documents')
      .select('*, profiles(full_name, city, nationality)')
      .order('uploaded_at', { ascending: false });
    setDocs(data || []);
    setLoading(false);
  }

  async function updateDoc(docId, status, notes, userId) {
    await supabase.from('documents').update({
      status, reviewer_notes: notes, reviewed_at: new Date().toISOString()
    }).eq('id', docId);

    // Send notification
    await supabase.from('notifications').insert({
      user_id: userId,
      title: status === 'approved' ? 'Dokument zatwierdzony' : 'Dokument odrzucony',
      message: `Twój dokument został ${status === 'approved' ? 'zatwierdzony' : 'odrzucony'}. ${notes || ''}`,
      type: status === 'approved' ? 'success' : 'warning',
      link: '/portal/documents',
    });

    setDocs(prev => prev.map(d => d.id === docId ? { ...d, status, reviewer_notes: notes } : d));
  }

  const filtered = filter === 'all' ? docs : docs.filter(d => d.status === filter);
  const pendingCount = docs.filter(d => d.status === 'pending').length;

  return (
    <AdminLayout activePage="adminDocs">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">Przegląd dokumentów</h1>
        <p className="text-zinc-500 text-sm mt-1">{pendingCount} oczekujących na sprawdzenie</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { key: 'pending', label: 'Oczekujące', count: docs.filter(d => d.status === 'pending').length },
          { key: 'approved', label: 'Zatwierdzone', count: docs.filter(d => d.status === 'approved').length },
          { key: 'rejected', label: 'Odrzucone', count: docs.filter(d => d.status === 'rejected').length },
          { key: 'all', label: 'Wszystkie', count: docs.length },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filter === f.key
                ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                : 'bg-[#1a1a1a] text-zinc-500 border border-zinc-800 hover:text-zinc-300'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map(doc => (
            <DocReviewCard key={doc.id} doc={doc} onUpdate={updateDoc} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#141414] border border-zinc-800/60 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-zinc-700 mb-3">fact_check</span>
          <p className="text-zinc-500 text-sm">Brak dokumentów do wyświetlenia</p>
        </div>
      )}
    </AdminLayout>
  );
}

function DocReviewCard({ doc, onUpdate }) {
  const [notes, setNotes] = useState(doc.reviewer_notes || '');
  const [expanded, setExpanded] = useState(false);

  const statusStyles = {
    pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', label: 'Oczekuje' },
    approved: { bg: 'bg-[#8CC63F]/10', text: 'text-[#8CC63F]', border: 'border-[#8CC63F]/20', label: 'Zatwierdzone' },
    rejected: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', label: 'Odrzucone' },
  };
  const ss = statusStyles[doc.status] || statusStyles.pending;
  const candidateName = doc.profiles?.full_name || 'Nieznany';

  return (
    <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-5 hover:border-zinc-700/50 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-zinc-800">
            <span className="material-symbols-outlined text-zinc-400 text-xl">description</span>
          </div>
          <div>
            <p className="text-white text-sm font-bold">{doc.file_name}</p>
            <p className="text-zinc-500 text-xs">
              {doc.doc_type} · {candidateName} · {new Date(doc.uploaded_at).toLocaleDateString('pl-PL')}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${ss.bg} ${ss.text} border ${ss.border}`}>
          {ss.label}
        </span>
      </div>

      {doc.status === 'pending' && (
        <div className="mt-3 space-y-3">
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Uwagi dla kandydata (opcjonalnie)..."
            className="w-full px-3 py-2.5 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600
                       focus:outline-none focus:border-red-500/40 transition-all"
          />
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate(doc.id, 'approved', notes, doc.user_id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#8CC63F]/10 text-[#8CC63F] text-sm font-bold
                         hover:bg-[#8CC63F]/20 border border-[#8CC63F]/20 transition-all"
            >
              <span className="material-symbols-outlined text-lg">check_circle</span>
              Zatwierdź
            </button>
            <button
              onClick={() => onUpdate(doc.id, 'rejected', notes, doc.user_id)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-bold
                         hover:bg-red-500/20 border border-red-500/20 transition-all"
            >
              <span className="material-symbols-outlined text-lg">cancel</span>
              Odrzuć
            </button>
          </div>
        </div>
      )}

      {doc.reviewer_notes && doc.status !== 'pending' && (
        <p className="text-zinc-500 text-xs mt-2 italic">📝 {doc.reviewer_notes}</p>
      )}
    </div>
  );
}
