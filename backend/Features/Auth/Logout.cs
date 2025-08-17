using MediatR;
using Microsoft.AspNetCore.Identity;

namespace backend.Features.Auth;

public sealed record LogoutCommand() : IRequest<Unit>;

public sealed class LogoutHandler(SignInManager<IdentityUser> signInManager) : IRequestHandler<LogoutCommand, Unit>
{
    public async Task<Unit> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        await signInManager.SignOutAsync();
        return Unit.Value;
    }
}


