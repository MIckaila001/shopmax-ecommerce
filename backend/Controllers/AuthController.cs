using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using ShopMax.Services;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace ShopMax.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IEmailService _emailService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, IEmailService emailService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _emailService = emailService;
        _logger = logger;
    }

    /// <summary>
    /// Inscription d'un nouvel utilisateur
    /// Rate limite : 5 tentatives par 15 min par IP
    /// </summary>
    [HttpPost("register")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { errors = ModelState });

        // Normaliser l'email
        var email = dto.Email.Trim().ToLowerInvariant();

        // Validation supplementaire
        if (!IsValidEmail(email))
            return BadRequest(new { message = "Format d'email invalide." });

        if (IsCommonPassword(dto.Password))
            return BadRequest(new { message = "Ce mot de passe est trop commun. Choisissez-en un plus securise." });

        var (success, token, user, error) = await _authService.RegisterAsync(
            dto.FirstName.Trim(), dto.LastName.Trim(), email, dto.Password, dto.Phone?.Trim());

        if (!success)
        {
            _logger.LogWarning("Echec inscription pour {Email}: {Error}", email, error);
            return BadRequest(new { message = error });
        }

        // Email de bienvenue
        try
        {
            await _emailService.SendWelcomeEmailAsync(user!.Email, user.FirstName);
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Impossible d'envoyer l'email de bienvenue");
        }

        _logger.LogInformation("Nouvel utilisateur inscrit: {Email}", email);

        return Ok(new
        {
            token,
            user = new
            {
                user!.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Phone,
                user.Role
            }
        });
    }

    /// <summary>
    /// Connexion
    /// Rate limite : 5 tentatives par 15 min par IP (anti-brute-force)
    /// </summary>
    [HttpPost("login")]
    [EnableRateLimiting("auth")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new { errors = ModelState });

        var email = dto.Email.Trim().ToLowerInvariant();

        var (success, token, user, error) = await _authService.LoginAsync(email, dto.Password);

        if (!success)
        {
            // Log l'echec pour detecter les attaques
            _logger.LogWarning("Echec connexion pour {Email} depuis {IP}",
                email, HttpContext.Connection.RemoteIpAddress);
            return Unauthorized(new { message = error });
        }

        _logger.LogInformation("Connexion reussie: {Email}", email);

        return Ok(new
        {
            token,
            user = new
            {
                user!.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Phone,
                user.Role
            }
        });
    }

    /// <summary>
    /// Recuperer l'utilisateur courant (necessite JWT)
    /// </summary>
    [HttpGet("me")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        if (userIdClaim == null) return Unauthorized();

        var user = await _authService.GetUserByIdAsync(int.Parse(userIdClaim.Value));
        if (user == null) return NotFound();

        return Ok(new
        {
            user.Id,
            user.FirstName,
            user.LastName,
            user.Email,
            user.Phone,
            user.Role
        });
    }

    /// <summary>
    /// Deconnexion (cote client principalement - on黑liste le token cote serveur optionnel)
    /// </summary>
    [HttpPost("logout")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public IActionResult Logout()
    {
        // Pour une vraie deconnexion cote serveur, implementer une blacklist de tokens
        return Ok(new { message = "Deconnecte avec succes" });
    }

    // =============== HELPERS ===============

    private static bool IsValidEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        if (email.Length > 254) return false;

        try
        {
            var regex = new Regex(@"^[^@\s]+@[^@\s]+\.[^@\s]+$");
            return regex.IsMatch(email);
        }
        catch
        {
            return false;
        }
    }

    private static bool IsCommonPassword(string password)
    {
        var common = new[] { "password", "12345678", "qwerty", "abc123", "admin123", "motdepasse" };
        return common.Any(c => password.ToLowerInvariant().Contains(c));
    }
}

public class RegisterDto
{
    [Required(ErrorMessage = "Le prenom est requis")]
    [MaxLength(100, ErrorMessage = "Maximum 100 caracteres")]
    public string FirstName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le nom est requis")]
    [MaxLength(100, ErrorMessage = "Maximum 100 caracteres")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "L'email est requis")]
    [EmailAddress(ErrorMessage = "Email invalide")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est requis")]
    [MinLength(8, ErrorMessage = "Le mot de passe doit faire au moins 8 caracteres")]
    public string Password { get; set; } = string.Empty;

    [Phone(ErrorMessage = "Numero de telephone invalide")]
    public string? Phone { get; set; }
}

public class LoginDto
{
    [Required(ErrorMessage = "L'email est requis")]
    [EmailAddress(ErrorMessage = "Email invalide")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Le mot de passe est requis")]
    public string Password { get; set; } = string.Empty;
}
