# ============================================
# Dockerfile pour Railway/Render/Heroku
# ============================================

# Etape 1 : Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copier les fichiers csproj et restaurer les dependances
COPY *.csproj ./
RUN dotnet restore

# Copier tout le code source
COPY . ./

# Publier en mode Release
RUN dotnet publish -c Release -o /app/publish --no-restore

# Etape 2 : Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copier le build depuis l'etape precedente
COPY --from=build /app/publish .

# Railway injecte automatiquement la variable PORT
# ASP.NET Core 8+ utilise ASPNETCORE_URLS pour definir le port
ENV ASPNETCORE_URLS=http://+:$PORT
ENV ASPNETCORE_ENVIRONMENT=Production

# Lancer l'application
ENTRYPOINT ["dotnet", "ShopMax.dll"]
