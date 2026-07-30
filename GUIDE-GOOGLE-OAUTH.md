# Guide Google OAuth - ShopMax

## Etat actuel

**Google OAuth est volontairement desactive cote backend** (le bouton reste visible cote UI avec un badge "Bientot").

### Pourquoi ?

Le flow OAuth Google posait un probleme technique : meme apres l'echange de code reussi (HTTP 200), la deserialisation de la reponse JSON echouait systematiquement. Le token etait recu par Google mais le backend ne parvenait pas a le lire.

### Ce qui a ete fait

1. **Diagnostic** : inspection des logs backend, ajout de `[JsonPropertyName]` sur les DTOs
2. **Tests** : le token est bien recu cote Google mais le C# ne le parse pas
3. **Solution choisie** : desactiver cote UI pour permettre aux utilisateurs de continuer a utiliser le site via email/mot de passe

## Pour reactiver Google OAuth plus tard

### 1. Verifier la configuration Google Cloud Console

1. Allez sur https://console.cloud.google.com
2. Projet "ShopMax" (ou creez-le)
3. Activez l'API "Google+ API" ou "People API"
4. **OAuth consent screen** :
   - Type : External
   - Test users : ajoutez les emails de test (ex: boubaismaila445@gmail.com)
5. **Credentials** > Create OAuth Client ID :
   - Type : Web application
   - Authorized redirect URIs : `http://localhost:5000/api/auth/google/callback`
   - Notez le Client ID et Client Secret

### 2. Configurer le backend

Dans `backend/appsettings.Development.json` (NE PAS commit ce fichier) :
```json
{
  "GoogleAuth": {
    "ClientId": "VOTRE_CLIENT_ID.apps.googleusercontent.com",
    "ClientSecret": "VOTRE_CLIENT_SECRET",
    "RedirectUrl": "http://localhost:5000/api/auth/google/callback"
  }
}
```

Ou en variables d'environnement :
```
GoogleAuth__ClientId=VOTRE_CLIENT_ID
GoogleAuth__ClientSecret=VOTRE_CLIENT_SECRET
GoogleAuth__RedirectUrl=http://localhost:5000/api/auth/google/callback
```

### 3. Deboguer le probleme de deserialisation

Le bug semble etre lie a la deserialisation JSON cote C#. Voici comment debugger :

```csharp
// Dans GoogleAuthService.cs, avant le try/catch :
Console.WriteLine($"[Google OAuth] Reponse brute : {await response.Content.ReadAsStringAsync()}");

// Verifier que [JsonPropertyName] est bien present :
public class GoogleTokenResponse
{
    [JsonPropertyName("access_token")]
    public string? AccessToken { get; set; }

    [JsonPropertyName("refresh_token")]
    public string? RefreshToken { get; set; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }

    [JsonPropertyName("token_type")]
    public string? TokenType { get; set; }

    [JsonPropertyName("id_token")]
    public string? IdToken { get; set; }
}
```

### 4. Reactiver cote frontend

Dans `frontend/app/connexion/page.tsx`, remplacer :
```tsx
// AVANT (actuel) :
onClick={() => handleOAuth("google")}
disabled={true}

// APRES (quand ca marche) :
onClick={() => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google/login?redirect=${encodeURIComponent("/compte")}`;
}}
```

Et supprimer le badge "Bientot".

## Architecture OAuth (pour reference)

```
Utilisateur
  -> Clique "Continuer avec Google"
  -> Frontend redirige vers /api/auth/google/login (backend)
  -> Backend redirige vers Google OAuth
  -> Utilisateur autorise
  -> Google redirige vers /api/auth/google/callback?code=XXX&state=YYY
  -> Backend echange le code contre un access_token
  -> Backend recupere les infos user via /oauth2/v3/userinfo
  -> Backend cree/met a jour l'utilisateur en BDD
  -> Backend genere un JWT
  -> Backend redirige vers /auth/callback?token=JWT
  -> Frontend stocke le JWT et redirige vers /compte
```

## En attendant : alternatives

L'authentification email/mot de passe fonctionne parfaitement et est totalement securisee grace a :
- **BCrypt** pour le hash des mots de passe
- **JWT** signe avec un secret unique
- **HTTPS** en production
- **Rate limiting** sur les endpoints sensibles

C'est suffisant pour un portfolio et conforme aux standards de l'industrie.
