# Guide Complet : Deployer le Backend sur Railway

## Pourquoi Railway ?

- **Gratuit** : 500h/mois + 5$ de credit (suffisant pour 1 backend)
- **Supporte .NET** : ASP.NET Core 10
- **PostgreSQL inclus** : pas besoin d'installer PostgreSQL ailleurs
- **Auto-deploy** : depuis GitHub
- **HTTPS** : automatique
- **URL publique** : `https://shopmax-backend.up.railway.app`

## PARTIE 1 : Creer un compte Railway (3 min)

### Etape 1.1 : Aller sur Railway
1. Ouvre https://railway.app
2. Clique **Login** (en haut a droite)
3. Choisis **Login with GitHub**
4. Autorise Railway a acceder a tes repos

### Etape 1.2 : Verifier le compte
1. Tu arrives sur le dashboard Railway
2. En haut a droite, clique sur ton avatar
3. **Account Settings**
4. Verifie que ton email est confirme
5. Optionnel : ajoute une carte bancaire pour le plan "Developer" (5$/mois de credit, pas obligatoire pour commencer)

## PARTIE 2 : Preparer le projet (5 min)

### Etape 2.1 : Creer un Dockerfile pour Railway

Railway detecte automatiquement les projets .NET, mais un Dockerfile explicite evite les problemes.

A la racine de `shopmax/backend/`, cree un fichier `Dockerfile` :

```dockerfile
# ============================================
# Dockerfile pour Railway
# ============================================
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copier les fichiers csproj et restaurer
COPY *.csproj ./
RUN dotnet restore

# Copier le reste et build
COPY . ./
RUN dotnet publish -c Release -o /app/publish

# Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# Railway definit automatiquement le port via ASPNETCORE_URLS
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "ShopMax.dll"]
```

### Etape 2.2 : Verifier appsettings.json

Dans `backend/appsettings.json`, verifie que la connection string peut etre surchargee par env var :

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=shopmax;Username=postgres;Password=postgres"
  },
  "JwtSettings": {
    "Secret": "CHANGEZ_CE_SECRET_EN_PRODUCTION_32_CARACTERES_MIN",
    "Issuer": "ShopMax",
    "Audience": "ShopMaxUsers",
    "ExpirationInMinutes": 10080
  },
  "CorsSettings": {
    "AllowedOrigins": ["http://localhost:3000", "https://*.vercel.app"]
  }
}
```

### Etape 2.3 : Verifier Program.cs

Assure-toi que ton `Program.cs` lit bien les variables d'environnement. Voici un exemple propre :

```csharp
var builder = WebApplication.CreateBuilder(args);

