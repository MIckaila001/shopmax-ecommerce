using ShopMax.Models;
using System.Text.Json;
using System.Text;

namespace ShopMax.Services;

public interface IPaymentService
{
    Task<PaymentResult> InitializePaymentAsync(PaymentRequest request);
    Task<PaymentResult> VerifyPaymentAsync(string reference);
    Task<PayoutResult> InitiatePayoutAsync(PayoutRequest request);
}

/// <summary>
/// Service de paiement via NotchPay
/// Doc: https://docs.notchpay.co
/// Supporte : Mobile Money (MTN, Orange), Cartes Visa/Mastercard
/// </summary>
public class PaymentService : IPaymentService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly ILogger<PaymentService> _logger;

    public PaymentService(HttpClient httpClient, IConfiguration config, ILogger<PaymentService> logger)
    {
        _httpClient = httpClient;
        _config = config;
        _logger = logger;
    }

    /// <summary>
    /// Initialise un paiement NotchPay
    /// </summary>
    public async Task<PaymentResult> InitializePaymentAsync(PaymentRequest request)
    {
        var apiKey = _config["NotchPay:ApiKey"];
        var environment = _config["NotchPay:Environment"] ?? "sandbox";
        var baseUrl = environment == "production"
            ? "https://api.notchpay.co"
            : "https://api.notchpay.co"; // Même URL,区別 via la clé

        try
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", apiKey);
            _httpClient.DefaultRequestHeaders.Add("X-Grant-Project", _config["NotchPay:ProjectId"] ?? "");
            _httpClient.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));

            // Mapping méthode de paiement → channel NotchPay
            var channel = request.Method switch
            {
                PaymentMethod.MobileMoneyMTN => "cm.mtn",
                PaymentMethod.OrangeMoney => "cm.orange",
                PaymentMethod.Visa => "card",
                PaymentMethod.Mastercard => "card",
                _ => "cm.mtn"
            };

            var payload = new
            {
                amount = (int)request.Amount, // NotchPay attend des entiers en XAF
                currency = "XAF",
                description = $"Commande ShopMax #{request.OrderNumber}",
                customer = new
                {
                    email = request.CustomerEmail,
                    phone = request.PhoneNumber
                },
                reference = request.OrderNumber,
                callback = _config["NotchPay:CallbackUrl"],
                redirect = _config["NotchPay:RedirectUrl"]
            };

            var json = JsonSerializer.Serialize(payload, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            // Endpoint : POST /payments/initialize
            var response = await _httpClient.PostAsync($"{baseUrl}/payments/initialize", content);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var data = JsonSerializer.Deserialize<NotchPayInitResponse>(responseBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                _logger.LogInformation($"[NotchPay] Paiement initialisé : {data?.Transaction?.Reference}");

                return new PaymentResult
                {
                    Success = true,
                    TransactionId = data?.Transaction?.Reference ?? request.OrderNumber,
                    PaymentUrl = data?.Transaction?.AuthorizationUrl
                };
            }

            _logger.LogError($"[NotchPay] Erreur {response.StatusCode}: {responseBody}");
            return new PaymentResult
            {
                Success = false,
                ErrorMessage = "Erreur lors de l'initialisation du paiement."
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[NotchPay] Exception lors de l'initialisation du paiement");
            return new PaymentResult
            {
                Success = false,
                ErrorMessage = ex.Message
            };
        }
    }

    /// <summary>
    /// Vérifie le statut d'un paiement (utile pour les webhooks)
    /// </summary>
    public async Task<PaymentResult> VerifyPaymentAsync(string reference)
    {
        var apiKey = _config["NotchPay:ApiKey"];
        var baseUrl = "https://api.notchpay.co";

        try
        {
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", apiKey);
            _httpClient.DefaultRequestHeaders.Add("X-Grant-Project", _config["NotchPay:ProjectId"] ?? "");

            // GET /payments/{reference}
            var response = await _httpClient.GetAsync($"{baseUrl}/payments/{reference}");
            var responseBody = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                var data = JsonSerializer.Deserialize<NotchPayVerifyResponse>(responseBody, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

                return new PaymentResult
                {
                    Success = data?.Transaction?.Status == "complete",
                    TransactionId = data?.Transaction?.Reference
                };
            }

            return new PaymentResult { Success = false, ErrorMessage = "Transaction introuvable." };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[NotchPay] Erreur vérification paiement");
            return new PaymentResult { Success = false, ErrorMessage = ex.Message };
        }
    }

    /// <summary>
    /// Initie un payout (remboursement ou virement)
    /// </summary>
    public async Task<PayoutResult> InitiatePayoutAsync(PayoutRequest request)
    {
        // TODO: POST /transfers
        await Task.CompletedTask;
        return new PayoutResult { Success = true, TransactionId = Guid.NewGuid().ToString() };
    }
}

// =====================================================
// DTOs NotchPay
// =====================================================

public class NotchPayInitResponse
{
    public string Code { get; set; } = string.Empty;
    public NotchPayTransaction? Transaction { get; set; }
}

public class NotchPayVerifyResponse
{
    public string Code { get; set; } = string.Empty;
    public NotchPayTransaction? Transaction { get; set; }
}

public class NotchPayTransaction
{
    public string? Reference { get; set; }
    public string? Status { get; set; } // pending, complete, failed, expired
    public string? AuthorizationUrl { get; set; }
    public int Amount { get; set; }
    public string? Currency { get; set; }
    public string? Channel { get; set; }
}

// =====================================================
// Modèles de requête
// =====================================================

public class PaymentRequest
{
    public decimal Amount { get; set; }
    public PaymentMethod Method { get; set; }
    public string? PhoneNumber { get; set; }
    public string? CardToken { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
}

public class PaymentResult
{
    public bool Success { get; set; }
    public string? TransactionId { get; set; }
    public string? ErrorMessage { get; set; }
    public string? PaymentUrl { get; set; }
}

public class PayoutRequest
{
    public decimal Amount { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public PaymentMethod Method { get; set; }
    public string Reference { get; set; } = string.Empty;
}

public class PayoutResult
{
    public bool Success { get; set; }
    public string? TransactionId { get; set; }
    public string? ErrorMessage { get; set; }
}
