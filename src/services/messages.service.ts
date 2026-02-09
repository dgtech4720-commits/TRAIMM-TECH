import { supabase } from '../lib/supabase';
import type { ProjectChatMessage } from '../types/database';

export interface MessageWithDetails extends ProjectChatMessage {
    sender?: {
        full_name: string | null;
        avatar_url: string | null;
        email?: string;
    };
    project?: {
        title: string;
    };
}

/**
 * Récupère les derniers messages pour les projets d'un client.
 */
async function getRecentMessages(clientId: string, limit: number = 5): Promise<MessageWithDetails[]> {
    const { data, error } = await supabase
        .from('project_chat_messages')
        .select(`
      *,
      sender:profiles(full_name, avatar_url),
      project:projects!inner(title, client_id)
    `)
        .eq('project.client_id', clientId)
        .neq('sender_id', clientId) // Messages reçus uniquement (venant d'autres)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching recent messages:', error.message);
        return [];
    }

    return (data as any[]) || [];
}

/**
 * Récupère le nombre de messages non lus (Simulé pour l'instant car pas de champ read_at)
 * On va simuler en comptant les messages reçus dans les dernières 24h.
 */
async function getUnreadMessagesCount(clientId: string): Promise<number> {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { count, error } = await supabase
        .from('project_chat_messages')
        .select('id, projects!inner(client_id)', { count: 'exact', head: true })
        .eq('projects.client_id', clientId)
        .neq('sender_id', clientId)
        .gte('created_at', yesterday.toISOString());

    if (error) {
        console.error('Error fetching unread messages count:', error.message);
        return 0;
    }

    return count || 0;
}

export const messagesService = {
    getRecentMessages,
    getUnreadMessagesCount,
};
