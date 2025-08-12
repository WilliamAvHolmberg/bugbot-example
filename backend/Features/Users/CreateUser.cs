using MediatR;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using backend.Data;

namespace backend.Features.Users;

// Command + Handler (controller extracted)
public sealed record CreateUserCommand([Required, EmailAddress] string Email, [Required] string Name) : IRequest<UserDto>;

public sealed class CreateUserHandler(AppDbContext dbContext) : IRequestHandler<CreateUserCommand, UserDto>
{
    public async Task<UserDto> Handle(CreateUserCommand request, CancellationToken cancellationToken)
    {
        var exists = await dbContext.Users.AnyAsync(u => u.Email == request.Email, cancellationToken);
        if (exists)
        {
            throw new ValidationException("Email already exists");
        }

        var entity = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            Name = request.Name,
            CreatedUtc = DateTime.UtcNow
        };

        dbContext.Users.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return new UserDto(entity.Id, entity.Email, entity.Name, entity.CreatedUtc);
    }
}



