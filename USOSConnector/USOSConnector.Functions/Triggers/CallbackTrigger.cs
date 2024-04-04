using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using USOSConnector.Functions.Constants;
using USOSConnector.Functions.Dtos;
using USOSConnector.Functions.Helpers;
using USOSConnector.Functions.Options;

namespace USOSConnector.Functions.Triggers;

public class CallbackTrigger
{
    private readonly IHttpClientFactory _clientFactory;
    private readonly IMemoryCache _cache;
    private readonly USOSOptions _options;
    private readonly ILogger<CallbackTrigger> _logger;

    public CallbackTrigger(
        IHttpClientFactory clientFactory,
        IMemoryCache cache,
        IOptions<USOSOptions> options,
        ILogger<CallbackTrigger> logger)
    {
        _clientFactory = clientFactory;
        _cache = cache;
        _options = options.Value;
        _logger = logger;
    }

    [Function(nameof(CallbackTrigger))]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "callback")] 
        HttpRequestData req)
    {
        var token = req.Query["oauth_token"];
        ArgumentNullException.ThrowIfNull(token, "oauth_token");

        var verifier = req.Query["oauth_verifier"];
        ArgumentNullException.ThrowIfNull(verifier, "oauth_verifier");

        var (consumerKey, consumerSecret, _, _, _, accessTokenUrl) = _options;

        var parsedResult = _cache.Get<OAuthResponseDto>(CacheKeys.TokenResult);
        ArgumentNullException.ThrowIfNull(parsedResult);

        var query = new Dictionary<string, string>
        {
            ["oauth_consumer_key"] = consumerKey,
            ["oauth_nonce"] = Guid.NewGuid().ToString(),
            ["oauth_timestamp"] = DateTimeOffset.Now.ToUnixTimeSeconds().ToString(),
            ["oauth_signature_method"] = "HMAC-SHA1",
            ["oauth_token"] = token,
            ["oauth_version"] = "1.0",
            ["oauth_verifier"] = verifier,
        };

        var key = consumerSecret + "&" + parsedResult.OAuthTokenSecret;
        query["oauth_signature"] = OAuthHelper.GetSignature(query, accessTokenUrl, key);

        var accessTokenUri = accessTokenUrl + "?" + string.Join("&", query.OrderBy(x => x.Key).Select(x => $"{x.Key}={x.Value}"));

        var client = _clientFactory.CreateClient(HttpClientNames.USOS);

        var response = await client.GetAsync(accessTokenUri);

        var result = await response.Content.ReadAsStringAsync();

        var parts = result.Split('&')
            .Select(x => x.Split('='))
            .ToDictionary(x => x[0], x => x[1]);

        var accessTokenResult = new OAuthResponseDto
        {
            OAuthToken = parts["oauth_token"],
            OAuthTokenSecret = parts["oauth_token_secret"],
        };

        var okResponse = req.CreateResponse(HttpStatusCode.OK);

        await okResponse.WriteAsJsonAsync(accessTokenResult);

        return okResponse;
    }
}