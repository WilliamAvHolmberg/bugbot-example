using MediatR;
using Microsoft.EntityFrameworkCore;
using backend.Data;

namespace backend.Features.Users;

public sealed record ListUsersQuery(string? Search, int Page = 1, int PageSize = 20) : IRequest<PagedResult<UserDto>>;

public sealed class ListUsersHandler(AppDbContext dbContext) : IRequestHandler<ListUsersQuery, PagedResult<UserDto>>
{
    public async Task<PagedResult<UserDto>> Handle(ListUsersQuery request, CancellationToken cancellationToken)
    {
        IQueryable<User> query = dbContext.Users.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var term = request.Search.Trim();
            query = query.Where(u => EF.Functions.ILike(u.Email, $"%{term}%") || EF.Functions.ILike(u.Name, $"%{term}%"));
        }

        var total = await query.CountAsync(cancellationToken);

        var items = await query
            .OrderByDescending(u => u.CreatedUtc)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(u => new UserDto(u.Id, u.Email, u.Name, u.CreatedUtc))
            .ToListAsync(cancellationToken);

        return new PagedResult<UserDto>(items, total, request.Page, request.PageSize);
    }
}

public sealed record PagedResult<T>(IReadOnlyList<T> Items, int Total, int Page, int PageSize);


