using System.Text.Json.Serialization;

namespace USOSConnector.Functions.Dtos;

public record UserInfoDto
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("first_name")]
    public required string FirstName { get; init; }
    
    [JsonPropertyName("last_name")]
    public required string LastName { get; init; }
}