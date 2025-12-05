import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Code2,
  Home,
  FolderKanban,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Plus,
  Bell,
  Search,
  Menu,
  X,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageCircle,
  Phone,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Tableau de bord", href: "#", active: true },
  { icon: FolderKanban, label: "Mes projets", href: "#" },
  { icon: MessageSquare, label: "Messages", href: "#", badge: 3 },
  { icon: FileText, label: "Documents", href: "#" },
  { icon: Settings, label: "Paramètres", href: "#" },
];

const recentProjects = [
  {
    id: 1,
    name: "Application E-commerce",
    status: "in_progress",
    progress: 65,
    lastUpdate: "Il y a 2 heures",
  },
  {
    id: 2,
    name: "Site Vitrine PME",
    status: "completed",
    progress: 100,
    lastUpdate: "Il y a 1 jour",
  },
  {
    id: 3,
    name: "Application Mobile iOS",
    status: "pending",
    progress: 15,
    lastUpdate: "Il y a 3 jours",
  },
];

const stats = [
  { label: "Projets actifs", value: "3", icon: FolderKanban, trend: "+1 ce mois", color: "text-primary" },
  { label: "Tâches terminées", value: "24", icon: CheckCircle2, trend: "+8 cette semaine", color: "text-emerald-500" },
  { label: "Messages non lus", value: "5", icon: MessageSquare, trend: "2 urgents", color: "text-amber-500" },
  { label: "Budget utilisé", value: "67%", icon: TrendingUp, trend: "Sur 3 projets", color: "text-cyan-500" },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case "completed":
      return { label: "Terminé", color: "badge-success", icon: CheckCircle2 };
    case "in_progress":
      return { label: "En cours", color: "badge-primary", icon: Clock };
    case "pending":
      return { label: "En attente", color: "badge-warning", icon: AlertCircle };
    default:
      return { label: "Inconnu", color: "badge-neutral", icon: AlertCircle };
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleWhatsApp = () => {
    window.open("https://wa.me/33123456789?text=Bonjour, j'ai besoin d'aide avec mon projet.", "_blank");
  };

  const handleTelegram = () => {
    window.open("https://t.me/devflow_support", "_blank");
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-100 flex">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          className="btn btn-primary btn-circle shadow-lg"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed lg:static inset-0 z-40 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300`}>
        <div className="w-72 h-full bg-base-100 border-r border-base-300 flex flex-col">
          {/* Logo */}
          <div className="h-20 flex items-center gap-3 px-6 border-b border-base-300">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-md">
              <Code2 className="w-7 h-7 text-primary-content" />
            </div>
            <span className="text-xl font-bold text-base-content">
              Dev<span className="text-primary font-bold">Flow</span>
            </span>
            <button 
              className="lg:hidden ml-auto"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-6 h-6 text-base-content/70" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-box transition-all ${item.active ? 'bg-primary/10 text-primary font-semibold' : 'text-base-content/70 hover:bg-base-200 hover:text-base-content'}`}
              >
                <item.icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="badge badge-primary badge-sm">{item.badge}</span>
                )}
              </a>
            ))}
          </nav>

          {/* Contact Buttons */}
          <div className="p-4 space-y-3 border-t border-base-300">
            <p className="text-sm text-base-content/70 px-2">Support rapide</p>
            <button
              className="btn btn-success w-full justify-start gap-3"
              onClick={handleWhatsApp}
            >
              <div className="w-5 h-5">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              WhatsApp
            </button>
            <button
              className="btn btn-info w-full justify-start gap-3"
              onClick={handleTelegram}
            >
              <MessageCircle className="w-5 h-5" />
              Telegram
            </button>
            <button className="btn btn-outline btn-primary w-full justify-start gap-3">
              <Phone className="w-5 h-5" />
              Appeler
            </button>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-base-300">
            <button
              className="btn btn-ghost w-full justify-start gap-3 text-base-content/70 hover:text-error"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="navbar bg-base-100 border-b border-base-300 px-6 py-4">
          <div className="flex-1">
            <div className="form-control hidden md:block">
              <div className="join">
                <input 
                  type="text" 
                  placeholder="Rechercher..." 
                  className="input input-bordered join-item w-64 rounded-box" 
                />
                <button className="btn btn-primary join-item rounded-box">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <Bell className="w-6 h-6 text-base-content/70" />
                  <span className="badge badge-primary badge-xs indicator-item"></span>
                </div>
              </button>
            </div>
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-circle avatar">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center text-primary-content font-semibold">
                  JD
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-base-content">
                  Bonjour, Jean <span className="text-primary">👋</span>
                </h1>
                <p className="text-base-content/70 mt-2">
                  Voici un aperçu de vos projets et statistiques.
                </p>
              </div>
              <button className="btn btn-primary btn-lg gap-2 shadow-lg hover:shadow-xl">
                <Plus className="w-5 h-5" />
                Nouveau projet
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className="card bg-base-100 border border-base-300 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="card-body">
                    <div className="flex items-start justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-opacity-10 ${stat.color.replace('text-', 'bg-')} flex items-center justify-center`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="text-3xl font-bold text-base-content">{stat.value}</div>
                      <div className="text-sm text-base-content/70">{stat.label}</div>
                      <div className="text-xs text-primary mt-2">{stat.trend}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Projects */}
            <div className="card bg-base-100 border border-base-300 shadow-lg">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="card-title text-2xl font-bold text-base-content">
                    Projets récents
                  </h2>
                  <button className="btn btn-ghost btn-sm">Voir tout →</button>
                </div>
                
                <div className="space-y-4">
                  {recentProjects.map((project) => {
                    const status = getStatusConfig(project.status);
                    return (
                      <div 
                        key={project.id}
                        className="card bg-base-200 border border-base-300 hover:border-primary/50 transition-colors cursor-pointer"
                      >
                        <div className="card-body">
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg text-base-content">
                                  {project.name}
                                </h3>
                                <div className={`badge ${status.color} gap-1`}>
                                  <status.icon className="w-3 h-3" />
                                  {status.label}
                                </div>
                              </div>
                              <p className="text-sm text-base-content/70">
                                Dernière mise à jour : {project.lastUpdate}
                              </p>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="w-40">
                                <div className="flex justify-between text-sm mb-1">
                                  <span className="text-base-content/70">Progression</span>
                                  <span className="font-medium text-base-content">{project.progress}%</span>
                                </div>
                                <progress 
                                  className="progress progress-primary w-full" 
                                  value={project.progress} 
                                  max="100"
                                />
                              </div>
                              <button className="btn btn-primary btn-sm">Voir</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}