namespace DicrtionaryAPI.Infrastructure.External.Google
{
    public class GoogleAuthService
    {
        public async Task<GoogleUserInfo> GetGoogleUserInfoAsync(string accessToken, CancellationToken ct)
        {
            using var httpClient = new HttpClient();

            var request = new HttpRequestMessage(HttpMethod.Get, "https://www.googleapis.com/oauth2/v3/userinfo");
            request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

            var response = await httpClient.SendAsync(request, ct);

            if (!response.IsSuccessStatusCode)
                throw new Exception("Помилка під час перевірки Google токена");

            var content = await response.Content.ReadAsStringAsync(ct);
            var userInfo = System.Text.Json.JsonSerializer.Deserialize<GoogleUserInfo>(content, new System.Text.Json.JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            return userInfo!;
        }
    }
}
