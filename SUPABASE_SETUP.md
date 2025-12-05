# 🔧 Guide de Configuration Supabase pour DGTech

Ce guide vous accompagne pas à pas pour configurer Supabase avec votre projet DGTech.

---

## 📋 Étape 1 : Créer un Compte Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Cliquez sur **"Start your project"**
3. Connectez-vous avec GitHub, Google ou Email

---

## 🚀 Étape 2 : Créer un Nouveau Projet

1. Cliquez sur **"New Project"**
2. Remplissez les informations :
   - **Name** : `dgtech-production` (ou le nom de votre choix)
   - **Database Password** : Générez un mot de passe fort (sauvegardez-le !) (dgtech-production123)
   - **Region** : Choisissez la région la plus proche (ex: `Europe (Frankfurt)`)
   - **Pricing Plan** : Sélectionnez **Free** pour commencer

3. Cliquez sur **"Create new project"**
4. Attendez 2-3 minutes que le projet soit provisionné

---

## 🔑 Étape 3 : Récupérer les Clés API

1. Une fois le projet créé, allez dans **Settings** (⚙️ dans la sidebar)
2. Cliquez sur **API** dans le menu de gauche
3. Vous verrez deux sections importantes :

### Project URL
```
https://xxxxxxxxxxxxx.supabase.co
```
📋 Copiez cette URL

### Project API keys
- **anon public** : Clé publique pour le frontend
- **service_role** : Clé secrète (NE PAS exposer côté client !)

📋 Copiez la clé **anon public**

---

## 📝 Étape 4 : Configurer les Variables d'Environnement

1. À la racine de votre projet, créez un fichier `.env.local` :

```bash
# Dans le terminal
touch .env.local
```

