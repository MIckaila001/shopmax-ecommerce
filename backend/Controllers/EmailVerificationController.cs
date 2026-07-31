using Microsoft.AspNetCore.Mvc;
using ShopMax.Data;
using ShopMax.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;

namespace ShopMax.Controllers;

/// <summary>
/// API de verification d'email par code OTP
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class EmailVerificationController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IEmailService _emailService;
    private readonly ILogger<EmailVerificationController> _logger;

    // Stockage en memoire des codes actifs (en production, utiliser Redis)
    private static readonly Dictionary<string, VerificationCode> _codes = new();
    private static readonly object _lock = new();

    public EmailVerificationController(
        AppDbContext db,
        IEmailService emailService,
        ILogger<EmailVerificationController> logger)
    {
        _db = db;
        _emailService = emailService;
        _logger = logger;
    }

    /// <summary>
    /// Genere et envoie un code de verification a 6 chiffres par email
    /// </summary>
    [HttpPost("send")]
    public async Task<IActionResult> SendVerificationCode([FromBody] SendCodeRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || !request.Email.Contains("@"))
            return BadRequest(new { message = "Email invalide" });

        var email = request.Email.Trim().ToLowerInvariant();

        // Verifier si l'email n'est pas deja pris
        var existingUser = await _db.Users.AnyAsync(u => u.Email == email);
        if (existingUser)
            return BadRequest(new { message = "Cet email est deja utilise. Connectez-vous." });

        // Generer un code a 6 chiffres
        var code = GenerateCode();

        // Stocker le code avec expiration (10 minutes)
        var verification = new VerificationCode
        {
            Email = email,
            Code = code,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            Attempts = 0
        };

        lock (_lock)
        {
            _codes[email] = verification;
        }

        // Envoyer l'email
        try
        {
            await _emailService.SendVerificationCodeAsync(email, code);
            _logger.LogInformation("Code de verification envoye a {Email}", email);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Impossible d'envoyer l'email, code: {Code}", code);
            // En mode demo, on retourne le code dans la reponse
        }

        return Ok(new
        {
            message = "Code envoye par email",
            // En mode demo (sans email configure), on retourne le code
            demoCode = code,
            expiresIn = 600 // 10 minutes
        });
    }

    /// <summary>
    /// Verifie le code OTP
    /// </summary>
    [HttpPost("verify")]
    public IActionResult VerifyCode([FromBody] VerifyCodeRequest request)
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Code))
            return BadRequest(new { message = "Email et code requis" });

        var email = request.Email.Trim().ToLowerInvariant();
        var code = request.Code.Trim();

        lock (_lock)
        {
            if (!_codes.TryGetValue(email, out var verification))
                return BadRequest(new { message = "Aucun code en attente. Demandez un nouveau code." });

            // Verifier expiration
            if (DateTime.UtcNow > verification.ExpiresAt)
            {
                _codes.Remove(email);
                return BadRequest(new { message = "Code expire. Demandez un nouveau code." });
            }

            // Verifier tentatives max (5 max)
            if (verification.Attempts >= 5)
            {
                _codes.Remove(email);
                return BadRequest(new { message = "Trop de tentatives. Demandez un nouveau code." });
            }

            // Verifier le code
            if (verification.Code != code)
            {
                verification.Attempts++;
                return BadRequest(new
                {
                    message = $"Code invalide. {5 - verification.Attempts} tentatives restantes."
                });
            }

            // Code valide ! On le supprime
            _codes.Remove(email);
            return Ok(new
            {
                valid = true,
                message = "Email verifie avec succes"
            });
        }
    }

    /// <summary>
    /// Genere un code a 6 chiffres
    /// </summary>
    private string GenerateCode()
    {
        var random = new byte[4];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(random);
        var value = BitConverter.ToUInt32(random, 0) % 1000000;
        return value.ToString("D6"); // Format 6 chiffres avec zeros
    }
}

public class SendCodeRequest
{
    public string Email { get; set; } = string.Empty;
}

public class VerifyCodeRequest
{
    public string Email { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
}

public class VerificationCode
{
    public string Email { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public int Attempts { get; set; }
}
