using System.Text.Json.Serialization;

namespace USOSConnector.Functions.Services.UsosService.Dtos;

public record UserCoursesDto
{
    [JsonPropertyName("course_editions")]
    public required Dictionary<string, UserCoursesCourseEditions[]> CourseEditions { get; init; }
};

public record UserCoursesCourseEditions
{
    [JsonPropertyName("course_id")]
    public required string CurseId { get; init; }

    [JsonPropertyName("course_name")]
    public required UserCoursesCourseName CourseName { get; init; }

    [JsonPropertyName("term_id")]
    public required string TermId { get; init; }

    [JsonPropertyName("user_groups")]   
    public required UserCoursesUserGroup[] UserGroups { get; init; }
}

public record UserCoursesCourseName
{
    [JsonPropertyName("pl")]
    public required string Pl { get; init; }

    [JsonPropertyName("en")]
    public required string En { get; init; }
}

public record UserCoursesUserGroup
{
    [JsonPropertyName("class_type")]
    public required UserCoursesClassType ClassType { get; init; }

    [JsonPropertyName("class_type_id")]
    public required string ClassTypeId { get; init; }

    [JsonPropertyName("course_fac_id")]
    public required string CourseFacId { get; init; }

    [JsonPropertyName("course_homepage_url")]
    public required string CourseHomepageUrl { get; init; }

    [JsonPropertyName("course_id")]
    public required string CourseId { get; init; }

    [JsonPropertyName("course_is_currently_conducted")]
    public required long CourseIsCurrentlyConducted { get; init; }

    [JsonPropertyName("course_lang_id")]
    public required string CourseLangId { get; init; }

    [JsonPropertyName("course_name")]
    public required UserCoursesCourseName CourseName { get; init; }

    [JsonPropertyName("course_profile_url")]
    public required string CourseProfileUrl { get; init; }

    [JsonPropertyName("course_unit_id")]
    public required string CourseUnitId { get; init; }

    [JsonPropertyName("group_number")]
    public required long GroupNumber { get; init; }

    [JsonPropertyName("group_url")]
    public required string? GroupUrl { get; init; }

    [JsonPropertyName("lecturers")]
    public required UserCoursesLecturer[] Lecturers { get; init; }

    [JsonPropertyName("participants")]
    public required UserCoursesParticipant[] Participants { get; init; }

    [JsonPropertyName("term_id")]
    public required string TermId { get; init; }
}

public record UserCoursesClassType
{
    [JsonPropertyName("pl")]
    public required string Pl { get; init; }

    [JsonPropertyName("en")]
    public required string En { get; init; }
}

public record UserCoursesLecturer
{
    [JsonPropertyName("first_name")]
    public required string FirstName { get; init; }

    [JsonPropertyName("last_name")]
    public required string LastName { get; init; }

    [JsonPropertyName("id")]
    public required string Id { get; init; }
}

public record UserCoursesParticipant
{
    [JsonPropertyName("first_name")]
    public required string FirstName { get; init; }

    [JsonPropertyName("last_name")]
    public required string LastName { get; init; }

    [JsonPropertyName("id")]
    public required string Id { get; init; }
}