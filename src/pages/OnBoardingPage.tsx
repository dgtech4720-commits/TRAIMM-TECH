import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Rocket,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { profilesService } from "../services/profiles.service";
import type { OnboardingData } from "../services/profiles.service";

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Bienvenue sur DGTech !",
    description: "Nous sommes ravis de vous accompagner dans vos projets de développement.",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Parlez-nous de vous",
    description: "Quelques informations pour personnaliser votre expérience.",
    icon: User,
  },
  {
    id: 3,
    title: "Quel est votre profil ?",
    description: "Choisissez le profil qui vous correspond le mieux.",
    icon: Briefcase,
  },
  {
    id: 4,
    title: "Prêt à démarrer !",
    description: "Tout est configuré. Commencez votre premier projet.",
    icon: Rocket,
  },
];

const userTypes = [
  {
    id: "student",
    label: "Étudiant",
    description: "Projet de fin d'études, stage, mémoire",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "startup",
    label: "Startup",
    description: "MVP, application innovante, levée de fonds",
    icon: Rocket,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "company",
    label: "Entreprise",
    description: "Application métier, transformation digitale",
    icon: Building2,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "developer",
    label: "Développeur",
    description: "Collaboration, freelance, projet personnel",
    icon: Code,
    color: "from-green-500 to-emerald-500",
  },
];

export default function OnBoardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: "",
    company: "",
    userType: "",
    projectDescription: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Dernière étape : sauvegarder les données et rediriger
      if (!user) {
        setError("Utilisateur non connecté");
        return;
      }

      setIsLoading(true);
      setError(null);

      const onboardingData: OnboardingData = {
        fullName: formData.fullName,
        company: formData.company,
        userType: formData.userType as 'student' | 'startup' | 'company' | 'developer',
      };

      const { success, error: saveError } = await profilesService.updateOnboarding(
        user.id,
        onboardingData
      );

      if (success) {
        // Redirection vers le dashboard après sauvegarde réussie
        navigate("/dashboard");
      } else {
        setError(saveError?.message || "Erreur lors de la sauvegarde");
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return true;
      case 1:
        return formData.fullName.trim() !== "";
      case 2:
        return formData.userType !== "";
      case 3:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(217,119,6,0.1)_0%,transparent_50%)]" />

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
        <motion.div
          className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors text-sm"
      >
        Passer →
      </button>

      {/* Main Content */}
      <div className="relative w-full max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            {/* Step Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                {(() => {
                  const Icon = steps[currentStep].icon;
                  return <Icon className="w-10 h-10 text-white" />;
                })()}
              </div>
            </div>

            {/* Step Content */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-400 text-lg">
                {steps[currentStep].description}
              </p>
            </div>

            {/* Step-specific Content */}
            <div className="mb-8">
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 bg-gray-800/50 rounded-xl">
                      <div className="text-3xl font-bold text-amber-500">150+</div>
                      <div className="text-sm text-gray-400 mt-1">Projets livrés</div>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-xl">
                      <div className="text-3xl font-bold text-amber-500">98%</div>
                      <div className="text-sm text-gray-400 mt-1">Satisfaction</div>
                    </div>
                    <div className="p-4 bg-gray-800/50 rounded-xl">
                      <div className="text-3xl font-bold text-amber-500">24/7</div>
                      <div className="text-sm text-gray-400 mt-1">Support</div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="John Doe"
                      className="w-full bg-gray-950/50 border border-gray-800 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Entreprise / École (optionnel)
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder="Votre entreprise ou école"
                      className="w-full bg-gray-950/50 border border-gray-800 rounded-xl py-3 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userTypes.map((type) => (
                    <motion.button
                      key={type.id}
                      onClick={() =>
                        setFormData({ ...formData, userType: type.id })
                      }
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-xl border-2 transition-all text-left ${formData.userType === type.id
                        ? "border-amber-500 bg-amber-500/10"
                        : "border-gray-800 bg-gray-800/30 hover:border-gray-700"
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center flex-shrink-0`}
                        >
                          <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">
                            {type.label}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {type.description}
                          </p>
                        </div>
                        {formData.userType === type.id && (
                          <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckCircle className="w-6 h-6 text-amber-500" />
                      <h3 className="font-semibold text-white">
                        Votre compte est prêt !
                      </h3>
                    </div>
                    <p className="text-gray-300 mb-4">
                      Vous pouvez maintenant créer votre premier projet et
                      commencer à collaborer avec notre équipe.
                    </p>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Accès au dashboard personnalisé</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Messagerie en temps réel</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span>Suivi de projet détaillé</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Précédent</span>
              </button>

              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${index === currentStep
                      ? "bg-amber-500 w-8"
                      : "bg-gray-700"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                disabled={!canProceed() || isLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sauvegarde...</span>
                  </>
                ) : (
                  <>
                    <span>{currentStep === steps.length - 1 ? "Commencer" : "Suivant"}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}