using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShopMax.Models;

public class Order
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string OrderNumber { get; set; } = string.Empty;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Column(TypeName = "decimal(18,2)")]
    public decimal SubTotal { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal ShippingCost { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Total { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    [MaxLength(100)]
    public string? TrackingNumber { get; set; }

    public int ShippingAddressId { get; set; }
    public Address ShippingAddress { get; set; } = null!;

    [MaxLength(500)]
    public string? SpecialRequest { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

public class OrderItem
{
    [Key]
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public int ProductId { get; set; }
    public Product Product { get; set; } = null!;

    public int Quantity { get; set; }

    [MaxLength(100)]
    public string? VariantInfo { get; set; } // Ex: "Couleur: Noir, Stockage: 128 Go"

    [Column(TypeName = "decimal(18,2)")]
    public decimal UnitPrice { get; set; }
}

public enum OrderStatus
{
    Pending,
    Confirmed,
    Processing,
    Shipped,
    Delivered,
    Cancelled
}

public enum PaymentMethod
{
    MobileMoneyMTN,
    OrangeMoney,
    Visa,
    Mastercard,
    CashOnDelivery
}

public enum PaymentStatus
{
    Pending,
    Paid,
    Failed,
    Refunded
}
