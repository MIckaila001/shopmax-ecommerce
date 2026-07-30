# Guide Railway - ULTRA DETAILLÉ (pour débutant absolu)

> Chaque clic est expliqué. Temps total : 15 minutes.

---

## PREPARATION (sur ton PC)

### Etape 0 : Verifier que tout est en ordre

Ouvre le dossier `shopmax/` sur ton PC.

Tu dois voir ces fichiers dans `shopmax/backend/` :
- `Dockerfile` (sans extension)
- `railway.json`
- `.dockerignore`
- `Program.cs`
- `ShopMax.csproj`

**Si tu n'as pas ces fichiers**, tu dois télécharger le nouveau ZIP.

### Etape 1 : Push les changements sur GitHub

Ouvre un terminal (PowerShell ou cmd) dans le dossier `shopmax/` :

```bash
cd chemin/vers/shopmax
```

Par exemple si ton dossier est sur le Bureau :
```bash
cd C:\Users\TonUser\Desktop\shopmax
```

Puis tape ces 3 commandes une par une :

```bash
git add .
```

**Ce que ca fait** : Prepare tous les fichiers modifies pour le commit.

```bash
git commit -m "Add Railway deployment config"
```

**Ce que ca fait** : Enregistre les changements avec un message.

**Si on te demande** "Please tell me who you are", tape :
```bash
git config --global user.email "ton.email@gmail.com"
git config --global user.name "Ton Nom"
```
Puis refais le commit.

```bash
git push
```

**Ce que ca fait** : Envoie les changements sur GitHub.

**Si on te demande** un mot de passe, colle ton **token GitHub** (le meme que tu as utilise avant).

**Tu dois voir a la fin** :
```
* [new branch]      main -> main
```

✅ **Preparation terminee !**

---

## PARTIE 1 : CREER UN COMPTE RAILWAY (3 minutes)

### Etape 1.1 : Aller sur Railway

1. Ouvre ton navigateur (Chrome recommande)
2. Dans la barre d'adresse, tape : `railway.app`
3. Appuie sur **Entree**

### Etape 1.2 : Cliquer sur "Login"

Sur la page d'accueil de Railway, tu vois en haut a droite **Login**.

Clique dessus.

### Etape 1.3 : Se connecter avec GitHub

Tu vois plusieurs options de connexion :
- GitHub
- Google
- Email

**Clique sur "GitHub"** (le logo GitHub noir).

### Etape 1.4 : Autoriser Railway

Une nouvelle fenetre/fenetre GitHub s'ouvre.

**Si tu n'es pas connecte a GitHub**, on te demande de te connecter.

**Si tu es deja connecte**, tu vois une page d'autorisation :

1. En haut, verifie que c'est bien ton compte (par exemple `MIckaila001`)
2. En bas, clique le bouton vert **"Authorize Railway"**

### Etape 1.5 : Accepter les conditions

Railway peut te demander d'accepter les conditions :
1. Coche les cases si necessaire
2. Clique **"Accept"**

### Etape 1.6 : Tu arrives sur le Dashboard

Tu vois maintenant le **Dashboard Railway** : https://railway.app/dashboard

Si tu vois un **formulaire d'onboarding** :
- "What's your role?" → Choisis **"Student"** ou **"Developer"**
- "What are you building?" → Tape **"Portfolio"**
- Clique **"Continue"**

✅ **Compte Railway cree !**

---

## PARTIE 2 : CREER LE PROJET (5 minutes)

### Etape 2.1 : Commencer un nouveau projet

Sur le Dashboard, tu vois en haut a droite un bouton **"+ New Project"**.

**Clique dessus**.

Un menu deroulant apparait avec :
- "Deploy from GitHub repo"
- "Empty Project"
- "Template"

**Clique sur "Deploy from GitHub repo"**.

### Etape 2.2 : Selectionner le repository

Si c'est ta premiere fois, Railway te demande l'acces a tes repos GitHub.

Une nouvelle fenetre s'ouvre :
1. En haut, tu peux choisir :
   - **"All repositories"** (tous tes repos)
   - **"Only select repositories"** (seulement certains)
2. **Recommandation** : choisis **"Only select repositories"**
3. En bas, dans la liste, **selectionne uniquement `shopmax-ecommerce`** (ton repo)
4. Clique **"Install & Authorize"**

**Si tu vois une liste de tes repos directement** :
1. Cherche `MIckaila001/shopmax-ecommerce` dans la liste
2. Tu peux utiliser la barre de recherche en haut
3. **Clique dessus**

### Etape 2.3 : Premier deploiement

Railway commence immediatement le deploiement.

**Patiente 2-3 minutes** pendant le build.

