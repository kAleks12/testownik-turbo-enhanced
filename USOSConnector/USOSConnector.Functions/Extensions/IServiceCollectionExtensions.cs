using Microsoft.Extensions.DependencyInjection;

namespace USOSConnector.Functions.Extensions;

public static class IServiceCollectionExtensions
{
    public static IServiceCollection AddOptionsWithValidation<T>(
        this IServiceCollection services, 
        string sectionName)
        where T : class
    {
        services.AddOptions<T>()
            .BindConfiguration(sectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();
        
        return services;
    }
}