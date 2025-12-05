# 🎯 Guide : Sauvegarder les Données d'Onboarding dans Supabase

## ✅ Ce Qui a Été Fait

J'ai implémenté la sauvegarde complète des données d'onboarding dans Supabase. Voici ce qui a été modifié :

### 1. **Schéma de Base de Données**

Ajout de 3 nouvelles colonnes à la table `profiles` :
- `company` (TEXT) - Entreprise ou école de l'utilisateur
- `user_type` (TEXT) - Type d'utilisateur (student, startup, company, developer)
- `onboarding_completed` (BOOLEAN) - Indique si l'onboarding est terminé

### 2. **Service Profiles**

Créé `src/services/profiles.service.ts` avec :
- `updateOnboarding()` - Sauvegarde les données d'onboarding
- `getProfile()` - Récupère le profil utilisateur
- `updateProfile()` - Met à jour le profil

### 3. **Page d'Onboarding**

Modifié `src/pages/OnBoardingPage.tsx` pour :
- ✅ Sauvegarder automatiquement les données à la dernière étape
- ✅ Afficher un spinner pendant la sauvegarde
- ✅ Gérer les erreurs avec message d'alerte
- ✅ Rediriger vers le dashboard après succès

---

## 🚀 Comment Utiliser

### Étape 1 : Mettre à Jour la Base de Données

Vous avez **2 options** :

#### Option A : Si vous n'avez PAS encore exécuté le schéma SQL

Exécutez le fichier `supabase-schema.sql` qui contient déjà les nouvelles colonnes.

#### Option B : Si vous AVEZ déjà une table `profiles`

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Ouvrez votre projet
3. Allez dans **SQL Editor**
4. Créez une nouvelle query
5. Copiez le contenu de `supabase-migration-onboarding.sql`
6. Cliquez sur **Run**

✅ Vous devriez voir : **"Success. 3 rows returned"** avec les 3 nouvelles colonnes

---

### Étape 2 : Tester l'Onboarding

1. **Créez un nouveau compte** :
   ```
   http://localhost:5173/sign-up
   ```

2. **Remplissez le formulaire** :
   - Email : `test@example.com`
   - Mot de passe : `Test123456!`
   - Nom : `Test User`

3. **Suivez l'onboarding** :
   - Étape 1 : Bienvenue (cliquez "Suivant")
   - Étape 2 : Entrez votre nom et entreprise
   - Étape 3 : Sélectionnez votre profil (ex: Étudiant)
   - Étape 4 : Cliquez "Commencer"

4. **Vérifiez la sauvegarde** :
   - Allez dans Supabase → **Table Editor** → **profiles**
   - Trouvez votre utilisateur
   - Vérifiez que les colonnes sont remplies :
     - `full_name` : "Test User"
     - `company` : Votre entreprise
     - `user_type` : "student" (ou autre)
     - `onboarding_completed` : `true`

---

## 🔍 Vérification

### Dans Supabase

```sql
-- Voir tous les profils avec leurs données d'onboarding
SELECT 
  id,
  email,
  full_name,
  company,
  user_type,
  onboarding_completed,
  created_at
FROM public.profiles
ORDER BY created_at DESC;
```

### Dans la Console du Navigateur

Ouvrez la console (F12) et tapez :
```javascript
// Vérifier l'utilisateur connecté
console.log(await supabase.auth.getUser());

// Vérifier le profil
console.log(await supabase.from('profiles').select('*').single());
```

---

## 📊 Flux de Données

```
1. Utilisateur remplit l'onboarding
   ↓
2. Clic sur "Commencer" (dernière étape)
   ↓
3. Appel à profilesService.updateOnboarding()
   ↓
4. Supabase met à jour la table profiles
   ↓
5. Redirection vers /dashboard
```

---

## 🎨 Personnalisation

### Ajouter un Nouveau Type d'Utilisateur

1. **Modifier le schéma SQL** :
```sql
ALTER TABLE public.profiles
DROP CONSTRAINT IF EXISTS profiles_user_type_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_user_type_check
CHECK (user_type IN ('student', 'startup', 'company', 'developer', 'freelance'));
```

