using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;
using ShopMax.Data;
using ShopMax.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// =====================================================
// PORT (Railway, Render, Heroku injectent PORT)
// =====================================================
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// =====================================================
// FORWARDED HEADERS (pour HTTPS derriere un proxy)
// =====================================================
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// =====================================================
// SERVICES
// =====================================================

// PostgreSQL via Entity Framework Core
var pgConn = builder.Configuration.GetConnectionString("PostgreSQL")
          ?? builder.Configuration.GetConnectionString("DefaultConnection");

if (!string.IsNullOrEmpty(pgConn))
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseNpgsql(pgConn));
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

// Authentification JWT
var jwtKey = builder.Configuration["Jwt:Key"];
if (!string.IsNullOrEmpty(jwtKey) && jwtKey.Length >= 32 && !jwtKey.StartsWith("CHANGEME"))
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
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
                ClockSkew = TimeSpan.FromMinutes(5) // Tolerance pour la synchronisation d'horloge
            };
        });
}

// Services metier
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<SeedService>();

// HttpClient pour les services
builder.Services.AddHttpClient<IPaymentService, PaymentService>();
builder.Services.AddHttpClient<IGoogleAuthService, GoogleAuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();

// =====================================================
// RATE LIMITING (anti-DDoS, anti-brute-force)
// =====================================================
builder.Services.AddRateLimiter(options =>
{
    // Rate limit global par IP
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter(ip, _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 100, // 100 requetes
            Window = TimeSpan.FromMinutes(1), // par minute
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            QueueLimit = 10
        });
    });

    // Rate limit strict pour l'auth (anti-brute-force)
    options.AddPolicy("auth", httpContext =>
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        return RateLimitPartition.GetFixedWindowLimiter($"auth-{ip}", _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 5, // 5 tentatives
            Window = TimeSpan.FromMinutes(15), // par 15 minutes
            QueueLimit = 0
        });
    });

    options.OnRejected = async (context, cancellationToken) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        await context.HttpContext.Response.WriteAsJsonAsync(new
        {
            error = "Trop de requetes. Reessayez dans quelques minutes."
        }, cancellationToken);
    };
});

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "ShopMax API",
        Version = "v1",
        Description = "API e-commerce pour ShopMax Cameroun"
    });

    // Ajouter le support JWT dans Swagger
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// CORS - Restreint et configurable
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        var allowedOrigins = Environment.GetEnvironmentVariable("ALLOWED_ORIGINS")?
            .Split(',', StringSplitOptions.RemoveEmptyEntries)
            .Select(o => o.Trim())
            .ToArray() ?? new[] { "http://localhost:3000" };

        var vercelUrl = Environment.GetEnvironmentVariable("VERCEL_URL");
        var originsList = allowedOrigins.ToList();
        if (!string.IsNullOrEmpty(vercelUrl))
            originsList.Add($"https://{vercelUrl}");

        policy.WithOrigins(originsList.ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("X-Total-Count", "X-Page-Count");
    });
});

var app = builder.Build();

// =====================================================
// MIDDLEWARES DE SECURITE (dans le bon ordre)
// =====================================================

// 1. Forwarded headers (derriere un proxy)
app.UseForwardedHeaders();

// 2. Headers de securite (anti-XSS, anti-clickjacking, etc.)
app.Use(async (context, next) =>
{
    var headers = context.Response.Headers;

    // Anti-clickjacking
    headers["X-Frame-Options"] = "DENY";

    // Anti-XSS
    headers["X-Content-Type-Options"] = "nosniff";
    headers["X-XSS-Protection"] = "1; mode=block";

    // Referrer policy
    headers["Referrer-Policy"] = "strict-origin-when-cross-origin";

    // Permissions policy (desactive les features inutiles)
    headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()";

    // Content Security Policy (pour Swagger)
    if (context.Request.Path.StartsWithSegments("/swagger"))
    {
        headers["Content-Security-Policy"] = "default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' data:;";
    }
    else
    {
        headers["Content-Security-Policy"] = "default-src 'self'";
    }

    // HSTS - Force HTTPS (1 an)
    if (!app.Environment.IsDevelopment())
    {
        headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    }

    // Masquer le serveur
    headers.Remove("Server");
    headers["Server"] = "ShopMax";

    await next();
});

// 3. Rate limiting
app.UseRateLimiter();

// 4. Swagger (accessible partout pour debug mais peut etre restreint en prod)
if (app.Environment.IsDevelopment() || Environment.GetEnvironmentVariable("ENABLE_SWAGGER") == "true")
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ShopMax API V1");
        c.DocumentTitle = "ShopMax API - Documentation";
    });
}

// 5. CORS
app.UseCors("AllowFrontend");

// 6. Auth
app.UseAuthentication();
app.UseAuthorization();

// 7. Routes
app.MapControllers();

// =====================================================
// ENDPOINTS UTILITAIRES
// =====================================================

// Health check simple
app.MapGet("/health", () => Results.Ok(new
{
    status = "healthy",
    time = DateTime.UtcNow,
    version = "1.0.0"
})).AllowAnonymous();

// Health check detaille (avec verif BDD)
app.MapGet("/health/detailed", async (AppDbContext db) =>
{
    try
    {
        var canConnect = await db.Database.CanConnectAsync();
        var productCount = canConnect ? await db.Products.CountAsync() : 0;
        var userCount = canConnect ? await db.Users.CountAsync() : 0;

        return Results.Ok(new
        {
            status = canConnect ? "healthy" : "degraded",
            database = canConnect ? "connected" : "disconnected",
            products = productCount,
            users = userCount,
            time = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        return Results.Problem(
            detail: ex.Message,
            statusCode: 503,
            title: "Service degraded"
        );
    }
}).AllowAnonymous();

// Page d'accueil
app.MapGet("/", () => Results.Ok(new
{
    name = "ShopMax API",
    version = "1.0.0",
    docs = "/swagger",
    health = "/health"
})).AllowAnonymous();

// =====================================================
// INITIALISATION (migrations + seed)
// =====================================================
if (!app.Environment.IsEnvironment("Testing"))
{
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Database.Migrate();

            var seeder = scope.ServiceProvider.GetRequiredService<SeedService>();
            await seeder.SeedAsync();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[ATTENTION] Init/Seed ignore : {ex.Message}");
        }
    }
}

Console.WriteLine();
Console.WriteLine("============================================");
Console.WriteLine($"   ShopMax Backend PRET !");
Console.WriteLine($"   Port: {port}");
Console.WriteLine($"   Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"   Swagger: /swagger");
Console.WriteLine($"   Health: /health");
Console.WriteLine("============================================");
Console.WriteLine();

app.Run();
