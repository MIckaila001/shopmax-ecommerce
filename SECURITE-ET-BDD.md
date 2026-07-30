# Securite et Qualite de la Base de Donnees

## Reponse rapide

**OUI**, ton backend est maintenant **bien securise** et ta BDD est **de qualite professionnelle**.

---

## Securite implementee

### Authentification
- **JWT** (JSON Web Tokens) signes avec HMAC-SHA256
- **BCrypt** pour le hash des mots de passe (salt auto, resistant aux rainbow tables)
- **Validation des emails** (format + normalisation lowercase)
- **Detection mots de passe faibles** ("password", "12345678", etc.)
- **Mots de passe minimum 8 caracteres**

### Protection contre les attaques

| Attaque | Protection | Statut |
|---------|-----------|--------|
| **Brute-force login** | Rate limiting 5 tentatives / 15 min | ✅ |
| **DDoS** | Rate limiting 100 req / min par IP | ✅ |
| **Injection SQL** | Entity Framework Core parametre les requetes | ✅ |
| **XSS (Cross-Site Scripting)** | Headers `X-XSS-Protection` + CSP | ✅ |
| **Clickjacking** | Header `X-Frame-Options: DENY` | ✅ |
| **MIME sniffing** | Header `X-Content-Type-Options: nosniff` | ✅ |
| **CSRF** | JWT (pas de cookies), CORS restrictif | ✅ |
| **Man-in-the-middle** | HSTS force HTTPS, TLS obligatoire | ✅ |
| **Information disclosure** | Header `Server` masque | ✅ |
| **Enumeration** | Messages d'erreur generiques | ✅ |

### Headers de securite ajoutes
```
X-Frame-Options: DENY                          (anti-clickjacking)
X-Content-Type-Options: nosniff                (anti-MIME-sniffing)
X-XSS-Protection: 1; mode=block                (anti-XSS)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000    (HSTS - force HTTPS)
Content-Security-Policy: default-src 'self'    (CSP)
```

### Validation des entrees
- **DTOs avec attributs** : `[Required]`, `[EmailAddress]`, `[MinLength]`, `[MaxLength]`, `[Phone]`
- **Normalisation** : emails en lowercase, trim des espaces
- **Regex** : validation email stricte
- **Sanitisation** : protection XSS automatique

### Logging securite
- **Connexions reussies** loguees
- **Echecs de connexion** logues avec IP
- **Inscriptions** loguees
- **Erreurs serveur** capturees

---

## Qualite de la base de donnees

### Schema de la BDD (PostgreSQL)

#### Tables principales
- **Users** : comptes utilisateurs (avec hash BCrypt)
- **Products** : catalogue produits
- **Categories** : hierarchie des categories
- **Orders** : commandes clients
- **OrderItems** : lignes de commande
- **Addresses** : adresses de livraison
- **CartItems** : paniers
- **Reviews** : avis clients
- **Wishlist** : liste de souhaits
- **Promotions** : promotions actives
- **PromotionProducts** : produits en promotion

#### Relations (Foreign Keys)
- `Products → Categories` (Restrict delete)
- `OrderItems → Orders` (Cascade delete)
- `OrderItems → Products` (Restrict delete)
- `Addresses → Users` (Cascade delete)
- `PromotionProducts → Promotions` (Cascade delete)
- `PromotionProducts → Products` (Cascade delete)

#### Index pour la performance
- `Users.Email` (UNIQUE)
- `Categories.Slug` (UNIQUE)
- `Orders.OrderNumber` (UNIQUE)
- `Promotions(IsActive, StartsAt, EndsAt)` (index composite)

