using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopMax.Models;

public class Promotion
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(300)]
    public string Subtitle { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public DateTime StartsAt { get; set; } = DateTime.UtcNow;

    public DateTime EndsAt { get; set; } = DateTime.UtcNow.AddDays(7);

    /// <summary>
    /// Type de promotion : banner, flash, code, percentage, fixed
    /// </summary>
    [MaxLength(50)]
    public string Type { get; set; } = "banner";

    public int DiscountPercent { get; set; } = 0;

    [MaxLength(50)]
    public string? Code { get; set; }

    [MaxLength(50)]
    public string CtaText { get; set; } = "Voir";

    [MaxLength(500)]
    public string CtaLink { get; set; } = "/";

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<PromotionProduct> PromotionProducts { get; set; } = new List<PromotionProduct>();
}
