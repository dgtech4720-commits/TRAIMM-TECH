import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Users, Star, Zap, Code } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

// Composants utilitaires
const MoreHorizontal = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
  </svg>
);

const Heart = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const MessageCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const Share2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

// Composant pour les avatars
const Avatar = ({ src, alt }: { src: string; alt: string }) => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white text-xs font-bold">
    {alt.charAt(0)}
  </div>
);

// Composant pour les posts
const SocialPost = ({ username, time, content, likes, comments }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white dark:bg-gray-700 rounded-xl p-4 shadow-sm"
  >
    <div className="flex items-center gap-3 mb-3">
      <Avatar src="" alt={username} />
      <div className="flex-1">
        <div className="font-semibold text-sm text-gray-900 dark:text-white">{username}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{time}</div>
      </div>
      <MoreHorizontal className="w-4 h-4 text-gray-400" />
    </div>
    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{content}</p>
    <div className="flex items-center gap-4 text-xs text-gray-500">
      <div className="flex items-center gap-1">
        <Heart className="w-3 h-3" />
        <span>{likes} likes</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageCircle className="w-3 h-3" />
        <span>{comments} commentaires</span>
      </div>
      <Share2 className="w-3 h-3" />
    </div>
  </motion.div>
);

// Composant Skeleton pour le chargement
const Skeleton = () => (
  <div className="animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600" />
      <div className="flex-1 space-y-1">
        <div className="h-2 w-20 bg-gray-200 dark:bg-gray-600 rounded" />
        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-600 rounded" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded" />
      <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded" />
      <div className="h-2 w-3/4 bg-gray-200 dark:bg-gray-600 rounded" />
    </div>
  </div>
);

const AnimatedPost = ({ post }: { post: any }) => (
  <motion.div
    key={post.username}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.5 }}
  >
    <SocialPost {...post} />
  </motion.div>
);

// Mots-clés stratégiques pour le SEO
const seoKeywords = {
  primary: "développement d'applications web mobile desktop",
  secondary: ["étudiants informatique", "startup", "freelance", "entreprise", "création application"],
  technologies: ["React", "Node.js", "React Native", "Flutter", "Python", "Java", "TypeScript"]
};

