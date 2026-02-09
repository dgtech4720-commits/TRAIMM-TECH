import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { projectsService } from '../services/projects.service';
import type { ReactNode } from 'react';
import { Loader } from 'lucide-react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiresOnboarding?: boolean; // Si true, redirige vers onboarding si pas de projet
}

export function ProtectedRoute({ children, requiresOnboarding = true }: ProtectedRouteProps) {
    const { user, loading: authLoading } = useAuth();
    const location = useLocation();
    const [checkingOnboarding, setCheckingOnboarding] = useState(true);
    const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkOnboarding() {
            if (!user || !requiresOnboarding) {
                setCheckingOnboarding(false);
                return;
            }

            try {
                const completed = await projectsService.hasCompletedOnboarding(user.id);
                setHasCompletedOnboarding(completed);
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                setHasCompletedOnboarding(false);
            } finally {
                setCheckingOnboarding(false);
            }
        }

        if (!authLoading && user) {
            checkOnboarding();
        } else if (!authLoading) {
            setCheckingOnboarding(false);
        }
    }, [user, authLoading, requiresOnboarding]);

    // Loading state
    if (authLoading || checkingOnboarding) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950">
                <div className="text-center">
                    <Loader className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Chargement...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return <Navigate to="/sign-in" replace />;
    }

    // Page d'onboarding - ne pas rediriger
    const isOnboardingPage = location.pathname.startsWith('/onboarding');
    if (isOnboardingPage) {
        // Si l'utilisateur a déjà complété l'onboarding et essaie d'y accéder, rediriger vers dashboard
        if (hasCompletedOnboarding) {
            return <Navigate to="/dashboard" replace />;
        }
        return <>{children}</>;
    }

    // Pages protégées nécessitant l'onboarding
    if (requiresOnboarding && hasCompletedOnboarding === false) {
        return <Navigate to="/onboarding" replace />;
    }

    return <>{children}</>;
}
