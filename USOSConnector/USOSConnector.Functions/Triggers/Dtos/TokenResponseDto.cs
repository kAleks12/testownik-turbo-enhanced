namespace USOSConnector.Functions.Triggers.Dtos;

public record TokenResponseDto
{
    public required string Token { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
}