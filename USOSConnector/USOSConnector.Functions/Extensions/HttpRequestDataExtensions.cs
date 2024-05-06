using System.Net;
using System.Security.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker.Http;

namespace USOSConnector.Functions.Extensions;

public static class HttpRequestDataExtensions
{
    public static async Task<HttpResponseData> CreateProblemResponseAsync(
        this HttpRequestData req,
        HttpStatusCode statusCode,
        string detail)
    {
        var response = req.CreateResponse(statusCode);
        await response.WriteAsJsonAsync(new ProblemDetails
        {
            Title = statusCode.ToString(),
            Detail = detail
        });

        return response;
    }

    public static async Task<HttpResponseData> CreateOkResponseAsync<T>(
        this HttpRequestData req,
        T content)
    {
        var response = req.CreateResponse(HttpStatusCode.OK);
        await response.WriteAsJsonAsync(content);

        return response;
    }

    public static string GetBearerToken(this HttpRequestData req)
    {
        if (!req.Headers.TryGetValues("Authorization", out var authHeaders) || authHeaders is null)
        {
            throw new InvalidCredentialException("Authorization header is missing.");
        }

        var headerParts = authHeaders.First().Split(" ");

        if (headerParts.Length != 2 || headerParts[0] != "Bearer")
        {
            throw new InvalidCredentialException("Invalid Authorization header.");
        }

        return headerParts[1];
    }
}