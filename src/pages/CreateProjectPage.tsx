import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, GraduationCap, Briefcase, Rocket, Loader } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectsService } from '../services/projects.service';
import { PROJECT_TYPES, type ProjectType } from '../types/database';

const projectTypeOptions = [
  { id: PROJECT_TYPES.ACADEMIC, label: "Académique", icon: GraduationCap },
  { id: PROJECT_TYPES.CLIENT, label: "Client", icon: Briefcase },
  { id: PROJECT_TYPES.PERSONAL, label: "Personnel", icon: Rocket },
] as const;

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState<ProjectType>(PROJECT_TYPES.PERSONAL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError("Vous devez être connecté pour créer un projet.");
      return;
    }

    if (!title.trim()) {
      setError("Le titre du projet est obligatoire.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newProject = await projectsService.createProject({
        client_id: user.id,
        title: title.trim(),
        description: description.trim() || undefined,
        project_type: projectType,
      });

      if (newProject) {
        navigate('/dashboard');
      } else {
        setError("Une erreur est survenue lors de la création du projet.");
      }
    } catch (err) {
      console.error("Erreur de création de projet:", err);
      setError("Erreur réseau ou interne lors de la création du projet.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-gray-900 rounded-2xl border border-gray-800 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center">
            <Plus className="w-5 h-5 text-gray-900" />
          </div>
          Nouveau projet
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de projet */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Type de projet
            </label>
            <div className="flex gap-2">
              {projectTypeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setProjectType(option.id)}
                  className={`flex-1 py-2 px-3 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm
                    ${projectType === option.id
                      ? 'border-amber-500 bg-amber-500/20 text-amber-400'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }
                  `}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Titre du projet <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Application de gestion de stocks"
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              placeholder="Décrivez votre projet en quelques mots..."
              className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500 resize-none h-28"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Créer le projet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
