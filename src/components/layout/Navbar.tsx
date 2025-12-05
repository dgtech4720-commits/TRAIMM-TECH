// Navbar.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Building2, 
  ChevronRight, 
  Home,
  Briefcase,
  TrendingUp,
  HelpCircle,
  MessageCircle
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navLinks: NavLink[] = [
  { label: "Accueil", href: "/", icon: <Home className="w-4 h-4" /> },
  { label: "Services", href: "#services", icon: <Briefcase className="w-4 h-4" /> },
  { label: "Solutions", href: "#solutions", icon: <TrendingUp className="w-4 h-4" /> },
  { label: "FAQ", href: "#faq", icon: <HelpCircle className="w-4 h-4" /> },
  { label: "Contact", href: "#contact", icon: <MessageCircle className="w-4 h-4" /> },
];

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "ghost" | "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = "ghost", 
  children, 
  className = "", 
  ...props 
}) => {
  const variantClasses = {
    ghost: "btn btn-ghost text-gray-400 hover:text-white hover:bg-gray-800",
    primary: "btn bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-0 hover:from-amber-600 hover:to-yellow-600 shadow-md hover:shadow-lg transition-all duration-300",
    secondary: "btn btn-outline border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-500"
  };

  return (
    <button 
      className={`${variantClasses[variant]} ${className} font-medium`}
      {...props}
    >
      {children}
    </button>
  );
};

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("/");
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Force Dark Mode
    document.documentElement.setAttribute('data-theme', 'dark');
    document.documentElement.classList.add('dark');
    localStorage.setItem("theme", "dark");

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setActiveLink(href);
    
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMobileMenuOpen(false);
      }
    } else {
      navigate(href);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Barre de navigation élégante et sobre */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-gray-900/95 backdrop-blur-xl shadow-2xl" 
            : "bg-gray-900"
        } rounded-full border border-gray-800`}
        style={{ width: 'calc(100% - 2rem)', maxWidth: '1280px' }}
      >
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo sobre et professionnel */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 border border-gray-700">
                  <Building2 className="w-5 h-5 text-amber-500" />
                </div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-xl font-bold text-white">
                DG<span className="text-amber-500">TECH</span>
              </span>
            </motion.div>

            {/* Navigation Desktop Centrée - Design sobre */}
            <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center gap-0.5 bg-gray-800/50 p-1 rounded-full border border-gray-700">
                {navLinks.map((link) => (
                  <motion.button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 relative ${
                      activeLink === link.href
                        ? "text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    {activeLink === link.href && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gray-700 rounded-full shadow-sm"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className={`relative z-10 ${
                      activeLink === link.href ? "text-amber-400" : "text-gray-400 group-hover:text-gray-200"
                    }`}>
                      {link.icon}
                    </span>
                    <span className="relative z-10">{link.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Actions droite - Design minimaliste */}
            <div className="flex items-center gap-3">
              {/* Boutons CTA Desktop - Design épuré */}
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate("/sign-in")}
                  className="px-5 text-sm"
                >
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate("/sign-up")}
                  className="px-6 gap-2 text-sm"
                >
                  Essayer gratuitement
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Bouton Menu Mobile sobre */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200 border border-gray-700"
                aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-300" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Menu Mobile sobre */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-gray-900 border-t border-gray-800"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <motion.button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                      activeLink === link.href
                        ? "bg-gray-800 text-white border border-gray-700"
                        : "text-gray-400 hover:bg-gray-800/50"
                    }`}
                  >
                    <span className={`${
                      activeLink === link.href ? "text-amber-400" : "text-gray-500"
                    }`}>
                      {link.icon}
                    </span>
                    <span>{link.label}</span>
                    {activeLink === link.href && (
                      <div className="ml-auto w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </motion.button>
                ))}
                
                <div className="pt-4 mt-3 border-t border-gray-800 flex flex-col gap-3">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      navigate("/sign-in");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Connexion
                  </Button>
                  <Button
                    variant="primary"
                    className="w-full gap-2"
                    onClick={() => {
                      navigate("/sign-up");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Essayer gratuitement
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Overlay minimal pour mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}