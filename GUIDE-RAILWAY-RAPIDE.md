# Guide Rapide Railway (5 min)

## Etape 1 : Compte Railway (1 min)

1. Va sur https://railway.app
2. **Login with GitHub**
3. Autorise

## Etape 2 : Deployer (2 min)

1. Dashboard Railway > **+ New Project**
2. **Deploy from GitHub repo**
3. Selectionne `MIckaila001/shopmax-ecommerce`
4. Railway detecte le Dockerfile et build
5. Clique sur le service cree

## Etape 3 : Ajouter PostgreSQL (1 min)

1. Sur le projet, **+ New** > **Database** > **PostgreSQL**
2. Railway cree la BDD automatiquement
3. Sur le service PostgreSQL > onglet **Variables** > copie `DATABASE_URL`

## Etape 4 : Variables d'environnement (1 min)

Sur le **service backend** (PAS la BDD) > **Variables** > **+ New Variable** :

| Variable | Valeur |
|----------|--------|
| `ConnectionStrings__DefaultConnection` | `Host=xxx.railway.app;Port=5432;Database=railway;Username=postgres;Password=xxx` |
| `Jwt__Key` | `ShopMax2025SecretKey_SuperLongForSecurity_ChangeInProduction` |
| `Jwt__Issuer` | `ShopMax` |
| `Jwt__Audience` | `ShopMaxUsers` |
| `ALLOWED_ORIGINS` | `https://ton-site.vercel.app` |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

> Le `__` (double underscore) dans les noms de variables = hierarchie dans .NET (ConnectionStrings:DefaultConnection)

## Etape 5 : Generer le domaine (30 sec)

Sur le service backend > **Settings** > **Networking** > **Generate Domain**

Tu obtiens : `https://shopmax-backend-production.up.railway.app`

## Etape 6 : Tester

Ouvre : `https://shopmax-backend-production.up.railway.app/swagger`

Si tu vois la doc API, c'est bon !

## Etape 7 : Connecter Vercel

Sur Vercel > ton projet > Settings > Environment Variables :

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://shopmax-backend-production.up.railway.app/api` |

Redeploy Vercel. C'est fait !

## Resultat

```
GitHub (code)
   |
   v
Railway (Backend + PostgreSQL)  <-- API publique
   ^
   |
Vercel (Frontend)  <-- ton site accessible
```

**Cout** : gratuit jusqu'a 5$/mois de consommation (largement suffisant pour portfolio)

## Troubleshooting

### Erreur "Build failed"
- Verifie que le Dockerfile est bien a `backend/Dockerfile`
- Va dans l'onglet "Build Logs" sur Railway

### Erreur "Database connection"
- Verifie la connection string
- Format : `Host=...;Port=5432;Database=railway;Username=postgres;Password=...`

### Erreur CORS depuis Vercel
- Ajoute `ALLOWED_ORIGINS` avec ton URL Vercel
- Format : `https://shopmax-ecommerce.vercel.app`

### Les migrations ne se font pas
- Le seed s'execute automatiquement maintenant (dans Program.cs)
- Si probleme, ouvre la console Railway et execute : `dotnet ef database update`

### "Port already in use"
- Railway injecte automatiquement le port via `PORT` env
- C'est gere dans le code (Program.cs)
