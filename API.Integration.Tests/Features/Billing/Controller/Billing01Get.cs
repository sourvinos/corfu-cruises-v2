using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using API.Features.Billing;
using Infrastructure;
using Responses;
using Xunit;

namespace Billing {

    [Collection("Sequence")]
    public class Billing : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "get";
        private readonly string _baseUrl;
        private readonly string _adminUrl = "/billing/fromdate/2022-05-07/todate/2022-05-07/customerId/all/destinationId/all/shipId/all";
        private readonly string _simpleUserUrl = "/billing/fromdate/2022-05-07/todate/2022-05-07/customerId/2/destinationId/all/shipId/all";

        #endregion

        public Billing(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _adminUrl, _actionVerb, "", "", null);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _adminUrl, _actionVerb, "user-does-not-exist", "not-a-valid-password", null);
        }

        [Fact]
        public async Task Simple_Users_Can_List_Only_Owned() {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _simpleUserUrl, "john", "ec11fc8c16da");
            var records = JsonSerializer.Deserialize<IEnumerable<BillingFinalVM>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(3, records.Select(x => x.Customer).Count());
        }

        [Fact]
        public async Task Admins_Can_List() {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _adminUrl, "john", "ec11fc8c16da");
            var records = JsonSerializer.Deserialize<IEnumerable<BillingFinalVM>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(46, records.Select(x => x.Customer).Count());
        }

    }

}