using MediatR;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Features.Users;

// Query + Handler + DTO (controller extracted)
public sealed record GetUserQuery(Guid Id) : IRequest<UserDto?>;

public sealed class GetUserHandler(AppDbContext dbContext) : IRequestHandler<GetUserQuery, UserDto?>
{
    public async Task<UserDto?> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = await dbContext.Users
            .Where(u => u.Id == request.Id)
            .Select(u => new UserDto(u.Id, u.Email, u.Name, u.CreatedUtc))
            .FirstOrDefaultAsync(cancellationToken);

        return user;
    }
}

public sealed record UserDto(Guid Id, string Email, string Name, DateTime CreatedUtc);



