using System.ComponentModel.DataAnnotations;

namespace USOSConnector.Functions.Options;

public record USOSOptions
{
    public const string SectionName = "USOS";

    [Required]
    public string ConsumerKey { get; init; } = default!;
    [Required]
    public string ConsumerSecret { get; init; } = default!;
    [Required]
    public string CallbackUrl { get; init; } = default!;
    [Required]
    public string ApiUrl { get; init; } = default!;

    public void Deconstruct(
        out string consumerKey, 
        out string consumerSecret, 
        out string callbackUrl, 
        out string apiUrl)
    {
        consumerKey = ConsumerKey;
        consumerSecret = ConsumerSecret;
        callbackUrl = CallbackUrl;
        apiUrl = ApiUrl;
    }
}