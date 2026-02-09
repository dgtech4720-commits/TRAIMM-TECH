-- #################################################
-- ###      SCHEMA V3.2 - DGTECH / TRAIMM-TECH   ###
-- #################################################
-- Ajouts principaux :
-- - project_type
-- - onboarding_completed
-- - clarification RLS conceptuelle
-- - pas de refonte destructive

-- ============================================
-- CLEAN START (DEV ONLY)
-- ============================================
DROP VIEW IF EXISTS public.projects_with_totals;
DROP TABLE IF EXISTS public.deliverables CASCADE;
DROP TABLE IF EXISTS public.project_chat_messages CASCADE;
DROP TABLE IF EXISTS public.milestones CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- #################################################
-- ###            TABLE DES PROFILS             ###
-- #################################################
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('client', 'manager', 'developer')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS 'Public profile linked to Supabase auth.users';

-- #################################################
-- ###             TABLE DES PROJETS            ###
-- #################################################
CREATE TABLE public.projects (
  id SERIAL PRIMARY KEY,

  client_id UUID NOT NULL REFERENCES public.profiles(id),
  manager_id UUID REFERENCES public.profiles(id),

  title TEXT NOT NULL,
  description TEXT,

  -- 🔑 ONBOARDING
  project_type TEXT NOT NULL
    CHECK (project_type IN ('ACADEMIC', 'CLIENT', 'PERSONAL')),

  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,

  status TEXT NOT NULL DEFAULT 'BROUILLON'
    CHECK (status IN (
      'BROUILLON',
      'SOUMIS',
      'CHIFFRAGE',
      'EN_NEGOCIATION',
      'EN_ATTENTE_PAIEMENT',
      'ACTIF',
      'EN_PAUSE',
      'TERMINÉ',
      'EN_GARANTIE',
      'ANNULÉ'
    )),

  -- 💰 PAIEMENT
  deposit_type TEXT CHECK (deposit_type IN ('percentage', 'fixed')),
  deposit_value NUMERIC(10,2),
  deposit_paid BOOLEAN NOT NULL DEFAULT FALSE,
  final_balance_paid BOOLEAN NOT NULL DEFAULT FALSE,
  payment_method_used TEXT,

  -- 🕒 TIMELINE
  created_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

COMMENT ON TABLE public.projects IS
'Central business entity. Onboarding is tied to project creation.';

-- #################################################
-- ###             TABLE DES JALONS              ###
-- #################################################
CREATE TABLE public.milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES public.profiles(id),

  title TEXT NOT NULL,
  description TEXT,

  status TEXT NOT NULL DEFAULT 'A_FAIRE'
    CHECK (status IN (
      'A_FAIRE',
      'EN_COURS',
      'BLOQUE',
      'EN_REVUE',
      'EN_CORRECTION',
      'VALIDÉ'
    )),

  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  due_date DATE
);

COMMENT ON TABLE public.milestones IS
'Milestones represent paid, reviewable chunks of work.';

-- #################################################
-- ###      VUE CALCULÉE POUR LE PRIX TOTAL      ###
-- #################################################
CREATE VIEW public.projects_with_totals AS
SELECT
  p.*,
  (
    SELECT COALESCE(SUM(m.price), 0)
    FROM public.milestones m
    WHERE m.project_id = p.id
  )::NUMERIC(10,2) AS total_price
FROM public.projects p;

-- #################################################
-- ###          CHAT PROJET (MEMO MAGIQUE)       ###
-- #################################################
CREATE TABLE public.project_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  is_formalized BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- #################################################
-- ###              LIVRABLES                   ###
-- #################################################
CREATE TABLE public.deliverables (
  id SERIAL PRIMARY KEY,
  milestone_id INTEGER NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES public.profiles(id),
  file_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX ON public.projects(client_id);
CREATE INDEX ON public.projects(manager_id);
CREATE INDEX ON public.projects(status);
CREATE INDEX ON public.milestones(project_id);
CREATE INDEX ON public.project_chat_messages(project_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- ⚠️ POLICIES SIMPLIFIÉES (À DURCIR AVANT PROD)

CREATE POLICY "Profiles are readable"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "User can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- AJOUT : Politique pour permettre l'insertion de son propre profil
CREATE POLICY "User can insert own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Project access for client or manager"
ON public.projects FOR SELECT
USING (
  auth.uid() = client_id
  OR auth.uid() = manager_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('manager', 'developer'))
);

CREATE POLICY "Manager can update projects"
ON public.projects FOR UPDATE
USING (
  auth.uid() = manager_id
  OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'manager')
);

-- #################################################
-- ###        TRIGGER NOUVEL UTILISATEUR         ###
-- #################################################
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, avatar_url)
  VALUES (
    NEW.id,
    'client',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
