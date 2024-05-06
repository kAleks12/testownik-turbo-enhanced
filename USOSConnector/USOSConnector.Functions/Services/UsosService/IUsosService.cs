using USOSConnector.Functions.Dtos;
using USOSConnector.Functions.Services.UsosService.Dtos;

namespace USOSConnector.Functions.Services.UsosService;

public interface IUsosService
{
    Task<RequestTokenDto> GetRequestTokenAsync(
        string? clientUrl = null,
        string? callbackKey = null, 
        string callbackKeyName = "key",
        CancellationToken cancellationToken = default);

    Task<AccessTokenDto> GetAccessTokenAsync(
        string token, 
        string verifier, 
        string secret, 
        CancellationToken cancellationToken);

    Task<UserCoursesDto> GetCurrentUserCoursesAsync(
        string token, 
        string secret, 
        CancellationToken cancellationToken);

    Task<UserTermsDto> GetCurrentUserTermsAsync(
        string token, 
        string secret, 
        CancellationToken cancellationToken);

    Task<UserInfoDto> GetCurrentUserInfoAsync(
        string token, 
        string secret, 
        CancellationToken cancellationToken);
}