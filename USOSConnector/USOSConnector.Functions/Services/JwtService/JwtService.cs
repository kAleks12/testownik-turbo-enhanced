using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using USOSConnector.Functions.Constants;
using USOSConnector.Functions.Options;
using USOSConnector.Functions.Services.JwtService.Dtos;

namespace USOSConnector.Functions.Services.JwtService;

public class JwtService : IJwtService
{
    private readonly JwtOptions _options;

    public JwtService(IOptions<JwtOptions> options)
    {
        _options = options.Value;
    }

    public bool IsTokenValid(string token)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));

        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key
        };

        try
        {
            tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
        }
        catch
        {
            return false;
        }

        return true;
    }

    public string GenerateToken(UserClaimsDto userClaims)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.Key));

        var tokenHandler = new JwtSecurityTokenHandler();

        var claims = new[]
        {
            new Claim(CustomClaims.UsosId, userClaims.UserId),
            new Claim(CustomClaims.FirstName, userClaims.FirstName),
            new Claim(CustomClaims.LastName, userClaims.LastName),
            new Claim(CustomClaims.UsosToken, userClaims.UsosToken)
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(_options.ExpiryMinutes),
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }

    public UserClaimsDto GetUserClaims(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();

        if (tokenHandler.ReadToken(token) is not JwtSecurityToken securityToken)
        {
            throw new SecurityTokenException("Invalid token.");
        }

        return new UserClaimsDto
        {
            UserId = securityToken.Claims.First(x => x.Type == CustomClaims.UsosId).Value,
            FirstName = securityToken.Claims.First(x => x.Type == CustomClaims.FirstName).Value,
            LastName = securityToken.Claims.First(x => x.Type == CustomClaims.LastName).Value,
            UsosToken = securityToken.Claims.First(x => x.Type == CustomClaims.UsosToken).Value
        };
    }
}