Tu vois des logs qui defilent :
```
Cloning repository...
Installing dependencies...
Building...
Starting...
```

### Etape 2.4 : Verifier le build

Une fois le build termine, tu vois :
- Un **cercle vert** ou un **check** a cote du service
- Le statut **"Deployed"** ou **"Success"**

**Si tu vois une erreur rouge** :
- Clique sur le service
- Onglet **"Build Logs"**
- Copie l'erreur et dis-moi

### Etape 2.5 : Renommer le service (optionnel)

1. Sur le service deploye, clique sur son nom (en haut)
2. Renomme-le en **`shopmax-backend`**
3. Appuie Entree

✅ **Premier deploy reussi (mais sans BDD, ca va planter au demarrage)**

---

## PARTIE 3 : AJOUTER LA BASE DE DONNEES (2 minutes)

### Etape 3.1 : Ajouter un service PostgreSQL

Sur ton projet Railway (la grande fenetre avec ton service backend) :

1. En haut a droite, tu vois un bouton **"+ New"** (ou **"+ Add Service"**)
2. **Clique dessus**
3. Un menu apparait, selectionne **"Database"**
4. Puis selectionne **"PostgreSQL"**

### Etape 3.2 : Le service PostgreSQL est cree

Tu vois maintenant **2 services** sur ton projet :
- `shopmax-backend` (ou le nom par defaut)
- `Postgres` (ou similaire)

La base PostgreSQL est **automatiquement creee** par Railway.

### Etape 3.3 : Recuperer la connection string

