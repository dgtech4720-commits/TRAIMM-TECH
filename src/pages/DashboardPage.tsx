import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2, Home, FolderKanban, MessageSquare, FileText, Settings, LogOut,
  Plus, Bell, Search, Menu, X, Clock, CheckCircle2, TrendingUp,
  Phone, Loader, User, CreditCard, Shield, ChevronRight,
  Download, Filter, Send, Trash2, Sparkles
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { projectsService } from "../services/projects.service";
import type { ProjectWithTotals } from "../types/database";
import { PROJECT_STATUSES } from "../types/database";

type ViewType = 'dashboard' | 'projects' | 'messages' | 'documents' | 'settings' | 'offers';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectWithTotals[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      if (!user) return;
      try {
        setIsLoading(true);
        const userProjects = await projectsService.getProjectsForClient(user.id);
        setProjects(userProjects);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const navItems = [
    { id: 'dashboard', icon: Home, label: "Tableau de bord" },
    { id: 'projects', icon: FolderKanban, label: "Mes projets" },
    { id: 'messages', icon: MessageSquare, label: "Messages", badge: 3 },
    { id: 'documents', icon: FileText, label: "Documents" },
    { id: 'offers', icon: Sparkles, label: "Découvrir Offres" },
    { id: 'settings', icon: Settings, label: "Paramètres" },
  ];

  // --- RENDU DES VUES ---

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Bonjour, {user?.email?.split('@')[0] ?? 'Utilisateur'}
          </h1>
          <p className="text-gray-400 mt-2">Voici un aperçu de vos projets et statistiques.</p>
        </div>
        <button
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          onClick={() => navigate('/create-project')}
        >
          <Plus className="w-5 h-5" /> Nouveau projet
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Projets actifs", value: projects.filter(p => p.status === PROJECT_STATUSES.ACTIVE).length, icon: FolderKanban, trend: "+1 ce mois", color: "text-amber-400", bg: "bg-amber-500/20" },
          { label: "Tâches terminées", value: "24", icon: CheckCircle2, trend: "+8 cette semaine", color: "text-emerald-400", bg: "bg-emerald-500/20" },
          { label: "Messages non lus", value: "3", icon: MessageSquare, trend: "2 urgents", color: "text-yellow-400", bg: "bg-yellow-500/20" },
          { label: "Documents", value: "12", icon: FileText, trend: "4 nouveaux", color: "text-cyan-400", bg: "bg-cyan-500/20" },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all p-6">
            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            <div className="text-xs text-amber-400 mt-2 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {stat.trend}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Projets récents</h2>
          <button className="text-amber-400 hover:text-amber-300 text-sm font-semibold" onClick={() => setCurrentView('projects')}>Voir tout →</button>
        </div>
        {renderProjectList()}
      </div>
    </div>
  );

  const renderProjectList = () => {
    if (isLoading) return <div className="flex justify-center p-10"><Loader className="animate-spin text-amber-500" size={40} /></div>;
    if (projects.length === 0) return <p className="text-center text-gray-500 py-10">Aucun projet pour le moment.</p>;

    return (
      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="group flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 border border-gray-700 hover:border-amber-500/50 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">{project.title}</h3>
              <p className="text-sm text-gray-500">Modifié le {new Date(project.created_at).toLocaleDateString()}</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> {project.status}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-amber-400 transition-colors" />
          </div>
        ))}
      </div>
    );
  };

  const renderMessages = () => (
    <div className="h-[calc(100vh-120px)] flex flex-col bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 overflow-hidden">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="text-amber-400" /> Centre de Messages
        </h2>
        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">3 nouveaux</span>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <div className="w-full md:w-80 border-r border-gray-800 flex flex-col">
          <div className="p-4">
            <input type="text" placeholder="Rechercher..." className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800/70 transition-colors ${i === 1 ? 'bg-amber-500/10 border-l-2 border-l-amber-500' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-gray-900 font-bold">S</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-semibold text-sm text-white">Support DGTech</span>
                      <span className="text-xs text-gray-500">14:30</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">Votre devis est prêt pour validation...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:flex flex-1 flex-col bg-gray-950/50">
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-amber-400"><User className="w-4 h-4" /></div>
              <div className="bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3 border border-gray-700 max-w-md">
                <p className="text-gray-300 text-sm">Bonjour ! Comment pouvons-nous vous aider aujourd'hui ?</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 rounded-2xl rounded-tr-none px-4 py-3 max-w-md">
                <p className="text-sm font-medium">Je souhaiterais avoir des nouvelles concernant mon projet d'application mobile.</p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2">
            <input type="text" placeholder="Écrivez votre message..." className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500" />
            <button className="w-10 h-10 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 flex items-center justify-center hover:shadow-lg hover:shadow-amber-500/30 transition-all"><Send className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Documents & Livrables</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors flex items-center gap-2 text-sm"><Filter className="w-4 h-4" /> Filtrer</button>
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-medium flex items-center gap-2 text-sm hover:shadow-lg hover:shadow-amber-500/30 transition-all"><Plus className="w-4 h-4" /> Ajouter</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Cahier des charges.pdf", size: "2.4 MB", date: "12 Jan 2024", type: "PDF" },
          { name: "Design Mockups.figma", size: "15.8 MB", date: "15 Jan 2024", type: "Design" },
          { name: "Contrat_Prestation.pdf", size: "1.1 MB", date: "10 Jan 2024", type: "PDF" },
        ].map((doc, i) => (
          <div key={i} className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all group p-5">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                <FileText className="w-6 h-6" />
              </div>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-amber-400"><Download className="w-5 h-5" /></button>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold text-white truncate">{doc.name}</h3>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{doc.size}</span>
                <span>{doc.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl space-y-8">
      <h2 className="text-2xl font-bold text-white">Paramètres du profil</h2>
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl border border-gray-800 p-6 space-y-6">
        <div className="flex items-center gap-6 pb-6 border-b border-gray-800">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-gray-900 text-3xl font-bold shadow-lg shadow-amber-500/30">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 text-sm font-medium hover:shadow-lg hover:shadow-amber-500/30 transition-all">Changer la photo</button>
            <p className="text-xs text-gray-500 mt-2">JPG, GIF ou PNG. 1MB max.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Nom complet</label>
            <input type="text" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white" defaultValue={user?.email?.split('@')[0]} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-gray-500" defaultValue={user?.email || ''} readOnly />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4">
          <button className="px-6 py-2 rounded-lg border border-gray-700 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">Annuler</button>
          <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-medium hover:shadow-lg hover:shadow-amber-500/30 transition-all">Sauvegarder</button>
        </div>
      </div>
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-red-400">Zone de danger</h3>
          <p className="text-sm text-red-400/70">Supprimer définitivement votre compte et vos données.</p>
        </div>
        <button className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-500/20 transition-colors flex items-center gap-2"><Trash2 className="w-4 h-4" /> Supprimer</button>
      </div>
    </div>
  );

  const renderOffers = () => (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-white">Boostez vos projets</h2>
        <p className="text-gray-400">Profitez de nos services premium pour accélérer votre développement et garantir votre succès.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Pack Étudiant", price: "49€", features: ["Assistance rédactionnelle", "Correction de code", "Support 24h/24"] },
          { title: "Pack Startup", price: "299€", features: ["Design UI/UX inclus", "Hébergement 1 an", "SEO de base"], popular: true },
          { title: "Pack Enterprise", price: "999€", features: ["Architecture Cloud", "Sécurisation avancée", "Maintenance prioritaire"] },
        ].map((offer, i) => (
          <div key={i} className={`bg-gray-900/80 backdrop-blur-sm rounded-2xl border-2 ${offer.popular ? 'border-amber-500 shadow-xl shadow-amber-500/20 scale-105' : 'border-gray-800'} relative overflow-hidden p-6`}>
            {offer.popular && <div className="absolute top-4 right-4"><span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 text-xs font-bold">Populaire</span></div>}
            <h3 className="text-xl font-bold text-center text-white mb-2">{offer.title}</h3>
            <div className="text-4xl font-black text-center bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-6">{offer.price}</div>
            <ul className="space-y-3 mb-8">
              {offer.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-semibold transition-all ${offer.popular ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 hover:shadow-lg hover:shadow-amber-500/30' : 'border border-gray-700 text-gray-400 hover:border-amber-500 hover:text-amber-400'}`}>Choisir cette offre</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-950 flex overflow-hidden">
      {/* Sidebar Toggle Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 shadow-xl shadow-amber-500/30 flex items-center justify-center" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-800">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center shadow-md shadow-amber-500/30">
            <Code2 className="w-5 h-5 text-gray-900" />
          </div>
          <span className="text-lg font-bold text-white">DG<span className="text-amber-400">TECH</span></span>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as ViewType);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${currentView === item.id ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 shadow-md shadow-amber-500/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
              {item.badge && <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${currentView === item.id ? 'bg-gray-900 text-amber-400' : 'bg-amber-500/20 text-amber-400'}`}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800 space-y-2">
          <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-lg p-3 border border-amber-500/20">
            <p className="text-xs font-bold text-amber-400 uppercase mb-1">Support Premium</p>
            <p className="text-xs text-gray-500 mb-2">Besoin d'aide technique ?</p>
            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 text-xs font-semibold flex items-center justify-center gap-2 hover:shadow-md hover:shadow-amber-500/30 transition-all"><Phone className="w-3 h-3" /> Appeler</button>
          </div>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors" onClick={handleLogout}>
            <LogOut className="w-5 h-5" /> <span className="font-medium text-sm">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-3 flex items-center justify-between">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input type="text" placeholder="Rechercher..." className="w-64 pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-white placeholder-gray-500 text-sm" />
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="dropdown dropdown-end">
              <button className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center relative transition-colors border border-gray-700">
                <Bell className="w-4 h-4 text-gray-400" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
              </button>
              <div tabIndex={0} className="dropdown-content z-50 bg-gray-900 rounded-xl shadow-xl border border-gray-800 w-80 mt-2 p-4">
                <h3 className="font-bold text-white mb-3">Notifications</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {[
                    { title: "Nouveau message", desc: "Le support vous a répondu.", time: "2 min", icon: MessageSquare, color: "text-amber-400" },
                    { title: "Projet validé", desc: "Votre projet a été validé.", time: "1h", icon: CheckCircle2, color: "text-emerald-400" },
                  ].map((notif, idx) => (
                    <div key={idx} className="flex gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer">
                      <div className={`w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center ${notif.color}`}>
                        <notif.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm text-white">{notif.title}</p>
                        <p className="text-xs text-gray-500">{notif.desc}</p>
                      </div>
                      <span className="text-xs text-gray-600">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="dropdown dropdown-end">
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center text-gray-900 font-bold text-sm shadow-md shadow-amber-500/30 hover:shadow-lg hover:shadow-amber-500/40 transition-shadow">
                {user?.email?.charAt(0).toUpperCase()}
              </button>
              <ul tabIndex={0} className="dropdown-content z-50 bg-gray-900 rounded-xl shadow-xl border border-gray-800 w-56 mt-2 py-2">
                <div className="px-4 py-3 border-b border-gray-800">
                  <p className="font-semibold text-white text-sm">{user?.email?.split('@')[0]}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <li><button onClick={() => setCurrentView('settings')} className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-800 hover:text-white flex items-center gap-2 text-sm"><User className="w-4 h-4" /> Mon profil</button></li>
                <li><button onClick={() => setCurrentView('offers')} className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-800 hover:text-white flex items-center gap-2 text-sm"><CreditCard className="w-4 h-4" /> Abonnements</button></li>
                <li><button className="w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-800 hover:text-white flex items-center gap-2 text-sm"><Shield className="w-4 h-4" /> Sécurité</button></li>
                <div className="border-t border-gray-800 mt-2 pt-2">
                  <li><button onClick={handleLogout} className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 flex items-center gap-2 text-sm"><LogOut className="w-4 h-4" /> Déconnexion</button></li>
                </div>
              </ul>
            </div>
          </div>
        </header>

        {/* Dynamic Content View */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Mes Projets</h2>
                  <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-gray-900 font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-amber-500/30 transition-all"><Plus className="w-5 h-5" /> Créer un projet</button>
                </div>
                {renderProjectList()}
              </div>
            )}
            {currentView === 'messages' && renderMessages()}
            {currentView === 'documents' && renderDocuments()}
            {currentView === 'settings' && renderSettings()}
            {currentView === 'offers' && renderOffers()}
          </div>
        </div>
      </main>
    </div>
  );
}