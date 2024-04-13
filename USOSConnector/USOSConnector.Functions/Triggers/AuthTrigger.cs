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
    private readonly ILogger<AuthTrigger> _logger;

    public AuthTrigger(
        IMemoryCache cache,
        IUsosService usosService,
        IOptions<USOSOptions> options,
        ILogger<AuthTrigger> logger)
    {
        _cache = cache;
        _usosService = usosService;
        _options = options.Value;
        _logger = logger;
    }

    [Function(nameof(AuthTrigger))]
    public async Task<HttpResponseData> Run(
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