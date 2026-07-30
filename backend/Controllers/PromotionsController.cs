using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopMax.Data;
using ShopMax.Models;

namespace ShopMax.Controllers;

/// <summary>
/// API des promotions, ventes flash et offres speciales
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PromotionsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly ILogger<PromotionsController> _logger;

    public PromotionsController(AppDbContext db, ILogger<PromotionsController> logger)
    {
        _db = db;
        _logger = logger;
    }

    /// <summary>
    /// Recupere toutes les promotions actives
    /// </summary>
    [HttpGet("active")]
    public async Task<ActionResult<List<PromotionDto>>> GetActivePromotions()
    {
        try
        {
            var now = DateTime.UtcNow;
            var promos = await _db.Promotions
                .Where(p => p.IsActive && p.StartsAt <= now && p.EndsAt > now)
                .OrderByDescending(p => p.DiscountPercent)
                .Select(p => new PromotionDto
                {
                    Id = p.Id,
                    Title = p.Title,
                    Subtitle = p.Subtitle,
                    Description = p.Description,
                    ImageUrl = p.ImageUrl,
                    StartsAt = p.StartsAt,
                    EndsAt = p.EndsAt,
                    DiscountPercent = p.DiscountPercent,
                    CtaText = p.CtaText,
                    CtaLink = p.CtaLink,
                })
                .ToListAsync();

            return Ok(promos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors du chargement des promotions");
            return StatusCode(500, new { error = "Erreur serveur" });
        }
    }

    /// <summary>
    /// Recupere les produits en vente flash avec stock limite
    /// </summary>
    [HttpGet("flash-sale")]
    public async Task<ActionResult<List<FlashSaleProductDto>>> GetFlashSale()
    {
        try
        {
            var now = DateTime.UtcNow;
            var flashProducts = await _db.PromotionProducts
                .Include(pp => pp.Product)
                .Where(pp => pp.Promotion.IsActive
                          && pp.Promotion.StartsAt <= now
                          && pp.Promotion.EndsAt > now
                          && pp.Promotion.Type == "flash")
                .OrderBy(pp => pp.Stock)
                .Take(8)
                .Select(pp => new FlashSaleProductDto
                {
                    Id = pp.ProductId,
                    Name = pp.Product.Name,
                    Brand = pp.Product.Brand,
                    Image = pp.Product.ImageUrl,
                    Price = pp.SalePrice,
                    OldPrice = pp.Product.Price,
                    Rating = pp.Product.Rating,
                    Reviews = pp.Product.ReviewsCount,
                    Stock = pp.Stock,
                    Sold = pp.Sold,
                    EndsAt = pp.Promotion.EndsAt,
                })
                .ToListAsync();

            return Ok(flashProducts);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur lors du chargement des ventes flash");
            return StatusCode(500, new { error = "Erreur serveur" });
        }
    }

    /// <summary>
    /// Recupere le statut d'une promotion (temps restant, etc.)
    /// </summary>
    [HttpGet("{id}/status")]
    public async Task<ActionResult<PromotionStatusDto>> GetPromotionStatus(int id)
    {
        var promo = await _db.Promotions.FindAsync(id);
        if (promo == null)
            return NotFound();

        var now = DateTime.UtcNow;
        var timeLeft = promo.EndsAt - now;

        return Ok(new PromotionStatusDto
        {
            Id = promo.Id,
            IsActive = promo.IsActive && promo.StartsAt <= now && promo.EndsAt > now,
            StartsAt = promo.StartsAt,
            EndsAt = promo.EndsAt,
            TimeLeftSeconds = (long)timeLeft.TotalSeconds,
            IsExpired = timeLeft.TotalSeconds <= 0,
            StartsInSeconds = (long)Math.Max(0, (promo.StartsAt - now).TotalSeconds),
        });
    }
}

// =============== DTOs ===============

public class PromotionDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }
    public int DiscountPercent { get; set; }
    public string CtaText { get; set; } = "Voir";
    public string CtaLink { get; set; } = "/";
}

public class FlashSaleProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal OldPrice { get; set; }
    public double Rating { get; set; }
    public int Reviews { get; set; }
    public int Stock { get; set; }
    public int Sold { get; set; }
    public DateTime EndsAt { get; set; }
}

public class PromotionStatusDto
{
    public int Id { get; set; }
    public bool IsActive { get; set; }
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }
    public long TimeLeftSeconds { get; set; }
    public bool IsExpired { get; set; }
    public long StartsInSeconds { get; set; }
}
