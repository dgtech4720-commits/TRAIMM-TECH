import { motion } from "framer-motion";
import { Mail, MessageCircle, ArrowRight, ExternalLink } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-24 bg-gray-950 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Prêt à lancer <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-500">
                votre projet ?
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Discutons de vos idées. Que ce soit pour un devis, une question technique ou une collaboration, notre équipe est réactive et à votre écoute.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:contact@dgtech.com"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl border border-gray-700 transition-all duration-300"
              >
                <Mail className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
                <span>Envoyer un email</span>
              </a>
              <a 
                href="https://wa.me/1234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl shadow-lg shadow-green-900/20 transition-all duration-300"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>WhatsApp Direct</span>
                <ExternalLink className="w-4 h-4 opacity-50" />
              </a>
            </div>
          </motion.div>

          {/* Cards */}
          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl bg-gray-900 border border-gray-800 hover:border-amber-500/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                <Mail className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Par Email</h3>
              <p className="text-gray-400 mb-4">Réponse sous 24h ouvrées pour toute demande de devis.</p>
              <a href="mailto:contact@dgtech.com" className="inline-flex items-center text-amber-500 font-medium hover:text-amber-400">
                contact@dgtech.com <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl bg-gray-900 border border-gray-800 hover:border-green-500/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sur WhatsApp</h3>
              <p className="text-gray-400 mb-4">Chat direct avec un chef de projet pour une réponse immédiate.</p>
              <a href="https://wa.me/1234567890" className="inline-flex items-center text-green-500 font-medium hover:text-green-400">
                Démarrer la discussion <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
