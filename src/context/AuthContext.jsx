import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isRecovery, setIsRecovery] = useState(false);

  // Fetch profile from `profiles` table
  async function fetchProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) {
      console.error('Error fetching profile:', error);
    }
    if (!error && data) setProfile(data);
    return data;
  }

  useEffect(() => {
    let isMounted = true;

    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        if (isMounted) setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          if (isMounted) setIsRecovery(true);
        }
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signUp(email, password, fullName, role = 'candidate') {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });
    return { data, error };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setIsRecovery(false);
  }

  async function resetPassword(email) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/portal/login`,
    });
    return { data, error };
  }

  async function updateUserPassword(newPassword) {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (!error) {
      setIsRecovery(false);
    }
    return { data, error };
  }

  async function updateProfile(updates) {
    if (!user) return { error: { message: 'Not authenticated' } };
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', user.id)
      .select()
      .single();
    if (!error && data) setProfile(data);
    return { data, error };
  }

  const value = {
    user,
    profile,
    loading,
    isRecovery,
    setIsRecovery,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserPassword,
    updateProfile,
    fetchProfile,
    isAdmin: profile?.role === 'admin',
    isRecruiter: profile?.role === 'recruiter',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Protected route wrapper
export function ProtectedRoute({ children, adminOnly = false, recruiterOnly = false }) {
  const { user, loading, isAdmin, isRecruiter } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#8CC63F] border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Ładowanie...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/portal/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  if (recruiterOnly && !isRecruiter && !isAdmin) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return children;
}
