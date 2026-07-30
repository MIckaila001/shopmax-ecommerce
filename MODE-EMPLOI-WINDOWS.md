# 📖 MODE D'EMPLOI COMPLET — SHOPMAX (Windows)

> **Pour :** Utilisateurs Windows 10 / 11
> **Niveau :** Débutant à intermédiaire
> **Temps d'installation :** 30 à 45 minutes

---

## 📑 TABLE DES MATIÈRES

1. [Prérequis à installer](#-étape-1--prérequis-à-installer)
2. [Configuration du projet](#-étape-2--configuration-du-projet)
3. [Premier lancement](#-étape-3--premier-lancement)
4. [Utilisation quotidienne](#-étape-4--utilisation-quotidienne)
5. [🆕 Créer la base de données](#-étape-5--créer-la-base-de-données-postgresql)
6. [🆕 Configurer les variables d'environnement](#-étape-6--configurer-les-variables-denvironnement)
7. [🆕 Télécharger les images](#-étape-7--télécharger-les-images-réelles)
8. [Configuration Google OAuth](#-étape-8--configuration-google-oauth)
9. [Configuration des paiements (NotchPay)](#-étape-9--configuration-des-paiements-notchpay)
10. [Tests et qualité du code](#-étape-10--tests-et-qualité-du-code)
11. [Build et déploiement](#-étape-11--build-et-déploiement)
12. [Dépannage (FAQ)](#-dépannage--faq)
13. [🆕 Liste complète des scripts .bat](#-liste-complète-des-scripts-bat)

---

## 🛠️ ÉTAPE 1 : Prérequis à installer

### 1.1 — Node.js (obligatoire)

Le frontend (Next.js) nécessite Node.js.

1. Ouvrez votre navigateur sur : **https://nodejs.org/**
2. Téléchargez la version **LTS** (Long Term Support) — actuellement 20.x ou 22.x
3. Lancez l'installateur `.msi` téléchargé
4. Suivez l'assistant :
   - ✅ Cochez **"Add to PATH"** (important !)
   - Gardez les autres options par défaut
5. Cliquez sur **Install** puis **Finish**

**Vérification :**
Ouvrez une **nouvelle fenêtre** PowerShell ou CMD et tapez :
```cmd
node --version
npm --version
```
Vous devez voir s'afficher les versions (ex: `v20.11.0` et `10.2.4`).

> ❌ Si vous voyez "node n'est pas reconnu", fermez et rouvrez votre terminal.

---

### 1.2 — .NET 10 SDK (obligatoire pour le backend)

Le backend (ASP.NET Core) nécessite .NET 10.

1. Allez sur : **https://dotnet.microsoft.com/download**
2. Cliquez sur **Download .NET 10.0 SDK**
3. Téléchargez l'installateur **x64** (ou **Arm64** si vous avez un Mac M1/M2 sous Windows)
4. Lancez l'installateur
5. Suivez l'assistant (tout par défaut)

**Vérification :**
```cmd
dotnet --version
```
Vous devez voir `10.0.xxx`.

---

### 1.3 — Git (recommandé)

1. Téléchargez sur : **https://git-scm.com/download/win**
2. Installez avec les options par défaut
3. Redémarrez votre terminal

**Vérification :**
```cmd
git --version
```

---

### 1.4 — Visual Studio Code (recommandé pour éditer le code)

1. Téléchargez sur : **https://code.visualstudio.com/**
2. Installez-le
3. **Extensions recommandées** (ouvrez VS Code, puis dans le menu Extensions `Ctrl+Shift+X`) :
   - **C#** (par Microsoft) — pour le backend
   - **ES7+ React/Redux/React-Native** — pour le frontend
   - **Tailwind CSS IntelliSense** — pour l'autocomplétion Tailwind
   - **Prettier** — pour le formatage
   - **ESLint** — pour la qualité du code

---

### 1.5 — PostgreSQL (optionnel - ou utilisez Neon)

Vous avez **2 choix** :

#### 🅰️ Option A : PostgreSQL local (classique)
1. Téléchargez sur : **https://www.postgresql.org/download/windows/**
2. Lancez l'installateur
3. ⚠️ **IMPORTANT** : notez le mot de passe que vous choisissez pour l'utilisateur `postgres` !
4. Gardez le port par défaut : `5432`
5. L'installateur installe aussi **pgAdmin** (interface graphique) et **psql** (ligne de commande)

#### 🅱️ Option B : Neon (cloud, plus simple) ⭐ RECOMMANDÉ
1. Allez sur **https://neon.tech**
2. Créez un compte (gratuit, login avec GitHub)
3. Cliquez sur **Create Project**
4. Nom : `shopmax`
5. Region : **Europe (Frankfurt)** ou **US East**
6. Postgres version : **16**
7. Cliquez sur **Create Project**
8. Sur la page du projet, **copiez la Connection String** :
   ```
   postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/shopmax?sslmode=require
   ```

> 🆓 Neon est **gratuit** jusqu'à 0.5 GB (largement suffisant pour le dev).

---

### 1.6 — Redis (optionnel)

Si vous voulez faire tourner Redis en local :
1. Téléchargez **Memurai** (Redis pour Windows) : https://www.memurai.com/
2. Installez-le, il tourne automatiquement

> 💡 Si vous ne l'installez pas, le backend démarre quand même (Redis est marqué optionnel).

---

## ⚙️ ÉTAPE 2 : Configuration du projet

### 2.1 — Récupérer le projet

Vous avez 2 options :

#### Option A — Depuis GitHub
```cmd
cd C:\Users\VotreNom\Documents
git clone https://github.com/votre-compte/shopmax.git
cd shopmax
```

#### Option B — Depuis les fichiers locaux (ZIP)
1. Décompressez le ZIP
2. Placez le dossier `shopmax` dans un **chemin simple** (ex: `C:\Projets\shopmax` ou `C:\shopmax`)
3. ⚠️ Évitez les chemins longs type `Bureau\mon-projet\v2\shopmax`

---

### 2.2 — Installation automatique (recommandé)

**Double-cliquez sur `install.bat`** :

Ce script va :
- ✅ Vérifier que Node.js et .NET sont installés
- ✅ Installer toutes les dépendances npm du frontend
- ✅ Restaurer les packages NuGet du backend
- ✅ Créer le fichier `frontend\.env.local`

> ⏳ Patientez 5 à 10 minutes la première fois.

Si le script se ferme, **ouvrez un CMD** et tapez :
```cmd
cd C:\chemin\vers\shopmax
install.bat
```
Vous verrez l'erreur exacte.

---

## 🚀 ÉTAPE 3 : Premier lancement

### 3.1 — Créer la base de données

Avant de lancer le projet, vous devez créer la BDD.

Dans le dossier `shopmax`, **double-cliquez sur** :
```
create-database.bat
```

Choisissez :
- **Option 1** : Si PostgreSQL est installé en local
- **Option 2** : Si vous avez une connection string (Neon)
- **Option 3** : Pour le guide Neon (première fois)

Le script va :
- ✅ Créer la base `shopmax`
- ✅ Configurer automatiquement `appsettings.json`
- ✅ Appliquer les migrations Entity Framework
- ✅ Préparer le seed

---

### 3.2 — Premier démarrage

**Double-cliquez sur `start-dev.bat`** :

Ce script :
- ✅ Ouvre une fenêtre pour le **backend** (port 5000)
- ✅ Ouvre une fenêtre pour le **frontend** (port 3000)
- ✅ Ouvre automatiquement votre navigateur sur http://localhost:3000

> ⚠️ **Ne fermez PAS** les fenêtres CMD du backend/frontend !

Le frontend est accessible sur **http://localhost:3000** et le backend sur **http://localhost:5000/swagger**.

---

## 💼 ÉTAPE 4 : Utilisation quotidienne

### 4.1 — Le menu principal : `shopmax.bat`

**Double-cliquez sur `shopmax.bat`** pour accéder à **TOUTES** les fonctions :

```
╔══════════════════════════════════════════════════════╗
║        🛒  S H O P M A X   v 0 . 1 . 0              ║
╚══════════════════════════════════════════════════════╝

  Que voulez-vous faire ?

    1.  Installer les dependances
    2.  Demarrer en developpement
    3.  Lancer les tests
    4.  Builder pour la production
    5.  Deployer sur Vercel
    6.  Verifier la qualite du code
    7.  Seeder la base de donnees
    8.  Nettoyer le projet
    9.  Afficher l'aide
   10.  Telecharger les images (a faire 1 fois)
   11.  Configurer les variables d'environnement
   12.  Creer la base de donnees PostgreSQL
   13.  Gerer les migrations
    0.  Quitter
```

Tapez le **numéro** et appuyez sur **Entrée**.

---

### 4.2 — Workflow typique d'une journée

```
Matin :   shopmax.bat → 2 (démarrer)
Travail :  Tu codes tranquillement
Pause :    Ferme les fenêtres backend/frontend avec Ctrl+C
Reprise :  shopmax.bat → 2
Soir :     shopmax.bat → 0 (quitter le menu)
```

Les serveurs tournent en continu, tu n'as qu'à ouvrir ton navigateur.

---

## 🗄️ ÉTAPE 5 : Créer la base de données PostgreSQL

### 5.1 — Lancer le script

**Double-cliquez sur `create-database.bat`** :

```
╔══════════════════════════════════════════════════════╗
║   Que voulez-vous faire ?                            ║
║                                                      ║
║   1. Creer la base en LOCAL (PostgreSQL installe)    ║
║   2. Tester la connection a une base EXISTANTE       ║
║   3. Voir les instructions pour Neon (cloud)         ║
║   0. Annuler                                          ║
╚══════════════════════════════════════════════════════╝
```

### 5.2 — Option 1 : Local

Si PostgreSQL est installé sur votre PC :
- Hote : `localhost` (ou laissez vide)
- Port : `5432` (ou laissez vide)
- Nom de la base : `shopmax` (ou laissez vide)
- Utilisateur : `postgres` (ou laissez vide)
- Mot de passe : celui que vous avez mis pendant l'install

Le script va automatiquement :
1. Tester la connexion
2. Créer la base
3. Configurer `appsettings.json`
4. Lancer les migrations EF Core

### 5.3 — Option 2 : Neon (cloud)

Si vous avez déjà un compte Neon :
1. Allez sur https://console.neon.tech
2. Ouvrez votre projet
3. Cliquez sur **Connection Details**
4. Copiez la **Connection String** :
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/shopmax?sslmode=require
   ```
5. Collez-la dans le script

### 5.4 — Option 3 : Guide Neon (première fois)

Le script affiche un **tutoriel complet** pour créer votre compte Neon.

---

## 🔐 ÉTAPE 6 : Configurer les variables d'environnement

### 6.1 — Lancer l'assistant

**Double-cliquez sur `setup-env.bat`** ou via le menu **option 11** :

L'assistant vous demande **6 étapes** :

1. **PostgreSQL** (déjà fait si vous avez suivi l'étape 5)
2. **Redis** (optionnel - Entrée pour ignorer)
3. **Clé JWT** (générée automatiquement et sécurisée)
4. **Google OAuth** (optionnel)
5. **NotchPay** (optionnel)
6. **Resend** (optionnel)

Vous pouvez **passer** toutes les options en appuyant sur **Entrée** sans rien taper.

À la fin, **2 fichiers** sont créés automatiquement :
- `backend\appsettings.json`
- `frontend\.env.local`

---

## 📸 ÉTAPE 7 : Télécharger les images réelles

Pour avoir les **vraies photos** au lieu des placeholders SVG :

**Double-cliquez sur `download-images.bat`** ou via le menu **option 10** :

```
[1/16] hero/main.jpg                 ... OK (45 KB)
[2/16] categories/electronique.jpg   ... OK (32 KB)
[3/16] categories/mode-homme.jpg     ... OK (28 KB)
...
```

16 images seront téléchargées (~3-5 MB total).

**Requis** : connexion internet active à ce moment-là.

> 💡 Si ça échoue, le site fonctionne quand même avec les placeholders SVG.

---

## 🔐 ÉTAPE 8 : Configuration Google OAuth

Suivez le guide complet : **`GUIDE-GOOGLE-OAUTH.md`**

En résumé :
1. Créez un projet sur https://console.cloud.google.com
2. Activez Google+ API
3. Créez des identifiants OAuth (Application Web)
4. Ajoutez les URLs de redirection :
   - `http://localhost:5000/api/auth/google/callback` (dev)
   - `https://api.votre-domaine.com/api/auth/google/callback` (prod)
5. Lancez **`setup-env.bat`** (option 11) et entrez vos clés

---

## 💳 ÉTAPE 9 : Configuration des paiements (NotchPay)

1. Créez un compte sur https://business.notchpay.co
2. En mode Sandbox (test), récupérez votre **API Key** et **Project ID**
3. Lancez **`setup-env.bat`** et entrez vos clés

Channels supportés :
- `cm.mtn` → MTN Mobile Money
- `cm.orange` → Orange Money
- `card` → Cartes Visa / Mastercard

> 🆓 NotchPay : pas d'abonnement, juste ~2-3% par transaction.

---

## 🧪 ÉTAPE 10 : Tests et qualité du code

### 10.1 — Lancer les tests

**Mode simple (une fois) :**
```cmd
test.bat
```

**Mode watch (relance auto à chaque modif) :**
```cmd
test.bat watch
```

**Interface graphique :**
```cmd
test.bat ui
```
Ouvre une interface web sur http://localhost:51204

**Rapport de couverture :**
```cmd
test.bat coverage
```

**Résultat actuel** : **154/154 tests passent** ✅

### 10.2 — Vérifier la qualité du code

```cmd
lint.bat
```

Ce script :
- ✅ Vérifie les types TypeScript
- ✅ Lance ESLint
- ✅ Exécute tous les tests

À lancer **avant chaque commit** ! 💪

---

## 🏗️ ÉTAPE 11 : Build et déploiement

### 11.1 — Build local

```cmd
build.bat
```

Cela :
- ✅ Vérifie TypeScript
- ✅ Lance les tests
- ✅ Construit le frontend pour la production
- ✅ Publie le backend

### 11.2 — Déploiement frontend (Vercel)

```cmd
deploy.bat
```

(Voir détails dans la section déploiement)

---

## 🆘 Dépannage — FAQ

### ❌ "node n'est pas reconnu"
➡️ Réinstallez Node.js en cochant "Add to PATH".

### ❌ "dotnet n'est pas reconnu"
➡️ Réinstallez .NET 10 SDK ou ajoutez `C:\Program Files\dotnet` au PATH.

### ❌ Port 3000 déjà utilisé
➡️ Changez le port dans `frontend/package.json` :
```json
"dev": "next dev -p 3001"
```

### ❌ Port 5000 déjà utilisé
➡️ Changez dans `backend/Properties/launchSettings.json`.

### ❌ "psql introuvable"
➡️ Installez PostgreSQL ou choisissez l'option Neon (cloud) dans `create-database.bat`.

### ❌ Erreur connexion PostgreSQL
➡️ Vérifiez :
1. PostgreSQL tourne (services Windows)
2. Le mot de passe est correct
3. Le port 5432 n'est pas bloqué par un firewall

### ❌ Le seed ne se lance pas
➡️ Le seed ne s'exécute **qu'en mode Development** et nécessite une BDD accessible.

### ❌ Google OAuth ne marche pas
➡️ Vérifiez le `GUIDE-GOOGLE-OAUTH.md` :
1. Client ID/Secret corrects
2. URLs de redirection exactes (avec le bon port et path)

### ❌ Images ne s'affichent pas
➡️ Deux solutions :
1. **Rapide** : Le site utilise des placeholders SVG par défaut (ça marche)
2. **Réel** : Lancez `download-images.bat` pour télécharger les vraies photos

### ❌ Les fenêtres CMD se ferment toutes seules
➡️ Lancez `start-dev.bat` via le menu (option 2) au lieu de double-cliquer.

### ❌ npm install très long
➡️ C'est normal la première fois (5-10 min). Les fois suivantes c'est instantané.

### ❌ Backend se ferme au démarrage
➡️ Consultez `backend\backend.log` pour voir l'erreur.

---

## 📜 Liste complète des scripts .bat

Le projet contient **13 scripts .bat** :

| # | Script | Rôle | Quand l'utiliser |
|---|--------|------|------------------|
| ⭐ | `shopmax.bat` | Menu principal | À chaque fois |
| 1 | `install.bat` | Installation | **Une fois** au début |
| 2 | `start-dev.bat` | Démarrage dev | **Chaque jour** |
| 3 | `test.bat` | Tests unitaires | Avant chaque commit |
| 4 | `build.bat` | Build production | Avant déploiement |
| 5 | `deploy.bat` | Déploiement Vercel | Quand tout est prêt |
| 6 | `lint.bat` | Qualité du code | Avant chaque commit |
| 7 | `seed-db.bat` | Seed BDD | Pour remplir la base |
| 8 | `clean.bat` | Nettoyage | Pour tout recommencer |
| 9 | `help.bat` | Aide | Quand tu es perdu |
| 10 | `download-images.bat` | Télécharge les photos | Une fois, avec internet |
| 11 | `setup-env.bat` | Assistant config | Au début ou pour changer |
| 12 | `create-database.bat` | Créer la BDD | Au début |
| 13 | `migrate.bat` | Gérer migrations EF | Quand on modifie le modèle |

---

## 🎓 Pour aller plus loin

- 📖 **Documentation Next.js** : https://nextjs.org/docs
- 📖 **Documentation ASP.NET** : https://learn.microsoft.com/aspnet/core
- 📖 **Documentation NotchPay** : https://docs.notchpay.co
- 📖 **Documentation Neon (PostgreSQL)** : https://neon.tech/docs
- 📖 **Documentation Tailwind** : https://tailwindcss.com/docs
- 📖 **Documentation Shadcn/UI** : https://ui.shadcn.com

---

## 🆘 Besoin d'aide ?

1. 📖 Consultez les autres fichiers `.md` :
   - `README.md` — Vue d'ensemble
   - `GUIDE-GOOGLE-OAUTH.md` — Google OAuth
   - `SCRIPTS-BAT.md` — Liste des scripts
2. 🐛 Vérifiez la section **Dépannage** ci-dessus
3. 💬 Contactez le support à **contact@shopmax.cm**
4. 📞 Appelez le **+237 6 00 00 00 00**

---

## ✅ Checklist de démarrage

- [ ] Node.js installé (`node --version`)
- [ ] .NET 10 SDK installé (`dotnet --version`)
- [ ] Projet récupéré (git clone ou ZIP)
- [ ] `install.bat` exécuté avec succès
- [ ] PostgreSQL installé **OU** compte Neon créé
- [ ] `create-database.bat` exécuté → base créée
- [ ] `shopmax.bat` → option 2 → site accessible sur http://localhost:3000
- [ ] `shopmax.bat` → option 10 → images téléchargées
- [ ] `shopmax.bat` → option 11 → variables configurées
- [ ] Prêt à vendre ! 🚀

---

## 🏗️ Workflow complet du premier lancement

```
1. install.bat                    ← Une fois
2. create-database.bat (option 1) ← Crée la BDD
3. setup-env.bat (option 11)      ← Configure les clés (optionnel)
4. download-images.bat (option 10)← Télécharge les photos
5. shopmax.bat → option 2         ← Démarre tout
6. Ouvre http://localhost:3000    ← Profit ! 🎉
```

---

**© 2024 ShopMax — Bon développement !** 💪🇨🇲