2. **Modifier OnBoardingPage.tsx** :
```typescript
const userTypes = [
  // ... types existants
  {
    id: "freelance",
    label: "Freelance",
    description: "Missions courtes, expertise technique",
    icon: Briefcase,
    color: "from-yellow-500 to-amber-500",
  },
];
```

3. **Modifier profiles.service.ts** :
```typescript
export interface OnboardingData {
  fullName: string;
  company: string;
  userType: 'student' | 'startup' | 'company' | 'developer' | 'freelance';
}
```

---

### Ajouter un Nouveau Champ

Exemple : Ajouter un champ "Téléphone"

1. **Ajouter la colonne dans Supabase** :
```sql
ALTER TABLE public.profiles
ADD COLUMN phone TEXT;
```

2. **Modifier le formulaire** (Étape 2) :
```typescript
// Dans OnBoardingPage.tsx, étape 1
<input
  type="tel"
  value={formData.phone}
  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
  placeholder="+33 6 12 34 56 78"
  className="..."
/>
```

3. **Mettre à jour le service** :
```typescript
// Dans profiles.service.ts
export interface OnboardingData {
  fullName: string;
  company: string;
  userType: string;
  phone?: string; // Nouveau champ
}

// Dans updateOnboarding
await supabase
  .from('profiles')
  .update({
    full_name: data.fullName,
    company: data.company,
    user_type: data.userType,
    phone: data.phone, // Nouveau champ
    onboarding_completed: true,
  })
  .eq('id', userId);
```

---

## 🐛 Dépannage

### Erreur : "Missing Supabase environment variables"

✅ Vérifiez `.env.local` :
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
```

### Erreur : "relation 'profiles' does not exist"

✅ Exécutez `supabase-schema.sql` dans le SQL Editor

### Erreur : "column 'company' does not exist"

✅ Exécutez `supabase-migration-onboarding.sql`

### Les données ne sont pas sauvegardées

✅ Vérifiez :
1. Que l'utilisateur est bien connecté
2. Que les RLS policies permettent l'UPDATE
3. La console du navigateur pour les erreurs

### Erreur : "new row violates check constraint"

✅ Vérifiez que `userType` est bien l'une des valeurs autorisées :
- `student`
- `startup`
- `company`
- `developer`

---

## 📈 Prochaines Étapes

### Court Terme

1. **Afficher les données dans le Dashboard** :
```typescript
// Dans DashboardPage.tsx
const { user } = useAuth();
const [profile, setProfile] = useState(null);

useEffect(() => {
  if (user) {
    profilesService.getProfile(user.id).then(({ data }) => {
      setProfile(data);
    });
  }
}, [user]);

// Afficher
<h1>Bonjour, {profile?.full_name} !</h1>
<p>Type : {profile?.user_type}</p>
```

2. **Permettre de modifier le profil** :
   - Créer une page `/settings`
   - Formulaire pour modifier les infos
   - Appeler `profilesService.updateProfile()`

3. **Personnaliser l'expérience selon le type** :
```typescript
if (profile?.user_type === 'student') {
  // Afficher le module IA
}
```

### Moyen Terme

4. **Analytics sur l'onboarding** :
   - Taux de complétion
   - Temps moyen par étape
   - Types d'utilisateurs les plus fréquents

5. **A/B Testing** :
   - Tester différents textes
   - Tester différents ordres d'étapes

---

## ✅ Checklist de Vérification

Avant de passer en production :

- [ ] Colonnes ajoutées dans Supabase
- [ ] RLS policies testées
- [ ] Onboarding testé avec un nouveau compte
- [ ] Données bien sauvegardées dans `profiles`
- [ ] Pas d'erreur dans la console
- [ ] Redirection vers dashboard fonctionne
- [ ] Loading state s'affiche pendant la sauvegarde
- [ ] Messages d'erreur s'affichent si problème

---

## 🎉 Résultat Final

Maintenant, quand un utilisateur s'inscrit :

1. ✅ Il remplit le formulaire d'inscription
2. ✅ Il est redirigé vers l'onboarding
3. ✅ Il complète les 4 étapes
4. ✅ Ses données sont **automatiquement sauvegardées dans Supabase**
5. ✅ Il est redirigé vers le dashboard
6. ✅ Vous pouvez utiliser ces données pour personnaliser son expérience

---

**🚀 Tout est prêt ! Testez maintenant en créant un nouveau compte.**