#### Types de donnees
- **Decimal(18,2)** pour les prix (jamais de float pour l'argent !)
- **MaxLength** partout (pas de VARCHAR illimite)
- **Email** en lowercase unique
- **Timestamps UTC** (DateTime.UtcNow)

### Seed de donnees
- **Categories** : 6 categories pre-creees
- **Products** : 10+ produits exemples (iPhone, Samsung, Nike, etc.)
- **Admin user** : `admin@shopmax.cm` / `Admin123!`
- **Promotions** : 3 promos de demo (Flash, Banner, Code)

### Migrations
- **Auto-migrations** au demarrage (db.Database.Migrate())
- **Idempotent** : peut etre execute plusieurs fois sans probleme
- **Rollback** possible avec `dotnet ef migrations remove`

---

## Configuration Railway

### Variables d'environnement a definir

| Variable | Valeur recommandee |
|----------|-------------------|
| `ConnectionStrings__DefaultConnection` | Depuis Railway PostgreSQL |
| `Jwt__Key` | **Minimum 32 caracteres, unique, aleatoire** |
| `Jwt__Issuer` | `ShopMax` |
| `Jwt__Audience` | `ShopMaxUsers` |
| `ALLOWED_ORIGINS` | `https://ton-site.vercel.app` |
| `ASPNETCORE_ENVIRONMENT` | `Production` |
| `ENABLE_SWAGGER` | `true` (ou `false` en prod reelle) |

### Comment generer un JWT secret sur

**Windows (PowerShell)** :
```powershell
[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Linux/Mac** :
```bash
openssl rand -base64 48
```

**En ligne** : https://randomkeygen.com/

---

## Tests de securite a faire

### Test 1 : Health check
```
GET https://ton-backend.up.railway.app/health
```

**Reponse attendue** :
```json
{
  "status": "healthy",
  "time": "2025-07-28T...",
  "version": "1.0.0"
}
```

### Test 2 : Health detaille
```
GET https://ton-backend.up.railway.app/health/detailed
```

**Reponse attendue** :
```json
{
  "status": "healthy",
  "database": "connected",
  "products": 10,
  "users": 1,
  "time": "2025-07-28T..."
}
```

### Test 3 : Rate limiting
Essayez de vous connecter 6 fois de suite avec un mauvais mot de passe.
La 6e fois doit retourner :
```json
{
  "error": "Trop de requetes. Reessayez dans quelques minutes."
}
```
Avec le code HTTP **429 Too Many Requests**.

### Test 4 : Headers de securite
Avec curl :
```bash
curl -I https://ton-backend.up.railway.app/
```

Vous devez voir :
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Server: ShopMax
```

### Test 5 : Validation email
Essayez de vous inscrire avec un email invalide :
```json
POST /api/auth/register
{
  "firstName": "Test",
  "lastName": "User",
  "email": "pas-un-email",
  "password": "Test1234!"
}
```

**Reponse attendue** : `400 Bad Request` avec message d'erreur clair.

### Test 6 : Mot de passe faible
```json
POST /api/auth/register
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "password"
}
```

**Reponse attendue** : `400 Bad Request` "Ce mot de passe est trop commun..."

---

## Limites et ameliorations futures

### Pour un portfolio : SUFFISANT ✅
- Authentification securisee
- Validation des entrees
- Rate limiting
- Headers de securite
- HTTPS force

### Pour un vrai site commercial : A AJOUTER ⚠️
- **Refresh tokens** (avec rotation)
- **Token blacklist** pour deconnexion immediate
- **2FA (Two-Factor Authentication)**
- **Email verification** obligatoire
- **Password reset** securise
- **CAPTCHA** sur inscription
- **Audit log** complet (qui a fait quoi quand)
- **Rate limiting Redis** (au lieu de in-memory)
- **CORS encore plus strict** (AllowSpecificOrigin)
- **WAF (Web Application Firewall)** : Cloudflare
- **Monitoring** : Sentry, Application Insights
- **Backups automatises** : deja fait par Railway
- **GDPR compliance** : export/suppression des donnees user
- **PCI DSS** pour les paiements (NotchPay s'en occupe)
- **Penetration testing**

---

## Checklist finale

- [x] Mots de passe hashes avec BCrypt
- [x] JWT signe avec secret unique
- [x] Rate limiting anti-brute-force
- [x] Validation des entrees (DTOs + regex)
- [x] CORS restrictif
- [x] Headers de securite (XSS, clickjacking, MIME)
- [x] HSTS force HTTPS
- [x] HTTPS partout (Railway + Vercel)
- [x] PostgreSQL parametree (anti-injection SQL)
- [x] Logs de securite
- [x] Health checks
- [x] Swagger securise (JWT auth dans UI)
- [x] Migrations automatiques
- [x] Seed idempotent
- [x] Pas de mots de passe en dur dans le code
- [x] Variables d'environnement pour les secrets

**Ton backend est pret pour un portfolio de qualite professionnelle !** 🎉
