// src/types/database.ts

// On utilise des objets constants pour définir des ensembles de chaînes de caractères.
// C'est une alternative moderne et flexible aux 'enum' en TypeScript.
export const ROLES = {
  CLIENT: 'client',
  MANAGER: 'manager',
  DEVELOPER: 'developer',
} as const;

export const PROJECT_STATUSES = {
  DRAFT: 'BROUILLON',
  SUBMITTED: 'SOUMIS',
  QUOTING: 'CHIFFRAGE',
  NEGOTIATING: 'EN_NEGOCIATION',
  PENDING_PAYMENT: 'EN_ATTENTE_PAIEMENT',
  ACTIVE: 'ACTIF',
  PAUSED: 'EN_PAUSE',
  COMPLETED: 'TERMINÉ',
  WARRANTY: 'EN_GARANTIE',
  CANCELLED: 'ANNULÉ',
} as const;

export const MILESTONE_STATUSES = {
  TODO: 'A_FAIRE',
  IN_PROGRESS: 'EN_COURS',
  BLOCKED: 'BLOQUE',
  IN_REVIEW: 'EN_REVUE',
  IN_REWORK: 'EN_CORRECTION',
  VALIDATED: 'VALIDÉ',
} as const;

export const DEPOSIT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed',
} as const;

// On dérive les types à partir des clés des objets constants.
// ex: Role sera 'client' | 'manager' | 'developer'
export type Role = typeof ROLES[keyof typeof ROLES];
export type ProjectStatus = typeof PROJECT_STATUSES[keyof typeof PROJECT_STATUSES];
export type MilestoneStatus = typeof MILESTONE_STATUSES[keyof typeof MILESTONE_STATUSES];
export type DepositType = typeof DEPOSIT_TYPES[keyof typeof DEPOSIT_TYPES];


// Interfaces correspondant à notre schéma de base de données V3

export interface Profile {
  id: string; // UUID
  role: Role;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string; // TIMESTAMPTZ
}

export interface Project {
  id: number; // SERIAL
  client_id: string; // UUID
  manager_id: string | null; // UUID
  title: string;
  description: string | null;
  status: ProjectStatus;
  // total_price a été retiré car c'est maintenant une vue
  deposit_type: DepositType | null;
  deposit_value: number | null;
  deposit_paid: boolean;
  final_balance_paid: boolean;
  payment_method_used: string | null;
  created_at: string; // TIMESTAMPTZ
  submitted_at: string | null; // TIMESTAMPTZ
  started_at: string | null; // TIMESTAMPTZ
  completed_at: string | null; // TIMESTAMPTZ
}

// Nouvelle interface pour la vue 'projects_with_totals'
export interface ProjectWithTotals extends Project {
  total_price: number; // NUMERIC, ajoutée par la vue
}

export interface Milestone {
  id: number; // SERIAL
  project_id: number;
  developer_id: string | null; // UUID
  title: string;
  description: string | null;
  status: MilestoneStatus;
  price: number; // NUMERIC
  due_date: string | null; // DATE
}

export interface ProjectChatMessage {
  id: number; // BIGSERIAL
  project_id: number;
  sender_id: string; // UUID
  content: string;
  is_formalized: boolean;
  created_at: string; // TIMESTAMPTZ
}

export interface Deliverable {
  id: number; // SERIAL
  milestone_id: number;
  uploader_id: string; // UUID
  file_url: string;
  description: string | null;
  created_at: string; // TIMESTAMPTZ
}
