# 🪟 Scripts Windows (.bat)

Tous les scripts `.bat` pour gérer le projet **ShopMax** sur Windows.

## 🚀 Démarrage rapide

| Script | Description |
|--------|-------------|
| **`shopmax.bat`** | ⭐ **Menu interactif** - Lance tous les autres scripts |
| `install.bat` | 📦 Installe toutes les dépendances (Node + .NET) |
| `start-dev.bat` | 🚀 Démarre le projet (frontend + backend) |

## 📋 Scripts disponibles

### 📦 Installation
```cmd
install.bat
```
- Vérifie Node.js et .NET
- Installe les dépendances npm
- Restaure les packages NuGet
- Crée le fichier `.env.local`

### 🚀 Développement
```cmd
start-dev.bat
```
- Ouvre le backend dans une fenêtre CMD
- Ouvre le frontend dans une autre fenêtre
- Lance automatiquement le navigateur sur http://localhost:3000

### 🧪 Tests
```cmd
test.bat              :: Tests unitaires (une fois)
test.bat watch        :: Mode watch (re-lance à chaque modif)
test.bat ui           :: Interface graphique (Vitest UI)
test.bat coverage     :: Rapport de couverture
```

### 🏗️ Build
```cmd
build.bat
```
- Vérifie les types TypeScript
- Lance les tests
- Build le frontend
- Publie le backend (.NET)

### 🚀 Déploiement
```cmd
deploy.bat
```
- Déploiement sur Vercel (production ou preview)
- Nécessite Vercel CLI installé

### 🔍 Qualité du code
```cmd
lint.bat
```
- Vérifie TypeScript
- Lance ESLint
- Exécute les tests

### 🌱 Base de données
```cmd
seed-db.bat
```
- Applique les migrations EF Core
- Seed les données d'exemple

### 🧹 Nettoyage
```cmd
clean.bat
```
- Supprime `node_modules`, `.next`, `dist`, `bin`, `obj`
- ⚠️ Irréversible !

## 💡 Utilisation recommandée

**Première fois :**
```cmd
1. install.bat       (installation)
2. start-dev.bat     (démarrage)
```

**Tous les jours :**
```cmd
start-dev.bat
```

**Avant de commit :**
```cmd
lint.bat
```

**Avant de déployer :**
```cmd
build.bat
deploy.bat
```

## 🎨 Personnalisation

### Modifier les couleurs
Dans chaque script `.bat`, change la valeur après `color` :
- `0A` = Vert sur noir
- `0B` = Cyan sur noir
- `0C` = Rouge sur noir
- `0E` = Jaune sur noir
- `0F` = Blanc sur noir

### Ajouter un script au menu
1. Crée ton script `mon-script.bat`
2. Ajoute une ligne dans `shopmax.bat` :
   ```batch
   if "%CHOICE%"=="X" call mon-script.bat
   ```

## 🐛 Dépannage

**❌ "node n'est pas reconnu"**
→ Installer Node.js : https://nodejs.org/

**❌ "dotnet n'est pas reconnu"**
→ Installer .NET 9 : https://dotnet.microsoft.com/download

**❌ Port 3000 déjà utilisé**
→ Fermer l'autre application ou changer le port dans `frontend/package.json`

**❌ Erreurs de permissions**
→ Clic droit sur le script → "Exécuter en tant qu'administrateur"

## 📝 Notes

- Tous les scripts supportent l'UTF-8 (accents français OK)
- Compatible Windows 10 / 11
- Pour Mac/Linux, utiliser les commandes `npm` directement ou créer des scripts `.sh`