// Railway fournit le PORT automatiquement
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://+:{port}");

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        var origins = builder.Configuration["CorsSettings:AllowedOrigins"]?.Split(',')
            ?? new[] { "http://localhost:3000" };
        policy.WithOrigins(origins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ... reste de ta config
```

## PARTIE 3 : Deployer sur Railway (5 min)

### Etape 3.1 : Creer un nouveau projet

1. Sur Railway dashboard (https://railway.app/dashboard)
2. Clique **+ New Project** (ou **+ New** en haut)
3. Choisis **Deploy from GitHub repo**
4. Cherche `MIckaila001/shopmax-ecommerce`
5. Selectionne-le

### Etape 3.2 : Premier deploiement

Railway va :
1. Cloner ton repo
2. Detecter que c'est un projet .NET
3. Lancer le build (1-3 min)
4. Te donner une URL

**Mais ca va planter** car il manque la base de donnees.

### Etape 3.3 : Ajouter PostgreSQL

1. Sur ton projet Railway
2. Clique **+ New** (ou **+ Add Service**)
3. Choisis **Database** > **PostgreSQL**
4. Railway cree une base PostgreSQL
5. Dans l'onglet **Variables**, copie la `DATABASE_URL`

### Etape 3.4 : Configurer les variables d'environnement

Sur le service backend (pas la BDD) :
1. Onglet **Variables**
2. Clique **+ New Variable**
3. Ajoute ces variables (utilise les valeurs de Railway pour la BDD) :

| Variable | Valeur |
|----------|--------|
| `ConnectionStrings__DefaultConnection` | Colle la connection string de Railway PostgreSQL (voir ci-dessous) |
| `JwtSettings__Secret` | Une cle secrete de 32+ caracteres : `ShopMax2025SecretKey_SuperLongForSecurity` |
| `CorsSettings__AllowedOrigins` | `https://ton-site.vercel.app,http://localhost:3000` |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

### Etape 3.5 : Obtenir la connection string PostgreSQL

Sur Railway, sur le service **PostgreSQL** :
1. Onglet **Connect**
2. Section **Postgres Connection URL**
3. Copie l'URL, elle ressemble a : `postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway`

Transforme-la pour ASP.NET :
```
Host=containers-us-west-123.railway.app;Port=5432;Database=railway;Username=postgres;Password=TON_PASSWORD
```

### Etape 3.6 : Lancer les migrations

Sur Railway, sur le service backend :
1. Va dans l'onglet **Settings**
2. Section **Deploy**
3. **Custom Build Command** : `dotnet ef database update && dotnet run`
4. OU mieux : laisse le Dockerfile gerer, et execute les migrations via la console Railway

Pour executer les migrations :
1. Sur le service backend
2. Onglet **Shell** (ou **Console**)
3. Execute :
   ```bash
   dotnet ef database update
   ```
4. Attends que ca finisse

## PARTIE 4 : Tester le backend (1 min)

### Etape 4.1 : Obtenir l'URL publique

1. Sur le service backend
2. Onglet **Settings**
3. Section **Networking** > **Generate Domain**
4. Tu obtiens : `shopmax-backend.up.railway.app` (ou similaire)

### Etape 4.2 : Tester les endpoints

Ouvre dans ton navigateur :
- `https://ton-backend.up.railway.app/swagger` - Documentation API
- `https://ton-backend.up.railway.app/api/products` - Liste des produits
- `https://ton-backend.up.railway.app/api/promotions/active` - Promotions actives

Si tu vois du JSON, c'est bon !

## PARTIE 5 : Connecter Vercel (frontend) au backend Railway (3 min)

### Etape 5.1 : Configurer la variable d'environnement sur Vercel

1. Va sur https://vercel.com/dashboard
2. Selectionne ton projet `shopmax-ecommerce`
3. **Settings** > **Environment Variables**
4. Ajoute :
   - **Name** : `NEXT_PUBLIC_API_URL`
   - **Value** : `https://ton-backend.up.railway.app/api`
   - Coche **Production**, **Preview**, **Development**
5. **Save**

### Etape 5.2 : Redeploy

1. Onglet **Deployments**
2. Sur le dernier deploiement, **...** > **Redeploy**
3. Attends 2-3 min
4. Ton site utilise maintenant le vrai backend !

## PARTIE 6 : Verifier que tout marche (1 min)

### Test 1 : Backend seul
```bash
curl https://ton-backend.up.railway.app/api/products
```
Tu dois voir du JSON avec les produits seedes.

### Test 2 : Frontend
Va sur `https://ton-site.vercel.app` et :
- La home doit charger
- Les compteurs (countdowns) doivent s'afficher
- Le bouton "Ventes Flash" doit montrer des produits
- La banniere promo doit defiler

### Test 3 : Connexion
Va sur `/connexion` et essaie :
- Email : `admin@shopmax.cm`
- Password : `Admin123!`

## PARTIE 7 : Configurer CORS correctement (IMPORTANT)

Pour eviter les erreurs CORS, mets a jour `Program.cs` :

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.SetIsOriginAllowed(origin =>
            origin.StartsWith("https://") || origin.StartsWith("http://localhost")
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});
```

Puis sur Vercel, dans **Environment Variables** :
- `CorsSettings__AllowedOrigins` n'est pas necessaire si tu utilises le CORS permissif ci-dessus
- Sinon : `https://ton-site.vercel.app`

## RESUME

```
GitHub (code)     -->  Railway (backend + BDD)
                          |
                          v
                       Public API
                          ^
                          |
Vercel (frontend) ---|
```

**Avantages** :
- Free tier suffit pour portfolio
- HTTPS automatique
- Auto-deploy quand tu push sur GitHub
- Logs et metrics dans Railway
- PostgreSQL inclus

## SURVEILLER LES COUTS

Railway gratuit = 5$/mois de credit (offert le 1er mois), puis tu dois ajouter une carte.

Pour eviter les surprises :
1. Settings > **Usage** : verifie ta consommation
2. Settings > **Sleep** : active le mode sleep pour economiser
3. Utilise PostgreSQL en plan Hobby (gratuit jusqu'a 100MB)

## APRES LE DEPLOY

Une fois deploye :
- Tests passent
- Pas d'erreurs 500
- API repond en <500ms
- Tu peux ajouter des vraies donnees via l'admin

## COMMANDES UTILES

Dans la console Railway :

```bash
# Voir les logs
railway logs

# Executer les migrations
railway run dotnet ef database update

# Seed la BDD
railway run dotnet run -- --seed

# Connecter a la BDD
railway run psql $DATABASE_URL
```

## ALTERNATIVE : Render.com

Si Railway ne te convient pas, Render est similaire :
- https://render.com
- Plan gratuit : services qui s'endorment apres 15 min
- PostgreSQL gratuit : 90 jours puis payant

Pour portfolio, Railway est mieux car pas de sleep.
