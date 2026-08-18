import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import RecruiterLayout from './RecruiterLayout';

export default function RecruiterProfile() {
  const { user, profile, updateProfile } = useAuth();
  const { language } = useLanguage();
  const isUA = language === 'ua';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
    }
  }, [profile]);

  const L = {
    title: isUA ? 'Мій профіль' : 'Mój profil',
    subtitle: isUA ? 'Налаштування акаунту рекрутера' : 'Ustawienia konta rekrutera',
    fullName: isUA ? 'Ім\'я та прізвище' : 'Imię i nazwisko',
    email: 'Email',
    phone: isUA ? 'Телефон' : 'Telefon',
    city: isUA ? 'Місто / Локація' : 'Miasto / Siedziba',
    role: isUA ? 'Тип акаунту' : 'Typ konta',
    roleValue: isUA ? 'Фріланс-рекрутер' : 'Rekruter Freelance',
    save: isUA ? 'Зберегти зміни' : 'Zapisz zmiany',
    saving: isUA ? 'Збереження...' : 'Zapisywanie...',
    saved: isUA ? 'Зміни збережено!' : 'Zapisano zmiany!',
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    await updateProfile({
      full_name: fullName,
      phone,
      city,
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  const displayName = fullName || user?.email?.split('@')[0] || 'Recruiter';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <RecruiterLayout activePage="profile">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white">{L.title}</h1>
          <p className="text-zinc-500 text-sm mt-1">{L.subtitle}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800/50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00B4B4] to-[#007A7A] flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg shadow-[#00B4B4]/20">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{displayName}</h2>
              <p className="text-zinc-500 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-lg bg-[#00B4B4]/10 text-[#00B4B4] text-xs font-bold border border-[#00B4B4]/20">
                {L.roleValue}
              </span>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              {L.saved}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                {L.fullName}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#00B4B4]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                {L.email}
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-[#111] border border-zinc-800/60 rounded-xl text-zinc-500 text-sm cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  {L.phone}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+48..."
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#00B4B4]/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                  {L.city}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Wrocław"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#00B4B4]/50 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-[#00B4B4] to-[#007A7A] text-white font-bold text-sm
                         shadow-lg shadow-[#00B4B4]/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {L.saving}
                </span>
              ) : (
                L.save
              )}
            </button>
          </form>
        </div>
      </div>
    </RecruiterLayout>
  );
}
