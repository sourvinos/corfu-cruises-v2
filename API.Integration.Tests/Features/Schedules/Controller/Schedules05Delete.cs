using Cases;
using Infrastructure;
using Responses;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace Schedules {

    [Collection("Sequence")]
    public class Schedules05Delete : IClassFixture<AppSettingsFixture> {

        #region variables

        private readonly AppSettingsFixture _appSettingsFixture;
        private readonly HttpClient _httpClient;
        private readonly TestHostFixture _testHostFixture = new();
        private readonly string _actionVerb = "delete";
        private readonly string _baseUrl;
        private readonly string _url = "/schedules/188";

        #endregion

        public Schedules05Delete(AppSettingsFixture appsettings) {
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
        public async Task Simple_Users_Can_Not_Delete() {
            await Forbidden.Action(_httpClient, _baseUrl, _url, _actionVerb, "simpleuser", "1234567890", null);
        }

        [Fact]
        public async Task Admins_Can_Delete() {
            await RecordDeleted.Action(_httpClient, _baseUrl, _url, "john", "ec11fc8c16db");
        }

    }

}