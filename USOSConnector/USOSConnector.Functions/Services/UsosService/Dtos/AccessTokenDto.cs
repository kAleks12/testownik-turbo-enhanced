namespace USOSConnector.Functions.Dtos;

public record AccessTokenDto
{
    public required string Token { get; init; }
    public required string Secret { get; init; }
}