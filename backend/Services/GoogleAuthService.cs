using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text;
using ShopMax.Data;
using ShopMax.Models;
using Microsoft.EntityFrameworkCore;

namespace ShopMax.Services;

public interface IGoogleAuthService
{
    string GetAuthorizationUrl(string state);
    Task<GoogleTokenResponse?> ExchangeCodeForTokensAsync(string code);
    Task<GoogleUserInfo?> GetUserInfoAsync(string accessToken);
    Task<(bool success, User? user, string? error)> AuthenticateGoogleUserAsync(GoogleUserInfo googleUser);

    /// <summary>
    /// Verifie si Google OAuth est correctement configure
    /// </summary>
    bool IsConfigured();
}

public class GoogleTokenResponse
{
    [JsonPropertyName("access_token")]
    public string? AccessToken { get; set; }

    [JsonPropertyName("id_token")]
    public string? IdToken { get; set; }

    [JsonPropertyName("refresh_token")]
    public string? RefreshToken { get; set; }

    [JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }

    [JsonPropertyName("token_type")]
    public string? TokenType { get; set; }

    [JsonPropertyName("scope")]
    public string? Scope { get; set; }
}

public class GoogleUserInfo
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("verified_email")]
    public bool EmailVerified { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("given_name")]
    public string? GivenName { get; set; }

    [JsonPropertyName("family_name")]
    public string? FamilyName { get; set; }

    [JsonPropertyName("picture")]
    public string? Picture { get; set; }
}

public class GoogleAuthService : IGoogleAuthService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _config;
    private readonly AppDbContext _context;
    private readonly ILogger<GoogleAuthService> _logger;

    public GoogleAuthService(
        HttpClient httpClient,
        IConfiguration config,
        AppDbContext context,
        ILogger<GoogleAuthService> logger)
    {
        _httpClient = httpClient;
        _config = config;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Verifie si Google OAuth a des cles valides
    /// </summary>
    public bool IsConfigured()
    {
        var clientId = _config["Auth:Google:ClientId"];
        var clientSecret = _config["Auth:Google:ClientSecret"];

        return !string.IsNullOrEmpty(clientId)
            && !string.IsNullOrEmpty(clientSecret)
            && !clientId.StartsWith("votre-")
            && !clientSecret.StartsWith("votre-")
            && clientId.Contains(".apps.googleusercontent.com"); // Format Google
    }

    public string GetAuthorizationUrl(string state)
    {
        if (!IsConfigured())
        {
            throw new InvalidOperationException(
                "Google OAuth n'est pas configure. " +
                "Ajoutez vos cles dans backend/appsettings.json (Auth:Google:ClientId et ClientSecret) " +
                "ou lancez setup-env.bat pour les configurer."
            );
        }

        var clientId = _config["Auth:Google:ClientId"]!;
        var redirectUri = _config["Auth:Google:RedirectUri"]
            ?? "http://localhost:5000/api/auth/google/callback";
        var scope = "openid email profile";

        var parameters = new Dictionary<string, string>
        {
            ["client_id"] = clientId,
            ["redirect_uri"] = redirectUri,
            ["response_type"] = "code",
            ["scope"] = scope,
            ["state"] = state,
            ["access_type"] = "offline",
            ["prompt"] = "consent",
        };

        var query = string.Join("&", parameters.Select(p =>
            $"{Uri.EscapeDataString(p.Key)}={Uri.EscapeDataString(p.Value)}"));

        return $"https://accounts.google.com/o/oauth2/v2/auth?{query}";
    }

    public async Task<GoogleTokenResponse?> ExchangeCodeForTokensAsync(string code)
    {
        try
        {
            var clientId = _config["Auth:Google:ClientId"];
            var clientSecret = _config["Auth:Google:ClientSecret"];
            var redirectUri = _config["Auth:Google:RedirectUri"]
                ?? "http://localhost:5000/api/auth/google/callback";

            var parameters = new Dictionary<string, string>
            {
                ["code"] = code,
                ["client_id"] = clientId!,
                ["client_secret"] = clientSecret!,
                ["redirect_uri"] = redirectUri,
                ["grant_type"] = "authorization_code",
            };

            var content = new FormUrlEncodedContent(parameters);
            var response = await _httpClient.PostAsync(
                "https://oauth2.googleapis.com/token",
                content);

            var responseBody = await response.Content.ReadAsStringAsync();
            _logger.LogInformation($"[Google OAuth] Reponse Google: {responseBody}");

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError($"[Google OAuth] Erreur token (HTTP {response.StatusCode}): {responseBody}");
                return null;
            }

            // Parse le JSON avec les options
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            };
            var tokenResponse = JsonSerializer.Deserialize<GoogleTokenResponse>(responseBody, options);

            if (tokenResponse == null)
            {
                _logger.LogError("[Google OAuth] Deserialisation a retourne null");
                _logger.LogError($"[Google OAuth] Body: {responseBody}");
                return null;
            }

            if (string.IsNullOrEmpty(tokenResponse.AccessToken))
            {
                _logger.LogWarning($"[Google OAuth] AccessToken est null/vide");
                _logger.LogWarning($"[Google OAuth] Token: {tokenResponse.IdToken?.Substring(0, 20)}...");
                _logger.LogWarning($"[Google OAuth] Body: {responseBody}");
            }

            return tokenResponse;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Google OAuth] Exception dans ExchangeCodeForTokensAsync");
            return null;
        }
    }

    public async Task<GoogleUserInfo?> GetUserInfoAsync(string accessToken)
    {
        try
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/oauth2/v2/userinfo");
            request.Headers.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
                return null;

            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<GoogleUserInfo>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[Google OAuth] Erreur recuperation userinfo");
            return null;
        }
    }

    public async Task<(bool success, User? user, string? error)> AuthenticateGoogleUserAsync(
        GoogleUserInfo googleUser)
    {
        if (string.IsNullOrEmpty(googleUser.Email))
            return (false, null, "Email Google manquant");

        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == googleUser.Email);

        if (existingUser != null)
        {
            if (string.IsNullOrEmpty(existingUser.AvatarUrl) && !string.IsNullOrEmpty(googleUser.Picture))
            {
                existingUser.AvatarUrl = googleUser.Picture;
                await _context.SaveChangesAsync();
            }

            _logger.LogInformation($"[Google OAuth] Utilisateur existant: {existingUser.Email}");
            return (true, existingUser, null);
        }

        var names = (googleUser.GivenName, googleUser.FamilyName);
        if (string.IsNullOrEmpty(names.GivenName) && !string.IsNullOrEmpty(googleUser.Name))
        {
            var parts = googleUser.Name.Split(' ', 2);
            names = (parts[0], parts.Length > 1 ? parts[1] : "");
        }

        var newUser = new User
        {
            FirstName = names.GivenName ?? googleUser.Name ?? "Utilisateur",
            LastName = names.FamilyName ?? "Google",
            Email = googleUser.Email,
            AvatarUrl = googleUser.Picture,
            PasswordHash = null,
            Role = UserRole.Customer,
        };

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        _logger.LogInformation($"[Google OAuth] Nouvel utilisateur cree: {newUser.Email}");
        return (true, newUser, null);
    }
}
