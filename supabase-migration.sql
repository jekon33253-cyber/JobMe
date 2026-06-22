-- =================================================
-- JobMe Portal — Supabase SQL Migrations
-- Run this in Supabase Dashboard > SQL Editor
-- =================================================

-- 1. Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  nationality TEXT,
  pesel TEXT,
  date_of_birth DATE,
  address TEXT,
  city TEXT,
  preferred_sectors TEXT[],
  languages TEXT[],
  experience_years INT,
  avatar_url TEXT,
  role TEXT DEFAULT 'candidate', -- 'candidate' | 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Admins read all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-create profile on registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- 2. Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT,
  status TEXT DEFAULT 'pending',
  reviewer_notes TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own docs" ON documents
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all docs" ON documents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- 3. Legalization steps
CREATE TABLE IF NOT EXISTS legalization_steps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  step_name TEXT NOT NULL,
  step_order INT NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE legalization_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own steps" ON legalization_steps
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all steps" ON legalization_steps
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- 4. Applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  status TEXT DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own applications" ON applications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all applications" ON applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- 5. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own notifications" ON notifications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all notifications" ON notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- 6. Storage buckets (run separately in Storage settings)
-- Create bucket: 'documents' (private)
-- Create bucket: 'avatars' (public)

-- Storage policies for 'documents' bucket:
-- INSERT: auth.uid()::text = (storage.foldername(name))[1]
-- SELECT: auth.uid()::text = (storage.foldername(name))[1]
-- DELETE: auth.uid()::text = (storage.foldername(name))[1]

-- Storage policies for 'avatars' bucket:
-- INSERT: auth.uid()::text = split_part(name, '.', 1) OR split_part(name, '/', 1) = 'avatars'
-- SELECT: true (public)
