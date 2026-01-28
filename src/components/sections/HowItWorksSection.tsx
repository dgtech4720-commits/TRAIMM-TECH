import { motion } from "framer-motion";
import { FileText, MessageSquare, Code, Rocket, ArrowRight, Bot, Sparkles, BrainCircuit, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const steps = [
  {
    number: "01",
    title: "Briefing & Analyse",
    description: "Définition précise de vos besoins et objectifs techniques.",
    rotation: -2,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: FileText
  },
  {
    number: "02",
    title: "Stratégie & Devis",
    description: "Proposition détaillée et planning de réalisation optimisé.",
    rotation: 2,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    icon: MessageSquare
  },
  {
    number: "03",
    title: "Développement",
    description: "Cycles itératifs avec points d'étape réguliers.",
    rotation: -1,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    icon: Code
  },
  {
    number: "04",
    title: "Livraison & Suivi",
    description: "Déploiement, formation et maintenance garantie.",
    rotation: 3,
    color: "text-amber-600",
    bg: "bg-amber-600/10",
    border: "border-amber-600/20",
    icon: Rocket
  },
];

export function HowItWorksSection() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartProject = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/sign-up");
    }
  };
  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden bg-gray-950">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(245,158,11,0.05)_1px,transparent_0)] [background-size:40px_40px]" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <span className="text-amber-500 font-semibold text-sm uppercase tracking-wider">
              Processus Simplifié
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Comment nous <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">travaillons</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Un workflow optimisé pour transformer vos idées en réalité digitale.
          </p>
        </div>

        {/* Pinned Cards Layout */}
        <div className="relative max-w-6xl mx-auto mb-32">
          {/* Dashed Line (Visible on Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full -translate-y-1/2 z-0">
            <svg className="w-full h-20" viewBox="0 0 1200 80" fill="none" preserveAspectRatio="none">
              <path d="M0,40 C200,40 200,0 400,40 C600,80 600,40 800,40 C1000,40 1000,0 1200,40" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="8 8" />
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="100%" y2="0">
                  <stop offset="0%" stopColor="rgba(245, 158, 11, 0.1)" />
                  <stop offset="50%" stopColor="rgba(245, 158, 11, 0.5)" />
                  <stop offset="100%" stopColor="rgba(245, 158, 11, 0.1)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, rotate: 0 }}
                whileInView={{ opacity: 1, y: 0, rotate: step.rotation }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6, type: "spring" }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                className="relative"
              >
                {/* Pin */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-4 h-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-400 shadow-lg shadow-black/50 border border-gray-300">
                  <div className="absolute inset-0 rounded-full bg-amber-500/30 blur-[1px]" />
                </div>

                {/* Card */}
                <div className={`bg-gray-900 p-6 rounded-2xl border ${step.border} shadow-xl backdrop-blur-sm h-full flex flex-col items-center text-center group hover:shadow-amber-500/10 transition-all duration-300`}>
                  <div className={`w-12 h-12 rounded-xl ${step.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <step.icon className={`w-6 h-6 ${step.color}`} />
                  </div>

                  <div className={`text-2xl font-bold ${step.color} mb-2`}>{step.number}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Module Feature - Amber Theme */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 lg:p-12 shadow-2xl border border-gray-800 max-w-7xl mx-auto"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25px 25px, #f59e0b 2px, transparent 0)`,
              backgroundSize: '50px 50px',
            }} />
          </div>

          {/* Animated Gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 mb-8 backdrop-blur-sm">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-amber-300">IA ÉTUDIANT • NOUVEAU</span>
              </div>

              {/* Title */}
              <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
                Accélérez vos projets avec notre{" "}
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                    module IA
                  </span>
                  <span className="absolute -bottom-2 left-0 right-0 h-4 bg-gradient-to-r from-amber-500/30 to-orange-500/30 blur-lg" />
                </span>
              </h3>

              {/* Description */}
              <p className="text-gray-300 text-lg mb-10 leading-relaxed">
                Notre intelligence artificielle spécialisée génère automatiquement la structure, le contenu technique et les diagrammes pour vos rapports de stage, mémoires et projets académiques.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: Sparkles, label: "Plan détaillé généré" },
                  { icon: BrainCircuit, label: "Rédaction assistée" },
                  { icon: FileText, label: "Correction automatique" },
                  { icon: Code, label: "Code documenté" },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-amber-500/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-200">{feature.label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={handleStartProject}
                className="group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold transition-all duration-300 flex items-center gap-3 shadow-lg shadow-amber-500/25"
              >
                <span>Essayer gratuitement</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300" />
              </button>
            </div>

            {/* AI Interface Card */}
            <div className="relative">
              {/* Floating Card 1 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl border border-amber-500/30 backdrop-blur-sm"
              />

              {/* Floating Card 2 */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-2xl border border-orange-500/30 backdrop-blur-sm"
              />

              {/* Main Card */}
              <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 shadow-2xl overflow-hidden">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">Assistant Rédaction IA</div>
                      <div className="text-sm text-gray-400">En cours de génération...</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Génération du rapport</span>
                    <span>65%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "65%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    />
                  </div>
                </div>

                {/* Content Preview */}
                <div className="space-y-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded w-full animate-pulse delay-100" />
                  <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse delay-200" />

                  {/* Code Block */}
                  <div className="mt-6 p-4 bg-gray-900/50 rounded-xl border border-gray-600/50">
                    <div className="font-mono text-sm">
                      <div className="text-amber-400">{`// Génération automatique`}</div>
                      <div className="text-gray-400">{`function generateReport() {`}</div>
                      <div className="text-orange-400 ml-4">{`  return analyse + structure + code;`}</div>
                      <div className="text-gray-400">{`}`}</div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>Création des diagrammes UML...</span>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Prêt à concrétiser votre projet ?
          </h3>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Notre processus éprouvé garantit un développement fluide et des résultats exceptionnels.
          </p>
          <button
            onClick={handleStartProject}
            className="group px-10 py-5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-full font-bold text-lg transition-all duration-300 flex items-center gap-3 mx-auto shadow-xl shadow-amber-500/25"
          >
            <span>Démarrer mon projet</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}