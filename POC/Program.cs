using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();
builder.Services.AddMemoryCache();
builder.Services.AddOptionsWithValidateOnStart<OAuthOptions>()
    .BindConfiguration("USOS")
    .ValidateDataAnnotations();

var app = builder.Build();

app.MapGet("/", () => "Hello World!");

app.MapGet("/auth", async (
    [FromServices] IHttpClientFactory clientFactory,
    [FromServices] IMemoryCache cache,
    [FromServices] IOptions<OAuthOptions> options) =>
{
    var (consumerKey, consumerSecret, callbackUrl, requestTokenUrl, authorizeUrl, _) = options.Value;

    var query = new Dictionary<string, string>
    {
        ["oauth_callback"] = Uri.EscapeDataString(callbackUrl),
        ["oauth_consumer_key"] = consumerKey,
        ["oauth_nonce"] = Guid.NewGuid().ToString(),
        ["oauth_timestamp"] = DateTimeOffset.Now.ToUnixTimeSeconds().ToString(),
        ["oauth_signature_method"] = "HMAC-SHA1",
        ["oauth_version"] = "1.0",
    };

    var key = consumerSecret + "&";
    query["oauth_signature"] = GetSignature(query, requestTokenUrl, key);

    var requestTokenUri = requestTokenUrl + "?" + string.Join("&", query.OrderBy(x => x.Key).Select(x => $"{x.Key}={x.Value}"));

    var client = clientFactory.CreateClient("USOS");

    var response = await client.GetAsync(requestTokenUri);

    var result = await response.Content.ReadAsStringAsync();

    var parts = result.Split('&')
        .Select(x => x.Split('='))
        .ToDictionary(x => x[0], x => x[1]);

    var requestTokenResult = new OAuthResponse
    {
        OAuthToken = parts["oauth_token"],
        OAuthTokenSecret = parts["oauth_token_secret"],
        OAuthCallbackConfirmed = parts["oauth_callback_confirmed"],
    };

    cache.Set("result", requestTokenResult);

    var authorizeUri = $"{authorizeUrl}?oauth_token={requestTokenResult.OAuthToken}";

    return Results.Redirect(authorizeUri);
});

app.MapGet("/callback", async (
    string oauth_token, 
    string oauth_verifier,
    [FromServices] IHttpClientFactory clientFactory,
    [FromServices] IMemoryCache cache,
    [FromServices] IOptions<OAuthOptions> options) =>
{
    var (consumerKey, consumerSecret, _, _, _, accessTokenUrl) = options.Value;

    var parsedResult = cache.Get<OAuthResponse>("result");
    ArgumentNullException.ThrowIfNull(parsedResult);

    var query = new Dictionary<string, string>
    {
        ["oauth_consumer_key"] = consumerKey,
        ["oauth_nonce"] = Guid.NewGuid().ToString(),
        ["oauth_timestamp"] = DateTimeOffset.Now.ToUnixTimeSeconds().ToString(),
        ["oauth_signature_method"] = "HMAC-SHA1",
        ["oauth_token"] = oauth_token,
        ["oauth_version"] = "1.0",
        ["oauth_verifier"] = oauth_verifier,
    };

    var key = consumerSecret + "&" + parsedResult.OAuthTokenSecret;
    query["oauth_signature"] = GetSignature(query, accessTokenUrl, key);

    var accessTokenUri = accessTokenUrl + "?" + string.Join("&", query.OrderBy(x => x.Key).Select(x => $"{x.Key}={x.Value}"));

    var client = clientFactory.CreateClient("USOS");

    var response = await client.GetAsync(accessTokenUri);

    var result = await response.Content.ReadAsStringAsync();

    var parts = result.Split('&')
        .Select(x => x.Split('='))
        .ToDictionary(x => x[0], x => x[1]);

    var accessTokenResult = new OAuthResponse
    {
        OAuthToken = parts["oauth_token"],
        OAuthTokenSecret = parts["oauth_token_secret"],
    };

    return Results.Ok(accessTokenResult);
});

app.Run();

string GetSignature(Dictionary<string, string> query, string url, string key)
{
    var joinedParams = string.Join("&", query.OrderBy(x => x.Key).Select(x => $"{x.Key}={x.Value}"));

    var signature = "GET&" + Uri.EscapeDataString(url) + "&" + Uri.EscapeDataString(joinedParams);

    var hash = new HMACSHA1(Encoding.UTF8.GetBytes(key))
        .ComputeHash(Encoding.UTF8.GetBytes(signature));

    return Convert.ToBase64String(hash);
}

record OAuthResponse
{
    public required string OAuthToken { get; init; }
    public required string OAuthTokenSecret { get; init; }
    public string? OAuthCallbackConfirmed { get; init; }
}

record OAuthOptions
{
    [Required]
    public string ConsumerKey { get; init; } = default!;
    [Required]
    public string ConsumerSecret { get; init; } = default!;
    [Required]
    public string CallbackUrl { get; init; } = default!;
    [Required]
    public string RequestTokenUrl { get; init; } = default!;
    [Required]
    public string AuthorizeUrl { get; init; } = default!;
    [Required]
    public string AccessTokenUrl { get; init; } = default!;

    public void Deconstruct(
        out string consumerKey, 
        out string consumerSecret, 
        out string callbackUrl, 
        out string requestTokenUrl, 
        out string authorizeUrl, 
        out string accessTokenUrl)
    {
        consumerKey = ConsumerKey;
        consumerSecret = ConsumerSecret;
        callbackUrl = CallbackUrl;
        requestTokenUrl = RequestTokenUrl;
        authorizeUrl = AuthorizeUrl;
        accessTokenUrl = AccessTokenUrl;
    }
}

