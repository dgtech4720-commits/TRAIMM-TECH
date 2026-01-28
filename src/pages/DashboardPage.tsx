import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2, Home, FolderKanban, MessageSquare, FileText, Settings, LogOut,
  Plus, Bell, Search, Menu, X, Clock, CheckCircle2, AlertCircle, TrendingUp,
  MessageCircle, Phone, Loader, User, CreditCard, Shield, ChevronRight,
  Download, Filter, Mail, Trash2, Send
} from "lucide-react";

import { useAuth } from "../contexts/AuthContext";
import { projectsService } from "../services/projects.service";
import type { ProjectWithTotals, ProjectStatus } from "../types/database";
import { PROJECT_STATUSES } from "../types/database";

type ViewType = 'dashboard' | 'projects' | 'messages' | 'documents' | 'settings' | 'offers';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectWithTotals[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    { id: 'offers', icon: SparklesIcon, label: "Découvrir Offres", special: true },
    { id: 'settings', icon: Settings, label: "Paramètres" },
  ];

  function SparklesIcon(props: any) {
    return (
      <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" /></svg>
    );
  }

  // --- RENDU DES VUES ---

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-base-content">
            Bonjour, {user?.email?.split('@')[0] ?? 'Utilisateur'} <span className="text-primary">👋</span>
          </h1>
          <p className="text-base-content/70 mt-2">Voici un aperçu de vos projets et statistiques.</p>
        </div>
        <button className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl" onClick={() => setCurrentView('projects')}>
          <Plus className="w-5 h-5" /> Nouveau projet
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Projets actifs", value: projects.filter(p => p.status === PROJECT_STATUSES.ACTIVE).length, icon: FolderKanban, trend: "+1 ce mois", color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Tâches terminées", value: "24", icon: CheckCircle2, trend: "+8 cette semaine", color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Messages non lus", value: "3", icon: MessageSquare, trend: "2 urgents", color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Documents", value: "12", icon: FileText, trend: "4 nouveaux", color: "text-cyan-400", bg: "bg-cyan-500/10" },
        ].map((stat) => (
          <div key={stat.label} className="card bg-gray-900 border border-gray-800 shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-300">
            <div className="card-body p-6">
              <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center mb-4 border border-white/5`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
              <div className="text-xs text-primary/80 mt-2 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-md">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <h2 className="card-title text-2xl font-bold">Projets récents</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setCurrentView('projects')}>Voir tout →</button>
          </div>
          {renderProjectList()}
        </div>
      </div>
    </div>
  );

  const renderProjectList = () => {
    if (isLoading) return <div className="flex justify-center p-10"><Loader className="animate-spin text-primary" size={40} /></div>;
    if (projects.length === 0) return <p className="text-center text-base-content/70 py-10">Aucun projet pour le moment.</p>;

    return (
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="group flex items-center gap-4 p-4 rounded-xl bg-gray-900 border border-gray-800 hover:border-primary/50 transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white">{project.title}</h3>
              <p className="text-sm text-gray-400">Modifié le {new Date(project.created_at).toLocaleDateString()}</p>
            </div>
            <div className={`badge badge-ghost bg-gray-800 border-gray-700 text-gray-300 gap-1`}>
              <Clock className="w-3 h-3" /> {project.status}
            </div>
            <button className="btn btn-ghost btn-circle btn-sm text-gray-400">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  const renderMessages = () => (
    <div className="h-[calc(100vh-160px)] flex flex-col bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gray-800/30">
        <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
          <MessageSquare className="text-primary" /> Centre de Messages
        </h2>
        <div className="badge badge-primary">3 nouveaux</div>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* Liste des conversations */}
        <div className="w-full md:w-80 border-r border-gray-800 flex flex-col">
          <div className="p-4">
            <input type="text" placeholder="Rechercher..." className="input input-bordered input-sm w-full bg-gray-800 border-gray-700 text-white" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${i === 1 ? 'bg-primary/5 border-l-4 border-l-primary' : ''}`}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white font-bold">S</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <span className="font-bold text-sm truncate text-white">Support DGTech</span>
                      <span className="text-[10px] text-gray-500">14:30</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">Votre devis est prêt pour validation...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Zone de chat active */}
        <div className="hidden md:flex flex-1 flex-col bg-gray-950/50">
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <div className="chat chat-start">
              <div className="chat-image avatar"><div className="w-10 rounded-full bg-primary/20 p-2 text-primary"><User /></div></div>
              <div className="chat-bubble bg-gray-800 text-white border border-gray-700">Bonjour ! Comment pouvons-nous vous aider aujourd'hui ?</div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble bg-primary text-primary-content">Je souhaiterais avoir des nouvelles concernant mon projet d'application mobile.</div>
            </div>
          </div>
          <div className="p-4 bg-gray-900 border-t border-gray-800 flex gap-2">
            <input type="text" placeholder="Écrivez votre message..." className="input input-bordered flex-1 bg-gray-800 border-gray-700 text-white" />
            <button className="btn btn-primary btn-circle"><Send className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Documents & Livrables</h2>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm gap-2 text-gray-400 border-gray-700 hover:bg-gray-800"><Filter className="w-4 h-4" /> Filtrer</button>
          <button className="btn btn-primary btn-sm gap-2"><Plus className="w-4 h-4" /> Ajouter</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: "Cahier des charges.pdf", size: "2.4 MB", date: "12 Jan 2024", type: "PDF" },
          { name: "Design Mockups.figma", size: "15.8 MB", date: "15 Jan 2024", type: "Design" },
          { name: "Contrat_Prestation.pdf", size: "1.1 MB", date: "10 Jan 2024", type: "PDF" },
        ].map((doc, i) => (
          <div key={i} className="card bg-gray-900 border border-gray-800 hover:shadow-xl transition-all group hover:border-primary/30">
            <div className="card-body p-5">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-primary border border-white/5">
                  <FileText className="w-7 h-7" />
                </div>
                <button className="btn btn-ghost btn-sm btn-circle opacity-0 group-hover:opacity-100 transition-opacity text-gray-400"><Download className="w-4 h-4" /></button>
              </div>
              <div className="mt-4">
                <h3 className="font-bold truncate text-white">{doc.name}</h3>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{doc.size}</span>
                  <span>{doc.date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl space-y-8 animate-in slide-in-from-left-4 duration-500">
      <h2 className="text-3xl font-bold text-white">Paramètres du profil</h2>
      <div className="card bg-gray-900 border border-gray-800 shadow-xl">
        <div className="card-body space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-gray-800">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-white text-4xl font-black shadow-2xl shadow-primary/20">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <button className="btn btn-primary btn-sm mb-2">Changer la photo</button>
              <p className="text-xs text-gray-500 font-medium">JPG, GIF ou PNG. 1MB max.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label"><span className="label-text text-gray-400">Nom complet</span></label>
              <input type="text" className="input input-bordered bg-gray-800 border-gray-700 text-white focus:border-primary" defaultValue={user?.email?.split('@')[0]} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text text-gray-400">Email</span></label>
              <input type="email" className="input input-bordered bg-gray-800 border-gray-700 text-gray-500" defaultValue={user?.email || ''} readOnly />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button className="btn btn-ghost text-gray-400">Annuler</button>
            <button className="btn btn-primary px-8">Sauvegarder</button>
          </div>
        </div>
      </div>
      <div className="card bg-red-500/5 border border-red-500/20">
        <div className="card-body flex-row items-center justify-between p-6">
          <div>
            <h3 className="font-bold text-red-400">Zone de danger</h3>
            <p className="text-sm text-gray-500">Supprimer définitivement votre compte et vos données.</p>
          </div>
          <button className="btn btn-error btn-outline gap-2 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"><Trash2 className="w-4 h-4" /> Supprimer</button>
        </div>
      </div>
    </div>
  );

  const renderOffers = () => (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-bold text-white">Boostez vos projets 🚀</h2>
        <p className="text-gray-400">Profitez de nos services premium pour accélérer votre développement et garantir votre succès.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Pack Étudiant", price: "49€", features: ["Assistance rédactionnelle", "Correction de code", "Support 24h/24"] },
          { title: "Pack Startup", price: "299€", features: ["Design UI/UX inclus", "Hébergement 1 an", "SEO de base"] },
          { title: "Pack Enterprise", price: "999€", features: ["Architecture Cloud", "Sécurisation avancée", "Maintenance prioritaire"] },
        ].map((offer, i) => (
          <div key={i} className={`card bg-gray-900 border-2 ${i === 1 ? 'border-primary shadow-2xl shadow-primary/20 scale-105' : 'border-gray-800 shadow-md'} relative overflow-hidden`}>
            {i === 1 && <div className="absolute top-4 right-4"><span className="badge badge-primary font-bold">Populaire</span></div>}
            <div className="card-body">
              <h3 className="text-xl font-bold text-center mb-2 text-white">{offer.title}</h3>
              <div className="text-4xl font-black text-center text-primary mb-6">{offer.price}</div>
              <ul className="space-y-3 mb-8">
                {offer.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <button className={`btn ${i === 1 ? 'btn-primary' : 'btn-outline border-gray-700 text-gray-300 hover:bg-gray-800'} w-full`}>Choisir cette offre</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 flex transition-all duration-500">
      {/* Sidebar Toggle Mobile */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button className="btn btn-primary btn-circle shadow-2xl" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 shadow-2xl lg:shadow-none'}`}>
        <div className="h-24 flex items-center gap-4 px-8 border-b border-gray-800">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20">
            <Code2 className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-white">Dev<span className="text-primary">Flow</span></span>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as ViewType);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 group ${currentView === item.id ? 'bg-primary text-primary-content shadow-lg shadow-primary/30' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <item.icon className={`w-5 h-5 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
              <span className="flex-1 text-left font-bold">{item.label}</span>
              {item.badge && <span className={`badge badge-sm font-bold ${currentView === item.id ? 'bg-white text-primary' : 'badge-primary'}`}>{item.badge}</span>}
              {item.special && <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping" />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-800 space-y-4">
          <div className="bg-gradient-to-br from-primary/10 to-emerald-400/5 rounded-2xl p-4 border border-primary/10">
            <p className="text-xs font-bold text-primary uppercase mb-2">Support Premium</p>
            <p className="text-xs text-gray-400 mb-3">Besoin d'aide technique immédiate ?</p>
            <button className="btn btn-sm btn-primary w-full gap-2"><Phone className="w-3 h-3" /> Appeler support</button>
          </div>
          <button className="btn btn-ghost w-full justify-start gap-4 text-gray-400 hover:text-error hover:bg-error/10 transition-colors" onClick={handleLogout}>
            <LogOut className="w-5 h-5" /> <span className="font-bold">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-950">
        {/* Header */}
        <header className="navbar bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-8 py-4 sticky top-0 z-30">
          <div className="flex-1">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
              <input type="text" placeholder="Rechercher partout..." className="input input-sm bg-gray-800 border-none focus:ring-1 focus:ring-primary w-64 pl-10 rounded-full transition-all text-white" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Dropdown avec Onglet de défilement */}
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-circle bg-gray-800/50 hover:bg-gray-800 relative group">
                <div className="indicator">
                  <Bell className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                  <span className="badge badge-primary badge-xs indicator-item animate-bounce"></span>
                </div>
              </button>
              <div tabIndex={0} className="dropdown-content z-[50] card card-compact w-80 p-2 shadow-2xl bg-gray-900 border border-gray-800 mt-4 animate-in slide-in-from-top-2 duration-300">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg text-white">Notifications</h3>
                    <span className="text-[10px] text-primary cursor-pointer hover:underline">Tout marquer comme lu</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {[
                      { title: "Nouveau message", desc: "Le support vous a répondu.", time: "2 min", icon: MessageSquare, color: "text-primary" },
                      { title: "Projet validé", desc: "Votre projet 'E-commerce' a été validé.", time: "1h", icon: CheckCircle2, color: "text-emerald-500" },
                      { title: "Paiement requis", desc: "Nouvelle facture disponible.", time: "3h", icon: CreditCard, color: "text-amber-500" },
                      { title: "Mise à jour sécu", desc: "Nouveau certificat SSL installé.", time: "Hier", icon: Shield, color: "text-cyan-500" },
                      { title: "Rapport PFE", desc: "Votre brouillon a été corrigé.", time: "2 j", icon: FileText, color: "text-purple-500" },
                    ].map((notif, idx) => (
                      <div key={idx} className="flex gap-4 p-3 rounded-xl hover:bg-gray-800 cursor-pointer transition-colors border border-transparent hover:border-gray-700">
                        <div className={`w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center flex-shrink-0 ${notif.color}`}>
                          <notif.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-white">{notif.title}</p>
                          <p className="text-[10px] text-gray-400 truncate">{notif.desc}</p>
                          <p className="text-[8px] text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-gray-800 text-center">
                    <button className="btn btn-ghost btn-xs w-full text-primary" onClick={() => setCurrentView('messages')}>Voir tout</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Management Dropdown */}
            <div className="dropdown dropdown-end">
              <button tabIndex={0} className="avatar cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all rounded-full outline-none">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-primary-content font-black shadow-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              </button>
              <ul tabIndex={0} className="dropdown-content z-[50] menu p-2 shadow-2xl bg-gray-900 rounded-2xl w-64 mt-4 border border-gray-800 animate-in slide-in-from-top-2 duration-300">
                <div className="p-4 border-b border-gray-800 flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-primary"><User /></div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs truncate text-white">{user?.email?.split('@')[0]}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
                  </div>
                </div>
                <li><button onClick={() => setCurrentView('settings')} className="py-3 px-4 rounded-xl gap-3 text-gray-300 hover:text-white"><User className="w-4 h-4" /> Mon profil</button></li>
                <li><button onClick={() => setCurrentView('offers')} className="py-3 px-4 rounded-xl gap-3 text-gray-300 hover:text-white"><CreditCard className="w-4 h-4" /> Mes abonnements</button></li>
                <li><button className="py-3 px-4 rounded-xl gap-3 text-gray-300 hover:text-white"><Shield className="w-4 h-4" /> Sécurité</button></li>
                <div className="divider my-1 before:bg-gray-800 after:bg-gray-800"></div>
                <li><button onClick={handleLogout} className="py-3 px-4 rounded-xl gap-3 text-error hover:bg-error/10"><LogOut className="w-4 h-4" /> Déconnexion</button></li>
              </ul>
            </div>
          </div>
        </header>


        {/* Dynamic Content View */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'projects' && (
              <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold">Mes Projets</h2>
                  <button className="btn btn-primary gap-2"><Plus className="w-5 h-5" /> Créer un projet</button>
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

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #9ca3af; }
      `}</style>
    </div>
  );
}