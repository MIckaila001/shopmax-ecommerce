using Microsoft.AspNetCore.Mvc;
using ShopMax.Services;
using System.ComponentModel.DataAnnotations;

namespace ShopMax.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IEmailService _emailService;

    public AuthController(IAuthService authService, IEmailService emailService)
    {
        _authService = authService;
        _emailService = emailService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, token, user, error) = await _authService.RegisterAsync(
            dto.FirstName, dto.LastName, dto.Email, dto.Password, dto.Phone);

        if (!success)
            return BadRequest(new { message = error });

        // Email de bienvenue
        await _emailService.SendWelcomeEmailAsync(user!.Email, user.FirstName);

        return Ok(new
        {
            token,
            user = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.Phone,
                user.Role
            }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var (success, token, user, error) = await _authService.LoginAsync(dto.Email, dto.Password);

        if (!success)
            return Unauthorized(new { message = error });

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
}

public class RegisterDto
{
    [Required, MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(8)]
    public string Password { get; set; } = string.Empty;

    [Phone]
    public string? Phone { get; set; }
}

public class LoginDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
