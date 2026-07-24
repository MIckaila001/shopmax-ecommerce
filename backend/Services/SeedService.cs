using Microsoft.EntityFrameworkCore;
using ShopMax.Data;
using ShopMax.Models;

namespace ShopMax.Services;

/// <summary>
/// Service pour initialiser la base de données avec des données d'exemple
/// </summary>
public class SeedService
{
    private readonly AppDbContext _context;
    private readonly ILogger<SeedService> _logger;

    public SeedService(AppDbContext context, ILogger<SeedService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        try
        {
            // 1. Catégories
            if (!await _context.Categories.AnyAsync())
            {
                _logger.LogInformation("🌱 Seeding des catégories...");
                await SeedCategories();
            }

            // 2. Produits
            if (!await _context.Products.AnyAsync())
            {
                _logger.LogInformation("🌱 Seeding des produits...");
                await SeedProducts();
            }

            // 3. Utilisateur admin
            if (!await _context.Users.AnyAsync(u => u.Role == UserRole.Admin))
            {
                _logger.LogInformation("🌱 Seeding de l'utilisateur admin...");
                await SeedAdmin();
            }

            _logger.LogInformation("✅ Seed terminé avec succès !");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Erreur lors du seed");
            throw;
        }
    }

    private async Task SeedCategories()
    {
        var categories = new List<Category>
        {
            new Category
            {
                Name = "Électronique",
                Slug = "electronique",
                ImageUrl = "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
            },
            new Category
            {
                Name = "Mode Homme",
                Slug = "mode-homme",
                ImageUrl = "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400",
            },
            new Category
            {
                Name = "Mode Femme",
                Slug = "mode-femme",
                ImageUrl = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400",
            },
            new Category
            {
                Name = "Maison & Cuisine",
                Slug = "maison-cuisine",
                ImageUrl = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
            },
            new Category
            {
                Name = "Beauté & Santé",
                Slug = "beaute-sante",
                ImageUrl = "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
            },
            new Category
            {
                Name = "Sport & Loisirs",
                Slug = "sport-loisirs",
                ImageUrl = "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
            },
        };

        _context.Categories.AddRange(categories);
        await _context.SaveChangesAsync();
    }

    private async Task SeedProducts()
    {
        var electronics = await _context.Categories.FirstAsync(c => c.Slug == "electronique");
        var modeHomme = await _context.Categories.FirstAsync(c => c.Slug == "mode-homme");
        var sport = await _context.Categories.FirstAsync(c => c.Slug == "sport-loisirs");

        var products = new List<Product>
        {
            // ========== ÉLECTRONIQUE ==========
            new Product
            {
                Name = "iPhone 15 Pro 128 Go - Titane Noir",
                Description = "L'iPhone 15 Pro. Forgé en titane, doté d'un puissant appareil photo, d'une puce A17 Pro, d'un système photo Pro révolutionnaire et d'un port USB-C.",
                Price = 1499000m,
                OldPrice = 1799000m,
                Stock = 25,
                ImageUrl = "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500",
                Brand = "Apple",
                Color = "Titane Noir",
                CategoryId = electronics.Id,
                Rating = 4.8,
                ReviewsCount = 128,
                IsFeatured = true,
            },
            new Product
            {
                Name = "Samsung Galaxy S24 Ultra 256 Go",
                Description = "Le nouveau Samsung Galaxy S24 Ultra avec IA intégrée, écran Dynamic AMOLED 2X et S Pen.",
                Price = 1399000m,
                Stock = 30,
                ImageUrl = "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500",
                Brand = "Samsung",
                Color = "Noir",
                CategoryId = electronics.Id,
                Rating = 4.7,
                ReviewsCount = 95,
                IsFeatured = true,
            },
            new Product
            {
                Name = "Xiaomi 14 Pro 256 Go",
                Description = "Smartphone haut de gamme avec caméra Leica et Snapdragon 8 Gen 3.",
                Price = 749000m,
                OldPrice = 899000m,
                Stock = 40,
                ImageUrl = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
                Brand = "Xiaomi",
                Color = "Noir",
                CategoryId = electronics.Id,
                Rating = 4.5,
                ReviewsCount = 67,
            },
            new Product
            {
                Name = "Casque Sony WH-1000XM5 Noir",
                Description = "Casque sans fil premium avec réduction de bruit active, autonomie 30h.",
                Price = 349000m,
                OldPrice = 449000m,
                Stock = 50,
                ImageUrl = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500",
                Brand = "Sony",
                Color = "Noir",
                CategoryId = electronics.Id,
                Rating = 4.9,
                ReviewsCount = 234,
                IsFeatured = true,
            },
            new Product
            {
                Name = "Apple AirPods Pro 2",
                Description = "Écouteurs sans fil avec réduction de bruit active et audio spatial.",
                Price = 299000m,
                Stock = 60,
                ImageUrl = "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500",
                Brand = "Apple",
                Color = "Blanc",
                CategoryId = electronics.Id,
                Rating = 4.8,
                ReviewsCount = 456,
                IsFeatured = true,
            },
            new Product
            {
                Name = "Samsung Galaxy Watch 6 Classic",
                Description = "Montre connectée premium avec suivi santé avancé et GPS.",
                Price = 449000m,
                OldPrice = 499000m,
                Stock = 35,
                ImageUrl = "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500",
                Brand = "Samsung",
                Color = "Argent",
                CategoryId = electronics.Id,
                Rating = 4.6,
                ReviewsCount = 178,
            },

            // ========== MODE HOMME ==========
            new Product
            {
                Name = "Sac à dos urbain noir - 25L",
                Description = "Sac à dos résistant à l'eau avec compartiment laptop 15.6 pouces.",
                Price = 49900m,
                OldPrice = 65000m,
                Stock = 80,
                ImageUrl = "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
                Brand = "Generic",
                Color = "Noir",
                CategoryId = modeHomme.Id,
                Rating = 4.4,
                ReviewsCount = 89,
            },
            new Product
            {
                Name = "Veste en cuir vintage",
                Description = "Veste en cuir véritable, style motard, coupe ajustée.",
                Price = 199000m,
                Stock = 20,
                ImageUrl = "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
                Brand = "LeatherCraft",
                Color = "Marron",
                CategoryId = modeHomme.Id,
                Rating = 4.7,
                ReviewsCount = 45,
            },

            // ========== SPORT ==========
            new Product
            {
                Name = "Nike Air Max Plus Homme",
                Description = "Chaussures de sport iconiques avec amorti Tuned Air.",
                Price = 179000m,
                Stock = 45,
                ImageUrl = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
                Brand = "Nike",
                Color = "Rouge",
                CategoryId = sport.Id,
                Rating = 4.7,
                ReviewsCount = 312,
                IsFeatured = true,
            },
            new Product
            {
                Name = "Adidas Ultraboost 23",
                Description = "Chaussures de running haut de gamme avec retour d'énergie exceptionnel.",
                Price = 195000m,
                OldPrice = 220000m,
                Stock = 30,
                ImageUrl = "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500",
                Brand = "Adidas",
                Color = "Noir",
                CategoryId = sport.Id,
                Rating = 4.8,
                ReviewsCount = 189,
            },
        };

        _context.Products.AddRange(products);
        await _context.SaveChangesAsync();
    }

    private async Task SeedAdmin()
    {
        var admin = new User
        {
            FirstName = "Admin",
            LastName = "ShopMax",
            Email = "admin@shopmax.cm",
            Phone = "+237 6 00 00 00 00",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
            Role = UserRole.Admin,
        };

        _context.Users.Add(admin);
        await _context.SaveChangesAsync();
    }
}
