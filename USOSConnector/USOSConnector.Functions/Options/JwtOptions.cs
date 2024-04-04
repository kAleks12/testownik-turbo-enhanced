using System.ComponentModel.DataAnnotations;

namespace USOSConnector.Functions.Options;

public class JwtOptions
{
    public const string SectionName = "Jwt";

    [Required]
    public string Key { get; set; } = default!;
}