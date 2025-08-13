using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace backend.Features.Auth;

public sealed record VerifyOtpCommand(
    [param: Required, EmailAddress] string Email,
    [param: Required] string OtpCode
) : IRequest<Unit>;

public sealed class VerifyOtpHandler(UserManager<IdentityUser> userManager, SignInManager<IdentityUser> signInManager) : IRequestHandler<VerifyOtpCommand, Unit>
{
    public async Task<Unit> Handle(VerifyOtpCommand request, CancellationToken cancellationToken)
    {
        var email = request.Email.Trim();
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
        {
            throw new ValidationException("Invalid code");
        }

        var tokenPayload = await userManager.GetAuthenticationTokenAsync(user, loginProvider: "otp", tokenName: "email");
        if (string.IsNullOrEmpty(tokenPayload))
        {
            throw new ValidationException("Invalid code");
        }

        OtpData? data;
        try
        {
            data = JsonSerializer.Deserialize<OtpData>(tokenPayload);
        }
        catch
        {
            throw new ValidationException("Invalid code");
        }

        if (data is null || data.Code != request.OtpCode || DateTime.UtcNow > data.ExpiresUtc)
        {
            throw new ValidationException("Invalid code");
        }

        await userManager.RemoveAuthenticationTokenAsync(user, loginProvider: "otp", tokenName: "email");
        await signInManager.SignInAsync(user, isPersistent: false);
        return Unit.Value;
    }

    private sealed class OtpData
    {
        public string Code { get; set; } = string.Empty;
        public DateTime ExpiresUtc { get; set; }
    }
}


