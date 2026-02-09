// src/types/database.ts

// Constantes pour les rôles, statuts, types de projet
export const ROLES = {
  CLIENT: 'client',
  MANAGER: 'manager',
  DEVELOPER: 'developer',
} as const;

export const PROJECT_TYPES = {
  ACADEMIC: 'ACADEMIC',
  CLIENT: 'CLIENT',
  PERSONAL: 'PERSONAL',
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

// Types dérivés
export type Role = typeof ROLES[keyof typeof ROLES];
export type ProjectType = typeof PROJECT_TYPES[keyof typeof PROJECT_TYPES];
export type ProjectStatus = typeof PROJECT_STATUSES[keyof typeof PROJECT_STATUSES];
export type MilestoneStatus = typeof MILESTONE_STATUSES[keyof typeof MILESTONE_STATUSES];
export type DepositType = typeof DEPOSIT_TYPES[keyof typeof DEPOSIT_TYPES];


// Interfaces correspondant au schéma V3.2

export interface Profile {
  id: string;
  role: Role;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Project {
  id: number;
  client_id: string;
  manager_id: string | null;
  title: string;
  description: string | null;
  project_type: ProjectType;
  onboarding_completed: boolean;
  status: ProjectStatus;
  deposit_type: DepositType | null;
  deposit_value: number | null;
  deposit_paid: boolean;
  final_balance_paid: boolean;
  payment_method_used: string | null;
  created_at: string;
  submitted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface ProjectWithTotals extends Project {
  total_price: number;
}

export interface Milestone {
  id: number;
  project_id: number;
  developer_id: string | null;
  title: string;
  description: string | null;
  status: MilestoneStatus;
  price: number;
  due_date: string | null;
}

export interface ProjectChatMessage {
  id: number;
  project_id: number;
  sender_id: string;
  content: string;
  is_formalized: boolean;
  created_at: string;
}

export interface Deliverable {
  id: number;
  milestone_id: number;
  uploader_id: string;
  file_url: string;
  description: string | null;
  created_at: string;
}

// Type pour la création de projet (onboarding step 1)
export interface CreateProjectStep1 {
  client_id: string;
  project_type: ProjectType;
}

// Type pour la mise à jour du projet (onboarding step 2)
export interface UpdateProjectStep2 {
  title: string;
  description: string;
  onboarding_completed: true;
}
