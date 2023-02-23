using System;
using System.Linq;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using API.Infrastructure.Auth;
using Newtonsoft.Json;

namespace Infrastructure {

    public static class Helpers {

        private static readonly Random _random = new();

        public static TokenRequest CreateLoginCredentials(string username, string password, string grantType = "password") {
            return new() {
                Username = username,
                Password = password,
                GrantType = grantType
            };
        }

        public static async Task<TokenResponse> Login(HttpClient httpClient, TokenRequest credentials) {
            HttpResponseMessage loginResponse = await httpClient.PostAsync("api/auth/auth", new StringContent(JsonConvert.SerializeObject(credentials), Encoding.UTF8, MediaTypeNames.Application.Json));
            string loginResponseContent = await loginResponse.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<TokenResponse>(loginResponseContent);
        }

        public static async Task Logout(HttpClient httpClient, string userId) {
            await httpClient.PostAsync("api/auth/logout", new StringContent(userId));
        }

        public static string CreateRandomString(int length) {
            return new string(Enumerable.Repeat("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", length).Select(s => s[_random.Next(s.Length)]).ToArray());
        }

        public static HttpRequestMessage CreateRequest(string baseUrl, string url, string userId = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx") {
            return new HttpRequestMessage {
                Method = HttpMethod.Get,
                RequestUri = new Uri(baseUrl + url),
                Content = new StringContent(userId)
            };
        }

    }

}