export function HeroSection() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentPost, setCurrentPost] = useState(0);

  const handleStartProject = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/sign-up");
    }
  };

  const posts = [
    {
      username: "Étudiant Informatique",
      time: "Il y a 2h",
      content: "Mon projet de fin d'études en développement d'application mobile réalisé avec DGTech est un succès !",
      likes: "156",
      comments: "28"
    },
    {
      username: "Startup Tech",
      time: "Il y a 4h",
      content: "Notre application web développée avec React et Node.js a attiré 10k utilisateurs en 1 mois.",
      likes: "243",
      comments: "42"
    },
    {
      username: "Freelance Développeur",
      time: "Il y a 6h",
      content: "Collabore avec DGTech sur des projets React Native. L'équipe est incroyablement compétente.",
      likes: "189",
      comments: "31"
    }
  ];

  useEffect(() => {
    const postInterval = setInterval(() => {
      setCurrentPost((prev) => (prev + 1) % posts.length);
    }, 4000);

    return () => {
      clearInterval(postInterval);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" itemScope itemType="https://schema.org/WebSite">

      {/* Schema.org markup pour le SEO */}
      <meta itemProp="name" content="DGTech - Développement d'Applications Web Mobile Desktop" />
      <meta itemProp="description" content="Agence de développement d'applications web, mobile et desktop pour étudiants en informatique, startups et entreprises. Création d'applications React, React Native, Node.js, Python." />
      <meta itemProp="keywords" content={seoKeywords.primary + ', ' + seoKeywords.secondary.join(', ')} />
      <link itemProp="url" href="https://dgtech.com" />

      {/* Background adaptatif */}
      <div className="absolute inset-0">
        {/* Gradient de base */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-white to-yellow-50/30 dark:from-amber-950/20 dark:via-gray-900 dark:to-yellow-950/10" />

        {/* Éléments décoratifs subtils avec motifs code */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Cercles de fond amber */}
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl dark:bg-amber-900/20" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-yellow-200/30 rounded-full blur-3xl dark:bg-yellow-900/20" />

          {/* Motifs de code en fond */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] font-mono">
            <div className="absolute top-10 left-10 text-xs text-amber-400/30">{`< div className = "app" > `}</div>
            <div className="absolute top-20 left-20 text-xs text-amber-400/30">{`function createApp() {
  `}</div>
            <div className="absolute top-32 left-32 text-xs text-amber-400/30">{`return <App />; `}</div>
            <div className="absolute bottom-20 right-20 text-xs text-amber-400/30">{`export default App; `}</div>
          </div>

          {/* Points décoratifs */}
          <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-amber-400 rounded-full animate-pulse dark:bg-amber-500" />
          <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse dark:bg-yellow-500" style={{ animationDelay: '0.5s' }} />
        </div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Colonne gauche : Contenu principal optimisé SEO */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
              itemScope
              itemType="https://schema.org/Service"
            >
              <meta itemProp="serviceType" content="Développement d'Applications" />
              <meta itemProp="provider" content="DGTech" />

              {/* Titre principal avec mots-clés */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
                itemProp="name"
              >
                Développement d'
                <span className="block mt-2">
                  <span className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-400 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-300 bg-clip-text text-transparent">
                    Applications Web Mobile Desktop
                  </span>
                </span>
              </motion.h1>

              {/* Description riche en mots-clés */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
                itemProp="description"
              >
                <span className="text-amber-600 dark:text-amber-400 font-semibold">DGTech</span> spécialiste en
                <span className="font-medium"> développement d'applications web, mobile et desktop </span>
                pour <span className="text-amber-600 dark:text-amber-400">étudiants en informatique</span>, startups et entreprises.
                Technologies modernes : <span className="font-mono text-sm bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded">{seoKeywords.technologies.join(', ')}</span>
              </motion.p>

              {/* Statistiques clés */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="grid grid-cols-3 gap-6"
              >
                {[
                  { icon: Code, value: "150+", label: "Projets livrés" },
                  { icon: Users, value: "98%", label: "Satisfaction" },
                  { icon: Zap, value: "24/7", label: "Support" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </motion.div>

              {/* CTA Buttons avec tracking potentiel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <button
                  onClick={handleStartProject}
                  className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
                  aria-label="Démarrer votre projet de développement"
                >
                  <span>Démarrer mon projet</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300" />
                </button>

                <button
                  onClick={() => {
                    const servicesSection = document.getElementById('services');
                    servicesSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors duration-300 flex items-center justify-center gap-3"
                  aria-label="Découvrir nos services de développement"
                >
                  <Code className="w-5 h-5" />
                  <span>Découvrir nos services</span>
                </button>
              </motion.div>
            </motion.div>

            {/* Colonne droite : iPhone démo app mobile avec microdata */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex justify-center items-center"
              itemScope
              itemType="https://schema.org/MobileApplication"
            >
              <meta itemProp="name" content="DGTech Démo App - Développement Mobile" />
              <meta itemProp="applicationCategory" content="BusinessApplication" />

              {/* Conteneur iPhone */}
              <div className="relative w-[280px] sm:w-[320px]">

                {/* iPhone - Cadre extérieur */}
                <div className="relative bg-gray-900 rounded-[40px] p-3 shadow-2xl">

                  {/* Écran iPhone */}
                  <div className="bg-white dark:bg-gray-800 rounded-[32px] overflow-hidden">

                    {/* Barre de statut iPhone */}
                    <div className="h-6 bg-gray-900 flex items-center justify-between px-4">
                      <div className="text-white text-[10px] font-bold">9:41</div>
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-1 bg-white rounded-sm" />
                        <div className="w-4 h-1 bg-white rounded-sm" />
                        <div className="w-6 h-4 bg-white rounded-sm flex items-center justify-center">
                          <div className="w-4 h-1 bg-gray-900 rounded-sm" />
                        </div>
                      </div>
                    </div>

                    {/* Header de l'app - DGTech App */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                          <span className="text-amber-600 dark:text-amber-400">DG</span>App
                        </h1>
                        <div className="flex items-center gap-2">
                          <Search className="w-4 h-4 text-gray-500" />
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500" />
                        </div>
                      </div>

                      {/* Navigation avec termes tech */}
                      <div className="flex items-center justify-around mt-4">
                        <div className="text-center">
                          <Code className="w-5 h-5 text-amber-500 mx-auto" />
                          <span className="text-xs text-amber-600 dark:text-amber-400 mt-1">Dev</span>
                        </div>
                        <div className="text-center relative">
                          <Users className="w-5 h-5 text-gray-400 mx-auto" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Projets</span>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        </div>
                        <div className="text-center relative">
                          <Star className="w-5 h-5 text-gray-400 mx-auto" />
                          <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">Success</span>
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                        </div>
                      </div>
                    </div>

                    {/* Contenu du feed - communauté dev */}
                    <div className="h-[380px] overflow-y-auto p-4">

                      {/* Section projets étudiants */}
                      <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">Projets Étudiants en Cours</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          <span className="font-mono bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">5 projets React</span>
                          <span className="mx-2">•</span>
                          <span className="font-mono bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">3 apps mobile</span>
                        </div>
                      </div>

                      {/* Post en cours */}
                      <div className="mb-4">
                        <AnimatedPost post={posts[currentPost]} />
                      </div>

                      {/* Mini tutoriel code */}
                      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Code className="w-4 h-4 text-gray-500" />
                          <span className="text-xs font-mono text-gray-700 dark:text-gray-300">// Code du jour</span>
                        </div>
                        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                          {`const App = () => (
    <DGTechProvider>
      <YourSuccess />
    </DGTechProvider>
  ); `}
                        </pre>
                      </div>

                      {/* Posts précédents */}
                      <div className="space-y-4">
                        <div className="opacity-60">
                          <Skeleton />
                        </div>
                        <div className="opacity-40">
                          <Skeleton />
                        </div>
                      </div>

                      {/* Indicateur de chargement */}
                      <div className="flex justify-center items-center gap-2 mt-4">
                        {posts.map((_, index) => (
                          <div
                            key={index}
                            className={`w - 1.5 h - 1.5 rounded - full transition - all duration - 300 ${index === currentPost
                              ? 'bg-amber-500 w-4'
                              : 'bg-gray-300 dark:bg-gray-600'
                              } `}
                          />
                        ))}
                      </div>

                    </div>

                    {/* Barre de navigation basse avec CTA */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                      <div className="flex items-center justify-between">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <PlusIcon />
                        </div>
                        <div className="text-xs text-center">
                          <div className="font-semibold text-amber-500">Développez avec nous</div>
                          <div className="text-gray-500 dark:text-gray-400">Projets étudiants & professionnels</div>
                        </div>
                        <div
                          className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
                          onClick={handleStartProject}
                        >
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Boutons iPhone */}
                  <div className="absolute top-24 -right-1 w-1 h-16 bg-gray-800 rounded-l-sm" />
                  <div className="absolute top-40 -right-1 w-1 h-8 bg-gray-800 rounded-l-sm" />
                  <div className="absolute top-56 -right-1 w-1 h-8 bg-gray-800 rounded-l-sm" />
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-800 rounded-full" />

                </div>

                {/* Légende SEO-friendly */}
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-amber-600">Démo d'application mobile</span> développée avec
                    <span className="font-mono mx-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded">React Native</span>
                    par DGTech
                  </p>
                </div>

                {/* Réflexion/ombre */}
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-64 h-4 bg-gradient-to-t from-black/20 to-transparent rounded-full blur-sm" />

                {/* Effet de lueur */}
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400/10 to-yellow-400/10 rounded-[50px] blur-xl" />

              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}