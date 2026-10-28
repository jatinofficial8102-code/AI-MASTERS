-- APAAR ID-Based Student Data Management System
-- Smart India Hackathon — SIH26263 Database Schema & Row Level Security (RLS)

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  apaar_id TEXT UNIQUE,
  abc_id TEXT,
  roll_no TEXT,
  course TEXT,
  specialization TEXT,
  institution TEXT,
  institution_code TEXT,
  academic_year TEXT,
  current_semester INT DEFAULT 1,
  total_semesters INT DEFAULT 8,
  cgpa NUMERIC(4,2) DEFAULT 0.00,
  credits_accumulated INT DEFAULT 0,
  total_credits_required INT DEFAULT 160,
  profile_completion INT DEFAULT 25,
  avatar_url TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'owner', 'admin', 'verifier')),
  phone TEXT,
  dob TEXT,
  gender TEXT,
  blood_group TEXT,
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ACADEMIC RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.academic_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  record_type TEXT NOT NULL,
  institution TEXT NOT NULL,
  board_or_university TEXT,
  academic_year TEXT NOT NULL,
  score TEXT NOT NULL,
  credits_earned INT DEFAULT 0,
  verification_status TEXT NOT NULL DEFAULT 'Pending' CHECK (verification_status IN ('Verified', 'Under Review', 'Pending', 'Rejected')),
  verified_by TEXT,
  verified_date TEXT,
  verification_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DOCUMENTS METADATA TABLE
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Academic', 'Identity', 'Certificate', 'Migration', 'Caste/EWS')),
  file_type TEXT NOT NULL,
  file_size TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'Pending' CHECK (verification_status IN ('Verified', 'Under Review', 'Pending', 'Rejected')),
  verification_hash TEXT,
  issuer TEXT,
  verified_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONSENTS TABLE
CREATE TABLE IF NOT EXISTS public.consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requester_name TEXT NOT NULL,
  requester_type TEXT NOT NULL,
  purpose TEXT NOT NULL,
  requested_fields TEXT[] DEFAULT ARRAY[]::TEXT[],
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Revoked', 'Expired')),
  expiry_date TEXT,
  security_level TEXT DEFAULT 'Read-Only High Security',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('verification', 'consent', 'academic', 'security', 'system')),
  read BOOLEAN DEFAULT FALSE,
  action_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. APP SETTINGS / OWNER CONFIG TABLE
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow public registration setting default to false (owner-only initial access)
INSERT INTO public.app_settings (key, value)
VALUES ('registration_policy', '{"public_registration_enabled": false, "owner_email": "jathin.cybersecurity@gmail.com"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all user-specific tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Server-side owner verification function (trusted, SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
CREATE POLICY "Users can read their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_owner());

DROP POLICY IF EXISTS "Users can update their permitted profile fields" ON public.profiles;
CREATE POLICY "Users can update their permitted profile fields"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    -- Prevent users from escalating their own role via client payload
    AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
  );

DROP POLICY IF EXISTS "Users can insert their own initial profile" ON public.profiles;
CREATE POLICY "Users can insert their own initial profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ACADEMIC RECORDS POLICIES
DROP POLICY IF EXISTS "Users can view their own academic records" ON public.academic_records;
CREATE POLICY "Users can view their own academic records"
  ON public.academic_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_owner());

DROP POLICY IF EXISTS "Users can insert their own academic records" ON public.academic_records;
CREATE POLICY "Users can insert their own academic records"
  ON public.academic_records FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    -- Initial inserts must be Pending or Under Review, never pre-verified by client
    AND verification_status IN ('Pending', 'Under Review')
  );

DROP POLICY IF EXISTS "Users can delete their own non-verified records" ON public.academic_records;
CREATE POLICY "Users can delete their own non-verified records"
  ON public.academic_records FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id AND verification_status != 'Verified');

-- DOCUMENTS POLICIES
DROP POLICY IF EXISTS "Users can view their own document metadata" ON public.documents;
CREATE POLICY "Users can view their own document metadata"
  ON public.documents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_owner());

DROP POLICY IF EXISTS "Users can insert their own document metadata" ON public.documents;
CREATE POLICY "Users can insert their own document metadata"
  ON public.documents FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND verification_status IN ('Pending', 'Under Review')
  );

