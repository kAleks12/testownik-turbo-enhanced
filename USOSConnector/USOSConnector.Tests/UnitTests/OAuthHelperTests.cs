using USOSConnector.Functions.Helpers;

namespace USOSConnector.Tests.UnitTests;

public class OAuthHelperTests
{
    [Fact]
    public void GetSignature_ShouldReturnCorrectSignature()
    {
        // Arrange
        var query = new Dictionary<string, string>
        {
            ["oauth_callback"] = "http://localhost:7071/api/auth",
            ["oauth_consumer_key"] = "key",
            ["oauth_nonce"] = "nonce",
            ["oauth_timestamp"] = "timestamp",
            ["oauth_signature_method"] = "HMAC-SHA1",
            ["oauth_version"] = "1.0",
        };

        var url = "http://localhost:7071/api/auth";
        var key = "secret&";
        var expected = "bUpeJ3QUx7XHSJN0gSe8FpHKsU0=";

        // Act
        var actual = OAuthHelper.GetSignature(query, url, key);

        // Assert
        Assert.Equal(expected, actual);
    }
}