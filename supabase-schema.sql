-- #################################################
-- ###      SCHEMA V3.1 - DGTECH / TRAIMM-TECH   ###
-- #################################################
-- Version corrigée suite à l'erreur de colonne générée.
-- Utilise une VIEW pour les totaux de projet.

-- Supprime les anciennes tables et vues si elles existent pour un redémarrage propre
DROP VIEW IF EXISTS public.projects_with_totals;
DROP TABLE IF EXISTS public.deliverables CASCADE;
DROP TABLE IF EXISTS public.project_chat_messages CASCADE;
DROP TABLE IF EXISTS public.milestones CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- #################################################
-- ###            TABLE DES UTILISATEURS         ###
-- #################################################
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('client', 'manager', 'developer')),
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user.';

-- #################################################
-- ###             TABLE DES PROJETS (corrigée)  ###
-- #################################################
CREATE TABLE public.projects (
  id SERIAL PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.profiles(id),
  manager_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'BROUILLON' CHECK (status IN ('BROUILLON', 'SOUMIS', 'CHIFFRAGE', 'EN_NEGOCIATION', 'EN_ATTENTE_PAIEMENT', 'ACTIF', 'EN_PAUSE', 'TERMINÉ', 'EN_GARANTIE', 'ANNULÉ')),
  
  -- La colonne `total_price` a été retirée pour être remplacée par une vue.
  
  deposit_type TEXT CHECK (deposit_type IN ('percentage', 'fixed')),
  deposit_value NUMERIC(10, 2),
  deposit_paid BOOLEAN NOT NULL DEFAULT FALSE,
  final_balance_paid BOOLEAN NOT NULL DEFAULT FALSE,
  payment_method_used TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);
COMMENT ON TABLE public.projects IS 'Central table for managing projects. Does not contain calculated totals.';

-- #################################################
-- ###             TABLE DES JALONS              ###
-- #################################################
CREATE TABLE public.milestones (
  id SERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  developer_id UUID REFERENCES public.profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'A_FAIRE' CHECK (status IN ('A_FAIRE', 'EN_COURS', 'BLOQUE', 'EN_REVUE', 'EN_CORRECTION', 'VALIDÉ')),
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  due_date DATE
);
COMMENT ON TABLE public.milestones IS 'Defines a specific, deliverable stage of a project with a price.';

-- #################################################
-- ###      VUE CALCULÉE POUR LES TOTAUX         ###
-- #################################################
CREATE VIEW public.projects_with_totals AS
SELECT
  p.*,
  (SELECT COALESCE(SUM(m.price), 0) FROM public.milestones m WHERE m.project_id = p.id)::NUMERIC(10,2) AS total_price
FROM public.projects p;

COMMENT ON VIEW public.projects_with_totals IS 'Extends projects with dynamically calculated total_price from its milestones.';


-- #################################################
-- ###     TABLE DES MESSAGES ("Memo Magique")     ###
-- #################################################
CREATE TABLE public.project_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  project_id INTEGER NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  is_formalized BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.project_chat_messages IS 'Stores the informal chat history for a project.';

-- #################################################
-- ###           TABLE DES LIVRABLES             ###
-- #################################################
CREATE TABLE public.deliverables (
  id SERIAL PRIMARY KEY,
  milestone_id INTEGER NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  uploader_id UUID NOT NULL REFERENCES public.profiles(id),
  file_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.deliverables IS 'Files and other proofs of work attached to a milestone.';

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX ON public.projects(client_id);
CREATE INDEX ON public.projects(manager_id);
CREATE INDEX ON public.projects(status);
CREATE INDEX ON public.milestones(project_id);
CREATE INDEX ON public.milestones(developer_id);
CREATE INDEX ON public.project_chat_messages(project_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow full access to project members" ON public.projects
  USING ( auth.uid() = client_id OR auth.uid() = manager_id );

CREATE POLICY "Allow read access to project members" ON public.milestones
  USING ( EXISTS (SELECT 1 FROM projects WHERE projects.id = milestones.project_id) );

CREATE POLICY "Allow access to project members" ON public.project_chat_messages
  USING ( EXISTS (SELECT 1 FROM projects WHERE projects.id = project_chat_messages.project_id) );

-- ============================================
-- TRIGGER NOUVEL UTILISATEUR
-- ============================================
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
