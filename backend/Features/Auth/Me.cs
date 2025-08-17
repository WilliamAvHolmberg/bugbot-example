using MediatR;
using Microsoft.AspNetCore.Identity;

namespace backend.Features.Auth;

public sealed record MeQuery() : IRequest<AuthMeDto>;

public sealed class MeHandler(IHttpContextAccessor httpContextAccessor) : IRequestHandler<MeQuery, AuthMeDto>
{
    public Task<AuthMeDto> Handle(MeQuery request, CancellationToken cancellationToken)
    {
        var user = httpContextAccessor.HttpContext?.User;
        var isAuth = user?.Identity?.IsAuthenticated == true;
        if (!isAuth)
        {
            return Task.FromResult(new AuthMeDto(false, null, null));
        }

        var userId = user!.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        var email = user!.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
        return Task.FromResult(new AuthMeDto(true, userId, email));
    }
}

public sealed record AuthMeDto(bool IsAuthenticated, string? UserId, string? Email);


