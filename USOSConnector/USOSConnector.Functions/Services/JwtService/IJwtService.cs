using USOSConnector.Functions.Services.JwtService.Dtos;

namespace USOSConnector.Functions.Services.JwtService;

public interface IJwtService
{
    bool IsTokenValid(string token);
    string GenerateToken(UserClaimsDto userClaims);
    UserClaimsDto GetUserClaims(string token);
}