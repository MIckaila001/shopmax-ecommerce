using System.ComponentModel.DataAnnotations;

namespace ShopMax.Models;

/// <summary>
/// Lie un produit a une promotion (avec stock dedie pour ventes flash)
/// </summary>
public class PromotionProduct
{
    public int Id { get; set; }

    public int PromotionId { get; set; }
    public Promotion Promotion { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    [Required]
    public decimal SalePrice { get; set; }

    public int Stock { get; set; } = 0;
    public int Sold { get; set; } = 0;
    public int? MaxPerCustomer { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
