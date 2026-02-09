import { createClient } from '@supabase/supabase-js';
import type {
  Profile,
  Project,
  ProjectWithTotals,
  Milestone,
  ProjectChatMessage,
  Deliverable,
} from '../types/database';

// Types pour les opérations d'insertion
type ProjectInsert = {
  client_id: string;
  title: string;
  project_type: 'ACADEMIC' | 'CLIENT' | 'PERSONAL';
  description?: string;
  manager_id?: string;
  onboarding_completed?: boolean;
  status?: string;
  deposit_type?: 'percentage' | 'fixed';
  deposit_value?: number;
  deposit_paid?: boolean;
  final_balance_paid?: boolean;
  payment_method_used?: string;
};

type ProjectUpdate = Partial<Omit<Project, 'id' | 'created_at'>>;

// Interface Database pour le typage Supabase
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Profile>;
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
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
      projects_with_totals: {
        Row: ProjectWithTotals;
      };
    };
    Functions: Record<string, never>;
  };
}

// Variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Client Supabase typé
export const supabase = createClient<any>(supabaseUrl, supabaseAnonKey);
