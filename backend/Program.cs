using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using ShopMax.Data;
using ShopMax.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// =====================================================
// Services
// =====================================================

// PostgreSQL via Entity Framework Core
var pgConn = builder.Configuration.GetConnectionString("PostgreSQL");
if (!string.IsNullOrEmpty(pgConn))
{
    try
    {
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(pgConn));
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ATTENTION] PostgreSQL non configure : {ex.Message}");
    }
}
else
{
    Console.WriteLine("[ATTENTION] ConnectionStrings:PostgreSQL absent.");
}

// Redis (optionnel)
var redisConn = builder.Configuration.GetConnectionString("Redis");
if (!string.IsNullOrEmpty(redisConn))
{
    try
    {
        builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
        {
            var config = ConfigurationOptions.Parse(redisConn);
            config.AbortOnConnectFail = false;
            return ConnectionMultiplexer.Connect(config);
        });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ATTENTION] Redis non disponible : {ex.Message}");
    }
}

// Authentification JWT (uniquement si cle valide)
var jwtKey = builder.Configuration["Jwt:Key"];
if (!string.IsNullOrEmpty(jwtKey) && jwtKey.Length >= 32 && !jwtKey.StartsWith("CHANGEME"))
{
    try
    {
        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ATTENTION] JWT non configure : {ex.Message}");
    }
}
else
{
    Console.WriteLine("[ATTENTION] Jwt:Key invalide ou trop court, auth desactivee.");
}

// OAuth2 Google (uniquement si cles valides)
// IMPORTANT : on n'utilise PAS le handler Google natif d'ASP.NET Core
// car il tente de recuperer automatiquement la metadata depuis Google,
// ce qui peut planter si pas d'internet ou mauvaise config.
// On utilise notre propre service GoogleAuthService a la place.
var googleClientId = builder.Configuration["Auth:Google:ClientId"];
var googleClientSecret = builder.Configuration["Auth:Google:ClientSecret"];
bool googleEnabled = !string.IsNullOrEmpty(googleClientId)
    && !googleClientId.StartsWith("votre-")
    && !string.IsNullOrEmpty(googleClientSecret)
    && !googleClientSecret.StartsWith("votre-")
    && googleClientId.Contains(".apps.googleusercontent.com");

if (googleEnabled)
{
    Console.WriteLine("[OK] Google OAuth configure (utilise notre service custom)");
}
else
{
    Console.WriteLine("[INFO] Google OAuth non configure (placeholders detectes)");
}

var facebookAppId = builder.Configuration["Auth:Facebook:AppId"];
var facebookAppSecret = builder.Configuration["Auth:Facebook:AppSecret"];
bool facebookEnabled = !string.IsNullOrEmpty(facebookAppId) && !facebookAppId.StartsWith("votre-");
if (facebookEnabled)
{
    // Pareil, on n'utilise pas le handler natif
    Console.WriteLine("[OK] Facebook OAuth configure (utilise notre service custom)");
}

// Services metier
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<SeedService>();

// HttpClient pour les services qui en ont besoin
// AddHttpClient enregistre automatiquement le service avec HttpClient injecte
builder.Services.AddHttpClient<IPaymentService, PaymentService>();
builder.Services.AddHttpClient<IGoogleAuthService, GoogleAuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "https://shopmax.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// =====================================================
// Middleware
// =====================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

// Auth uniquement si configure
try
{
    app.UseAuthentication();
    app.UseAuthorization();
}
catch
{
    // Ignore si pas de JWT configure
}

app.MapControllers();

// Seed au demarrage (avec tolerance d'erreurs)
if (app.Environment.IsDevelopment())
{
    try
    {
        using (var scope = app.Services.CreateScope())
        {
            var seeder = scope.ServiceProvider.GetRequiredService<SeedService>();
            await seeder.SeedAsync();
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ATTENTION] Seed ignore : {ex.Message}");
    }
}

Console.WriteLine();
Console.WriteLine("============================================");
Console.WriteLine("   ShopMax Backend PRET !");
Console.WriteLine("   URL: http://localhost:5000");
Console.WriteLine("   Swagger: http://localhost:5000/swagger");
Console.WriteLine("============================================");
Console.WriteLine();

app.Run();
