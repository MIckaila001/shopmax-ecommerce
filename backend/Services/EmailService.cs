namespace ShopMax.Services;

public interface IEmailService
{
    Task SendOrderConfirmationAsync(string toEmail, string orderNumber, decimal total);
    Task SendWelcomeEmailAsync(string toEmail, string firstName);
    Task SendPasswordResetAsync(string toEmail, string resetLink);
    Task SendShippingNotificationAsync(string toEmail, string orderNumber, string trackingNumber);
}

/// <summary>
/// Service d'envoi d'emails (mock pour le dev, Resend en prod)
/// En production, integre Resend, SendGrid, Mailgun, etc.
/// </summary>
public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendOrderConfirmationAsync(string toEmail, string orderNumber, decimal total)
    {
        // En production, integrer un vrai service d'envoi d'emails
        _logger.LogInformation($"[EMAIL] Confirmation de commande envoyee a {toEmail}");
        _logger.LogInformation($"        Commande: {orderNumber}, Total: {total:N0} FCFA");
        await Task.CompletedTask;
    }

    public async Task SendWelcomeEmailAsync(string toEmail, string firstName)
    {
        _logger.LogInformation($"[EMAIL] Email de bienvenue envoye a {toEmail} (Hello {firstName} !)");
        await Task.CompletedTask;
    }

    public async Task SendPasswordResetAsync(string toEmail, string resetLink)
    {
        _logger.LogInformation($"[EMAIL] Reset password envoye a {toEmail}");
        _logger.LogInformation($"        Lien: {resetLink}");
        await Task.CompletedTask;
    }

    public async Task SendShippingNotificationAsync(string toEmail, string orderNumber, string trackingNumber)
    {
        _logger.LogInformation($"[EMAIL] Notification expedition envoyee a {toEmail}");
        _logger.LogInformation($"        Commande: {orderNumber}, Suivi: {trackingNumber}");
        await Task.CompletedTask;
    }
}
