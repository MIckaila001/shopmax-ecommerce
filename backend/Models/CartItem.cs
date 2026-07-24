using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopMax.Models;

public class CartItem
{
    [Key]
    public int Id { get; set; }

    // Pour utilisateur connecté
    public int? UserId { get; set; }
    public User? User { get; set; }

    // Pour visiteur anonyme (cookie-based)
    [MaxLength(100)]
    public string? SessionId { get; set; }

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int Quantity { get; set; } = 1;

    [MaxLength(100)]
    public string? VariantInfo { get; set; }

    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}
