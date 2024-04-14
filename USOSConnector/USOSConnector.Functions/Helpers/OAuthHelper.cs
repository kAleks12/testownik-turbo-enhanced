using System.Security.Cryptography;
using System.Text;

namespace USOSConnector.Functions.Helpers;

public static class OAuthHelper
{
    public static string GetUri(string endpoint, string key, Dictionary<string, string> query)
    {
        var joinedParams = string.Join("&", query.OrderBy(x => x.Key).Select(x => $"{x.Key}={x.Value}"));

        var signature = "GET&" + Uri.EscapeDataString(endpoint) + "&" + Uri.EscapeDataString(joinedParams);

        var hash = new HMACSHA1(Encoding.UTF8.GetBytes(key))
            .ComputeHash(Encoding.UTF8.GetBytes(signature));

        query["oauth_signature"] = Uri.EscapeDataString(Convert.ToBase64String(hash));
        
        return endpoint + "?" + string.Join("&", query.OrderBy(x => x.Key).Select(x => $"{x.Key}={x.Value}"));
    }
}