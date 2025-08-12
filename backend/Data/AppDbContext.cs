using Microsoft.EntityFrameworkCore;
using backend.Features.Users;

namespace backend.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
}


