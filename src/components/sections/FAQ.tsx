import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Combien coûte le développement d'une application ?",
    answer: "Le coût dépend de la complexité du projet. Nous proposons des forfaits adaptés aux étudiants (à partir de 300€) et des devis sur mesure pour les entreprises. Contactez-nous pour une estimation gratuite."
  },
  {
    question: "Quels sont les délais de livraison ?",
    answer: "Pour un projet étudiant standard (PFE), comptez 2 à 4 semaines. Pour une application d'entreprise complète, les délais varient de 1 à 3 mois selon les fonctionnalités."
  },
  {
    question: "Proposez-vous un accompagnement après la livraison ?",
    answer: "Oui, nous offrons 3 mois de maintenance gratuite sur tous nos projets. Pour les étudiants, nous incluons également une session de coaching pour préparer la soutenance."
  },
  {
    question: "Quelles technologies utilisez-vous ?",
    answer: "Nous sommes experts en React, Node.js, React Native, Flutter et Python. Nous choisissons la technologie la plus adaptée à vos besoins spécifiques."
  },
  {
    question: "Le module IA pour rapport de stage est-il payant ?",
    answer: "Le module de base est inclus gratuitement avec toute commande de projet étudiant. Une version premium avec génération illimitée est disponible séparément."
  }
];

export function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>Questions Fréquentes</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Tout ce que vous devez <span className="text-amber-500">savoir</span>
          </h2>
          <p className="text-gray-400">
            Des réponses claires pour vous aider à démarrer votre projet en toute confiance.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border transition-all duration-300 ${
                activeIndex === index
                  ? "bg-gray-800/50 border-amber-500/50 shadow-lg shadow-amber-500/10"
                  : "bg-gray-800/20 border-gray-700 hover:border-gray-600"
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className={`font-semibold text-lg transition-colors ${
                  activeIndex === index ? "text-amber-400" : "text-gray-200"
                }`}>
                  {faq.question}
                </span>
                <span className={`ml-4 p-1 rounded-full transition-colors ${
                  activeIndex === index ? "bg-amber-500/20 text-amber-400" : "bg-gray-700 text-gray-400"
                }`}>
                  {activeIndex === index ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-gray-700/50 pt-4 mt-1">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
