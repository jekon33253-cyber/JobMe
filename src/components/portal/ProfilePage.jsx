import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabaseClient';
import PortalLayout from './PortalLayout';

const SECTORS = ['logistics', 'production', 'hospitality', 'construction', 'agriculture', 'cleaning', 'retail', 'it'];
const LANGUAGES = ['pl', 'ua', 'en', 'ru', 'de', 'fr', 'es'];

export default function ProfilePage() {
  const { user, profile, updateProfile, updateUserPassword } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({
    full_name: '', phone: '', nationality: '', pesel: '',
    date_of_birth: '', address: '', city: '',
    preferred_sectors: [], languages: [], experience_years: 0,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

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

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPwError('');
    setPwSaved(false);

    if (newPassword !== confirmPassword) {
      setPwError(t('auth.passwordMismatch'));
      return;
    }
    if (newPassword.length < 6) {
      setPwError(t('auth.passwordTooShort'));
      return;
    }

    setPwSaving(true);
    const { error } = await updateUserPassword(newPassword);
    setPwSaving(false);

    if (error) {
      setPwError(error.message);
    } else {
      setPwSaved(true);
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwSaved(false), 3000);
    }
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
              <label className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                <span className="material-symbols-outlined text-white text-xl">photo_camera</span>
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{form.full_name || t('portal.profile.noName')}</h2>
              <p className="text-zinc-500 text-sm">{user?.email}</p>
              {avatarUploading && <p className="text-xs text-[#8CC63F] mt-1">Przesyłanie zdjęcia...</p>}
            </div>
          </div>
        </div>

        {/* Personal info */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#8CC63F]">person</span>
            {t('portal.profile.personalInfo')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">{t('portal.profile.fullName')}</label>
              <input
                type="text"
                value={form.full_name}
                onChange={e => handleChange('full_name', e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#8CC63F]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">{t('portal.profile.phone')}</label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => handleChange('phone', e.target.value)}
                placeholder="+48 123 456 789"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#8CC63F]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">{t('portal.profile.nationality')}</label>
              <input
                type="text"
                value={form.nationality}
                onChange={e => handleChange('nationality', e.target.value)}
                placeholder="np. Ukrainiec, Polak"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#8CC63F]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">PESEL / ID</label>
              <input
                type="text"
                value={form.pesel}
                onChange={e => handleChange('pesel', e.target.value)}
                placeholder="12345678901"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#8CC63F]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">{t('portal.profile.dob')}</label>
              <input
                type="date"
                value={form.date_of_birth}
                onChange={e => handleChange('date_of_birth', e.target.value)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#8CC63F]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">{t('portal.profile.experience')}</label>
              <input
                type="number"
                min="0"
                max="50"
                value={form.experience_years}
                onChange={e => handleChange('experience_years', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#8CC63F]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">{t('portal.profile.address')}</label>
              <input
                type="text"
                value={form.address}
                onChange={e => handleChange('address', e.target.value)}
                placeholder="ul. Główna 12/3"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#8CC63F]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">{t('portal.profile.city')}</label>
              <input
                type="text"
                value={form.city}
                onChange={e => handleChange('city', e.target.value)}
                placeholder="Wrocław"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#8CC63F]/50 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Sectors */}
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
                {t(`portalSectors.${s}`)}
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

      {/* Change Password Card */}
      <div className="mt-10 bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400">lock_reset</span>
          {t('portal.profile.changePasswordTitle')}
        </h2>
        <p className="text-zinc-500 text-sm mb-6">{t('portal.profile.changePasswordSubtitle')}</p>

        {pwError && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {pwError}
          </div>
        )}
        {pwSaved && (
          <div className="mb-4 p-3 rounded-xl bg-[#8CC63F]/10 border border-[#8CC63F]/20 text-[#8CC63F] text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">check_circle</span>
            {t('auth.passwordUpdated')}
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              {t('portal.profile.newPassword')}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#8CC63F]/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
              {t('auth.confirmPassword')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#8CC63F]/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={pwSaving}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm
                       shadow-lg shadow-amber-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                       transition-all duration-200 disabled:opacity-50"
          >
            {pwSaving ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('portal.profile.saving')}
              </span>
            ) : (
              t('portal.profile.changePasswordBtn')
            )}
          </button>
        </form>
      </div>
    </PortalLayout>
  );
}
