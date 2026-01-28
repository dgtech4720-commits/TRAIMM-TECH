import { supabase } from '../lib/supabase';
import type { Project, ProjectStatus, ProjectWithTotals } from '../types/database';

// Définir les colonnes à récupérer de la VUE projects_with_totals
const PROJECTS_WITH_TOTALS_SELECT_QUERY = `
  id,
  client_id,
  manager_id,
  title,
  description,
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
 * Récupère un projet par son ID, incluant le total des prix des jalons.
 * Interroge la vue `projects_with_totals`.
 * @param projectId L'ID du projet.
 * @returns Le projet avec le total ou null si non trouvé.
 */
async function getProjectById(projectId: number): Promise<ProjectWithTotals | null> {
  const { data, error } = await supabase
    .from('projects_with_totals') // Changement ici: interroge la vue
    .select(PROJECTS_WITH_TOTALS_SELECT_QUERY)
    .eq('id', projectId)
    .single();

  if (error) {
    console.error(`Error fetching project with id ${projectId}:`, error.message);
    return null;
  }
  return data;
}

/**
 * Récupère tous les projets pour un client spécifique, incluant le total des prix des jalons.
 * Interroge la vue `projects_with_totals`.
 * @param clientId L'ID du client (depuis profiles.id).
 * @returns Une liste de projets avec les totaux.
 */
async function getProjectsForClient(clientId: string): Promise<ProjectWithTotals[]> {
  const { data, error } = await supabase
    .from('projects_with_totals') // Changement ici: interroge la vue
    .select(PROJECTS_WITH_TOTALS_SELECT_QUERY)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error(`Error fetching projects for client ${clientId}:`, error.message);
    return [];
  }
  return data || [];
}

/**
 * Crée un nouveau projet. Le statut initial est 'BROUILLON'.
 * Opère sur la table `projects`.
 * @param projectData Les données nécessaires pour créer le projet.
 * @returns Le projet nouvellement créé.
 */
async function createProject(
  projectData: { client_id: string; title: string; description?: string }
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects') // Opère sur la table
    .insert({
      ...projectData,
      status: 'BROUILLON',
    })
    .select('*') // Sélectionne les colonnes par défaut de la table Project
    .single();

  if (error) {
    console.error('Error creating project:', error.message);
    return null;
  }
  return data;
}

/**
 * Met à jour des champs spécifiques d'un projet.
 * Opère sur la table `projects`.
 * @param projectId L'ID du projet à mettre à jour.
 * @param updates Un objet contenant les champs à mettre à jour.
 * @returns Le projet mis à jour.
 */
async function updateProject(
  projectId: number,
  updates: Partial<Omit<Project, 'id'>>
): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects') // Opère sur la table
    .update(updates)
    .eq('id', projectId)
    .select('*') // Sélectionne les colonnes par défaut de la table Project
    .single();

  if (error) {
    console.error(`Error updating project ${projectId}:`, error.message);
    return null;
  }
  return data;
}

/**
 * Met à jour spécifiquement le statut d'un projet.
 * @param projectId L'ID du projet.
 * @param status Le nouveau statut du projet.
 * @returns Le projet mis à jour.
 */
async function updateProjectStatus(
  projectId: number,
  status: ProjectStatus
): Promise<Project | null> {
  return updateProject(projectId, { status });
}

/**
 * Supprime un projet.
 * @param projectId L'ID du projet à supprimer.
 * @returns true si la suppression a réussi, sinon false.
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

// On exporte un objet unifié qui constitue notre service de projets.
export const projectsService = {
  getProjectById,
  getProjectsForClient,
  createProject,
  updateProject,
  updateProjectStatus,
  deleteProject,
};