DROP POLICY IF EXISTS "Users can delete their own document metadata" ON public.documents;
CREATE POLICY "Users can delete their own document metadata"
  ON public.documents FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- CONSENTS POLICIES
DROP POLICY IF EXISTS "Users can view their own consents" ON public.consents;
CREATE POLICY "Users can view their own consents"
  ON public.consents FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own consents" ON public.consents;
CREATE POLICY "Users can insert their own consents"
  ON public.consents FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own consents" ON public.consents;
CREATE POLICY "Users can update their own consents"
  ON public.consents FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- NOTIFICATIONS POLICIES
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;
CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own notifications read state" ON public.notifications;
CREATE POLICY "Users can update their own notifications read state"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- APP SETTINGS POLICIES (Read-only for public, writable only by owner)
DROP POLICY IF EXISTS "Anyone can view app registration policy" ON public.app_settings;
DROP POLICY IF EXISTS "Anyone can view app settings" ON public.app_settings;
CREATE POLICY "Anyone can view app settings"
  ON public.app_settings FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Only owners can update app settings" ON public.app_settings;
CREATE POLICY "Only owners can update app settings"
  ON public.app_settings FOR UPDATE
  TO authenticated
  USING (public.is_owner())
  WITH CHECK (public.is_owner());

DROP POLICY IF EXISTS "Only owners can insert app settings" ON public.app_settings;
CREATE POLICY "Only owners can insert app settings"
  ON public.app_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_owner());

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (When a user signs up via Supabase Auth)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_owner_account BOOLEAN;
BEGIN
  -- Strict check for initial owner account
  is_owner_account := (LOWER(NEW.email) = 'jathin.cybersecurity@gmail.com');

  INSERT INTO public.profiles (
    id,
    full_name,
    email,
    apaar_id,
    role,
    profile_completion
  )
  VALUES (
    NEW.id,
    CASE WHEN is_owner_account THEN 'Jatin' ELSE COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User') END,
    NEW.email,
    -- Generate APAAR ID format if not set
    '0824-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0'),
    CASE WHEN is_owner_account THEN 'owner' ELSE 'student' END,
    CASE WHEN is_owner_account THEN 100 ELSE 25 END
  )
  ON CONFLICT (id) DO UPDATE SET
    role = CASE WHEN is_owner_account THEN 'owner' ELSE public.profiles.role END,
    full_name = CASE WHEN is_owner_account AND (public.profiles.full_name IS NULL OR public.profiles.full_name = 'Student User') THEN 'Jatin' ELSE public.profiles.full_name END;

  -- Welcome Notification for new account
  INSERT INTO public.notifications (
    user_id,
    title,
    message,
    type,
    action_path
  )
  VALUES (
    NEW.id,
    CASE WHEN is_owner_account THEN 'Welcome Owner & Administrator' ELSE 'Welcome to APAAR Portal' END,
    CASE WHEN is_owner_account 
      THEN 'Your institution owner account has been initialized with full administrative privileges and Level-3 security clearance.'
      ELSE 'Your Automated Permanent Academic Account Registry profile has been created. Please complete your profile details and upload your academic records.'
    END,
    'system',
    '/profile'
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- IDEMPOTENT BACKFILL: If owner was created before this script was executed
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users WHERE LOWER(email) = 'jathin.cybersecurity@gmail.com') THEN
    INSERT INTO public.profiles (
      id,
      full_name,
      email,
      apaar_id,
      role,
      profile_completion
    )
    SELECT 
      id,
      'Jatin',
      email,
      '0824-2026-0001',
      'owner',
      100
    FROM auth.users
    WHERE LOWER(email) = 'jathin.cybersecurity@gmail.com'
    ON CONFLICT (id) DO UPDATE SET
      role = 'owner',
      full_name = 'Jatin';
  END IF;
END $$;

-- STORAGE BUCKET FOR DOCUMENTS (Private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-documents', 'student-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
DROP POLICY IF EXISTS "Users can read own documents" ON storage.objects;
CREATE POLICY "Users can read own documents"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'student-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can upload own documents" ON storage.objects;
CREATE POLICY "Users can upload own documents"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'student-documents' AND (storage.foldername(name))[1] = auth.uid()::text);

DROP POLICY IF EXISTS "Users can delete own documents" ON storage.objects;
CREATE POLICY "Users can delete own documents"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'student-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
