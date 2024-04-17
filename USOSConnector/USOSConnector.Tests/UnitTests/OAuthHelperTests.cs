using USOSConnector.Functions.Helpers;

namespace USOSConnector.Tests.UnitTests;

public class OAuthHelperTests
{
    [Fact]
    public void GetUri_ShouldReturnCorrectUri()
    {
        // Arrange
        var query = new Dictionary<string, string>
        {
            ["oauth_callback"] = "http://sample.com/callback",
            ["oauth_consumer_key"] = "key",
            ["oauth_nonce"] = "nonce",
            ["oauth_timestamp"] = "timestamp",
            ["oauth_signature_method"] = "HMAC-SHA1",
            ["oauth_version"] = "1.0",
        };

        var endpoint = "http://endpoint.com";
        var key = "secret&";
        var expected = "http://endpoint.com?oauth_callback=http://sample.com/callback&oauth_consumer_key=key&oauth_nonce=nonce&oauth_signature=8R7hlKGpKxmJdRjWTPBmsNheQJ8%3D&oauth_signature_method=HMAC-SHA1&oauth_timestamp=timestamp&oauth_version=1.0";
        
        // Act
        var actual = OAuthHelper.GetUri(endpoint, key, query);

        // Assert
        Assert.Equal(expected, actual);
    }
}