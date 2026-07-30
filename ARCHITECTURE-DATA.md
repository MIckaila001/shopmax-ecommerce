# Comment les produits de la BDD arrivent sur ton site

## Architecture en 3 couches

```
┌─────────────────────────────────────────────────────────────┐
│  FRONTEND (Vercel)                                          │
│  https://shopmax-ecommerce.vercel.app                       │
│                                                              │
│  - Next.js 15                                               │
│  - Pages React                                              │
│  - Fait des appels API via fetch()                          │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ HTTP/HTTPS
                       │ (JSON over REST)
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  BACKEND (Railway)                                          │
│  https://shopmax-backend.up.railway.app                     │
│                                                              │
│  - ASP.NET Core 10                                          │
│  - Controllers REST                                         │
│  - Logique métier                                           │
│  - Authentification JWT                                     │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       │ SQL (Entity Framework Core)
                       │ (TCP port 5432)
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  BASE DE DONNEES (Railway PostgreSQL)                       │
│  Interne - pas accessible publiquement                      │
│                                                              │
│  - Tables : Products, Categories, Users, Orders...         │
│  - Données seedées au démarrage                             │
│  - Modifiable via API ou outils admin                       │
└─────────────────────────────────────────────────────────────┘
```

## Flux complet pour afficher un produit

### 1. L'utilisateur visite la page

```
Utilisateur va sur https://shopmax-ecommerce.vercel.app/boutique
```

### 2. Le frontend fait un appel API

```typescript
// Dans frontend/app/boutique/page.tsx
const res = await fetch('https://shopmax-backend.up.railway.app/api/products');
const products = await res.json();
```

### 3. Le backend reçoit la requête

```csharp
// Dans backend/Controllers/ProductsController.cs
[HttpGet]
public async Task<IActionResult> GetProducts()
{
    var products = await _context.Products
        .Include(p => p.Category)
        .ToListAsync();
    return Ok(products);
}
```

### 4. Entity Framework interroge PostgreSQL

```sql
-- Genere automatiquement par EF Core
SELECT p.*, c.* 
FROM Products p 
LEFT JOIN Categories c ON p.CategoryId = c.Id
```

### 5. PostgreSQL retourne les données

```json
[
  {
    "id": 1,
    "name": "iPhone 15 Pro 256GB",
    "price": 1499000,
    "imageUrl": "https://...",
    "category": { "name": "Électronique" }
  },
  ...
]
```

### 6. Le backend serialise en JSON et renvoie

```json
[
  {
    "id": 1,
    "name": "iPhone 15 Pro 256GB",
    "price": 1499000,
    "oldPrice": 1799000,
    "imageUrl": "https://...",
    "categoryName": "Électronique"
  }
]
```

### 7. Le frontend affiche les produits

```tsx
// Dans frontend/app/boutique/page.tsx
return (
  <div>
    {products.map(product => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);
```

## Configuration cote frontend

Le frontend utilise une variable d'environnement pour savoir ou est le backend :

```env
# frontend/.env.local (en dev) ou Vercel (en prod)
NEXT_PUBLIC_API_URL=https://shopmax-backend.up.railway.app/api
```

Cette variable est injectee dans le code au build :

```typescript
// frontend/lib/api-client.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const res = await fetch(`${API_URL}/products`);
```

## Schema de la BDD - Table Products

```sql
CREATE TABLE Products (
    "Id" SERIAL PRIMARY KEY,
    "Name" VARCHAR(200) NOT NULL,
    "Description" TEXT,
    "Price" DECIMAL(18,2) NOT NULL,
    "OldPrice" DECIMAL(18,2),
    "Stock" INTEGER NOT NULL DEFAULT 0,
    "ImageUrl" VARCHAR(500),
    "Brand" VARCHAR(100),
    "Color" VARCHAR(50),
    "CategoryId" INTEGER REFERENCES Categories("Id"),
    "Rating" DECIMAL(3,2) DEFAULT 0,
    "ReviewsCount" INTEGER DEFAULT 0,
    "IsFeatured" BOOLEAN DEFAULT FALSE,
    "CreatedAt" TIMESTAMP DEFAULT NOW()
);

-- Index pour la recherche
CREATE INDEX idx_products_category ON Products("CategoryId");
CREATE INDEX idx_products_featured ON Products("IsFeatured");
```

## Les 24 produits affiches sur la home

Tu as actuellement **deux sources** de produits :

### Source 1 : Mock data (en dur dans le code)

**Fichier** : `frontend/app/page.tsx`

