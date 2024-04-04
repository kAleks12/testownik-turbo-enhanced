using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Reflection;
using System.Text;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.Functions.Worker.Middleware;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using USOSConnector.Functions.Attributes;
using USOSConnector.Functions.Options;

namespace USOSConnector.Middleware;

public class JwtAuthorizationMiddleware : IFunctionsWorkerMiddleware
{
    private readonly JwtSecurityTokenHandler _tokenValidator;
    private readonly TokenValidationParameters _tokenValidationParameters;

    public JwtAuthorizationMiddleware(IOptions<JwtOptions> options)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(options.Value.Key));

        _tokenValidator = new JwtSecurityTokenHandler();
        _tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key
        };
    }
    
    public async Task Invoke(FunctionContext context, FunctionExecutionDelegate next)
    {
        var targetMethod = GetTargetFunctionMethod(context);
        var attributes = GetFunctionMethodAttribute<JwtAuthorizeAttribute>(targetMethod);
        
        if (attributes.Count() > 0)
        {
            var requestData = await context.GetHttpRequestDataAsync();
            if (requestData is not null && !IsRequestAuthorized(requestData, out var errorResponse))
            {
                SetHttpResult(context, errorResponse);
                return;
            }

            await next(context);
        }
        else
        {
            await next(context);
        }
    }

    private bool IsRequestAuthorized(HttpRequestData request, out HttpResponseData errorResponse)
    {

        if (!request.Headers.TryGetValues("Authorization", out var authHeaders))
        {
            var response = request.CreateResponse(HttpStatusCode.Unauthorized);
            response.WriteString("Authorization header is missing.");
            errorResponse = response;
            return false;
        }

        try
        {
            ArgumentNullException.ThrowIfNull(authHeaders);

            var token = authHeaders.First().Split(" ").Last();

            _tokenValidator.ValidateToken(token, _tokenValidationParameters, out SecurityToken validatedToken);

            errorResponse = request.CreateResponse(HttpStatusCode.OK);
            return true;
        }
        catch
        {
            var response = request.CreateResponse(HttpStatusCode.Unauthorized);
            response.WriteString("Invalid token.");
            errorResponse = response;
            return false;
        }
    }

    private static IEnumerable<T> GetFunctionMethodAttribute<T>(MethodInfo? targetMethod) 
        where T : Attribute
    {
        if (targetMethod is null) 
            return Enumerable.Empty<T>();

        var methodAttributes = targetMethod.GetCustomAttributes<T>();
        var classAttributes = targetMethod.DeclaringType?.GetCustomAttributes<T>();
        return [..methodAttributes, ..classAttributes];
    }

    private static MethodInfo? GetTargetFunctionMethod(FunctionContext context)
    {
        var assemblyPath = context.FunctionDefinition.PathToAssembly;
        var assembly = Assembly.LoadFrom(assemblyPath);
        var typeName = context.FunctionDefinition
            .EntryPoint.Substring(0, context.FunctionDefinition.EntryPoint.LastIndexOf('.'));
        var type = assembly.GetType(typeName);
        var methodName = context.FunctionDefinition
            .EntryPoint.Substring(context.FunctionDefinition.EntryPoint.LastIndexOf('.') + 1);
        var method = type?.GetMethod(methodName);
        return method;
    }

    private static void SetHttpResult(FunctionContext context, HttpResponseData responseData)
    {
        var httpOutputBinding = context.GetOutputBindings<HttpResponseData>()
            .FirstOrDefault(b => b.BindingType == "http" && b.Name != "$return");

        if (httpOutputBinding is null)
        {
            context.GetInvocationResult().Value = responseData;
            return;
        }

        httpOutputBinding.Value = responseData;
    }
}