1. **Clique sur le service PostgreSQL** (l'icone avec le logo base de donnees)
2. Va dans l'onglet **"Variables"** (en haut)
3. Tu vois une variable **`DATABASE_URL`**
4. **A gauche de la valeur**, tu vois un **bouton pour copier** (icone presse-papier)
5. **Clique dessus** pour copier

Tu obtiens une URL qui ressemble a :
```
postgresql://postgres:abc123def456@containers-us-west-12.railway.app:7890/railway
```

✅ **Connection string copiee !**

---

## PARTIE 4 : CONFIGURER LES VARIABLES D'ENVIRONNEMENT (3 minutes)

### Etape 4.1 : Ouvrir les variables du backend

1. **Clique sur le service backend** (`shopmax-backend`)
2. Va dans l'onglet **"Variables"** (en haut)

### Etape 4.2 : Ajouter les variables une par une

Tu vois un bouton **"+ New Variable"** ou un champ de texte.

**Pour chaque variable ci-dessous** :
1. Clique **"+ New Variable"**
2. Dans **"Variable Name"**, tape le nom
3. Dans **"Value"**, tape ou colle la valeur
4. Clique **"Add"** ou **"Save"**

#### Variable 1 : Connection String a la BDD

- **Name** : `ConnectionStrings__DefaultConnection`
- **Value** : Transforme la DATABASE_URL en format ASP.NET

**Transformation** :
Si ton `DATABASE_URL` est :
```
postgresql://postgres:abc123@containers-us-west-12.railway.app:7890/railway
```

Transforme-le en :
```
Host=containers-us-west-12.railway.app;Port=7890;Database=railway;Username=postgres;Password=abc123
```

**Format** : `Host=XXX;Port=XXX;Database=railway;Username=postgres;Password=XXX`

#### Variable 2 : JWT Secret

- **Name** : `Jwt__Key`
- **Value** : `ShopMax2025SecretKey_SuperLongForSecurity_ChangeItInProduction2025`

> Note : cette cle doit faire au moins 32 caracteres. Tu peux mettre ce que tu veux, mais c'est mieux qu'elle soit longue et unique.

#### Variable 3 : JWT Issuer

- **Name** : `Jwt__Issuer`
- **Value** : `ShopMax`

#### Variable 4 : JWT Audience

- **Name** : `Jwt__Audience`
- **Value** : `ShopMaxUsers`

#### Variable 5 : CORS - URL de ton site Vercel

- **Name** : `ALLOWED_ORIGINS`
- **Value** : `https://ton-site.vercel.app`

> **IMPORTANT** : Remplace `ton-site.vercel.app` par ton VRAI URL Vercel.
> Si ton site Vercel s'appelle `shopmax-ecommerce.vercel.app`, mets :
> `https://shopmax-ecommerce.vercel.app`

#### Variable 6 : Environment

- **Name** : `ASPNETCORE_ENVIRONMENT`
- **Value** : `Production`

### Etape 4.3 : Verifier

Tu dois voir **6 variables** dans la liste :
1. `ConnectionStrings__DefaultConnection`
2. `Jwt__Key`
3. `Jwt__Issuer`
4. `Jwt__Audience`
5. `ALLOWED_ORIGINS`
6. `ASPNETCORE_ENVIRONMENT`

### Etape 4.4 : Railway redéploie automatiquement

Quand tu ajoutes des variables, Railway redéploie automatiquement le service.

**Attends 1-2 minutes** que ça finisse.

Tu dois voir un **cercle vert** quand c'est bon.

✅ **Variables configurées !**

---

## PARTIE 5 : GENERER LE DOMAINE PUBLIC (1 minute)

### Etape 5.1 : Ouvrir les settings

1. **Clique sur le service backend**
2. Va dans l'onglet **"Settings"**

### Etape 5.2 : Section Networking

Descends jusqu'a trouver **"Networking"** ou **"Domains"**.

### Etape 5.3 : Generer le domaine

Tu vois un bouton **"Generate Domain"** (ou **"Add Domain"**).

**Clique dessus**.

Railway te donne automatiquement une URL :
```
https://shopmax-backend-production.up.railway.app
```

**OU** une URL personnalisee aleatoire.

**COPIE CETTE URL**, tu en auras besoin.

✅ **Domaine genere !**

---

## PARTIE 6 : TESTER LE BACKEND (2 minutes)

### Test 1 : Page d'accueil

Ouvre un nouvel onglet dans ton navigateur et va a :

```
https://ton-backend.up.railway.app/
```

**Tu dois voir** :
```json
{
  "name": "ShopMax API",
  "version": "1.0.0",
  "docs": "/swagger"
}
```

**Si tu vois une erreur 502 ou "Application error"** :
- Va sur Railway > service backend > onglet **"Logs"**
- Verifie les erreurs

### Test 2 : Swagger

Va a :
```
https://ton-backend.up.railway.app/swagger
```

**Tu dois voir** une page avec la liste de tous tes endpoints :
- /api/Auth/login
- /api/Auth/register
- /api/Products
- /api/Categories
- /api/Orders
- /api/Promotions/active
- etc.

### Test 3 : Endpoint promotions

Va a :
```
https://ton-backend.up.railway.app/api/promotions/active
```

**Tu dois voir** du JSON avec les 3 promos seedees :
- MEGA SOLDES D'ÉTÉ
- PROMO TECH -30%
- LIVRAISON GRATUITE

### Test 4 : Endpoint produits

Va a :
```
https://ton-backend.up.railway.app/api/products
```

**Tu dois voir** du JSON avec tes produits (iPhone, Samsung, etc.).

✅ **Backend operationnel !**

---

## PARTIE 7 : CONNECTER VERCEL AU BACKEND (3 minutes)

### Etape 7.1 : Aller sur Vercel

1. Ouvre un nouvel onglet
2. Va sur https://vercel.com/dashboard
3. **Connecte-toi** si necessaire (avec le meme compte GitHub)
4. **Clique sur ton projet** `shopmax-ecommerce`

### Etape 7.2 : Ouvrir les variables d'environnement

1. En haut, clique sur **"Settings"**
2. Dans le menu gauche, clique sur **"Environment Variables"**

### Etape 7.3 : Ajouter la variable

Tu vois un formulaire pour ajouter une variable.

1. **Name** : tape `NEXT_PUBLIC_API_URL`
2. **Value** : colle l'URL de ton backend Railway, suivi de `/api`
   - Exemple : `https://shopmax-backend-production.up.railway.app/api`
3. **Coche les 3 cases** :
   - ✅ Production
   - ✅ Preview
   - ✅ Development
4. Clique **"Save"**

### Etape 7.4 : Redeployer

1. En haut, clique sur **"Deployments"**
2. Sur le **dernier deploiement** (en haut de la liste), clique sur les **3 points "..."**
3. Clique **"Redeploy"**
4. Confirme

**Attends 2-3 minutes** que le redéploiement finisse.

### Etape 7.5 : Verifier

1. Va sur **ton site Vercel** : `https://shopmax-ecommerce.vercel.app`
2. **Ouvre la console du navigateur** :
   - Chrome : `F12` ou clic droit > "Inspecter" > onglet "Console"
3. **Tu ne dois PAS voir** d'erreurs CORS ou d'erreurs 404 sur les appels API

✅ **Vercel est connecte a Railway !**

---

## PARTIE 8 : VERIFIER QUE TOUT MARCHE (2 minutes)

### Test 1 : Les countdowns bougent

Va sur ton site Vercel.

**Tu dois voir** des compteurs "00:08:45" ou similaire qui se mettent a jour **chaque seconde**.

### Test 2 : Les ventes flash

Descends jusqu'a la section **"Ventes Flash"**.

**Tu dois voir** 4 produits (iPhone, Samsung, etc.) avec :
- Prix barre (en gris)
- Prix reduit (en rouge)
- Pourcentage de reduction
- Barre de stock
- Compteur dynamique

### Test 3 : La banniere promo

**Tu dois voir** en haut de la home une banniere jaune qui change automatiquement toutes les 8 secondes (3 promos en rotation).

### Test 4 : Le backend

Ouvre `/swagger` sur ton backend Railway.

**Tu peux tester les endpoints** directement depuis Swagger.

### Test 5 : Connexion admin

Va sur ton site Vercel > `/connexion` :

- **Email** : `admin@shopmax.cm`
- **Password** : `Admin123!`

**Tu dois etre connecte** et redirige vers `/compte`.

✅ **Tout marche !**

---

## PROBLEMES COURANTS

### Probleme 1 : "Build failed" sur Railway

**Solution** :
1. Va sur Railway > service backend > onglet **"Build Logs"**
2. Cherche l'erreur (en rouge)
3. Verifie que le **Dockerfile est bien dans `backend/`** (pas a la racine du repo)

### Probleme 2 : "Connection to database failed"

**Solution** :
1. Verifie que tu as bien ajoute le service **PostgreSQL**
2. Verifie la **connection string** dans les variables
3. Format exact : `Host=xxx;Port=xxx;Database=railway;Username=postgres;Password=xxx`

### Probleme 3 : "CORS error" depuis Vercel

**Solution** :
1. Verifie que `ALLOWED_ORIGINS` est bien configure
2. L'URL doit etre **exactement** celle de Vercel
3. Format : `https://nom-exact.vercel.app` (pas d'espace, pas de /)

### Probleme 4 : "502 Bad Gateway" sur Railway

**Solution** :
1. Le backend a plante au demarrage
2. Va sur Railway > service backend > onglet **"Logs"**
3. Copie-moi l'erreur, je t'aide

### Probleme 5 : "JWT Key too short"

**Solution** :
1. Ta cle JWT doit faire au moins 32 caracteres
2. Utilise celle que je t'ai donnee : `ShopMax2025SecretKey_SuperLongForSecurity_ChangeItInProduction2025`

### Probleme 6 : "Application timeout"

**Solution** :
1. Le service n'est pas encore demarre
2. Attends 1-2 minutes
3. Reessaie

### Probleme 7 : Les promos ne s'affichent pas

**Solution** :
1. Va sur `/api/promotions/active` sur Railway
2. Si ca retourne `[]` (vide), le seed n'a pas ete execute
3. Ouvre la console Railway et execute : `dotnet ef database update`

---

## RESUME VISUEL

```
Ton PC (Windows)
   |
   | git push
   v
GitHub
   |
   v
Railway detecte le push
   |
   v
Build automatique (Docker)
   |
   v
Service backend deploye
   |
   | Utilise les variables d'env
   v
Connexion a PostgreSQL
   |
   v
Migrations + Seed auto
   |
   v
API publique sur Railway
   ^
   | NEXT_PUBLIC_API_URL
   |
Vercel (Frontend)
   |
   v
Recruteurs voient ton site
```

---

## CHECKLIST FINALE

Coche au fur et a mesure :

- [ ] Compte Railway cree
- [ ] Projet deploye depuis GitHub
- [ ] PostgreSQL ajoute
- [ ] Connection string configuree
- [ ] Jwt__Key configure
- [ ] Jwt__Issuer configure
- [ ] Jwt__Audience configure
- [ ] ALLOWED_ORIGINS configure
- [ ] ASPNETCORE_ENVIRONMENT = Production
- [ ] Domaine genere
- [ ] /swagger accessible
- [ ] /api/products retourne du JSON
- [ ] /api/promotions/active retourne du JSON
- [ ] Variable NEXT_PUBLIC_API_URL ajoutee sur Vercel
- [ ] Vercel redeploye
- [ ] Site Vercel fonctionne
- [ ] Countdowns bougent
- [ ] Ventes flash s'affichent
- [ ] Connexion admin fonctionne

**Tout est coche ? Felicitations, tu as un backend en production ! 🎉**

---

## APRES LE DEPLOY

1. **Partage** l'URL Railway dans ton CV
2. **Documente** tes endpoints dans le README
3. **Surveille** les logs Railway regulierement
4. **Fais des backups** de la BDD (Railway le fait automatiquement)
5. **Upgrade** le plan si tu as beaucoup de trafic (gratuit = 5$/mois de credit)

## BESOIN D'AIDE ?

Si tu es bloque a une etape precise :
1. **Dis-moi l'etape exacte** (ex: "je suis a l'etape 3.2")
2. **Decris ce que tu vois** (capture d'ecran si possible)
3. **Copie les messages d'erreur** si il y en a

Je te guide en 2 minutes ! 💪
