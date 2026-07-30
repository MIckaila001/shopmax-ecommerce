@echo off
chcp 65001 >nul
setlocal
title ShopMax - Preparation Railway

cd /d "%~dp0"

echo ============================================================
echo   ShopMax - Preparation deploiement Railway
echo ============================================================
echo.
echo Ce script verifie que ton projet est pret pour Railway.
echo.

cd backend

echo Verification du Dockerfile...
if not exist "Dockerfile" (
    echo ERREUR : Dockerfile manquant dans backend/
    pause >nul
    exit /b 1
)
echo [OK] Dockerfile present

echo.
echo Verification de appsettings.json...
if not exist "appsettings.json" (
    echo ERREUR : appsettings.json manquant
    pause >nul
    exit /b 1
)
echo [OK] appsettings.json present

echo.
echo Verification de Program.cs...
if not exist "Program.cs" (
    echo ERREUR : Program.cs manquant
    pause >nul
    exit /b 1
)
echo [OK] Program.cs present

echo.
echo Verification de la configuration Railway...
if not exist "railway.json" (
    echo ERREUR : railway.json manquant
    pause >nul
    exit /b 1
)
echo [OK] railway.json present

echo.
echo Verification du .dockerignore...
if not exist ".dockerignore" (
    echo ATTENTION : .dockerignore manquant (recommande)
) else (
    echo [OK] .dockerignore present
)

echo.
echo Verification du fichier projet...
if not exist "ShopMax.csproj" (
    echo ERREUR : ShopMax.csproj manquant
    pause >nul
    exit /b 1
)
echo [OK] ShopMax.csproj present

echo.
echo ============================================================
echo   Tout est pret !
echo ============================================================
echo.
echo Prochaines etapes :
echo.
echo 1. Commit + push les changements :
echo    git add .
echo    git commit -m "Add Railway deployment config"
echo    git push
echo.
echo 2. Va sur https://railway.app
echo 3. Login with GitHub
echo 4. New Project > Deploy from GitHub repo
echo 5. Selectionne MIckaila001/shopmax-ecommerce
echo 6. Railway detecte le Dockerfile et build
echo.
echo 7. Ajoute une base PostgreSQL : + New > Database > PostgreSQL
echo.
echo 8. Sur le service backend, configure ces variables :
echo    ConnectionStrings__DefaultConnection = (copie depuis PostgreSQL)
echo    Jwt__Key = ShopMax2025SecretKey_SuperLongForSecurity_ChangeIt
echo    Jwt__Issuer = ShopMax
echo    Jwt__Audience = ShopMaxUsers
echo    ALLOWED_ORIGINS = https://ton-site.vercel.app
echo.
echo 9. Genere le domaine : Settings > Networking > Generate Domain
echo.
echo 10. Sur Vercel, ajoute la variable :
echo     NEXT_PUBLIC_API_URL = https://ton-backend.up.railway.app/api
echo.
echo 11. Redeploy Vercel
echo.
echo Ouvre GUIDE-RAILWAY-RAPIDE.md pour le detail !
echo.
pause >nul
endlocal
