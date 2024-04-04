using System.Security.Cryptography;
using System.Text;

namespace USOSConnector.Functions.Helpers;

public static class OAuthHelper
{
    public static string GetSignature(
        Dictionary<string, string> query, 
        string url, 
        string key)
    {
        var joinedParams = string.Join("&", query.OrderBy(x => x.Key).Select(x => $"{x.Key}={x.Value}"));

        var signature = "GET&" + Uri.EscapeDataString(url) + "&" + Uri.EscapeDataString(joinedParams);

        var hash = new HMACSHA1(Encoding.UTF8.GetBytes(key))
            .ComputeHash(Encoding.UTF8.GetBytes(signature));

        return Convert.ToBase64String(hash);
    }
}