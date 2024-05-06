using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using USOSConnector.Functions.Attributes;
using USOSConnector.Functions.Extensions;
using USOSConnector.Functions.Options;
using USOSConnector.Functions.Services.JwtService;
using USOSConnector.Functions.Services.UsosService;
using USOSConnector.Functions.Services.UsosService.Dtos;
using USOSConnector.Functions.Triggers.Dtos;

namespace USOSConnector.Functions.Triggers;

public class CoursesTrigger
{
    private readonly IMemoryCache _cache;
    private readonly IUsosService _usosService;
    private readonly IJwtService _jwtService;
    private readonly TimeProvider _timeProvider;
    private readonly USOSOptions _options;

    public CoursesTrigger(
        IMemoryCache cache,
        IUsosService usosService,
        IJwtService jwtService,
        TimeProvider timeProvider,
        IOptions<USOSOptions> options)
    {
        _cache = cache;
        _usosService = usosService;
        _jwtService = jwtService;
        _timeProvider = timeProvider;
        _options = options.Value;
    }

    [JwtAuthorize]
    [Function(nameof(Courses))]
    public async Task<HttpResponseData> Courses(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "courses")] 
        HttpRequestData req,
        CancellationToken cancellationToken)
    {
        var bearerToken = req.GetBearerToken();

        var userClaims = _jwtService.GetUserClaims(bearerToken);

        var tokenSecret = _cache.Get<string>(userClaims.UserId);

        if (string.IsNullOrEmpty(tokenSecret))
        {
            // Token is cached as long as it is valid
            return await req.CreateProblemResponseAsync(
                HttpStatusCode.Unauthorized,
                "Expired user token.");
        }

        var termsResult = await _usosService.GetCurrentUserTermsAsync(
            userClaims.UsosToken,
            tokenSecret,
            cancellationToken);

        var coursesResult = await _usosService.GetCurrentUserCoursesAsync(
            userClaims.UsosToken,
            tokenSecret,
            cancellationToken);

        var currentDate = _timeProvider.GetUtcNow();
        var response = termsResult.Terms
            .Where(t => t.StartDate <= currentDate && t.EndDate >= currentDate)
            .OrderByDescending(t => t.EndDate)
            .Select(t => MapToCourseDto(t, coursesResult.CourseEditions[t.Id]))
            .FirstOrDefault();

        if (response is null)
        {
            response = termsResult.Terms
                .Where(t => t.EndDate < currentDate)
                .OrderByDescending(t => t.EndDate)
                .Select(t => MapToCourseDto(t, coursesResult.CourseEditions[t.Id]))
                .FirstOrDefault();
        }

        return await req.CreateOkResponseAsync(response);
    }

    private static CoursesResponseDto MapToCourseDto(
        UserTermsTerm t, 
        UserCoursesCourseEditions[] courseEditions) => new CoursesResponseDto
        {
            Id = t.Id,
            Name = t.Name.Pl,
            StartDate = t.StartDate,
            EndDate = t.EndDate,
            Courses = courseEditions.Select(c => new CoursesResponseCourse
                {
                    Id = c.CurseId,
                    Name = c.CourseName.Pl,
                    UsosUrl = c.UserGroups.First().CourseProfileUrl,
                    Groups = c.UserGroups
                        .Select(g => new CoursesResponseGroup
                        {
                            Id = g.CourseUnitId,
                            Type = g.ClassTypeId,
                            Lecturer = new CoursesResponseLecturer
                            {
                                Id = g.Lecturers.First().Id,
                                FirstName = g.Lecturers.First().FirstName,
                                LastName = g.Lecturers.First().LastName
                            }
                        }).ToArray()
                }).ToArray()
        };
}