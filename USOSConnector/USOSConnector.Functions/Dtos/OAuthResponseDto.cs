namespace USOSConnector.Functions.Dtos;

public record OAuthResponseDto
{
    public required string OAuthToken { get; init; }
    public required string OAuthTokenSecret { get; init; }
    public string? OAuthCallbackConfirmed { get; init; }
}