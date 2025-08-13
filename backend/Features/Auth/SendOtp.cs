using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace backend.Features.Auth;

public sealed record SendOtpCommand(
    [param: Required, EmailAddress] string Email
) : IRequest<Unit>;

public sealed class SendOtpHandler(UserManager<IdentityUser> userManager) : IRequestHandler<SendOtpCommand, Unit>
{
    public async Task<Unit> Handle(SendOtpCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim();
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
        {
            user = new IdentityUser { UserName = email, Email = email, EmailConfirmed = true };
            var create = await userManager.CreateAsync(user);
            if (!create.Succeeded)
            {
                var msg = string.Join("; ", create.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Failed to create user: {msg}");
            }
        }

        var otpCode = GenerateOtpCode();
        var tokenPayload = JsonSerializer.Serialize(new OtpToken { Code = otpCode, ExpiresUtc = DateTime.UtcNow.AddMinutes(5) });
        // Store as an authentication token under a custom provider and name
        await userManager.SetAuthenticationTokenAsync(user, loginProvider: "otp", tokenName: "email", tokenValue: tokenPayload);

        Console.WriteLine($"[AUTH] OTP for {email}: {otpCode} (valid 5 minutes)");
        return Unit.Value;
    }

    private static string GenerateOtpCode()
    {
        var random = Random.Shared;
        return random.Next(0, 1_000_000).ToString("D6");
    }

    private sealed class OtpToken
    {
        public string Code { get; set; } = string.Empty;
        public DateTime ExpiresUtc { get; set; }
    }
}


