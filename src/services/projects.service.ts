import { supabase } from '../lib/supabase';
import type { Project, ProjectStatus, ProjectWithTotals, ProjectType } from '../types/database';

import { profilesService } from './profiles.service';

// Colonnes pour la vue projects_with_totals
const PROJECTS_WITH_TOTALS_SELECT = `
  id,
  client_id,
  manager_id,
  title,
  description,
  project_type,
  onboarding_completed,
  status,
  total_price,
  deposit_type,
  deposit_value,
  deposit_paid,
  final_balance_paid,
  payment_method_used,
  created_at,
  submitted_at,
  started_at,
  completed_at
`;

/**
 * Récupère un projet par son ID (via la vue avec totaux)
 */
async function getProjectById(projectId: number): Promise<ProjectWithTotals | null> {
  const { data, error } = await supabase
    .from('projects_with_totals')
    .select(PROJECTS_WITH_TOTALS_SELECT)
    .eq('id', projectId)
    .single();

  if (error) {
    console.error(`Error fetching project ${projectId}:`, error.message);
    return null;
  }
  return data;
}

/**
 * Récupère tous les projets d'un client
 */
async function getProjectsForClient(clientId: string): Promise<ProjectWithTotals[]> {
  const { data, error } = await supabase
    .from('projects_with_totals')
    .select(PROJECTS_WITH_TOTALS_SELECT)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching projects for client ${clientId}:`, error.message);
    return [];
  }
  return data || [];
}

/**
 * Vérifie si un client a un projet avec onboarding incomplet
 */
async function getIncompleteOnboardingProject(clientId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .eq('onboarding_completed', false)
    .single();

  if (error) {
    // Pas d'erreur si aucun projet trouvé
    if (error.code === 'PGRST116') return null;
    console.error('Error checking incomplete onboarding:', error.message);
    return null;
  }
  return data;
}

/**
 * Vérifie si un client a au moins un projet avec onboarding complété
 */
async function hasCompletedOnboarding(clientId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .eq('client_id', clientId)
    .eq('onboarding_completed', true)
    .limit(1);

  if (error) {
    console.error('Error checking completed onboarding:', error.message);
    return false;
  }
  return data && data.length > 0;
}

/**
 * Assure qu'un profil existe pour l'utilisateur avant de créer un projet
 */
async function ensureProfileExists(userId: string): Promise<boolean> {
  const profile = await profilesService.getProfile(userId);
  if (profile) return true;

  // Si pas de profil, on tente de le créer (récupère l'email via auth si possible, sinon placeholder)
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email || 'User';

  return await profilesService.createProfile(userId, email);
}

/**
 * Crée un nouveau projet (Onboarding Step 1)
 * Crée un projet en BROUILLON avec seulement le type
 */
async function createProjectStep1(
  clientId: string,
  projectType: ProjectType
): Promise<Project | null> {
  // Vérification/Création du profil
  const profileOk = await ensureProfileExists(clientId);
  if (!profileOk) {
    console.error('Failed to ensure profile existence');
    return null;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      client_id: clientId,
      project_type: projectType,
      title: '', // Sera rempli step 2
      status: 'BROUILLON',
      onboarding_completed: false,
    } as any)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating project step 1:', error.message);
    return null;
  }
  return data;
}

/**
 * Complète l'onboarding (Step 2)
 * Ajoute titre, description et marque l'onboarding comme terminé
 */
async function completeOnboarding(
  projectId: number,
  title: string,
  description: string
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update({
      title,
      description,
      onboarding_completed: true,
    } as any)
    .eq('id', projectId)
    .select('*')
    .single();

  if (error) {
    console.error('Error completing onboarding:', error.message);
    return null;
  }
  return data;
}

/**
 * Crée un nouveau projet complet
 */
async function createProject(
  projectData: { client_id: string; title: string; description?: string; project_type: ProjectType }
): Promise<Project | null> {
  // Vérification/Création du profil
  const profileOk = await ensureProfileExists(projectData.client_id);
  if (!profileOk) {
    console.error('Failed to ensure profile existence');
    return null;
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...projectData,
      status: 'BROUILLON',
      onboarding_completed: true,
    } as any)
    .select('*')
    .single();

  if (error) {
    console.error('Error creating project:', error.message);
    return null;
  }
  return data;
}

/**
 * Met à jour un projet
 */
async function updateProject(
  projectId: number,
  updates: Partial<Omit<Project, 'id'>>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .update(updates as any)
    .eq('id', projectId)
    .select('*')
    .single();

  if (error) {
    console.error(`Error updating project ${projectId}:`, error.message);
    return null;
  }
  return data;
}

/**
 * Met à jour le statut d'un projet
 */
async function updateProjectStatus(
  projectId: number,
  status: ProjectStatus
): Promise<Project | null> {
  return updateProject(projectId, { status });
}

/**
 * Supprime un projet
 */
async function deleteProject(projectId: number): Promise<boolean> {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId);

  if (error) {
    console.error(`Error deleting project ${projectId}:`, error.message);
    return false;
  }
  return true;
}

export const projectsService = {
  getProjectById,
  getProjectsForClient,
  getIncompleteOnboardingProject,
  hasCompletedOnboarding,
  createProjectStep1,
  completeOnboarding,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
};