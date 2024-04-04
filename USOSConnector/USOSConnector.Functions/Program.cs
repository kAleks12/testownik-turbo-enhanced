using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using USOSConnector.Functions.Extensions;
using USOSConnector.Functions.Options;
using USOSConnector.Middleware;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults(builder =>
    {
        builder.UseMiddleware<JwtAuthorizationMiddleware>();
    })
    .ConfigureServices(services =>
    {
        services.AddOptionsWithValidation<USOSOptions>(USOSOptions.SectionName);
        services.AddOptionsWithValidation<JwtOptions>(JwtOptions.SectionName);
        services.AddHttpClient();
        services.AddMemoryCache();
    })
    .Build();

host.Run();
