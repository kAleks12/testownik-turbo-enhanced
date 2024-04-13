namespace USOSConnector.Functions.Services.JwtService.Dtos;

public record UserClaimsDto
{
    public required string UserId { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required string UsosToken { get; init; }
}