// Layout.tsx
import React from "react";
import { Navbar } from "./Navbar";
import { Code, Cpu, Shield, Globe, Mail, Linkedin, Twitter, Github } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      
      <main className="pt-4">
        {children}
      </main>
      
      {/* Footer adaptatif */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand et description */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    DG<span className="text-blue-600 dark:text-blue-400">TECH</span>
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Innovation Digitale</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                Nous transformons vos idées en solutions digitales performantes et innovantes.
              </p>
            </div>
            
            {/* Liens rapides */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Navigation</h3>
              <ul className="space-y-2">
                {['Accueil', 'Services', 'Solutions', 'À Propos', 'Contact'].map((item) => (
                  <li key={item}>
                    <a 
                      href={`#${item.toLowerCase().replace(' ', '-')}`} 
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 group-hover:bg-blue-500" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Expertises</h3>
              <ul className="space-y-3">
                {[
                  { icon: <Cpu className="w-4 h-4" />, label: 'Développement Web' },
                  { icon: <Globe className="w-4 h-4" />, label: 'Solutions Cloud' },
                  { icon: <Shield className="w-4 h-4" />, label: 'Cybersécurité' },
                  { icon: <Code className="w-4 h-4" />, label: 'Applications Mobile' },
                ].map((service, index) => (
                  <li key={index}>
                    <a 
                      href="#" 
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
                    >
                      <span className="text-blue-500">{service.icon}</span>
                      {service.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
              <div className="space-y-3">
                <a href="mailto:contact@dgtech.com" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  contact@dgtech.com
                </a>
                <div className="flex gap-3 pt-2">
                  {[Linkedin, Twitter, Github].map((Icon, index) => (
                    <a
                      key={index}
                      href="#"
                      className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} DGTECH. Tous droits réservés.
              </p>
              <div className="flex gap-6 mt-4 md:mt-0">
                <a href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">Confidentialité</a>
                <a href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">Conditions</a>
                <a href="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}