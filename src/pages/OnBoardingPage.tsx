import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  Rocket,
  ArrowRight,
  ArrowLeft,
  Loader,
  FileText,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { projectsService } from "../services/projects.service";
import type { ProjectType, Project } from "../types/database";
import { PROJECT_TYPES } from "../types/database";

// Types de projet avec métadonnées UI
const projectTypeOptions: Array<{
  id: ProjectType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}> = [
    {
      id: PROJECT_TYPES.ACADEMIC,
      label: "Projet Académique",
      description: "PFE, mémoire, TP, projet de fin d'études",
      icon: GraduationCap,
      color: "from-blue-500 to-indigo-500",
    },
    {
      id: PROJECT_TYPES.CLIENT,
      label: "Projet Client",
      description: "Pour une entreprise ou un tiers",
      icon: Briefcase,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: PROJECT_TYPES.PERSONAL,
      label: "Projet Personnel",
      description: "Side project, portfolio, startup",
      icon: Rocket,
      color: "from-emerald-500 to-teal-500",
    },
  ];

export default function OnBoardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Données du formulaire
  const [selectedType, setSelectedType] = useState<ProjectType | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Validation
  const titleValid = title.trim().length >= 5;
  const descriptionValid = description.trim().length >= 20;
  const step2Valid = titleValid && descriptionValid;

  // Vérifie si l'utilisateur a déjà un projet en cours d'onboarding
  useEffect(() => {
    async function checkOnboardingStatus() {
      if (!user) return;

      try {
        setIsLoading(true);

        // Vérifie si l'utilisateur a déjà complété au moins un onboarding
        const hasCompleted = await projectsService.hasCompletedOnboarding(user.id);
        if (hasCompleted) {
          navigate('/dashboard', { replace: true });
          return;
        }

        // Vérifie s'il y a un projet en cours d'onboarding
        const incompleteProject = await projectsService.getIncompleteOnboardingProject(user.id);
        if (incompleteProject) {
          setCurrentProject(incompleteProject);
          setSelectedType(incompleteProject.project_type);
          setStep(2); // Reprendre à l'étape 2
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    checkOnboardingStatus();
  }, [user, navigate]);

  // Étape 1 : Sélection du type de projet
  const handleTypeSelection = async (type: ProjectType) => {
    if (!user || isSaving) return;

    setSelectedType(type);
    setIsSaving(true);
    setError(null);

    try {
      // Crée le projet avec le type sélectionné
      const project = await projectsService.createProjectStep1(user.id, type);

      if (!project) {
        setError("Erreur lors de la création du projet. Veuillez réessayer.");
        setSelectedType(null);
        return;
      }

      setCurrentProject(project);
      setStep(2);
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setSelectedType(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Étape 2 : Compléter les détails et terminer
  const handleComplete = async () => {
    if (!currentProject || !step2Valid || isSaving) return;

    setIsSaving(true);
    setError(null);

    try {
      const updatedProject = await projectsService.completeOnboarding(
        currentProject.id,
        title.trim(),
        description.trim()
      );

      if (!updatedProject) {
        setError("Erreur lors de la sauvegarde. Veuillez réessayer.");
        return;
      }

      // Succès ! Redirection vers le dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSaving(false);
    }
  };

  // Retour à l'étape 1 (supprime le projet en cours)
  const handleBack = async () => {
    if (currentProject) {
      await projectsService.deleteProject(currentProject.id);
    }
    setCurrentProject(null);
    setSelectedType(null);
    setTitle("");
    setDescription("");
    setStep(1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? 'bg-amber-500' : 'bg-gray-700'}`} />
          <div className={`w-12 h-0.5 transition-colors ${step >= 2 ? 'bg-amber-500' : 'bg-gray-700'}`} />
          <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? 'bg-amber-500' : 'bg-gray-700'}`} />
        </div>

        <AnimatePresence mode="wait">
          {/* ÉTAPE 1 : Type de projet */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
                  <Sparkles className="w-8 h-8 text-gray-900" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Quel type de projet souhaitez-vous réaliser ?
                </h1>
                <p className="text-gray-400">
                  Cette information nous aide à mieux comprendre vos besoins.
                </p>
              </div>

              <div className="space-y-4">
                {projectTypeOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleTypeSelection(option.id)}
                    disabled={isSaving}
                    className={`w-full p-5 rounded-2xl border-2 transition-all text-left flex items-center gap-4 group
                      ${selectedType === option.id && isSaving
                        ? 'border-amber-500 bg-amber-500/10'
                        : 'border-gray-800 hover:border-amber-500/50 hover:bg-gray-900/50'
                      }
                      ${isSaving ? 'cursor-wait opacity-70' : 'cursor-pointer'}
                    `}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                      <option.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{option.label}</h3>
                      <p className="text-sm text-gray-400">{option.description}</p>
                    </div>
                    {selectedType === option.id && isSaving ? (
                      <Loader className="w-5 h-5 text-amber-500 animate-spin" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-amber-500 transition-colors" />
                    )}
                  </button>
                ))}
              </div>

              {error && (
                <p className="text-center text-red-400 text-sm">{error}</p>
              )}
            </motion.div>
          )}

          {/* ÉTAPE 2 : Détails du projet */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
                  <FileText className="w-8 h-8 text-gray-900" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-3">
                  Décrivez votre projet
                </h1>
                <p className="text-gray-400">
                  Ces informations nous permettront de vous contacter pour discuter des détails.
                </p>
              </div>

              <div className="space-y-6">
                {/* Titre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Titre du projet <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Application de gestion de stocks"
                    className={`w-full px-4 py-3 rounded-xl bg-gray-900 border-2 transition-colors text-white placeholder-gray-500 focus:outline-none
                      ${title.length > 0 && !titleValid
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-gray-800 focus:border-amber-500'
                      }
                    `}
                  />
                  {title.length > 0 && !titleValid && (
                    <p className="text-red-400 text-xs mt-1">Minimum 5 caractères</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description <span className="text-amber-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Décrivez votre projet en quelques phrases : objectif, fonctionnalités souhaitées, délais éventuels..."
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl bg-gray-900 border-2 transition-colors text-white placeholder-gray-500 focus:outline-none resize-none
                      ${description.length > 0 && !descriptionValid
                        ? 'border-red-500/50 focus:border-red-500'
                        : 'border-gray-800 focus:border-amber-500'
                      }
                    `}
                  />
                  <div className="flex justify-between mt-1">
                    {description.length > 0 && !descriptionValid && (
                      <p className="text-red-400 text-xs">Minimum 20 caractères</p>
                    )}
                    <p className="text-gray-500 text-xs ml-auto">{description.length} / 20 min</p>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-center text-red-400 text-sm">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleBack}
                  disabled={isSaving}
                  className="flex-1 py-3 px-6 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!step2Valid || isSaving}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-2
                    ${step2Valid && !isSaving
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 hover:shadow-lg hover:shadow-amber-500/30'
                      : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {isSaving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    <>
                      Accéder au dashboard
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}