namespace USOSConnector.Functions.Constants;

public static class Usos
{
    public const int AccessTokenExpiryMinutes = 120;

    public static class Endpoints
    {
        public const string RequestToken = "/services/oauth/request_token";
        public const string AccessToken = "/services/oauth/access_token";
        public const string Authorize = "/services/oauth/authorize";
        public const string UserCourses = "/services/courses/user";
        public const string UserInfo = "/services/users/user";
    }
}