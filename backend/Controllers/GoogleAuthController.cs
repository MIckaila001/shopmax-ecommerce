using Microsoft.AspNetCore.Mvc;
using ShopMax.Services;
using ShopMax.Models;
using Microsoft.EntityFrameworkCore;
using ShopMax.Data;
using System.Text.Json;

namespace ShopMax.Controllers;

[ApiController]
[Route("api/auth/google")]
public class GoogleAuthController : ControllerBase
{
    private readonly IGoogleAuthService _googleAuth;
    private readonly IAuthService _authService;
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly ILogger<GoogleAuthController> _logger;

    public GoogleAuthController(
        IGoogleAuthService googleAuth,
        IAuthService authService,
        AppDbContext context,
        IConfiguration config,
        ILogger<GoogleAuthController> logger)
    {
        _googleAuth = googleAuth;
        _authService = authService;
        _context = context;
        _config = config;
        _logger = logger;
    }

    /// <summary>
    /// Initie le flow OAuth Google
    /// </summary>
    [HttpGet("login")]
    public IActionResult Login([FromQuery] string? redirect = "/compte")
    {
        var frontendUrl = _config["Auth:Google:FrontendUrl"] ?? "http://localhost:3000";

        // Verifie que Google OAuth est configure
        if (!_googleAuth.IsConfigured())
        {
            _logger.LogWarning("[Google OAuth] Tentative d'acces mais non configure.");
            return Redirect($"{frontendUrl}/connexion?error=google_not_configured");
        }

        var state = $"{Guid.NewGuid()}|{Uri.EscapeDataString(redirect ?? "/compte")}";
        var googleAuthUrl = _googleAuth.GetAuthorizationUrl(state);
        _logger.LogInformation($"[Google OAuth] Redirection vers: {googleAuthUrl.Substring(0, Math.Min(120, googleAuthUrl.Length))}...");
        return Redirect(googleAuthUrl);
    }

    /// <summary>
    /// Callback appele par Google apres authentification
    /// </summary>
    [HttpGet("callback")]
    public async Task<IActionResult> Callback(
        [FromQuery] string? code,
        [FromQuery] string? state,
        [FromQuery] string? error)
    {
        var frontendUrl = _config["Auth:Google:FrontendUrl"] ?? "http://localhost:3000";

        if (!string.IsNullOrEmpty(error))
        {
            _logger.LogWarning($"[Google OAuth] Erreur recue: {error}");
            return Redirect($"{frontendUrl}/connexion?error={Uri.EscapeDataString(error)}");
        }

        if (string.IsNullOrEmpty(code) || string.IsNullOrEmpty(state))
        {
            return Redirect($"{frontendUrl}/connexion?error=missing_params");
        }

        try
        {
            var stateParts = state.Split('|', 2);
            if (stateParts.Length < 2)
            {
                _logger.LogWarning("[Google OAuth] State invalide");
                return Redirect($"{frontendUrl}/connexion?error=invalid_state");
            }
            var redirectPath = Uri.UnescapeDataString(stateParts[1]);

            _logger.LogInformation("[Google OAuth] Etape 1/5: Echange du code...");
            var tokens = await _googleAuth.ExchangeCodeForTokensAsync(code);
            if (tokens == null || string.IsNullOrEmpty(tokens.AccessToken))
            {
                _logger.LogWarning("[Google OAuth] ECHEC etape 1: Pas de token recu");
                return Redirect($"{frontendUrl}/connexion?error=token_exchange_failed");
            }

            _logger.LogInformation("[Google OAuth] Etape 2/5: Recuperation userinfo...");
            var googleUser = await _googleAuth.GetUserInfoAsync(tokens.AccessToken);
            if (googleUser == null || string.IsNullOrEmpty(googleUser.Email))
            {
                _logger.LogWarning($"[Google OAuth] ECHEC etape 2: Userinfo vide. Token: {tokens.AccessToken.Substring(0, 20)}...");
                return Redirect($"{frontendUrl}/connexion?error=userinfo_failed");
            }

            _logger.LogInformation($"[Google OAuth] Etape 3/5: User Google = {googleUser.Email}");

            _logger.LogInformation($"[Google OAuth] Etape 4/5: Authentification en BDD...");
            var (success, user, authError) = await _googleAuth.AuthenticateGoogleUserAsync(googleUser);
            if (!success || user == null)
            {
                _logger.LogError($"[Google OAuth] ECHEC etape 4: {authError}");
                return Redirect($"{frontendUrl}/connexion?error={Uri.EscapeDataString(authError ?? "auth_failed")}");
            }

            _logger.LogInformation($"[Google OAuth] Etape 5/5: User en BDD (ID={user.Id}), generation JWT...");
            var jwtToken = _authService.GenerateJwtToken(user);

            _logger.LogInformation($"[Google OAuth] SUCCES pour {user.Email}, redirection vers frontend...");

            var callbackUrl = $"{frontendUrl}/auth/callback" +
                $"?token={Uri.EscapeDataString(jwtToken)}" +
                $"&user={Uri.EscapeDataString(JsonSerializer.Serialize(new {
                    id = user.Id,
                    firstName = user.FirstName,
                    lastName = user.LastName,
                    email = user.Email,
                    avatarUrl = user.AvatarUrl,
                    role = user.Role.ToString()
                }))}" +
                $"&redirect={Uri.EscapeDataString(redirectPath)}";

            _logger.LogInformation($"[Google OAuth] URL finale: {callbackUrl.Substring(0, Math.Min(150, callbackUrl.Length))}...");
            return Redirect(callbackUrl);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Google OAuth] EXCEPTION dans le callback");
            _logger.LogError($"[Google OAuth] Stack: {ex.StackTrace}");
            return Redirect($"{frontendUrl}/connexion?error=internal_error&msg={Uri.EscapeDataString(ex.Message)}");
        }
    }

    /// <summary>
    /// Verifie si Google OAuth est configure
    /// </summary>
    [HttpGet("status")]
    public IActionResult GetStatus()
    {
        return Ok(new
        {
            configured = _googleAuth.IsConfigured(),
            message = _googleAuth.IsConfigured()
                ? "Google OAuth est configure et pret"
                : "Google OAuth n'est pas configure. Voir GUIDE-GOOGLE-OAUTH.md"
        });
    }
}
