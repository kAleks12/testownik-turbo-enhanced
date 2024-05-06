using System.Text.Json.Serialization;

namespace USOSConnector.Functions.Services.UsosService.Dtos;

public record UserTermsDto
{
    [JsonPropertyName("terms")]
    public required UserTermsTerm[] Terms { get; init; }
};

public record UserTermsTerm 
{
    [JsonPropertyName("id")]
    public required string Id { get; init; }

    [JsonPropertyName("name")]
    public required UserTermsName Name { get; init; }

    [JsonPropertyName("order_key")]
    public required long OrderKey { get; init; }

    [JsonPropertyName("start_date")]
    public required DateTimeOffset StartDate { get; init; }

    [JsonPropertyName("end_date")]
    public required DateTimeOffset EndDate { get; init; }
}

public record UserTermsName
{
    [JsonPropertyName("pl")]
    public required string Pl { get; init; }

    [JsonPropertyName("en")]
    public required string En { get; init; }
}