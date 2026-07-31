using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ShopMax.Services;

public interface IEmailService
{
    Task SendOrderConfirmationAsync(string toEmail, string orderNumber, decimal total);
    Task SendWelcomeEmailAsync(string toEmail, string firstName);
    Task SendPasswordResetAsync(string toEmail, string resetLink);
    Task SendShippingNotificationAsync(string toEmail, string orderNumber, string trackingNumber);
    Task SendVerificationCodeAsync(string toEmail, string code);
}

/// <summary>
/// Service d'envoi d'emails
/// Utilise Resend en production (https://resend.com)
/// Fallback sur les logs en dev si pas de cle API
/// </summary>
public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;
    private readonly HttpClient _httpClient;

    private string? _apiKey;
    private string _fromEmail;
    private string _fromName;

    public EmailService(IConfiguration config, ILogger<EmailService> logger, HttpClient httpClient)
    {
        _config = config;
        _logger = logger;
        _httpClient = httpClient;

        // Recupere la configuration Resend
        _apiKey = _config["Resend:ApiKey"];
        _fromEmail = _config["Resend:FromEmail"] ?? "onboarding@resend.dev";
        _fromName = _config["Resend:FromName"] ?? "ShopMax";

        if (!string.IsNullOrEmpty(_apiKey))
        {
            _httpClient.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", _apiKey);
        }
    }

    public async Task SendOrderConfirmationAsync(string toEmail, string orderNumber, decimal total)
    {
        var subject = $"Confirmation de votre commande {orderNumber}";
        var html = BuildOrderConfirmationHtml(orderNumber, total);
        await SendEmailAsync(toEmail, subject, html);
    }

    public async Task SendWelcomeEmailAsync(string toEmail, string firstName)
    {
        var subject = $"Bienvenue sur ShopMax, {firstName} !";
        var html = BuildWelcomeHtml(firstName);
        await SendEmailAsync(toEmail, subject, html);
    }

    public async Task SendPasswordResetAsync(string toEmail, string resetLink)
    {
        var subject = "Reinitialisation de votre mot de passe ShopMax";
        var html = BuildPasswordResetHtml(resetLink);
        await SendEmailAsync(toEmail, subject, html);
    }

    public async Task SendShippingNotificationAsync(string toEmail, string orderNumber, string trackingNumber)
    {
        var subject = $"Votre commande {orderNumber} est expediee";
        var html = BuildShippingHtml(orderNumber, trackingNumber);
        await SendEmailAsync(toEmail, subject, html);
    }

    public async Task SendVerificationCodeAsync(string toEmail, string code)
    {
        var subject = "Votre code de verification ShopMax";
        var html = BuildVerificationCodeHtml(code);
        await SendEmailAsync(toEmail, subject, html);
    }

    /// <summary>
    /// Envoie un email via Resend API
    /// </summary>
    private async Task SendEmailAsync(string toEmail, string subject, string html)
    {
        // Si pas de cle API, fallback sur les logs
        if (string.IsNullOrEmpty(_apiKey))
        {
            _logger.LogWarning("[EMAIL] Pas de cle API Resend configuree, email simule :");
            _logger.LogWarning($"        A: {toEmail}");
            _logger.LogWarning($"        Sujet: {subject}");
            return;
        }

        try
        {
            var request = new
            {
                from = $"{_fromName} <{_fromEmail}>",
                to = new[] { toEmail },
                subject = subject,
                html = html,
            };

            _httpClient.BaseAddress = new Uri("https://api.resend.com");
            var response = await _httpClient.PostAsJsonAsync("/emails", request);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<ResendResponse>();
                _logger.LogInformation($"[EMAIL] ✅ Email envoye a {toEmail} - ID: {result?.Id}");
            }
            else
            {
                var error = await response.Content.ReadAsStringAsync();
                _logger.LogError($"[EMAIL] ❌ Erreur Resend : {response.StatusCode} - {error}");
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"[EMAIL] ❌ Exception envoi email a {toEmail}");
        }
    }

    // =============== TEMPLATES HTML ===============

    private string BuildVerificationCodeHtml(string code)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
  <meta charset=""utf-8"">
  <style>
    body {{ font-family: -apple-system, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }}
    .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }}
    .header {{ background: linear-gradient(135deg, #F5B400, #FFD54F); padding: 30px; text-align: center; }}
    .header h1 {{ color: #0A0A0A; margin: 0; font-size: 28px; font-weight: 900; }}
    .content {{ padding: 40px 30px; text-align: center; }}
    .content h2 {{ color: #0A0A0A; font-size: 20px; margin: 0 0 10px; }}
    .content p {{ color: #666; font-size: 14px; line-height: 1.5; margin: 0 0 20px; }}
    .code-box {{ background: #0A0A0A; color: #F5B400; font-size: 36px; font-weight: 900; letter-spacing: 8px; padding: 20px 30px; border-radius: 8px; display: inline-block; margin: 20px 0; font-family: monospace; }}
    .footer {{ background: #f9f9f9; padding: 20px; text-align: center; color: #999; font-size: 12px; }}
    .warning {{ background: #fff3cd; border: 1px solid #ffc107; color: #856404; padding: 10px; border-radius: 6px; font-size: 12px; margin-top: 20px; }}
  </style>
</head>
<body>
  <div class=""container"">
    <div class=""header"">
      <h1>ShopMax</h1>
    </div>
    <div class=""content"">
      <h2>Vérifiez votre email</h2>
      <p>Utilisez le code ci-dessous pour confirmer votre adresse email. Ce code expire dans <strong>10 minutes</strong>.</p>
      <div class=""code-box"">{code}</div>
      <p style=""margin-top: 30px; font-size: 13px; color: #999;"">
        Si vous n'avez pas demande ce code, ignorez cet email.
      </p>
      <div class=""warning"">
        ⚠️ Ne partagez jamais ce code. L'equipe ShopMax ne vous le demandera jamais.
      </div>
    </div>
    <div class=""footer"">
      © 2025 ShopMax - Le shopping en ligne au Cameroun<br>
      Cet email a ete envoye automatiquement, merci de ne pas y repondre.
    </div>
  </div>
</body>
</html>";
    }

    private string BuildWelcomeHtml(string firstName)
    {
        return $@"
<!DOCTYPE html>
<html>
<body style=""font-family: -apple-system, sans-serif; background: #f5f5f5; margin: 0; padding: 20px;"">
  <div style=""max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;"">
    <div style=""background: linear-gradient(135deg, #F5B400, #FFD54F); padding: 40px; text-align: center;"">
      <h1 style=""color: #0A0A0A; margin: 0;"">Bienvenue {firstName} ! 🎉</h1>
    </div>
    <div style=""padding: 40px 30px;"">
      <h2>Votre compte ShopMax est pret</h2>
      <p style=""color: #666;"">Decouvrez des milliers de produits, des prix imbattables, et payez en Mobile Money partout au Cameroun.</p>
      <a href=""https://shopmax.cm/boutique"" style=""display: inline-block; background: #F5B400; color: #0A0A0A; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 20px;"">
        Decouvrir la boutique →
      </a>
    </div>
  </div>
</body>
</html>";
    }

    private string BuildOrderConfirmationHtml(string orderNumber, decimal total)
    {
        return $"<h1>Commande {orderNumber} confirmee</h1><p>Total: {total:N0} FCFA</p>";
    }

    private string BuildPasswordResetHtml(string resetLink)
    {
        return $"<h1>Reinitialisation mot de passe</h1><p><a href='{resetLink}'>Cliquez ici</a></p>";
    }

    private string BuildShippingHtml(string orderNumber, string trackingNumber)
    {
        return $"<h1>Commande {orderNumber} expediee</h1><p>Suivi: {trackingNumber}</p>";
    }
}

public class ResendResponse
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }
}
