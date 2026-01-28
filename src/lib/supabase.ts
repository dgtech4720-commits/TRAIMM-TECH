import { createClient } from '@supabase/supabase-js';
import type {
  Profile,
  Project,
  ProjectWithTotals, // Nouvelle importation
  Milestone,
  ProjectChatMessage,
  Deliverable,
} from '../types/database';

// 1. Définir une interface pour la structure complète de la base de données.
//    Ceci est la clé pour obtenir la sécurité de type et l'autocomplétion.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile; // Type pour une ligne de la table 'profiles'
        Insert: Omit<Profile, 'id' | 'created_at'>; // Type pour une nouvelle ligne
        Update: Partial<Profile>; // Type pour une mise à jour
      };
      projects: {
        Row: Project; // La table 'projects' n'a plus 'total_price'
        Insert: Omit<Project, 'id' | 'created_at'>; // total_price n'est plus dans Insert car il n'existe plus
        Update: Partial<Project>;
      };
      milestones: {
        Row: Milestone;
        Insert: Omit<Milestone, 'id'>;
        Update: Partial<Milestone>;
      };
      project_chat_messages: {
        Row: ProjectChatMessage;
        Insert: Omit<ProjectChatMessage, 'id' | 'created_at'>;
        Update: Partial<ProjectChatMessage>;
      };
      deliverables: {
        Row: Deliverable;
        Insert: Omit<Deliverable, 'id' | 'created_at'>;
        Update: Partial<Deliverable>;
      };
    };
    Views: {
      // Ajout de la nouvelle vue
      projects_with_totals: {
        Row: ProjectWithTotals; // La vue aura le champ total_price
      };
    };
    Functions: {
      // On peut ajouter des fonctions SQL ici si nécessaire
    };
  };
}


// 2. Récupérer les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// 3. Créer le client Supabase en le "typant" avec notre interface `Database`.
//    C'est ici que la magie opère.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

