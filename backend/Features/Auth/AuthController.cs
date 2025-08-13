using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Features.Auth;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("send-otp")]
    [AllowAnonymous]
    public async Task<IResult> SendOtp([FromBody] SendOtpCommand command)
    {
        await mediator.Send(command);
        return Results.NoContent();
    }

    [HttpPost("verify-otp")]
    [AllowAnonymous]
    public async Task<IResult> VerifyOtp([FromBody] VerifyOtpCommand command)
    {
        await mediator.Send(command);
        return Results.NoContent();
    }

    [HttpGet("me")]
    public async Task<IResult> Me()
    {
        var result = await mediator.Send(new MeQuery());
        return Results.Ok(result);
    }

    [HttpPost("logout")]
    public async Task<IResult> Logout()
    {
        await mediator.Send(new LogoutCommand());
        return Results.NoContent();
    }
}


