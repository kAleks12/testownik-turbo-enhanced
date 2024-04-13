namespace USOSConnector.Functions.Dtos;

public record RequestTokenDto
{
    public required string Secret { get; init; }
    public required string RedirectUri { get; init; }
}