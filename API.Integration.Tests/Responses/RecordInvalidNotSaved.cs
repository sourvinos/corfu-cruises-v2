using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace Responses {

    public static class RecordInvalidNotSaved {

        public static async Task<HttpResponseMessage> Action<T>(HttpClient httpClient, string baseUrl, string url, string actionVerb, string username, string password, T record) {
            // arrange
            var loginResponse = await Helpers.Login(httpClient, Helpers.CreateLoginCredentials(username, password));
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(JwtBearerDefaults.AuthenticationScheme, loginResponse.Token);
            // act
            var actionResponse = new HttpResponseMessage();
            switch (actionVerb) {
                case "post":
                    actionResponse = await httpClient.PostAsync(baseUrl + url, new StringContent(System.Text.Json.JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
                    break;
                case "put":
                    actionResponse = await httpClient.PutAsync(baseUrl + url, new StringContent(System.Text.Json.JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
                    break;
                case "patch":
                    actionResponse = await httpClient.PatchAsync(baseUrl + url, new StringContent(System.Text.Json.JsonSerializer.Serialize(record), Encoding.UTF8, MediaTypeNames.Application.Json));
                    break;
            }
            // return
            return actionResponse;
        }

    }

}
