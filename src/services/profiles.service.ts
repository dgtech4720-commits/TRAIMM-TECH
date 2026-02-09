import { supabase } from '../lib/supabase';
import type { Profile } from '../types/database';

export const profilesService = {
    /**
     * Récupérer le profil d'un utilisateur
     */
    async getProfile(userId: string): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Mettre à jour le profil d'un utilisateur
     */
    async updateProfile(
        userId: string,
        updates: {
            full_name?: string;
            avatar_url?: string;
        }
    ): Promise<Profile | null> {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select('*')
            .single();

        if (error) {
            console.error('Error updating profile:', error.message);
            return null;
        }

        return data;
    },

    /**
     * Met à jour le nom complet
     */
    async updateFullName(userId: string, fullName: string): Promise<boolean> {
        const { error } = await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', userId);

        if (error) {
            console.error('Error updating full name:', error.message);
            return false;
        }

        return true;
    },

    /**
     * Met à jour l'avatar
     */
    async updateAvatar(userId: string, avatarUrl: string): Promise<boolean> {
        const { error } = await supabase
            .from('profiles')
            .update({ avatar_url: avatarUrl })
            .eq('id', userId);

        if (error) {
            console.error('Error updating avatar:', error.message);
            return false;
        }

        return true;
    },

    /**
     * Crée un profil pour un utilisateur existant (cas de rattrapage)
     */
    async createProfile(userId: string, email: string): Promise<boolean> {
        const { error } = await supabase
            .from('profiles')
            .insert({
                id: userId,
                role: 'client',
                full_name: email.split('@')[0], // Nom par défaut
                avatar_url: null,
            } as any);

        if (error) {
            console.error('Error creating profile:', error.message);
            return false;
        }

        return true;
    },
};