```typescript
const PRODUCTS = [
  { id: 1, name: "iPhone 15 Pro Max 256GB", ... },
  { id: 2, name: "Samsung Galaxy S24 Ultra", ... },
  // ... 22 autres
];
```

**Avantage** : Marche meme si le backend est down
**Inconvenient** : Pas dynamique, faut modifier le code pour ajouter un produit

### Source 2 : API backend (quand deploye)

**Fichier** : `backend/Services/SeedService.cs`

```csharp
// Genere 10+ produits au demarrage
new Product
{
    Name = "iPhone 15 Pro 128 Go - Titane Noir",
    Price = 1499000m,
    OldPrice = 1799000m,
    // ...
}
```

**Avantage** : Dynamique, on peut ajouter des produits via API
**Inconvenient** : Necessite que le backend soit deploye et accessible

## Comment basculer sur la BDD

### Option A : Modifier la home pour utiliser l'API

Au lieu d'utiliser le mock data, on fait des appels API :

```typescript
// frontend/app/page.tsx
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/products?featured=true`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        // Fallback sur les mocks
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  // ... affichage
}
```

### Option B : Garder les mocks + avoir l'API en plus

Les deux fonctionnent en parallele :
- **Mock data** : toujours visible, rapide
- **API** : pour les fonctionnalites avancees (panier, compte, etc.)

## Exemple concret : le panier

Quand l'utilisateur ajoute un produit au panier :

```
1. Frontend : "Ajouter au panier" → POST /api/cart/items
2. Backend : Sauvegarde dans la BDD (table CartItems)
3. Backend : Retourne confirmation JSON
4. Frontend : Met a jour l'UI
```

```sql
-- Ce qui se passe dans la BDD
INSERT INTO "CartItems" ("UserId", "ProductId", "Quantity", "CreatedAt")
VALUES (1, 5, 2, NOW());
```

## Endpoints API disponibles

| Endpoint | Methode | Description |
|----------|---------|-------------|
| `/api/products` | GET | Liste tous les produits |
| `/api/products/{id}` | GET | Un produit par ID |
| `/api/products/featured` | GET | Produits vedettes |
| `/api/categories` | GET | Toutes les categories |
| `/api/promotions/active` | GET | Promotions actives |
| `/api/promotions/flash-sale` | GET | Ventes flash |
| `/api/auth/login` | POST | Connexion |
| `/api/auth/register` | POST | Inscription |
| `/api/orders` | GET/POST | Commandes |
| `/api/orders/user/{id}` | GET | Commandes d'un user |

## Verifier que ca marche

### Test 1 : API directement
```bash
curl https://shopmax-backend.up.railway.app/api/products
```

**Reponse** : JSON avec les produits seedes

### Test 2 : Depuis le navigateur
Ouvre : `https://shopmax-backend.up.railway.app/swagger`

**Tu vois** : Documentation interactive de tous les endpoints

### Test 3 : Health check avec stats
```bash
curl https://shopmax-backend.up.railway.app/health/detailed
```

**Reponse** :
```json
{
  "status": "healthy",
  "database": "connected",
  "products": 10,
  "users": 1
}
```

Tu vois **10 produits** et **1 user** (l'admin).

## Comment ajouter un produit

### Option 1 : Via l'API (programmatiquement)

```bash
curl -X POST https://shopmax-backend.up.railway.app/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TON_JWT_TOKEN" \
  -d '{
    "name": "Nouveau Produit",
    "price": 50000,
    "stock": 100,
    "categoryId": 1,
    "imageUrl": "https://..."
  }'
```

### Option 2 : Via la BDD directement (avec Railway CLI)

```bash
railway run psql $DATABASE_URL
```

Puis :
```sql
INSERT INTO Products ("Name", "Price", "Stock", "CategoryId")
VALUES ('Mon Produit', 50000, 100, 1);
```

### Option 3 : Modifier le seed (pour les demos)

Tu modifies `backend/Services/SeedService.cs` et tu push sur GitHub. Railway redéploie et re-seed automatiquement.

## Resume

1. **BDD PostgreSQL** contient les données (produits, users, commandes, etc.)
2. **Backend ASP.NET** expose une API REST qui lit/écrit dans la BDD
3. **Frontend Next.js** fait des appels `fetch()` vers l'API
4. **Les donnees circulent** en JSON via HTTPS
5. **Tout est securise** : JWT pour l'auth, HTTPS pour le transport

C'est une architecture **classique et professionnelle** utilisee par la majorite des sites web modernes ! 🎉
