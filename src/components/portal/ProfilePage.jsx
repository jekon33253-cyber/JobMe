import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import PortalLayout from './PortalLayout';

const SECTORS = ['logistics', 'production', 'hospitality', 'construction', 'agriculture', 'cleaning', 'retail', 'it'];
const LANGUAGES = ['pl', 'ua', 'en', 'ru', 'de', 'fr', 'es'];

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    full_name: '', phone: '', nationality: '', pesel: '',
    date_of_birth: '', address: '', city: '',
    preferred_sectors: [], languages: [], experience_years: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        nationality: profile.nationality || '',
        pesel: profile.pesel || '',
        date_of_birth: profile.date_of_birth || '',
        address: profile.address || '',
        city: profile.city || '',
        preferred_sectors: profile.preferred_sectors || [],
        languages: profile.languages || [],
        experience_years: profile.experience_years || 0,
      });
    }
  }, [profile]);

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function toggleArrayItem(field, item) {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      await updateProfile({ avatar_url: publicUrl });
    } catch (err) {
      console.error('Avatar upload error:', err);
    }
    setAvatarUploading(false);
  }

  const initials = (form.full_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <PortalLayout activePage="profile">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-white">{t('portal.profile.title')}</h1>
        <p className="text-zinc-500 text-sm mt-1">{t('portal.profile.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <div className="flex items-center gap-5">
            <div className="relative group">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-2 border-zinc-700" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8CC63F] to-[#00B4B4] flex items-center justify-center text-white text-2xl font-black">
                  {initials}
                </div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="material-symbols-outlined text-white">photo_camera</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
              {avatarUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-2xl">
                  <div className="w-6 h-6 border-2 border-[#8CC63F] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            <div>
              <h3 className="text-white font-bold">{form.full_name || t('portal.profile.noName')}</h3>
              <p className="text-zinc-500 text-sm">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8CC63F]">person</span>
            {t('portal.profile.personalInfo')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'full_name', label: t('portal.profile.fullName'), type: 'text', icon: 'badge' },
              { key: 'phone', label: t('portal.profile.phone'), type: 'tel', icon: 'phone' },
              { key: 'nationality', label: t('portal.profile.nationality'), type: 'text', icon: 'flag' },
              { key: 'pesel', label: 'PESEL', type: 'text', icon: 'pin' },
              { key: 'date_of_birth', label: t('portal.profile.dob'), type: 'date', icon: 'calendar_today' },
              { key: 'experience_years', label: t('portal.profile.experience'), type: 'number', icon: 'work_history' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">{f.label}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-lg">{f.icon}</span>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => handleChange(f.key, f.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600
                               focus:outline-none focus:border-[#8CC63F]/50 focus:ring-1 focus:ring-[#8CC63F]/25 transition-all"
                  />
                </div>
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">{t('portal.profile.address')}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-lg">home</span>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => handleChange('address', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600
                             focus:outline-none focus:border-[#8CC63F]/50 focus:ring-1 focus:ring-[#8CC63F]/25 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">{t('portal.profile.city')}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-lg">location_city</span>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => handleChange('city', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm placeholder-zinc-600
                             focus:outline-none focus:border-[#8CC63F]/50 focus:ring-1 focus:ring-[#8CC63F]/25 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preferred sectors */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00B4B4]">category</span>
            {t('portal.profile.sectors')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {SECTORS.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleArrayItem('preferred_sectors', s)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  form.preferred_sectors.includes(s)
                    ? 'bg-[#8CC63F]/15 border-[#8CC63F]/30 text-[#8CC63F]'
                    : 'bg-[#1a1a1a] border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {t(`sectors.${s}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-400">translate</span>
            {t('portal.profile.languages')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(l => (
              <button
                key={l}
                type="button"
                onClick={() => toggleArrayItem('languages', l)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  form.languages.includes(l)
                    ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                    : 'bg-[#1a1a1a] border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#8CC63F] to-[#6BA32E] text-white font-bold text-sm
                       shadow-lg shadow-[#8CC63F]/25 hover:shadow-xl hover:-translate-y-0.5
                       active:translate-y-0 transition-all duration-200 disabled:opacity-50"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('portal.profile.saving')}
              </span>
            ) : t('portal.profile.save')}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-[#8CC63F] text-sm font-medium animate-pulse">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              {t('portal.profile.saved')}
            </span>
          )}
        </div>
      </form>
    </PortalLayout>
  );
}
