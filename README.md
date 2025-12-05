# 🚀 DGTech - Plateforme de Développement d'Applications

![DGTech Banner](https://via.placeholder.com/1200x300/F59E0B/FFFFFF?text=DGTech+-+Développement+Web+Mobile+Desktop)

## 📋 Description

**DGTech** est une plateforme moderne de développement d'applications web, mobile et desktop, spécialisée dans l'accompagnement des étudiants en informatique, startups et entreprises.

### ✨ Fonctionnalités Principales

- 🔐 **Authentification sécurisée** avec Supabase
- 📊 **Dashboard interactif** pour gérer vos projets
- 💬 **Système de messagerie** en temps réel
- 📁 **Gestion de documents** pour chaque projet
- 🎓 **Module spécial étudiants** pour les projets de fin d'études
- 🤖 **Module IA** pour la génération automatique de rapports
- 📱 **Design responsive** et moderne

---

## 🛠️ Stack Technologique

### Frontend
- **React 19.2.0** - Framework UI moderne
- **TypeScript 5.9.3** - Typage statique
- **Vite 7.2.4** - Build tool ultra-rapide
- **TailwindCSS 4.1.17** - Framework CSS utility-first
- **DaisyUI 5.5.8** - Composants UI pré-stylisés
- **Framer Motion 12.23.25** - Animations fluides
- **React Router DOM 7.10.0** - Routing côté client
- **Lucide React** - Icônes modernes

### Backend
- **Supabase** - Backend-as-a-Service
  - Authentification
  - Base de données PostgreSQL
  - Storage de fichiers
  - Real-time subscriptions

---

## 📦 Installation

### Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- Un compte **Supabase** (gratuit)

### 1. Cloner le projet

```bash
git clone https://github.com/votre-username/TRAIMM-TECH.git
cd TRAIMM-TECH
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de Supabase

#### a) Créer un projet Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Créez un nouveau projet
3. Notez votre **URL du projet** et votre **clé anon publique**

#### b) Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Éditez `.env.local` et remplacez les valeurs :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-publique
```

#### c) Créer les tables dans Supabase

1. Ouvrez le **SQL Editor** dans votre dashboard Supabase
2. Copiez le contenu du fichier `supabase-schema.sql`
3. Exécutez le script SQL

Cela créera :
- ✅ Table `profiles` (profils utilisateurs)
- ✅ Table `projects` (projets)
- ✅ Table `messages` (messagerie)
- ✅ Table `documents` (fichiers)
- ✅ Row Level Security (RLS) policies
- ✅ Triggers automatiques

### 4. Lancer le serveur de développement

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:5173](http://localhost:5173)

---

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `dist/`.

### Déploiement sur Vercel (recommandé)

1. Installez Vercel CLI :
```bash
npm i -g vercel
```

2. Déployez :
```bash
vercel
```

3. Configurez les variables d'environnement dans le dashboard Vercel

### Déploiement sur Netlify

1. Connectez votre repo GitHub à Netlify
2. Configurez :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
3. Ajoutez les variables d'environnement

---

## 📁 Structure du Projet

```
TRAIMM-TECH/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Index.tsx
│   │   └── sections/
│   │       ├── HeroSection.tsx
│   │       ├── ServicesSection.tsx
│   │       ├── HowItWorksSection.tsx
│   │       ├── FAQ.tsx
│   │       └── Contact.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── auth/
│   │       ├── SignIn.tsx
│   │       └── SignUp.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   └── projects.service.ts
│   ├── lib/
│   │   └── supabase.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
├── supabase-schema.sql
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔑 Fonctionnalités Détaillées

### Authentification

- ✅ Inscription avec email/mot de passe
- ✅ Connexion sécurisée
- ✅ Déconnexion
- ✅ Gestion de session automatique
- ✅ Protection des routes privées

### Dashboard

- 📊 Vue d'ensemble des projets
- 📈 Statistiques en temps réel
- 💬 Messages non lus
- 📁 Documents récents
- ⚡ Actions rapides

### Gestion de Projets

- ➕ Créer un nouveau projet
- ✏️ Modifier un projet existant
- 🗑️ Supprimer un projet
- 📊 Suivre la progression (0-100%)
- 🏷️ Statuts : En attente, En cours, Terminé, Annulé

---

## 🎓 Module Étudiant

Fonctionnalités spéciales pour les étudiants :

- 📝 Aide aux projets de fin d'études (PFE)
- 🤖 Génération automatique de rapports avec IA
- 📊 Création de diagrammes UML
- 📚 Templates de documentation
- 👨‍🏫 Coaching technique

---

## 🔐 Sécurité

- ✅ Row Level Security (RLS) activé sur toutes les tables
- ✅ Authentification JWT via Supabase
- ✅ Variables d'environnement sécurisées
- ✅ Protection CSRF
- ✅ Validation des données côté serveur

---

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview

# Linter
npm run lint
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

---

## 📞 Support

- 📧 Email : contact@dgtech.com
- 💬 WhatsApp : [Contactez-nous](https://wa.me/33123456789)
- 📱 Telegram : [@dgtech_support](https://t.me/dgtech_support)

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 🙏 Remerciements

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Supabase](https://supabase.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

<div align="center">
  <p>Fait avec ❤️ par l'équipe DGTech</p>
  <p>© 2025 DGTech. Tous droits réservés.</p>
</div>
