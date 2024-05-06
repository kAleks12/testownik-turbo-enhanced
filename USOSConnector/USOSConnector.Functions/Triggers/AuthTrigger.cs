using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using USOSConnector.Functions.Options;
using USOSConnector.Functions.Services.UsosService;

namespace USOSConnector.Functions.Triggers;

public class AuthTrigger
{
    private readonly IMemoryCache _cache;
    private readonly IUsosService _usosService;
    private readonly USOSOptions _options;

    public AuthTrigger(
        IMemoryCache cache,
        IUsosService usosService,
        IOptions<USOSOptions> options)
    {
        _cache = cache;
        _usosService = usosService;
        _options = options.Value;
    }

    [Function(nameof(Authorize))]
    public async Task<HttpResponseData> Authorize(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "auth")] 
        HttpRequestData req,
        CancellationToken cancellationToken)
    {
        var callbackUrl = req.Query["callback_url"];

        var cacheKey = Guid.NewGuid().ToString();

        var requestTokenResult = await _usosService.GetRequestTokenAsync(
            callbackUrl,
            cacheKey, 
            cancellationToken: cancellationToken);

        _cache.Set(cacheKey, requestTokenResult.Secret, TimeSpan.FromMinutes(5));

        var redirectResponse = req.CreateResponse(HttpStatusCode.Redirect);
        redirectResponse.Headers.Add("Location", requestTokenResult.RedirectUri);

        return redirectResponse;
    }
}