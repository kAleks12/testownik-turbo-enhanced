namespace USOSConnector.Functions.Triggers.Dtos;

public record CoursesResponseDto
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required DateTimeOffset StartDate { get; init; }
    public required DateTimeOffset EndDate { get; init; }
    public required CoursesResponseCourse[] Courses { get; init; }
}

public record CoursesResponseCourse
{
    public required string Id { get; init; }
    public required string Name { get; init; }
    public required string UsosUrl { get; init; }
    public required CoursesResponseGroup[] Groups { get; init; }
}

public record CoursesResponseGroup
{
    public required string Id { get; init; }
    public required string Type { get; init; }
    public required CoursesResponseLecturer Lecturer { get; init; }
}

public record CoursesResponseLecturer
{
    public required string Id { get; init; }
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
}