2. Ouvrez `.env.local` et ajoutez :

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_publique_ici
```

⚠️ **Important** : Remplacez les valeurs par celles que vous avez copiées !

3. Vérifiez que `.env.local` est dans votre `.gitignore` :

```gitignore
# .gitignore
.env.local
.env*.local
```

---

## 🗄️ Étape 5 : Créer les Tables de la Base de Données

1. Dans votre dashboard Supabase, allez dans **SQL Editor** (icône 📝)
2. Cliquez sur **"New query"**
3. Copiez TOUT le contenu du fichier `supabase-schema.sql` de votre projet
4. Collez-le dans l'éditeur SQL
5. Cliquez sur **"Run"** (ou `Ctrl+Enter`)

✅ Vous devriez voir : **"Success. No rows returned"**

### Vérification

1. Allez dans **Table Editor** (icône 📊)
2. Vous devriez voir 4 tables :
   - ✅ `profiles`
   - ✅ `projects`
   - ✅ `messages`
   - ✅ `documents`

---

## 🔐 Étape 6 : Configurer l'Authentification

### Email/Password (Déjà activé par défaut)

1. Allez dans **Authentication** → **Providers**
2. **Email** devrait être activé par défaut
3. Configurez les options :
   - ✅ **Enable email confirmations** : Activé (recommandé)
   - ✅ **Secure email change** : Activé

### Configuration des Emails (Optionnel)

Par défaut, Supabase utilise son propre service d'emails. Pour utiliser votre propre SMTP :

1. Allez dans **Settings** → **Auth** → **SMTP Settings**
2. Configurez votre serveur SMTP (Gmail, SendGrid, etc.)

---

## 🧪 Étape 7 : Tester l'Authentification

### Test en local

1. Lancez votre application :
```bash
npm run dev
```

2. Allez sur [http://localhost:5173/sign-up](http://localhost:5173/sign-up)

3. Créez un compte test :
   - Email : `test@example.com`
   - Mot de passe : `Test123456!`
   - Nom : `Test User`

4. Vérifiez dans Supabase :
   - **Authentication** → **Users**
   - Vous devriez voir votre utilisateur !

5. Vérifiez la table profiles :
   - **Table Editor** → **profiles**
   - Un profil devrait avoir été créé automatiquement (grâce au trigger)

---

## 📊 Étape 8 : Tester la Gestion des Projets

1. Connectez-vous avec votre compte test
2. Allez sur le Dashboard
3. Essayez de créer un projet (fonctionnalité à implémenter)

### Créer un projet manuellement (pour tester)

1. Allez dans **Table Editor** → **projects**
2. Cliquez sur **"Insert row"**
3. Remplissez :
   - `user_id` : Copiez l'ID de votre utilisateur depuis la table `profiles`
   - `name` : "Mon Premier Projet"
   - `description` : "Test de création de projet"
   - `status` : "in_progress"
   - `progress` : 50
   - `technologies` : `{"React", "TypeScript", "Supabase"}`

4. Cliquez sur **"Save"**

---

## 🔒 Étape 9 : Vérifier la Sécurité (RLS)

### Test de Row Level Security

1. Essayez de vous connecter avec un autre compte
2. Vérifiez que vous ne voyez PAS les projets du premier utilisateur

### Vérifier les Policies

1. Allez dans **Authentication** → **Policies**
2. Vous devriez voir toutes les policies créées :
   - ✅ Policies pour `profiles`
   - ✅ Policies pour `projects`
   - ✅ Policies pour `messages`
   - ✅ Policies pour `documents`

---

## 📱 Étape 10 : Configuration du Storage (Optionnel)

Pour stocker des fichiers (avatars, documents de projet) :

1. Allez dans **Storage**
2. Cliquez sur **"Create a new bucket"**
3. Créez les buckets suivants :

### Bucket `avatars`
- **Name** : `avatars`
- **Public** : ✅ Oui
- **File size limit** : 2 MB
- **Allowed MIME types** : `image/*`

### Bucket `project-documents`
- **Name** : `project-documents`
- **Public** : ❌ Non (privé)
- **File size limit** : 10 MB

### Configurer les Policies de Storage

```sql
-- Policy pour avatars (public read, authenticated write)
CREATE POLICY "Les avatars sont publics"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Les utilisateurs peuvent uploader leur avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy pour documents de projet (privé)
CREATE POLICY "Les utilisateurs peuvent voir leurs documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'project-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Les utilisateurs peuvent uploader leurs documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 🚨 Dépannage

### Erreur : "Missing Supabase environment variables"

✅ **Solution** : Vérifiez que `.env.local` existe et contient les bonnes valeurs

### Erreur : "Invalid API key"

✅ **Solution** : Vérifiez que vous avez copié la clé **anon public** (pas service_role)

### Erreur : "Row Level Security policy violation"

✅ **Solution** : Vérifiez que les policies RLS sont bien créées (Étape 5)

### Les emails de confirmation ne sont pas envoyés

✅ **Solution** : 
1. Vérifiez dans **Authentication** → **Email Templates**
2. En développement, désactivez temporairement la confirmation d'email

### Impossible de créer un projet

✅ **Solution** : Vérifiez que :
1. Vous êtes bien connecté
2. La table `projects` existe
3. Les policies RLS sont actives

---

## 📚 Ressources Utiles

- [Documentation Supabase](https://supabase.com/docs)
- [Guide d'authentification](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage](https://supabase.com/docs/guides/storage)
- [Realtime](https://supabase.com/docs/guides/realtime)

---

## ✅ Checklist Finale

Avant de passer en production, vérifiez :

- [ ] Variables d'environnement configurées
- [ ] Toutes les tables créées
- [ ] RLS activé sur toutes les tables
- [ ] Policies RLS testées
- [ ] Authentification fonctionnelle
- [ ] Trigger de création de profil actif
- [ ] Storage configuré (si nécessaire)
- [ ] Emails de confirmation configurés
- [ ] Backup de la base de données configuré

---

**🎉 Félicitations ! Votre backend Supabase est prêt !**

Vous pouvez maintenant développer les fonctionnalités de votre application en toute sécurité.
