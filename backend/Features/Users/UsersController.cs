using MediatR;
using Microsoft.AspNetCore.Mvc;
using backend.Data;

namespace backend.Features.Users;

[ApiController]
[Route("api/users")]
public sealed class UsersController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<UserDto>), StatusCodes.Status200OK)]
    public async Task<IResult> List([FromQuery] string? search, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await mediator.Send(new ListUsersQuery(search, page, pageSize));
        return Results.Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IResult> GetById([FromRoute] Guid id)
    {
        var result = await mediator.Send(new GetUserQuery(id));
        return result is null ? Results.NotFound() : Results.Ok(result);
    }

    [HttpPost]
    public async Task<IResult> Create([FromBody] CreateUserCommand command)
    {
        var created = await mediator.Send(command);
        return Results.Created($"/api/users/{created.Id}", created);
    }
}


