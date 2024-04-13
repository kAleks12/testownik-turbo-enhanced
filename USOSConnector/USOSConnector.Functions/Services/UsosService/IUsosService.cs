using USOSConnector.Functions.Dtos;

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

    // TODO Parse the response
    Task<string> GetUserCoursesAsync(
        string token, 
        string secret, 
        CancellationToken cancellationToken);

    Task<UserInfoDto> GetCurrentUserAsync(
        string token, 
        string secret, 
        CancellationToken cancellationToken);
}