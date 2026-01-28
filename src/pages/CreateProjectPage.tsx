import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { projectsService } from '../services/projects.service';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Récupère l'utilisateur authentifié
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
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
      // client_id est l'ID de l'utilisateur connecté
      const newProject = await projectsService.createProject({
        client_id: user.id,
        title,
        description: description || null, // Supabase gère mieux les chaînes vides comme null
      });

      if (newProject) {
        // Rediriger vers le tableau de bord après succès
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
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 border border-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-base-content mb-4">
            <Plus className="w-6 h-6 mr-2 text-primary" />
            Créer un nouveau projet
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Titre du projet</span>
              </label>
              <input
                type="text"
                placeholder="Ex: Refonte du site vitrine"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description (optionnel)</span>
              </label>
              <textarea
                placeholder="Décrivez votre besoin en quelques mots..."
                className="textarea textarea-bordered h-24 w-full"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {error && (
              <div role="alert" className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <div className="card-actions justify-end">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => navigate('/dashboard')}
                disabled={isLoading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <Plus className="w-5 h-5" />
                )}
                {isLoading ? "Création..." : "Créer le projet"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
