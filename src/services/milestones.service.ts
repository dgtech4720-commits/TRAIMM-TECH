import { supabase } from '../lib/supabase';
import { MILESTONE_STATUSES } from '../types/database';

/**
 * Récupère le nombre de jalons validés (tâches terminées) pour un client donné.
 */
async function getCompletedMilestonesCount(clientId: string): Promise<number> {
    const { count, error } = await supabase
        .from('milestones')
        .select('id, projects!inner(client_id)', { count: 'exact', head: true })
        .eq('projects.client_id', clientId)
        .eq('status', MILESTONE_STATUSES.VALIDATED);

    if (error) {
        console.error('Error fetching completed milestones count:', error.message);
        return 0;
    }

    return count || 0;
}

export const milestonesService = {
    getCompletedMilestonesCount,
};
