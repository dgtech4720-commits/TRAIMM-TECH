import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                DG<span className="text-amber-500">TECH</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Votre partenaire de confiance pour la transformation digitale. Nous créons des solutions innovantes pour propulser votre entreprise vers l'avenir.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-amber-500 hover:border-amber-500 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Liens Rapides</h3>
            <ul className="space-y-4">
              {[
                { label: "Accueil", href: "/" },
                { label: "Services", href: "#services" },
                { label: "Comment ça marche", href: "#how-it-works" },
                { label: "FAQ", href: "#faq" },
                { label: "Contact", href: "#contact" },
              ].map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-amber-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500/50 group-hover:bg-amber-500 transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Nos Services</h3>
            <ul className="space-y-4">
              {[
                "Développement Web",
                "Applications Mobiles",
                "Design UI/UX",
                "Consulting Tech",
                "Module IA Étudiant",
              ].map((service, index) => (
                <li key={index}>
                  <span className="text-gray-400 hover:text-amber-500 transition-colors cursor-default block">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Contact</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <span className="block text-white font-medium mb-1">Adresse</span>
                  <span className="text-gray-400 text-sm">123 Avenue de l'Innovation, 75000 Paris, France</span>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <span className="block text-white font-medium mb-1">Email</span>
                  <a href="mailto:contact@dgtech.com" className="text-gray-400 text-sm hover:text-amber-500 transition-colors">
                    contact@dgtech.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <span className="block text-white font-medium mb-1">Téléphone</span>
                  <a href="tel:+33123456789" className="text-gray-400 text-sm hover:text-amber-500 transition-colors">
                    +33 1 23 45 67 89
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} DGTech. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-amber-500 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-amber-500 transition-colors">CGU</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Mentions Légales</a>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Fait avec</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>par l'équipe DGTech</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
