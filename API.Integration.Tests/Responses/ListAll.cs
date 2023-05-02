using System.Net.Http;
using System.Threading.Tasks;
using Infrastructure;

namespace Responses
{

    public static class ListAll {

        public static async Task<HttpResponseMessage> Action(HttpClient httpClient, string baseUrl, string url) {
            // arrange
            var request = Helpers.CreateRequest(baseUrl, url);
            // act
            var actionResponse = await httpClient.SendAsync(request);
            // return
            return actionResponse;
        }

    }

}
