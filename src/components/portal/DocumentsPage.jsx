import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import PortalLayout from './PortalLayout';

const DOC_TYPES = [
  { key: 'passport', icon: 'badge', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
  { key: 'visa', icon: 'flight', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
  { key: 'karta_pobytu', icon: 'credit_card', color: 'text-[#8CC63F]', bgColor: 'bg-[#8CC63F]/10' },
  { key: 'pesel', icon: 'pin', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
  { key: 'work_permit', icon: 'work', color: 'text-[#00B4B4]', bgColor: 'bg-[#00B4B4]/10' },
  { key: 'other', icon: 'description', color: 'text-zinc-400', bgColor: 'bg-zinc-500/10' },
];

const STATUS_STYLES = {
  pending: { label: 'Oczekuje', bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: 'schedule' },
  approved: { label: 'Zatwierdzone', bg: 'bg-[#8CC63F]/10', text: 'text-[#8CC63F]', border: 'border-[#8CC63F]/20', icon: 'check_circle' },
  rejected: { label: 'Odrzucone', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: 'cancel' },
};

function DropZone({ onFileDrop, uploading, t }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFileDrop(files);
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
        dragging
          ? 'border-[#8CC63F] bg-[#8CC63F]/5'
          : 'border-zinc-700 hover:border-zinc-600 bg-[#141414]'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={e => onFileDrop(Array.from(e.target.files))}
        className="hidden"
      />
      {uploading ? (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[#8CC63F] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">{t('portal.documents.uploading')}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#8CC63F]/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[#8CC63F] text-3xl">cloud_upload</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">{t('portal.documents.dropTitle')}</p>
            <p className="text-zinc-500 text-xs mt-1">{t('portal.documents.dropSubtitle')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function DocCard({ doc, t, onDelete }) {
  const type = DOC_TYPES.find(d => d.key === doc.doc_type) || DOC_TYPES.at(-1);
  const status = STATUS_STYLES[doc.status] || STATUS_STYLES.pending;

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-zinc-800/50 p-4 hover:border-zinc-700/60 transition-all group">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${type.bgColor}`}>
          <span className={`material-symbols-outlined text-xl ${type.color}`}>{type.icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-white text-sm font-bold truncate">{doc.file_name}</p>
          <p className="text-zinc-500 text-xs mt-0.5">{t(`portal.documents.types.${doc.doc_type}`)} · {formatFileSize(doc.file_size)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${status.bg} ${status.text} border ${status.border}`}>
              <span className="material-symbols-outlined text-xs">{status.icon}</span>
              {status.label}
            </span>
            <span className="text-zinc-600 text-xs">
              {new Date(doc.uploaded_at).toLocaleDateString('pl-PL')}
            </span>
          </div>
          {doc.reviewer_notes && (
            <p className="text-zinc-500 text-xs mt-2 italic">💬 {doc.reviewer_notes}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(doc)}
          className="p-1 text-zinc-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
          title="Usuń"
        >
          <span className="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </div>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState('passport');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) loadDocs();
  }, [user]);

  async function loadDocs() {
    const { data } = await supabase
      .from('documents')
      .select('*')
      .eq('user_id', user.id)
      .order('uploaded_at', { ascending: false });
    setDocs(data || []);
    setLoading(false);
  }

  async function handleUpload(files) {
    setUploading(true);
    for (const file of files) {
      try {
        const ext = file.name.split('.').pop();
        const path = `${user.id}/${Date.now()}_${file.name}`;
        const { error: uploadErr } = await supabase.storage.from('documents').upload(path, file);
        if (uploadErr) throw uploadErr;

        await supabase.from('documents').insert({
          user_id: user.id,
          doc_type: selectedType,
          file_name: file.name,
          file_path: path,
          file_size: file.size,
          status: 'pending',
        });
      } catch (err) {
        console.error('Upload error:', err);
      }
    }
    await loadDocs();
    setUploading(false);
  }

  async function handleDelete(doc) {
    if (!confirm(t('portal.documents.confirmDelete'))) return;
    await supabase.storage.from('documents').remove([doc.file_path]);
    await supabase.from('documents').delete().eq('id', doc.id);
    setDocs(prev => prev.filter(d => d.id !== doc.id));
  }

  const filtered = filter === 'all' ? docs : docs.filter(d => d.status === filter);
  const approvedCount = docs.filter(d => d.status === 'approved').length;
  const progress = docs.length > 0 ? Math.round((approvedCount / docs.length) * 100) : 0;

  return (
    <PortalLayout activePage="documents">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">{t('portal.documents.title')}</h1>
        <p className="text-zinc-500 text-sm mt-1">{t('portal.documents.subtitle')}</p>
      </div>

      {/* Progress bar */}
      <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-zinc-400 text-sm font-medium">{t('portal.documents.progress')}</span>
          <span className="text-white font-bold">{progress}%</span>
        </div>
        <div className="h-2.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8CC63F] to-[#00B4B4] rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-zinc-600 text-xs mt-2">{approvedCount} / {docs.length} {t('portal.documents.approved')}</p>
      </div>

      {/* Upload section */}
      <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#8CC63F]">upload_file</span>
          {t('portal.documents.uploadTitle')}
        </h2>
        <div className="mb-4">
          <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-2">
            {t('portal.documents.docType')}
          </label>
          <div className="flex flex-wrap gap-2">
            {DOC_TYPES.filter(d => d.key !== 'other').map(d => (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedType(d.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all border ${
                  selectedType === d.key
                    ? `${d.bgColor} ${d.color} border-current/20`
                    : 'bg-[#1a1a1a] border-zinc-800 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <span className="material-symbols-outlined text-sm">{d.icon}</span>
                {t(`portal.documents.types.${d.key}`)}
              </button>
            ))}
          </div>
        </div>
        <DropZone onFileDrop={handleUpload} uploading={uploading} t={t} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              filter === f
                ? 'bg-[#8CC63F]/15 text-[#8CC63F] border border-[#8CC63F]/20'
                : 'bg-[#1a1a1a] text-zinc-500 border border-zinc-800 hover:text-zinc-300'
            }`}
          >
            {f === 'all' ? t('portal.documents.filterAll') : STATUS_STYLES[f]?.label || f}
            {f !== 'all' && ` (${docs.filter(d => d.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Document list */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-[#8CC63F] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-2">
          {filtered.map(doc => <DocCard key={doc.id} doc={doc} t={t} onDelete={handleDelete} />)}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#141414] border border-zinc-800/60 rounded-2xl">
          <span className="material-symbols-outlined text-5xl text-zinc-700 mb-3">folder_off</span>
          <p className="text-zinc-500 text-sm">{t('portal.documents.noDocs')}</p>
        </div>
      )}
    </PortalLayout>
  );
}
