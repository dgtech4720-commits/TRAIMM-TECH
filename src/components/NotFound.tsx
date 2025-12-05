import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 p-4">
      <div className="text-center max-w-md">
        <div className="text-9xl font-bold text-primary mb-4">404</div>
        <h1 className="text-3xl font-bold text-base-content mb-2">Page non trouvée</h1>
        <p className="text-base-content/70 mb-8">
          La page que vous recherchez semble avoir été déplacée ou n'existe pas.
        </p>
        <a 
          href="/" 
          className="btn btn-primary btn-lg rounded-xl gap-2 shadow-lg hover:shadow-xl transition-all"
        >
          <Home className="w-5 h-5" />
          Retour à l'accueil
        </a>
        <div className="mt-8 p-4 bg-base-200 rounded-2xl">
          <p className="text-sm text-base-content/50">
            URL essayée : <code className="bg-base-300 px-2 py-1 rounded">{location.pathname}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;