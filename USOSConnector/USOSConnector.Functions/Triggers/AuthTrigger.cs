using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using USOSConnector.Functions.Attributes;
using USOSConnector.Functions.Constants;
using USOSConnector.Functions.Dtos;
using USOSConnector.Functions.Helpers;
using USOSConnector.Functions.Options;

namespace USOSConnector.Functions.Triggers;

public class AuthTrigger
{
    private readonly IHttpClientFactory _clientFactory;
    private readonly IMemoryCache _cache;
    private readonly USOSOptions _options;
    private readonly ILogger<AuthTrigger> _logger;

    public AuthTrigger(
        IHttpClientFactory clientFactory,
        IMemoryCache cache,
        IOptions<USOSOptions> options,
        ILogger<AuthTrigger> logger)
    {
        _clientFactory = clientFactory;
        _cache = cache;
        _options = options.Value;
        _logger = logger;
    }

    // [JwtAuthorize] TODO Uncomment when backend ready
    [Function(nameof(AuthTrigger))]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "auth")] 
        HttpRequestData req,
        CancellationToken cancellationToken)
    {
        var (consumerKey, consumerSecret, callbackUrl, apiUrl) = _options;

        var query = new Dictionary<string, string>
        {
            ["oauth_callback"] = Uri.EscapeDataString(callbackUrl),
            ["oauth_consumer_key"] = consumerKey,
            ["oauth_nonce"] = Guid.NewGuid().ToString(),
            ["oauth_timestamp"] = DateTimeOffset.Now.ToUnixTimeSeconds().ToString(),
            ["oauth_signature_method"] = "HMAC-SHA1",
            ["oauth_version"] = "1.0",
        };

        var requestTokenUrl = apiUrl + UsosEndpoints.RequestToken;
        var key = consumerSecret + "&";
        query["oauth_signature"] = OAuthHelper.GetSignature(query, requestTokenUrl, key);

        var requestTokenUri = requestTokenUrl + "?" + 
            string.Join("&", query.OrderBy(x => x.Key).Select(x => $"{x.Key}={x.Value}"));

        var client = _clientFactory.CreateClient(HttpClientNames.USOS);

        var response = await client.GetAsync(requestTokenUri, cancellationToken);

        var result = await response.Content.ReadAsStringAsync(cancellationToken);

        var parts = result.Split('&')
            .Select(x => x.Split('='))
            .ToDictionary(x => x[0], x => x[1]);

        var requestTokenResult = new OAuthResponseDto
        {
            OAuthToken = parts["oauth_token"],
            OAuthTokenSecret = parts["oauth_token_secret"],
            OAuthCallbackConfirmed = parts["oauth_callback_confirmed"],
        };

        _cache.Set(CacheKeys.TokenResult, requestTokenResult);

        var authorizeUri = $"{apiUrl}{UsosEndpoints.Authorize}?oauth_token={requestTokenResult.OAuthToken}";

        var redirectResponse = req.CreateResponse(HttpStatusCode.Redirect);
        redirectResponse.Headers.Add("Location", authorizeUri);

        return redirectResponse;
    }
}