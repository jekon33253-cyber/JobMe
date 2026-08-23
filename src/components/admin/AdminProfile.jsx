import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import AdminLayout from './AdminLayout';

export default function AdminProfile() {
  const { user, profile, updateProfile, updateUserPassword } = useAuth();
  const { t, language } = useLanguage();
  const isUA = language === 'ua';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    await updateProfile({
      full_name: fullName,
      phone,
    });

    setLoading(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPwError('');
    setPwSaved(false);

    if (newPassword !== confirmPassword) {
      setPwError(t('auth.passwordMismatch') || (isUA ? 'Паролі не співпадають' : 'Hasła się nie zgadzają'));
      return;
    }
    if (newPassword.length < 6) {
      setPwError(t('auth.passwordTooShort') || (isUA ? 'Пароль має бути мін. 6 символів' : 'Hasło musi mieć min. 6 znaków'));
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

  const displayName = fullName || user?.email?.split('@')[0] || 'Admin';

  return (
    <AdminLayout activePage="adminProfile">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-white">
            {isUA ? 'Профіль та налаштування' : 'Profil i Ustawienia'}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            {isUA ? 'Налаштування акаунту адміністратора' : 'Ustawienia konta administratora'}
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800/50">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-2xl font-black shrink-0 shadow-lg shadow-red-500/20">
              {displayName[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{displayName}</h2>
              <p className="text-zinc-500 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                Administrator
              </span>
            </div>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              {isUA ? 'Зміни збережено!' : 'Zapisano zmiany!'}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                {isUA ? "Ім'я та прізвище" : 'Imię i nazwisko'}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-[#111] border border-zinc-800/60 rounded-xl text-zinc-500 text-sm cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                {isUA ? 'Телефон' : 'Telefon'}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+48..."
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm
                         shadow-lg shadow-red-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isUA ? 'Збереження...' : 'Zapisywanie...'}
                </span>
              ) : (
                isUA ? 'Зберегти зміни' : 'Zapisz zmiany'
              )}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="bg-[#141414] border border-zinc-800/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-400">lock_reset</span>
            {isUA ? 'Зміна пароля' : 'Zmiana hasła'}
          </h2>
          <p className="text-zinc-500 text-sm mb-6">
            {isUA ? 'Встановіть новий пароль для входу' : 'Ustaw nowe hasło do logowania'}
          </p>

          {pwError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {pwError}
            </div>
          )}
          {pwSaved && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">check_circle</span>
              {t('auth.passwordUpdated') || (isUA ? 'Пароль успішно оновлено!' : 'Hasło zostało pomyślnie zmienione!')}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                {isUA ? 'Новий пароль' : 'Nowe hasło'}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-zinc-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                {isUA ? 'Підтвердіть пароль' : 'Potwierdź hasło'}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-zinc-800 rounded-xl text-white text-sm focus:outline-none focus:border-red-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={pwSaving}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-sm
                         shadow-lg shadow-amber-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0
                         transition-all duration-200 disabled:opacity-50"
            >
              {pwSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isUA ? 'Збереження...' : 'Zapisywanie...'}
                </span>
              ) : (
                isUA ? 'Змінити пароль' : 'Zmień hasło'
              )}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
