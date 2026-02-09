import { supabase } from '../lib/supabase';
import type { Deliverable } from '../types/database';

export interface DeliverableWithDetails extends Deliverable {
    milestone?: {
        title: string;
        project?: {
            title: string;
        };
    };
}

/**
 * Récupère les derniers documents (livrables) pour les projets d'un client.
 */
async function getRecentDocuments(clientId: string, limit: number = 5): Promise<DeliverableWithDetails[]> {
    // Note: deliverables -> milestones -> projects
    const { data, error } = await supabase
        .from('deliverables')
        .select(`
      *,
      milestone:milestones!inner(
        title,
        project:projects!inner(client_id, title)
      )
    `)
        .eq('milestone.project.client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching recent documents:', error.message);
        return [];
    }

    return (data as any[]) || [];
}

/**
 * Récupère le nombre total de documents disponibles.
 */
async function getTotalDocumentsCount(clientId: string): Promise<number> {
    const { count, error } = await supabase
        .from('deliverables')
        .select('id, milestone:milestones!inner(project:projects!inner(client_id))', { count: 'exact', head: true })
        .eq('milestone.project.client_id', clientId);

    if (error) {
        console.error('Error fetching total documents count:', error.message);
        return 0;
    }

    return count || 0;
}

export const documentsService = {
    getRecentDocuments,
    getTotalDocumentsCount,
};
