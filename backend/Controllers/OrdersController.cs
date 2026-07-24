using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopMax.Data;
using ShopMax.Models;
using ShopMax.Services;

namespace ShopMax.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPaymentService _paymentService;
    private readonly IEmailService _emailService;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(
        AppDbContext context,
        IPaymentService paymentService,
        IEmailService emailService,
        ILogger<OrdersController> logger)
    {
        _context = context;
        _paymentService = paymentService;
        _emailService = emailService;
        _logger = logger;
    }

    /// <summary>
    /// Cree une commande et initie le paiement via NotchPay
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // 1. Calculer le total
        decimal subTotal = 0;
        var orderItems = new List<OrderItem>();

        foreach (var item in dto.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product == null)
                return BadRequest(new { message = $"Produit {item.ProductId} introuvable." });

            if (product.Stock < item.Quantity)
                return BadRequest(new { message = $"Stock insuffisant pour {product.Name}." });

            orderItems.Add(new OrderItem
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = product.Price,
                VariantInfo = item.VariantInfo
            });

            subTotal += product.Price * item.Quantity;
        }

        decimal shippingCost = dto.ShippingMethod == "delivery" ? 1500 : 0;
        decimal total = subTotal + shippingCost;

        // 2. Creer la commande
        var order = new Order
        {
            OrderNumber = $"SMX-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 6).ToUpper()}",
            UserId = dto.UserId,
            SubTotal = subTotal,
            ShippingCost = shippingCost,
            Total = total,
            PaymentMethod = dto.PaymentMethod,
            Status = OrderStatus.Pending,
            PaymentStatus = PaymentStatus.Pending,
            SpecialRequest = dto.SpecialRequest,
            Items = orderItems
        };

        _context.Orders.Add(order);

        // 3. Decremente le stock
        foreach (var item in dto.Items)
        {
            var product = await _context.Products.FindAsync(item.ProductId);
            if (product != null)
                product.Stock -= item.Quantity;
        }

        await _context.SaveChangesAsync();

        // 4. Initier le paiement NotchPay
        var paymentRequest = new PaymentRequest
        {
            Amount = total,
            Method = dto.PaymentMethod,
            OrderNumber = order.OrderNumber,
            CustomerEmail = dto.CustomerEmail,
            PhoneNumber = dto.CustomerPhone
        };

        var paymentResult = await _paymentService.InitializePaymentAsync(paymentRequest);

        if (!paymentResult.Success)
        {
            return BadRequest(new
            {
                message = "Erreur lors de l'initialisation du paiement.",
                details = paymentResult.ErrorMessage,
                orderNumber = order.OrderNumber
            });
        }

        return Ok(new
        {
            orderNumber = order.OrderNumber,
            total = order.Total,
            paymentUrl = paymentResult.PaymentUrl,
            transactionId = paymentResult.TransactionId
        });
    }

    /// <summary>
    /// Webhook NotchPay (callback de confirmation de paiement)
    /// Note: pour le dev, on peut tester sans SignalR
    /// </summary>
    [HttpPost("webhook/notchpay")]
    public async Task<IActionResult> NotchPayWebhook([FromBody] NotchPayWebhook payload)
    {
        _logger.LogInformation($"[Webhook NotchPay] Recu: {payload.Data?.Reference}");

        var reference = payload.Data?.Reference;
        if (string.IsNullOrEmpty(reference))
            return BadRequest();

        var order = await _context.Orders
            .Include(o => o.User)
            .FirstOrDefaultAsync(o => o.OrderNumber == reference);

        if (order == null)
            return NotFound();

        var verification = await _paymentService.VerifyPaymentAsync(reference);

        if (verification.Success)
        {
            order.PaymentStatus = PaymentStatus.Paid;
            order.Status = OrderStatus.Confirmed;
            order.ConfirmedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            await _emailService.SendOrderConfirmationAsync(
                order.User.Email, order.OrderNumber, order.Total);

            // TODO: Ajouter SignalR quand on aura besoin du temps reel
            // await _hubContext.Clients
            //     .Group($"order-{order.OrderNumber}")
            //     .SendAsync("OrderStatusUpdated", new { ... });
        }

        return Ok();
    }

    /// <summary>
    /// Liste les commandes d'un utilisateur
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserOrders(int userId)
    {
        var orders = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(oi => oi.Product)
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders);
    }

    /// <summary>
    /// Details d'une commande
    /// </summary>
    [HttpGet("{orderNumber}")]
    public async Task<IActionResult> GetOrder(string orderNumber)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber);

        if (order == null)
            return NotFound();

        return Ok(order);
    }
}

// =====================================================
// DTOs
// =====================================================

public class CreateOrderDto
{
    public int UserId { get; set; }
    public string CustomerEmail { get; set; } = string.Empty;
    public string? CustomerPhone { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
    public PaymentMethod PaymentMethod { get; set; }
    public string ShippingMethod { get; set; } = "delivery";
    public string? SpecialRequest { get; set; }
}

public class OrderItemDto
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public string? VariantInfo { get; set; }
}

public class NotchPayWebhook
{
    public string? Event { get; set; }
    public NotchPayWebhookData? Data { get; set; }
}

public class NotchPayWebhookData
{
    public string? Reference { get; set; }
    public string? Status { get; set; }
    public int Amount { get; set; }
}
