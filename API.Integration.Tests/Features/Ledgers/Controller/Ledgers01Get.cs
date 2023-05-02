using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using API.Features.Ledger;
using Infrastructure;
using Responses;
using Xunit;

namespace Ledgers {

    [Collection("Sequence")]
    public class Ledgers : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "get";
        private readonly string _baseUrl;
        private readonly string _adminUrl = "/ledgers?fromDate=2023-04-26&toDate=2023-04-26&destinationId=1&portId=1&portId=2&shipId=6";
        private readonly string _simpleUserUrl = "/ledgers?fromDate=2023-04-26&toDate=2023-04-26&destinationId=1&portId=1&portId=2&shipId=6";

        #endregion

        public Ledgers(AppSettingsFixture appsettings) {
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
            var actionResponse = await List.Action(_httpClient, _baseUrl, _simpleUserUrl, "simpleuser", "1234567890");
            var records = JsonSerializer.Deserialize<IEnumerable<LedgerVM>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Single(records.Select(x => x.Customer));
        }

        [Fact]
        public async Task Admins_Can_List() {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _adminUrl, "john", "ec11fc8c16db");
            var records = JsonSerializer.Deserialize<List<LedgerVM>>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(26, records.Select(x => x.Customer).Count());
        }

    }

}