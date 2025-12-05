import { supabase } from '../lib/supabase';

export interface OnboardingData {
    fullName: string;
    company: string;
    userType: 'student' | 'startup' | 'company' | 'developer';
}

export const profilesService = {
    // Mettre à jour le profil avec les données d'onboarding
    async updateOnboarding(userId: string, data: OnboardingData) {
        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: data.fullName,
                company: data.company,
                user_type: data.userType,
                onboarding_completed: true,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        if (error) {
            console.error('Error updating onboarding:', error);
            return { success: false, error };
        }

        return { success: true, error: null };
    },

    // Récupérer le profil d'un utilisateur
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return { data: null, error };
        }

        return { data, error: null };
    },

    // Mettre à jour le profil (général)
    async updateProfile(userId: string, updates: Partial<{
        full_name: string;
        company: string;
        avatar_url: string;
        user_type: string;
    }>) {
        const { error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId);

        if (error) {
            console.error('Error updating profile:', error);
            return { success: false, error };
        }

        return { success: true, error: null };
    },
};
