using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using API.Features.Embarkation;
using Cases;
using Infrastructure;
using Responses;
using Xunit;

namespace Embarkation {

    [Collection("Sequence")]
    public class Passengers01Get : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "get";
        private readonly string _baseUrl;
        private readonly string _url = "/embarkation/date/2022-06-04/destinationId/all/portId/all/shipId/all";
        private readonly string _urlForDestination = "/embarkation/date/2022-06-04/destinationId/1/portId/all/shipId/all";
        private readonly string _urlForPort = "/embarkation/date/2022-06-04/destinationId/all/portId/1/shipId/all";
        private readonly string _urlForShip = "/embarkation/date/2022-06-04/destinationId/all/portId/all/shipId/6";

        #endregion

        public Passengers01Get(AppSettingsFixture appsettings) {
            _appSettingsFixture = appsettings;
            _baseUrl = _appSettingsFixture.Configuration.GetSection("TestingEnvironment").GetSection("BaseUrl").Value;
            _httpClient = _testHostFixture.Client;
        }

        [Fact]
        public async Task Unauthorized_Not_Logged_In() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "", "", null);
        }

        [Fact]
        public async Task Unauthorized_Invalid_Credentials() {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, "user-does-not-exist", "not-a-valid-password", null);
        }

        [Theory]
        [ClassData(typeof(InactiveUsersCanNotLogin))]
        public async Task Unauthorized_Inactive_Users(Login login) {
            await InvalidCredentials.Action(_httpClient, _baseUrl, _url, _actionVerb, login.Username, login.Password, null);
        }

        [Fact]
        public async Task Simple_Users_Can_Not_List() {
            await Forbidden.Action(_httpClient, _baseUrl, _url, _actionVerb, "simpleuser", "1234567890", null);
        }

        [Fact]
        public async Task Admins_Can_List() {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _url, "john", "ec11fc8c16da");
            var records = JsonSerializer.Deserialize<EmbarkationFinalGroupVM>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(178, records.TotalPersons);
            Assert.Equal(160, records.EmbarkedPassengers);
            Assert.Equal(18, records.PendingPersons);
        }

        [Fact]
        public async Task Admins_Can_List_For_Destination() {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _urlForDestination, "john", "ec11fc8c16da");
            var records = JsonSerializer.Deserialize<EmbarkationFinalGroupVM>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(82, records.TotalPersons);
            Assert.Equal(72, records.EmbarkedPassengers);
            Assert.Equal(10, records.PendingPersons);
        }

        [Fact]
        public async Task Admins_Can_List_For_Port() {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _urlForPort, "john", "ec11fc8c16da");
            var records = JsonSerializer.Deserialize<EmbarkationFinalGroupVM>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(101, records.TotalPersons);
            Assert.Equal(90, records.EmbarkedPassengers);
            Assert.Equal(11, records.PendingPersons);
        }

        [Fact]
        public async Task Admins_Can_List_For_Ship() {
            var actionResponse = await List.Action(_httpClient, _baseUrl, _urlForShip, "john", "ec11fc8c16da");
            var records = JsonSerializer.Deserialize<EmbarkationFinalGroupVM>(await actionResponse.Content.ReadAsStringAsync(), new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
            Assert.Equal(164, records.TotalPersons);
            Assert.Equal(148, records.EmbarkedPassengers);
            Assert.Equal(16, records.PendingPersons);
        }

    }

}