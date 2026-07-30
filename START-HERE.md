# Scripts .bat - Demarrage rapide

## Pour publier sur GitHub (TON CAS)

```
1. Double-clic sur :  setup-github.bat
   -> Repondre aux questions (username, URL du repo, nom, email)
   -> Ne le faire qu'une seule fois

2. Double-clic sur :  publish-github.bat
   -> Le projet est envoye sur GitHub
   -> A faire a chaque modification
```

## Ordre d'utilisation

| Quand | Quel script | Frequence |
|-------|-------------|-----------|
| Premiere fois | `setup-github.bat` | 1 seule fois |
| Modifications | `publish-github.bat` | A chaque update |
| Developper | `start-dev.bat` | A chaque session dev |
| Installer deps | `install.bat` | 1 seule fois |
| Creer BDD | `migrate-simple.bat` | 1 seule fois |
| Tests | `test.bat` | Avant chaque commit |
| Build prod | `build.bat` | Avant deploy |
| Aide | `shopmax.bat` | Menu complet |

## Structure des scripts

```
shopmax/
+- setup-github.bat       <-- NOUVEAU : config GitHub (1 fois)
+- publish-github.bat     <-- NOUVEAU : publier sur GitHub
+- shopmax.bat            <-- Menu principal
+- install.bat            <-- Installation
+- start-dev.bat          <-- Dev local
+- test.bat               <-- Tests
+- build.bat              <-- Build prod
+- migrate-simple.bat     <-- BDD
+- setup-env.bat          <-- Variables d'env
+- ... (autres scripts utilitaires)
```

## Premier demarrage (dans l'ordre)

```
1. install.bat           (installe Node + .NET deps)
2. setup-env.bat         (configure .env)
3. migrate-simple.bat    (cree la BDD)
4. start-dev.bat         (lance backend + frontend)
5. setup-github.bat      (GitHub : username, repo URL)
6. publish-github.bat    (premier push)
```

## Aide

Si un script ne marche pas, lance `help.bat` pour la liste complete.
