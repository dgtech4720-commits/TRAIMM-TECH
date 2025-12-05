import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Play, ArrowRight, Loader2, Home } from "lucide-react";

export default function Loading() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsVideoReady(true);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-base-100 flex flex-col">
      {/* Header */}
      <header className="navbar px-6 py-4">
        <div className="flex-1">
          <button
            onClick={() => navigate("/")}
            className="btn btn-ghost gap-3 text-xl font-bold hover:bg-base-200 rounded-box"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-md">
              <Code2 className="w-5 h-5 text-primary-content" />
            </div>
            <span className="text-base-content">
              Dev<span className="text-primary font-bold">Flow</span>
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-base-content mb-6">
              Découvrez <span className="text-primary">DevFlow</span> en action
            </h1>
            <p className="text-lg md:text-xl text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              Regardez comment notre plateforme simplifie la gestion de vos projets
              de développement de A à Z.
            </p>
          </div>

          {/* Video Container */}
          <div className="relative aspect-video rounded-3xl overflow-hidden bg-base-200 border-2 border-base-300 shadow-2xl mb-12">
            {!isVideoReady ? (
              /* Loading State */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-emerald-500/10">
                <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-8 shadow-inner">
                  <Loader2 className="w-12 h-12 text-primary animate-spin" />
                </div>
                <p className="text-xl font-semibold text-base-content mb-6">
                  Chargement de la démonstration...
                </p>
                {/* Progress Bar */}
                <div className="w-80 max-w-full">
                  <div className="flex justify-between text-sm text-base-content/70 mb-2">
                    <span>Chargement</span>
                    <span>{progress}%</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full h-3 rounded-full"
                    value={progress}
                    max="100"
                  />
                </div>
              </div>
            ) : (
              /* Video Ready State */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-emerald-500/10">
                <button className="btn btn-circle btn-primary btn-lg shadow-2xl hover:scale-110 transition-transform mb-6">
                  <Play className="w-8 h-8 text-primary-content" />
                </button>
                <p className="text-xl font-semibold text-base-content mb-2">
                  Démonstration prête
                </p>
                <p className="text-base-content/70 mb-8">
                  Cliquez pour visionner la présentation
                </p>

                {/* Video Info */}
                <div className="absolute bottom-6 left-6 right-6 bg-base-100/90 backdrop-blur-sm rounded-2xl p-4 border border-base-300">
                  <p className="text-sm text-base-content/70">
                    Durée : 2:45 • Technologies : React, Node.js, Docker
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <button
              onClick={() => navigate("/sign-up")}
              className="btn btn-primary btn-lg rounded-box gap-3 px-8 shadow-lg hover:shadow-xl transition-all"
            >
              Commencer maintenant
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="btn btn-outline btn-lg rounded-box gap-3 px-8 border-2 hover:border-primary hover:bg-primary/5"
            >
              <Home className="w-5 h-5" />
              Retour à l'accueil
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}