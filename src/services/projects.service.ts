import { supabase } from '../lib/supabase';
import type { Project } from '../lib/supabase';

export const projectsService = {
    // Récupérer tous les projets de l'utilisateur connecté
    async getUserProjects(userId: string): Promise<Project[]> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching projects:', error);
            return [];
        }

        return data || [];
    },

    // Créer un nouveau projet
    async createProject(
        userId: string,
        projectData: Omit<Project, 'id' | 'user_id' | 'created_at' | 'updated_at'>
    ): Promise<Project | null> {
        const { data, error } = await supabase
            .from('projects')
            .insert([
                {
                    user_id: userId,
                    ...projectData,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error creating project:', error);
            return null;
        }

        return data;
    },

    // Mettre à jour un projet
    async updateProject(
        projectId: string,
        updates: Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>
    ): Promise<Project | null> {
        const { data, error } = await supabase
            .from('projects')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', projectId)
            .select()
            .single();

        if (error) {
            console.error('Error updating project:', error);
            return null;
        }

        return data;
    },

    // Supprimer un projet
    async deleteProject(projectId: string): Promise<boolean> {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', projectId);

        if (error) {
            console.error('Error deleting project:', error);
            return false;
        }

        return true;
    },

    // Récupérer un projet spécifique
    async getProject(projectId: string): Promise<Project | null> {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (error) {
            console.error('Error fetching project:', error);
            return null;
        }

        return data;
    },
};
